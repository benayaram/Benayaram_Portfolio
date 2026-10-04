'use client';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { PROJECTS, SKILL_GROUPS } from '@/lib/data';
import TechLogo from '../ui/TechLogo';
import { SectionHeading } from '../ui/Shared';
const families = ['All', ...new Set(SKILL_GROUPS.map((s) => s.family))];
export default function Skills() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(SKILL_GROUPS[0]);
  const projects = PROJECTS.filter((p) => p.tech.includes(selected.name));
  return (
    <>
      <style>{componentStyles}</style>
      <section id="skills" className="section skills">
        <div className="container">
          <div className="heading-row">
            <SectionHeading index="02" label="Tools of the trade" accent="toolkit.">
              The tools in my
            </SectionHeading>
            <p className="section-aside rv">
              The technologies I use to build mobile,
              <br />
              web, and Android applications.
            </p>
          </div>
          <div className="skill-filters" role="group" aria-label="Filter skills by family">
            {families.map((f) => (
              <button
                className={`filter-chip ${filter === f ? 'selected' : ''}`}
                key={f}
                aria-pressed={filter === f}
                onClick={() => {
                  setFilter(f);
                  const next = SKILL_GROUPS.find((s) => f === 'All' || s.family === f);
                  if (next) setSelected(next);
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="skills-layout">
            <div className="periodic-grid">
              {SKILL_GROUPS.map((s, i) => (
                <button
                  key={s.name}
                  onPointerEnter={() => setSelected(s)}
                  onFocus={() => setSelected(s)}
                  onClick={() => setSelected(s)}
                  className={`element rv ${selected.name === s.name ? 'chosen' : ''} ${filter !== 'All' && filter !== s.family ? 'dimmed' : ''}`}
                  style={{ '--i': (Math.floor(i / 8) + (i % 8)) * 0.35 } as CSSProperties}
                  aria-label={`${s.name}, ${s.family}`}
                  aria-pressed={selected.name === s.name}
                >
                  <span className="element-number">{String(i + 1).padStart(2, '0')}</span>
                  <strong>{s.symbol}</strong>
                  <span className="element-name">{s.name}</span>
                  <span className="element-family">{s.family}</span>
                </button>
              ))}
            </div>
            <aside className="skill-inspector" aria-live="polite">
              <p className="eyebrow">
                Element in focus <span>↗</span>
              </p>
              <div className="inspector-logo" key={selected.name}>
                <TechLogo name={selected.logo ?? 'code'} size={120} />
              </div>
              <span className="eyebrow">{selected.family}</span>
              <h3>{selected.name}</h3>
              <div className="inspector-projects">
                <p className="eyebrow">{projects.length ? 'Used in' : 'Part of my'}</p>
                {projects.length ? (
                  projects.map((p) => (
                    <a key={p.id} href="#work">
                      {p.title}
                      <span>↗</span>
                    </a>
                  ))
                ) : (
                  <p>Development toolkit</p>
                )}
              </div>
              <p className="inspector-hint">Hover, focus, or tap an element to explore.</p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

const componentStyles = `
@layer components {
/* Skills */
.skills {
  border-top: 1px solid var(--line);
}
.skill-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}
.filter-chip {
  font-size: 11px;
  padding: 10px 17px;
  border: 1px solid var(--line);
  border-radius: 999px;
  transition:
    background 0.3s,
    color 0.3s;
}
.filter-chip:hover {
  border-color: var(--ink);
}
.filter-chip.selected {
  background: var(--accent);
  color: white;
}
.skills-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 24px;
  align-items: start;
}
.periodic-grid {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 7px;
}
.element {
  position: relative;
  background: var(--card);
  min-height: 113px;
  border: 1px solid #dcd8d1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 9px 10px;
  text-align: left;
  transition:
    background 0.3s,
    opacity 0.3s,
    transform 0.3s;
}
.element-number {
  font-family: var(--font-mono);
  font-size: 7px;
  color: var(--mute);
}
.element strong {
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 1.15;
  margin-top: 5px;
}
.element-name {
  font-size: 8px;
  margin-top: 4px;
  line-height: 1.2;
  overflow-wrap: anywhere;
}
.element-family {
  font-size: 6px;
  color: var(--mute);
  margin-top: auto;
  padding-top: 5px;
}
.element.chosen {
  background: var(--accent-2);
  color: white;
  border-color: var(--ink);
}
.element.chosen .element-number,
.element.chosen .element-family {
  color: #d0cec8;
}
.element.dimmed {
  opacity: 0.3;
}
.element:hover {
  transform: translateY(-3px);
  opacity: 1;
  border-color: var(--accent);
}
.skill-inspector {
  position: sticky;
  top: 110px;
  background: var(--card);
  border-top: 4px solid var(--accent-2);
  border-radius: 22px;
  padding: 24px;
  border: 1px solid var(--line);
  min-height: 418px;
}
.skill-inspector > .eyebrow {
  font-size: 9px;
}
.skill-inspector > .eyebrow:first-child {
  display: flex;
  justify-content: space-between;
}
.inspector-logo {
  display: grid;
  place-items: center;
  height: 180px;
  animation: pop 0.5s var(--ease);
}
.skill-inspector h3 {
  font-size: 31px;
  font-weight: 500;
  letter-spacing: -0.045em;
  margin: 3px 0 24px;
}
.inspector-projects {
  border-top: 1px solid var(--line);
  padding-top: 16px;
  font-size: 13px;
  line-height: 1.8;
}
.inspector-projects > .eyebrow {
  color: var(--mute);
  font-size: 8px;
  margin-bottom: 8px;
}
.inspector-projects a {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}
.inspector-projects a:hover {
  text-decoration: underline;
}
.inspector-hint {
  font-size: 9px;
  color: var(--mute);
  margin-top: 24px;
  line-height: 1.6;
}
}
`;
