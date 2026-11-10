import { useEffect, useState } from 'react';
import { BatteryMedium, CircleCheck } from 'lucide-react';
import { BATTERY } from '../lib/settings';
import { TAKEOVER, type Takeover } from '../lib/system';
import { clockText, useNow } from '../lib/useNow';

/**
 * The phone's own panel while power saving switches on or off. It slides down from the top like
 * Android's notification panel, the screen goes dark behind it, and then the new home screen
 * appears. It uses the phone's font and colours, never SafeSpace's, so it reads as "the phone".
 */
export function SystemTakeover({ kind }: { kind: Takeover }) {
  const now = useNow();
  const [done, setDone] = useState(false);
  const on = kind === 'saver-on';

  useEffect(() => {
    const t = setTimeout(() => setDone(true), TAKEOVER.doneMs);
    return () => clearTimeout(t);
  }, []);

  return (
    <div data-takeover className="font-system absolute inset-0 z-[60] text-white">
      <div className="takeover-dim absolute inset-0 bg-black" />
      <div className="shade absolute inset-x-0 top-0 rounded-b-[32px] bg-[#1F2427] px-6 pt-[max(16px,env(safe-area-inset-top))] pb-4 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.75)] sm:pt-[10px]">
        <div aria-hidden className="flex h-[26px] items-center justify-between text-[15px] font-medium text-white/80">
          <span className="tabular-nums">{clockText(now)}</span>
          <span className="tabular-nums">{BATTERY.percent}%</span>
        </div>

        <div role="status" aria-live="polite" className="mt-5 flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#2E8B5A]" aria-hidden>
            <BatteryMedium size={30} strokeWidth={2.2} />
          </span>
          <span>
            <span className="block text-[24px] leading-tight font-bold">Power saving mode</span>
            <span className="mt-1 flex items-center gap-1.5 text-[19px] text-[#BFE8CF]">
              {done && <CircleCheck size={20} strokeWidth={2.4} aria-hidden />}
              {done ? (on ? 'Power saving is on' : 'Power saving is off') : on ? 'Turning on…' : 'Turning off…'}
            </span>
          </span>
        </div>
        <div aria-hidden className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
          <div className="takeover-fill h-full rounded-full bg-[#5CC48A]" />
        </div>
        <p className="mt-5 text-[17px] leading-snug text-[#C9D2D4]">
          {on ? 'SafeSpace will close. Your phone will show only the most important apps.' : 'Your phone goes back to normal.'}
        </p>
        {/* grab handle, like the phone's notification panel */}
        <span aria-hidden className="mx-auto mt-5 block h-1 w-10 rounded-full bg-white/30" />
      </div>
    </div>
  );
}
