import { NextRequest, NextResponse } from 'next/server';
import { dbGetServices, dbCreateService, dbReorderServices } from '@/lib/admin-db';

export async function GET() {
  try {
    return NextResponse.json(await dbGetServices());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { order } = await request.json();
    await dbReorderServices(order);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const service = await dbCreateService({
      icon: data.icon ?? 'Box',
      title: data.title,
      description: data.description,
      sortOrder: data.sortOrder ?? 0,
    });
    return NextResponse.json(service, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
