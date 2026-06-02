import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import ShowReel from '@/components/sections/ShowReel';
import Projects from '@/components/sections/Projects';
import Services from '@/components/sections/Services';
import Testimonials from '@/components/sections/Testimonials';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import GlowDivider from '@/components/ui/GlowDivider';
import CursorGlow from '@/components/ui/CursorGlow';
import { dbGetSettings } from '@/lib/admin-db';

// ISR: cache the page for 5 minutes so admin edits still appear, but
// most requests skip the DB round-trip (lower TTFB).
export const revalidate = 300;

export default async function HomePage() {
  let settings: Record<string, string> = {};
  try { settings = await dbGetSettings() as Record<string, string>; } catch { /* use defaults */ }

  const heroStats = (() => { try { return JSON.parse(settings.hero_stats ?? '[]'); } catch { return ['50+ Projects', '5 Years Experience', 'Industrial & Medical Specialist']; } })();
  const showreelStats = (() => { try { return JSON.parse(settings.showreel_stats ?? '[]'); } catch { return ['30+ Industrial Projects', 'Product Visualization', 'CGI & Motion']; } })();
  const aboutSkills = (() => { try { return JSON.parse(settings.about_skills ?? '[]'); } catch { return ['Blender', 'After Effects', 'Product Visualization', 'Industrial Animation', 'Medical Animation', 'Motion Graphics']; } })();

  return (
    <>
      <CursorGlow />
      <Navbar />
      <main>
        <Hero
          overline={settings.hero_overline}
          tagline={settings.tagline}
          subtext={settings.subtext}
          stats={heroStats}
        />
        <GlowDivider />
        <ShowReel
          vimeoId={settings.showreel_vimeo_id}
          stats={showreelStats}
        />
        <GlowDivider />
        <Projects />
        <GlowDivider />
        <Services />
        <GlowDivider />
        <Testimonials />
        <GlowDivider />
        <About
          headline={settings.about_headline}
          bio1={settings.about_bio_1}
          bio2={settings.about_bio_2}
          bio3={settings.about_bio_3}
          skills={aboutSkills}
          pdfUrl={settings.about_pdf_url}
          profilePhoto={settings.profile_photo}
        />
        <GlowDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
