import { CloudCheck, CloudUpload, Info, Trash2 } from 'lucide-react';
import type { PhoneFile } from '../data/files';
import * as cloud from '../services/cloud';
import { countText } from '../lib/format';
import { PrimaryButton, SecondaryButton, TextButton } from './ui';
import { Sheet } from './Sheet';

interface Props {
  files: PhoneFile[];
  onClose: () => void;
  /** Saved files only: remove them from the phone. */
  onRemove: () => void;
  onSaveFirst: () => void;
  onDeleteAnyway: () => void;
}

export function DeleteSheet({ files, onClose, onRemove, onSaveFirst, onDeleteAnyway }: Props) {
  const unsaved = files.filter((f) => cloud.getStatus(f.id) === 'phone-only');
  const safe = files.length - unsaved.length;
  const one = files.length === 1;

  if (unsaved.length === 0) {
    return (
      <Sheet labelledBy="delete-title" onClose={onClose}>
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-soft text-green">
            <CloudCheck size={30} strokeWidth={2.2} aria-hidden />
          </span>
          <h2 id="delete-title" className="text-[28px] leading-tight font-bold">
            Remove from phone?
          </h2>
        </div>
        <p className="mt-4 text-[20px] leading-relaxed text-ink">
          {one ? 'It stays' : `These ${countText(files)} stay`} safe in your cloud. You can bring {one ? 'it' : 'them'} back anytime.
        </p>
        <PrimaryButton className="mt-6" onClick={onRemove}>
          Remove from phone
        </PrimaryButton>
        <TextButton className="mt-2" onClick={onClose}>
          Cancel
        </TextButton>
      </Sheet>
    );
  }

  const noun = countText(unsaved).replace(/^\d+ /, '');
  let message: string;
  if (one) {
    message = `This ${noun} is only on your phone. If you delete it, it may be gone.`;
  } else if (safe === 0) {
    message = `${unsaved.length} of these are only on your phone. If you delete them, they may be gone.`;
  } else {
    message = `${safe} ${safe === 1 ? 'is' : 'are'} safe in your cloud. ${unsaved.length} of these ${unsaved.length === 1 ? 'is' : 'are'} only on your phone. If you delete ${unsaved.length === 1 ? 'it' : 'them'}, ${unsaved.length === 1 ? 'it' : 'they'} may be gone.`;
  }

  return (
    <Sheet labelledBy="delete-title" onClose={onClose}>
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-soft text-orange-ink">
          <Info size={30} strokeWidth={2.2} aria-hidden />
        </span>
        <h2 id="delete-title" className="text-[28px] leading-tight font-bold">
          Not saved yet
        </h2>
      </div>
      <p className="mt-4 text-[20px] leading-relaxed text-ink">{message}</p>
      <p className="mt-2 text-[18px] text-ink-2">Save {one ? 'it' : 'them'} to your cloud first, then {one ? 'it is' : 'they are'} removed from your phone.</p>

      <PrimaryButton className="mt-6" icon={CloudUpload} onClick={onSaveFirst}>
        Save to cloud first
      </PrimaryButton>
      <SecondaryButton className="mt-3 !min-h-[52px] !text-[18px]" tone="red" icon={Trash2} onClick={onDeleteAnyway}>
        Delete anyway
      </SecondaryButton>
      <TextButton className="mt-2" onClick={onClose}>
        Cancel
      </TextButton>
    </Sheet>
  );
}
