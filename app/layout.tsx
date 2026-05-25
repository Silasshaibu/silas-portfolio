import type { Metadata } from 'next';
import { Space_Grotesk, Inter, Space_Mono } from 'next/font/google';
import './globals.css';
import LenisProvider from '@/components/animations/LenisProvider';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Silas Shaibu | 3D Visualization & Engineering Animation',
  description:
    'High-end 3D product animation, industrial machine visualization, and engineering explainers. Helping manufacturers and brands communicate complex ideas through cinematic 3D.',
  keywords: [
    '3D product animation',
    'industrial animation',
    'Blender visualization',
    'engineering animation',
    'manufacturing animation',
    'medical 3D animation',
    'conveyor animation',
    'machine visualization',
  ],
  openGraph: {
    title: 'Silas Shaibu | 3D Visualization Studio',
    description:
      'High-end 3D product animation, industrial machine visualization, and engineering explainers.',
    type: 'website',
    url: 'https://silasshaibu.com',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable} bg-[#080808] text-[#f0f0f0] overflow-x-hidden`}
      >
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
