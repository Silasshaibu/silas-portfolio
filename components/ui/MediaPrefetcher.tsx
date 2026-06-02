'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getMediaManifest } from '@/lib/mediaManifest';

// Next's default image device sizes (next.config has no override).
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

// Pick the width next/image would request for a slider using
// sizes="(max-width:1024px) 100vw, 72vw" at the current viewport/DPR.
function targetWidth(): number {
  const vw = window.innerWidth;
  const cssWidth = vw <= 1024 ? vw : vw * 0.72;
  const needed = cssWidth * (window.devicePixelRatio || 1);
  return DEVICE_SIZES.find((w) => w >= needed) ?? DEVICE_SIZES[DEVICE_SIZES.length - 1];
}

function optimizedUrl(src: string, width: number) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

// Fetch one image and resolve when done (success or fail), at low priority.
function warm(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.fetchPriority = 'low';
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

export default function MediaPrefetcher() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    // Respect data-saver and slow connections.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(^|\s)(slow-2g|2g|3g)/.test(conn.effectiveType)) return;

    let cancelled = false;

    const run = async () => {
      const manifest = getMediaManifest();

      // Prioritise the neighbours of the current project, if on one.
      let ordered = manifest;
      const match = pathname?.match(/^\/projects\/(.+)$/);
      if (match) {
        const slug = match[1];
        const idx = manifest.findIndex((m) => m.slug === slug);
        if (idx !== -1) {
          const neighbours = [manifest[idx + 1], manifest[idx - 1]].filter(Boolean);
          const rest = manifest.filter((_, i) => i !== idx && i !== idx + 1 && i !== idx - 1);
          ordered = [...neighbours, ...rest];
        }
      }

      const width = targetWidth();
      const urls = Array.from(new Set(ordered.flatMap((m) => m.images))).map((src) => optimizedUrl(src, width));

      // Sequential — one at a time, never flood the network.
      for (const url of urls) {
        if (cancelled) return;
        await warm(url);
      }
    };

    const start = () => { if (!cancelled) run(); };
    const hasRIC = typeof window.requestIdleCallback === 'function';
    const id = hasRIC ? window.requestIdleCallback(start, { timeout: 3000 }) : window.setTimeout(start, 1500);

    return () => {
      cancelled = true;
      if (hasRIC) window.cancelIdleCallback(id as number);
      else clearTimeout(id as number);
    };
  }, [pathname]);

  return null;
}
