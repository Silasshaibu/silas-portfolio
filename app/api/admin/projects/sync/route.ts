import { NextResponse } from 'next/server';
import { seedAdminTables, dbUpsertStaticProjects } from '@/lib/admin-db';

// One-time backfill: upsert the static lib/projects into the DB so existing
// rows pick up the latest thumbnails, wireframe/render URLs, gallery & captions.
export async function POST() {
  try {
    await seedAdminTables(); // ensure the gallery column exists
    await dbUpsertStaticProjects();
    return NextResponse.json({ success: true, message: 'Projects synced from static source' });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
