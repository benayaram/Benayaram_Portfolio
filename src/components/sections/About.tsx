'use client';
import { useEffect, useRef, useState } from 'react';
import { PROFILE, SOCIALS } from '@/lib/data';
import { useReducedMotion } from '@/lib/hooks';
import { ExternalLink, SectionHeading } from '../ui/Shared';
import MediaModal from '../ui/MediaModal';
export default function About() {
  const [flipped, setFlipped] = useState(false);
  const card = useRef<HTMLButtonElement>(null);
  const swing = useRef({ angle: 0, velocity: 0, target: 0 });
  const reduced = useReducedMotion();
  const [showResume, setShowResume] = useState(false);
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const animate = (time: number) => {
      const s = swing.current;
      s.velocity += (s.target + Math.sin(time / 1700) * 1.2 - s.angle) * 0.035;
      s.velocity *= 0.88;
      s.angle += s.velocity;
      card.current?.style.setProperty('--swing', `${s.angle}deg`);
      frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(frame);
      if (e.isIntersecting) frame = requestAnimationFrame(animate);
    });
    if (card.current) observer.observe(card.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduced]);
  return (
    <>
      <style>{componentStyles}</style>
      <section id="about" className="section about">
        <div className="container">
          <SectionHeading index="01" label="A little about me" accent="pixels.">
            Beyond the
          </SectionHeading>
          <div className="about-grid">
            <div className="about-copy rv">
              <h3>Hi, I’m Benayaram.</h3>
              <p>{PROFILE.resumeSummary}</p>
              <p className="about-note">{PROFILE.aboutLine}</p>
              <div className="about-links">
                <button className="text-link" onClick={() => setShowResume(true)}>
                  resume <span>↗</span>
                </button>
                {SOCIALS.slice(0, 2).map((s) => (
                  <ExternalLink key={s.name} href={s.href}>
                    {s.name}
                  </ExternalLink>
                ))}
              </div>
            </div>
            <div className="lanyard-area rv">
              <div className="lanyard">
                <span>
                  {PROFILE.name} · Developer · {PROFILE.name}
                </span>
              </div>
              <div className="metal-clip" />
              <button
                ref={card}
                className={`id-card ${flipped ? 'flipped' : ''}`}
                aria-label={`${flipped ? 'Show front' : 'Flip'} developer ID card`}
                aria-pressed={flipped}
                onClick={() => setFlipped(!flipped)}
                onPointerMove={(e) => {
                  if (e.pointerType === 'mouse' && !reduced)
                    swing.current.target =
                      (e.clientX - e.currentTarget.getBoundingClientRect().left - 150) / 24;
                }}
                onPointerLeave={() => {
                  swing.current.target = 0;
                }}
              >
                <span className="id-inner">
                  <span className="id-front">
                    <span className="id-band">
                      <span>DEVELOPER ID</span>
                      <span>↗</span>
                    </span>
                    <span className="id-photo">
                      <img
                        src={PROFILE.portrait}
                        alt={PROFILE.name}
                        width="128"
                        height="156"
                        loading="lazy"
                      />
                    </span>
                    <strong className="id-name">{PROFILE.name}</strong>
                    <span className="id-role">{PROFILE.specialty}</span>
                    <span className="id-details">
                      <span>
                        DEPARTMENT <b>Software development</b>
                      </span>
                      <span>
                        GRADUATED <b>{PROFILE.graduation}</b>
                      </span>
                    </span>
                    <span className="id-bottom">
                      <span className="barcode" aria-hidden="true">
                        ┃│┃║│┃║┃│║┃│┃║│
                      </span>
                      <span className="id-seal">BR</span>
                    </span>
                  </span>
                  <span className="id-back">
                    <span className="eyebrow">Behind the ID</span>
                    <strong>What I am.</strong>
                    <span>Software & Flutter Developer</span>
                    <span>B.Tech · CSE (AI & Data Science)</span>
                    <span>3× Hackathon Winner</span>
                    <span>TEGA · HRM · AO CRM · FBGL</span>
                    <em>Benayaram Rekha</em>
                    <span className="id-found">
                      If found, say hello.
                      <br />
                      {PROFILE.email}
                    </span>
                  </span>
                </span>
              </button>
              <span className="id-hint eyebrow">Tap to flip · A little more about me</span>
            </div>
            <div className="quick-facts rv">
              <p className="eyebrow">At a glance</p>
              <dl>
                <div>
                  <dt>Currently</dt>
                  <dd>
                    {PROFILE.specialty}
                    <span>{PROFILE.company}</span>
                  </dd>
                </div>
                <div>
                  <dt>Education</dt>
                  <dd>
                    B.Tech, CSE<span>AI & Data Science · KIET</span>
                  </dd>
                </div>
                <div>
                  <dt>Say hello</dt>
                  <dd>
                    <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                  </dd>
                </div>
              </dl>
              <blockquote>“{PROFILE.quote}”</blockquote>
            </div>
          </div>
        </div>
      </section>
      {showResume && (
        <MediaModal
          kind="document"
          src={PROFILE.resume}
          title="Benayaram Rekha · resume"
          onClose={() => setShowResume(false)}
          pages={PROFILE.resumePages}
        />
      )}
    </>
  );
}

const componentStyles = `
@layer components {
/* About */
.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px minmax(0, 0.8fr);
  gap: clamp(30px, 5vw, 80px);
  align-items: start;
}
.about-copy {
  padding-top: 32px;
}
.about-copy h3 {
  font-size: 26px;
  letter-spacing: -0.04em;
  margin-bottom: 20px;
  font-weight: 500;
}
.about-copy p {
  font-size: 14px;
  line-height: 1.9;
  color: var(--mute);
}
.about-copy .about-note {
  margin-top: 18px;
  color: var(--ink-2);
}
.about-links {
  display: flex;
  gap: 23px;
  flex-wrap: wrap;
  margin-top: 22px;
}
.lanyard-area {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  perspective: 1200px;
  padding-top: 57px;
}
.lanyard {
  position: absolute;
  top: 0;
  width: 30px;
  height: 66px;
  overflow: hidden;
  background: #373735;
  color: #fff;
  box-shadow:
    inset 3px 0 0 #ffffff15,
    inset -3px 0 0 #ffffff15;
}
.lanyard span {
  display: block;
  writing-mode: vertical-rl;
  white-space: nowrap;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 7px;
  animation: strap 15s linear infinite;
}
.metal-clip {
  position: absolute;
  z-index: 2;
  top: 45px;
  left: calc(50% - 9px);
  height: 35px;
  width: 18px;
  border: 4px solid #b8b7b4;
  border-top-color: #e1dfda;
  border-radius: 6px;
  box-shadow: 0 2px 3px #0003;
}
.id-card {
  width: 300px;
  height: 404px;
  position: relative;
  transform: rotate(var(--swing, 0deg));
  transform-origin: 50% 0%;
  padding: 0;
  text-align: center;
  border-radius: 20px;
}
.id-inner {
  display: block;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s var(--ease);
  border-radius: 20px;
  box-shadow: 0 15px 45px #00000012;
}
.id-card.flipped .id-inner {
  transform: rotateY(180deg);
}
@media (hover: hover) {
  .id-card:not(.flipped):hover .id-inner {
    transform: rotateY(180deg);
  }
}
.id-front,
.id-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 20px;
  border: 1px solid #ddd9d2;
  overflow: hidden;
}
.id-band {
  width: 100%;
  background: var(--ink);
  color: white;
  padding: 19px 22px;
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1.8px;
}
.id-photo {
  width: 128px;
  height: 156px;
  border-radius: 8px;
  margin: 20px 0 11px;
  overflow: hidden;
  background: var(--soft);
  box-shadow: 0 0 0 5px var(--paper);
}
.id-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.05) contrast(1.02);
  transition: transform 0.6s;
}
.id-name {
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.035em;
}
.id-role {
  font-size: 10px;
  color: var(--mute);
  margin-top: 3px;
}
.id-details {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 15px 25px 0;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 7px;
  text-align: left;
}
.id-details > span {
  display: flex;
  justify-content: space-between;
  color: var(--mute);
}
.id-details b {
  font-weight: 400;
  color: var(--ink);
}
.id-bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
}
.barcode {
  font-size: 26px;
  letter-spacing: -4px;
  line-height: 1;
}
.id-seal {
  font-size: 11px;
  background: #dbd9d4;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: grid;
  place-items: center;
  border: 3px double #b7b4ad;
}
.id-back {
  transform: rotateY(180deg);
  padding: 30px 22px;
  justify-content: space-between;
}
.id-back > strong {
  font-size: 30px;
  letter-spacing: -0.04em;
}
.id-back > span:not(.eyebrow) {
  font-size: 12px;
}
.id-back > em {
  font-size: 26px;
  margin-top: 12px;
}
.id-back .id-found {
  font-size: 9px !important;
  color: var(--mute);
  line-height: 1.7;
}
.id-hint {
  font-size: 8px;
  margin-top: 24px;
  color: var(--mute);
}
.quick-facts {
  padding-top: 33px;
}
.quick-facts dl {
  margin: 18px 0 0;
}
.quick-facts dl > div {
  padding: 17px 0;
  border-bottom: 1px solid var(--line);
}
.quick-facts dt {
  font-size: 10px;
  color: var(--mute);
  margin-bottom: 8px;
}
.quick-facts dd {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
}
.quick-facts dd span {
  display: block;
  font-size: 11px;
  color: var(--mute);
}
.quick-facts dd a {
  font-size: 11px;
  overflow-wrap: anywhere;
}
.quick-facts blockquote {
  margin: 27px 0 0;
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--mute);
  font-size: 24px;
  line-height: 1.3;
}
}
`;
