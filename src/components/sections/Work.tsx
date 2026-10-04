'use client';
import { useState } from 'react';
import { PROJECTS, SKILL_GROUPS, type Project } from '@/lib/data';
import { ExternalLink, SectionHeading } from '../ui/Shared';
import TechLogo from '../ui/TechLogo';
import MediaModal from '../ui/MediaModal';
export default function Work() {
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState<Project | null>(null);
  return (
    <>
      <style>{componentStyles}</style>
      <section id="work" className="section work">
        <div className="container">
          <div className="heading-row">
            <SectionHeading index="03" label="Selected work" accent="built.">
              Things I’ve
            </SectionHeading>
            <span className="eyebrow section-aside">
              Mobile applications & web platforms
              <br />
              Selected projects / 01—04
            </span>
          </div>
          <div className="project-gallery rv">
            {PROJECTS.map((p, i) => (
              <article
                key={p.id}
                className={`project-panel ${active === i ? 'expanded' : ''}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <button
                  className="project-toggle"
                  onClick={() => setActive(i)}
                  aria-expanded={active === i}
                  aria-controls={`project-${p.id}`}
                >
                  <span className="eyebrow">0{i + 1}</span>
                  <span className="project-spine-title">{p.title}</span>
                  <span className="project-plus">＋</span>
                </button>
                <div
                  className="project-content"
                  id={`project-${p.id}`}
                  inert={active !== i}
                  aria-hidden={active !== i}
                >
                  <div className="project-description">
                    <p className="eyebrow">{p.kicker}</p>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <ul className="feature-list">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <div className="tech-chips">
                      {p.tech.map((t) => (
                        <span key={t}>
                          <TechLogo
                            name={SKILL_GROUPS.find((s) => s.name === t)?.logo ?? 'code'}
                            size={14}
                          />
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="project-actions">
                      {p.live ? (
                        <ExternalLink href={p.live} className="button primary">
                          View on Google Play
                        </ExternalLink>
                      ) : (
                        <button className="button secondary unavailable" disabled>
                          Not available <span>↗</span>
                        </button>
                      )}
                      {p.github && <ExternalLink href={p.github}>GitHub</ExternalLink>}
                    </div>
                    <p className="project-status">
                      <span className="status-dot" />
                      {p.status}
                    </p>
                  </div>
                  <button
                    className="project-image"
                    onClick={() => setPreview(p)}
                    aria-label={`Preview supplied ${p.title} project image`}
                  >
                    <img
                      src={p.image}
                      alt={`${p.title} project artwork supplied by ${'Benayaram Rekha'}`}
                      width="1000"
                      height="620"
                      loading="lazy"
                    />
                    <span>
                      PROJECT SNAPSHOT <span>↗</span>
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className="work-footnote eyebrow">
            A selection of production, internal, and community applications.
          </p>
        </div>
      </section>
      {preview && (
        <MediaModal
          kind="image"
          src={preview.image}
          title={`${preview.title} · Project image`}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}

const componentStyles = `
@layer components {
/* Work */
.work {
  border-top: 1px solid var(--line);
}
.project-gallery {
  display: flex;
  gap: 9px;
  min-height: 590px;
}
.project-panel {
  display: flex;
  flex: 0 0 74px;
  border: 1px solid var(--line);
  background: #f0e6d6;
  border-radius: 22px;
  overflow: hidden;
  min-width: 0;
  transition:
    flex 0.7s var(--ease),
    background 0.5s;
}
.project-panel.expanded {
  flex: 1;
  background: var(--card);
  border-color: #b8d8d1;
}
.project-toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 74px;
  min-width: 74px;
  padding: 26px 13px;
  text-align: center;
}
.project-toggle > .eyebrow {
  font-size: 10px;
}
.project-spine-title {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 20px;
  letter-spacing: -0.03em;
}
.project-plus {
  border: 1px solid #c3bfb7;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 20px;
  transition: transform 0.4s;
}
.expanded .project-plus {
  transform: rotate(45deg);
}
.project-content {
  display: none;
  min-width: 0;
  flex: 1;
  padding: 35px 30px 26px 5px;
  gap: 20px;
}
.expanded .project-content {
  display: grid;
  grid-template-columns: 1fr;
  animation: reveal 0.7s var(--ease);
}
.project-description > .eyebrow {
  font-size: 8px;
  color: var(--mute);
}
.project-description h3 {
  font-size: 42px;
  font-weight: 500;
  letter-spacing: -0.055em;
  margin: 10px 0 12px;
}
.project-description > p:not(.eyebrow):not(.project-status) {
  font-size: 13px;
  color: var(--mute);
  line-height: 1.7;
  max-width: 560px;
}
.feature-list {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 18px;
  margin: 20px 0;
}
.feature-list li {
  font-size: 10px;
  display: flex;
  gap: 7px;
}
.feature-list li:before {
  content: '↗';
  color: var(--mute);
}
.tech-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.tech-chips > span {
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 8px;
  padding: 5px 8px;
  border-radius: 30px;
}
.project-actions {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;
}
.project-actions .button {
  font-size: 11px;
  min-height: 39px;
  padding: 10px 17px;
}
.unavailable {
  color: var(--mute);
}
.project-status {
  font-size: 9px !important;
  color: var(--mute);
  margin-top: 12px;
  display: flex;
  gap: 6px;
  align-items: center;
}
.project-status .status-dot { color: var(--accent-2); }
.project-image {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  background: var(--paper);
  border-radius: 12px;
  overflow: hidden;
  min-height: 180px;
  width: 100%;
  border: 0;
  color: inherit;
  text-align: left;
  cursor: zoom-in;
}
.project-image img {
  width: 100%;
  height: 190px;
  object-fit: contain;
  filter: saturate(1.1) contrast(1.02);
  padding: 10px;
  transition: transform 0.6s var(--ease);
}
.project-image:hover img {
  transform: scale(1.025);
}
.project-image > span {
  display: flex;
  justify-content: space-between;
  padding: 12px 17px;
  font-family: var(--font-mono);
  font-size: 8px;
  border-top: 1px solid var(--line);
  letter-spacing: 0.1em;
}
.work-footnote {
  margin-top: 24px;
  font-size: 9px;
  color: var(--mute);
}
}
`;
