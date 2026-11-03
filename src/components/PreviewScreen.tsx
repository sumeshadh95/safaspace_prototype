import { useEffect, useRef } from 'react';
import { Check, CloudUpload, Trash2 } from 'lucide-react';
import type { PhoneFile } from '../data/files';
import type { FileStatus } from '../services/cloud';
import { formatDate, formatSize } from '../lib/format';
import { BackButton, FileThumb, PlayBadge, StatusBadge } from './ui';

interface Props {
  file: PhoneFile;
  status: FileStatus;
  onClose: () => void;
  onUpload: () => void;
  onDelete: () => void;
}

/** Big view of one file, so you can see what you are about to delete. */
export function PreviewScreen({ file, status, onClose, onUpload, onDelete }: Props) {
  const saved = status === 'phone-and-cloud';
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="preview-title" className="fade-in scroll-area fixed inset-0 z-30 flex flex-col overflow-y-auto bg-bg">
      <div className="px-5 pt-[max(16px,env(safe-area-inset-top))]">
        <BackButton onClick={onClose} />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-56">
        <div className="mt-3 overflow-hidden rounded-[22px] bg-card shadow-[var(--shadow-card)]">
          {file.path ? (
            <div className="relative aspect-[4/3] w-full bg-track">
              <img src={file.path} alt={`${file.type === 'video' ? 'Video' : 'Photo'} from ${formatDate(file.date)}`} className="h-full w-full object-cover" />
              {file.type === 'video' && <PlayBadge size={84} />}
            </div>
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-orange-soft">
              <FileThumb file={file} size={140} radius={28} />
            </div>
          )}
        </div>

        <h1 id="preview-title" ref={heading} tabIndex={-1} className="mt-5 text-[24px] leading-tight font-bold break-words outline-none">
          {file.name}
        </h1>
        <p className="mt-1 text-[19px] text-ink-2">
          {formatDate(file.date)} · {formatSize(file.sizeMB)}
        </p>
        <div className="mt-3">
          <StatusBadge saved={saved} />
        </div>

        <div className="flex flex-col gap-3 pt-8">
          {saved ? (
            <div className="flex h-[68px] items-center justify-center gap-2 rounded-[20px] bg-green-soft text-[22px] font-bold text-green">
              <Check size={26} strokeWidth={3} aria-hidden />
              Saved in cloud
            </div>
          ) : (
            <button onClick={onUpload} className="flex h-[68px] items-center justify-center gap-3 glow-primary rounded-[20px] bg-primary text-[22px] font-bold text-white hover:bg-primary-hover">
              <CloudUpload size={28} strokeWidth={2.4} aria-hidden />
              Upload
            </button>
          )}
          <button onClick={onDelete} className="flex h-[60px] items-center justify-center gap-3 rounded-[20px] border-2 border-red bg-card text-[20px] font-bold text-red hover:bg-red-soft">
            <Trash2 size={24} strokeWidth={2.4} aria-hidden />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
