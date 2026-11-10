// The phone's own home screen (Android style). The demo starts here, so SafeSpace is clearly one app
// on the phone, and power saving (a phone mode) clearly isn't part of it. Only SafeSpace opens;
// the other apps show a short message at the bottom, like a real phone does.
import { useEffect, useRef, useState } from 'react';
import {
  Calculator,
  CalendarDays,
  Camera,
  Clock3,
  CloudSun,
  Folder,
  Globe,
  Images,
  MessageCircle,
  Phone,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { clockText, dayText, useNow } from '../lib/useNow';

interface PhoneApp {
  id: string;
  label: string;
  icon: LucideIcon;
  colors: [string, string];
}

const APPS: PhoneApp[] = [
  { id: 'calendar', label: 'Calendar', icon: CalendarDays, colors: ['#5B8DEF', '#3563D6'] },
  { id: 'clock', label: 'Clock', icon: Clock3, colors: ['#6B7684', '#3D4651'] },
  { id: 'weather', label: 'Weather', icon: CloudSun, colors: ['#5CB8F0', '#2F86C9'] },
  { id: 'calculator', label: 'Calculator', icon: Calculator, colors: ['#4CB58A', '#2D8C63'] },
  { id: 'gallery', label: 'Gallery', icon: Images, colors: ['#F06D8C', '#C9446A'] },
  { id: 'files', label: 'My Files', icon: Folder, colors: ['#F2B84B', '#D48A1F'] },
  { id: 'settings', label: 'Settings', icon: Settings, colors: ['#8A94A3', '#5E6875'] },
  { id: 'safespace', label: 'SafeSpace', icon: ShieldCheck, colors: ['#2E8B5A', '#1E6B46'] },
];

const DOCK: PhoneApp[] = [
  { id: 'phone', label: 'Phone', icon: Phone, colors: ['#4CC36F', '#2E9A52'] },
  { id: 'messages', label: 'Messages', icon: MessageCircle, colors: ['#5B8DEF', '#3563D6'] },
  { id: 'internet', label: 'Internet', icon: Globe, colors: ['#8E7CF0', '#5F4BD1'] },
  { id: 'camera', label: 'Camera', icon: Camera, colors: ['#F2706B', '#D64A45'] },
];

// Calm, dark abstract wallpaper (blue to teal with soft glows), so white labels stay easy to read.
const WALLPAPER = [
  'radial-gradient(120% 65% at 105% -5%, rgba(126,156,240,0.55) 0%, rgba(126,156,240,0) 60%)',
  'radial-gradient(95% 55% at -10% 105%, rgba(56,178,160,0.5) 0%, rgba(56,178,160,0) 62%)',
  'radial-gradient(60% 38% at 85% 72%, rgba(160,120,230,0.3) 0%, rgba(160,120,230,0) 70%)',
  'linear-gradient(172deg, #16264A 0%, #1F3B66 48%, #1A4658 100%)',
].join(', ');

export function Launcher({ onOpenSafeSpace }: { onOpenSafeSpace: (origin: string) => void }) {
  const now = useNow();
  const root = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(0), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const open = (app: PhoneApp, icon: HTMLElement) => {
    if (app.id !== 'safespace') {
      setToast((n) => n + 1);
      return;
    }
    // SafeSpace grows out of its icon, like apps opening on Android.
    const box = root.current?.getBoundingClientRect();
    const r = icon.getBoundingClientRect();
    const pct = (v: number, start: number, size: number) => `${(((v - start) / size) * 100).toFixed(1)}%`;
    onOpenSafeSpace(box ? `${pct(r.left + r.width / 2, box.left, box.width)} ${pct(r.top + r.height / 2, box.top, box.height)}` : '50% 50%');
  };

  return (
    <div ref={root} className="launcher font-system absolute inset-0 overflow-hidden text-white" style={{ background: WALLPAPER }}>
      <div className="relative flex h-full flex-col px-4 pt-[max(44px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))] sm:pt-[72px]">
        <div className="px-3">
          <p className="text-[76px] leading-none font-light tracking-[-0.02em] tabular-nums">{clockText(now)}</p>
          <p className="mt-3 text-[20px] text-white/90">{dayText(now)}</p>
        </div>

        <div className="flex-1" />

        <ul aria-label="Apps" className="grid grid-cols-4 gap-y-5">
          {APPS.map((app) => (
            <li key={app.id}>
              <AppIcon app={app} onOpen={open} />
            </li>
          ))}
        </ul>
        <div aria-hidden className="mt-6 flex justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white" />
          <span className="h-2 w-2 rounded-full bg-white/40" />
        </div>
        <ul aria-label="Favourite apps" className="mt-5 grid grid-cols-4 rounded-[32px] bg-white/[0.14] py-3 ring-1 ring-white/10 backdrop-blur-md">
          {DOCK.map((app) => (
            <li key={app.id}>
              <AppIcon app={app} onOpen={open} />
            </li>
          ))}
        </ul>
      </div>

      {/* just above the app icons (they sit at the bottom), so it never covers a label */}
      <div role="status" aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-[392px] flex justify-center px-6">
        {toast > 0 && (
          <p key={toast} className="fade-in rounded-full bg-[#2B3135]/95 px-5 py-3 text-center text-[17px] shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
            Only SafeSpace works in this demo
          </p>
        )}
      </div>
    </div>
  );
}

function AppIcon({ app, onOpen }: { app: PhoneApp; onOpen: (app: PhoneApp, icon: HTMLElement) => void }) {
  return (
    <button
      onClick={(e) => onOpen(app, e.currentTarget.firstElementChild as HTMLElement)}
      className="group flex w-full flex-col items-center gap-2 rounded-2xl px-1 py-1.5 outline-offset-0"
    >
      <span
        aria-hidden
        className="flex h-[62px] w-[62px] items-center justify-center rounded-[21px] shadow-[0_8px_16px_-8px_rgba(0,0,0,0.6)] ring-1 ring-white/15 transition-transform duration-150 group-active:scale-90"
        style={{ background: `linear-gradient(160deg, ${app.colors[0]}, ${app.colors[1]})` }}
      >
        <app.icon size={30} strokeWidth={2.1} />
      </span>
      <span className="text-[15px] leading-tight font-medium [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">{app.label}</span>
    </button>
  );
}
