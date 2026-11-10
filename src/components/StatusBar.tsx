import { BATTERY } from '../lib/settings';
import { clockText, useNow } from '../lib/useNow';

/** `app`: SafeSpace's colours · `black`: power saving · `clear`: over the home screen wallpaper. */
export type StatusTone = 'app' | 'black' | 'clear';

const TONES: Record<StatusTone, string> = {
  app: 'bg-bg text-ink',
  black: 'bg-black text-white',
  clear: 'bg-transparent text-white',
};

/**
 * The phone's status bar (time, camera, signal, battery). Only drawn inside the laptop/projector
 * phone frame; on a real phone the phone's own status bar is already there.
 */
export function StatusBar({ tone, powerSaving }: { tone: StatusTone; powerSaving: boolean }) {
  const now = useNow();
  return (
    <div
      aria-hidden
      className={`font-system absolute inset-x-0 top-0 z-50 hidden h-[36px] items-center justify-between px-8 text-[14px] font-medium transition-colors duration-300 sm:flex ${TONES[tone]}`}
    >
      <span className="tabular-nums">{clockText(now)}</span>
      <span className="absolute top-1/2 left-1/2 h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#55687A_0%,#1C252C_32%,#050708_70%)] shadow-[0_0_0_1.5px_rgba(0,0,0,0.25)]" />
      <span className="flex items-center gap-1.5">
        <svg width="34" height="11" viewBox="0 0 34 11" fill="currentColor">
          <rect x="0" y="8" width="2.2" height="3" rx="0.7" />
          <rect x="3.4" y="6" width="2.2" height="5" rx="0.7" />
          <rect x="6.8" y="4" width="2.2" height="7" rx="0.7" />
          <rect x="10.2" y="2" width="2.2" height="9" rx="0.7" />
          <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M17.2 4.4 A8.4 8.4 0 0 1 29 4.4" />
            <path d="M19.3 6.7 A5.4 5.4 0 0 1 26.9 6.7" />
          </g>
          <circle cx="23.1" cy="9.4" r="1.3" />
        </svg>
        <span className="tabular-nums">{BATTERY.percent}%</span>
        <svg width="24" height="12" viewBox="0 0 24 12">
          <rect x="0.75" y="0.75" width="20" height="10.5" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
          <rect x="2.5" y="2.5" width={16.5 * (BATTERY.percent / 100)} height="7" rx="1.6" fill={powerSaving ? '#3A9D68' : 'currentColor'} />
          <rect x="21.6" y="4" width="1.8" height="4" rx="0.8" fill="currentColor" fillOpacity="0.55" />
        </svg>
      </span>
    </div>
  );
}
