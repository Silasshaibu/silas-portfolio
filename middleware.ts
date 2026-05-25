import { NextRequest, NextResponse } from 'next/server';

// Lightweight Edge-compatible JWT check (uses Web Crypto API, no Node.js deps)
async function verifyJWT(token: string, secret: string): Promise<boolean> {
  try {
    const [headerB64, payloadB64, sigB64] = token.split('.');
    if (!headerB64 || !payloadB64 || !sigB64) return false;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const sig = Uint8Array.from(atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sig, data);
    if (!valid) return false;

    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp ? payload.exp > Math.floor(Date.now() / 1000) : true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (pathname === '/admin/login') return NextResponse.next();

  const cookie = request.cookies.get('admin_token');
  if (!cookie?.value) return NextResponse.redirect(new URL('/admin/login', request.url));

  const secret = process.env.ADMIN_JWT_SECRET ?? 'fallback-dev-secret-change-in-production';
  const valid = await verifyJWT(cookie.value, secret);
  if (!valid) return NextResponse.redirect(new URL('/admin/login', request.url));

  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
