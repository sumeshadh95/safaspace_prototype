import type { ReactNode } from 'react';
import { StatusBar } from './StatusBar';

/**
 * Full screen on a phone. On a laptop/projector the app sits inside a phone drawn in CSS
 * (graphite body, side buttons, status bar with a small camera), like the landing page phones.
 * The app area has a transform so `position: fixed` overlays stay inside the phone screen.
 */
export function PhoneFrame({ saver = false, powerSaving = false, children }: { saver?: boolean; powerSaving?: boolean; children: ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center sm:p-6">
      <div className="relative h-full w-full sm:h-auto sm:w-auto sm:rounded-[58px] sm:p-[11px] sm:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14),inset_0_1.5px_1px_rgba(255,255,255,0.2),0_0_0_1px_rgba(8,12,14,0.9),0_40px_90px_-20px_rgba(10,20,24,0.55)] sm:[background:linear-gradient(150deg,#4A5458_0%,#252C2F_28%,#15191B_68%,#0E1112_100%)]">
        {/* side buttons: volume on the left, power on the right */}
        <span aria-hidden className="absolute top-[17%] -left-[3px] hidden h-[5.5%] w-1 rounded-l-[3px] bg-[linear-gradient(90deg,#3A4246,#1A1F21)] sm:block" />
        <span aria-hidden className="absolute top-[24.5%] -left-[3px] hidden h-[5.5%] w-1 rounded-l-[3px] bg-[linear-gradient(90deg,#3A4246,#1A1F21)] sm:block" />
        <span aria-hidden className="absolute top-[21%] -right-[3px] hidden h-[9%] w-1 rounded-r-[3px] bg-[linear-gradient(270deg,#3A4246,#1A1F21)] sm:block" />

        <div className="relative h-full w-full overflow-hidden bg-bg transition-colors duration-300 sm:h-[min(844px,calc(100vh-70px))] sm:w-[390px] sm:rounded-[47px] sm:shadow-[0_0_0_1px_rgba(0,0,0,0.6)]">
          <StatusBar saver={saver} powerSaving={powerSaving} />
          <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden [transform:translateZ(0)] sm:top-[36px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
