import { useMemo, useState } from 'react';
import { CircleCheck } from 'lucide-react';
import type { FileType } from '../data/files';
import { FileRow, SelectCircle } from '../components/FileRow';
import { FilterTabs, type Filter } from '../components/FilterTabs';
import { PreviewScreen } from '../components/PreviewScreen';
import { SelectionBar } from '../components/SelectionBar';
import { YearGroup } from '../components/YearGroup';
import { BackButton } from '../components/ui';
import { useActions } from '../lib/actions';
import { FILES_BY_ID } from '../data/files';
import { formatNumber, sumMB } from '../lib/format';
import { usePhone } from '../lib/usePhone';

const EMPTY: Record<Filter, string> = {
  all: 'Nothing here on your phone.',
  saved: 'None of these are saved in your cloud yet.',
  phone: 'Everything here is saved in your cloud.',
};

export function CategoryScreen({ type, title, onBack }: { type: FileType; title: string; onBack: () => void }) {
  const phone = usePhone();
  const { requestUpload, requestDelete } = useActions();
  const stats = phone.categories[type];
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previewId, setPreviewId] = useState<string | null>(null);

  const isSaved = (id: string) => phone.statusOf(id) === 'phone-and-cloud';

  const visible = useMemo(
    () =>
      stats.files
        .filter((f) => filter === 'all' || (filter === 'saved') === isSaved(f.id))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [stats, filter]
  );

  const years = useMemo(() => {
    const groups = new Map<string, typeof visible>();
    visible.forEach((f) => {
      const y = f.date.slice(0, 4);
      groups.set(y, [...(groups.get(y) ?? []), f]);
    });
    return [...groups];
  }, [visible]);

  // Only keep selections that are still on the phone.
  const selectedFiles = stats.files.filter((f) => selected.has(f.id));
  const allSelected = visible.length > 0 && visible.every((f) => selected.has(f.id));

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const clear = () => setSelected(new Set());

  const afterAction = (ids: string[]) => () => {
    setSelected((s) => new Set([...s].filter((id) => !ids.includes(id))));
  };

  const preview = previewId ? FILES_BY_ID.get(previewId) : undefined;
  const previewStatus = previewId ? phone.statusOf(previewId) : 'deleted';

  return (
    <div className="relative flex min-h-full flex-col">
      <div className="sticky top-0 z-10 bg-bg/95 px-4 pt-[max(8px,env(safe-area-inset-top))] pb-1 backdrop-blur">
        <BackButton onClick={onBack} />
      </div>
      <header className="px-4 pb-3">
        <h1 className="mt-1 px-1 text-[30px] leading-tight font-bold">{title}</h1>
        <p className="mt-1 px-1 text-[18px] text-ink-2">
          {formatNumber(stats.saved)} saved in cloud · {formatNumber(stats.phoneOnly)} only on this phone
        </p>
        <div className="mt-3">
          <FilterTabs
            value={filter}
            onChange={(f) => {
              setFilter(f);
              clear();
            }}
          />
        </div>
      </header>

      <div className="flex-1 px-3 pb-56">
        {visible.length === 0 ? (
          <div className="mx-1 mt-6 flex flex-col items-center rounded-[22px] bg-card px-6 py-10 text-center shadow-[var(--shadow-card)]">
            <CircleCheck size={48} strokeWidth={2} className="text-green" aria-hidden />
            <p className="mt-3 text-[20px] font-bold">{EMPTY[filter]}</p>
          </div>
        ) : (
          <>
            {/* the words are part of the button, so tapping "Select all" works, not only the circle */}
            <div className="py-1">
              <SelectCircle
                selected={allSelected}
                onToggle={() => setSelected(allSelected ? new Set() : new Set(visible.map((f) => f.id)))}
                className="min-h-12 w-full gap-1 rounded-[18px] pr-4 text-left transition-colors hover:bg-ink/5"
              >
                <span className="text-[18px] font-bold text-ink">Select all ({visible.length})</span>
              </SelectCircle>
            </div>

            {years.map(([year, files]) => (
              <YearGroup key={year} year={year} count={files.length}>
                {files.map((f) => (
                  <FileRow
                    key={f.id}
                    file={f}
                    saved={isSaved(f.id)}
                    selected={selected.has(f.id)}
                    onToggle={() => toggle(f.id)}
                    onOpen={() => setPreviewId(f.id)}
                    onUpload={() => requestUpload([f.id], afterAction([f.id]))}
                    onDelete={() => requestDelete([f.id], afterAction([f.id]))}
                  />
                ))}
              </YearGroup>
            ))}
          </>
        )}
      </div>

      {selectedFiles.length > 0 && (
          <SelectionBar
            count={selectedFiles.length}
            sizeMB={sumMB(selectedFiles)}
            canUpload={selectedFiles.some((f) => !isSaved(f.id))}
            onUpload={() => requestUpload(selectedFiles.map((f) => f.id), clear)}
            onDelete={() => requestDelete(selectedFiles.map((f) => f.id), clear)}
            onCancel={clear}
          />
      )}

      {preview && (previewStatus === 'phone-only' || previewStatus === 'phone-and-cloud') && (
        <PreviewScreen
          file={preview}
          status={previewStatus}
          onClose={() => setPreviewId(null)}
          onUpload={() => requestUpload([preview.id], afterAction([preview.id]))}
          onDelete={() => requestDelete([preview.id], afterAction([preview.id]))}
        />
      )}
    </div>
  );
}
