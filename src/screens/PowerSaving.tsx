// Power saving mode: a true-black home screen (uses less battery on most phones) with only the
// most important apps as big tiles. Each tile opens a simple, large version of that app.
// Calls and the camera are demo-only and say so.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  BatteryMedium,
  BookUser,
  Camera,
  Delete,
  Images,
  LayoutGrid,
  MessageCircle,
  Phone,
  PhoneOff,
  Power,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { FILES } from '../data/files';
import { formatDate } from '../lib/format';
import { BATTERY } from '../lib/settings';
import { usePhone } from '../lib/usePhone';
import { clockText, dayText, useNow } from '../lib/useNow';

export type SaverView = 'home' | 'phone' | 'messages' | 'contacts' | 'camera' | 'photos' | 'safespace';

const APPS: { id: SaverView; label: string; icon: LucideIcon; color: string }[] = [
  { id: 'phone', label: 'Phone', icon: Phone, color: '#2E8B5A' },
  { id: 'messages', label: 'Messages', icon: MessageCircle, color: '#3C63CC' },
  { id: 'contacts', label: 'Contacts', icon: BookUser, color: '#C2701C' },
  { id: 'camera', label: 'Camera', icon: Camera, color: '#5F6E73' },
  { id: 'photos', label: 'Photos', icon: Images, color: '#7B5CD0' },
  { id: 'safespace', label: 'SafeSpace', icon: ShieldCheck, color: '#1E6B46' },
];

// Made-up people and messages for the demo.
const PEOPLE = [
  { name: 'Anna', note: 'Daughter', color: '#7B5CD0' },
  { name: 'Mikko', note: 'Son', color: '#3C63CC' },
  { name: 'Liisa', note: 'Neighbour', color: '#C2701C' },
  { name: 'Health centre', note: 'Mikkeli', color: '#2E8B5A' },
];
const MESSAGES = [
  { from: 'Anna', time: '09:12', text: 'Lunch on Sunday? The kids would love to see you.', color: '#7B5CD0' },
  { from: 'Health centre', time: 'Yesterday', text: 'Reminder: your appointment is on Thursday at 10:00.', color: '#2E8B5A' },
  { from: 'Mikko', time: 'Monday', text: 'I sent you the photos from the cottage.', color: '#3C63CC' },
];

const SOFT = 'text-[#C3CDCF]';
const TILE = 'border border-[#252C2F] bg-[#111516]';

/** The phone's power saving mode (not SafeSpace), so it uses the phone's font. */
export function PowerSaving({ view, onOpen, onTurnOff }: { view: SaverView; onOpen: (view: SaverView) => void; onTurnOff: () => void }) {
  const [calling, setCalling] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const back = () => onOpen('home');

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [view]);

  return (
    <div ref={scroller} className="saver font-system fade-in-slow scroll-area absolute inset-0 overflow-y-auto bg-black text-white">
      {view === 'home' && <SaverHome onOpen={onOpen} onTurnOff={onTurnOff} />}
      {view === 'phone' && <PhoneApp onBack={back} onCall={setCalling} />}
      {view === 'contacts' && <ContactsApp onBack={back} onCall={setCalling} />}
      {view === 'messages' && <MessagesApp onBack={back} />}
      {view === 'camera' && <CameraApp onBack={back} />}
      {view === 'photos' && <PhotosApp onBack={back} />}
      {calling && <CallScreen who={calling} onEnd={() => setCalling(null)} />}
    </div>
  );
}

function SaverHome({ onOpen, onTurnOff }: { onOpen: (view: SaverView) => void; onTurnOff: () => void }) {
  const now = useNow();
  return (
    <div className="flex min-h-full flex-col px-5 pt-5 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-[18px] font-bold text-[#8AD8AB]">
          <BatteryMedium size={22} strokeWidth={2.4} aria-hidden />
          Power saving
        </h1>
        <span className="flex items-center gap-2 text-[18px] font-bold">
          <span className="relative h-[14px] w-[28px] rounded-[4px] border-2 border-white/60" aria-hidden>
            <span className="absolute inset-[2px] right-auto rounded-[2px] bg-[#3A9D68]" style={{ width: `${(BATTERY.percent / 100) * 18}px` }} />
          </span>
          {BATTERY.percent}%
        </span>
      </div>

      <p className={`mt-6 text-[20px] ${SOFT}`}>{dayText(now)}</p>
      <p className="text-[64px] leading-none font-bold tracking-tight tabular-nums">{clockText(now)}</p>
      <p className={`mt-3 text-[18px] ${SOFT}`}>Battery lasts {BATTERY.savingLeft}</p>

      <ul className="mt-7 grid grid-cols-2 gap-3" aria-label="Apps">
        {APPS.map((app) => (
          <li key={app.id}>
            <button
              onClick={() => onOpen(app.id)}
              className={`flex h-[118px] w-full flex-col items-center justify-center gap-3 rounded-[24px] transition-colors hover:bg-[#191F21] active:bg-[#1E2528] ${TILE}`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full text-white" style={{ background: app.color }} aria-hidden>
                <app.icon size={28} strokeWidth={2.2} />
              </span>
              <span className="text-[20px] font-bold">{app.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="min-h-6 flex-1" />
      <button
        onClick={onTurnOff}
        className="mt-6 flex h-16 w-full items-center justify-center gap-3 rounded-[20px] border-2 border-[#3A4447] bg-[#121718] text-[20px] font-bold hover:bg-[#1A2022]"
      >
        <Power size={24} strokeWidth={2.4} aria-hidden />
        Turn off power saving
      </button>
    </div>
  );
}

/** Shared layout for the simple apps: big Back button and a title with the app's colour. */
function SaverPage({ title, icon: Icon, color, onBack, children }: { title: string; icon: LucideIcon; color: string; onBack: () => void; children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col px-5 pt-3 pb-8">
      <button onClick={onBack} className="-ml-2 inline-flex min-h-[56px] w-fit items-center gap-2 rounded-2xl px-2 text-[21px] font-bold hover:bg-white/10">
        <ArrowLeft size={28} strokeWidth={2.6} aria-hidden />
        Back
      </button>
      <h1 className="mt-2 flex items-center gap-3 text-[32px] leading-tight font-bold">
        <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: color }} aria-hidden>
          <Icon size={25} strokeWidth={2.3} />
        </span>
        {title}
      </h1>
      {children}
    </div>
  );
}

const KEYS: [string, string][] = [
  ['1', ''],
  ['2', 'ABC'],
  ['3', 'DEF'],
  ['4', 'GHI'],
  ['5', 'JKL'],
  ['6', 'MNO'],
  ['7', 'PQRS'],
  ['8', 'TUV'],
  ['9', 'WXYZ'],
  ['*', ''],
  ['0', '+'],
  ['#', ''],
];

/** "040 123 4567" style grouping, easier to read back. */
const groupDigits = (n: string) => n.replace(/^(\d{3})(\d{0,3})(\d*)$/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));

function PhoneApp({ onBack, onCall }: { onBack: () => void; onCall: (who: string) => void }) {
  const [number, setNumber] = useState('');
  return (
    <SaverPage title="Phone" icon={Phone} color="#2E8B5A" onBack={onBack}>
      <div aria-live="polite" className="mt-4 flex min-h-[64px] items-center justify-center text-[36px] font-bold tracking-wide tabular-nums">
        {number ? groupDigits(number) : <span className="text-[22px] font-normal text-[#9AA6A9]">Type a number</span>}
      </div>
      <div className="mx-auto mt-3 grid w-full max-w-[300px] grid-cols-3 gap-x-6 gap-y-4">
        {KEYS.map(([digit, letters]) => (
          <button
            key={digit}
            aria-label={digit}
            onClick={() => setNumber((n) => (n + digit).slice(0, 15))}
            className="mx-auto flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full bg-[#171C1E] hover:bg-[#20272A] active:bg-[#283033]"
          >
            <span className="text-[30px] leading-none font-bold">{digit}</span>
            {letters && <span className="mt-1 text-[12px] tracking-[0.12em] text-[#9AA6A9]">{letters}</span>}
          </button>
        ))}
      </div>
      <div className="mx-auto mt-5 grid w-full max-w-[300px] grid-cols-3 items-center">
        <span />
        <button
          disabled={!number}
          onClick={() => onCall(groupDigits(number))}
          aria-label="Call"
          className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#2E8B5A] hover:bg-[#33996A] disabled:opacity-40"
        >
          <Phone size={32} strokeWidth={2.2} fill="currentColor" aria-hidden />
        </button>
        {number && (
          <button
            aria-label="Delete last number"
            onClick={() => setNumber((n) => n.slice(0, -1))}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-[#C3CDCF] hover:bg-[#171C1E]"
          >
            <Delete size={28} strokeWidth={2.2} aria-hidden />
          </button>
        )}
      </div>
    </SaverPage>
  );
}

function ContactsApp({ onBack, onCall }: { onBack: () => void; onCall: (who: string) => void }) {
  return (
    <SaverPage title="Contacts" icon={BookUser} color="#C2701C" onBack={onBack}>
      <ul className="mt-6 flex flex-col gap-3">
        {PEOPLE.map((p) => (
          <li key={p.name} className={`flex items-center gap-4 rounded-[22px] p-4 ${TILE}`}>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[24px] font-bold" style={{ background: p.color }} aria-hidden>
              {p.name[0]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[22px] leading-tight font-bold">{p.name}</span>
              <span className={`block text-[17px] ${SOFT}`}>{p.note}</span>
            </span>
            <button
              onClick={() => onCall(p.name)}
              aria-label={`Call ${p.name}`}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#2E8B5A] hover:bg-[#33996A]"
            >
              <Phone size={25} strokeWidth={2.2} fill="currentColor" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </SaverPage>
  );
}

function MessagesApp({ onBack }: { onBack: () => void }) {
  return (
    <SaverPage title="Messages" icon={MessageCircle} color="#3C63CC" onBack={onBack}>
      <ul className="mt-6 flex flex-col gap-3">
        {MESSAGES.map((m) => (
          <li key={m.from} className={`flex gap-4 rounded-[22px] p-4 ${TILE}`}>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[21px] font-bold" style={{ background: m.color }} aria-hidden>
              {m.from[0]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[20px] font-bold">{m.from}</span>
                <span className={`shrink-0 text-[15px] ${SOFT}`}>{m.time}</span>
              </span>
              <span className={`mt-1 block text-[18px] leading-snug ${SOFT}`}>{m.text}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-center text-[16px] text-[#9AA6A9]">Demo messages</p>
    </SaverPage>
  );
}

function CameraApp({ onBack }: { onBack: () => void }) {
  const [flash, setFlash] = useState(0);
  const [note, setNote] = useState('');
  const view = FILES.find((f) => f.type === 'photo' && f.path);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const shoot = () => {
    if (!reduceMotion) setFlash((n) => n + 1);
    setNote('Demo: no photo is saved.');
  };

  return (
    <SaverPage title="Camera" icon={Camera} color="#5F6E73" onBack={onBack}>
      <div className="relative mt-5 overflow-hidden rounded-[24px] bg-[#111]">
        {view?.path && <img src={view.path} alt="Camera view of a lake at sunset (demo)" className="aspect-[4/5] w-full object-cover" />}
        {/* framing grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className="border-[0.5px] border-white/25" />
          ))}
        </div>
        {flash > 0 && <div key={flash} aria-hidden className="flash absolute inset-0 bg-white" />}
      </div>
      <div className="mt-6 flex flex-col items-center">
        <button onClick={shoot} aria-label="Take photo" className="flex h-[84px] w-[84px] items-center justify-center rounded-full border-4 border-white p-1.5">
          <span className="block h-full w-full rounded-full bg-white" />
        </button>
        <p aria-live="polite" className={`mt-3 min-h-[28px] text-[18px] ${SOFT}`}>
          {note}
        </p>
      </div>
    </SaverPage>
  );
}

function PhotosApp({ onBack }: { onBack: () => void }) {
  const phone = usePhone();
  const photos = [...phone.categories.photo.files].reverse().slice(0, 10);
  return (
    <SaverPage title="Photos" icon={Images} color="#7B5CD0" onBack={onBack}>
      <p className={`mt-3 text-[18px] ${SOFT}`}>Your newest photos</p>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {photos.map((f) => (
          <li key={f.id}>
            <img src={f.thumb ?? ''} alt={`Photo from ${formatDate(f.date)}`} loading="lazy" className="aspect-square w-full rounded-[18px] object-cover" />
          </li>
        ))}
      </ul>
    </SaverPage>
  );
}

function CallScreen({ who, onEnd }: { who: string; onEnd: () => void }) {
  const initial = /^[A-Za-z]/.test(who) ? who[0] : null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Calling ${who}`}
      className="fade-in fixed inset-0 z-20 flex flex-col items-center bg-[radial-gradient(circle_at_50%_28%,#123326_0%,#000000_68%)] px-6 pt-20 pb-10 text-center"
    >
      <span className="flex h-32 w-32 items-center justify-center rounded-full bg-[#1E2A2D] text-[52px] font-bold ring-8 ring-[#2E8B5A]/25" aria-hidden>
        {initial ?? <Phone size={48} strokeWidth={2} />}
      </span>
      <p className="mt-8 text-[32px] leading-tight font-bold">{who}</p>
      <p className={`mt-2 text-[22px] ${SOFT}`}>
        Calling
        <span className="dot">.</span>
        <span className="dot [animation-delay:0.2s]">.</span>
        <span className="dot [animation-delay:0.4s]">.</span>
      </p>
      <p className={`mt-6 rounded-2xl bg-[#121718] px-4 py-3 text-[16px] ${SOFT}`}>This is a demo. No real call is made.</p>
      <div className="flex-1" />
      <button onClick={onEnd} className="flex flex-col items-center gap-3 rounded-3xl p-2">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#C2412F]" aria-hidden>
          <PhoneOff size={34} strokeWidth={2.2} />
        </span>
        <span className="text-[20px] font-bold">End call</span>
      </button>
    </div>
  );
}

/** Thin black bar shown while SafeSpace is open in power saving mode. */
export function SaverBanner({ onHome }: { onHome: () => void }) {
  return (
    <div className="saver font-system absolute inset-x-0 top-0 z-30 flex h-[60px] items-center justify-between bg-black px-4 text-white">
      <span className="flex items-center gap-2 text-[16px] font-bold text-[#8AD8AB]">
        <BatteryMedium size={20} strokeWidth={2.4} aria-hidden />
        Power saving is on
      </span>
      <button onClick={onHome} className="flex min-h-[48px] items-center gap-2 rounded-xl bg-[#1A2022] px-3.5 text-[16px] font-bold hover:bg-[#242C2F]">
        <LayoutGrid size={18} strokeWidth={2.4} aria-hidden />
        Simple home
      </button>
    </div>
  );
}
