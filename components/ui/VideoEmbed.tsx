'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface VideoEmbedProps {
  vimeoId?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  title?: string;
  rounded?: string;
}

export default function VideoEmbed({ vimeoId, youtubeId, thumbnailUrl, title, rounded = 'rounded-2xl' }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(thumbnailUrl);

  useEffect(() => {
    setThumbSrc(thumbnailUrl);
  }, [thumbnailUrl]);

  const embedSrc = vimeoId
    ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1&color=00d4ff`
    : youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1`
    : null;

  return (
    <div className={`relative w-full aspect-video ${rounded} overflow-hidden bg-[var(--bg-card)] border border-[var(--glass-border)]`}>
      {playing && embedSrc ? (
        <iframe
          src={embedSrc}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title ?? 'Video'}
        />
      ) : (
        <>
          {thumbSrc && (
            <Image
              src={thumbSrc}
              alt={title ?? 'Video thumbnail'}
              fill
              sizes="(max-width: 1024px) 100vw, 72vw"
              className="object-cover"
              onError={() => {
                if (youtubeId && thumbSrc.includes('maxresdefault')) {
                  setThumbSrc(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`);
                }
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center group"
            aria-label="Play video"
          >
            <div className="w-20 h-20 rounded-full bg-[var(--accent-primary)] flex items-center justify-center shadow-[0_0_40px_rgba(0,212,255,0.5)] group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-[#080808] fill-[#080808] ml-1" />
            </div>
          </button>
        </>
      )}
    </div>
  );
}
