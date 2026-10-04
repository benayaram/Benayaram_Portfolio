'use client';
import { useEffect, useRef, useState } from 'react';
import { PROFILE } from '@/lib/data';
import { Arrow } from '@/components/ui/Shared';
export default function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const section = useRef<HTMLElement>(null);
  const visible = useRef(true);
  const userChoice = useRef(false);
  const [sound, setSound] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = video.current,
      hero = section.current;
    if (!el || !hero) return;
    let cancelled = false;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const play = async (withSound: boolean) => {
      el.muted = !withSound;
      try {
        await el.play();
        if (!cancelled) setSound(!el.muted);
      } catch {
        el.muted = true;
        if (!cancelled) setSound(false);
        if (!reduce.matches) void el.play().catch(() => {});
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.intersectionRatio >= 0.35;
        if (!visible.current) el.pause();
        else if (!reduce.matches || userChoice.current) void play(!el.muted);
      },
      { threshold: [0, 0.35, 1] },
    );
    observer.observe(hero);
    if (!reduce.matches) void play(true);
    const unlock = (event: Event) => {
      if (
        userChoice.current ||
        !visible.current ||
        reduce.matches ||
        (event.target instanceof Element && event.target.closest('button,a,input,textarea'))
      )
        return;
      userChoice.current = true;
      void play(true);
    };
    const onVisibility = () => {
      if (document.hidden) el.pause();
      else if (visible.current && (!reduce.matches || userChoice.current)) void play(!el.muted);
    };
    const motion = () => {
      if (reduce.matches) {
        el.pause();
        el.muted = true;
        setSound(false);
      } else if (visible.current) void play(false);
    };
    ['pointerdown', 'keydown', 'touchend'].forEach((type) =>
      addEventListener(type, unlock, { passive: true }),
    );
    document.addEventListener('visibilitychange', onVisibility);
    reduce.addEventListener('change', motion);
    return () => {
      cancelled = true;
      observer.disconnect();
      el.pause();
      ['pointerdown', 'keydown', 'touchend'].forEach((type) => removeEventListener(type, unlock));
      document.removeEventListener('visibilitychange', onVisibility);
      reduce.removeEventListener('change', motion);
    };
  }, []);
  const toggle = () => {
    const el = video.current;
    if (!el) return;
    userChoice.current = true;
    if (sound && playing) {
      el.muted = true;
      el.pause();
      setSound(false);
    } else {
      el.muted = false;
      void el
        .play()
        .then(() => setSound(true))
        .catch(() => setSound(false));
    }
  };
  return (
    <>
      <style>{componentStyles}</style>
      <section id="home" className="hero" ref={section} aria-labelledby="hero-title">
        <div className="hero-video">
          {failed ? (
            <img src={PROFILE.heroPoster} alt={`${PROFILE.name} seated at a laptop`} />
          ) : (
            <video
              ref={video}
              muted
              loop
              playsInline
              preload="auto"
              poster={PROFILE.heroPoster}
              aria-label={`${PROFILE.name} introducing his software development work`}
              aria-describedby="hero-transcript"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onVolumeChange={(e) => setSound(!e.currentTarget.muted)}
              onError={() => setFailed(true)}
            >
              <source src="/hero/hero.webm" type="video/webm" />
              <source src="/hero/hero.mp4" type="video/mp4" />
            </video>
          )}
        </div>
        <div className="container hero-content">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> Software & Flutter Developer
            </p>
            <p className="hero-intro">Hello, I’m {PROFILE.name}.</p>
            <h1 id="hero-title">
              Software
              <br />
              developer.
            </h1>
            <p className="hero-description">{PROFILE.intro}</p>
            <div className="hero-actions">
              <a className="button primary" href="#work">
                Explore work <Arrow />
              </a>
              <a className="button secondary" href="#contact">
                Let’s talk <span>↗</span>
              </a>
            </div>
          </div>
        </div>
        <div className="container hero-footer">
          <div className="video-caption">
            <button
              className={`sound-button ${!sound ? 'ping' : ''}`}
              onClick={toggle}
              disabled={failed}
              aria-label={
                sound && playing
                  ? 'Pause introduction and mute sound'
                  : 'Play introduction with sound'
              }
              aria-pressed={sound && playing}
            >
              {sound && playing ? '❚❚' : '▶'}
            </button>
            <span className="eyebrow">A little introduction</span>
          </div>
          <a href="#about" className="eyebrow">
            Scroll to discover <Arrow down />
          </a>
        </div>
        <p className="sr-only" id="hero-transcript">
          {PROFILE.name}. {PROFILE.role} and {PROFILE.specialty} at {PROFILE.company}.{' '}
          {PROFILE.intro}
        </p>
      </section>
    </>
  );
}
const componentStyles = `
@layer components {
  .hero { position:relative; isolation:isolate; min-height:min(100svh,1040px); display:flex; flex-direction:column; justify-content:center; overflow:clip; border-bottom:1px solid var(--line); background:var(--soft); padding-top:110px; }
  .hero-video { position:absolute; inset:0; z-index:-1; }
  .hero-video video,.hero-video img { width:100%; height:100%; object-fit:cover; object-position:center; border-radius:0; }
  .hero-content { display:flex; justify-content:flex-end; flex:1; align-items:center; padding-top:30px; padding-bottom:36px; }
  .hero-copy { position:relative; isolation:isolate; width:36%; max-width:520px; margin-right:2%; padding:30px 0 30px 28px; background:transparent; border-left:0; text-shadow:0 2px 3px rgba(251,248,242,.98),0 8px 28px rgba(251,248,242,.82); }
  .hero-copy::before { content:''; position:absolute; z-index:-1; inset:-34px -42px -34px -18px; background:linear-gradient(90deg,rgba(251,248,242,.08),rgba(251,248,242,.84) 28%,rgba(251,248,242,.96)); filter:blur(10px); pointer-events:none; }
  .hero-copy>.eyebrow { font-size:9px; margin-bottom:24px; }
  .hero-copy>.eyebrow .status-dot { margin-left:0; margin-right:9px; }
  .hero-intro { font-family:var(--serif); font-size:clamp(24px,2.4vw,38px); line-height:1; color:var(--ink); margin-bottom:18px; text-shadow:0 2px 14px rgba(251,248,242,.98); }
  .hero h1 { font-size:clamp(72px,6.8vw,118px); font-weight:500; line-height:.94; letter-spacing:-.07em; }
  .hero h1 em { line-height:1.05; letter-spacing:-.055em; }
  .hero-description { font-size:14px; line-height:1.8; max-width:350px; color:var(--ink-2); margin-top:26px; }
  .hero-actions { display:flex; gap:10px; margin-top:25px; }
  .hero-actions .button,.resume-link { text-shadow:none; }
  .hero-actions .button { min-height:45px; padding:12px 21px; }
  .resume-link { display:inline-flex; align-items:center; gap:20px; font-size:11px; margin-top:21px; }
  .resume-link:hover { text-decoration:underline; }
  .hero-footer { display:flex; position:relative; align-items:center; justify-content:space-between; gap:20px; padding-block:18px; background:rgba(251,248,242,.86); max-width:none; }
  .hero-footer>.eyebrow { font-size:9px; }
  .hero-footer>a { display:flex; align-items:center; gap:16px; }
  .video-caption { display:flex; gap:16px; align-items:center; }
  .video-caption>.eyebrow { font-size:9px; }
  .sound-button { width:46px; height:46px; flex-shrink:0; border-radius:50%; display:grid; place-items:center; background:var(--ink); color:white; font-size:12px; }
  .sound-button.ping { animation:ping 2.5s infinite; }
  @media(max-width:1100px) { .hero-copy { width:44%; margin-right:1%; padding:26px 0 26px 20px; } .hero h1 { font-size:68px; } .hero-actions .button { padding:12px 16px; gap:12px; font-size:12px; } }
  @media(max-width:759px) {
    .hero { min-height:100svh; padding-top:390px; }
    .hero-video video,.hero-video img { object-position:32% center; }
    .hero-content { padding:0; margin-top:auto; flex:none; }
    .hero-copy { width:100%; max-width:none; margin-right:0; padding:23px var(--gutter) 22px; background:rgba(251,248,242,.88); border-left:0; border-top:0; text-shadow:none; }
    .hero-copy::before { display:none; }
    .hero-copy>.eyebrow { font-size:7px; margin-bottom:13px; }
    .hero-intro { font-size:25px; margin-bottom:12px; }
    .hero h1 { font-size:58px; line-height:.94; }
    .hero h1 em { font-size:53px; }
    .hero-description { font-size:12px; margin-top:15px; max-width:320px; }
    .hero-actions { margin-top:18px; }
    .hero-actions .button { min-height:42px; padding:11px 20px; }
    .resume-link { margin-top:16px; font-size:10px; }
    .hero-footer { gap:10px; padding-block:13px; background:rgba(251,248,242,.94); }
    .hero-footer>.eyebrow,.video-caption>.eyebrow { font-size:7px; }
    .video-caption { gap:9px; }
    .sound-button { width:40px; height:40px; }
    .hero-footer>a { gap:7px; }
  }
  @media(max-width:390px) { .hero h1 { font-size:51px; } .hero h1 em { font-size:48px; } }
}
`;
