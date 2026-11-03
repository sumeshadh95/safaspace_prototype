import { useEffect } from 'react';
import { CircleCheck, Undo2 } from 'lucide-react';

export interface ToastData {
  key: number;
  title: string;
  detail?: string;
  onUndo?: () => void;
}

const UNDO_MS = 8000;
const PLAIN_MS = 5000;

/** Large message at the bottom. Removals get a big Undo button for 8 seconds. */
export function UndoToast({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, toast.onUndo ? UNDO_MS : PLAIN_MS);
    return () => clearTimeout(t);
  }, [toast.key]);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[35] px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
      <div
        role="status"
        aria-live="polite"
        className="rise-in pointer-events-auto rounded-[22px] bg-toast px-5 py-4 text-white shadow-[0_12px_32px_rgba(10,20,24,0.35)] ring-1 ring-white/10"
      >
        <div className="flex items-start gap-3">
          <CircleCheck size={28} strokeWidth={2.2} className="mt-0.5 shrink-0 text-[#8FD3AE]" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-[20px] leading-snug font-bold">{toast.title}</p>
            {toast.detail && <p className="mt-0.5 text-[17px] leading-snug text-white/90">{toast.detail}</p>}
          </div>
        </div>
        {toast.onUndo && (
          <button
            onClick={() => {
              toast.onUndo?.();
              onDismiss();
            }}
            className="mt-3 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-[20px] font-bold text-primary hover:bg-[#E6EEF9]"
          >
            <Undo2 size={24} strokeWidth={2.6} aria-hidden />
            Undo
          </button>
        )}
      </div>
    </div>
  );
}
