import { Search, Shield, ShieldCheck } from 'lucide-react';
import { QuickSettings } from '../components/QuickSettings';
import { StorageCard, isAlmostFull } from '../components/StorageCard';
import { CloudLink, PrimaryButton } from '../components/ui';
import { greeting } from '../lib/format';
import { usePhone } from '../lib/usePhone';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-green-soft text-green ring-1 ring-green/10" aria-hidden>
        <ShieldCheck size={20} strokeWidth={2.2} />
      </span>
      <span className="text-[19px] font-bold text-ink">SafeSpace</span>
    </div>
  );
}

/** Phone with a shield in a soft circle, with calm "ripples" around it (pulsing while checking). */
export function PhoneIllustration({ pulse = false, size = 132 }: { pulse?: boolean; size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {pulse ? (
        <>
          <span className="pulse-ring absolute inset-0 rounded-full bg-blue/15" aria-hidden />
          <span className="pulse-ring pulse-ring-delay absolute inset-0 rounded-full bg-blue/15" aria-hidden />
        </>
      ) : (
        <>
          <span className="absolute -inset-3 rounded-full border-2 border-blue/[0.12]" aria-hidden />
          <span className="absolute -inset-6 rounded-full border-2 border-blue/[0.06]" aria-hidden />
        </>
      )}
      <span
        className="absolute inset-0 rounded-full bg-[linear-gradient(160deg,var(--color-card)_0%,var(--color-blue-soft)_62%)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-blue)_10%,transparent)]"
        aria-hidden
      />
      <svg width={size * 0.3} height={size * 0.515} viewBox="0 0 40 68" fill="none" className="relative text-blue" aria-hidden>
        <rect x="2" y="2" width="36" height="64" rx="7" stroke="currentColor" strokeWidth="3.4" />
        <path d="M20 14.5l9 3.3v7c0 6-3.9 10.6-9 12.8-5.1-2.2-9-6.8-9-12.8v-7z" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
        <path d="M15.6 25.2l3.1 3.1 5.6-5.6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.5 54h11" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function HomeScreen({ onCheck, onDemo }: { onCheck: () => void; onDemo: () => void }) {
  const { usedMB, totalMB } = usePhone();
  const full = isAlmostFull(usedMB, totalMB);

  return (
    <div className="relative flex min-h-full flex-col px-6 pt-[max(20px,env(safe-area-inset-top))] pb-6">
      <div className="flex items-center justify-between">
        <Logo />
        <CloudLink label="My cloud" className="!px-3 !text-[16px]" />
      </div>

      <QuickSettings className="mt-5" />

      <div className="mt-8 flex justify-center">
        <PhoneIllustration />
      </div>

      <h1 className="mt-7 text-center text-[30px] leading-tight font-bold tracking-[-0.015em] text-ink">{greeting()}, Robert</h1>
      <p className="mx-auto mt-2.5 max-w-[330px] text-center text-[19px] leading-[1.55] text-ink-2">
        {full ? 'Your phone is almost full.' : 'Your phone has some room again.'} Let’s check your photos and files safely.
      </p>

      <div className="mt-6">
        <StorageCard usedMB={usedMB} totalMB={totalMB} />
      </div>

      <div className="min-h-6 flex-1" />

      <PrimaryButton icon={Search} onClick={onCheck}>
        Check my phone
      </PrimaryButton>
      <p className="mt-3 flex items-center justify-center gap-2.5 text-[17px] text-ink-2">
        <Shield size={20} strokeWidth={2.2} className="text-green" aria-hidden />
        Nothing is deleted without asking you
      </p>

      <button onClick={onDemo} className="absolute right-10 bottom-1 min-h-[32px] px-3 text-[12px] text-muted hover:underline">
        Demo
      </button>
    </div>
  );
}
