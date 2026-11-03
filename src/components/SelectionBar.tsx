import { CloudUpload, Trash2, X } from 'lucide-react';
import { formatSize } from '../lib/format';

interface Props {
  count: number;
  sizeMB: number;
  canUpload: boolean;
  onUpload: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

/** Sticks to the bottom while files are selected. */
export function SelectionBar({ count, sizeMB, canUpload, onUpload, onDelete, onCancel }: Props) {
  return (
    <div className="rise-in sticky bottom-0 z-20 mt-4 rounded-t-[24px] border-t border-line bg-card/95 px-5 backdrop-blur pt-3 pb-[max(14px,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(23,38,42,0.08)]">
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-bold text-ink" aria-live="polite">
          {count} selected · {formatSize(sizeMB)}
        </p>
        <button onClick={onCancel} className="flex min-h-[48px] items-center gap-1.5 rounded-2xl px-3 text-[18px] font-bold text-ink-2 hover:bg-ink/5">
          <X size={20} strokeWidth={2.6} aria-hidden />
          Cancel
        </button>
      </div>
      <div className="mt-2 flex gap-3">
        <button
          onClick={onUpload}
          disabled={!canUpload}
          className="flex h-14 flex-1 items-center justify-center gap-2 glow-primary rounded-[18px] bg-primary text-[19px] font-bold text-white hover:bg-primary-hover disabled:bg-green-soft disabled:text-green disabled:shadow-none"
        >
          <CloudUpload size={22} strokeWidth={2.4} aria-hidden />
          {canUpload ? 'Upload' : 'All saved'}
        </button>
        <button
          onClick={onDelete}
          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-[18px] border-2 border-red bg-card text-[19px] font-bold text-red hover:bg-red-soft"
        >
          <Trash2 size={21} strokeWidth={2.4} aria-hidden />
          Delete
        </button>
      </div>
    </div>
  );
}
