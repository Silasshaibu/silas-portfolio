import { NextRequest, NextResponse } from 'next/server';
import { dbGetTestimonials, dbCreateTestimonial } from '@/lib/admin-db';

export async function GET() {
  try {
    return NextResponse.json(await dbGetTestimonials());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const t = await dbCreateTestimonial({
      quote: data.quote,
      name: data.name,
      company: data.company,
      platform: data.platform ?? 'Direct',
      rating: data.rating ?? 5,
      sortOrder: data.sortOrder ?? 0,
    });
    return NextResponse.json(t, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
