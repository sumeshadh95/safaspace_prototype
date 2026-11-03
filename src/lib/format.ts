import type { FileType, PhoneFile } from '../data/files';

const AVERAGE_PHOTO_MB = 3.5;

/** "3.4 MB", "420 MB", "5.6 GB" */
export function formatSize(mb: number) {
  if (mb >= 1000) return `${trim(mb / 1000)} GB`;
  if (mb >= 100) return `${Math.round(mb)} MB`;
  return `${trim(mb)} MB`;
}

/** 61 -> "61", 59.62 -> "59.6" */
export function trim(n: number) {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

export function formatNumber(n: number) {
  return n.toLocaleString('en-US');
}

/** "12 June 2019" */
export function formatDate(iso: string | number) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Freed MB ÷ 3.5, rounded to the nearest 100 (smaller amounts are rounded less). */
export function roomForPhotos(mb: number) {
  const photos = mb / AVERAGE_PHOTO_MB;
  if (photos >= 100) return Math.round(photos / 100) * 100;
  if (photos >= 10) return Math.round(photos / 10) * 10;
  return Math.max(0, Math.round(photos));
}

/** "about 1,000 new photos" */
export function roomText(mb: number) {
  const n = roomForPhotos(mb);
  if (n < 1) return 'a little more room';
  return `room for about ${formatNumber(n)} new ${n === 1 ? 'photo' : 'photos'}`;
}

export function freedText(mb: number) {
  return `You freed ${formatSize(mb)} — ${roomText(mb)}`;
}

const NOUNS: Record<FileType, [string, string]> = {
  photo: ['photo', 'photos'],
  video: ['video', 'videos'],
  document: ['document', 'documents'],
};

/** "3 photos", "1 video", "4 files" (mixed types) */
export function countText(files: PhoneFile[]) {
  const types = new Set(files.map((f) => f.type));
  const [one, many] = types.size === 1 ? NOUNS[files[0].type] : ['file', 'files'];
  return `${files.length} ${files.length === 1 ? one : many}`;
}

export function plural(n: number, type: FileType) {
  const [one, many] = NOUNS[type];
  return `${formatNumber(n)} ${n === 1 ? one : many}`;
}

export function sumMB(files: PhoneFile[]) {
  return files.reduce((s, f) => s + f.sizeMB, 0);
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
