import { useEffect, useRef, useState } from 'react';
import { Check, Shield } from 'lucide-react';
import { ProgressBar, TYPE_STYLE } from '../components/ui';
import { CATEGORIES, FILES } from '../data/files';
import { plural } from '../lib/format';
import { Logo, PhoneIllustration } from './HomeScreen';

const SCAN_MS = 3000;

// Each kind of file is "done" when the progress passes its mark, so Robert sees what is happening.
const STEPS = CATEGORIES.map((c, i) => ({ ...c, at: (i + 1) / CATEGORIES.length - 0.02, count: FILES.filter((f) => f.type === c.type).length }));

export function ScanningScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const start = performance.now();
    const t = setInterval(() => {
      const p = Math.min(1, (performance.now() - start) / SCAN_MS);
      setProgress(p);
      if (p >= 1) {
        clearInterval(t);
        setTimeout(() => done.current(), 350);
      }
    }, 60);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex min-h-full flex-col px-6 pt-[max(20px,env(safe-area-inset-top))] pb-8">
      <div className="flex min-h-[48px] items-center">
        <Logo />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <PhoneIllustration pulse />
        <h1 className="mt-10 text-[28px] leading-tight font-bold" aria-live="polite">
          Looking at your photos and files…
        </h1>
        <p className="mt-3 flex items-center gap-2 text-[19px] text-ink-2">
          <Shield size={20} strokeWidth={2.2} className="text-green" aria-hidden />
          Nothing will be deleted.
        </p>
        <div className="mt-8 w-full">
          <ProgressBar value={progress} tone="blue" label="Checking your phone" height={14} />
        </div>
        <ul className="mt-6 flex w-full flex-col gap-2.5 text-left">
          {STEPS.map((s, i) => {
            const finished = progress >= s.at;
            const active = !finished && (i === 0 || progress >= STEPS[i - 1].at);
            const { icon: Icon, tile, color } = TYPE_STYLE[s.type];
            return (
              <li key={s.type} className={`flex items-center gap-3 rounded-[18px] bg-card px-4 py-3 shadow-[var(--shadow-card)] transition-opacity ${finished || active ? 'opacity-100' : 'opacity-60'}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tile} ${color}`} aria-hidden>
                  <Icon size={21} strokeWidth={2.2} />
                </span>
                <span className="flex-1 text-[18px] font-bold text-ink">{s.title}</span>
                {finished ? (
                  <span className="flex items-center gap-1.5 text-[16px] font-bold text-green">
                    <Check size={18} strokeWidth={3} aria-hidden />
                    {plural(s.count, s.type)}
                  </span>
                ) : (
                  <span className="text-[16px] text-muted">{active ? 'Looking…' : 'Waiting'}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
