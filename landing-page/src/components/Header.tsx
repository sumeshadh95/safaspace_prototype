import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { nav } from '../content';
import { Container, DemoButton, Logo } from './ui';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (window.scrollY < 300) setActive(null);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Underline the menu item of the section in the middle of the screen.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    nav.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Close the menu first, then scroll, so the page doesn't shift mid-scroll.
  const goTo = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    });
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || open ? 'border-line bg-white/90 shadow-[0_6px_24px_rgba(23,38,42,0.06)] backdrop-blur-md' : 'border-transparent bg-white'
      }`}
    >
      <Container className="flex h-[76px] items-center justify-between gap-2 !px-4 sm:!px-8">
        <a href="#top" className="flex min-h-[48px] items-center rounded-xl" aria-label="SafeSpace, back to top">
          <span className="hidden sm:block">
            <Logo />
          </span>
          <span className="sm:hidden">
            <Logo tagline={false} small />
          </span>
        </a>

        {/* the full menu only where it fits on one line; narrower screens get the Menu button */}
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative flex min-h-[48px] items-center rounded-xl px-3 text-[17px] font-bold whitespace-nowrap transition-colors hover:text-blue ${
                      isActive ? 'text-blue' : 'text-ink-2'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-3 bottom-1 h-[3px] rounded-full bg-blue transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* on phones the hero's big "Try the demo" is right below, so the bar keeps just the logo and Menu */}
          <span className="hidden sm:block">
            <DemoButton size="sm" className="!px-5" />
          </span>
          <button
            className="flex h-12 items-center gap-2 rounded-xl border-2 border-line bg-white px-3.5 text-[17px] font-bold text-ink hover:border-blue/30 hover:bg-blue-soft xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={24} strokeWidth={2.6} aria-hidden /> : <Menu size={24} strokeWidth={2.6} aria-hidden />}
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-line bg-white xl:hidden">
          <ul className="flex flex-col px-4 pt-3 pb-2">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(item.id);
                  }}
                  className="flex min-h-[56px] items-center rounded-xl px-3 text-[20px] font-bold text-ink hover:bg-blue-soft hover:text-blue"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-4 pb-5">
            <DemoButton className="w-full" />
          </div>
        </nav>
      )}
    </header>
  );
}
