// Prepares the app screenshots in public/screenshots/ (runs before dev and build):
// 1. makes a WebP copy of every PNG (skips ones that are up to date);
// 2. writes src/generated/screenshots.json with the colour of each screenshot's top edge,
//    so the phone's status bar (drawn above the screenshot) joins it seamlessly.
// Your own PNG screenshots with the same names are used as they are.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve('public/screenshots');
const metaFile = path.resolve('src/generated/screenshots.json');
const meta = {};
let made = 0;

const hex = (values) => '#' + values.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

if (fs.existsSync(dir)) {
  for (const name of fs.readdirSync(dir).sort()) {
    if (!name.endsWith('.png')) continue;
    const png = path.join(dir, name);
    const webp = png.replace(/\.png$/, '.webp');
    if (!fs.existsSync(webp) || fs.statSync(webp).mtimeMs < fs.statSync(png).mtimeMs) {
      await sharp(png).webp({ quality: 82 }).toFile(webp);
      made++;
    }
    // Average the top 3 rows (stats() would look at the whole image, so read the pixels).
    const { width } = await sharp(png).metadata();
    const { data, info } = await sharp(png).extract({ left: 0, top: 0, width, height: 3 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const sum = [0, 0, 0];
    for (let i = 0; i < data.length; i += info.channels) for (let c = 0; c < 3; c++) sum[c] += data[i + c];
    const [r, g, b] = sum.map((v) => v / (data.length / info.channels));
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    meta[name.replace(/\.png$/, '')] = { top: hex([r, g, b]), light: luminance > 0.5 };
  }
}

// Only write when something changed, so the dev server doesn't reload for nothing.
const json = JSON.stringify(meta, null, 2) + '\n';
fs.mkdirSync(path.dirname(metaFile), { recursive: true });
if (!fs.existsSync(metaFile) || fs.readFileSync(metaFile, 'utf8') !== json) fs.writeFileSync(metaFile, json);

console.log(made ? `Made ${made} WebP screenshot(s).` : 'WebP screenshots are up to date.');
