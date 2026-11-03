import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Persona } from './components/Persona';
import { Features, FinalCta, HowItWorks, Organisations, Problem, Safety, Showcase } from './components/Sections';

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-xl bg-blue px-5 py-3 text-[18px] font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <div id="top" />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Features />
        <Problem />
        <HowItWorks />
        <Showcase />
        <Safety />
        <Organisations />
        <Persona />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
