// Pretends to be a cloud server. The "cloud" lives in the browser's localStorage,
// so everything survives a page refresh during the demo.
//   safespace.cloud  -> files saved in the cloud   [{ id, uploadedAt }]
//   safespace.phone  -> files removed from phone   [{ id, removedAt }]
//   safespace.uploading -> upload in progress      { ids, progress } (only while saving)
// Only ids and timestamps are stored, never image data.
// Other tabs (the Cloud view at #/cloud) follow every change live.
import { FILES } from '../data/files';

export const CLOUD_KEY = 'safespace.cloud';
export const PHONE_KEY = 'safespace.phone';
export const UPLOADING_KEY = 'safespace.uploading';

export type FileStatus = 'phone-only' | 'phone-and-cloud' | 'cloud-only' | 'deleted';

export interface CloudEntry {
  id: string;
  uploadedAt: number;
}
export interface RemovedEntry {
  id: string;
  removedAt: number;
}

export interface Uploading {
  ids: string[];
  progress: number;
}

/** Before/after picture of some files, used for Undo. */
export interface Snapshot {
  cloud: [string, number | undefined][];
  removed: [string, number | undefined][];
}

let cloud = new Map<string, number>();
let removed = new Map<string, number>();
let uploading: Uploading | null = null;
let version = 0;
const listeners = new Set<() => void>();

function readKey<T>(key: string): T[] | null {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T[]) : null;
  } catch {
    return null;
  }
}

function writeKey(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked or full: keep working from memory.
  }
}

function notify() {
  version++;
  listeners.forEach((l) => l());
}

function save() {
  writeKey(
    CLOUD_KEY,
    [...cloud].map(([id, uploadedAt]) => ({ id, uploadedAt }))
  );
  writeKey(
    PHONE_KEY,
    [...removed].map(([id, removedAt]) => ({ id, removedAt }))
  );
  notify();
}

function seedFromManifest() {
  cloud = new Map(FILES.filter((f) => f.initialCloud).map((f) => [f.id, Date.parse(f.date)]));
  removed = new Map();
}

function load() {
  const savedCloud = readKey<CloudEntry>(CLOUD_KEY);
  const savedPhone = readKey<RemovedEntry>(PHONE_KEY);
  if (!savedCloud || !savedPhone) {
    seedFromManifest();
    save();
    return;
  }
  cloud = new Map(savedCloud.map((e) => [e.id, e.uploadedAt]));
  removed = new Map(savedPhone.map((e) => [e.id, e.removedAt]));
}

load();

// Another tab changed the cloud: pick up the change without writing anything back.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === UPLOADING_KEY) {
      try {
        uploading = e.newValue ? (JSON.parse(e.newValue) as Uploading) : null;
      } catch {
        uploading = null;
      }
      notify();
      return;
    }
    if (e.key !== null && e.key !== CLOUD_KEY && e.key !== PHONE_KEY) return;
    const savedCloud = readKey<CloudEntry>(CLOUD_KEY);
    const savedPhone = readKey<RemovedEntry>(PHONE_KEY);
    if (!savedCloud || !savedPhone) return; // a reset is in the middle of writing
    cloud = new Map(savedCloud.map((x) => [x.id, x.uploadedAt]));
    removed = new Map(savedPhone.map((x) => [x.id, x.removedAt]));
    notify();
  });
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getVersion() {
  return version;
}

export function getStatus(id: string): FileStatus {
  const inCloud = cloud.has(id);
  const onPhone = !removed.has(id);
  if (inCloud && onPhone) return 'phone-and-cloud';
  if (inCloud) return 'cloud-only';
  if (onPhone) return 'phone-only';
  return 'deleted';
}

export function getRemovedAt(id: string) {
  return removed.get(id);
}

/** The upload that is happening right now (in this tab or another one), if any. */
export function getUploading() {
  return uploading;
}

export function getCloudContents(): CloudEntry[] {
  return [...cloud].map(([id, uploadedAt]) => ({ id, uploadedAt }));
}

/** Saves files to the cloud. Takes about 1.5 s and reports progress from 0 to 1. */
export function upload(ids: string[], onProgress?: (value: number) => void): Promise<void> {
  const duration = 1500;
  const start = performance.now();
  return new Promise((resolve) => {
    const tick = () => {
      const value = Math.min(1, (performance.now() - start) / duration);
      onProgress?.(value);
      uploading = { ids, progress: value };
      writeKey(UPLOADING_KEY, uploading);
      if (value < 1) {
        setTimeout(tick, 50);
        return;
      }
      const now = Date.now();
      ids.forEach((id) => {
        if (!cloud.has(id)) cloud.set(id, now);
      });
      uploading = null;
      try {
        localStorage.removeItem(UPLOADING_KEY);
      } catch {
        // ignore
      }
      save();
      resolve();
    };
    tick();
  });
}

export function removeFromPhone(ids: string[]) {
  const now = Date.now();
  ids.forEach((id) => removed.set(id, now));
  save();
}

export function restoreToPhone(ids: string[]) {
  ids.forEach((id) => removed.delete(id));
  save();
}

/** Gone from the phone and from the cloud. */
export function deletePermanently(ids: string[]) {
  const now = Date.now();
  ids.forEach((id) => {
    cloud.delete(id);
    removed.set(id, now);
  });
  save();
}

export function snapshot(ids: string[]): Snapshot {
  return {
    cloud: ids.map((id) => [id, cloud.get(id)]),
    removed: ids.map((id) => [id, removed.get(id)]),
  };
}

/** Puts files back exactly as they were in the snapshot (Undo). */
export function restoreSnapshot(snap: Snapshot) {
  snap.cloud.forEach(([id, at]) => (at === undefined ? cloud.delete(id) : cloud.set(id, at)));
  snap.removed.forEach(([id, at]) => (at === undefined ? removed.delete(id) : removed.set(id, at)));
  save();
}

/** Clears both keys and goes back to the starting state. */
export function resetDemo() {
  try {
    localStorage.removeItem(CLOUD_KEY);
    localStorage.removeItem(PHONE_KEY);
    localStorage.removeItem(UPLOADING_KEY);
  } catch {
    // ignore
  }
  seedFromManifest();
  save();
}
