# 🗺️ BUILD PLAN — Silas Shaibu Portfolio Website
## Phased Implementation Guide

---

## PHASE 0 — Environment Setup (Day 1, ~1–2 hrs)

### Prerequisites
- Node.js 18+ installed
- Git installed
- Vercel account (free tier is fine)
- VS Code + Tailwind IntelliSense extension

### Initialize the Project
```bash
npx create-next-app@14 silas-portfolio \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd silas-portfolio

# Install all dependencies
npm install gsap @gsap/react lenis framer-motion \
  react-hook-form react-intersection-observer \
  lucide-react
```

### Git Setup
```bash
git init
git add .
git commit -m "init: Next.js 14 portfolio scaffold"
```

### Vercel Deployment (link early — deploy often)
```bash
npx vercel link
npx vercel --prod
```

---

## PHASE 1 — Foundation (Day 1–2, ~4 hrs)

Build the invisible scaffolding that everything sits on.

### Files to build in order:

**1. `types/index.ts`** — Define all TypeScript types upfront
```typescript
// Project, Service, Testimonial, NavLink types
```

**2. `app/globals.css`** — Design system foundation
- CSS custom properties (color tokens)
- Base typography
- Grain texture overlay (CSS background-image: url(data:...))
- Scrollbar styling
- Animation keyframes: float, pulse-glow, gradient-shift

**3. `tailwind.config.ts`** — Extend Tailwind with your tokens
- Custom colors that reference CSS variables
- Custom fonts: Space Grotesk, Inter, Space Mono
- Custom animations
- Dark mode: `class`

**4. `lib/gsap.ts`** — Register GSAP plugins once
```typescript
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
```

**5. `app/layout.tsx`** — Root layout with:
- Font loading (Google Fonts via `next/font/google`)
- Lenis smooth scroll initialization
- GSAP ticker integration
- Global metadata / SEO
- Body className with dark background

**6. `lib/projects.ts`** — All project data
**7. `lib/services.ts`** — All service data

### ✅ Phase 1 Checkpoint
- Site runs locally with dark background and fonts loading correctly
- No TypeScript errors
- Vercel deployment succeeds (empty page is fine)

---

## PHASE 2 — Core Layout Components (Day 2–3, ~3 hrs)

### Navbar (components/layout/Navbar.tsx)
Build sequence:
1. Static HTML structure first (logo + links + CTA)
2. Add Tailwind styles (dark, fixed, full-width)
3. Add scroll behavior with `useEffect` + GSAP ScrollTrigger
4. Build mobile hamburger menu with fullscreen overlay
5. Add active link detection with `usePathname()`

### Footer (components/layout/Footer.tsx)
- Minimal: logo left, links center, social icons right
- Copyright line at bottom
- No animation needed here — keep it simple

### ✅ Phase 2 Checkpoint
- Navbar appears fixed, becomes blurred on scroll
- Mobile menu opens/closes smoothly
- Footer renders correctly

---

## PHASE 3 — Animation Primitives (Day 3, ~2 hrs)

Build reusable animation components that all sections will use.

### `components/animations/ScrollReveal.tsx`
```typescript
// Wraps children in a GSAP ScrollTrigger fade-up
// Props: delay, stagger, y (default 40)
// Uses useGSAP() for cleanup
```

### `components/animations/TextSplit.tsx`
```typescript
// Splits heading text into words/chars
// Animates each in with stagger
// Uses GSAP SplitText (or manual split for free tier)
```

### `components/animations/ParallaxLayer.tsx`
```typescript
// Applies Y parallax on scroll
// Props: speed (0.1 to 0.5)
```

### `components/ui/Button.tsx`
Two variants:
- `primary`: filled cyan, glow shadow on hover
- `outline`: transparent, cyan border, glow border on hover

### `components/ui/SectionLabel.tsx`
Small overline label: "[ LABEL TEXT ]" in Space Mono, muted color, tracking-widest

### ✅ Phase 3 Checkpoint
- ScrollReveal works: wrap a test div and confirm fade-up on scroll
- Button variants render and glow on hover

---

## PHASE 4 — Hero Section (Day 3–4, ~3 hrs)

This is the most important section. Spend time here.

### Build sequence:
1. Static layout (overline → H1 → subtext → CTAs → stats)
2. Background elements: CSS gradient mesh, glowing orbs (position: absolute, border-radius: 50%, blur filter)
3. Grain overlay: semi-transparent CSS noise texture
4. GSAP timeline for entry animations:
   ```
   tl.from(overline, { opacity: 0, y: 20, duration: 0.6 })
     .from(h1Words, { opacity: 0, y: 60, stagger: 0.05 }, "-=0.3")
     .from(subtext, { opacity: 0, y: 20 }, "-=0.3")
     .from(ctaRow, { opacity: 0, scale: 0.95 }, "-=0.2")
     .from(statChips, { opacity: 0, x: -20, stagger: 0.1 }, "-=0.2")
   ```
5. Scroll indicator at bottom: animated bounce arrow

### ✅ Phase 4 Checkpoint
- Hero fills viewport with no overflow
- Entry animation fires once on load
- CTAs scroll to correct sections
- Fully responsive at 375px mobile width

---

## PHASE 5 — Projects Section (Day 4–5, ~4 hrs)

### Build sequence:
1. Category tab bar with animated underline (GSAP .to() on tab click)
2. `ProjectCard.tsx` component with hover overlay animation
3. Project grid with responsive columns
4. Filter logic: filter `projects` array by category, animate grid transition with Framer Motion `AnimatePresence`
5. Lazy load images with `loading="lazy"` and `react-intersection-observer`

### ProjectCard hover animation (GSAP):
```typescript
const handleMouseEnter = () => {
  gsap.to(overlay, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
};
const handleMouseLeave = () => {
  gsap.to(overlay, { opacity: 0, y: 10, duration: 0.2 });
};
```

### ✅ Phase 5 Checkpoint
- All 6 placeholder projects render
- Category tabs filter correctly
- Hover reveals overlay smoothly on desktop
- Grid is responsive

---

## PHASE 6 — Remaining Sections (Day 5–6, ~4 hrs)

Build in this order — each is faster than Projects:

### ShowReel Section
- Video placeholder with play button overlay
- On click: reveal Vimeo iframe
- Stats row below

### Services Section
- `ServiceCard.tsx` with icon, title, description
- Scroll-triggered stagger animation
- Glassmorphism card style

### Testimonials Section
- 3 placeholder testimonial cards
- Metrics row
- Note about confidentiality

### About Section
- Two-column layout
- Placeholder avatar card with cyan glow frame
- Skill chips

### Contact Section
- `react-hook-form` for the contact form
- Form validation (required fields, email format)
- API route `/api/contact/route.ts` (console.log for now)
- Success/error states with smooth transition

### ✅ Phase 6 Checkpoint
- Entire homepage scrolls top to bottom with no broken sections
- Contact form submits and shows success state
- All sections are responsive

---

## PHASE 7 — Case Study Pages (Day 6–7, ~3 hrs)

### Dynamic route: `app/projects/[slug]/page.tsx`
1. `generateStaticParams()` — pre-render all project slugs
2. `generateMetadata()` — dynamic SEO per project
3. Page layout as specified: challenge → solution → process → video → tools → result
4. Process timeline: horizontal on desktop, vertical on mobile
5. Prev/Next project navigation
6. Bottom CTA

### ✅ Phase 7 Checkpoint
- Navigate to `/projects/conveyor-belt-system-animation`
- All sections render correctly
- Prev/Next navigation works
- Page has correct metadata in `<head>`

---

## PHASE 8 — Polish & Performance (Day 7–8, ~3 hrs)

### Custom Cursor (optional but premium)
`components/ui/CursorGlow.tsx` — follows mouse, glows cyan, hides on mobile

### Page Transitions (Framer Motion)
```typescript
// Wrap page content in motion.div
// opacity: 0 → 1, y: 20 → 0 on mount
```

### Performance Optimizations
- All videos: lazy loaded, not autoplay unless muted
- Images: `priority` prop only on hero (above the fold)
- Fonts: `display: swap`
- Remove unused Tailwind classes: confirm `purge` is configured
- Check bundle size: `npm run build` — aim for < 200KB first load JS

### Accessibility
- All images: meaningful `alt` text
- All interactive elements: keyboard accessible
- Focus styles: visible but styled (cyan outline)
- `aria-label` on icon buttons

### ✅ Phase 8 Checkpoint
- `npm run build` completes with no errors
- Lighthouse score: 85+ performance, 95+ accessibility
- No console errors

---

## PHASE 9 — Real Content (Week 2)

Replace all placeholders with your actual work.

### Media preparation checklist:
- [ ] Export 3–5 best project thumbnails: 1200×800px WebP, < 300KB each
- [ ] Prepare reel: upload to Vimeo, get embed ID
- [ ] Export individual project clips: upload to Vimeo (each case study gets its own embed)
- [ ] Photo for About section: professional, good lighting, dark background ideal
- [ ] Write real testimonials from Fiverr clients (ask permission)
- [ ] Get your Fiverr/LinkedIn/ArtStation profile URLs

### Copy updates:
- [ ] Update all placeholder client names (use generic: "Manufacturing Client, Germany")
- [ ] Write real case study text for each project
- [ ] Set real contact links (WhatsApp, Fiverr, LinkedIn, ArtStation)

---

## PHASE 10 — Launch (Week 2)

### Pre-launch checklist:
- [ ] Custom domain connected to Vercel (`silasshaibu.com`)
- [ ] HTTPS working
- [ ] All links working (no 404s)
- [ ] Contact form tested end-to-end (use Resend or Nodemailer for real emails)
- [ ] Google Analytics or Vercel Analytics installed
- [ ] `robots.txt` and `sitemap.xml` generated (`next-sitemap` package)
- [ ] Open Graph image (`og-image.jpg`) added for social sharing
- [ ] Tested on: Chrome, Firefox, Safari, Mobile Safari, Chrome Android

### Launch:
```bash
git push origin main
# Vercel auto-deploys on push to main
```

### Post-launch:
- Submit sitemap to Google Search Console
- Share on LinkedIn, ArtStation, Behance, Twitter/X
- Update Fiverr and LinkedIn profile to link to the site

---

## 📅 FULL TIMELINE SUMMARY

| Phase | Work | Time Estimate |
|-------|------|---------------|
| 0 | Environment setup | 1–2 hrs |
| 1 | Foundation & data | 4 hrs |
| 2 | Layout components | 3 hrs |
| 3 | Animation primitives | 2 hrs |
| 4 | Hero section | 3 hrs |
| 5 | Projects section | 4 hrs |
| 6 | All other sections | 4 hrs |
| 7 | Case study pages | 3 hrs |
| 8 | Polish & performance | 3 hrs |
| 9 | Real content swap | 4–6 hrs |
| 10 | Launch | 2 hrs |
| **Total** | | **~33–36 hrs** |

Realistic timeline: **7–10 days** working a few hours per day.

---

## 🔑 KEY DECISIONS & RATIONALE

**Why Next.js 14 App Router?**
Server Components by default = better performance. Static generation for case study pages = instant loads. Built-in image optimization. Vercel deploys in seconds.

**Why GSAP over pure Framer Motion?**
GSAP is the industry standard for high-end creative sites. ScrollTrigger is unmatched for scroll-driven animations. Framer Motion handles component transitions (enter/exit), GSAP handles timeline and scroll.

**Why Lenis?**
Smoothest scroll library available. Integrates with GSAP ticker seamlessly. Used on Awwwards-winning sites.

**Why dark theme?**
3D renders look dramatically better on dark backgrounds. Industry standard for creative/technical portfolios (Blender's own site, NVIDIA, industrial brands).

**Why specialize in Engineering + Medical?**
Most 3D artists on Fiverr compete on price. Engineering and medical clients pay significantly more per project, have repeat needs, and value accuracy over pure aesthetics. Your dental background is a genuine competitive edge.

---

## 🚀 AFTER LAUNCH — GROWTH STRATEGY

**Short term (0–3 months):**
- Write 2 blog posts: "How I animate industrial machines in Blender" + "3D visualization for manufacturing: a guide"
- These target SEO keywords with low competition but high buyer intent

**Medium term (3–6 months):**
- Add a "Medical Animation" dedicated landing page
- Create a dedicated "Industrial Animation" landing page
- Each becomes its own SEO target

**Long term (6–12 months):**
- Case study video series on YouTube (drives traffic back to site)
- Position for agency partnerships (studios outsource to specialists)

---

*Document prepared for: Silas Shaibu | silasshaibu30bg@gmail.com*
*Generated: May 2026*
