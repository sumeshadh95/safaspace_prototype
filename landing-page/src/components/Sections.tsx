import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeAlert,
  BookOpenText,
  CalendarDays,
  Camera,
  Check,
  CloudCheck,
  CloudUpload,
  Globe,
  Hand,
  Heart,
  HeartHandshake,
  Images,
  ListChecks,
  MessageCircle,
  MessageCircleQuestion,
  Phone,
  Presentation,
  Quote,
  Settings,
  ShieldCheck,
  Smartphone,
  ThumbsUp,
  Undo2,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { PARTNER_MAILTO, PROTOTYPE_URL } from '../config';
import { cta, families, features, finalCta, hero, howItWorks, organisations, problem, safety, showcase } from '../content';
import { PhoneFrame } from './PhoneFrame';
import { CheckArt, SaveArt, SortArt } from './StepArt';
import { Container, DemoButton, Eyebrow, Reveal, SectionTitle, TILE } from './ui';

// Each benefit gets its own colour: a gradient icon, a colour line along the top and a large faint icon.
const FEATURE_LOOKS: Record<string, { icon: LucideIcon; from: string; to: string }> = {
  cloud: { icon: CloudCheck, from: '#5A85E6', to: '#2448A8' },
  shield: { icon: ShieldCheck, from: '#43A873', to: '#1E6B46' },
  undo: { icon: Undo2, from: '#8E74DB', to: '#5B3FA0' },
  people: { icon: Users, from: '#EFA052', to: '#B35F17' },
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
            const { icon: Icon, from, to } = FEATURE_LOOKS[f.icon];
            return (
              <li key={f.title}>
                <Reveal delay={i * 80} className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-[24px] bg-card p-7 pt-8 shadow-[var(--shadow-card)] ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                    <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: `linear-gradient(90deg, ${from}, ${to})` }} />
                    <Icon
                      aria-hidden
                      size={150}
                      strokeWidth={1.4}
                      className="pointer-events-none absolute -right-9 -bottom-9 opacity-[0.07] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                      style={{ color: to }}
                    />
                    <span
                      aria-hidden
                      className="relative flex h-16 w-16 items-center justify-center rounded-[20px] text-white"
                      style={{ background: `linear-gradient(150deg, ${from}, ${to})`, boxShadow: `0 14px 26px -12px ${to}` }}
                    >
                      <Icon size={30} strokeWidth={2.2} />
                    </span>
                    <h3 className="relative mt-6 text-[22px] leading-snug font-bold text-ink">{f.title}</h3>
                    <p className="relative mt-2 text-[18px] leading-[1.6] text-ink-2">{f.text}</p>
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

// Each worry is a speech bubble in its own soft colour, gently tilted like notes pinned to a board.
const PROBLEM_LOOKS: Record<string, { icon: LucideIcon; bubble: string; ink: string; tilt: string }> = {
  full: { icon: Smartphone, bubble: '#FBEEDD', ink: 'text-orange-ink', tilt: 'md:-rotate-[1.5deg]' },
  heart: { icon: Heart, bubble: '#EFE9F8', ink: 'text-violet', tilt: 'md:translate-y-3 md:rotate-[1deg]' },
  ads: { icon: BadgeAlert, bubble: '#E6EEF9', ink: 'text-blue', tilt: 'md:-rotate-[0.75deg]' },
};

/** Plain-language worries, shown as speech bubbles, then the answer with a way to see how. */
export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="relative overflow-hidden bg-[#EDF2EF] py-24">
      <Container>
        <Reveal>
          <SectionTitle id="problem-title" title={problem.title} center />
        </Reveal>
        <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-7">
          {problem.items.map((p, i) => {
            const { icon: Icon, bubble, ink, tilt } = PROBLEM_LOOKS[p.icon];
            return (
              <li key={p.text}>
                <Reveal delay={i * 100} className="h-full">
                  <div
                    className={`relative h-full rounded-[26px] rounded-bl-[6px] p-7 shadow-[var(--shadow-card)] ring-1 ring-black/[0.04] transition-[rotate,translate] duration-300 hover:rotate-0 ${tilt}`}
                    style={{ background: bubble }}
                  >
                    <Quote aria-hidden size={64} strokeWidth={0} fill="currentColor" className={`absolute top-4 right-5 opacity-[0.13] ${ink}`} />
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_6px_14px_-8px_rgba(23,38,42,0.4)] ${ink}`} aria-hidden>
                      <Icon size={24} strokeWidth={2.2} />
                    </span>
                    <p className="relative mt-5 text-[22px] leading-snug text-pretty text-ink">“{p.text}”</p>
                    {/* bubble tail */}
                    <svg aria-hidden className="absolute -bottom-[13px] left-0" width="26" height="14" viewBox="0 0 26 14">
                      <path d="M0 0 H26 C18 2 8 7 0 14 Z" fill={bubble} />
                    </svg>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <Reveal>
          <div className="mx-auto mt-16 flex w-fit max-w-full flex-col items-center gap-4 rounded-[26px] bg-card px-6 py-6 text-center shadow-[var(--shadow-card)] ring-1 ring-green/15 sm:flex-row sm:gap-5 sm:py-4 sm:pr-4 sm:pl-5 sm:text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green text-white shadow-[0_6px_14px_-6px_rgba(30,107,70,0.8)]" aria-hidden>
              <Check size={26} strokeWidth={3} />
            </span>
            <p className="text-[22px] leading-snug font-bold text-balance text-ink">{problem.answer}</p>
            <a
              href="#how-it-works"
              className="group inline-flex min-h-[52px] shrink-0 items-center gap-2 rounded-2xl bg-green-soft px-5 text-[18px] font-bold text-green transition-colors hover:bg-[#D3E9DC]"
            >
              {problem.link}
              <ArrowRight size={20} strokeWidth={2.6} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

// Each step gets its own colour and a small drawing of that part of the app.
const STEP_LOOKS = [
  { Art: CheckArt, panel: 'bg-[linear-gradient(160deg,#F2F6FC_0%,#E0EAF8_100%)]', tag: TILE.blue },
  { Art: SortArt, panel: 'bg-[linear-gradient(160deg,#F1F8F3_0%,#DDEEE3_100%)]', tag: TILE.green },
  { Art: SaveArt, panel: 'bg-[linear-gradient(160deg,#F6F3FB_0%,#E7E0F4_100%)]', tag: TILE.violet },
];

export function HowItWorks() {
  const last = howItWorks.steps.length - 1;
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="border-y border-line bg-white py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionTitle id="how-title" eyebrow={howItWorks.eyebrow} title={howItWorks.title} subtitle={howItWorks.subtitle} center />
        </Reveal>
        <ol className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {howItWorks.steps.map((s, i) => {
            const { Art, panel, tag } = STEP_LOOKS[i];
            return (
              <li key={s.title}>
                <Reveal delay={i * 120} className="relative h-full">
                  <div className="h-full rounded-[28px] bg-card p-3 shadow-[var(--shadow-card)] ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:grid sm:grid-cols-2 sm:items-center lg:block">
                    <div aria-hidden className={`relative flex h-[214px] items-center justify-center overflow-hidden rounded-[22px] ${panel}`}>
                      <svg className="absolute -top-28 -right-28 h-[300px] w-[300px]" viewBox="0 0 300 300" fill="none">
                        {[70, 110, 150].map((r) => (
                          <circle key={r} cx="150" cy="150" r={r} stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="2" />
                        ))}
                      </svg>
                      <Art />
                    </div>
                    <div className="px-4 pt-6 pb-4 sm:px-7 sm:py-4 lg:px-4 lg:pt-6 lg:pb-4">
                      <h3 className="text-[22px] leading-snug font-bold text-ink">
                        <span className={`mb-3 flex w-fit rounded-full px-3 py-1 text-[15px] ${tag}`}>
                          Step {i + 1}
                          <span className="sr-only">:</span>
                        </span>{' '}
                        {s.title}
                      </h3>
                      <p className="mt-2 text-[18px] leading-[1.6] text-ink-2">{s.text}</p>
                    </div>
                  </div>
                  {/* desktop: a round arrow between the cards */}
                  {i < last && (
                    <span
                      aria-hidden
                      className="absolute top-[98px] -right-[38px] z-10 hidden h-11 w-11 items-center justify-center rounded-full bg-white text-blue shadow-[var(--shadow-float)] ring-1 ring-black/[0.05] lg:flex"
                    >
                      <ArrowRight size={21} strokeWidth={2.6} />
                    </span>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
        <Reveal className="mt-12 flex justify-center">
          <a
            href={PROTOTYPE_URL}
            target="_blank"
            rel="noopener"
            data-cta="demo"
            className="group inline-flex min-h-[60px] items-center justify-center gap-2.5 rounded-2xl border-2 border-blue bg-white px-7 text-[20px] font-bold text-blue transition-colors hover:bg-blue-soft"
          >
            {howItWorks.tryLink}
            <ArrowRight size={22} strokeWidth={2.6} className="transition-transform group-hover:translate-x-1" aria-hidden />
            <span className="sr-only"> (opens the demo in a new tab)</span>
          </a>
        </Reveal>
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
              tabIndex={0}
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
                  className="flex h-12 w-12 items-center justify-center rounded-full"
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

const FAMILY_ICONS: Record<string, LucideIcon> = { together: HeartHandshake, undo: Undo2, lead: ThumbsUp };

/** For the sons, daughters and grandchildren who help: three tips, and where to find the app. */
export function Families() {
  return (
    <section id="families" aria-labelledby="families-title" className="relative overflow-hidden bg-[#FBF6EE] py-24 sm:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <Reveal>
            <SectionTitle id="families-title" eyebrow={families.eyebrow} title={families.title} subtitle={families.text} tone="green" />
          </Reveal>
          <ol className="mt-10 flex flex-col gap-4">
            {families.tips.map((t, i) => {
              const Icon = FAMILY_ICONS[t.icon];
              return (
                <li key={t.title}>
                  <Reveal delay={i * 90} className="flex items-start gap-5 rounded-[22px] bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-black/[0.03] sm:p-6">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${TILE.orange}`} aria-hidden>
                      <Icon size={24} strokeWidth={2.2} />
                    </span>
                    <div>
                      <h3 className="text-[21px] leading-snug font-bold text-ink">{t.title}</h3>
                      <p className="mt-1 text-[18px] leading-[1.6] text-ink-2">{t.text}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
          <Reveal className="mt-9">
            <DemoButton label={families.cta} />
          </Reveal>
        </div>
        <Reveal>
          <FindSafeSpace />
        </Reveal>
      </Container>
    </section>
  );
}

// The phone's home screen in the demo: SafeSpace is the green icon among the usual apps.
const HOME_APPS: { label: string; icon: LucideIcon; colors: [string, string]; safeSpace?: boolean }[] = [
  { label: 'Calendar', icon: CalendarDays, colors: ['#5B8DEF', '#3563D6'] },
  { label: 'Gallery', icon: Images, colors: ['#F06D8C', '#C9446A'] },
  { label: 'Settings', icon: Settings, colors: ['#8A94A3', '#5E6875'] },
  { label: 'SafeSpace', icon: ShieldCheck, colors: ['#2E8B5A', '#1E6B46'], safeSpace: true },
];
const HOME_DOCK: { label: string; icon: LucideIcon; colors: [string, string] }[] = [
  { label: 'Phone', icon: Phone, colors: ['#4CC36F', '#2E9A52'] },
  { label: 'Messages', icon: MessageCircle, colors: ['#5B8DEF', '#3563D6'] },
  { label: 'Internet', icon: Globe, colors: ['#8E7CF0', '#5F4BD1'] },
  { label: 'Camera', icon: Camera, colors: ['#F2706B', '#D64A45'] },
];

/** A small phone on its home screen with the SafeSpace icon pointed out (decorative). */
function FindSafeSpace() {
  return (
    <div className="relative mx-auto w-fit py-6" aria-hidden>
      <div className="absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#F8E3C8_0%,rgba(248,227,200,0)_100%)]" />
      <div className="relative w-[300px] rounded-[46px] bg-[linear-gradient(150deg,#4A5458_0%,#252C2F_30%,#15191B_70%)] p-[9px] shadow-[0_32px_64px_-24px_rgba(10,20,24,0.55)]">
        <div
          className="relative h-[500px] overflow-hidden rounded-[36px] text-white"
          style={{
            background:
              'radial-gradient(120% 65% at 105% -5%, rgba(126,156,240,0.55) 0%, rgba(126,156,240,0) 60%), radial-gradient(95% 55% at -10% 105%, rgba(56,178,160,0.5) 0%, rgba(56,178,160,0) 62%), linear-gradient(172deg, #16264A 0%, #1F3B66 48%, #1A4658 100%)',
          }}
        >
          <p className="px-6 pt-12 text-[56px] leading-none font-light tracking-[-0.02em]">9:30</p>
          <p className="px-6 pt-2 text-[16px] text-white/85">Sunday</p>
          <div className="absolute inset-x-0 bottom-0 px-3 pb-4">
            <div className="grid grid-cols-4">
              {HOME_APPS.map((app) => (
                <MiniApp key={app.label} {...app} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-4 rounded-[24px] bg-white/15 py-2.5">
              {HOME_DOCK.map((app) => (
                <MiniApp key={app.label} {...app} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniApp({ label, icon: Icon, colors, safeSpace = false }: { label: string; icon: LucideIcon; colors: [string, string]; safeSpace?: boolean }) {
  return (
    <span className="flex flex-col items-center gap-1.5">
      <span className="relative">
        {safeSpace && (
          <>
            <span className="ripple absolute -inset-1.5 rounded-[18px] border-2 border-white/80" />
            {/* note above the icon, pointing down at it (it stays inside the screen at every width) */}
            <span className="float absolute right-[-10px] bottom-[calc(100%+16px)] w-[178px] rounded-[16px] bg-white px-3.5 py-2.5 text-[15px] leading-snug font-bold text-ink shadow-[var(--shadow-float)]">
              {families.findIt}
              <svg className="absolute right-[22px] -bottom-[10px]" width="20" height="11" viewBox="0 0 20 11">
                <path d="M0 0 H20 L13 11 Z" fill="#FFFFFF" />
              </svg>
            </span>
          </>
        )}
        <span
          className={`relative flex h-11 w-11 items-center justify-center rounded-[15px] ring-1 ring-white/15 ${safeSpace ? 'shadow-[0_0_0_4px_rgba(255,255,255,0.25)]' : ''}`}
          style={{ background: `linear-gradient(160deg, ${colors[0]}, ${colors[1]})` }}
        >
          <Icon size={22} strokeWidth={2.1} />
        </span>
      </span>
      <span className={`text-[12.5px] leading-none [text-shadow:0_1px_3px_rgba(0,0,0,0.6)] ${safeSpace ? 'font-bold' : ''}`}>{label}</span>
    </span>
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
