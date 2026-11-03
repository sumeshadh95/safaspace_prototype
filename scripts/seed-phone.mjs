// Builds the mock "phone": copies the 3 base photos from mock-source/ into
// public/phone/ under realistic file names and writes src/data/phoneFiles.json.
// A fixed random seed keeps the data identical on every run and every laptop.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { makeMockPhotos } from './make-mock-photos.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'mock-source');
const phoneDir = path.join(root, 'public', 'phone');
const thumbDir = path.join(phoneDir, 'thumbs');
const manifestPath = path.join(root, 'src', 'data', 'phoneFiles.json');
const stampPath = path.join(phoneDir, '.seed-stamp');
const SEED_VERSION = 3;

const BASE_IMAGES = ['photo-1.jpg', 'photo-2.jpg', 'photo-3.jpg'];

// Exact starting totals (they match the design).
const COUNTS = { photo: 120, video: 25, document: 30 };
const SAVED = { photo: 72, video: 15, document: 12 };
// A few files break the pattern so it doesn't look perfectly clean.
const EXCEPTIONS = { photo: 4, video: 2, document: 2 };
const TOTAL_MB = { photo: 420, video: 5600, document: 45 };
const SIZE_RANGE = { photo: [2, 5], video: [50, 400], document: [0.1, 3] };
// Photos + videos that are on the phone and in the cloud: 3,500 MB ≈ room for 1,000 new photos.
const SAVED_MEDIA_MB = 3500;

const START = Date.UTC(2017, 2, 1);
const CUTOFF = Date.UTC(2023, 6, 1); // Robert changed phones; automatic saving stopped.
const END = Date.UTC(2026, 9, 31, 20);

// --- deterministic random -------------------------------------------------
function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20231108);
const between = (min, max) => min + rand() * (max - min);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Daytime timestamp between two dates.
function randomDate(from, to) {
  const day = new Date(from + rand() * (to - from));
  day.setUTCHours(8 + Math.floor(rand() * 13), Math.floor(rand() * 60), Math.floor(rand() * 60));
  return day;
}

// Scale values to an exact total while keeping each inside [min, max].
function fitToTotal(values, total, [min, max]) {
  let v = [...values];
  for (let i = 0; i < 30; i++) {
    const sum = v.reduce((s, x) => s + x, 0);
    v = v.map((x) => Math.min(max, Math.max(min, (x * total) / sum)));
  }
  v = v.map((x) => Math.round(x * 10) / 10);
  let diff = Math.round((total - v.reduce((s, x) => s + x, 0)) * 10) / 10;
  for (let i = 0; Math.abs(diff) > 0.001 && i < v.length * 4; i++) {
    const k = i % v.length;
    const step = Math.sign(diff) * Math.min(Math.abs(diff), 0.5);
    const next = Math.round((v[k] + step) * 10) / 10;
    if (next >= min && next <= max) {
      v[k] = next;
      diff = Math.round((diff - step) * 10) / 10;
    }
  }
  return v;
}

// --- names ----------------------------------------------------------------
const p2 = (n) => String(n).padStart(2, '0');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function stamp(d) {
  return {
    ymd: `${d.getUTCFullYear()}${p2(d.getUTCMonth() + 1)}${p2(d.getUTCDate())}`,
    hms: `${p2(d.getUTCHours())}${p2(d.getUTCMinutes())}${p2(d.getUTCSeconds())}`,
    dashed: `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}`,
    dotted: `${p2(d.getUTCHours())}.${p2(d.getUTCMinutes())}.${p2(d.getUTCSeconds())}`,
  };
}

function photoName(d) {
  const s = stamp(d);
  const r = rand();
  if (r < 0.68) return `IMG_${s.ymd}_${s.hms}.jpg`;
  if (r < 0.9) return `WhatsApp Image ${s.dashed} at ${s.dotted}.jpeg`;
  return `Screenshot_${s.ymd}_${s.hms}.png`;
}

const DOCUMENTS = [
  (d) => `Bank_statement_${MONTHS[d.getUTCMonth()]}_${d.getUTCFullYear()}.pdf`,
  (d) => `Pension_letter_${d.getUTCFullYear()}.pdf`,
  () => 'Medicine_list.docx',
  () => 'Train_ticket_Helsinki.pdf',
  () => 'Recipe_karjalanpiirakka.pdf',
  (d) => `Tax_decision_${d.getUTCFullYear()}.pdf`,
  () => 'Electricity_bill_Q3.pdf',
  () => 'Doctor_appointment_Mikkeli.pdf',
  () => 'Insurance_policy_home.pdf',
  () => 'Christmas_card_addresses.xlsx',
  () => 'Grandchildren_birthdays.docx',
  () => 'Recipe_salmon_soup.pdf',
  () => 'Cottage_rental_Saimaa.pdf',
  () => 'Car_service_receipt.pdf',
  () => 'Library_books_list.docx',
  (d) => `Water_bill_${MONTHS[d.getUTCMonth()]}.pdf`,
  () => 'Eye_test_results.pdf',
  () => 'Phone_contract.pdf',
  () => 'Recipe_blueberry_pie.pdf',
  () => 'Ferry_ticket_Tallinn.pdf',
  () => 'Choir_song_sheets.pdf',
  () => 'Garden_planting_plan.docx',
  () => 'Warranty_washing_machine.pdf',
  () => 'Lab_results_blood_test.pdf',
  () => 'Family_tree_notes.docx',
  () => 'Housing_company_meeting.pdf',
  () => 'Pharmacy_receipt.pdf',
  () => 'Concert_tickets_Savonlinna.pdf',
  () => 'Monthly_budget.xlsx',
  () => 'Vaccination_card.pdf',
];

// --- build the file list --------------------------------------------------
function makeDates(type) {
  const saved = SAVED[type];
  const total = COUNTS[type];
  const before = Array.from({ length: saved }, () => randomDate(START, CUTOFF));
  const after = Array.from({ length: total - saved }, () => randomDate(CUTOFF, END));
  // Mostly: old = saved, new = only on phone. Swap a few so it isn't too clean.
  const old = before.map((date) => ({ date, cloud: true }));
  const recent = after.map((date) => ({ date, cloud: false }));
  shuffle(old.map((_, i) => i)).slice(0, EXCEPTIONS[type]).forEach((i) => (old[i].cloud = false));
  shuffle(recent.map((_, i) => i)).slice(0, EXCEPTIONS[type]).forEach((i) => (recent[i].cloud = true));
  return [...old, ...recent].sort((a, b) => a.date - b.date);
}

function uniqueName(name, used) {
  let candidate = name;
  for (let n = 1; used.has(candidate); n++) {
    const dot = name.lastIndexOf('.');
    candidate = `${name.slice(0, dot)}_${n}${name.slice(dot)}`;
  }
  used.add(candidate);
  return candidate;
}

function buildFiles() {
  const files = [];
  const used = new Set();

  // Photos
  const photos = makeDates('photo').map((x, i) => ({ ...x, name: uniqueName(photoName(x.date), used), base: i % 3 }));
  const photoSizes = fitToTotal(photos.map(() => between(...SIZE_RANGE.photo)), TOTAL_MB.photo, SIZE_RANGE.photo);

  // Videos: split sizes so saved photos + saved videos ≈ 3,500 MB (room for about 1,000 new photos)
  const videos = makeDates('video').map((x, i) => {
    const s = stamp(x.date);
    return { ...x, name: uniqueName(`VID_${s.ymd}_${s.hms}.mp4`, used), base: (i + 1) % 3 };
  });
  const savedPhotoMB = photos.reduce((sum, p, i) => sum + (p.cloud ? photoSizes[i] : 0), 0);
  const savedVideoTarget = Math.round((SAVED_MEDIA_MB - savedPhotoMB) * 10) / 10;
  const savedVideoSizes = fitToTotal(videos.filter((v) => v.cloud).map(() => between(...SIZE_RANGE.video)), savedVideoTarget, SIZE_RANGE.video);
  const otherVideoSizes = fitToTotal(videos.filter((v) => !v.cloud).map(() => between(...SIZE_RANGE.video)), TOTAL_MB.video - savedVideoTarget, SIZE_RANGE.video);

  // Documents
  const docs = makeDates('document').map((x, i) => ({ ...x, name: uniqueName(DOCUMENTS[i](x.date), used) }));
  const docSizes = fitToTotal(docs.map(() => between(...SIZE_RANGE.document)), TOTAL_MB.document, SIZE_RANGE.document);

  photos.forEach((p, i) => {
    files.push({
      id: `p${String(i + 1).padStart(3, '0')}`,
      name: p.name,
      type: 'photo',
      path: `/phone/${p.name}`,
      thumb: `/phone/thumbs/${thumbName(p.name)}`,
      date: p.date.toISOString(),
      sizeMB: photoSizes[i],
      initialCloud: p.cloud,
      base: p.base,
    });
  });
  let s = 0;
  let o = 0;
  videos.forEach((v, i) => {
    const thumbFile = v.name.replace(/\.mp4$/, '_thumb.jpg');
    files.push({
      id: `v${String(i + 1).padStart(3, '0')}`,
      name: v.name,
      type: 'video',
      path: `/phone/${thumbFile}`,
      thumb: `/phone/thumbs/${thumbName(thumbFile)}`,
      date: v.date.toISOString(),
      sizeMB: v.cloud ? savedVideoSizes[s++] : otherVideoSizes[o++],
      initialCloud: v.cloud,
      base: v.base,
    });
  });
  docs.forEach((d, i) => {
    files.push({
      id: `d${String(i + 1).padStart(3, '0')}`,
      name: d.name,
      type: 'document',
      path: null,
      thumb: null,
      date: d.date.toISOString(),
      sizeMB: docSizes[i],
      initialCloud: d.cloud,
    });
  });
  return files;
}

const thumbName = (name) => name.replace(/\.[^.]+$/, '.jpg').replace(/\s+/g, '_');

// --- write everything -----------------------------------------------------
function sourceFingerprint() {
  const h = crypto.createHash('sha1').update(String(SEED_VERSION));
  for (const name of BASE_IMAGES) h.update(fs.readFileSync(path.join(sourceDir, name)));
  return h.digest('hex');
}

async function main() {
  await makeMockPhotos(); // only draws photos that are missing
  const fingerprint = sourceFingerprint();
  const upToDate =
    fs.existsSync(manifestPath) && fs.existsSync(stampPath) && fs.readFileSync(stampPath, 'utf8') === fingerprint;
  if (upToDate) {
    console.log('Phone is already set up (mock-source/ unchanged).');
    return;
  }

  const files = buildFiles();
  fs.rmSync(phoneDir, { recursive: true, force: true });
  fs.mkdirSync(thumbDir, { recursive: true });

  // Prepare each base image in the formats we need, then copy under each file name.
  const bases = [];
  for (const name of BASE_IMAGES) {
    const img = sharp(path.join(sourceDir, name)).rotate();
    bases.push({
      jpg: await img.clone().resize(1200, 900, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer(),
      png: await img.clone().resize(1200, 900, { fit: 'cover' }).png({ compressionLevel: 9, palette: true }).toBuffer(),
      thumb: await img.clone().resize(168, 168, { fit: 'cover' }).jpeg({ quality: 78 }).toBuffer(),
    });
  }
  for (const f of files) {
    if (!f.path) continue;
    const b = bases[f.base];
    const file = path.join(phoneDir, decodeURIComponent(path.basename(f.path)));
    fs.writeFileSync(file, file.endsWith('.png') ? b.png : b.jpg);
    fs.writeFileSync(path.join(thumbDir, path.basename(f.thumb)), b.thumb);
  }

  const manifest = files.map(({ base, ...f }) => ({
    ...f,
    path: f.path && encodeURI(f.path),
    thumb: f.thumb && encodeURI(f.thumb),
  }));
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  fs.writeFileSync(stampPath, fingerprint);

  const sum = (type, cloudOnly) =>
    files.filter((f) => f.type === type && (!cloudOnly || f.initialCloud)).length;
  console.log(
    `Phone ready: ${sum('photo')} photos (${sum('photo', true)} saved), ` +
      `${sum('video')} videos (${sum('video', true)} saved), ` +
      `${sum('document')} documents (${sum('document', true)} saved).`
  );
}

await main();
