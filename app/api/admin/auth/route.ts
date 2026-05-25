import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbGetAdminByEmail } from '@/lib/admin-db';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password)
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    const user = await dbGetAdminByEmail(email);
    if (!user)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = await signToken({ email: user.email });

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', '', { maxAge: 0, path: '/' });
  return response;
}
