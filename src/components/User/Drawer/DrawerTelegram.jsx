'use client';

import { useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Unlink,
  Link2,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import DrawerPanel from '@/components/_shared/DrawerPanel';

const DrawerTelegram = ({
  open,
  onClose,
  onStartConnect,
  onCheckConnect,
  onSendTest,
  onDisconnect,
  isConnected,
  isBusy,
  chatId,
  username,
}) => {
  const [alertMsg, setAlertMsg] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleStart = async () => {
    setAlertMsg(null);
    const result = await onStartConnect();
    if (!result?.ok) {
      setAlertMsg({
        type: 'error',
        text: result?.error || 'Gagal membuka koneksi Telegram.',
      });
      return;
    }
    setAlertMsg({
      type: 'success',
      text: 'Bot Telegram dibuka. Klik Start di Telegram lalu kembali ke aplikasi.',
    });
  };

  const handleCheck = async () => {
    setAlertMsg(null);
    const result = await onCheckConnect();
    if (!result?.ok) {
      setAlertMsg({
        type: 'error',
        text: result?.error || 'Belum terhubung. Pastikan sudah klik Start di bot.',
      });
      return;
    }
    setAlertMsg({
      type: 'success',
      text: 'Telegram berhasil terhubung.',
    });
  };

  const handleTest = async () => {
    setAlertMsg(null);
    setTesting(true);
    const result = await onSendTest();
    setTesting(false);
    if (!result?.ok) {
      setAlertMsg({
        type: 'error',
        text: result?.error || 'Gagal kirim pesan test.',
      });
      return;
    }
    setAlertMsg({
      type: 'success',
      text: 'Pesan test berhasil dikirim.',
    });
  };

  return (
    <DrawerPanel
      open={open}
      onClose={onClose}
      title='Connect Telegram'
      icon={Send}
      titleColor='text-sky-600 dark:text-sky-400'
      hideFooterButton
    >
      <p className='text-slate-500 dark:text-slate-400'>
        Hubungkan bot Telegram agar semua notifikasi aplikasi otomatis diteruskan
        ke chat Telegram kamu.
      </p>

      <div className='space-y-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3'>
        <p className='text-xs text-slate-500 dark:text-slate-400'>
          Langkah:
        </p>
        <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>
          1. Klik <strong>Hubungkan Otomatis</strong>
        </p>
        <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>
          2. Di Telegram, klik <strong>Start</strong> pada bot
        </p>
        <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>
          3. Kembali ke app lalu klik <strong>Cek Status</strong>
        </p>
      </div>

      {isConnected && (
        <div className='p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30'>
          <p className='text-xs text-emerald-700 dark:text-emerald-300 font-bold mb-1'>
            Telegram Tersambung
          </p>
          <p className='text-sm text-emerald-700 dark:text-emerald-300'>
            Chat ID: <strong>{chatId}</strong>
          </p>
          {username && (
            <p className='text-sm text-emerald-700 dark:text-emerald-300'>
              Username: <strong>@{username}</strong>
            </p>
          )}
        </div>
      )}

      {alertMsg && (
        <div
          className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium border ${
            alertMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
          }`}
        >
          {alertMsg.type === 'success' ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {alertMsg.text}
        </div>
      )}

      {!isConnected && (
        <div className='grid grid-cols-2 gap-2'>
          <button
            onClick={handleStart}
            disabled={isBusy}
            className='py-3 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
          >
            <Link2 size={16} />
            {isBusy ? 'Proses...' : 'Hubungkan Otomatis'}
          </button>

          <button
            onClick={handleCheck}
            disabled={isBusy}
            className='py-3 rounded-xl bg-[#1e3a8a] text-white font-bold hover:bg-[#172f72] transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
          >
            <RefreshCw size={16} />
            Cek Status
          </button>
        </div>
      )}

      <button
        onClick={handleTest}
        disabled={!isConnected || testing}
        className='w-full py-3 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-bold hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
      >
        <MessageCircle size={16} />
        {testing ? 'Testing...' : 'Kirim Pesan Test'}
      </button>

      {isConnected && (
        <button
          onClick={onDisconnect}
          className='w-full py-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors flex items-center justify-center gap-2'
        >
          <Unlink size={16} />
          Putuskan Telegram
        </button>
      )}
    </DrawerPanel>
  );
};

export default DrawerTelegram;
