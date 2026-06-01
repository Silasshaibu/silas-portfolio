import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

function getDb(): NeonQueryFunction<false, false> {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
  return neon(process.env.DATABASE_URL);
}

export async function seedAdminTables() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      client TEXT NOT NULL,
      tools TEXT[] NOT NULL DEFAULT '{}',
      thumbnail TEXT NOT NULL DEFAULT '',
      video_url TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      challenge TEXT NOT NULL DEFAULT '',
      solution TEXT NOT NULL DEFAULT '',
      result TEXT NOT NULL DEFAULT '',
      featured BOOLEAN NOT NULL DEFAULT false,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      icon TEXT NOT NULL DEFAULT 'Box',
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      quote TEXT NOT NULL,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      platform TEXT NOT NULL DEFAULT 'Direct',
      rating INTEGER NOT NULL DEFAULT 5,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

// Projects
export async function dbGetProjects() {
  const sql = getDb();
  return sql`SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC`;
}
export async function dbGetProject(id: number) {
  const sql = getDb();
  const rows = await sql`SELECT * FROM projects WHERE id = ${id}`;
  return rows[0] ?? null;
}
export async function dbCreateProject(data: Record<string, unknown>) {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO projects (slug, title, category, client, tools, thumbnail, video_url, description, challenge, solution, result, featured, sort_order)
    VALUES (${data.slug}, ${data.title}, ${data.category}, ${data.client}, ${data.tools}, ${data.thumbnail}, ${data.videoUrl}, ${data.description}, ${data.challenge}, ${data.solution}, ${data.result}, ${data.featured}, ${data.sortOrder})
    RETURNING *
  `;
  return rows[0];
}
export async function dbUpdateProject(id: number, data: Record<string, unknown>) {
  const sql = getDb();
  const rows = await sql`
    UPDATE projects SET
      slug=${data.slug}, title=${data.title}, category=${data.category}, client=${data.client},
      tools=${data.tools}, thumbnail=${data.thumbnail}, video_url=${data.videoUrl},
      description=${data.description}, challenge=${data.challenge}, solution=${data.solution},
      result=${data.result}, featured=${data.featured}, sort_order=${data.sortOrder},
      updated_at=NOW()
    WHERE id=${id} RETURNING *
  `;
  return rows[0];
}
export async function dbDeleteProject(id: number) {
  const sql = getDb();
  await sql`DELETE FROM projects WHERE id = ${id}`;
}

// Services
export async function dbGetServices() {
  const sql = getDb();
  return sql`SELECT * FROM services ORDER BY sort_order ASC, created_at ASC`;
}
export async function dbGetService(id: number) {
  const sql = getDb();
  const rows = await sql`SELECT * FROM services WHERE id = ${id}`;
  return rows[0] ?? null;
}
export async function dbCreateService(data: Record<string, unknown>) {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO services (icon, title, description, sort_order)
    VALUES (${data.icon}, ${data.title}, ${data.description}, ${data.sortOrder})
    RETURNING *
  `;
  return rows[0];
}
export async function dbUpdateService(id: number, data: Record<string, unknown>) {
  const sql = getDb();
  const rows = await sql`
    UPDATE services SET icon=${data.icon}, title=${data.title}, description=${data.description}, sort_order=${data.sortOrder}, updated_at=NOW()
    WHERE id=${id} RETURNING *
  `;
  return rows[0];
}
export async function dbDeleteService(id: number) {
  const sql = getDb();
  await sql`DELETE FROM services WHERE id = ${id}`;
}

// Testimonials
export async function dbGetTestimonials() {
  const sql = getDb();
  return sql`SELECT * FROM testimonials ORDER BY sort_order ASC, created_at ASC`;
}
export async function dbGetTestimonial(id: number) {
  const sql = getDb();
  const rows = await sql`SELECT * FROM testimonials WHERE id = ${id}`;
  return rows[0] ?? null;
}
export async function dbCreateTestimonial(data: Record<string, unknown>) {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO testimonials (quote, name, company, platform, rating, sort_order)
    VALUES (${data.quote}, ${data.name}, ${data.company}, ${data.platform}, ${data.rating}, ${data.sortOrder})
    RETURNING *
  `;
  return rows[0];
}
export async function dbUpdateTestimonial(id: number, data: Record<string, unknown>) {
  const sql = getDb();
  const rows = await sql`
    UPDATE testimonials SET quote=${data.quote}, name=${data.name}, company=${data.company}, platform=${data.platform}, rating=${data.rating}, sort_order=${data.sortOrder}, updated_at=NOW()
    WHERE id=${id} RETURNING *
  `;
  return rows[0];
}
export async function dbDeleteTestimonial(id: number) {
  const sql = getDb();
  await sql`DELETE FROM testimonials WHERE id = ${id}`;
}

const DEFAULT_CONTACT_LINKS = JSON.stringify([
  { label: 'Email', value: 'silasshaibu30bg@gmail.com', href: 'mailto:silasshaibu30bg@gmail.com' },
  { label: 'Fiverr', value: 'fiverr.com/silasshaibu', href: 'https://fiverr.com' },
  { label: 'LinkedIn', value: 'linkedin.com/in/silasshaibu', href: 'https://linkedin.com' },
]);

// Settings
export async function dbGetSettings() {
  const sql = getDb();
  const rows = await sql`SELECT * FROM site_settings`;
  const settings = Object.fromEntries((rows as { key: string; value: string }[]).map((r) => [r.key, r.value]));
  if (!settings.contact_links) {
    await sql`INSERT INTO site_settings (key, value) VALUES ('contact_links', ${DEFAULT_CONTACT_LINKS}) ON CONFLICT DO NOTHING`;
    settings.contact_links = DEFAULT_CONTACT_LINKS;
  }
  return settings;
}
export async function dbSetSetting(key: string, value: string) {
  const sql = getDb();
  await sql`
    INSERT INTO site_settings (key, value) VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value=${value}, updated_at=NOW()
  `;
}

// Auth
export async function dbGetAdminByEmail(email: string) {
  const sql = getDb();
  const rows = await sql`SELECT * FROM admin_users WHERE email = ${email}`;
  return rows[0] ?? null;
}
export async function dbCreateAdmin(email: string, passwordHash: string) {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO admin_users (email, password_hash) VALUES (${email}, ${passwordHash})
    ON CONFLICT (email) DO UPDATE SET password_hash=${passwordHash}
    RETURNING *
  `;
  return rows[0];
}
