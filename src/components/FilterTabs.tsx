export type Filter = 'all' | 'saved' | 'phone';

const TABS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'saved', label: 'Saved in cloud' },
  { id: 'phone', label: 'Only on phone' },
];

export function FilterTabs({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div role="tablist" aria-label="Show" className="flex gap-1 rounded-[18px] bg-card-2 p-1">
      {TABS.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={`min-h-[48px] rounded-[14px] px-2.5 text-[16px] leading-tight font-bold transition-colors ${
              t.id === 'all' ? 'w-[58px] shrink-0' : 'flex-1'
            } ${active ? 'bg-card text-blue shadow-[0_1px_3px_rgba(23,38,42,0.18)]' : 'text-ink-2 hover:text-ink'}`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
