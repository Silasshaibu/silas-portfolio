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
      hidden BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false`;
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
export async function dbGetPublicServices() {
  const sql = getDb();
  return sql`SELECT * FROM services WHERE hidden = false ORDER BY sort_order ASC, created_at ASC`;
}
export async function dbGetService(id: number) {
  const sql = getDb();
  const rows = await sql`SELECT * FROM services WHERE id = ${id}`;
  return rows[0] ?? null;
}
export async function dbCreateService(data: Record<string, unknown>) {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO services (icon, title, description, sort_order, hidden)
    VALUES (${data.icon}, ${data.title}, ${data.description}, ${data.sortOrder}, ${data.hidden ?? false})
    RETURNING *
  `;
  return rows[0];
}
export async function dbUpdateService(id: number, data: Record<string, unknown>) {
  const sql = getDb();
  const rows = await sql`
    UPDATE services SET icon=${data.icon}, title=${data.title}, description=${data.description}, sort_order=${data.sortOrder}, hidden=${data.hidden ?? false}, updated_at=NOW()
    WHERE id=${id} RETURNING *
  `;
  return rows[0];
}
export async function dbToggleServiceHidden(id: number) {
  const sql = getDb();
  const rows = await sql`
    UPDATE services SET hidden = NOT hidden, updated_at=NOW()
    WHERE id=${id} RETURNING *
  `;
  return rows[0];
}
export async function dbDeleteService(id: number) {
  const sql = getDb();
  await sql`DELETE FROM services WHERE id = ${id}`;
}
export async function dbSeedDefaultServices() {
  const sql = getDb();
  const existing = await sql`SELECT COUNT(*) as count FROM services`;
  if (Number((existing[0] as { count: string }).count) > 0) return;
  const defaults = [
    { icon: 'Box', title: '3D Product Animation', description: 'Cinematic product reveals, rotations, and feature highlights for ads, launches, and e-commerce. Photorealistic CGI that replaces expensive photography.', sort_order: 1 },
    { icon: 'Settings', title: 'Industrial Machine Visualization', description: 'Complex machine animations that break down how systems work — conveyors, drives, sorting machines. Built for manufacturers, engineers, and investors.', sort_order: 2 },
    { icon: 'GitBranch', title: 'Engineering Explainer Animations', description: 'Visual explainers that make technical processes easy to understand for any audience — from shop floor to boardroom.', sort_order: 3 },
    { icon: 'Heart', title: 'Medical & Dental Animation', description: 'Surgical explainers, implant demonstrations, and medical device visualizations. Anatomically accurate, patient-ready animations.', sort_order: 4 },
    { icon: 'Camera', title: 'CGI Advertising', description: 'High-end CGI product shots for advertising campaigns, combining photorealism and creative direction for any platform.', sort_order: 5 },
    { icon: 'Play', title: 'Motion Graphics', description: 'Animated logos, openers, transitions, and branded video graphics for any platform. From social media to broadcast.', sort_order: 6 },
  ];
  for (const s of defaults) {
    await sql`INSERT INTO services (icon, title, description, sort_order, hidden) VALUES (${s.icon}, ${s.title}, ${s.description}, ${s.sort_order}, false)`;
  }
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

const SETTING_DEFAULTS: Record<string, string> = {
  contact_links: DEFAULT_CONTACT_LINKS,
  email: 'silasshaibu30bg@gmail.com',
  // Hero
  hero_overline: '[ 3D VISUALIZATION · MOTION DESIGN · ENGINEERING ]',
  tagline: 'Bringing Engineering & Products to Life in 3D',
  subtext: 'I design cinematic 3D animations and product visuals that help manufacturers, brands, and engineering firms communicate complex ideas with clarity.',
  hero_stats: JSON.stringify(['50+ Projects', '5 Years Experience', 'Industrial & Medical Specialist']),
  // ShowReel
  showreel_vimeo_id: '',
  showreel_stats: JSON.stringify(['30+ Industrial Projects', 'Product Visualization', 'CGI & Motion']),
  // About
  about_headline: 'Engineering Thinking. Cinematic Vision.',
  about_bio_1: "I'm Silas Shaibu — a 3D visualization artist who sits at the intersection of technical understanding and creative storytelling. I specialize in helping manufacturers, engineering firms, and product brands communicate complex ideas through high-end animation and CGI.",
  about_bio_2: "With deep expertise in Blender and an engineering-informed workflow, I bring industrial accuracy to every frame — whether it's a conveyor system animation, a product launch reveal, or a medical explainer.",
  about_bio_3: 'My background in dental studies adds a unique edge in medical visualization — an increasingly high-value niche in the 3D world.',
  about_skills: JSON.stringify(['Blender', 'After Effects', 'Product Visualization', 'Industrial Animation', 'Medical Animation', 'Motion Graphics']),
  about_pdf_url: '/api/portfolio-pdf',
};

// Settings
export async function dbGetSettings() {
  const sql = getDb();
  const rows = await sql`SELECT * FROM site_settings`;
  const settings = Object.fromEntries((rows as { key: string; value: string }[]).map((r) => [r.key, r.value]));
  for (const [key, value] of Object.entries(SETTING_DEFAULTS)) {
    if (!settings[key]) {
      await sql`INSERT INTO site_settings (key, value) VALUES (${key}, ${value}) ON CONFLICT DO NOTHING`;
      settings[key] = value;
    }
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
