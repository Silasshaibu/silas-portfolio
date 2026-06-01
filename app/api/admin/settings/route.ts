import { NextRequest, NextResponse } from 'next/server';
import { dbGetSettings, dbSetSetting } from '@/lib/admin-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await dbGetSettings(), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    for (const [key, value] of Object.entries(data)) {
      await dbSetSetting(key, String(value));
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
