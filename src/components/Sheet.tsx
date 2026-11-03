import { useEffect, useRef, type ReactNode } from 'react';

/** Bottom sheet inside the phone frame. */
export function Sheet({ title, onClose, children, labelledBy }: { title?: string; onClose?: () => void; children: ReactNode; labelledBy?: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>('button, [tabindex]')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close.current?.();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <div className="fade-in absolute inset-0 bg-scrim" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : title}
        aria-labelledby={labelledBy}
        className="sheet-in scroll-area relative max-h-[92%] overflow-y-auto rounded-t-[28px] bg-card px-6 pt-3 pb-[max(24px,env(safe-area-inset-bottom))] shadow-[var(--shadow-sheet)]"
      >
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-line" aria-hidden />
        {children}
      </div>
    </div>
  );
}
