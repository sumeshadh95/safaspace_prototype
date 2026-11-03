// Draws the 3 base mock photos as simple illustrated scenes (SVG -> 1200x900 JPG).
// Run with `npm run photos`. Existing photos are kept unless you pass --force,
// so your own photos in mock-source/ are never overwritten.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'mock-source');
const force = process.argv.includes('--force');

const W = 1200;
const H = 900;

const lake = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3B4B8C"/>
      <stop offset="0.45" stop-color="#C8607A"/>
      <stop offset="0.8" stop-color="#F5A25D"/>
      <stop offset="1" stop-color="#FFD58A"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F2A262"/>
      <stop offset="0.35" stop-color="#9C5A78"/>
      <stop offset="1" stop-color="#2E3566"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#FFF1C4" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#FFF1C4" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <circle cx="610" cy="470" r="230" fill="url(#glow)"/>
  <circle cx="610" cy="480" r="85" fill="#FFE6A8"/>
  <path d="M0 470 L120 400 L230 440 L360 360 L470 430 L560 410 L700 455 L820 380 L950 440 L1080 395 L1200 430 L1200 520 L0 520 Z" fill="#5A3E6B" opacity="0.75"/>
  <path d="M0 500 L90 455 L200 490 L330 440 L460 495 L1200 495 L1200 530 L0 530 Z" fill="#3A2F55"/>
  <rect y="515" width="${W}" height="385" fill="url(#water)"/>
  <g fill="#FFE6A8" opacity="0.8">
    <rect x="540" y="540" width="140" height="6" rx="3"/>
    <rect x="560" y="570" width="100" height="5" rx="2.5"/>
    <rect x="575" y="605" width="70" height="5" rx="2.5"/>
    <rect x="585" y="645" width="50" height="4" rx="2"/>
    <rect x="595" y="690" width="30" height="4" rx="2"/>
  </g>
  <g fill="#1F2240">
    <path d="M0 900 L0 700 L60 640 L90 660 L130 600 L170 650 L200 620 L260 700 L320 760 L380 820 L420 900 Z"/>
    <path d="M1200 900 L1200 640 L1150 600 L1110 650 L1070 610 L1020 690 L960 760 L900 840 L880 900 Z"/>
    <path d="M70 640 L95 560 L120 640 Z M150 610 L175 520 L200 610 Z M1100 650 L1130 550 L1160 650 Z"/>
  </g>
  <g fill="none" stroke="#2A2340" stroke-width="5" stroke-linecap="round">
    <path d="M780 300 q14 -12 28 0 q14 -12 28 0"/>
    <path d="M860 250 q10 -9 20 0 q10 -9 20 0"/>
  </g>
</svg>`;

const garden = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8FC6EA"/>
      <stop offset="1" stop-color="#DDF0F7"/>
    </linearGradient>
    <linearGradient id="lawn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7DBB5A"/>
      <stop offset="1" stop-color="#3F8A3A"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <circle cx="1020" cy="140" r="70" fill="#FFE07A"/>
  <g fill="#FFFFFF" opacity="0.9">
    <ellipse cx="260" cy="150" rx="110" ry="38"/><ellipse cx="330" cy="125" rx="80" ry="40"/>
    <ellipse cx="700" cy="110" rx="90" ry="30"/><ellipse cx="760" cy="95" rx="60" ry="30"/>
  </g>
  <path d="M0 420 Q300 360 600 410 T1200 390 L1200 900 L0 900 Z" fill="#5E9E4A"/>
  <g fill="#3E7C3A">
    <circle cx="140" cy="380" r="95"/><circle cx="230" cy="350" r="80"/><rect x="170" y="400" width="26" height="90" fill="#6B4A2E"/>
    <circle cx="1080" cy="360" r="105"/><rect x="1068" y="400" width="26" height="100" fill="#6B4A2E"/>
  </g>
  <rect y="470" width="${W}" height="430" fill="url(#lawn)"/>
  <rect x="0" y="430" width="${W}" height="60" fill="#E9E1D2"/>
  <g fill="#C9BBA2">${Array.from({ length: 24 }, (_, i) => `<rect x="${i * 52 + 6}" y="395" width="30" height="95" rx="6"/>`).join('')}</g>
  <path d="M560 900 Q600 700 640 490 L700 490 Q720 700 800 900 Z" fill="#D9C7A4"/>
  ${flowerBed(60, 560, '#E94F64')}
  ${flowerBed(260, 640, '#F5C542')}
  ${flowerBed(60, 760, '#B35FD0')}
  ${flowerBed(860, 580, '#F28AB2')}
  ${flowerBed(980, 700, '#F7F3E8')}
  ${flowerBed(860, 800, '#E94F64')}
</svg>`;

function flowerBed(x, y, color) {
  let out = '';
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 5; c++) {
      const fx = x + c * 56 + (r % 2) * 28;
      const fy = y + r * 50;
      out += `<rect x="${fx - 3}" y="${fy}" width="6" height="45" fill="#2F6B2E"/>`;
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2;
        out += `<circle cx="${(fx + Math.cos(a) * 14).toFixed(1)}" cy="${(fy + Math.sin(a) * 14).toFixed(1)}" r="11" fill="${color}"/>`;
      }
      out += `<circle cx="${fx}" cy="${fy}" r="8" fill="#F9D45C"/>`;
    }
  }
  return out;
}

const kitchen = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F4E6CF"/>
  <g fill="#EAD7B7">${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 100 + 46}" y="0" width="8" height="520"/>`).join('')}</g>
  <rect x="130" y="70" width="380" height="300" rx="10" fill="#FFFFFF"/>
  <rect x="145" y="85" width="350" height="270" fill="#A9D6EE"/>
  <path d="M145 300 Q260 230 360 280 T495 260 L495 355 L145 355 Z" fill="#8CC07A"/>
  <rect x="314" y="85" width="12" height="270" fill="#FFFFFF"/><rect x="145" y="214" width="350" height="12" fill="#FFFFFF"/>
  <path d="M110 60 Q190 200 150 380 L120 380 L100 60 Z" fill="#E07A5F"/>
  <path d="M530 60 Q450 200 490 380 L520 380 L540 60 Z" fill="#E07A5F"/>
  <rect x="760" y="140" width="280" height="22" rx="4" fill="#B98A5E"/>
  <rect x="790" y="80" width="46" height="60" rx="8" fill="#5C8DBF"/><rect x="850" y="95" width="40" height="45" rx="8" fill="#E9B44C"/><rect x="905" y="70" width="52" height="70" rx="8" fill="#7FB069"/>
  <circle cx="880" cy="300" r="70" fill="#FFFFFF" stroke="#7A5C3E" stroke-width="10"/>
  <path d="M880 300 L880 255 M880 300 L912 318" stroke="#17262A" stroke-width="8" stroke-linecap="round"/>
  <rect x="0" y="520" width="${W}" height="380" fill="#B5835A"/>
  <rect x="0" y="520" width="${W}" height="26" fill="#9C6E48"/>
  <g stroke="#A2744E" stroke-width="4">${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${600 + i * 55}" x2="${W}" y2="${590 + i * 55}"/>`).join('')}</g>
  <path d="M60 560 L1140 560 L1180 900 L20 900 Z" fill="#F1F5F4" opacity="0.92"/>
  <g fill="#D85C5C" opacity="0.55">${Array.from({ length: 10 }, (_, i) => `<rect x="${80 + i * 108}" y="560" width="48" height="340"/>`).join('')}</g>
  ${cup(330, 640, '#2448A8')}
  ${cup(720, 660, '#E9B44C')}
  <ellipse cx="560" cy="790" rx="130" ry="34" fill="#FFFFFF" stroke="#D9D2C4" stroke-width="6"/>
  <g fill="#C98B4E"><ellipse cx="510" cy="775" rx="42" ry="20"/><ellipse cx="600" cy="780" rx="42" ry="20"/><ellipse cx="555" cy="760" rx="42" ry="20"/></g>
  <rect x="930" y="600" width="120" height="150" rx="16" fill="#FFFFFF" opacity="0.9"/>
  <path d="M960 600 Q990 520 1020 600" fill="none" stroke="#7FB069" stroke-width="10"/>
  <circle cx="990" cy="540" r="26" fill="#F28AB2"/><circle cx="960" cy="560" r="20" fill="#F7D35C"/><circle cx="1020" cy="560" r="20" fill="#F28AB2"/>
</svg>`;

function cup(x, y, color) {
  return `
  <ellipse cx="${x}" cy="${y + 120}" rx="120" ry="30" fill="#FFFFFF" stroke="#D9D2C4" stroke-width="6"/>
  <path d="M${x - 75} ${y} L${x + 75} ${y} L${x + 60} ${y + 115} Q${x} ${y + 135} ${x - 60} ${y + 115} Z" fill="${color}"/>
  <path d="M${x + 72} ${y + 25} q55 5 40 50 q-10 25 -50 25" fill="none" stroke="${color}" stroke-width="16"/>
  <ellipse cx="${x}" cy="${y}" rx="75" ry="18" fill="#6B3E22"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" opacity="0.8">
    <path d="M${x - 25} ${y - 30} q-15 -30 0 -60 q15 -30 0 -60"/>
    <path d="M${x + 20} ${y - 30} q-15 -30 0 -60 q15 -30 0 -60"/>
  </g>`;
}

export async function makeMockPhotos({ force: forceAll = false } = {}) {
  fs.mkdirSync(outDir, { recursive: true });
  const scenes = { 'photo-1.jpg': lake, 'photo-2.jpg': garden, 'photo-3.jpg': kitchen };
  for (const [name, svg] of Object.entries(scenes)) {
    const target = path.join(outDir, name);
    if (fs.existsSync(target) && !forceAll) continue;
    await sharp(Buffer.from(svg)).resize(W, H).jpeg({ quality: 82 }).toFile(target);
    console.log(`  drew ${name}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.join(root, 'scripts', 'make-mock-photos.mjs')) {
  await makeMockPhotos({ force });
}
