// Small shared building blocks: buttons, badges, progress bar, file icons.
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowLeft, Check, Cloud, CloudCheck, ExternalLink, FileSpreadsheet, FileText, Image, Play, Smartphone, SquarePlay, type LucideIcon } from 'lucide-react';
import type { FileType, PhoneFile } from '../data/files';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { icon?: LucideIcon; children: ReactNode };

/** The one big main action: 68px tall, 22px bold text. */
export function PrimaryButton({ icon: Icon, children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`flex h-[68px] w-full items-center justify-center gap-3 glow-primary rounded-[20px] bg-primary px-6 text-[22px] font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-60 ${className}`}
    >
      {Icon && <Icon size={28} strokeWidth={2.6} aria-hidden />}
      {children}
    </button>
  );
}

/** Outlined secondary action, 60px tall. */
export function SecondaryButton({ icon: Icon, children, className = '', tone = 'ink', ...rest }: ButtonProps & { tone?: 'ink' | 'blue' | 'red' }) {
  const tones = {
    ink: 'border-outline text-ink hover:bg-card',
    blue: 'border-blue text-blue hover:bg-blue-soft',
    red: 'border-red text-red hover:bg-red-soft',
  };
  return (
    <button
      {...rest}
      className={`flex min-h-[60px] w-full items-center justify-center gap-3 rounded-[20px] border-2 bg-transparent px-5 text-[20px] font-bold transition-colors ${tones[tone]} ${className}`}
    >
      {Icon && <Icon size={24} strokeWidth={2.4} aria-hidden />}
      {children}
    </button>
  );
}

export function TextButton({ children, className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={`min-h-[52px] w-full rounded-2xl px-4 text-[20px] font-bold text-ink-2 hover:bg-ink/5 ${className}`}>
      {children}
    </button>
  );
}

export function ProgressBar({ value, tone = 'green', label, height = 12 }: { value: number; tone?: 'green' | 'blue' | 'orange'; label: string; height?: number }) {
  const fill = { green: 'bg-green-fill', blue: 'bg-primary', orange: 'bg-orange' }[tone];
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      className="w-full overflow-hidden rounded-full bg-track"
      style={{ height }}
    >
      <div className={`h-full rounded-full ${fill} transition-[width] duration-200 ease-linear`} style={{ width: `${Math.min(100, value * 100)}%` }} />
    </div>
  );
}

export function StatusBadge({ saved }: { saved: boolean }) {
  return saved ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-soft px-2 py-1 text-[14px] leading-tight font-bold whitespace-nowrap text-green">
      <CloudCheck size={16} strokeWidth={2.4} aria-hidden />
      Saved in cloud
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-soft px-2 py-1 text-[14px] leading-tight font-bold whitespace-nowrap text-orange-ink">
      <Smartphone size={16} strokeWidth={2.4} aria-hidden />
      Only on phone
    </span>
  );
}

export const TYPE_STYLE: Record<FileType, { icon: LucideIcon; tile: string; color: string }> = {
  photo: { icon: Image, tile: 'bg-blue-soft', color: 'text-blue' },
  video: { icon: SquarePlay, tile: 'bg-violet-soft', color: 'text-violet' },
  document: { icon: FileText, tile: 'bg-orange-soft', color: 'text-orange-ink' },
};

/** Thumbnail for photos/videos, a file-type icon for documents. */
export function FileThumb({ file, size = 56, radius = 14 }: { file: PhoneFile; size?: number; radius?: number }) {
  if (file.thumb) {
    return (
      <div className="relative shrink-0 overflow-hidden bg-track" style={{ width: size, height: size, borderRadius: radius }}>
        <img src={file.thumb} alt="" loading="lazy" className="h-full w-full object-cover" draggable={false} />
        {file.type === 'video' && <PlayBadge size={size * 0.46} />}
      </div>
    );
  }
  const Icon = /\.xlsx$/i.test(file.name) ? FileSpreadsheet : FileText;
  const ext = file.name.split('.').pop()?.toUpperCase();
  return (
    <div
      className="flex shrink-0 flex-col items-center justify-center bg-orange-soft text-orange-ink"
      style={{ width: size, height: size, borderRadius: radius }}
      aria-hidden
    >
      <Icon size={size * 0.43} strokeWidth={2} />
      <span className="mt-0.5 font-bold leading-none" style={{ fontSize: Math.max(10, size * 0.19) }}>
        {ext}
      </span>
    </div>
  );
}

export function PlayBadge({ size }: { size: number }) {
  return (
    <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
      <span className="flex items-center justify-center rounded-full bg-black/55 text-white" style={{ width: size, height: size }}>
        <Play size={size * 0.5} fill="currentColor" strokeWidth={0} style={{ marginLeft: size * 0.06 }} />
      </span>
    </span>
  );
}

export function SavedCheck({ children }: { children: ReactNode }) {
  return (
    <span className="font-bold text-green">
      <Check size={18} strokeWidth={3.2} className="mr-1 inline align-[-3px]" aria-hidden />
      {children}
    </span>
  );
}

/** Opens Robert's cloud (#/cloud) in a new tab, so it can sit next to the app. */
export function CloudLink({ label = 'See my cloud', className = '' }: { label?: string; className?: string }) {
  return (
    <a
      href="#/cloud"
      target="_blank"
      rel="noopener"
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[16px] border-2 border-green bg-card px-4 text-[18px] font-bold text-green hover:bg-green-soft ${className}`}
    >
      <Cloud size={22} strokeWidth={2.4} aria-hidden />
      {label}
      <ExternalLink size={16} strokeWidth={2.4} aria-hidden />
    </a>
  );
}

/** "← Back" with text, never just an arrow. */
export function BackButton({ onClick, label = 'Back' }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="-ml-2 inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-2 text-[20px] font-bold text-blue hover:bg-blue-soft">
      <ArrowLeft size={26} strokeWidth={2.6} aria-hidden />
      {label}
    </button>
  );
}
