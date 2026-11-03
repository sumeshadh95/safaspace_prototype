// Display settings on the "phone": light/dark theme and power saving mode.
// Saved in the browser (like the cloud) so a page refresh keeps them. Other tabs follow live.
import { useSyncExternalStore } from 'react';

export const THEME_KEY = 'safespace.theme';
export const POWER_KEY = 'safespace.powerSaving';

export type Theme = 'light' | 'dark';

interface Settings {
  theme: Theme;
  powerSaving: boolean;
}

function read(): Settings {
  try {
    return {
      theme: localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light',
      powerSaving: localStorage.getItem(POWER_KEY) === 'true',
    };
  } catch {
    return { theme: 'light', powerSaving: false };
  }
}

let state: Settings = read();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked: keep working from memory.
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === null || e.key === THEME_KEY || e.key === POWER_KEY) {
      state = read();
      emit();
    }
  });
}

export function setTheme(theme: Theme) {
  state = { ...state, theme };
  write(THEME_KEY, theme);
  emit();
}

export function setPowerSaving(on: boolean) {
  state = { ...state, powerSaving: on };
  write(POWER_KEY, on ? 'true' : null);
  emit();
}

/** Back to the starting look: light theme, power saving off. */
export function resetSettings() {
  state = { theme: 'light', powerSaving: false };
  write(THEME_KEY, null);
  write(POWER_KEY, null);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSettings() {
  return useSyncExternalStore(subscribe, () => state);
}

/** Simulated battery, shown in the status bar and on the power saving screen. */
export const BATTERY = { percent: 64, normalLeft: 'about 14 hours', savingLeft: 'about 3 days' };
