# Silas Shaibu — 3D Portfolio Website

Premium 3D visualization portfolio built with Next.js 14, Tailwind CSS, GSAP, and Neon (serverless Postgres).

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (dark-first design system)
- **GSAP** + ScrollTrigger (all animations)
- **Lenis** (smooth scroll)
- **Framer Motion** (component transitions)
- **Neon** (serverless Postgres — contact form submissions)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon connection string (from [console.neon.tech](https://console.neon.tech)) |

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add `DATABASE_URL` in Vercel Environment Variables
4. Deploy

Vercel auto-deploys on every push to `main`.

## Project Structure

```
app/                    # Next.js App Router pages
  layout.tsx            # Root layout (fonts, Lenis, metadata)
  page.tsx              # Homepage
  globals.css           # Design tokens & base styles
  projects/[slug]/      # Dynamic case study pages
  api/contact/          # Contact form API (saves to Neon)
components/
  layout/               # Navbar, Footer
  sections/             # Hero, ShowReel, Projects, Services, Testimonials, About, Contact
  ui/                   # Button, ProjectCard, ServiceCard, VideoEmbed, CursorGlow...
  animations/           # ScrollReveal, TextSplit, ParallaxLayer, LenisProvider
lib/
  projects.ts           # Project data
  services.ts           # Services data
  gsap.ts               # GSAP plugin registration
  neon.ts               # Neon database client
types/
  index.ts              # Global TypeScript types
```

## Replacing Placeholder Content

- **Project thumbnails**: add to `public/images/` and update `thumbnail` in `lib/projects.ts`
- **Reel video**: upload to Vimeo, replace `vimeoId` in `ShowReel.tsx`
- **Contact links**: update WhatsApp, Fiverr, LinkedIn, ArtStation URLs in `Contact.tsx`
- **Portfolio PDF**: add to `public/portfolio.pdf`
