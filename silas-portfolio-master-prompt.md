# 🧠 MASTER PROMPT — Silas Shaibu 3D Portfolio Website
## Full Code Generation Prompt (Next.js + Tailwind CSS + GSAP)

> **How to use:** Copy everything inside the `---` dividers and paste it as a single prompt into Claude, Cursor, ChatGPT-4o, or any AI coding assistant. It will generate the full codebase.

---

```
You are a senior full-stack developer and creative web developer specializing in premium portfolio websites with cinematic motion design.

Build a complete, production-ready 3D artist portfolio website for **Silas Shaibu** — a 3D visualization artist and motion designer specializing in industrial engineering animations, product visualization, and manufacturing visuals.

---

## 🎯 BRAND POSITIONING
- Name: Silas Shaibu
- Title: 3D Visualization & Motion Design for Products, Engineering & Manufacturing
- Tagline: "I create high-end 3D animations, product visuals, and engineering presentations that help companies explain complex ideas."
- Tone: Premium, technical, cinematic — Apple/Tesla/NVIDIA aesthetic
- Audience: Manufacturers, product companies, engineering firms, dental/medical brands

---

## 🛠️ TECH STACK

### Core Framework
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (dark-first design system)
- **GSAP** + ScrollTrigger for all animations
- **Lenis** for smooth scroll
- **Framer Motion** for component-level transitions

### Additional Libraries
- `@gsap/react` — React GSAP integration
- `lenis` — smooth scroll
- `framer-motion` — page transitions and micro-animations
- `react-intersection-observer` — lazy loading triggers
- `react-hook-form` — contact form
- `next/image` — optimized media
- `next/font` — font optimization (use Space Grotesk + Inter)

### Hosting Target
- Vercel (output should be Vercel-compatible)
- `next.config.js` should include video optimization settings

---

## 🎨 DESIGN SYSTEM

### Color Palette (CSS Variables in globals.css)
```
--bg-primary: #080808        /* near black */
--bg-secondary: #0f0f0f      /* dark card bg */
--bg-card: #141414           /* elevated card */
--accent-primary: #00d4ff    /* electric cyan */
--accent-secondary: #7b2ff7  /* deep violet */
--accent-glow: rgba(0, 212, 255, 0.15)
--text-primary: #f0f0f0
--text-secondary: #8a8a8a
--text-muted: #4a4a4a
--border-subtle: rgba(255,255,255,0.06)
--glass-bg: rgba(255,255,255,0.03)
--glass-border: rgba(255,255,255,0.08)
```

### Typography
- Headings: `Space Grotesk` (700, 600)
- Body: `Inter` (400, 500)
- Accent/Labels: `Space Mono` (monospace for technical labels)

### Visual Effects
- Glassmorphism cards: `backdrop-filter: blur(12px)` with subtle border
- Glow effects on accent elements using box-shadow
- Grain texture overlay (CSS noise) on hero
- Soft radial gradients behind section headings
- Animated gradient mesh background (subtle, CSS only)

---

## 📁 PROJECT FILE STRUCTURE

Generate ALL of the following files with complete, working code:

```
/
├── app/
│   ├── layout.tsx              # Root layout with Lenis, fonts, metadata
│   ├── page.tsx                # Home page — assembles all sections
│   ├── globals.css             # Design tokens, base styles, animations
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx        # Dynamic case study page
│   └── api/
│       └── contact/
│           └── route.ts        # Contact form API route
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Fixed, blur-on-scroll navbar
│   │   └── Footer.tsx          # Minimal footer with links
│   ├── sections/
│   │   ├── Hero.tsx            # Full-screen cinematic hero
│   │   ├── ShowReel.tsx        # Featured reel video section
│   │   ├── Projects.tsx        # Tabbed project grid
│   │   ├── Services.tsx        # Services cards
│   │   ├── Testimonials.tsx    # Social proof section
│   │   ├── About.tsx           # About/bio section
│   │   └── Contact.tsx         # Contact form + links
│   ├── ui/
│   │   ├── Button.tsx          # Reusable button variants
│   │   ├── ProjectCard.tsx     # Hover-reveal project card
│   │   ├── ServiceCard.tsx     # Service item card
│   │   ├── SectionLabel.tsx    # Overline label component
│   │   ├── GlowDivider.tsx     # Glowing horizontal divider
│   │   ├── VideoEmbed.tsx      # Vimeo/YouTube embed wrapper
│   │   └── CursorGlow.tsx      # Custom cursor with glow effect
│   └── animations/
│       ├── ScrollReveal.tsx    # GSAP ScrollTrigger reveal wrapper
│       ├── TextSplit.tsx       # GSAP character split text animation
│       └── ParallaxLayer.tsx   # Parallax wrapper component
├── lib/
│   ├── projects.ts             # Static project data (typed)
│   ├── services.ts             # Services data
│   └── gsap.ts                 # GSAP plugin registration
├── public/
│   ├── videos/
│   │   └── reel-placeholder.mp4  # (placeholder path)
│   └── images/
│       └── (project thumbnails)
├── types/
│   └── index.ts                # Global TypeScript types
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 🖥️ SECTION-BY-SECTION SPECIFICATIONS

### 1. NAVBAR (components/layout/Navbar.tsx)
- Fixed position, full width
- Default: transparent background
- On scroll past 80px: `backdrop-filter: blur(20px)`, dark background with subtle border
- Left: Logo — "SILAS SHAIBU" in Space Grotesk, with a tiny cyan dot accent
- Right: Nav links — Work · Services · About · Contact
- Mobile: Hamburger menu with fullscreen overlay, staggered link animation (GSAP)
- Active link: cyan underline that slides in
- "Hire Me" CTA button (outlined, cyan border, glow on hover)

### 2. HERO SECTION (components/sections/Hero.tsx)
- Full viewport height (100dvh)
- Background: dark gradient + subtle animated mesh/grid pattern (CSS only, no canvas)
- Floating 3D-effect decorative elements: glowing orbs in cyan and violet (pure CSS)
- Grain texture overlay at 3% opacity
- Layout (centered):
  - Overline label: `[ 3D VISUALIZATION · MOTION DESIGN · ENGINEERING ]` in Space Mono, fade up
  - H1: "Bringing Engineering & Products to Life in 3D" — large, bold, 72px desktop / 40px mobile, split-text stagger animation (GSAP)
  - Subtext: "I design cinematic 3D animations and product visuals that help manufacturers, brands, and engineering firms communicate complex ideas with clarity."
  - CTA row: [View Projects] (filled cyan) + [Watch Reel] (outlined)
  - Floating stat chips below CTA: "50+ Projects" · "5 Years Experience" · "Industrial & Medical Specialist"
- Scroll indicator: animated down arrow at bottom center
- Entry animation: staggered fade-up, 0.1s delay between each element (GSAP timeline)

### 3. SHOWREEL SECTION (components/sections/ShowReel.tsx)
- Background: slightly lighter than hero
- Section label: "SELECTED REEL"
- Large centered heading: "Watch the Work Speak"
- Full-width video player wrapper (16:9 ratio) with:
  - Custom play button overlay (large centered play icon)
  - On click: plays embedded Vimeo iframe (use placeholder ID for now)
  - Thumbnail image behind it with a blur-reveal animation on play
- Below video: 3 stat chips in a row: "30+ Industrial Projects" · "Product Visualization" · "CGI & Motion"

### 4. PROJECTS SECTION (components/sections/Projects.tsx)

Categories (as filter tabs):
```
All | Industrial & Engineering | Product Visualization | Stylized / Creative | Medical & Dental
```

Project data (use lib/projects.ts — create 6 placeholder projects):

**Industrial & Engineering:**
1. "Conveyor Belt System Animation" — Blender, 15s loop, manufacturing client
2. "Hydrostatic Drive Explainer" — Blender + After Effects, engineering education
3. "Sorting Machine Visualization" — Full machine breakdown animation

**Product Visualization:**
4. "Smart Device CGI Reveal" — Product launch animation, cinematic lighting
5. "Cosmetic Packaging 3D Ad" — Product visualization for brand

**Medical & Dental:**
6. "Dental Implant Explainer" — Medical animation, surgical procedure

Each ProjectCard should:
- Show thumbnail image (use placeholder gradient if no image)
- On hover: slide-up overlay with project title, category tag, and "View Case Study →" link
- Subtle scale transform on hover (scale 1.03)
- Glassmorphism overlay on hover
- Lazy load images

Project grid: 3 columns desktop, 2 tablet, 1 mobile
Category tabs: animated underline that slides between tabs, filter with smooth fade transition

### 5. SERVICES SECTION (components/sections/Services.tsx)
- Dark background with subtle radial glow behind section title
- Section label: "WHAT I DO"
- Heading: "Services Built Around Your Vision"
- 3-column card grid (2 on tablet, 1 on mobile):

Services list:
```
1. 3D Product Animation
   Icon: [cube icon]
   Desc: "Cinematic product reveals, rotations, and feature highlights for ads, launches, and e-commerce."

2. Industrial Machine Visualization
   Icon: [gear icon]
   Desc: "Complex machine animations that break down how systems work — conveyors, drives, sorting machines."

3. Engineering Explainer Animations
   Icon: [diagram icon]
   Desc: "Visual explainers that make technical processes easy to understand for any audience."

4. Medical & Dental Animation
   Icon: [medical cross icon]
   Desc: "Surgical explainers, implant demonstrations, and medical device visualizations."

5. CGI Advertising
   Icon: [camera icon]
   Desc: "High-end CGI product shots for advertising campaigns, combining photorealism and creative direction."

6. Motion Graphics
   Icon: [motion icon]
   Desc: "Animated logos, openers, transitions, and branded video graphics for any platform."
```

Each card:
- Glassmorphism card background
- Icon in a small glowing square (cyan tint)
- Hover: subtle lift + glow border on card
- Scroll-triggered stagger animation (cards appear one by one)

### 6. TESTIMONIALS / SOCIAL PROOF (components/sections/Testimonials.tsx)
- Heading: "Trusted by Clients Globally"
- 3 placeholder testimonial cards in a horizontal scroll / grid
- Each card: quote, 5-star rating, name (Client — "Manufacturing Client, UK"), platform badge (Fiverr / LinkedIn)
- Below: a row of metrics — "50+ Projects · 5-Star Reviews · Fiverr Level Seller · Featured on Client YouTube Channels"
- Note in subtext: "Selected works featured on client YouTube channels and internal marketing materials."

### 7. ABOUT SECTION (components/sections/About.tsx)
- Two-column layout: left is text, right is a stylized "avatar card" (placeholder image with glow frame)
- Overline: "ABOUT"
- Heading: "Engineering Thinking. Cinematic Vision."
- Body copy:
  "I'm Silas Shaibu — a 3D visualization artist who sits at the intersection of technical understanding and creative storytelling. I specialize in helping manufacturers, engineering firms, and product brands communicate complex ideas through high-end animation and CGI.

  With deep expertise in Blender and an engineering-informed workflow, I bring industrial accuracy to every frame — whether it's a conveyor system animation, a product launch reveal, or a medical explainer.

  My background in dental studies adds a unique edge in medical visualization — an increasingly high-value niche in the 3D world."

- Skills list (inline chips): Blender · After Effects · Product Visualization · Industrial Animation · Medical Animation · Motion Graphics · Houdini (learning) · Unreal Engine (learning)
- Two CTA links: [Download Portfolio PDF] [View All Projects]

### 8. CONTACT SECTION (components/sections/Contact.tsx)
- Full-width dark section with strong CTA feel
- Heading: "Let's Build Something Remarkable"
- Subtext: "Whether you need a machine animated, a product visualized, or a complex process explained — I'm ready."
- Two-column: left is contact links, right is a form
- Contact links:
  - Email: silasshaibu30bg@gmail.com
  - WhatsApp: [link, placeholder number]
  - Fiverr: [link, placeholder]
  - LinkedIn: [link, placeholder]
  - ArtStation: [link, placeholder]
- Form fields: Name, Email, Project Type (select dropdown), Message, Submit button
- Form submit: POST to /api/contact (log to console for now, with success/error state)
- Submit button: full-width, cyan gradient, glow on hover

---

## 🎬 ANIMATION SPECIFICATIONS

### GSAP Animations (register in lib/gsap.ts)
```typescript
// Register in lib/gsap.ts
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
export { gsap, ScrollTrigger };
```

### ScrollReveal Component
- Fade up + slight Y translate (40px → 0)
- Duration: 0.8s, ease: "power3.out"
- Stagger children: 0.1s delay between siblings
- Trigger: "top 85%"

### Hero Text Animation (GSAP Timeline)
```
- Overline label: fade in, y: 20 → 0, delay: 0.3s
- H1 words: stagger 0.05s each, y: 60 → 0, fade in
- Subtext: fade in, y: 20 → 0, delay: 0.8s
- CTA buttons: scale 0.95 → 1, fade in, delay: 1.0s
- Stat chips: stagger from left, delay: 1.2s
```

### Navbar Scroll Behavior (GSAP ScrollTrigger)
```
ScrollTrigger.create({
  start: "top -80",
  onEnter: () => addBlurClass(),
  onLeaveBack: () => removeBlurClass()
})
```

### Project Card Hover
- GSAP .to() on mouseenter: overlay opacity 0 → 1, y: 20 → 0
- GSAP .to() on mouseleave: reverse

### Smooth Scroll (Lenis)
```typescript
// In app/layout.tsx
const lenis = new Lenis({ lerp: 0.1, duration: 1.2 });
// Integrate with GSAP ticker
gsap.ticker.add((time) => lenis.raf(time * 1000));
```

---

## 📐 RESPONSIVE BREAKPOINTS (Tailwind)
- Mobile: default (< 640px)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Wide: `xl:` (1280px+)

All sections must be fully responsive. On mobile:
- Stack all grids to single column
- Reduce heading font sizes (use Tailwind clamp utilities)
- Hamburger nav replaces desktop nav
- Touch-friendly tap targets (min 44px)

---

## 🗂️ DATA FILES

### lib/projects.ts — TypeScript type and data array
```typescript
export type Project = {
  id: string;
  slug: string;
  title: string;
  category: "industrial" | "product" | "stylized" | "medical";
  client: string;
  tools: string[];
  thumbnail: string;   // path or placeholder gradient string
  videoUrl?: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  featured: boolean;
};

export const projects: Project[] = [ /* 6 projects as specified above */ ];
```

### lib/services.ts — Services array with icon name, title, description

---

## ⚙️ CONFIG FILES

### next.config.js
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.vimeocdn.com', 'vimeo.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  }
};
module.exports = nextConfig;
```

### tailwind.config.ts
- Extend theme with design system colors as CSS variable references
- Add `fontFamily` for Space Grotesk, Inter, Space Mono
- Add custom `animation` entries for: float, pulse-glow, gradient-shift
- Add `backgroundImage` for mesh gradient
- Dark mode: `class` strategy

---

## 📦 PACKAGE.JSON DEPENDENCIES

```json
{
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.0",
    "react-dom": "18.3.0",
    "typescript": "5.4.0",
    "tailwindcss": "3.4.0",
    "gsap": "3.12.5",
    "@gsap/react": "2.1.0",
    "lenis": "1.1.9",
    "framer-motion": "11.0.0",
    "react-hook-form": "7.51.0",
    "react-intersection-observer": "9.10.0",
    "lucide-react": "0.376.0",
    "@next/font": "14.2.0"
  }
}
```

---

## 🖼️ CASE STUDY PAGE (app/projects/[slug]/page.tsx)

Each case study page should render:
1. Full-width project hero with title and category overlay
2. "The Challenge" — client problem statement
3. "The Solution" — what was built
4. Process steps (horizontal timeline): Concept → Modeling → Texturing → Animation → Rendering → Delivery
5. Embedded video (VideoEmbed component, Vimeo iframe)
6. Tools used (icon chips row)
7. "The Result" — outcome description
8. Navigation: ← Previous Project · Next Project →
9. CTA at bottom: "Like this work? Let's talk." → scrolls to contact

---

## 🔍 SEO (app/layout.tsx metadata)

```typescript
export const metadata: Metadata = {
  title: "Silas Shaibu | 3D Visualization & Engineering Animation",
  description: "High-end 3D product animation, industrial machine visualization, and engineering explainers. Helping manufacturers and brands communicate complex ideas through cinematic 3D.",
  keywords: ["3D product animation", "industrial animation", "Blender visualization", "engineering animation", "manufacturing animation", "medical 3D animation", "conveyor animation", "machine visualization"],
  openGraph: {
    title: "Silas Shaibu | 3D Visualization Studio",
    description: "...",
    type: "website",
    url: "https://silasshaibu.com",
  },
  twitter: {
    card: "summary_large_image",
  }
};
```

---

## ✅ FINAL REQUIREMENTS

1. Generate ALL files listed in the file structure above with complete, working code
2. NO placeholder comments like `// TODO` — write full implementations
3. All TypeScript types must be properly defined
4. All GSAP animations must use `useGSAP` hook from `@gsap/react` for proper cleanup
5. All images use `next/image` with proper alt text
6. The site must score 90+ on Lighthouse (performance-conscious code)
7. Add `"use client"` directive only where needed (components with hooks/events)
8. Use Server Components by default
9. Include a `README.md` with setup instructions:
   - `npm install`
   - `npm run dev`
   - Environment variables needed
10. The homepage must feel premium and cinematic — every interaction should have a micro-animation

Start by generating files in this order:
1. package.json
2. tailwind.config.ts
3. next.config.js
4. app/globals.css
5. types/index.ts
6. lib/projects.ts
7. lib/services.ts
8. lib/gsap.ts
9. app/layout.tsx
10. All components (layout → sections → ui → animations)
11. app/page.tsx
12. app/projects/[slug]/page.tsx
13. app/api/contact/route.ts
14. README.md

Generate each file completely before moving to the next.
```

---

*End of Master Prompt*
