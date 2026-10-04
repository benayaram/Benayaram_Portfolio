'use client';
import { useState } from 'react';
import { CERTIFICATIONS } from '@/lib/data';
import { SectionHeading } from '../ui/Shared';
import MediaModal from '../ui/MediaModal';
export default function Certifications() {
  const [preview, setPreview] = useState<{ src: string; title: string } | null>(null);
  return (
    <>
      <style>{componentStyles}</style>
      <section id="certifications" className="section certifications">
        <div className="container certification-layout">
          <div>
            <SectionHeading index="04" label="Certifications" accent="learning.">
              Always
            </SectionHeading>
            <p className="muted">
              {String(CERTIFICATIONS.length).padStart(2, '0')} certifications. A continuing
              curiosity.
            </p>
          </div>
          <ol className="certification-list">
            {CERTIFICATIONS.map((c, i) => {
              const content = (
                <>
                  <span className="cert-index">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{c.title}</h3>
                    <p>
                      {c.issuer}
                      {c.detail && ` · ${c.detail}`}
                    </p>
                  </div>
                  <span className="cert-arrow" aria-hidden="true">
                    {c.href ? '↗' : '—'}
                  </span>
                </>
              );
              return (
                <li className="rv" key={c.title}>
                  {c.href ? (
                    <button
                      type="button"
                      className="cert-row"
                      aria-label={`View ${c.title}`}
                      onClick={() => setPreview({ src: c.href!, title: c.title })}
                    >
                      {content}
                    </button>
                  ) : (
                    <div className="cert-row">{content}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>
      {preview && (
        <MediaModal
          kind="image"
          src={preview.src}
          title={preview.title}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}

const componentStyles = `
@layer components {
/* Certifications */
.certifications {
  background: white;
  border-block: 1px solid var(--line);
}
.certification-layout {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 70px;
}
.certification-layout > div {
  position: sticky;
  top: 120px;
  align-self: start;
}
.certification-layout .section-heading {
  margin-bottom: 24px;
}
.certification-list {
  list-style: none;
}
.cert-row {
  display: flex;
  position: relative;
  gap: 24px;
  align-items: center;
  border-bottom: 1px solid var(--line);
  padding: 28px 16px;
  isolation: isolate;
  overflow: hidden;
  transition: color 0.4s;
  width:100%;
  color:inherit;
  text-align:left;
  font:inherit;
}
.cert-row:before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--accent-2);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s var(--ease);
  z-index: -1;
}
.cert-row:hover,
.cert-row:focus-visible {
  color: white;
}
.cert-row:hover:before,
.cert-row:focus-visible:before {
  transform: scaleX(1);
}
.cert-index {
  font-size: 9px;
  font-family: var(--font-mono);
  opacity: 0.65;
}
.cert-row h3 {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.025em;
}
.cert-row p {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 7px;
  line-height: 1.6;
}
.cert-arrow {
  margin-left: auto;
  transition: transform 0.4s;
}
.cert-row:hover .cert-arrow {
  transform: translate(3px, -3px);
}
}
`;
