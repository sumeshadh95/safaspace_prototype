import { Check, CloudUpload, Trash2 } from 'lucide-react';
import type { PhoneFile } from '../data/files';
import { formatDate, formatSize } from '../lib/format';
import { FileThumb, StatusBadge } from './ui';

interface Props {
  file: PhoneFile;
  saved: boolean;
  selected: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onUpload: () => void;
  onDelete: () => void;
}

export function SelectCircle({ selected, onToggle, label }: { selected: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      role="checkbox"
      aria-checked={selected}
      aria-label={label}
      onClick={onToggle}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full border-[2.5px] transition-colors ${
          selected ? 'border-primary bg-primary text-white' : 'border-muted bg-card'
        }`}
      >
        {selected && <Check size={18} strokeWidth={3.4} aria-hidden />}
      </span>
    </button>
  );
}

export function FileRow({ file, saved, selected, onToggle, onOpen, onUpload, onDelete }: Props) {
  return (
    <li className={`flex items-center gap-1 rounded-[20px] py-2.5 pr-2 pl-0 transition-colors ${selected ? 'bg-blue-soft ring-2 ring-blue/35' : 'bg-card shadow-[var(--shadow-card)]'}`}>
      <SelectCircle selected={selected} onToggle={onToggle} label={`Select ${file.name}`} />

      <button onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl text-left" aria-label={`Open ${file.name}`}>
        <FileThumb file={file} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[17px] leading-snug font-bold text-ink" title={file.name}>
            {file.name}
          </span>
          <span className="block text-[16px] leading-snug text-ink-2">{formatDate(file.date)}</span>
          <span className="block text-[16px] leading-snug text-ink-2">{formatSize(file.sizeMB)}</span>
          <span className="mt-1 block">
            <StatusBadge saved={saved} />
          </span>
        </span>
      </button>

      <div className="flex shrink-0 flex-col gap-3">
        {saved ? (
          <button disabled className="flex h-12 w-[92px] items-center justify-center gap-1.5 rounded-[14px] bg-green-soft text-[16px] font-bold text-green" aria-label="Already saved in cloud">
            Saved
            <Check size={18} strokeWidth={3} aria-hidden />
          </button>
        ) : (
          <button onClick={onUpload} className="flex h-12 w-[92px] items-center justify-center gap-1.5 rounded-[14px] bg-primary text-[16px] font-bold text-white hover:bg-primary-hover" aria-label={`Upload ${file.name}`}>
            <CloudUpload size={19} strokeWidth={2.4} aria-hidden />
            Upload
          </button>
        )}
        <button onClick={onDelete} className="flex h-12 w-[92px] items-center justify-center gap-1.5 rounded-[14px] border-2 border-red bg-card text-[16px] font-bold text-red hover:bg-red-soft" aria-label={`Delete ${file.name}`}>
          <Trash2 size={18} strokeWidth={2.4} aria-hidden />
          Delete
        </button>
      </div>
    </li>
  );
}
