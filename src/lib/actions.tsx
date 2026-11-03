// Upload / delete / bring back flows, shared by every screen.
// Renders the sheets and the toast on top of whatever screen is showing.
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { FILES_BY_ID, type PhoneFile } from '../data/files';
import * as cloud from '../services/cloud';
import { UploadSheet, type UploadChoice } from '../components/UploadSheet';
import { DeleteSheet } from '../components/DeleteSheet';
import { UndoToast, type ToastData } from '../components/UndoToast';
import { countText, freedText, sumMB } from './format';

type Done = () => void;

interface Actions {
  requestUpload: (ids: string[], onDone?: Done) => void;
  requestDelete: (ids: string[], onDone?: Done) => void;
  bringBack: (ids: string[]) => void;
}

const ActionsContext = createContext<Actions | null>(null);

export function useActions() {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error('useActions must be used inside ActionsProvider');
  return ctx;
}

type SheetState =
  | { kind: 'upload'; files: PhoneFile[]; autoChoice?: UploadChoice; onDone?: Done }
  | { kind: 'delete'; files: PhoneFile[]; onDone?: Done }
  | null;

export function ActionsProvider({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<SheetState>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  // Shown once the success sheet is closed.
  const pendingToast = useRef<Omit<ToastData, 'key'> | null>(null);
  const keys = useRef(0);

  const showToast = useCallback((t: Omit<ToastData, 'key'>) => setToast({ ...t, key: ++keys.current }), []);

  const toFiles = (ids: string[]) => ids.map((id) => FILES_BY_ID.get(id)).filter((f): f is PhoneFile => !!f);

  const removedToast = (files: PhoneFile[], undo: cloud.Snapshot, verb = 'removed') => ({
    title: `${countText(files)} ${verb}`,
    detail: freedText(sumMB(files)),
    onUndo: () => cloud.restoreSnapshot(undo),
  });

  const actions = useMemo<Actions>(
    () => ({
      requestUpload: (ids, onDone) => setSheet({ kind: 'upload', files: toFiles(ids), onDone }),
      requestDelete: (ids, onDone) => setSheet({ kind: 'delete', files: toFiles(ids), onDone }),
      bringBack: (ids) => {
        const files = toFiles(ids);
        cloud.restoreToPhone(ids);
        showToast({ title: `${countText(files)} ${files.length === 1 ? 'is' : 'are'} back on your phone` });
      },
    }),
    [showToast]
  );

  const closeSheet = () => {
    setSheet(null);
    if (pendingToast.current) {
      showToast(pendingToast.current);
      pendingToast.current = null;
    }
  };

  return (
    <ActionsContext.Provider value={actions}>
      {children}

      {toast && <UndoToast toast={toast} onDismiss={() => setToast((t) => (t?.key === toast.key ? null : t))} />}

      {sheet?.kind === 'upload' && (
        <UploadSheet
          key={sheet.files.map((f) => f.id).join()}
          files={sheet.files}
          autoChoice={sheet.autoChoice}
          onClose={closeSheet}
          onFinished={({ removed, undo }) => {
            if (removed && undo) pendingToast.current = removedToast(sheet.files, undo, 'removed from phone');
            sheet.onDone?.();
          }}
        />
      )}

      {sheet?.kind === 'delete' && (
        <DeleteSheet
          files={sheet.files}
          onClose={() => setSheet(null)}
          onRemove={() => {
            const ids = sheet.files.map((f) => f.id);
            const undo = cloud.snapshot(ids);
            cloud.removeFromPhone(ids);
            setSheet(null);
            sheet.onDone?.();
            showToast(removedToast(sheet.files, undo, 'removed from phone'));
          }}
          onSaveFirst={() => setSheet({ kind: 'upload', files: sheet.files, autoChoice: 'remove', onDone: sheet.onDone })}
          onDeleteAnyway={() => {
            const ids = sheet.files.map((f) => f.id);
            const undo = cloud.snapshot(ids);
            const unsaved = ids.filter((id) => cloud.getStatus(id) === 'phone-only');
            cloud.removeFromPhone(ids.filter((id) => !unsaved.includes(id)));
            cloud.deletePermanently(unsaved);
            setSheet(null);
            sheet.onDone?.();
            showToast(removedToast(sheet.files, undo, unsaved.length === ids.length ? 'deleted' : 'removed'));
          }}
        />
      )}
    </ActionsContext.Provider>
  );
}
