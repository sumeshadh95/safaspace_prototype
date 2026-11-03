import { useEffect, useRef, useState } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { BringBackScreen } from './components/BringBackScreen';
import { DemoPanel } from './components/DemoPanel';
import { CATEGORIES } from './data/files';
import { ActionsProvider } from './lib/actions';
import { useSettings } from './lib/settings';
import { CategoryScreen } from './screens/CategoryScreen';
import { CloudScreen } from './screens/CloudScreen';
import { HomeScreen } from './screens/HomeScreen';
import { PowerSaving, SaverBanner, type SaverView } from './screens/PowerSaving';
import { ResultsScreen } from './screens/ResultsScreen';
import { ScanningScreen } from './screens/ScanningScreen';

// Screens live in the URL hash (#/results, #/photos …) so a refresh keeps your place.
function readRoute() {
  return window.location.hash.replace(/^#\/?/, '') || 'home';
}

function useRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = (to: string, replace = false) => {
    const hash = to === 'home' ? '#/' : `#/${to}`;
    if (replace) window.history.replaceState(null, '', hash);
    else window.history.pushState(null, '', hash);
    setRoute(to);
  };
  return [route, go] as const;
}

export default function App() {
  const [route, go] = useRoute();
  const { theme, powerSaving } = useSettings();
  const [demoOpen, setDemoOpen] = useState(false);
  const [saverView, setSaverView] = useState<SaverView>('home');
  const scroller = useRef<HTMLDivElement>(null);

  // Power saving shows its own black home screen; SafeSpace can still be opened from it (in dark mode).
  const isCloud = route === 'cloud';
  const saverHome = powerSaving && saverView !== 'safespace' && !isCloud;
  const effectiveTheme = !isCloud && powerSaving ? 'dark' : theme;

  useEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', saverHome ? '#000000' : effectiveTheme === 'dark' ? '#0E1618' : '#F6F8F7');
  }, [effectiveTheme, saverHome]);

  useEffect(() => {
    if (!powerSaving) setSaverView('home');
  }, [powerSaving]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [route, saverView]);

  // The cloud view is meant for a second laptop tab, so it has no phone frame.
  if (isCloud) return <CloudScreen />;

  const category = CATEGORIES.find((c) => c.slug === route);

  let screen;
  if (route === 'scan') {
    screen = <ScanningScreen onDone={() => go('results', true)} />;
  } else if (route === 'results') {
    screen = <ResultsScreen onOpen={(slug) => go(slug)} onBringBack={() => go('bring-back')} />;
  } else if (category) {
    screen = <CategoryScreen key={category.type} type={category.type} title={category.title} onBack={() => go('results')} />;
  } else if (route === 'bring-back') {
    screen = <BringBackScreen onBack={() => go('results')} />;
  } else {
    screen = <HomeScreen onCheck={() => go('scan')} onDemo={() => setDemoOpen(true)} />;
  }

  return (
    <PhoneFrame saver={saverHome} powerSaving={powerSaving}>
      {saverHome ? (
        <PowerSaving view={saverView} onOpen={setSaverView} />
      ) : (
        <ActionsProvider>
          {powerSaving && <SaverBanner onHome={() => setSaverView('home')} />}
          <main ref={scroller} className={`scroll-area absolute inset-x-0 bottom-0 overflow-x-hidden overflow-y-auto ${powerSaving ? 'top-[60px]' : 'top-0'}`}>
            {screen}
          </main>
          {demoOpen && (
            <DemoPanel
              onClose={() => setDemoOpen(false)}
              onReset={() => {
                setDemoOpen(false);
                go('home', true);
              }}
            />
          )}
        </ActionsProvider>
      )}
    </PhoneFrame>
  );
}
