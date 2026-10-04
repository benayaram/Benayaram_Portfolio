'use client';
import { useEffect, useRef } from 'react';
import { EDUCATION, EXPERIENCE } from '@/lib/data';
import { SectionHeading } from '../ui/Shared';
const path = [...EDUCATION, ...EXPERIENCE].sort((a, b) => a.sort.localeCompare(b.sort));
export default function Experience() {
  const timeline = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const el = timeline.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight * 0.6 - r.top) / r.height));
      el.style.setProperty('--path-progress', String(progress));
      el.querySelectorAll<HTMLElement>('.timeline-stop').forEach((stop) =>
        stop.classList.toggle('reached', stop.getBoundingClientRect().top < innerHeight * 0.65),
      );
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', update);
      removeEventListener('resize', update);
    };
  }, []);
  return (
    <>
      <style>{componentStyles}</style>
      <section id="experience" className="section experience">
        <div className="container">
          <div className="heading-row">
            <SectionHeading index="05" label="Education & experience" accent="journey.">
              One continuous
            </SectionHeading>
            <p className="section-aside rv">
              From the first classroom
              <br />
              to applications in the real world.
            </p>
          </div>
          <div className="timeline" ref={timeline}>
            <div className="timeline-spine" aria-hidden="true" />
            {path.map((item, i) => (
              <article className="timeline-stop rv" key={`${item.sort}-${i}`}>
                <div className="timeline-date eyebrow">{item.date}</div>
                <span className="timeline-dot" />
                <div className="timeline-content">
                  <span className="eyebrow">{item.type}</span>
                  <h3>{item.title}</h3>
                  <p className="timeline-place">{item.place}</p>
                  <p className="timeline-detail">{item.detail}</p>
                </div>
              </article>
            ))}
            <a href="#contact" className="next-card">
              <span className="eyebrow">The next chapter</span>
              <strong>Your team?</strong>
              <span>Let’s build something together. ↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

const componentStyles = `
@layer components {
/* Timeline */
.timeline {
  position: relative;
  max-width: 960px;
  margin: 10px auto 0;
  --path-progress: 0;
}
.timeline-spine {
  position: absolute;
  top: 7px;
  bottom: 0;
  left: 238px;
  width: 1px;
  background: var(--line);
}
.timeline-spine:after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--ink);
  transform: scaleY(var(--path-progress));
  transform-origin: top;
}
.timeline-stop {
  display: grid;
  grid-template-columns: 210px 18px 1fr;
  gap: 20px;
  padding-bottom: 50px;
  position: relative;
}
.timeline-date {
  padding-top: 6px;
  font-size: 9px;
  color: var(--mute);
}
.timeline-dot {
  position: relative;
  width: 9px;
  height: 9px;
  display: block;
  border: 1px solid #aaa;
  background: var(--paper);
  border-radius: 50%;
  margin-top: 7px;
  margin-left: 4px;
  transition:
    background 0.4s,
    box-shadow 0.4s;
}
.timeline-stop.reached .timeline-dot {
  background: var(--ink);
  border-color: var(--ink);
  box-shadow: 0 0 0 5px var(--paper);
}
.timeline-content {
  padding: 0 0 30px;
  border-bottom: 1px solid var(--line);
}
.timeline-content > .eyebrow {
  font-size: 8px;
  color: var(--mute);
  margin-bottom: 12px;
}
.timeline-content h3 {
  font-size: 27px;
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1.2;
}
.timeline-place {
  font-size: 12px;
  margin-top: 12px;
}
.timeline-detail {
  font-size: 13px;
  line-height: 1.8;
  color: var(--mute);
  margin-top: 16px;
  max-width: 580px;
}
.next-card {
  margin-left: 268px;
  border: 1px dashed #bbb7af;
  border-radius: 18px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: background 0.3s;
}
.next-card:hover {
  background: white;
}
.next-card strong {
  font-size: 35px;
  font-weight: 400;
  font-family: var(--font-serif);
  font-style: italic;
}
.next-card > span:last-child {
  font-size: 12px;
  color: var(--mute);
}
}
`;
