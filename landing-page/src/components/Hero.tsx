import type { ReactNode } from 'react';
import { Check, CloudCheck, HardDrive, ShieldCheck } from 'lucide-react';
import { hero } from '../content';
import { LakeIllustration } from './LakeIllustration';
import { PhoneFrame } from './PhoneFrame';
import { Container, DemoButton, HowItWorksButton } from './ui';

declare const __HERO_PHOTO__: boolean;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        {/* The landscape: your own photo if public/images/hero-lake.jpg exists, otherwise the drawing.
            On phones it sits behind the product picture (right part of the scene); on desktop it fills the hero. */}
        <div className="absolute right-0 bottom-0 h-[720px] w-[1296px] max-w-none sm:h-[780px] sm:w-[1404px] lg:inset-0 lg:h-full lg:w-full">
          {__HERO_PHOTO__ ? (
            <img src={`${import.meta.env.BASE_URL}images/hero-lake.jpg`} alt="" className="h-full w-full object-cover" />
          ) : (
            <LakeIllustration className="h-full w-full" />
          )}
        </div>
        {/* Light wash so the text keeps AA contrast: from the top on phones, from the left on desktop */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#F6F8F7_0%,#F6F8F7_44%,rgba(246,248,247,0.55)_58%,rgba(246,248,247,0)_74%)] lg:bg-[linear-gradient(90deg,rgba(246,248,247,0.98)_0%,rgba(246,248,247,0.94)_36%,rgba(246,248,247,0.45)_56%,rgba(246,248,247,0)_72%)]" />
        {/* Soft fade into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(246,248,247,0),#F6F8F7)]" />
      </div>

      <Container className="relative grid items-center gap-14 pt-8 pb-20 sm:pt-16 lg:min-h-[740px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-6 lg:pt-12 lg:pb-24">
        <div className="max-w-[620px]">
          <p className="flex items-start gap-3 text-[17px] leading-snug font-bold text-green">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-soft ring-1 ring-green/10" aria-hidden>
              <ShieldCheck size={18} strokeWidth={2.4} />
            </span>
            <span className="pt-1">{hero.eyebrow}</span>
          </p>
          <h1 id="hero-title" className="mt-6 text-[40px] leading-[1.06] font-bold tracking-[-0.025em] text-ink sm:text-[54px] lg:text-[56px] xl:text-[62px]">
            {/* First sentence on its own (balanced) lines, then "Keep every memory." with the highlight */}
            <span className="block text-balance">{hero.headline.lead}</span> <span className="highlight">{hero.headline.highlight}</span>
          </h1>
          <p className="mt-6 max-w-[570px] text-[20px] leading-[1.6] text-pretty text-ink-2 sm:text-[21px]">{hero.message}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <DemoButton />
            <HowItWorksButton />
          </div>
          <p className="mt-5 flex items-center gap-3 text-[17px] leading-snug text-ink-2">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(160deg,#2E8B5A,#1E6B46)] text-white shadow-[0_4px_10px_-4px_rgba(30,107,70,0.7)]"
              aria-hidden
            >
              <ShieldCheck size={17} strokeWidth={2.4} />
            </span>
            {hero.demoHint}
          </p>
          <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7">
            {hero.ticks.map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-[18px] font-bold text-ink">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green text-white shadow-[0_4px_10px_-4px_rgba(30,107,70,0.7)]" aria-hidden>
                  <Check size={16} strokeWidth={3.2} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <ProductPreview />
      </Container>
    </section>
  );
}

/** Two phones (Home behind, Results in front) with two floating notes. */
function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:h-[660px] lg:max-w-none">
      {/* warm light behind the phones */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.9),rgba(255,255,255,0.45)_55%,rgba(255,255,255,0))]"
      />

      <div className="absolute top-[70px] left-[3%] hidden -rotate-6 lg:block xl:left-[7%]">
        <PhoneFrame shot="home" width={246} eager />
      </div>
      <div className="relative flex justify-center lg:absolute lg:top-[26px] lg:right-[5%] xl:right-[9%]">
        <PhoneFrame shot="results" width={278} priority floorShadow />
      </div>

      <FloatingNote className="top-[38%] left-0 lg:top-auto lg:bottom-[19%] lg:-left-[2%] xl:left-[0%]" tile="bg-green-soft text-green" icon={<CloudCheck size={24} strokeWidth={2.3} />}>
        <span className="block text-[18px] font-bold text-ink">{hero.chips.safe.title}</span>
        <span className="block text-[16px] text-ink-2">{hero.chips.safe.text}</span>
      </FloatingNote>
      <FloatingNote className="right-0 bottom-[10%] lg:right-[0%] lg:bottom-[9%]" tile="bg-blue-soft text-blue" icon={<HardDrive size={22} strokeWidth={2.3} />} delayed>
        <span className="block text-[16px] text-ink-2">{hero.chips.freed.text}</span>
        <span className="block text-[22px] leading-tight font-bold text-ink">{hero.chips.freed.title}</span>
      </FloatingNote>
    </div>
  );
}

/** Floating white note with an icon tile. Shown from tablet width up, so it never covers the phone on small screens. */
function FloatingNote({ icon, tile, className, delayed = false, children }: { icon: ReactNode; tile: string; className: string; delayed?: boolean; children: ReactNode }) {
  return (
    <div
      className={`float ${delayed ? 'float-delay' : ''} absolute z-10 hidden items-center gap-3 rounded-[20px] bg-white/95 py-3 pr-5 pl-3 shadow-[var(--shadow-float)] ring-1 ring-black/[0.04] sm:flex ${className}`}
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${tile}`} aria-hidden>
        {icon}
      </span>
      <span className="leading-snug">{children}</span>
    </div>
  );
}
