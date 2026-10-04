'use client';
import { useEffect, useRef, useState } from 'react';
import { NAV, PROFILE } from '@/lib/data';
import { lockScroll, scrollToTarget } from '@/lib/scroll';
import MediaModal from '@/components/ui/MediaModal';
export default function Navigation() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const element = nav.current;
    if (!element) return;
    const measure = () => {
      const link = element.querySelector<HTMLElement>('a.active');
      setIndicator({ left: link?.offsetLeft ?? 0, width: link?.offsetWidth ?? 0 });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, [active]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(scrollY > 40);
        const amount = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
        if (progress.current) progress.current.style.transform = `scaleX(${amount})`;
      });
    };
    addEventListener('scroll', update, { passive: true });
    update();
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ['home', ...NAV.map((n) => n[0])].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener('scroll', update);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const opener = trigger.current;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lockScroll(true);
    menu.current?.querySelector<HTMLElement>('button,a')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'Tab') {
        const elements = menu.current?.querySelectorAll<HTMLElement>('button,a');
        if (!elements?.length) return;
        const first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = old;
      lockScroll(false);
      removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [open]);
  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setOpen(false);
    lockScroll(false);
    scrollToTarget(id);
  };
  return (
    <>
      <style>{componentStyles}</style>
      <>
        <div className="scroll-progress" ref={progress} />
        <header className={`navigation ${scrolled ? 'scrolled' : ''}`}>
          <a
            className="identity"
            href="#home"
            onClick={(e) => go(e, 'home')}
            aria-label={`${PROFILE.name}, back to top`}
          >
            <span className="initials">{PROFILE.initials}</span>
            <span className="identity-name">{PROFILE.name}</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation" ref={nav}>
            <span
              className="nav-indicator"
              aria-hidden="true"
              style={{
                width: indicator.width,
                transform: `translateX(${indicator.left}px)`,
                opacity: indicator.width ? 1 : 0,
              }}
            />
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={active === id ? 'active' : ''}
                aria-current={active === id ? 'location' : undefined}
                onClick={(e) => go(e, id)}
              >
                {label}
              </a>
            ))}
          </nav>
          <button className="nav-resume" type="button" onClick={() => setShowResume(true)}>
            View resume
          </button>
          <a className="nav-contact" href="#contact" onClick={(event) => go(event, 'contact')}>
            Let’s talk <span>↗</span>
          </a>
          <button
            ref={trigger}
            className="menu-trigger button secondary"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            Menu <span>＋</span>
          </button>
        </header>
        {open && (
          <div
            id="mobile-menu"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            ref={menu}
          >
            <div className="mobile-menu-top">
              <span className="eyebrow">Navigation</span>
              <button className="button secondary" onClick={() => setOpen(false)}>
                Close ×
              </button>
            </div>
            <nav>
              {NAV.map(([id, label], i) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => go(e, id)}
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  <small>0{i + 1}</small>
                  {label}
                  <span>↗</span>
                </a>
              ))}
            </nav>
            <p>
              {PROFILE.name} · {PROFILE.specialty}
            </p>
            <button className="button primary mobile-resume" type="button" onClick={() => { setOpen(false); setShowResume(true); }}>
              View resume <span>↗</span>
            </button>
          </div>
        )}
      </>
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
/* Navigation */
.navigation {
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding-inline: var(--gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  z-index: 100;
  transition: height 0.4s var(--ease);
}
.navigation.scrolled {
  position: fixed;
  height: 82px;
  pointer-events: none;
}
.navigation.scrolled > * {
  pointer-events: auto;
}
.identity {
  display: flex;
  align-items: center;
  gap: 13px;
}
.initials {
  width: 43px;
  height: 43px;
  border: 1px solid var(--accent);
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 13px;
  letter-spacing: -0.07em;
  transition:
    transform 0.7s var(--ease),
    background 0.4s,
    color 0.4s;
}
.identity:hover .initials {
  transform: rotate(360deg);
}
.identity-name {
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-serif), Georgia, serif;
  font-size: 19px;
  transition: opacity 0.3s;
}
.scrolled .initials {
  background: var(--ink);
  color: var(--paper);
}
.scrolled .identity-name {
  opacity: 0;
}
.desktop-nav {
  position: relative;
  display: flex;
  padding: 6px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(251, 248, 242, 0.84);
  backdrop-filter: blur(12px);
  gap: 2px;
}
.desktop-nav a {
  position: relative;
  z-index: 1;
  font-size: 11px;
  font-family: var(--font-mono), monospace;
  letter-spacing: 0.02em;
  padding: 10px 16px;
  border-radius: 999px;
  transition:
    background 0.35s,
    color 0.35s;
}
.desktop-nav a:hover {
  background: #e4eee9;
}
.desktop-nav a.active {
  color: white;
  background: transparent;
}
.nav-indicator { position:absolute; left:0; top:6px; bottom:6px; background:var(--accent); border-radius:999px; transition:transform .45s var(--ease),width .45s var(--ease),opacity .2s; }
.skip-link:not(:focus) { clip-path:inset(50%); width:1px; height:1px; overflow:hidden; white-space:nowrap; }
.scrolled .desktop-nav {
  background: #fffdf8e8;
  box-shadow: 0 5px 30px #00000005;
}
.nav-contact {
  font-size: 12px;
  font-family: var(--font-serif), Georgia, serif;
  font-size: 17px;
  font-style: italic;
  border-bottom: 1px solid var(--ink);
  padding-block: 7px;
  display: flex;
  gap: 20px;
}
.nav-resume {
  border:1px solid var(--ink);
  border-radius:999px;
  padding:10px 16px;
  font-family:var(--font-mono),monospace;
  font-size:10px;
  background:var(--ink);
  color:var(--paper);
  transition:transform .35s var(--ease),background .35s,color .35s;
}
.nav-resume:hover { transform:translateY(-2px); background:var(--accent); border-color:var(--accent); }
.mobile-resume { align-self:flex-start; margin-top:20px; }
.scrolled .nav-contact {
  background: var(--paper);
  padding: 12px 20px;
  border: 1px solid var(--line);
  border-radius: 30px;
}
.menu-trigger {
  display: none;
}
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: var(--paper);
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: menu-in 0.45s var(--ease);
}
@keyframes menu-in {
  from {
    clip-path: inset(0 0 100% 0);
  }
  to {
    clip-path: inset(0);
  }
}
.mobile-menu-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mobile-menu nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mobile-menu nav a {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 38px;
  letter-spacing: -0.05em;
  padding: 9px 0;
  border-bottom: 1px solid var(--line);
  animation: reveal 0.5s var(--ease) both;
}
.mobile-menu small {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0;
  color: var(--mute);
}
.mobile-menu nav a > span {
  margin-left: auto;
}
.mobile-menu > p {
  font-size: 12px;
  color: var(--mute);
}
}
`;
