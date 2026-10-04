'use client';
import { useEffect, useRef, useState } from 'react';
import { ACHIEVEMENTS } from '@/lib/data';
import { useInView, useReducedMotion, useScrollProgress } from '@/lib/hooks';
import { SectionHeading } from '../ui/Shared';
import TechLogo from '../ui/TechLogo';
function Count({ number, suffix }: { number: number; suffix: string }) {
  const { ref, visible } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(number);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!visible || reduced) return;
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / 1400);
      setValue(Math.round(number * (1 - Math.pow(1 - t, 4))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, number, reduced]);
  return (
    <span className="achievement-number" ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
export default function Achievements() {
  const { ref, progress } = useScrollProgress<HTMLElement>();
  const track = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [compact, setCompact] = useState(true);
  const reduced = useReducedMotion();
  useEffect(() => {
    const measure = () => {
      setCompact(innerWidth < 760);
      setTravel(Math.max(0, (track.current?.scrollWidth ?? 0) - (track.current?.clientWidth ?? 0)));
    };
    const obs = new ResizeObserver(measure);
    if (track.current) obs.observe(track.current);
    measure();
    addEventListener('resize', measure);
    return () => {
      obs.disconnect();
      removeEventListener('resize', measure);
    };
  }, []);
  const pinned = !compact && !reduced;
  return (
    <>
      <style>{componentStyles}</style>
      <section
        id="achievements"
        ref={ref}
        className={`achievements ${pinned ? 'pinned' : ''}`}
        style={pinned ? { height: `calc(100svh + ${travel}px)` } : undefined}
      >
        <div className="achievement-sticky">
          <div className="container">
            <div className="heading-row">
              <SectionHeading index="06" label="Milestones along the way" accent="forward.">
                Small wins. Moving
              </SectionHeading>
              <span className="eyebrow section-aside">
                Keep learning.
                <br />
                Keep building.
              </span>
            </div>
            <div className="achievement-progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${pinned ? progress : 1})` }} />
            </div>
            <div className="achievement-viewport">
              <div
                className="achievement-track"
                ref={track}
                tabIndex={pinned ? -1 : 0}
                role="region"
                aria-label="Achievement cards. Scroll horizontally to explore."
                style={pinned ? { transform: `translateX(${-progress * travel}px)` } : undefined}
              >
                {ACHIEVEMENTS.map((a, i) => (
                  <article
                    key={a.title}
                    className={`achievement-card ${Math.round(progress * (ACHIEVEMENTS.length - 1)) === i ? 'nearest' : ''}`}
                  >
                    <div className="achievement-top">
                      <span className="achievement-icon">
                        <TechLogo name={a.icon} size={38} />
                      </span>
                      <span className="eyebrow">
                        0{i + 1} / 0{ACHIEVEMENTS.length}
                      </span>
                    </div>
                    <div className="achievement-text">
                      <p className="eyebrow">{a.label}</p>
                      <h3>{a.title}</h3>
                      <p>{a.detail}</p>
                    </div>
                    {a.number && <Count number={a.number} suffix={a.suffix} />}
                  </article>
                ))}
                <div className="and-counting">
                  <em>and counting</em>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const componentStyles = `
@layer components {
/* Achievements */
.achievements {
  border-block: 1px solid var(--line);
  position: relative;
}
.achievement-sticky {
  padding-block: 100px;
  overflow: clip;
}
.pinned .achievement-sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  display: flex;
  align-items: center;
}
.achievement-sticky > .container {
  min-width: 0;
}
.achievement-progress {
  height: 2px;
  background: var(--line);
  margin-bottom: 35px;
  overflow: hidden;
}
.achievement-progress span {
  display: block;
  height: 100%;
  background: var(--ink);
  transform-origin: left;
}
.achievement-viewport {
  overflow: visible;
}
.achievement-track {
  display: flex;
  gap: 20px;
  will-change: transform;
  padding-block: 18px 30px;
}
.achievement-card {
  position: relative;
  flex: 0 0 clamp(340px, 37vw, 510px);
  height: 310px;
  border-radius: 25px;
  background: #fff;
  padding: 27px;
  border: 1px solid #e9e6e0;
  transition:
    transform 0.5s var(--ease),
    box-shadow 0.5s;
}
.achievement-card.nearest {
  transform: translateY(-10px);
  box-shadow: 0 18px 35px #00000007;
}
.achievement-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.achievement-icon {
  height: 60px;
  width: 60px;
  background: #e7f0ed;
  color: var(--accent-2);
  border-radius: 15px;
  display: grid;
  place-items: center;
}
.achievement-top > .eyebrow {
  font-size: 9px;
  color: var(--mute);
}
.achievement-text {
  margin-top: 32px;
}
.achievement-text > .eyebrow {
  font-size: 8px;
  color: var(--mute);
}
.achievement-text h3 {
  font-size: 25px;
  font-weight: 500;
  letter-spacing: -0.04em;
  margin: 8px 0 10px;
  max-width: 340px;
  line-height: 1.1;
}
.achievement-text > p:last-child {
  font-size: 12px;
  line-height: 1.65;
  color: var(--mute);
  max-width: 340px;
}
.achievement-card:first-child .achievement-text {
  padding-right: 60px;
}
.achievement-number {
  position: absolute;
  right: 25px;
  bottom: 32px;
  font-size: 78px;
  letter-spacing: -0.08em;
  line-height: 1;
}
.and-counting {
  flex: 0 0 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  font-size: 34px;
}
.and-counting > span {
  font-size: 45px;
}
.achievements:not(.pinned) .achievement-track {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}
.achievements:not(.pinned) .achievement-card {
  scroll-snap-align: start;
}
}
`;
