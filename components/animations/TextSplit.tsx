'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextSplitProps {
  text: string;
  className?: string;
  delay?: number;
  triggerOnScroll?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export default function TextSplit({
  text,
  className = '',
  delay = 0,
  triggerOnScroll = false,
  as: Tag = 'h2',
}: TextSplitProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const words = text.split(' ');
      el.innerHTML = words
        .map(
          (word) =>
            `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.25em"><span class="word-inner" style="display:inline-block">${word}</span></span>`
        )
        .join('');

      const wordInners = el.querySelectorAll('.word-inner');

      const animProps = {
        opacity: 0,
        y: 60,
        duration: 0.7,
        stagger: 0.05,
        delay,
        ease: 'power3.out',
      };

      if (triggerOnScroll) {
        gsap.from(wordInners, {
          ...animProps,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        });
      } else {
        gsap.from(wordInners, animProps);
      }
    },
    { scope: containerRef }
  );

  return (
    <Tag ref={containerRef as React.RefObject<never>} className={className}>
      {text}
    </Tag>
  );
}
