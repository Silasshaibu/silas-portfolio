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
export async function dbSeedDefaultProjects() {
  const sql = getDb();
  const existing = await sql`SELECT COUNT(*) as count FROM projects`;
  if (Number((existing[0] as { count: string }).count) > 0) return;
  const defaults = [
    { slug: 'conveyor-belt-system-animation', title: 'Conveyor Belt System Animation', category: 'industrial', client: 'Manufacturing Client, Germany', tools: ['Blender', 'After Effects', 'DaVinci Resolve'], thumbnail: '', video_url: 'https://vimeo.com/placeholder1', description: 'A 15-second looping animation showcasing a multi-stage conveyor belt system for a manufacturing facility, complete with moving parts, product flow, and mechanical details.', challenge: 'The client needed a clear, accurate visual of their conveyor system to use in sales presentations and training materials. Technical drawings were too complex for non-engineering stakeholders.', solution: 'Built the full conveyor system in Blender with accurate mechanical joints, belt movement, and product flow. Rendered with cinematic lighting in EEVEE for fast turnaround while maintaining quality.', result: 'The animation was used in 3 client pitches and reduced onboarding time for new operators by 40%. The client ordered two more machine animations within the same quarter.', featured: true, sort_order: 1 },
    { slug: 'hydrostatic-drive-explainer', title: 'Hydrostatic Drive Explainer', category: 'industrial', client: 'Engineering Education Platform, UK', tools: ['Blender', 'After Effects', 'Adobe Premiere'], thumbnail: '', video_url: 'https://vimeo.com/placeholder2', description: 'An engineering explainer animation breaking down how a hydrostatic drive system works — from pump to motor — using cutaway views and labelled components.', challenge: 'Engineering students struggled to understand the internal flow dynamics of hydrostatic systems from textbooks alone. The platform needed a visual that made the concept instantly clear.', solution: 'Created a fully rigged cutaway model with animated fluid flow paths, piston movement, and synchronized motion between the pump and motor. Text callouts added in After Effects.', result: 'Published to the platform\'s YouTube channel, the video received 12,000 views in the first month and was cited in course reviews as "the clearest explanation of hydrostatics I\'ve seen."', featured: true, sort_order: 2 },
    { slug: 'sorting-machine-visualization', title: 'Sorting Machine Visualization', category: 'industrial', client: 'Logistics Company, Netherlands', tools: ['Blender', 'Cycles Render', 'After Effects'], thumbnail: '', video_url: 'https://vimeo.com/placeholder3', description: 'A full machine breakdown animation of an industrial sorting system, showing each stage of the sorting process with exploded-view sequences and component callouts.', challenge: 'A logistics company needed to explain their proprietary sorting technology to investors and potential clients without revealing competitive engineering details.', solution: 'Designed a stylized, semi-abstract representation of the sorting mechanism that accurately communicated the value proposition while protecting sensitive design elements.', result: 'Used in an investor pitch deck that secured €2M in Series A funding. The client quoted the animation as "the key visual that made investors understand the technology instantly."', featured: false, sort_order: 3 },
    { slug: 'smart-device-cgi-reveal', title: 'Smart Device CGI Reveal', category: 'product', client: 'Tech Startup, USA', tools: ['Blender', 'Cycles Render', 'DaVinci Resolve'], thumbnail: '', video_url: 'https://vimeo.com/placeholder4', description: 'A cinematic product launch animation for a smart home device. Featuring dramatic lighting reveals, 360° rotation, and feature highlight sequences for a Kickstarter campaign.', challenge: 'The startup needed high-end product visuals comparable to Apple-level CGI but at a fraction of studio cost. Physical prototypes were not yet ready for traditional photography.', solution: 'Built the device in Blender with photorealistic PBR materials, HDR studio lighting, and multi-pass rendering. Designed a 60-second reveal sequence with 4 feature highlight moments.', result: 'The Kickstarter campaign exceeded its $150,000 goal within 48 hours. The CGI was cited in 3 tech media articles as "some of the best product visualization we\'ve seen at this funding stage."', featured: true, sort_order: 4 },
    { slug: 'cosmetic-packaging-3d-ad', title: 'Cosmetic Packaging 3D Ad', category: 'product', client: 'Beauty Brand, France', tools: ['Blender', 'EEVEE', 'Photoshop'], thumbnail: '', video_url: 'https://vimeo.com/placeholder5', description: 'Photorealistic CGI product visualization for a luxury cosmetics brand — showcasing a new skincare line with studio-quality renders and a short animated ad.', challenge: 'The brand needed product imagery for their website and social media before physical products were ready. Traditional photography timelines and costs were prohibitive for the launch.', solution: 'Created photorealistic 3D models of all 5 products in the line with accurate material simulation (glass, liquid, chrome). Delivered both static renders and a 30-second animated ad.', result: 'Delivered 2 weeks ahead of schedule. The brand used the CGI exclusively for their product launch, with no physical photography. Sales exceeded projections by 25% in the first month.', featured: false, sort_order: 5 },
    { slug: 'dental-implant-explainer', title: 'Dental Implant Explainer', category: 'medical', client: 'Dental Clinic Group, UAE', tools: ['Blender', 'Cycles Render', 'After Effects', 'Premiere Pro'], thumbnail: '', video_url: 'https://vimeo.com/placeholder6', description: 'A detailed medical animation explaining the dental implant procedure — from bone assessment through implant placement to final crown fitting — for patient education.', challenge: 'The clinic needed a way to explain the implant process to anxious patients in a way that was accurate, reassuring, and visually clear. Text brochures were not reducing patient anxiety.', solution: 'Created an anatomically accurate, step-by-step surgical animation using subsurface scattering materials for realistic tissue rendering. Narration and subtitles added in post.', result: 'The clinic reported a 35% reduction in pre-consultation cancellations after deploying the video on their website and waiting room screens. Three other clinics in the group licensed the video.', featured: true, sort_order: 6 },
    { slug: 'ino-usa-corrugated-board-belt-explainer', title: 'INO USA – Corrugated Board Process | Belt Product', category: 'industrial', client: 'INO USA', tools: ['Blender', 'After Effects', 'DaVinci Resolve'], thumbnail: '', video_url: '', description: 'A detailed 3D explainer video for INO USA showcasing how industrial conveyor belts — felt, pressure, hot plate, traction, and rough-top — operate within a full corrugated board production line.', challenge: 'The client needed to support the sale of their industrial conveyor belts to engineers, plant managers, and decision-makers. Existing materials did not clearly communicate where each belt type delivers value within a real corrugator line.', solution: 'Animated the complete corrugated board manufacturing process with belts visually highlighted in operation at each stage. Used close-up views and internal machine cutaways to show how belts interact with paper, rollers, glue systems, and heated plates.', result: 'Delivered a technically accurate, sales-driven explainer that enables stakeholders to quickly understand belt applications across the corrugator line and confidently choose the right belt solutions for high-speed production.', featured: true, sort_order: 7 },
    { slug: 'scrap-metal-recycling-belt-explainer', title: 'Scrap Metal Recycling – Belt Product Explainer', category: 'industrial', client: 'Scrap Metal Recycling Client', tools: ['Blender', 'After Effects', 'DaVinci Resolve'], thumbnail: '', video_url: '', description: 'An engaging 3D explainer video showcasing a specialized conveyor belt used in the scrap metal recycling process, covering the full workflow from shredding to sorting and separation.', challenge: 'The client needed to communicate the value of their specialized belt within a complex, multi-stage recycling workflow. Generic descriptions were not enough to help buyers visualize where the belt delivers results.', solution: 'Created a dynamic explainer video illustrating each stage of the recycling process with the belt\'s role spotlighted throughout, aligned with the client\'s commitment to sustainability and efficient waste management.', result: 'Delivered a sales-ready explainer that gives engineers and procurement teams a clear visual understanding of the belt\'s function within a live recycling line.', featured: false, sort_order: 8 },
    { slug: 'automated-egg-grading-system', title: 'Automated Egg Grading System', category: 'industrial', client: 'Egg Grading Equipment Client', tools: ['Blender', 'After Effects', 'AutoCAD'], thumbnail: '', video_url: '', description: 'A 3D animation video demonstrating how an automated egg grading system operates, combined with an exploded-view rendering and an updated technical drawing of the product prototype.', challenge: 'The client needed to clearly communicate how a complex mechanical grading system works — both as a moving animation and as a detailed assembly breakdown — while maintaining technical accuracy.', solution: 'Incorporated client-supplied video references into the animation, produced an exploded rendering showing part assembly, and delivered a final updated technical drawing with all prototype modifications.', result: 'Delivered a complete package — animation, exploded view, and revised technical drawing — within the agreed timeline.', featured: false, sort_order: 9 },
  ];
  for (const p of defaults) {
    await sql`
      INSERT INTO projects (slug, title, category, client, tools, thumbnail, video_url, description, challenge, solution, result, featured, sort_order)
      VALUES (${p.slug}, ${p.title}, ${p.category}, ${p.client}, ${p.tools}, ${p.thumbnail}, ${p.video_url}, ${p.description}, ${p.challenge}, ${p.solution}, ${p.result}, ${p.featured}, ${p.sort_order})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
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
export async function dbSeedDefaultTestimonials() {
  const sql = getDb();
  const existing = await sql`SELECT COUNT(*) as count FROM testimonials`;
  if (Number((existing[0] as { count: string }).count) > 0) return;
  const defaults = [
    { quote: "Silas did an OUTSTANDING job with the character modeling — his professionalism and attention to detail truly stood out. Working with him was a breeze thanks to his deep understanding, proactive communication, and seamless cooperation. Highly recommend!", name: 'rawnugget', company: 'Character Modeling · Switzerland', platform: 'Fiverr', rating: 5, sort_order: 1 },
    { quote: "Silas met and exceeded all expectations. His communication and patience was well and he actively followed up to clarify and make changes. It was a complex project that he handled with great diligence. I would highly recommend Silas as he delivers great value at a very reasonable price point.", name: 'aameko', company: 'Character Modeling · United States', platform: 'Fiverr', rating: 5, sort_order: 2 },
    { quote: "Silas is a very patient person — he did an amazing job, well beyond what I expected. He changed the design twice and even made a video to describe how to work with the file and measurements. If you have an idea and need to see it work, this is the guy, no doubts!", name: 'omriliberman', company: '3D Product Animation · Israel', platform: 'Fiverr', rating: 5, sort_order: 3 },
    { quote: "Silas was genuinely great to work with. My project required significant back and forth to achieve the correct design. Silas was very responsive and was able to complete the task in the time allocated.", name: 'brian_corry', company: '3D Product Animation · United Kingdom', platform: 'Fiverr', rating: 5, sort_order: 4 },
    { quote: "Great work from Silas, I was very happy with his quality of work and will be definitely using his services again for our next project.", name: 'alex_baxterr', company: '3D Product Animation · United Kingdom', platform: 'Fiverr', rating: 5, sort_order: 5 },
    { quote: "I had an exceptional experience working with Silas! He delivered a highly detailed and professional model that exceeded my expectations. Communication was smooth, and he was very responsive to my feedback, making revisions promptly and ensuring I was 100% satisfied.", name: 'shimmagsix', company: '3D Product Animation · Nigeria', platform: 'Fiverr', rating: 5, sort_order: 6 },
    { quote: "Silas was amazing to work with. He was attentive to my needs for the project and I was very pleased with how I was able to convey my ideas without any uncertainties. I look forward to working with Silas on future products!", name: 'briannaewright', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 5, sort_order: 7 },
    { quote: "Silas delivered this project in less than one day. I am a social media content creator and needed a unique analysis done quickly, and he delivered. He responded quickly and I am so grateful I was able to complete my project in time because of him.", name: 'cartergottlieb', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 5, sort_order: 8 },
    { quote: "Exceptional! Great working on modelling project with Silas. He is very understanding, hard working and skilled! I will continue working with Silas.", name: 'sweisssss', company: 'Character Modeling · Canada', platform: 'Fiverr', rating: 5, sort_order: 9 },
    { quote: "Silas was exceptionally great with his communication and dedication to accuracy. He was very considerate of my unique request and made quick work of completing it.", name: 'rufdog2', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 5, sort_order: 10 },
    { quote: "Exceptional work, work ethic and communication skills. I recommend him highly.", name: 'mikeabb23', company: '3D Product Animation · Canada', platform: 'Fiverr', rating: 5, sort_order: 11 },
    { quote: "so kind and talented. he is a very understanding and nice person. i am lucky to work with him.", name: 'bysnowly', company: 'Character Modeling · Turkey', platform: 'Fiverr', rating: 5, sort_order: 12 },
    { quote: "we look forward to working with Silas again.", name: 'team4000', company: 'Character Modeling · Germany', platform: 'Fiverr', rating: 5, sort_order: 13 },
    { quote: "Very professional. Will work with again.", name: 'sha721', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 4, sort_order: 14 },
    { quote: "it was excellent experience to work with Silas. great job brother.", name: 'overhaul96', company: '3D Product Animation · Saudi Arabia', platform: 'Fiverr', rating: 5, sort_order: 15 },
    { quote: "excellent work", name: 'mediaonline2', company: '3D Product Animation · Oman', platform: 'Fiverr', rating: 5, sort_order: 16 },
    { quote: "He brought my thoughts into reality", name: 'alnorligons85', company: 'Character Modeling · United States', platform: 'Fiverr', rating: 5, sort_order: 17 },
    { quote: "Very good work", name: 'ino_usa', company: 'Character Modeling · United States', platform: 'Fiverr', rating: 5, sort_order: 18 },
    { quote: "Super fast and efficient. Definitely will keep working with him.", name: 'coaching4u', company: 'Packaging Design · United States', platform: 'Fiverr', rating: 5, sort_order: 19 },
    { quote: "Great communication and went above and beyond", name: 'automaticj5', company: 'Website Design · United States', platform: 'Fiverr', rating: 5, sort_order: 20 },
    { quote: "Silas is an excellent communicator! He gets straight to the business of getting the work done with accuracy and speed. I already have my next project lined up for him. Thanks again Silas!!", name: 'n1sweetg', company: 'Website Design · United States', platform: 'Fiverr', rating: 5, sort_order: 21 },
    { quote: "Very detailed and patient with changes.", name: 'carpe01', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 5, sort_order: 22 },
    { quote: "will use again", name: 'gregkaz139', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 5, sort_order: 23 },
    { quote: "Great work! A work well done. Seller is patient and communicates well. Also gives 100% quality. I will definitely give seller more jobs.", name: 'senaahlee', company: '3D Product Animation · Nigeria', platform: 'Fiverr', rating: 5, sort_order: 24 },
    { quote: "Great work as usual — seller is patient and communicates well.", name: 'ggoddess', company: 'Character Modeling · United States', platform: 'Fiverr', rating: 5, sort_order: 25 },
    { quote: "Silasshaibu is very professional and responsive. His work is mastered and very satisfying. I will call on him for another project.", name: 'labber', company: 'Packaging Design · Morocco', platform: 'Fiverr', rating: 5, sort_order: 26 },
    { quote: "he always do perfect job", name: 'deep4800', company: 'Website Design · India', platform: 'Fiverr', rating: 5, sort_order: 27 },
    { quote: "Very talented artist!", name: 'iketh_kd', company: 'Character Modeling · United States', platform: 'Fiverr', rating: 5, sort_order: 28 },
    { quote: "Worked fast and did exactly what I needed", name: 'itsmsytic', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 5, sort_order: 29 },
    { quote: "It did take some time but no complaints — at the end it was all good. Thank you Silas.", name: 'uparhi', company: 'Website Design · Australia', platform: 'Fiverr', rating: 5, sort_order: 30 },
    { quote: "Very clear and well produced. Very happy and will continue to use.", name: 'chrispalmer715', company: 'Website Design · United Kingdom', platform: 'Fiverr', rating: 5, sort_order: 31 },
    { quote: "I am not a technical person. Silas is so patient and helpful. He really does amazing work and makes the whole process so easy! I highly recommend him to anyone who wants top quality work with fast delivery.", name: 'bruceterrill', company: 'Website Design · United States', platform: 'Fiverr', rating: 5, sort_order: 32 },
    { quote: "Silas did a superb job! Fast, efficient, very responsive, skilled, and a great communicator. I am very pleased with his work and I intend to use him on my next project! I highly recommend Silas!", name: 'johnnypdx2020', company: 'Website Design · United States', platform: 'Fiverr', rating: 5, sort_order: 33 },
    { quote: "creative and very hard working.", name: 'yashjhaveri270', company: 'Packaging Design · India', platform: 'Fiverr', rating: 5, sort_order: 34 },
    { quote: "Surprised to find someone with his level of skill on Fiverr. Lovely experience!", name: 'mranthonyhahn', company: 'Packaging Design · United States', platform: 'Fiverr', rating: 5, sort_order: 35 },
    { quote: "Amazing artwork! He really made my vision come alive. Thank you so much! Would definitely use again.", name: 'fairladyz08', company: 'Character Modeling · United States', platform: 'Fiverr', rating: 5, sort_order: 36 },
    { quote: "très bon taff ! merci", name: 'paulgardette201', company: 'Character Modeling · France', platform: 'Fiverr', rating: 5, sort_order: 37 },
  ];
  for (const t of defaults) {
    await sql`
      INSERT INTO testimonials (quote, name, company, platform, rating, sort_order)
      VALUES (${t.quote}, ${t.name}, ${t.company}, ${t.platform}, ${t.rating}, ${t.sort_order})
    `;
  }
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
