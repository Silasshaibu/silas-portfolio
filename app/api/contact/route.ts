import { NextRequest, NextResponse } from 'next/server';
import { saveContactSubmission } from '@/lib/neon';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, projectType, message } = body;

    if (!name || !email || !projectType || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await saveContactSubmission({ name, email, projectType, message });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Contact API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
