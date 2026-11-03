// Shared building blocks: buttons, logo, section headings, reveal-on-scroll.
import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowRight, Play, ShieldCheck } from 'lucide-react';
import { PROTOTYPE_URL } from '../config';
import { brand, cta } from '../content';

/** "Try the demo →" — always opens the prototype in a new tab. */
export function DemoButton({
  size = 'lg',
  tone = 'blue',
  compact = false,
  className = '',
}: {
  size?: 'sm' | 'lg';
  tone?: 'blue' | 'white';
  /** In the header: the arrow hides on very small screens so everything fits. */
  compact?: boolean;
  className?: string;
}) {
  const sizes = { sm: 'min-h-[48px] px-5 text-[17px]', lg: 'min-h-[60px] px-7 text-[20px]' };
  const tones = {
    blue: 'bg-blue text-white shadow-[0_10px_24px_-10px_rgba(36,72,168,0.8)] hover:bg-blue-dark hover:shadow-[0_16px_32px_-12px_rgba(36,72,168,0.85)]',
    white: 'bg-white text-blue shadow-[0_16px_36px_-14px_rgba(8,16,48,0.6)] hover:bg-blue-soft',
  };
  return (
    <a
      href={PROTOTYPE_URL}
      target="_blank"
      rel="noopener"
      data-cta="demo"
      className={`group inline-flex items-center justify-center gap-2.5 rounded-2xl font-bold whitespace-nowrap transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 ${sizes[size]} ${tones[tone]} ${className}`}
    >
      {cta.demo}
      <ArrowRight
        size={size === 'lg' ? 22 : 19}
        strokeWidth={2.6}
        className={`transition-transform duration-200 group-hover:translate-x-1 ${compact ? 'hidden min-[400px]:block' : ''}`}
        aria-hidden
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function HowItWorksButton({ className = '' }: { className?: string }) {
  return (
    <a
      href="#how-it-works"
      className={`group inline-flex min-h-[60px] items-center justify-center gap-3 rounded-2xl border-2 border-blue bg-white pr-7 pl-4 text-[20px] font-bold whitespace-nowrap text-blue transition-colors hover:bg-blue-soft ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-soft transition-colors group-hover:bg-white" aria-hidden>
        <Play size={14} strokeWidth={2.6} fill="currentColor" className="ml-0.5" />
      </span>
      {cta.howItWorks}
    </a>
  );
}

export function Logo({ light = false, tagline = true, small = false }: { light?: boolean; tagline?: boolean; small?: boolean }) {
  return (
    <span className={`flex items-center ${small ? 'gap-2' : 'gap-3'}`}>
      <span
        className={`flex ${small ? 'h-10 w-10' : 'h-11 w-11'} shrink-0 items-center justify-center rounded-xl ${
          light ? 'bg-white/10 text-white ring-1 ring-white/15' : 'bg-green-soft text-green ring-1 ring-green/10'
        }`}
        aria-hidden
      >
        <ShieldCheck size={24} strokeWidth={2.2} />
      </span>
      <span className="leading-tight">
        <span className={`block ${small ? 'text-[18px] min-[400px]:text-[20px]' : 'text-[21px]'} font-bold tracking-[-0.01em] ${light ? 'text-white' : 'text-ink'}`}>
          {brand.name}
        </span>
        {tagline && <span className={`block text-[14px] ${light ? 'text-white/75' : 'text-ink-2'}`}>{brand.tagline}</span>}
      </span>
    </span>
  );
}

/** Small label above a section title, with a short line for rhythm. */
export function Eyebrow({ children, center = false, tone = 'blue' }: { children: ReactNode; center?: boolean; tone?: 'blue' | 'green' }) {
  const line = <span className="h-[3px] w-7 rounded-full bg-current opacity-60" aria-hidden />;
  return (
    <p className={`flex items-center gap-3 text-[16px] font-bold tracking-[0.04em] ${tone === 'green' ? 'text-green' : 'text-blue'} ${center ? 'justify-center' : ''}`}>
      {line}
      {children}
      {center && line}
    </p>
  );
}

export function SectionTitle({
  id,
  eyebrow,
  title,
  subtitle,
  center = false,
  tone,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  tone?: 'blue' | 'green';
}) {
  return (
    <div className={center ? 'mx-auto max-w-[760px] text-center' : 'max-w-[680px]'}>
      {eyebrow && (
        <Eyebrow center={center} tone={tone}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2 id={id} className={`${eyebrow ? 'mt-4' : ''} text-[34px] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-ink sm:text-[44px]`}>
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-[20px] leading-[1.55] text-pretty text-ink-2">{subtitle}</p>}
    </div>
  );
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${className}`}>{children}</div>;
}

/** Adds the fade-up class and reveals the element once it scrolls into view. */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add('is-visible');
    // Already on screen (or scrolled past) when the page loads: show it right away.
    if (!('IntersectionObserver' in window) || el.getBoundingClientRect().top < window.innerHeight) {
      show();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        // Also reveal blocks that were jumped past (e.g. with a menu link).
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          show();
          io.disconnect();
        }
      },
      // A threshold (not a negative margin), so blocks at the very bottom of the page still appear.
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

export const TILE = {
  blue: 'bg-blue-soft text-blue',
  violet: 'bg-violet-soft text-violet',
  orange: 'bg-orange-soft text-orange-ink',
  green: 'bg-green-soft text-green',
};
