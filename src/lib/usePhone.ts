import { useMemo, useSyncExternalStore } from 'react';
import { FILES, PHONE_START_USED_MB, PHONE_TOTAL_MB, type FileType, type PhoneFile } from '../data/files';
import * as cloud from '../services/cloud';
import type { FileStatus } from '../services/cloud';
import { sumMB } from './format';

export interface CategoryStats {
  /** Files on the phone */
  files: PhoneFile[];
  saved: number;
  phoneOnly: number;
  sizeMB: number;
}

/** Live view of the phone and cloud. Re-renders whenever anything changes. */
export function usePhone() {
  const version = useSyncExternalStore(cloud.subscribe, cloud.getVersion);

  return useMemo(() => {
    const status = new Map<string, FileStatus>(FILES.map((f) => [f.id, cloud.getStatus(f.id)]));
    const onPhone = (f: PhoneFile) => {
      const s = status.get(f.id);
      return s === 'phone-only' || s === 'phone-and-cloud';
    };

    const byType = (type: FileType): CategoryStats => {
      const files = FILES.filter((f) => f.type === type && onPhone(f));
      const saved = files.filter((f) => status.get(f.id) === 'phone-and-cloud').length;
      return { files, saved, phoneOnly: files.length - saved, sizeMB: sumMB(files) };
    };

    const removedMB = sumMB(FILES.filter((f) => !onPhone(f)));
    const usedMB = PHONE_START_USED_MB - removedMB;

    const media = FILES.filter((f) => f.type !== 'document');
    const mediaInCloud = media.filter((f) => {
      const s = status.get(f.id);
      return s === 'phone-and-cloud' || s === 'cloud-only';
    });
    // Saved in cloud and still taking up space on the phone.
    const removableMB = sumMB(media.filter((f) => status.get(f.id) === 'phone-and-cloud'));

    const removedFiles = FILES.filter((f) => status.get(f.id) === 'cloud-only').sort(
      (a, b) => (cloud.getRemovedAt(b.id) ?? 0) - (cloud.getRemovedAt(a.id) ?? 0)
    );

    return {
      version,
      statusOf: (id: string) => status.get(id) ?? 'deleted',
      categories: {
        photo: byType('photo'),
        video: byType('video'),
        document: byType('document'),
      } as Record<FileType, CategoryStats>,
      usedMB,
      totalMB: PHONE_TOTAL_MB,
      mediaInCloud: mediaInCloud.length,
      removableMB,
      removedFiles,
    };
  }, [version]);
}
