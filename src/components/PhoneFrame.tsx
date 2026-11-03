import { useEffect, useState, type ReactNode } from 'react';
import { StatusBar } from './StatusBar';

// The drawn phone is 412 × 866 px (a 390 × 844 screen inside an 11px edge), with 24px of room around it.
// On a short laptop or projector screen the whole phone shrinks to fit, so its screen is never cut off.
const PHONE_W = 412;
const PHONE_H = 866;
const ROOM = 48;
const framed = window.matchMedia('(min-width: 40rem)'); // Tailwind's `sm`: where the drawn phone appears

function fitScale() {
  if (!framed.matches) return 1;
  const fit = Math.min(1, (window.innerHeight - ROOM) / PHONE_H, (window.innerWidth - ROOM) / PHONE_W);
  return Math.max(0.3, Math.floor(fit * 1000) / 1000);
}

function useFitScale() {
  const [scale, setScale] = useState(fitScale);
  useEffect(() => {
    const update = () => setScale(fitScale());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

/**
 * Full screen on a phone. On a laptop/projector the app sits inside a phone drawn in CSS
 * (graphite body, side buttons, status bar with a small camera), like the landing page phones.
 * The app area has a transform so `position: fixed` overlays stay inside the phone screen.
 */
export function PhoneFrame({ saver = false, powerSaving = false, children }: { saver?: boolean; powerSaving?: boolean; children: ReactNode }) {
  const scale = useFitScale();

  return (
    <div className="flex h-full w-full items-center justify-center sm:p-6">
      <div
        style={scale < 1 ? { zoom: scale } : undefined}
        className="relative h-full w-full sm:h-auto sm:w-auto sm:rounded-[58px] sm:p-[11px] sm:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14),inset_0_1.5px_1px_rgba(255,255,255,0.2),0_0_0_1px_rgba(8,12,14,0.9),0_40px_90px_-20px_rgba(10,20,24,0.55)] sm:[background:linear-gradient(150deg,#4A5458_0%,#252C2F_28%,#15191B_68%,#0E1112_100%)]"
      >
        {/* side buttons: volume on the left, power on the right */}
        <span aria-hidden className="absolute top-[17%] -left-[3px] hidden h-[5.5%] w-1 rounded-l-[3px] bg-[linear-gradient(90deg,#3A4246,#1A1F21)] sm:block" />
        <span aria-hidden className="absolute top-[24.5%] -left-[3px] hidden h-[5.5%] w-1 rounded-l-[3px] bg-[linear-gradient(90deg,#3A4246,#1A1F21)] sm:block" />
        <span aria-hidden className="absolute top-[21%] -right-[3px] hidden h-[9%] w-1 rounded-r-[3px] bg-[linear-gradient(270deg,#3A4246,#1A1F21)] sm:block" />

        <div className="relative h-full w-full overflow-hidden bg-bg transition-colors duration-300 sm:h-[844px] sm:w-[390px] sm:rounded-[47px] sm:shadow-[0_0_0_1px_rgba(0,0,0,0.6)]">
          <StatusBar saver={saver} powerSaving={powerSaving} />
          <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden [transform:translateZ(0)] sm:top-[36px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
