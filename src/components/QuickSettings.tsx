import { useState } from 'react';
import { BatteryMedium, Check, Moon } from 'lucide-react';
import { BATTERY, setPowerSaving, setTheme, useSettings } from '../lib/settings';
import { PrimaryButton, TextButton } from './ui';
import { Sheet } from './Sheet';

/** Two quick buttons on Home: Dark mode (a switch) and Power saving. Always icon + text + On/Off. */
export function QuickSettings({ className = '' }: { className?: string }) {
  const { theme, powerSaving } = useSettings();
  const [asking, setAsking] = useState(false);
  const dark = powerSaving || theme === 'dark';

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      <button
        role="switch"
        aria-checked={dark}
        disabled={powerSaving}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`flex min-h-[84px] flex-col justify-between rounded-[20px] p-3.5 text-left transition-colors duration-300 disabled:cursor-default ${
          dark ? 'bg-primary text-white' : 'bg-card text-ink shadow-[var(--shadow-card)] hover:bg-card-2'
        }`}
      >
        <span className="flex items-center justify-between">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${dark ? 'bg-white/15' : 'bg-blue-soft text-blue'}`} aria-hidden>
            <Moon size={19} strokeWidth={2.4} />
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[15px] font-bold ${dark ? 'bg-white/20' : 'bg-card-2 text-ink-2'}`} aria-hidden>
            {dark ? 'On' : 'Off'}
          </span>
        </span>
        <span className="mt-2 text-[17px] leading-tight font-bold">Dark mode</span>
      </button>

      <button
        aria-pressed={powerSaving}
        aria-haspopup={powerSaving ? undefined : 'dialog'}
        onClick={() => (powerSaving ? setPowerSaving(false) : setAsking(true))}
        className={`flex min-h-[84px] flex-col justify-between rounded-[20px] p-3.5 text-left transition-colors duration-300 ${
          powerSaving ? 'bg-success text-white' : 'bg-card text-ink shadow-[var(--shadow-card)] hover:bg-card-2'
        }`}
      >
        <span className="flex items-center justify-between">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${powerSaving ? 'bg-white/15' : 'bg-green-soft text-green'}`} aria-hidden>
            <BatteryMedium size={20} strokeWidth={2.4} />
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[15px] font-bold ${powerSaving ? 'bg-white/20' : 'bg-card-2 text-ink-2'}`} aria-hidden>
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
            setPowerSaving(true);
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
        Your phone shows only the most important apps, with big buttons on a black screen that uses less battery.
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
 */
export function CompactToggles({ className = '' }: { className?: string }) {
  const { theme, powerSaving } = useSettings();
  const [asking, setAsking] = useState(false);
  const dark = powerSaving || theme === 'dark';
  const pill = 'flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 text-[15px] font-bold transition-colors duration-300';
  const off = 'bg-card text-ink-2 shadow-[var(--shadow-card)] hover:bg-card-2';

  return (
    <div className={`flex justify-end gap-2 ${className}`}>
      <button
        role="switch"
        aria-checked={dark}
        disabled={powerSaving}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`${pill} ${dark ? 'bg-primary text-white' : off}`}
      >
        <Moon size={17} strokeWidth={2.4} aria-hidden />
        Dark mode
        {dark && <Check size={16} strokeWidth={3} aria-hidden />}
      </button>
      <button
        aria-pressed={powerSaving}
        aria-haspopup={powerSaving ? undefined : 'dialog'}
        onClick={() => (powerSaving ? setPowerSaving(false) : setAsking(true))}
        className={`${pill} ${powerSaving ? 'bg-success text-white' : off}`}
      >
        <BatteryMedium size={18} strokeWidth={2.4} aria-hidden />
        Power saving
        {powerSaving && <Check size={16} strokeWidth={3} aria-hidden />}
      </button>
      {asking && (
        <PowerSavingSheet
          onClose={() => setAsking(false)}
          onConfirm={() => {
            setAsking(false);
            setPowerSaving(true);
          }}
        />
      )}
    </div>
  );
}
