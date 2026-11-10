// Captures the 6 app screenshots from the prototype into public/screenshots/.
// Run with `npm run screenshots` while the prototype is running.
// Uses PROTOTYPE_DEV_URL from src/config.ts (or the PROTOTYPE_URL environment variable).
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const config = fs.readFileSync('src/config.ts', 'utf8');
const URL = process.env.PROTOTYPE_URL ?? config.match(/PROTOTYPE_DEV_URL\s*=\s*'([^']+)'/)?.[1];
if (!URL) throw new Error('Could not find PROTOTYPE_DEV_URL in src/config.ts');
const OUT = path.resolve('public/screenshots');
fs.mkdirSync(OUT, { recursive: true });

console.log(`Capturing screenshots from ${URL}`);
const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'msedge' }));
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
// The prototype greets by time of day; fix the clock to the morning so Home says "Good morning, Robert"
// (as in the design). Timers keep running, so the app's animations work as usual.
await page.clock.setFixedTime(new Date('2026-11-03T09:30:00'));

let failed = 0;
async function step(label, fn) {
  try {
    await fn();
  } catch (err) {
    failed++;
    console.log(`  ! Skipped "${label}": ${String(err.message).split('\n')[0]}`);
  }
}
async function save(name, { top = true } = {}) {
  await page.mouse.move(0, 0); // no hover highlights in the picture
  if (top) await page.locator('main').evaluate((el) => el.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(500); // let sheets and toasts finish sliding in
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log(`  saved ${name}.png`);
}
const click = (locator, what) =>
  locator.first().click({ timeout: 5000 }).catch(() => {
    throw new Error(`could not find ${what}`);
  });

async function resetDemo() {
  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${URL}#/home`); // SafeSpace itself (the plain URL opens the phone's home screen)
  await page.evaluate(() => document.fonts.ready);
}

await step('reset demo', resetDemo);

await step('01 home', async () => {
  await page.getByRole('button', { name: 'Check my phone' }).waitFor({ timeout: 8000 });
  await save('01-home');
});

await step('02 results', async () => {
  await click(page.getByRole('button', { name: 'Check my phone' }), 'the "Check my phone" button');
  await page.getByText('Check complete').waitFor({ timeout: 8000 });
  await save('02-results');
});

await step('03 photos list', async () => {
  await click(page.getByRole('button', { name: /^Photos/ }), 'the Photos card');
  await click(page.getByRole('tab', { name: 'Only on phone' }), 'the "Only on phone" filter');
  const boxes = page.getByRole('checkbox', { name: /^Select (?!all)/ });
  for (let i = 0; i < 3; i++) await boxes.nth(i).click({ timeout: 5000 });
  await save('03-photos-list');
});

await step('04 upload sheet', async () => {
  await click(page.locator('main').getByRole('button', { name: 'Upload', exact: true }).last(), 'the Upload button in the selection bar');
  await page.getByText('Save to cloud and remove from phone').waitFor({ timeout: 5000 });
  await save('04-upload-sheet');
  await click(page.getByRole('button', { name: 'Cancel' }).last(), 'Cancel in the upload sheet');
  await click(page.getByRole('button', { name: 'Cancel' }), 'Cancel in the selection bar');
});

await step('05 delete warning', async () => {
  await click(page.getByRole('button', { name: /^Delete / }), 'a Delete button on an "only on phone" photo');
  await page.getByText('only on your phone').first().waitFor({ timeout: 5000 });
  await save('05-delete-warning');
  await click(page.getByRole('button', { name: 'Cancel' }).last(), 'Cancel in the delete sheet');
});

await step('06 undo toast', async () => {
  await click(page.getByRole('tab', { name: 'Saved in cloud' }), 'the "Saved in cloud" filter');
  const boxes = page.getByRole('checkbox', { name: /^Select (?!all)/ });
  for (let i = 0; i < 2; i++) await boxes.nth(i).click({ timeout: 5000 });
  await click(page.locator('main').getByRole('button', { name: 'Delete', exact: true }).last(), 'the Delete button in the selection bar');
  await click(page.getByRole('button', { name: 'Remove from phone', exact: true }), '"Remove from phone"');
  await page.getByRole('button', { name: 'Undo' }).waitFor({ timeout: 5000 });
  await save('06-undo-toast');
});

await step('reset demo afterwards', resetDemo);
await browser.close();
console.log(failed ? `Done with ${failed} skipped step(s). Existing screenshots were kept for those.` : 'All 6 screenshots captured.');
