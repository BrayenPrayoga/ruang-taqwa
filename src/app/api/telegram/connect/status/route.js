import { NextResponse } from 'next/server';
import { getTelegramLink } from '@/lib/telegramLinkStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code')?.trim();

    if (!code) {
      return NextResponse.json(
        { ok: false, error: 'Kode koneksi tidak valid.' },
        { status: 400 },
      );
    }

    const linked = getTelegramLink(code);
    if (linked?.chatId) {
      return NextResponse.json(
        {
          ok: true,
          chatId: String(linked.chatId),
          username: linked.username || '',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          'Belum ada /start dengan kode ini. Buka bot Telegram lalu klik Start, kemudian cek status lagi.',
      },
      { status: 404 },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Gagal cek status Telegram.' },
      { status: 500 },
    );
  }
}
