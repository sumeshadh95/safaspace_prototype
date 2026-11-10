import { useEffect, useRef, useState } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { BringBackScreen } from './components/BringBackScreen';
import { DemoPanel } from './components/DemoPanel';
import { SystemTakeover } from './components/SystemTakeover';
import { CATEGORIES } from './data/files';
import { ActionsProvider } from './lib/actions';
import { useSettings } from './lib/settings';
import { switchPowerSaving, useTakeover } from './lib/system';
import { CategoryScreen } from './screens/CategoryScreen';
import { CloudScreen } from './screens/CloudScreen';
import { HomeScreen } from './screens/HomeScreen';
import { Launcher } from './screens/Launcher';
import { PowerSaving, SaverBanner, type SaverView } from './screens/PowerSaving';
import { ResultsScreen } from './screens/ResultsScreen';
import { ScanningScreen } from './screens/ScanningScreen';

// Screens live in the URL hash (#/home, #/results …) so a refresh keeps your place.
// No hash is the phone's own home screen; SafeSpace itself starts at #/home.
function readRoute() {
  return window.location.hash.replace(/^#\/?/, '') || 'phone';
}

function useRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = (to: string, replace = false) => {
    const hash = to === 'phone' ? '#/' : `#/${to}`;
    if (replace) window.history.replaceState(null, '', hash);
    else window.history.pushState(null, '', hash);
    setRoute(to);
  };
  return [route, go] as const;
}

/** How long SafeSpace takes to grow out of its icon (the app-open animation). */
const OPEN_MS = 450;

export default function App() {
  const [route, go] = useRoute();
  const { theme, powerSaving } = useSettings();
  const takeover = useTakeover();
  const [demoOpen, setDemoOpen] = useState(false);
  const [saverView, setSaverView] = useState<SaverView>('home');
  const [opening, setOpening] = useState<string | null>(null); // where SafeSpace grows from
  const scroller = useRef<HTMLDivElement>(null);

  // Power saving is a phone mode: its black home screen replaces the phone's own home screen.
  // SafeSpace can still be opened from it (in dark mode).
  const isCloud = route === 'cloud';
  const saverHome = powerSaving && saverView !== 'safespace' && !isCloud;
  const launcher = !powerSaving && route === 'phone';
  const effectiveTheme = !isCloud && powerSaving ? 'dark' : theme;
  // While power saving takes over, the screen that is closing shrinks away behind the phone's panel.
  const closing = (takeover === 'saver-on' && !powerSaving) || (takeover === 'saver-off' && saverHome);

  useEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme;
    const color = saverHome ? '#000000' : launcher ? '#16264A' : effectiveTheme === 'dark' ? '#0E1618' : '#F6F8F7';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  }, [effectiveTheme, saverHome, launcher]);

  useEffect(() => {
    if (!powerSaving) setSaverView('home');
  }, [powerSaving]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [route, saverView]);

  useEffect(() => {
    if (!opening) return;
    const t = setTimeout(() => setOpening(null), OPEN_MS);
    return () => clearTimeout(t);
  }, [opening]);

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

  let content;
  if (saverHome) {
    content = (
      <PowerSaving
        view={saverView}
        onOpen={(view) => {
          if (view === 'safespace' && route === 'phone') go('home');
          setSaverView(view);
        }}
        onTurnOff={() => switchPowerSaving(false, () => go('phone', true))}
      />
    );
  } else if (launcher) {
    content = (
      <Launcher
        onOpenSafeSpace={(origin) => {
          setOpening(origin);
          go('home');
        }}
      />
    );
  } else {
    content = (
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
              go('phone', true);
            }}
          />
        )}
      </ActionsProvider>
    );
  }

  return (
    <PhoneFrame
      bar={saverHome ? 'black' : launcher ? 'clear' : 'app'}
      fullBleed={launcher}
      powerSaving={powerSaving}
      overlay={takeover && <SystemTakeover kind={takeover} />}
    >
      {/* the phone's home screen stays behind SafeSpace while it opens (lined up with the status bar) */}
      {opening && (
        <div aria-hidden inert className="absolute inset-x-0 top-0 bottom-0 sm:-top-[36px]">
          <Launcher onOpenSafeSpace={() => {}} />
        </div>
      )}
      <div className={`absolute inset-0 ${opening ? 'app-open bg-bg' : ''} ${closing ? 'app-close' : ''}`} style={opening ? { transformOrigin: opening } : undefined}>
        {content}
      </div>
    </PhoneFrame>
  );
}
