// Makes the 1200×630 sharing image (public/og-image.png) from the hero.
// Run with the site running: `npm run og`.
import { chromium } from 'playwright';
import sharp from 'sharp';

const SITE = process.env.SITE_URL ?? 'http://localhost:5310/';
const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'msedge' }));
const page = await browser.newPage({ viewport: { width: 1440, height: 756 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
await page.goto(SITE, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// Hide the header so the picture is just the hero.
await page.addStyleTag({ content: 'header { display: none !important; }' });
// Wait for the hero's phone pictures only (lazy images further down never load here), at most 10 s.
await page.evaluate(() =>
  Promise.race([
    Promise.all([...document.querySelectorAll('section[aria-labelledby="hero-title"] img')].map((img) => img.decode().catch(() => {}))),
    new Promise((r) => setTimeout(r, 10000)),
  ])
);
await page.waitForTimeout(400);
// Capture at desktop width (1440×756 has the same 1.9:1 shape), then scale to 1200×630.
const shot = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 756 } });
await sharp(shot).resize(1200, 630).png().toFile('public/og-image.png');
await browser.close();
console.log('Saved public/og-image.png (1200×630)');
