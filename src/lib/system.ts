// The phone's own system (Android), as opposed to SafeSpace. Power saving is a phone mode, like
// Android's ultra power saving: switching it plays a short takeover (the phone's panel slides down,
// the screen goes dark while the current screen closes) so people see that they leave the app.
import { useSyncExternalStore } from 'react';
import { setPowerSaving } from './settings';

export type Takeover = 'saver-on' | 'saver-off';

/** Timeline of the takeover. Keep in step with the 2.6 s animations in index.css. */
export const TAKEOVER = {
  /** The screen is fully dark: the mode switches now. */
  coverMs: 1100,
  /** The panel says "Power saving is on/off". */
  doneMs: 1600,
  /** Everything is gone again. */
  endMs: 2600,
};

let current: Takeover | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Turns power saving on or off with the takeover. `onSwitched` runs while the screen is dark. */
export function switchPowerSaving(on: boolean, onSwitched?: () => void) {
  if (current) return;
  current = on ? 'saver-on' : 'saver-off';
  emit();
  window.setTimeout(() => {
    setPowerSaving(on);
    onSwitched?.();
  }, TAKEOVER.coverMs);
  window.setTimeout(() => {
    current = null;
    emit();
  }, TAKEOVER.endMs);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTakeover() {
  return useSyncExternalStore(subscribe, () => current);
}
