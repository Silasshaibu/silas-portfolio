import SectionLabel from '@/components/ui/SectionLabel';
import VideoEmbed from '@/components/ui/VideoEmbed';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { parseVideo } from '@/lib/parseVideo';

const DEFAULT_STATS = ['30+ Industrial Projects', 'Product Visualization', 'CGI & Motion'];

interface ShowReelProps {
  videoUrl?: string;
  stats?: string[];
}

export default function ShowReel({ videoUrl, stats }: ShowReelProps) {
  const displayStats = (stats && stats.length > 0) ? stats : DEFAULT_STATS;
  const video = videoUrl ? parseVideo(videoUrl) : {};

  return (
    <section id="showreel" className="py-24 lg:py-32 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-4 md:mb-12 px-6">
          <SectionLabel text="Selected Reel" />
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] text-[var(--text-primary)]">
            Watch the Work Speak
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="px-0 sm:px-6">
          <VideoEmbed
            vimeoId={video.vimeoId}
            youtubeId={video.youtubeId}
            thumbnailUrl={video.thumbnailUrl}
            title="Silas Shaibu — 3D Visualization Reel"
            rounded="rounded-none sm:rounded-2xl"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="mt-10 px-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {displayStats.map((stat) => (
              <span
                key={stat}
                className="px-5 py-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-sm font-mono text-[var(--text-secondary)]"
              >
                {stat}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
