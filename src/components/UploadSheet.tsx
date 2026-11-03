import { useEffect, useRef, useState } from 'react';
import { CircleCheck, CloudUpload, Smartphone } from 'lucide-react';
import type { PhoneFile } from '../data/files';
import * as cloud from '../services/cloud';
import { countText, formatSize, freedText, sumMB } from '../lib/format';
import { PrimaryButton, ProgressBar, TextButton } from './ui';
import { Sheet } from './Sheet';

export type UploadChoice = 'keep' | 'remove';

interface Props {
  files: PhoneFile[];
  /** Skip the question and go straight to saving (used by "Save to cloud first"). */
  autoChoice?: UploadChoice;
  onClose: () => void;
  /** Called when saving has finished. `undo` is set if files were also removed from the phone. */
  onFinished: (result: { removed: boolean; undo?: cloud.Snapshot }) => void;
}

export function UploadSheet({ files, autoChoice, onClose, onFinished }: Props) {
  const [phase, setPhase] = useState<'choose' | 'saving' | 'done'>(autoChoice ? 'saving' : 'choose');
  const [choice, setChoice] = useState<UploadChoice>(autoChoice ?? 'keep');
  const [progress, setProgress] = useState(0);
  const [toSave] = useState(() => files.filter((f) => cloud.getStatus(f.id) === 'phone-only'));
  const what = countText(files);
  const sizeMB = sumMB(files);

  const start = async (c: UploadChoice) => {
    setChoice(c);
    setPhase('saving');
    await cloud.upload(
      toSave.map((f) => f.id),
      setProgress
    );
    let undo: cloud.Snapshot | undefined;
    if (c === 'remove') {
      const ids = files.map((f) => f.id);
      undo = cloud.snapshot(ids);
      cloud.removeFromPhone(ids);
    }
    setPhase('done');
    onFinished({ removed: c === 'remove', undo });
  };

  const started = useRef(false);
  useEffect(() => {
    if (autoChoice && !started.current) {
      started.current = true;
      start(autoChoice);
    }
  }, []);

  return (
    <Sheet labelledBy="upload-title" onClose={phase === 'saving' ? undefined : onClose}>
      {phase === 'choose' && (
        <>
          <h2 id="upload-title" className="text-[28px] leading-tight font-bold">
            Save to cloud
          </h2>
          <p className="mt-1 text-[18px] text-ink-2">
            {what} · {formatSize(sizeMB)}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <button
              onClick={() => start('keep')}
              className="flex min-h-[88px] w-full items-center gap-4 rounded-[20px] border-2 border-blue bg-card p-4 text-left hover:bg-blue-soft"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-soft text-blue">
                <Smartphone size={26} strokeWidth={2.2} aria-hidden />
              </span>
              <span className="text-[20px] leading-snug font-bold text-ink">Save to cloud and keep on phone</span>
            </button>

            <button
              onClick={() => start('remove')}
              className="flex min-h-[88px] w-full items-center gap-4 glow-primary rounded-[20px] border-2 border-primary bg-primary p-4 text-left text-white hover:bg-primary-hover"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <CloudUpload size={26} strokeWidth={2.2} aria-hidden />
              </span>
              <span>
                <span className="block text-[20px] leading-snug font-bold">Save to cloud and remove from phone</span>
                <span className="mt-1 block text-[17px] leading-snug text-white">
                  Frees up {formatSize(sizeMB)}. You can bring {files.length === 1 ? 'it' : 'them'} back anytime.
                </span>
              </span>
            </button>
          </div>

          <TextButton className="mt-3" onClick={onClose}>
            Cancel
          </TextButton>
        </>
      )}

      {phase === 'saving' && (
        <div className="pb-6" aria-live="polite">
          <div className="mb-5 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-soft text-blue">
              <CloudUpload size={30} strokeWidth={2.2} aria-hidden />
            </span>
            <h2 id="upload-title" className="text-[26px] leading-tight font-bold">
              Saving {countText(toSave.length ? toSave : files)}…
            </h2>
          </div>
          <ProgressBar value={progress} tone="blue" label="Saving to cloud" height={16} />
          <p className="mt-4 text-[18px] text-ink-2">
            {choice === 'remove' ? 'Nothing is removed until everything is safely saved.' : 'Everything stays on your phone too.'}
          </p>
        </div>
      )}

      {phase === 'done' && (
        <div className="flex flex-col items-center pb-2 text-center" aria-live="polite">
          <CircleCheck size={64} strokeWidth={2} className="text-green" aria-hidden />
          <h2 id="upload-title" className="mt-3 text-[28px] leading-tight font-bold">
            Done!
          </h2>
          <p className="mt-2 text-[20px] text-ink">
            {what} {files.length === 1 ? 'is' : 'are'} now safe in your cloud.
          </p>
          {choice === 'remove' && <p className="mt-3 rounded-2xl bg-green-soft px-4 py-3 text-[18px] font-bold text-green">{freedText(sizeMB)}</p>}
          <PrimaryButton className="mt-6" onClick={onClose} autoFocus>
            OK
          </PrimaryButton>
        </div>
      )}
    </Sheet>
  );
}
