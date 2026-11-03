import { useState } from 'react';
import { Mail, Plus } from 'lucide-react';
import { CONTACT_MAILTO } from '../config';
import { faq } from '../content';
import { Container, Reveal, SectionTitle } from './ui';

/** Accessible accordion: each question is a button with aria-expanded; answers open smoothly. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-24 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <SectionTitle id="faq-title" eyebrow={faq.eyebrow} title={faq.title} />
            {/* desktop: under the title; phones: after the questions (below) */}
            <HelpCard className="mt-8 hidden lg:block" />
          </div>
        </Reveal>

        <ul className="flex flex-col gap-4">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className={`rounded-[22px] bg-card ring-1 transition-shadow duration-300 ${isOpen ? 'shadow-[var(--shadow-lift)] ring-blue/15' : 'shadow-[var(--shadow-card)] ring-black/[0.03]'}`}>
                <h3>
                  <button
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-[80px] w-full items-center justify-between gap-5 rounded-[22px] px-6 py-5 text-left text-[20px] leading-snug font-bold text-ink hover:text-blue sm:text-[21px]"
                  >
                    {item.q}
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${isOpen ? 'bg-blue text-white' : 'bg-blue-soft text-blue'}`}
                      aria-hidden
                    >
                      <Plus size={22} strokeWidth={2.6} className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                    </span>
                  </button>
                </h3>
                {/* Closed answers are invisible (not read aloud) and collapse smoothly. */}
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ${isOpen ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-[19px] leading-[1.6] text-ink-2">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <HelpCard className="lg:hidden" />
      </Container>
    </section>
  );
}

function HelpCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-[22px] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-black/[0.03] ${className}`}>
      <p className="text-[20px] font-bold text-ink">{faq.help.title}</p>
      <p className="mt-1 text-[18px] text-ink-2">{faq.help.text}</p>
      <a href={CONTACT_MAILTO} className="mt-4 inline-flex min-h-[48px] items-center gap-2.5 rounded-xl text-[19px] font-bold text-blue underline-offset-4 hover:underline">
        <Mail size={22} strokeWidth={2.3} aria-hidden />
        {faq.help.link}
      </a>
    </div>
  );
}
