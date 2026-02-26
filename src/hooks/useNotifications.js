'use client';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import localforage from 'localforage';
import { getNotificationForDay } from '@/data/notificationsData';

/**
 * useNotifications — menyusun daftar notifikasi gabungan:
 *   1. Notifikasi statis berdasarkan hari Hijriah (dari notificationsData)
 *   2. Notifikasi dinamis waktu sholat (jika waktu sudah lewat)
 *
 * @param {boolean} mounted
 * @param {number}  hijriDay
 * @param {object|null} prayerTimes
 * @param {dayjs.Dayjs} currentTime
 *
 * @returns {{ notifications: array, hasUnreadNotif: boolean, markAsRead: Function }}
 */
const useNotifications = (mounted, hijriDay, prayerTimes, currentTime) => {
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotif, setHasUnreadNotif] = useState(false);

  useEffect(() => {
    if (!mounted) return;

    const dayNum = isNaN(hijriDay) ? 0 : hijriDay;
    const baseNotifs = getNotificationForDay(dayNum);
    let dynamicNotifs = [];

    if (prayerTimes) {
      const prayers = [
        { key: 'Subuh', label: 'Subuh' },
        { key: 'Dzuhur', label: 'Dzuhur' },
        { key: 'Ashar', label: 'Ashar' },
        { key: 'Maghrib', label: 'Maghrib' },
        { key: 'Isya', label: 'Isya' },
      ];

      prayers.forEach((p) => {
        const timeStr = prayerTimes[p.key];
        if (!timeStr) return;

        const [h, m] = timeStr.split(':').map(Number);
        const prayerMoment = dayjs().hour(h).minute(m).second(0);

        if (currentTime.isAfter(prayerMoment)) {
          dynamicNotifs.push({
            id: `prayer_${p.key}_${dayjs().format('YYYYMMDD')}`,
            day: dayNum,
            title: `Waktu ${p.label} Telah Tiba! 🕌`,
            message: `Udah masuk waktu ${p.label} nih! Jangan lupa sholat ya, dan catat di Tracker.`,
            type: 'prayer',
          });
        }
      });
    }

    setNotifications([...dynamicNotifs.reverse(), ...baseNotifs]);
  }, [mounted, prayerTimes, currentTime.hour(), hijriDay]);

  // Cek apakah ada notif baru yang belum dibaca
  useEffect(() => {
    const checkUnread = async () => {
      const lastReadRaw =
        (await localforage.getItem('myRamadhan_notifCount')) || '0';
      const lastReadCount = parseInt(lastReadRaw, 10);
      if (notifications.length > lastReadCount) {
        setHasUnreadNotif(true);
      }
    };

    checkUnread();
  }, [notifications]);

  // Auto-forward notifikasi ke Telegram jika user sudah connect
  useEffect(() => {
    const forwardToTelegram = async () => {
      if (!mounted || notifications.length === 0) return;

      const config = (await localforage.getItem('telegram_config')) || {};
      if (!config?.connected || !config?.chatId) return;

      const sentIds =
        (await localforage.getItem('telegram_sent_notifications')) || [];
      const sentSet = new Set(sentIds);

      for (const notif of notifications) {
        const notifId = notif?.id?.toString();
        if (!notifId || sentSet.has(notifId)) continue;

        try {
          const res = await fetch('/api/telegram/forward', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chatId: config.chatId,
              title: notif.title,
              message: notif.message,
            }),
          });

          const data = await res.json();
          if (!res.ok || !data?.ok) continue;

          sentSet.add(notifId);
        } catch {
          // silent fail: notifikasi aplikasi tetap berjalan walau telegram gagal
        }
      }

      await localforage.setItem(
        'telegram_sent_notifications',
        Array.from(sentSet),
      );
    };

    forwardToTelegram();
  }, [mounted, notifications]);

  const markAsRead = async () => {
    setHasUnreadNotif(false);
    await localforage.setItem(
      'myRamadhan_notifCount',
      notifications.length.toString(),
    );
  };

  return { notifications, hasUnreadNotif, markAsRead };
};

export default useNotifications;
