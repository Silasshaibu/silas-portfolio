'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProfileImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="w-24 h-24 rounded-full bg-[rgba(0,212,255,0.1)] border-2 border-[rgba(0,212,255,0.3)] mx-auto mb-4 overflow-hidden flex items-center justify-center relative">
      <span className="font-grotesk font-bold text-2xl text-[var(--accent-primary)] absolute select-none">SS</span>
      {!failed && (
        <Image
          src={src}
          alt="Silas Shaibu"
          fill
          className="object-cover object-top relative"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
