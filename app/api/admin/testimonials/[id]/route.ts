import { NextRequest, NextResponse } from 'next/server';
import { dbGetTestimonial, dbUpdateTestimonial, dbDeleteTestimonial } from '@/lib/admin-db';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const t = await dbGetTestimonial(Number(params.id));
    if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(t);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const t = await dbUpdateTestimonial(Number(params.id), {
      quote: data.quote,
      name: data.name,
      company: data.company,
      platform: data.platform ?? 'Direct',
      rating: data.rating ?? 5,
      sortOrder: data.sortOrder ?? 0,
    });
    return NextResponse.json(t);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbDeleteTestimonial(Number(params.id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
