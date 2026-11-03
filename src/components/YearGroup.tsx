import type { ReactNode } from 'react';

export function YearGroup({ year, count, children }: { year: string; count: number; children: ReactNode }) {
  return (
    <section aria-labelledby={`year-${year}`} className="mt-7 first:mt-2">
      <h2 id={`year-${year}`} className="mb-3 flex items-baseline gap-3 px-1">
        <span className="text-[30px] leading-none font-bold text-ink">{year}</span>
        <span className="text-[17px] text-ink-2">{count} {count === 1 ? 'file' : 'files'}</span>
        <span className="h-px flex-1 self-center bg-line" aria-hidden />
      </h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </section>
  );
}
