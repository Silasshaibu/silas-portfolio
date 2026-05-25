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

export default function HomePage() {
  return (
    <>
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <GlowDivider />
        <ShowReel />
        <GlowDivider />
        <Projects />
        <GlowDivider />
        <Services />
        <GlowDivider />
        <Testimonials />
        <GlowDivider />
        <About />
        <GlowDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
