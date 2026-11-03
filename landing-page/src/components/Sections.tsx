import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeAlert,
  BookOpenText,
  Check,
  ChevronRight,
  CircleCheck,
  CloudCheck,
  CloudUpload,
  Hand,
  Heart,
  ListChecks,
  MessageCircleQuestion,
  Presentation,
  ShieldCheck,
  Smartphone,
  Undo2,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { PARTNER_MAILTO, PROTOTYPE_URL } from '../config';
import { cta, features, finalCta, hero, howItWorks, organisations, problem, safety, showcase } from '../content';
import { PhoneFrame } from './PhoneFrame';
import { Container, DemoButton, Eyebrow, Reveal, SectionTitle, TILE } from './ui';

const FEATURE_ICONS: Record<string, [LucideIcon, string]> = {
  cloud: [CloudCheck, TILE.blue],
  shield: [ShieldCheck, TILE.green],
  undo: [Undo2, TILE.violet],
  people: [Users, TILE.orange],
};

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionTitle id="features-title" eyebrow={features.eyebrow} title={features.title} subtitle={features.subtitle} center />
        </Reveal>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.items.map((f, i) => {
            const [Icon, tile] = FEATURE_ICONS[f.icon];
            return (
              <li key={f.title}>
                <Reveal delay={i * 80} className="h-full">
                  <div className="h-full rounded-[22px] bg-card p-7 shadow-[var(--shadow-card)] ring-1 ring-black/[0.03] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tile}`} aria-hidden>
                      <Icon size={28} strokeWidth={2.2} />
                    </span>
                    <h3 className="mt-6 text-[22px] leading-snug font-bold text-ink">{f.title}</h3>
                    <p className="mt-2 text-[18px] leading-[1.6] text-ink-2">{f.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

const PROBLEM_ICONS: Record<string, [LucideIcon, string]> = {
  full: [Smartphone, TILE.orange],
  heart: [Heart, TILE.violet],
  ads: [BadgeAlert, TILE.blue],
};

/** Plain-language worries, shown as speech bubbles. */
export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="relative overflow-hidden bg-[#EDF2EF] py-24">
      <Container>
        <Reveal>
          <SectionTitle id="problem-title" title={problem.title} center />
        </Reveal>
        <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {problem.items.map((p, i) => {
            const [Icon, tile] = PROBLEM_ICONS[p.icon];
            return (
              <li key={p.text}>
                <Reveal delay={i * 100} className="h-full">
                  <div className="relative h-full rounded-[24px] rounded-bl-[6px] bg-card p-7 shadow-[var(--shadow-card)]">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tile}`} aria-hidden>
                      <Icon size={22} strokeWidth={2.2} />
                    </span>
                    <p className="mt-4 text-[21px] leading-snug text-pretty text-ink">“{p.text}”</p>
                    {/* bubble tail */}
                    <svg aria-hidden className="absolute -bottom-[13px] left-0" width="26" height="14" viewBox="0 0 26 14">
                      <path d="M0 0 H26 C18 2 8 7 0 14 Z" fill="#FFFFFF" />
                    </svg>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <Reveal>
          <p className="mx-auto mt-16 w-fit max-w-full rounded-[20px] bg-green-soft px-6 py-3.5 text-center text-[21px] font-bold text-green ring-1 ring-green/15">
            <CircleCheck size={26} strokeWidth={2.4} className="mr-2.5 inline align-[-6px]" aria-hidden />
            {problem.answer}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

export function HowItWorks() {
  const last = howItWorks.steps.length - 1;
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="border-y border-line bg-white py-24 sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-[minmax(250px,1fr)_2.7fr] lg:gap-16">
        <Reveal>
          <SectionTitle id="how-title" eyebrow={howItWorks.eyebrow} title={howItWorks.title} subtitle={howItWorks.subtitle} />
          <a
            href={PROTOTYPE_URL}
            target="_blank"
            rel="noopener"
            data-cta="demo"
            className="group mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-xl text-[20px] font-bold text-blue underline-offset-4 hover:underline"
          >
            {howItWorks.tryLink}
            <ArrowRight size={22} strokeWidth={2.6} className="transition-transform group-hover:translate-x-1" aria-hidden />
            <span className="sr-only"> (opens the demo in a new tab)</span>
          </a>
        </Reveal>
        <ol className="grid gap-10 md:grid-cols-3 md:gap-6">
          {howItWorks.steps.map((s, i) => (
            <li key={s.title} className="relative">
              {/* mobile: a dashed line down to the next step */}
              {i < last && <span aria-hidden className="absolute top-[72px] bottom-[-34px] left-[29px] border-l-2 border-dashed border-blue/25 md:hidden" />}
              <Reveal delay={i * 120}>
                <div className="flex items-center gap-5 md:gap-0">
                  <span className="relative z-10 flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-blue text-[24px] font-bold text-white shadow-[0_0_0_8px_#E6EEF9]" aria-hidden>
                    {i + 1}
                  </span>
                  {/* desktop: dashed line with a chevron to the next step */}
                  {i < last && (
                    <span aria-hidden className="ml-5 hidden flex-1 items-center md:flex">
                      <span className="h-0 flex-1 border-t-2 border-dashed border-blue/25" />
                      <ChevronRight size={22} strokeWidth={2.6} className="mx-1 text-blue/60" />
                      <span className="h-0 flex-1 border-t-2 border-dashed border-blue/25" />
                    </span>
                  )}
                  <h3 className="text-[22px] font-bold text-ink md:hidden">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                </div>
                <div className="pl-[80px] md:pl-0">
                  <h3 className="mt-7 hidden text-[22px] font-bold text-ink md:block">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[18px] leading-[1.6] text-ink-2 md:mt-2">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

const SHOWCASE_ICONS: Record<string, LucideIcon> = { list: ListChecks, choice: CloudUpload, undo: Undo2 };

/** Three phones on a soft stage. On phones it becomes a swipeable row with dots. */
export function Showcase() {
  const scroller = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const count = showcase.items.length;

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const items = Array.from(root.children);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(items.indexOf(e.target))),
      { root, threshold: 0.6 }
    );
    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const root = scroller.current;
    const item = root?.children[i] as HTMLElement | undefined;
    if (root && item) root.scrollTo({ left: item.offsetLeft - (root.clientWidth - item.clientWidth) / 2, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="showcase-title" className="py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionTitle id="showcase-title" eyebrow={showcase.eyebrow} title={showcase.title} subtitle={showcase.subtitle} center />
        </Reveal>
        <Reveal>
          <div className="relative mt-14 overflow-hidden rounded-[36px] bg-[linear-gradient(180deg,#E6EEF8_0%,#EDF3F1_100%)] pt-12 pb-8 ring-1 ring-black/[0.03] lg:pt-16 lg:pb-14">
            {/* soft rings behind the middle phone */}
            <svg aria-hidden className="absolute top-[42%] left-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2" viewBox="0 0 900 900" fill="none">
              {[160, 250, 340, 430].map((r) => (
                <circle key={r} cx="450" cy="450" r={r} stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="2" />
              ))}
            </svg>
            <ul
              ref={scroller}
              aria-label="App screens"
              className="no-scrollbar relative flex snap-x snap-mandatory gap-6 overflow-x-auto px-[calc(50%-125px)] pt-2 pb-4 lg:justify-center lg:gap-14 lg:overflow-visible lg:px-0"
            >
              {showcase.items.map((item, i) => {
                const Icon = SHOWCASE_ICONS[item.icon];
                const middle = i === 1;
                return (
                  <li key={item.shot} className={`flex w-[250px] shrink-0 snap-center flex-col items-center ${middle ? 'lg:-translate-y-3' : 'lg:translate-y-8'}`}>
                    <PhoneFrame shot={item.shot} width={250} className={middle ? 'lg:scale-[1.06]' : ''} />
                    <div className="mt-8 flex flex-col items-center text-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue shadow-[var(--shadow-card)]" aria-hidden>
                        <Icon size={22} strokeWidth={2.3} />
                      </span>
                      <p className="mt-3 max-w-[250px] text-[19px] leading-snug font-bold text-balance text-ink">{item.caption}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex justify-center lg:hidden">
              {showcase.items.map((item, i) => (
                <button
                  key={item.shot}
                  onClick={() => goTo(i)}
                  aria-label={`Show screen ${i + 1} of ${count}`}
                  aria-current={current === i ? 'true' : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                >
                  <span className={`block h-2.5 rounded-full transition-all duration-300 ${current === i ? 'w-7 bg-blue' : 'w-2.5 bg-blue/30'}`} />
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

const SAFETY_ICONS: Record<string, LucideIcon> = { check: ShieldCheck, undo: Undo2, hand: Hand };

export function Safety() {
  return (
    <section id="safety" aria-labelledby="safety-title" className="overflow-hidden bg-white py-24 sm:py-28">
      <Container className="grid items-center gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <div className="relative mx-auto w-fit py-6">
            <div aria-hidden className="absolute top-1/2 left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#DCEFE3_0%,#E4F1E9_55%,rgba(228,241,233,0)_100%)]" />
            <PhoneFrame shot="deleteWarning" width={280} className="relative" floorShadow />
            {/* sits on the phone's top corner, clear of the app's text */}
            <div className="float absolute top-[3%] -right-[110px] hidden items-center gap-2.5 rounded-[18px] bg-white py-2.5 pr-4 pl-2.5 text-[17px] font-bold text-green shadow-[var(--shadow-float)] ring-1 ring-black/[0.04] sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-soft" aria-hidden>
                <ShieldCheck size={20} strokeWidth={2.4} />
              </span>
              {safety.badge}
            </div>
          </div>
        </Reveal>
        <div className="order-1 lg:order-2">
          <Reveal>
            <SectionTitle id="safety-title" eyebrow={safety.eyebrow} title={safety.title} subtitle={safety.subtitle} tone="green" />
          </Reveal>
          <ul className="mt-10 flex flex-col gap-4">
            {safety.points.map((p, i) => {
              const Icon = SAFETY_ICONS[p.icon];
              return (
                <li key={p.title}>
                  <Reveal delay={i * 90} className="flex items-start gap-5 rounded-[22px] bg-bg p-5 ring-1 ring-black/[0.03] sm:p-6">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${TILE.green}`} aria-hidden>
                      <Icon size={24} strokeWidth={2.2} />
                    </span>
                    <div>
                      <h3 className="text-[21px] leading-snug font-bold text-ink">{p.title}</h3>
                      <p className="mt-1 text-[18px] leading-[1.6] text-ink-2">{p.text}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}

const ORG_ICONS: Record<string, LucideIcon> = { workshop: Presentation, questions: MessageCircleQuestion, guide: BookOpenText };

export function Organisations() {
  return (
    <section id="for-organisations" aria-labelledby="org-title" className="py-24 sm:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#DDEFE4_0%,#EAF4EE_50%,#E9F0F8_100%)] p-8 ring-1 ring-green/10 sm:p-12 lg:p-16">
            {/* decorative rings in the corner */}
            <svg aria-hidden className="absolute -top-40 -right-40 h-[520px] w-[520px]" viewBox="0 0 520 520" fill="none">
              {[90, 150, 210, 260].map((r) => (
                <circle key={r} cx="260" cy="260" r={r} stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="2" />
              ))}
            </svg>
            <div className="relative grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14">
              <div>
                <Eyebrow tone="green">{organisations.eyebrow}</Eyebrow>
                <h2 id="org-title" className="mt-4 text-[34px] leading-[1.1] font-bold tracking-[-0.02em] text-ink sm:text-[44px]">
                  {organisations.title}
                </h2>
                <p className="mt-5 max-w-[560px] text-[20px] leading-[1.6] text-ink">{organisations.text}</p>
                <a
                  href={PARTNER_MAILTO}
                  className="group mt-9 inline-flex min-h-[60px] items-center justify-center gap-2.5 rounded-2xl bg-green px-7 text-[20px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(30,107,70,0.8)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#165537]"
                >
                  {cta.partner}
                  <ArrowRight size={22} strokeWidth={2.6} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </a>
              </div>
              <ul className="flex flex-col gap-4">
                {organisations.items.map((item, i) => {
                  const Icon = ORG_ICONS[item.icon];
                  return (
                    <li key={item.text}>
                      <Reveal delay={i * 90} className="flex items-center gap-4 rounded-[20px] bg-white/90 p-4 shadow-[var(--shadow-card)] sm:p-5">
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${TILE.green}`} aria-hidden>
                          <Icon size={24} strokeWidth={2.2} />
                        </span>
                        <span className="text-[19px] leading-snug font-bold text-balance text-ink">{item.text}</span>
                      </Reveal>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="on-dark relative overflow-hidden bg-blue text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(55%_90%_at_12%_0%,rgba(255,255,255,0.16),rgba(255,255,255,0)_60%),radial-gradient(45%_80%_at_92%_100%,rgba(30,107,70,0.35),rgba(30,107,70,0)_65%)]"
      />
      {/* calm lake waves along the bottom */}
      <svg aria-hidden className="absolute inset-x-0 bottom-0 h-[120px] w-full" viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none">
        <path d="M0 70 C 180 40, 360 100, 540 70 S 900 40, 1080 70 S 1320 100, 1440 70 V120 H0 Z" fill="#FFFFFF" fillOpacity="0.05" />
        <path d="M0 95 C 200 70, 400 120, 600 95 S 1000 70, 1200 95 S 1380 110, 1440 100 V120 H0 Z" fill="#FFFFFF" fillOpacity="0.06" />
      </svg>
      <Container className="relative flex flex-col items-center py-24 text-center sm:py-28">
        <h2 id="final-title" className="max-w-[760px] text-[34px] leading-[1.1] font-bold tracking-[-0.02em] text-balance sm:text-[50px]">
          {finalCta.title}
        </h2>
        <p className="mt-5 text-[21px] text-balance text-white/90">{finalCta.text}</p>
        <DemoButton tone="white" className="mt-10 !min-h-[68px] !px-10 !text-[22px]" />
        <ul className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8">
          {hero.ticks.map((t) => (
            <li key={t} className="flex items-center gap-2.5 text-[18px] font-bold text-white">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-blue" aria-hidden>
                <Check size={16} strokeWidth={3.2} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
