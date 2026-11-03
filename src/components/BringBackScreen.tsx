import { CircleCheck, RotateCcw } from 'lucide-react';
import * as cloud from '../services/cloud';
import { usePhone } from '../lib/usePhone';
import { useActions } from '../lib/actions';
import { formatDate, formatSize } from '../lib/format';
import { BackButton, FileThumb, PrimaryButton } from './ui';

/** Files that are only in the cloud (removed from the phone), newest removed first. */
export function BringBackScreen({ onBack }: { onBack: () => void }) {
  const { removedFiles } = usePhone();
  const { bringBack } = useActions();

  return (
    <div className="flex min-h-full flex-col px-5 pt-[max(16px,env(safe-area-inset-top))] pb-28">
      <BackButton onClick={onBack} />
      <h1 className="mt-2 text-[30px] leading-tight font-bold">Bring back removed files</h1>

      {removedFiles.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-[22px] bg-card px-6 py-10 text-center shadow-[var(--shadow-card)]">
          <CircleCheck size={56} strokeWidth={2} className="text-green" aria-hidden />
          <p className="mt-4 text-[22px] font-bold">Nothing to bring back</p>
          <p className="mt-2 text-[18px] text-ink-2">Everything you have is on your phone.</p>
        </div>
      ) : (
        <>
          <p className="mt-2 text-[18px] text-ink-2">
            These are safe in your cloud. Bring them back to your phone anytime.
          </p>
          <PrimaryButton className="mt-5" icon={RotateCcw} onClick={() => bringBack(removedFiles.map((f) => f.id))}>
            Bring back all ({removedFiles.length})
          </PrimaryButton>
          <ul className="mt-6 flex flex-col gap-3">
            {removedFiles.map((f) => (
              <li key={f.id} className="rounded-[22px] bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3">
                  <FileThumb file={f} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[17px] font-bold" title={f.name}>
                      {f.name}
                    </p>
                    <p className="text-[16px] text-ink-2">
                      {formatDate(f.date)} · {formatSize(f.sizeMB)}
                    </p>
                    <p className="text-[16px] text-ink-2">Removed {formatDate(cloud.getRemovedAt(f.id) ?? Date.now())}</p>
                  </div>
                </div>
                <button
                  onClick={() => bringBack([f.id])}
                  className="mt-3 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[16px] border-2 border-blue text-[18px] font-bold text-blue hover:bg-blue-soft"
                >
                  <RotateCcw size={20} strokeWidth={2.4} aria-hidden />
                  Bring back to phone
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
