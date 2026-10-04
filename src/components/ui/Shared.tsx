import type { ReactNode } from 'react';
export function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      style={down ? { transform: 'rotate(90deg)' } : undefined}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
export function SectionHeading({
  index,
  label,
  children,
  accent,
}: {
  index: string;
  label: string;
  children: ReactNode;
  accent: string;
}) {
  return (
    <div className="section-heading rv">
      <p className="eyebrow">
        {index} <span>—</span> {label}
      </p>
      <h2>
        {children} <em>{accent}</em>
      </h2>
    </div>
  );
}
export function ExternalLink({
  href,
  children,
  className = 'text-link',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
