import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

function getDb(): NeonQueryFunction<false, false> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
}

async function ensureContactTable(sql: NeonQueryFunction<false, false>) {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      project_type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function saveContactSubmission(data: {
  name: string;
  email: string;
  projectType: string;
  message: string;
}) {
  const sql = getDb();
  await ensureContactTable(sql);
  await sql`
    INSERT INTO contact_submissions (name, email, project_type, message)
    VALUES (${data.name}, ${data.email}, ${data.projectType}, ${data.message})
  `;
}
