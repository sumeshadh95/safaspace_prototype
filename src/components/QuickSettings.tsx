import { useEffect, useState } from 'react';
import { BatteryMedium, Check, Info, Moon } from 'lucide-react';
import { BATTERY, setTheme, useSettings } from '../lib/settings';
import { switchPowerSaving } from '../lib/system';
import { PrimaryButton, TextButton } from './ui';
import { Sheet } from './Sheet';

/** Shown when the dark mode switch can't be used: power saving keeps the phone dark. */
const LOCKED_NOTE = 'Not available in power saving';

/**
 * Moon with a backslash line through it, like other "can't be used" buttons. A gap in the colour
 * behind it (`--cut` on the parent) keeps the line clear of the moon.
 */
function MoonOff({ size }: { size: number }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }} aria-hidden>
      <Moon size={size} strokeWidth={2.4} />
      <svg className="absolute inset-0" width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
        <path d="M3 3l18 18" stroke="var(--cut)" strokeWidth="6.5" />
        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2.4" />
      </svg>
    </span>
  );
}

/**
 * Two quick buttons on Home: Dark mode (a switch) and Power saving. Always icon + text + On/Off.
 * While power saving is on, Dark mode is greyed out with a crossed-out moon and says why,
 * so nobody taps it in vain.
 */
export function QuickSettings({ className = '' }: { className?: string }) {
  const { theme, powerSaving } = useSettings();
  const [asking, setAsking] = useState(false);
  const dark = powerSaving || theme === 'dark';
  const locked = powerSaving;

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      <button
        role="switch"
        aria-checked={dark}
        aria-disabled={locked || undefined}
        onClick={() => !locked && setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`flex min-h-[84px] flex-col justify-between rounded-[20px] p-3.5 text-left transition-colors duration-300 ${
          locked
            ? 'cursor-not-allowed bg-card-2 text-ink-2 ring-1 ring-line'
            : dark
              ? 'bg-primary text-white'
              : 'bg-card text-ink shadow-[var(--shadow-card)] hover:bg-card-2'
        }`}
      >
        <span className="flex items-center justify-between">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ${locked ? 'bg-line [--cut:var(--color-line)]' : dark ? 'bg-white/15' : 'bg-blue-soft text-blue'}`}
            aria-hidden
          >
            {locked ? <MoonOff size={19} /> : <Moon size={19} strokeWidth={2.4} />}
          </span>
          {!locked && (
            <span className={`rounded-full px-2.5 py-0.5 text-[15px] font-bold ${dark ? 'bg-black/25' : 'bg-card-2 text-ink-2'}`} aria-hidden>
              {dark ? 'On' : 'Off'}
            </span>
          )}
        </span>
        <span className="mt-2 text-[17px] leading-tight font-bold">Dark mode</span>
        {locked && (
          <span className="mt-0.5 text-[15px] leading-snug">
            {LOCKED_NOTE}
          </span>
        )}
      </button>

      <button
        aria-pressed={powerSaving}
        aria-haspopup={powerSaving ? undefined : 'dialog'}
        onClick={() => (powerSaving ? switchPowerSaving(false) : setAsking(true))}
        className={`flex min-h-[84px] flex-col justify-between rounded-[20px] p-3.5 text-left transition-colors duration-300 ${
          powerSaving ? 'bg-success text-white' : 'bg-card text-ink shadow-[var(--shadow-card)] hover:bg-card-2'
        }`}
      >
        <span className="flex items-center justify-between">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${powerSaving ? 'bg-white/15' : 'bg-green-soft text-green'}`} aria-hidden>
            <BatteryMedium size={20} strokeWidth={2.4} />
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[15px] font-bold ${powerSaving ? 'bg-black/25' : 'bg-card-2 text-ink-2'}`} aria-hidden>
            {powerSaving ? 'On' : 'Off'}
          </span>
        </span>
        <span className="mt-2 text-[17px] leading-tight font-bold">Power saving</span>
      </button>

      {asking && (
        <PowerSavingSheet
          onClose={() => setAsking(false)}
          onConfirm={() => {
            setAsking(false);
            switchPowerSaving(true);
          }}
        />
      )}
    </div>
  );
}

function PowerSavingSheet({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <Sheet labelledBy="saver-title" onClose={onClose}>
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-soft text-green" aria-hidden>
          <BatteryMedium size={30} strokeWidth={2.2} />
        </span>
        <h2 id="saver-title" className="text-[28px] leading-tight font-bold">
          Turn on power saving?
        </h2>
      </div>
      <p className="mt-4 text-[20px] leading-relaxed text-ink">
        This is your phone's own setting. SafeSpace will close, and your phone will show only the most important apps, with big buttons on
        a black screen that uses less battery.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card-2 p-4">
          <p className="text-[16px] text-ink-2">Now</p>
          <p className="mt-1 text-[20px] leading-tight font-bold text-ink">{BATTERY.normalLeft}</p>
        </div>
        <div className="rounded-2xl bg-green-soft p-4 ring-1 ring-green/20">
          <p className="text-[16px] text-green">With power saving</p>
          <p className="mt-1 text-[20px] leading-tight font-bold text-green">{BATTERY.savingLeft}</p>
        </div>
      </div>
      <p className="mt-4 text-[18px] text-ink-2">Battery {BATTERY.percent}%. You can turn it off anytime.</p>
      <PrimaryButton className="mt-6" icon={BatteryMedium} onClick={onConfirm}>
        Turn on power saving
      </PrimaryButton>
      <TextButton className="mt-2" onClick={onClose}>
        Cancel
      </TextButton>
    </Sheet>
  );
}

/**
 * Small version for other screens (e.g. "Check complete"): two pills with icon + short label.
 * A check mark appears when one is on, so the state never relies on colour alone.
 * While power saving is on, Dark mode is grey with a lock; tapping it explains why.
 */
export function CompactToggles({ className = '' }: { className?: string }) {
  const { theme, powerSaving } = useSettings();
  const [asking, setAsking] = useState(false);
  const [why, setWhy] = useState(false);
  const dark = powerSaving || theme === 'dark';
  const locked = powerSaving;
  const pill = 'flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 text-[15px] font-bold transition-colors duration-300';
  const off = 'bg-card text-ink-2 shadow-[var(--shadow-card)] hover:bg-card-2';

  useEffect(() => {
    if (!why) return;
    const t = setTimeout(() => setWhy(false), 3500);
    return () => clearTimeout(t);
  }, [why]);

  return (
    <div className={`relative flex justify-end gap-2 ${className}`}>
      <button
        role="switch"
        aria-checked={dark}
        aria-disabled={locked || undefined}
        onClick={() => (locked ? setWhy(true) : setTheme(theme === 'dark' ? 'light' : 'dark'))}
        className={`${pill} ${locked ? 'cursor-not-allowed bg-card-2 text-ink-2 ring-1 ring-line [--cut:var(--color-card-2)]' : dark ? 'bg-primary text-white' : off}`}
      >
        {locked ? <MoonOff size={17} /> : <Moon size={17} strokeWidth={2.4} aria-hidden />}
        Dark mode
        {dark && !locked && <Check size={16} strokeWidth={3} aria-hidden />}
        {locked && (
          <span className="sr-only">
            {LOCKED_NOTE}
          </span>
        )}
      </button>
      <button
        aria-pressed={powerSaving}
        aria-haspopup={powerSaving ? undefined : 'dialog'}
        onClick={() => (powerSaving ? switchPowerSaving(false) : setAsking(true))}
        className={`${pill} ${powerSaving ? 'bg-success text-white' : off}`}
      >
        <BatteryMedium size={18} strokeWidth={2.4} aria-hidden />
        Power saving
        {powerSaving && <Check size={16} strokeWidth={3} aria-hidden />}
      </button>
      <div role="status" className="pointer-events-none absolute top-full right-0 z-10 mt-2">
        {why && (
          <p className="fade-in flex w-max max-w-[300px] items-center gap-2 rounded-2xl bg-card px-4 py-2.5 text-[16px] leading-snug text-ink shadow-[var(--shadow-card)] ring-1 ring-line">
            <Info size={18} strokeWidth={2.4} className="shrink-0" aria-hidden />
            Dark mode is not available in power saving. The screen stays dark to save battery.
          </p>
        )}
      </div>
      {asking && (
        <PowerSavingSheet
          onClose={() => setAsking(false)}
          onConfirm={() => {
            setAsking(false);
            switchPowerSaving(true);
          }}
        />
      )}
    </div>
  );
}
