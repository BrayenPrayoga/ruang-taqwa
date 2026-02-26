import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const chatId = body?.chatId?.toString().trim();
    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'TELEGRAM_BOT_TOKEN belum di-set di server.' },
        { status: 500 },
      );
    }

    if (!chatId) {
      return NextResponse.json(
        { ok: false, error: 'Chat ID wajib diisi.' },
        { status: 400 },
      );
    }

    const message = `🌙 MyRamadhan Terhubung!
                    Alhamdulillah, koneksi Telegram berhasil.
                    Semua notifikasi kini siap dikirim langsung ke bot ini 🤖✨`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok || !data?.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: data?.description || 'Telegram API mengembalikan error.',
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || 'Terjadi kesalahan saat test Telegram.',
      },
      { status: 500 },
    );
  }
}
