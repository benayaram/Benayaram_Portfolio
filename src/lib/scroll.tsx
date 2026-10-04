'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
let smooth: Lenis | null = null;
export function scrollToTarget(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (smooth) smooth.scrollTo(el, { offset: -92 });
  else
    el.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  history.replaceState(null, '', `#${id}`);
}
export function SmoothScroll() {
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const configure = () => {
      smooth?.destroy();
      smooth = null;
      if (!media.matches)
        smooth = new Lenis({
          autoRaf: true,
          duration: 1.05,
          anchors: { offset: -92 },
          smoothWheel: true,
        });
    };
    configure();
    media.addEventListener('change', configure);
    return () => {
      media.removeEventListener('change', configure);
      smooth?.destroy();
      smooth = null;
    };
  }, []);
  return null;
}
export function lockScroll(lock: boolean) {
  if (lock) smooth?.stop();
  else smooth?.start();
}
