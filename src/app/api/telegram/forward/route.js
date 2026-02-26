import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'TELEGRAM_BOT_TOKEN belum di-set di server.' },
        { status: 500 },
      );
    }

    const body = await request.json();
    const chatId = body?.chatId?.toString().trim();
    const title = body?.title?.toString().trim() || 'Notifikasi';
    const message = body?.message?.toString().trim() || '';

    if (!chatId || !message) {
      return NextResponse.json(
        { ok: false, error: 'chatId dan message wajib diisi.' },
        { status: 400 },
      );
    }

    const text = `*${title}*\n${message}`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok || !data?.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: data?.description || 'Gagal kirim notifikasi ke Telegram.',
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || 'Terjadi kesalahan saat forward notifikasi.',
      },
      { status: 500 },
    );
  }
}
