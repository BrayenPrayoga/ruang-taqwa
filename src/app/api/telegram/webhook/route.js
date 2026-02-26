import { NextResponse } from 'next/server';
import { saveTelegramLink } from '@/lib/telegramLinkStore';

export async function POST(request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    if (!token) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const update = await request.json();
    const msg = update?.message || update?.channel_post;
    const text = msg?.text?.trim();

    if (!text || !text.startsWith('/start')) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const [, code] = text.split(/\s+/, 2);
    const chatId = msg?.chat?.id;
    const username = msg?.from?.username || msg?.chat?.username || '';

    if (code && chatId) {
      saveTelegramLink(code, { chatId: String(chatId), username });
    }

    if (chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'Koneksi awal diterima.\nSilakan kembali ke aplikasi MyRamadhan, lalu tekan tombol "Cek Status".',
        }),
        cache: 'no-store',
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}

