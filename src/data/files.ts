import raw from './phoneFiles.json';

export type FileType = 'photo' | 'video' | 'document';

export interface PhoneFile {
  id: string;
  name: string;
  type: FileType;
  /** Full-size image (photos) or thumbnail image (videos). Documents have none. */
  path: string | null;
  thumb: string | null;
  /** ISO date the file was made */
  date: string;
  /** Size shown in the app, in MB */
  sizeMB: number;
  initialCloud: boolean;
}

// The manifest stores paths like "/phone/IMG_….jpg". Prefix them with the site's base path, so the
// app also works when it is served from a sub-folder (e.g. /app/ next to the landing page).
const base = import.meta.env.BASE_URL;
const withBase = (p: string | null) => (p ? base + p.replace(/^\//, '') : null);

export const FILES = (raw as PhoneFile[]).map((f) => ({ ...f, path: withBase(f.path), thumb: withBase(f.thumb) }));
export const FILES_BY_ID = new Map(FILES.map((f) => [f.id, f]));

export const CATEGORIES: { type: FileType; slug: string; title: string }[] = [
  { type: 'photo', slug: 'photos', title: 'Photos' },
  { type: 'video', slug: 'videos', title: 'Videos' },
  { type: 'document', slug: 'documents', title: 'Documents' },
];

/** Simulated phone: 64 GB total, 61 GB used at the start. */
export const PHONE_TOTAL_MB = 64_000;
export const PHONE_START_USED_MB = 61_000;
