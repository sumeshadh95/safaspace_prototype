import { Quote } from 'lucide-react';
import { madeIn, stories } from '../content';
import { Container, Reveal } from './ui';

/** User story strip. Today it shows our persona, clearly labelled as one. */
export function Persona() {
  return (
    <section aria-label="User story" className="overflow-hidden border-y border-line bg-white py-20 sm:py-24">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-12">
          {stories.map((s) => (
            <Reveal key={s.quote}>
              <figure>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-soft text-blue" aria-hidden>
                  <Quote size={24} strokeWidth={2.4} fill="currentColor" />
                </span>
                <blockquote className="mt-6 text-[26px] leading-[1.35] font-bold text-balance text-ink sm:text-[32px]">“{s.quote}”</blockquote>
                <figcaption className="mt-7 flex items-center gap-4">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-soft text-[24px] font-bold text-blue ring-4 ring-white shadow-[var(--shadow-card)]"
                    aria-hidden
                  >
                    {s.initials}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[19px] font-bold text-ink">{s.name}</span>
                    <span className="rounded-full bg-orange-badge px-3 py-1 text-[15px] font-bold text-orange-ink">{s.label}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <MikkeliSkyline className="h-auto w-full" />
          <p className="mt-1 -rotate-2 pr-2 text-right font-[family-name:var(--font-hand)] text-[38px] leading-none font-semibold text-[#3F5F86]">{madeIn}</p>
        </Reveal>
      </Container>
    </section>
  );
}

/** Thin line-art of Mikkeli: pines, the Naisvuori tower on its hill, houses, the cathedral spire, a birch, the lake and a sailboat. */
function MikkeliSkyline({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 230" className={className} fill="none" stroke="#8AA2BE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      {/* birds */}
      <path d="M232 46 q6 -5 12 0 q6 -5 12 0 M262 34 q4 -4 8 0 q4 -4 8 0" />
      {/* ground */}
      <path d="M10 166 H510" />
      {/* pines, left */}
      <path d="M22 166 L37 122 L52 166 M29 147 H45 M25 157 H49" />
      <path d="M50 166 L68 104 L86 166 M57 138 H79 M53 153 H83" />
      {/* Naisvuori tower on its hill */}
      <path d="M94 166 C114 150 152 146 180 166" />
      <path d="M131 152 V86 M145 152 V86 M131 122 H145" />
      <path d="M123 86 H153 V71 H123 Z M129 78.5 H133 M137 78.5 H141 M145 78.5 H148" />
      <path d="M126 71 L138 61 L150 71 M138 61 V48" />
      {/* houses */}
      <path d="M190 166 V137 L208 123 L226 137 V166 M202 166 V153 H214 V166" />
      <path d="M234 166 V143 H270 V166 M241 150 h7 v6 h-7 Z M256 150 h7 v6 h-7 Z" />
      {/* cathedral: nave, tall tower and spire */}
      <path d="M282 166 V127 L315 105 L348 127 V166" />
      <path d="M294 166 V150 Q300 141 306 150 V166 M322 152 V141 Q327 133 332 141 V152 Z" />
      <path d="M348 166 V84 H372 V166 M348 128 H372 M348 95 H372" />
      <path d="M354 120 V106 Q360 98 366 106 V120" />
      <path d="M346 84 L360 22 L374 84 M346 84 L348 72 L350 84 M370 84 L372 72 L374 84" />
      <path d="M360 22 V10 M355 15 H365" />
      {/* round tree and birch */}
      <circle cx="394" cy="139" r="15" />
      <path d="M394 154 V166" />
      <path d="M420 166 C418 150 422 134 419 116 M416 152 h4 M418 140 h4 M417 128 h3" />
      <ellipse cx="419" cy="112" rx="12" ry="17" />
      {/* pines, right */}
      <path d="M440 166 L458 108 L476 166 M447 140 H469 M443 154 H473" />
      <path d="M478 166 L491 132 L504 166 M483 152 H499" />
      {/* the lake */}
      <path d="M20 188 q15 -8 30 0 t30 0 t30 0 t30 0" />
      <path d="M180 190 q15 -8 30 0 t30 0 t30 0 t30 0 t30 0" />
      <path d="M70 210 q15 -8 30 0 t30 0 t30 0" />
      <path d="M300 212 q15 -8 30 0 t30 0 t30 0" />
      {/* sailboat */}
      <path d="M426 198 H466 L459 206 H433 Z M446 196 V162 M446 164 L463 194 H446" />
    </svg>
  );
}
