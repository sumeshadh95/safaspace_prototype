import { useEffect, useMemo, useState } from 'react';
import { Cloud, CloudUpload, Smartphone } from 'lucide-react';
import { FILES_BY_ID, type FileType, type PhoneFile } from '../data/files';
import * as cloud from '../services/cloud';
import { usePhone } from '../lib/usePhone';
import { countText, formatDate, formatNumber, formatSize, sumMB } from '../lib/format';
import { FileThumb, PlayBadge, ProgressBar } from '../components/ui';

const NEW_MS = 10 * 60 * 1000;

type Show = 'all' | FileType;

/**
 * Robert's cloud, seen from a laptop. Open it in a second tab (#/cloud) next to
 * the app: uploads appear here live, with the progress bar while they save.
 */
export function CloudScreen() {
  const phone = usePhone();
  const [show, setShow] = useState<Show>('all');
  const [now, setNow] = useState(Date.now());

  // Keep "Just now" / "New" labels fresh.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, []);

  const entries = useMemo(
    () =>
      cloud
        .getCloudContents()
        .map((e) => ({ ...e, file: FILES_BY_ID.get(e.id) }))
        .filter((e): e is { id: string; uploadedAt: number; file: PhoneFile } => !!e.file)
        .sort((a, b) => b.uploadedAt - a.uploadedAt),
    [phone.version]
  );

  const uploading = cloud.getUploading();
  const incoming = uploading ? uploading.ids.map((id) => FILES_BY_ID.get(id)).filter((f): f is PhoneFile => !!f) : [];
  const visible = entries.filter((e) => show === 'all' || e.file.type === show);
  const recent = entries.filter((e) => now - e.uploadedAt < NEW_MS).length;
  const count = (t: FileType) => entries.filter((e) => e.file.type === t).length;

  useEffect(() => {
    document.title = 'Robert’s cloud · SafeSpace';
  }, []);

  return (
    <div className="scroll-area h-full overflow-y-auto bg-bg">
      <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white" aria-hidden>
              <Cloud size={30} strokeWidth={2.2} />
            </span>
            <div>
              <h1 className="text-[30px] leading-tight font-bold">Robert’s cloud</h1>
              <p className="text-[18px] text-ink-2">Everything here is saved safely, even if it is removed from the phone.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
          <a href="#/" className="flex min-h-[44px] items-center rounded-full px-4 text-[16px] font-bold text-blue hover:bg-blue-soft">
            Open the app
          </a>
          <div className="flex items-center gap-2 rounded-full bg-green-soft px-4 py-2 text-[16px] font-bold text-green">
            <span className="relative flex h-3 w-3" aria-hidden>
              <span className="pulse-ring absolute inset-0 rounded-full bg-green-fill" />
              <span className="relative h-3 w-3 rounded-full bg-green-fill" />
            </span>
            Live
          </div>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Summary">
          <Stat label="Files in cloud" value={formatNumber(entries.length)} sub={formatSize(sumMB(entries.map((e) => e.file)))} />
          <Stat label="Photos" value={formatNumber(count('photo'))} />
          <Stat label="Videos" value={formatNumber(count('video'))} />
          <Stat label="Documents" value={formatNumber(count('document'))} />
        </section>

        {incoming.length > 0 && uploading && (
          <section className="rise-in mt-6 rounded-[22px] border-2 border-blue bg-card p-5 shadow-[var(--shadow-card)]" aria-live="polite">
            <div className="flex items-center gap-3">
              <CloudUpload size={28} strokeWidth={2.2} className="text-blue" aria-hidden />
              <h2 className="text-[22px] font-bold">
                Arriving now: {countText(incoming)} · {Math.round(uploading.progress * 100)}%
              </h2>
            </div>
            <div className="mt-3">
              <ProgressBar value={uploading.progress} tone="blue" label="Arriving in cloud" height={14} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {incoming.slice(0, 12).map((f) => (
                <FileThumb key={f.id} file={f} size={64} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[22px] font-bold">
            Newest first
            {recent > 0 && <span className="ml-2 rounded-full bg-blue-soft px-3 py-1 text-[15px] text-blue">{recent} just arrived</span>}
          </h2>
          <div role="tablist" aria-label="Show" className="flex gap-1 rounded-[16px] bg-card-2 p-1">
            {(['all', 'photo', 'video', 'document'] as Show[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={show === t}
                onClick={() => setShow(t)}
                className={`min-h-[44px] rounded-[12px] px-4 text-[16px] font-bold ${show === t ? 'bg-card text-blue shadow-sm' : 'text-ink-2'}`}
              >
                {t === 'all' ? 'All' : t === 'photo' ? 'Photos' : t === 'video' ? 'Videos' : 'Documents'}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visible.map(({ id, uploadedAt, file }) => {
            const isNew = now - uploadedAt < NEW_MS;
            const onPhone = phone.statusOf(id) === 'phone-and-cloud';
            return (
              <li
                key={id}
                className={`rise-in overflow-hidden rounded-[18px] bg-card shadow-[var(--shadow-card)] ${isNew ? 'ring-3 ring-blue' : ''}`}
              >
                <div className="relative">
                  {file.path ? (
                    <div className="relative aspect-square w-full bg-track">
                      <img src={file.path} alt="" loading="lazy" className="h-full w-full object-cover" />
                      {file.type === 'video' && <PlayBadge size={52} />}
                    </div>
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center bg-orange-soft">
                      <FileThumb file={file} size={88} radius={20} />
                    </div>
                  )}
                  {isNew && (
                    <span className="absolute top-2 left-2 rounded-full bg-primary px-2.5 py-1 text-[13px] font-bold text-white">New</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-[15px] font-bold" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[14px] text-ink-2">
                    Saved {isNew ? 'just now' : formatDate(uploadedAt)} · {formatSize(file.sizeMB)}
                  </p>
                  <p className={`mt-1 inline-flex items-center gap-1 text-[13px] font-bold ${onPhone ? 'text-ink-2' : 'text-green'}`}>
                    <Smartphone size={14} strokeWidth={2.4} aria-hidden />
                    {onPhone ? 'Also on phone' : 'Removed from phone'}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {visible.length === 0 && (
          <p className="mt-6 text-[18px] text-ink-2">Nothing here yet.</p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[18px] bg-card p-4 shadow-[var(--shadow-card)]">
      <p className="text-[15px] text-ink-2">{label}</p>
      <p className="text-[30px] leading-tight font-bold">{value}</p>
      {sub && <p className="text-[15px] text-ink-2">{sub}</p>}
    </div>
  );
}
