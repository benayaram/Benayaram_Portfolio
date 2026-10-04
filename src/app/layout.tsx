import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { PROFILE } from '@/lib/data';
import './globals.css';
const inter = localFont({
  src: '../fonts/inter-tight-latin.woff2',
  variable: '--font-inter',
  display: 'swap',
});
const serif = localFont({
  src: [
    { path: '../fonts/instrument-serif-latin.woff2', style: 'normal', weight: '400' },
    { path: '../fonts/instrument-serif-italic-latin.woff2', style: 'italic', weight: '400' },
  ],
  variable: '--font-serif',
  display: 'swap',
});
const mono = localFont({
  src: '../fonts/jetbrains-mono-latin.woff2',
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: `${PROFILE.name} — Software & Flutter Developer`,
  description: PROFILE.intro,
  openGraph: {
    title: `${PROFILE.name} — Software Developer`,
    description: PROFILE.intro,
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PROFILE.name,
    description: PROFILE.intro,
    images: ['/og.jpg'],
  },
};
export const viewport: Viewport = { themeColor: '#fbf8f2' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${serif.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
