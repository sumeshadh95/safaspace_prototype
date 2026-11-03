import { ChevronRight } from 'lucide-react';
import type { FileType } from '../data/files';
import type { CategoryStats } from '../lib/usePhone';
import { formatSize, plural } from '../lib/format';
import { SavedCheck, TYPE_STYLE } from './ui';

export function CategoryCard({ type, title, stats, onOpen }: { type: FileType; title: string; stats: CategoryStats; onOpen: () => void }) {
  const { icon: Icon, tile, color } = TYPE_STYLE[type];
  const count = stats.files.length;
  const ratio = count ? stats.saved / count : 0;
  return (
    <button
      onClick={onOpen}
      className="flex w-full items-center gap-4 rounded-[22px] bg-card py-5 pr-3 pl-[18px] text-left shadow-[var(--shadow-card)] transition-shadow hover:shadow-[0_1px_2px_rgba(23,38,42,.08),0_12px_28px_rgba(23,38,42,.09)]"
      aria-label={`${title}: ${plural(count, type)}, ${formatSize(stats.sizeMB)}, ${stats.saved} of ${count} saved in cloud`}
    >
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${tile} ${color}`} aria-hidden>
        <Icon size={28} strokeWidth={2.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[21px] leading-tight font-bold text-ink">{title}</span>
          <span className="shrink-0 text-[17px] text-ink-2">{formatSize(stats.sizeMB)}</span>
        </span>
        <span className="mt-1 block text-[18px] text-ink-2">{plural(count, type)}</span>
        <span className="mt-2 block h-2.5 overflow-hidden rounded-full bg-unsaved" aria-hidden>
          <span className="block h-full rounded-full bg-green-fill transition-[width] duration-700" style={{ width: `${ratio * 100}%` }} />
        </span>
        <span className="mt-1.5 block text-[17px] leading-snug">
          <SavedCheck>
            {stats.saved} of {count} saved in cloud
          </SavedCheck>
        </span>
      </span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card-2 text-muted" aria-hidden>
        <ChevronRight size={22} strokeWidth={2.6} />
      </span>
    </button>
  );
}
