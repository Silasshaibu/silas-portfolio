import { NextResponse } from 'next/server';
import { seedAdminTables, dbCreateAdmin, dbGetAdminByEmail } from '@/lib/admin-db';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await seedAdminTables();

    const email = process.env.ADMIN_EMAIL ?? 'silasshaibu30bg@gmail.com';
    const password = process.env.ADMIN_PASSWORD ?? 'Admin@2026!';

    const existing = await dbGetAdminByEmail(email);
    if (!existing) {
      const hash = await bcrypt.hash(password, 12);
      await dbCreateAdmin(email, hash);
    }

    return NextResponse.json({ success: true, message: 'Database seeded' });
  } catch (error) {
    console.error('[Seed Error]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
