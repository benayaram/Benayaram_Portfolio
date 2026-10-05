'use client';
import { useRef, useState } from 'react';
import { PROFILE, SOCIALS } from '@/lib/data';
import { ExternalLink, Arrow } from '../ui/Shared';
export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const backToTop = () => {
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', '#home');
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  };
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const values = new FormData(e.currentTarget);
    setSending(true);
    setStatus('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(values)),
      });
      const result = await response.json();
      setStatus(result.message);
      if (response.ok) form.current?.reset();
    } catch {
      setStatus('Unable to send right now. Please use the email link.');
    } finally {
      setSending(false);
    }
  };
  return (
    <>
      <style>{componentStyles}</style>
      <section id="contact" className="contact section">
        <div className="container">
          <p className="eyebrow rv">07 — A conversation starts here</p>
          <div className="contact-title-row">
            <h2 className="contact-title rv">
              {['Let’s build', 'something together.'].map((line, i) => (
                <span key={line} className={i ? 'serif-line' : ''}>
                  {Array.from(line).map((char, j) => (
                    <span key={j} className={char === ' ' ? 'letter-space' : 'hop-letter'}>
                      {char === ' ' ? '\u00a0' : char}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
            <a
              href={`mailto:${PROFILE.email}`}
              className="hello-badge"
              aria-label="Say hello by email"
            >
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <defs>
                  <path id="circle-text" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <text>
                  <textPath href="#circle-text">
                    SAY HELLO · LET’S CREATE · SAY HELLO · LET’S CREATE ·{' '}
                  </textPath>
                </text>
              </svg>
              <span>↗</span>
            </a>
          </div>
          <div className="contact-grid">
            <div className="contact-details">
              <p className="muted">Have a project in mind? Let’s talk.</p>
              <div className="email-row">
                <a href={`mailto:${PROFILE.email}`} className="email-link">
                  {PROFILE.email}
                </a>
                <button className="copy-button" onClick={copy} aria-label="Copy email address">
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
              <span className="sr-only" aria-live="polite">
                {copied
                  ? 'Email address copied.'
                  : copyError
                    ? 'Could not copy. Please select the email address manually.'
                    : ''}
              </span>
              <a className="phone-link" href={PROFILE.phoneHref}>
                {PROFILE.phone}
              </a>
              <div className="contact-socials">
                {SOCIALS.map((s) => (
                  <ExternalLink key={s.name} href={s.href}>
                    {s.name}
                  </ExternalLink>
                ))}
              </div>
              <span className="eyebrow contact-location">{PROFILE.location}</span>
            </div>
            <form onSubmit={submit} ref={form} className="contact-form">
              <div className="form-pair">
                <label>
                  Your name
                  <input
                    name="name"
                    autoComplete="name"
                    placeholder="Alex Morgan"
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="alex@example.com"
                    required
                    maxLength={254}
                  />
                </label>
              </div>
              <label>
                What are you thinking?
                <textarea
                  name="message"
                  placeholder="A little about your project…"
                  rows={3}
                  required
                  minLength={10}
                  maxLength={5000}
                />
              </label>
              <div className="honeypot" aria-hidden="true">
                <label>
                  Leave this field empty
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <div className="form-bottom">
                <span>Directly to my inbox.</span>
                <button type="submit" className="button primary" disabled={sending}>
                  {sending ? 'Sending…' : 'Send message'}
                  <Arrow />
                </button>
              </div>
              <p className="form-status" role="status" aria-live="polite">
                {status}
              </p>
            </form>
          </div>
          <footer>
            <span>&copy; 2026 {PROFILE.name}</span>
            <button className="back-top" onClick={backToTop} aria-label="Back to top">
              ↑
            </button>
          </footer>
        </div>
      </section>
    </>
  );
}

const componentStyles = `
@layer components {
/* Contact */
.contact {
  padding-bottom: 0;
}
.contact-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-top: 28px;
}
.contact-title {
  font-size: clamp(50px, 7.4vw, 109px);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 1.08;
}
.contact-title > span {
  display: block;
}
.contact-title .serif-line {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--mute);
}
.hop-letter {
  display: inline-block;
}
.hop-letter:hover {
  animation: hop 0.5s var(--ease);
}
.hello-badge {
  width: 130px;
  height: 130px;
  flex-shrink: 0;
  position: relative;
  display: grid;
  place-items: center;
}
.hello-badge svg {
  position: absolute;
  inset: 0;
  animation: spin 28s linear infinite;
}
.hello-badge text {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 1.3px;
  fill: var(--ink);
}
.hello-badge > span {
  font-size: 42px;
}
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  margin-top: 70px;
  padding-bottom: 95px;
}
.contact-details > .muted {
  font-size: 13px;
}
.email-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 21px 0 17px;
  flex-wrap: wrap;
}
.email-link {
  font-size: clamp(19px, 1.85vw, 28px);
  letter-spacing: -0.045em;
  border-bottom: 1px solid var(--ink);
  padding-bottom: 5px;
  overflow-wrap: anywhere;
}
.copy-button {
  border: 1px solid #c8c4bc;
  border-radius: 30px;
  padding: 6px 12px;
  font-size: 9px;
}
.phone-link {
  font-size: 14px;
  color: var(--mute);
}
.contact-socials {
  display: flex;
  gap: 26px;
  margin-top: 30px;
}
.contact-location {
  display: block;
  margin-top: 40px;
  color: var(--mute);
  font-size: 9px;
}
.contact-form label {
  display: flex;
  flex-direction: column;
  font-size: 10px;
  gap: 12px;
}
.form-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}
.contact-form input,
.contact-form textarea {
  background: transparent;
  outline: none;
  border: 0;
  border-bottom: 1px solid #bbb7af;
  border-radius: 0;
  font-size: 13px;
  padding: 8px 0 12px;
  resize: vertical;
  width: 100%;
  color: var(--ink);
}
.contact-form input:focus,
.contact-form textarea:focus {
  border-color: var(--ink);
  box-shadow: 0 1px 0 var(--ink);
}
.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #77736c;
}
.form-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 22px;
  gap: 20px;
}
.form-bottom > span {
  font-size: 10px;
  color: var(--mute);
}
.form-status {
  font-size: 12px;
  line-height: 1.6;
  margin-top: 14px;
  color: var(--ink-2);
}
.honeypot {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.contact footer {
  border-top: 1px solid var(--line);
  padding-block: 28px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  font-size: 9px;
  color: var(--mute);
}
.back-top {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  font-size: 22px;
  position: relative;
  overflow: hidden;
  transition: transform .35s var(--ease), background .35s;
}
.back-top:before {
  content: '';
  position: absolute;
  inset: 5px;
  border: 1px solid rgba(255,255,255,.6);
  border-radius: 50%;
  animation: footer-pulse 2s ease-in-out infinite;
}
.back-top:hover { transform: translateY(-4px) rotate(-8deg); background: var(--accent-2); }
@keyframes footer-pulse { 0%,100% { transform:scale(.85); opacity:.4; } 50% { transform:scale(1); opacity:1; } }
@media (prefers-reduced-motion: reduce) { .back-top:before { animation:none; } }
@media (max-width:759px) { .back-top { width:46px; height:46px; } }
}
`;
