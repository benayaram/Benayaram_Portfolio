'use client';
import { useEffect, useRef } from 'react';

type Props = {
  kind: 'image' | 'document';
  src: string;
  title: string;
  onClose: () => void;
  pages?: string[];
};

export default function MediaModal({ kind, src, title, onClose, pages }: Props) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      removeEventListener('keydown', onKey);
    };
  }, [onClose]);
  return (
    <div
      className="media-modal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="media-modal-panel">
        <div className="media-modal-toolbar">
          <span className="eyebrow">{title}</span>
          <button
            ref={closeButton}
            className="button secondary media-modal-close"
            onClick={onClose}
            aria-label="Close preview"
          >
            Close ×
          </button>
        </div>
        {kind === 'document' ? (
          pages?.length ? (
            <div className="resume-pages" aria-label="Resume pages">
              {pages.map((page, index) => (
                <img key={page} className="resume-page" src={page} alt={`${title}, page ${index + 1}`} />
              ))}
            </div>
          ) : (
            <object className="resume-preview" data={src} type="application/pdf">
              <iframe className="resume-preview" src={src} title={title} />
            </object>
          )
        ) : (
          <img className="image-preview" src={src} alt={title} />
        )}
      </div>
      <style>{styles}</style>
    </div>
  );
}

const styles = `
@layer components {
  .media-modal { position:fixed; inset:0; z-index:220; display:grid; place-items:center; padding:clamp(14px,4vw,56px); background:rgba(23,25,27,.62); backdrop-filter:blur(10px); animation:modal-in .25s var(--ease); }
  .media-modal-panel { width:min(100%,1100px); height:min(calc(100dvh - 32px),900px); max-height:calc(100dvh - 32px); min-height:0; display:flex; flex-direction:column; overflow:hidden; background:var(--paper); border:1px solid rgba(255,255,255,.3); border-radius:24px; box-shadow:0 30px 90px rgba(23,25,27,.3); }
  .media-modal-toolbar { display:flex; justify-content:space-between; align-items:center; gap:20px; padding:16px 20px; border-bottom:1px solid var(--line); flex-shrink:0; }
  .media-modal-toolbar .eyebrow { font-size:9px; }
  .media-modal-close { min-height:38px; padding:9px 16px; font-size:11px; }
  .image-preview { width:100%; height:100%; min-height:0; object-fit:contain; padding:20px; background:#f1eadf; }
  .resume-preview { width:100%; height:100%; min-height:0; border:0; background:white; }
  .resume-pages { flex:1 1 auto; min-height:0; overflow-y:auto; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; display:grid; align-content:start; gap:18px; padding:20px; background:#e7e0d6; }
  .resume-page { display:block; width:min(100%,820px); height:auto; margin:0 auto; background:#fff; box-shadow:0 12px 30px rgba(23,25,27,.16); }
  @keyframes modal-in { from { opacity:0; transform:scale(.98); } to { opacity:1; transform:scale(1); } }
}
`;
