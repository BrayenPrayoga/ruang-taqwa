import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code')?.trim();
    const botUsername = process.env.TELEGRAM_BOT_USERNAME?.trim();
    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const webhookBaseUrl = process.env.APP_BASE_URL?.trim();

    if (!code) {
      return NextResponse.json(
        { ok: false, error: 'Kode koneksi tidak valid.' },
        { status: 400 },
      );
    }

    if (!botUsername) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'TELEGRAM_BOT_USERNAME belum di-set di environment server.',
        },
        { status: 500 },
      );
    }

    const connectUrl = `https://t.me/${botUsername}?start=${encodeURIComponent(code)}`;

    // Opsional: set webhook otomatis jika APP_BASE_URL tersedia.
    if (token && webhookBaseUrl) {
      const webhookUrl = `${webhookBaseUrl.replace(/\/$/, '')}/api/telegram/webhook`;
      await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl }),
        cache: 'no-store',
      });
    }

    return NextResponse.json({ ok: true, connectUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Gagal init Telegram connect.' },
      { status: 500 },
    );
  }
}
