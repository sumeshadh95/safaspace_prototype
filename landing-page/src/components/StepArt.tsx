// Small drawings for "How it works". Each one is a tiny, simplified piece of the real app,
// so people recognise the screens when they try the demo. All decorative (the step text says it all).
import type { CSSProperties, ReactNode } from 'react';
import { CircleCheck, CloudCheck, CloudUpload, FileText, Image, Play, Search, Smartphone, Undo2 } from 'lucide-react';

/** Step 1, Check: the phone with calm ripples, the files it looks through, and the big button. */
export function CheckArt() {
  return (
    <div className="relative h-[190px] w-[260px]">
      <div className="absolute top-[4px] left-[72px] h-[116px] w-[116px]">
        <span className="ripple absolute inset-0 rounded-full border-2 border-blue/30" />
        <span className="ripple ripple-delay absolute inset-0 rounded-full border-2 border-blue/30" />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[linear-gradient(160deg,#FFFFFF_0%,#E6EEF9_70%)] text-blue shadow-[0_10px_26px_-12px_rgba(36,72,168,0.55)] ring-1 ring-blue/10">
          {/* the same phone-with-shield drawing as the app's home screen */}
          <svg width="35" height="60" viewBox="0 0 40 68" fill="none">
            <rect x="2" y="2" width="36" height="64" rx="7" stroke="currentColor" strokeWidth="3.4" />
            <path d="M20 14.5l9 3.3v7c0 6-3.9 10.6-9 12.8-5.1-2.2-9-6.8-9-12.8v-7z" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
            <path d="M15.6 25.2l3.1 3.1 5.6-5.6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14.5 54h11" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      <FileTile className="float top-[14px] left-[14px] text-blue">
        <Image size={21} strokeWidth={2.3} />
      </FileTile>
      <FileTile className="float float-delay top-[78px] left-[4px] text-orange-ink">
        <FileText size={21} strokeWidth={2.3} />
      </FileTile>
      <FileTile className="float float-delay top-[40px] right-[8px] text-violet">
        <Play size={19} strokeWidth={2.4} fill="currentColor" className="ml-0.5" />
      </FileTile>

      <span className="absolute bottom-[6px] left-1/2 flex h-[44px] -translate-x-1/2 items-center gap-2 rounded-[14px] bg-blue px-4 text-[16px] font-bold whitespace-nowrap text-white shadow-[0_12px_22px_-12px_rgba(36,72,168,0.95)]">
        <Search size={18} strokeWidth={2.8} />
        Check my phone
      </span>
    </div>
  );
}

function FileTile({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span className={`absolute flex h-11 w-11 items-center justify-center rounded-[14px] bg-white shadow-[var(--shadow-card)] ring-1 ring-black/[0.04] ${className}`}>
      {children}
    </span>
  );
}

// Tiny "photos": Finnish lake, sunset, forest, snow, summer field, evening.
const PHOTOS: { look: CSSProperties; saved: boolean }[] = [
  { look: { background: 'linear-gradient(180deg,#CDE3F4 0%,#CDE3F4 46%,#6E9BC4 47%,#4F7FAE 100%)' }, saved: true },
  { look: { background: 'linear-gradient(180deg,#F9D29D 0%,#F3A683 52%,#8C6D8F 53%,#5E5878 100%)' }, saved: false },
  { look: { background: 'linear-gradient(180deg,#DCEBD5 0%,#DCEBD5 40%,#6FA376 41%,#3F7550 100%)' }, saved: true },
  { look: { background: 'linear-gradient(180deg,#DDE7F1 0%,#C9D7E6 55%,#F4F7FA 56%,#E3EAF1 100%)' }, saved: true },
  { look: { background: 'linear-gradient(180deg,#BFDDF5 0%,#BFDDF5 45%,#E8CF7A 46%,#C9A94D 100%)' }, saved: true },
  { look: { background: 'linear-gradient(180deg,#9DB3D9 0%,#7F96C8 50%,#3E5A7A 51%,#2E4560 100%)' }, saved: false },
];

/** Step 2, See what's safe: photos in date order, each clearly marked. */
export function SortArt() {
  return (
    <div className="relative h-[190px] w-[260px]">
      <div className="absolute top-[18px] left-[31px] rounded-[18px] bg-white p-2.5 shadow-[var(--shadow-float)] ring-1 ring-black/[0.04]">
        <p className="px-0.5 pb-1.5 text-[13px] leading-none font-bold text-ink-2">2019</p>
        <div className="grid grid-cols-3 gap-2">
          {PHOTOS.map((p, i) => (
            <span key={i} className="relative h-[46px] w-[54px] rounded-[10px]" style={p.look}>
              <span
                className={`absolute -right-1 -bottom-1 flex h-[20px] w-[20px] items-center justify-center rounded-full text-white ring-2 ring-white ${
                  p.saved ? 'bg-green-fill' : 'bg-orange'
                }`}
              >
                {p.saved ? <CloudCheck size={12} strokeWidth={2.8} /> : <Smartphone size={11} strokeWidth={2.8} />}
              </span>
            </span>
          ))}
        </div>
      </div>

      <span className="float absolute top-0 right-0 flex items-center gap-1.5 rounded-full bg-white py-1.5 pr-3 pl-2 text-[14px] font-bold text-green shadow-[var(--shadow-float)] ring-1 ring-black/[0.04]">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-soft">
          <CloudCheck size={15} strokeWidth={2.6} />
        </span>
        Saved in cloud
      </span>
      <span className="float float-delay absolute bottom-0 left-0 flex items-center gap-1.5 rounded-full bg-white py-1.5 pr-3 pl-2 text-[14px] font-bold text-orange-ink shadow-[var(--shadow-float)] ring-1 ring-black/[0.04]">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-badge">
          <Smartphone size={14} strokeWidth={2.6} />
        </span>
        Only on phone
      </span>
    </div>
  );
}

/** Step 3, Save or clear: the two choices, then the message with its big Undo. */
export function SaveArt() {
  return (
    <div className="relative h-[190px] w-[260px]">
      <div className="absolute top-[4px] left-[18px] w-[224px] divide-y divide-line rounded-[18px] bg-white px-2 py-1 shadow-[var(--shadow-float)] ring-1 ring-black/[0.04]">
        <Choice icon={<CloudUpload size={19} strokeWidth={2.4} />} tile="bg-blue-soft text-blue" text="Save to cloud" />
        <Choice icon={<Smartphone size={18} strokeWidth={2.4} />} tile="bg-green-soft text-green" text="Remove from phone" />
      </div>

      <div className="float absolute bottom-[4px] left-[6px] flex w-[248px] items-center gap-2 rounded-[16px] bg-[#22313A] py-2 pr-2 pl-3 shadow-[0_14px_28px_-12px_rgba(10,20,24,0.6)]">
        <CircleCheck size={19} strokeWidth={2.4} className="shrink-0 text-[#8FD3AE]" />
        <span className="flex-1 text-[14px] leading-tight font-bold whitespace-nowrap text-white">You freed 3.5 GB</span>
        <span className="flex h-[34px] items-center gap-1 rounded-[11px] bg-white px-2.5 text-[14px] font-bold text-blue">
          <Undo2 size={15} strokeWidth={2.8} />
          Undo
        </span>
      </div>
    </div>
  );
}

function Choice({ icon, tile, text }: { icon: ReactNode; tile: string; text: string }) {
  return (
    <span className="flex items-center gap-2.5 px-1 py-2 text-[15px] font-bold text-ink">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ${tile}`}>{icon}</span>
      {text}
    </span>
  );
}
