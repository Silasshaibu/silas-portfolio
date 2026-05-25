import { NextRequest, NextResponse } from 'next/server';
import { dbGetService, dbUpdateService, dbDeleteService } from '@/lib/admin-db';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const s = await dbGetService(Number(params.id));
    if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(s);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const s = await dbUpdateService(Number(params.id), {
      icon: data.icon ?? 'Box',
      title: data.title,
      description: data.description,
      sortOrder: data.sortOrder ?? 0,
    });
    return NextResponse.json(s);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbDeleteService(Number(params.id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
