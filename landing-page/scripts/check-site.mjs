// Checks the landing page at 1440px and 390px with Playwright:
// every section renders, no broken images, no horizontal overflow on mobile,
// and every "Try the demo" link opens PROTOTYPE_URL in a new tab.
// Saves full-page screenshots to site-check/. Run with the site running: `npm run check`.
import fs from 'node:fs';
import { chromium } from 'playwright';

const SITE = process.env.SITE_URL ?? 'http://localhost:5310/';
const config = fs.readFileSync('src/config.ts', 'utf8');
// In dev the demo links point at the local prototype; on a built site pass PROTOTYPE_URL (e.g. http://localhost:5320/app/).
const PROTOTYPE_URL = process.env.PROTOTYPE_URL ?? config.match(/PROTOTYPE_DEV_URL\s*=\s*'([^']+)'/)[1];
const SECTIONS = ['features', 'how-it-works', 'safety', 'faq', 'for-organisations'];
fs.mkdirSync('site-check', { recursive: true });

const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'msedge' }));
const problems = [];

for (const [label, width, height] of [
  ['desktop-1440', 1440, 900],
  ['mobile-390', 390, 844],
  ['small-360', 360, 740],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on('pageerror', (e) => problems.push(`[${label}] page error: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && problems.push(`[${label}] console: ${m.text()}`));
  await page.goto(SITE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  // Scroll through so lazy images load and reveal animations run.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  const hidden = await page.evaluate(() => document.querySelectorAll('.reveal:not(.is-visible)').length);
  if (hidden) problems.push(`[${label}] ${hidden} section block(s) never faded in`);
  // Wait for every image (lazy ones included) to finish loading.
  await page.evaluate(() =>
    Promise.all(
      [...document.images].map((img) => {
        img.loading = 'eager';
        return img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; setTimeout(r, 5000); });
      })
    )
  );

  const report = await page.evaluate(
    ({ sections, prototype }) => {
      const missing = sections.filter((id) => !document.getElementById(id));
      const images = [...document.images];
      const broken = images.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.currentSrc || img.src);
      const noAlt = images.filter((img) => !img.hasAttribute('alt')).map((img) => img.src);
      const demo = [...document.querySelectorAll('a[data-cta="demo"]')].map((a) => ({ href: a.href, target: a.target }));
      const badDemo = demo.filter((d) => d.href !== prototype || d.target !== '_blank');
      const h1 = document.querySelectorAll('h1').length;
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      const wide = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.right <= window.innerWidth + 1) return false;
          // inside a horizontal scroller is fine (the screen carousel)
          for (let p = el.parentElement; p; p = p.parentElement) {
            const s = getComputedStyle(p);
            if (s.overflowX === 'auto' || s.overflowX === 'hidden' || s.overflowX === 'scroll') return false;
          }
          return true;
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
      return { missing, images: images.length, broken, noAlt, demo: demo.length, badDemo, h1, overflow, wide };
    },
    { sections: SECTIONS, prototype: PROTOTYPE_URL }
  );

  console.log(`\n${label}: ${report.images} images, ${report.demo} "Try the demo" links, ${report.h1} h1, horizontal overflow ${report.overflow}px`);
  if (report.missing.length) problems.push(`[${label}] missing sections: ${report.missing.join(', ')}`);
  if (report.broken.length) problems.push(`[${label}] broken images: ${report.broken.join(', ')}`);
  if (report.noAlt.length) problems.push(`[${label}] images without alt: ${report.noAlt.join(', ')}`);
  if (report.badDemo.length) problems.push(`[${label}] demo links not opening ${PROTOTYPE_URL} in a new tab: ${JSON.stringify(report.badDemo)}`);
  if (report.demo < 3) problems.push(`[${label}] expected at least 3 demo links, found ${report.demo}`);
  if (report.h1 !== 1) problems.push(`[${label}] expected exactly one h1, found ${report.h1}`);
  if (report.overflow > 0) problems.push(`[${label}] page scrolls sideways by ${report.overflow}px: ${report.wide.join(' | ')}`);

  // Clicking a demo button really opens the prototype in a new tab.
  const [popup] = await Promise.all([page.context().waitForEvent('page'), page.locator('a[data-cta="demo"]').first().click()]);
  await popup.waitForLoadState('domcontentloaded').catch(() => {});
  console.log(`  demo button opened: ${popup.url()}`);
  if (!popup.url().startsWith(PROTOTYPE_URL)) problems.push(`[${label}] demo button opened ${popup.url()}`);
  await popup.close();

  if (label !== 'desktop-1440') {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.locator('#mobile-menu').getByRole('link', { name: 'Safety' }).click();
    await page.waitForTimeout(1500);
    const top = await page.evaluate(() => document.getElementById('safety').getBoundingClientRect().top);
    console.log(`  mobile menu -> Safety lands at ${Math.round(top)}px from top`);
    if (top < 0 || top > 200) problems.push(`[${label}] menu link did not scroll to Safety (top ${top})`);
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  // FAQ accordion opens and closes
  const q = page.getByRole('button', { name: 'What does it cost?' });
  await q.click();
  if ((await q.getAttribute('aria-expanded')) !== 'true') problems.push(`[${label}] FAQ did not open`);

  // Settle the page before the full-page picture.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `site-check/${label}.png`, fullPage: true });
  console.log(`  saved site-check/${label}.png`);
  await page.close();
}

await browser.close();
if (problems.length) {
  console.log('\nProblems:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log('\nAll checks passed.');
