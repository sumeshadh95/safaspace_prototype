import { screenshots } from '../content';
import shotMeta from '../generated/screenshots.json';

export type ShotKey = keyof typeof screenshots;

const META = shotMeta as Record<string, { top: string; light: boolean }>;
const base = import.meta.env.BASE_URL;

interface Props {
  shot: ShotKey;
  width?: number;
  /** Load right away (for phones visible when the page opens). */
  eager?: boolean;
  /** Highest loading priority (the main hero phone). */
  priority?: boolean;
  /** A soft shadow on the "floor" under the phone. */
  floorShadow?: boolean;
  className?: string;
}

/**
 * A generic, brand-free phone drawn in CSS: graphite body with a soft metal rim, a thin even
 * bezel, side buttons, and a status bar with a small round camera above the app screenshot.
 * The status bar takes the colour of the screenshot's top edge (measured by
 * scripts/prepare-screenshots.mjs), so the two join seamlessly.
 */
export function PhoneFrame({ shot, width = 280, eager = false, priority = false, floorShadow = false, className = '' }: Props) {
  const { file, alt } = screenshots[shot];
  const meta = META[file] ?? { top: '#F6F8F7', light: true };
  const bezel = Math.max(6, Math.round(width * 0.03));
  const radius = Math.round(width * 0.16);
  const inner = width - bezel * 2;
  const bar = Math.round(inner * 0.075);
  const camera = Math.max(6, Math.round(inner * 0.036));
  const text = Math.max(8, inner * 0.04);

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width }}>
      {floorShadow && (
        <div aria-hidden className="absolute inset-x-[6%] -bottom-8 h-12 rounded-[50%] bg-[radial-gradient(closest-side,rgba(23,38,42,0.28),rgba(23,38,42,0))]" />
      )}

      {/* side buttons: volume on the left, power on the right */}
      <span aria-hidden className="absolute -left-[3px] top-[17%] h-[5.5%] w-1 rounded-l-[3px] bg-[linear-gradient(90deg,#3A4246,#1A1F21)]" />
      <span aria-hidden className="absolute -left-[3px] top-[24.5%] h-[5.5%] w-1 rounded-l-[3px] bg-[linear-gradient(90deg,#3A4246,#1A1F21)]" />
      <span aria-hidden className="absolute -right-[3px] top-[21%] h-[9%] w-1 rounded-r-[3px] bg-[linear-gradient(270deg,#3A4246,#1A1F21)]" />

      <div
        className="relative"
        style={{
          padding: bezel,
          borderRadius: radius,
          background: 'linear-gradient(150deg, #4A5458 0%, #252C2F 28%, #15191B 68%, #0E1112 100%)',
          boxShadow: [
            'inset 0 0 0 1px rgba(255,255,255,0.14)',
            'inset 0 1.5px 1px rgba(255,255,255,0.22)',
            '0 0 0 1px rgba(8,12,14,0.9)',
            '0 2px 4px rgba(23,38,42,0.12)',
            '0 30px 60px -18px rgba(23,38,42,0.5)',
            '0 18px 36px -22px rgba(23,38,42,0.45)',
          ].join(', '),
        }}
      >
        <div className="relative overflow-hidden" style={{ borderRadius: radius - bezel, background: meta.top, boxShadow: '0 0 0 1px rgba(0,0,0,0.55)' }}>
          {/* status bar */}
          <div
            aria-hidden
            className="relative flex items-center justify-between font-bold"
            style={{ height: bar, padding: `0 ${Math.round(inner * 0.085)}px`, color: meta.light ? '#17262A' : '#FFFFFF', fontSize: text }}
          >
            <span className="leading-none tracking-[0.02em]">10:24</span>
            <StatusIcons height={text} />
            <span
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: camera,
                height: camera,
                background: 'radial-gradient(circle at 35% 35%, #55687A 0%, #1C252C 32%, #050708 70%)',
                boxShadow: '0 0 0 1.5px rgba(0,0,0,0.3)',
              }}
            />
          </div>

          <picture>
            <source type="image/webp" srcSet={`${base}screenshots/${file}.webp`} />
            <img
              src={`${base}screenshots/${file}.png`}
              alt={alt}
              width={780}
              height={1688}
              loading={eager || priority ? 'eager' : 'lazy'}
              decoding="async"
              {...(priority ? { fetchPriority: 'high' as const } : {})}
              className="block h-auto w-full"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}

/** Signal, wifi and battery, drawn small and simple. */
function StatusIcons({ height }: { height: number }) {
  return (
    <svg width={height * 4.4} height={height} viewBox="0 0 44 10" fill="currentColor">
      <rect x="0" y="7" width="2" height="3" rx="0.6" />
      <rect x="3" y="5" width="2" height="5" rx="0.6" />
      <rect x="6" y="3" width="2" height="7" rx="0.6" />
      <rect x="9" y="1" width="2" height="9" rx="0.6" />
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14.2 3.6 A8.2 8.2 0 0 1 25.8 3.6" />
        <path d="M16.3 5.9 A5.2 5.2 0 0 1 23.7 5.9" />
      </g>
      <circle cx="20" cy="8.5" r="1.3" />
      <rect x="29.5" y="1.5" width="12" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <rect x="31" y="3" width="8" height="4" rx="1" />
      <rect x="42.3" y="3.7" width="1.4" height="2.6" rx="0.6" opacity="0.55" />
    </svg>
  );
}
