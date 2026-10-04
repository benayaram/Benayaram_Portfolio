'use client';
import { useEffect } from 'react';
export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll('.rv,.rv-mask').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
