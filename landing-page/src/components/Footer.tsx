import { ArrowUp, Mail } from 'lucide-react';
import { CONTACT_MAILTO } from '../config';
import { brand, footer, nav } from '../content';
import { Container, Logo } from './ui';

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-navy text-white">
      {/* a faint lake line along the top */}
      <svg aria-hidden className="absolute inset-x-0 top-0 h-10 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none" fill="none">
        <path d="M0 20 C 160 6, 320 34, 480 20 S 800 6, 960 20 S 1280 34, 1440 20" stroke="#FFFFFF" strokeOpacity="0.07" strokeWidth="2" />
      </svg>
      <Container className="relative grid gap-12 pt-20 pb-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light tagline={false} />
          <p className="mt-4 max-w-[340px] text-[17px] leading-[1.6] text-white/80">
            {brand.tagline}. {footer.about}.
          </p>
        </div>
        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="text-[15px] font-bold tracking-[0.08em] text-white/70 uppercase">
            {footer.exploreTitle}
          </h2>
          <ul className="mt-4 flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="inline-flex min-h-[40px] items-center rounded-lg text-[17px] text-white/90 underline-offset-4 hover:text-white hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-[15px] font-bold tracking-[0.08em] text-white/70 uppercase">{footer.contactTitle}</h2>
          <p className="mt-4 text-[17px] text-white/90">{footer.team}</p>
          <a href={CONTACT_MAILTO} className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-lg text-[17px] font-bold text-white underline-offset-4 hover:underline">
            <Mail size={20} strokeWidth={2.2} aria-hidden />
            {footer.contact}
          </a>
        </div>
      </Container>
      <div className="relative border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] leading-[1.6] text-white/75">{footer.legal}</p>
          <a href="#top" className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg text-[16px] font-bold text-white/90 hover:text-white">
            <ArrowUp size={18} strokeWidth={2.4} aria-hidden />
            {footer.backToTop}
          </a>
        </Container>
      </div>
    </footer>
  );
}
