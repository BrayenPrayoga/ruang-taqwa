import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json({ city: null }, { status: 400 });
    }

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(
      lat,
    )}&lon=${encodeURIComponent(lon)}&format=json`;

    const res = await fetch(url, {
      headers: {
        // Wajib untuk Nominatim agar request tidak dianggap bot anonim.
        'User-Agent': 'MyRamadhan/1.0 (local qibla feature)',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ city: null }, { status: 200 });
    }

    const data = await res.json();
    const city =
      data?.address?.city ||
      data?.address?.county ||
      data?.address?.town ||
      data?.address?.village ||
      null;

    return NextResponse.json({ city }, { status: 200 });
  } catch {
    return NextResponse.json({ city: null }, { status: 200 });
  }
}
