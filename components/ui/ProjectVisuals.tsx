'use client';

import { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';
import ComparisonSlider from '@/components/ui/ComparisonSlider';
import VideoEmbed from '@/components/ui/VideoEmbed';

interface Props {
  wireframeUrl?: string;
  renderUrl?: string;
  videoUrl?: string;
  title: string;
}

export default function ProjectVisuals({ wireframeUrl, renderUrl, videoUrl, title }: Props) {
  const [open, setOpen] = useState(false);
  const hasVisuals = Boolean((wireframeUrl && renderUrl) || videoUrl);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const visuals = (
    <>
      {wireframeUrl && renderUrl && (
        <ComparisonSlider wireframeUrl={wireframeUrl} renderUrl={renderUrl} title={title} />
      )}
      {videoUrl && (
        <VideoEmbed vimeoId={videoUrl.split('/').pop() ?? ''} title={title} />
      )}
      {!hasVisuals && (
        <div className="flex items-center justify-center aspect-video rounded-xl border border-dashed border-[var(--glass-border)] bg-[var(--bg-card)]">
          <p className="text-sm text-[var(--text-muted)] font-mono">Visuals coming soon</p>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      {hasVisuals && (
        <div className="sticky top-3 z-30 flex justify-end pr-1 pt-1">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Maximize visuals"
            title="View fullscreen"
            className="p-2 rounded-lg glass-card text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {visuals}

      {open && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[100] bg-black/95 overflow-y-auto"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close fullscreen"
            title="Close (Esc)"
            className="fixed top-4 right-4 z-[110] p-2.5 rounded-lg glass-card text-white hover:text-[var(--accent-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="min-h-screen flex flex-col justify-center max-w-6xl mx-auto p-6 gap-6">
            {visuals}
          </div>
        </div>
      )}
    </div>
  );
}
