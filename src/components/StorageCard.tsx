import { CircleCheck, Smartphone } from 'lucide-react';
import { trim } from '../lib/format';

/** "Almost full" only while less than 5 GB is free. */
const ALMOST_FULL_FREE_MB = 5_000;
export const isAlmostFull = (usedMB: number, totalMB: number) => totalMB - usedMB < ALMOST_FULL_FREE_MB;

/** "Phone space" with the bar and "61 GB of 64 GB used". */
export function StorageCard({ usedMB, totalMB }: { usedMB: number; totalMB: number }) {
  const ratio = usedMB / totalMB;
  const full = isAlmostFull(usedMB, totalMB);
  return (
    <section className="rounded-[22px] bg-card p-[22px] shadow-[var(--shadow-card)]" aria-label="Phone space">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-[19px] text-ink-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-card-2 text-ink-2" aria-hidden>
            <Smartphone size={18} strokeWidth={2.3} />
          </span>
          Phone space
        </h2>
        {full ? (
          <span className="rounded-full bg-orange-soft px-3.5 py-1.5 text-[16px] leading-tight font-bold text-orange-ink">Almost full</span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-soft px-3.5 py-1.5 text-[16px] leading-tight font-bold text-green">
            <CircleCheck size={17} strokeWidth={2.6} aria-hidden />
            Space OK
          </span>
        )}
      </div>
      <div
        className="mt-4 h-[14px] overflow-hidden rounded-full bg-track"
        role="meter"
        aria-label="Phone space used"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${
            full ? 'bg-[linear-gradient(90deg,#EDA65E,var(--color-orange))]' : 'bg-[linear-gradient(90deg,#63BB8B,var(--color-green-fill))]'
          }`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <p className="mt-4 text-[22px] leading-tight font-bold text-ink">
        {trim(usedMB / 1000)} GB of {trim(totalMB / 1000)} GB used
      </p>
    </section>
  );
}
