'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Box, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  wireframeUrl: string;
  renderUrl: string;
  title: string;
  heading?: string;
  leftLabel?: string;
  rightLabel?: string;
  priority?: boolean;
}

export default function ComparisonSlider({
  wireframeUrl,
  renderUrl,
  title,
  heading = 'Wireframe vs Render',
  leftLabel = 'WIREFRAME',
  rightLabel = 'FINAL RENDER',
  priority = false,
}: Props) {
  if (!wireframeUrl || !renderUrl) return null;

  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - left) / width) * 100));
    setPos(pct);
  }, []);

  const onMouseDown = () => { dragging.current = true; };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updatePos(e.clientX); };
  const onMouseUp = () => { dragging.current = false; };
  const onTouchStart = () => { dragging.current = true; };
  const onTouchMove = (e: React.TouchEvent) => { if (dragging.current) updatePos(e.touches[0].clientX); };
  const onTouchEnd = () => { dragging.current = false; };

  return (
    <div className="space-y-3">
      <div className="relative flex items-center justify-between">
        <h2 className="font-grotesk font-bold text-xl text-[var(--text-primary)]">{heading}</h2>
        <span className="text-xs font-mono text-[var(--text-muted)] absolute right-1/2 translate-x-1/2">← Drag to compare →</span>
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-xl overflow-hidden cursor-col-resize select-none border border-[var(--glass-border)]"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Bottom layer — wireframe */}
        <div className="absolute inset-0 z-0">
          <Image src={wireframeUrl} alt={`${title} wireframe`} fill priority={priority} sizes="(max-width: 1024px) 100vw, 72vw" className="object-cover" />
          <div className="absolute bottom-3 left-3 text-xs font-mono text-white/60 bg-black/40 px-2 py-1 rounded">{leftLabel}</div>
        </div>

        {/* Top layer — final render, clipped from left */}
        <div
          className="absolute inset-0 z-10"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image src={renderUrl} alt={`${title} final render`} fill priority={priority} sizes="(max-width: 1024px) 100vw, 72vw" className="object-cover" />
          <div className="absolute bottom-3 right-3 text-xs font-mono text-white/60 bg-black/40 px-2 py-1 rounded">{rightLabel}</div>
        </div>

        {/* Drag handle */}
        <div
          className="absolute top-0 bottom-0 z-20 flex items-center justify-center"
          style={{ left: `clamp(20px, ${pos}%, calc(100% - 20px))`, transform: 'translateX(-50%)' }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 w-[2px] bg-white/80" />

          {/* Handle button */}
          <div className="relative w-10 h-10 rounded-full bg-[var(--bg-primary)] border-2 border-white/80 flex items-center justify-center shadow-lg">
            <ChevronLeft className="w-3 h-3 text-white absolute left-1" />
            <Box className="w-4 h-4 text-[var(--accent-primary)]" />
            <ChevronRight className="w-3 h-3 text-white absolute right-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
