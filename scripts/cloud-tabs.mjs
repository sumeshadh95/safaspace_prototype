// Two tabs side by side: the app uploads, the Cloud view (#/cloud) updates live.
// Start the app first (`npm run dev`), then: node scripts/cloud-tabs.mjs
import fs from 'node:fs';
import { chromium } from 'playwright';

const URL = process.env.APP_URL ?? 'http://localhost:5288/';
const OUT = 'journey-screenshots';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'msedge' }));
const context = await browser.newContext({ deviceScaleFactor: 1 });
const app = await context.newPage();
await app.setViewportSize({ width: 390, height: 844 });
const cloudTab = await context.newPage();
await cloudTab.setViewportSize({ width: 1280, height: 860 });

const errors = [];
for (const p of [app, cloudTab]) p.on('pageerror', (e) => errors.push(e.message));

const filesInCloud = async () =>
  Number((await cloudTab.getByText('Files in cloud').locator('..').locator('p').nth(1).textContent()).replace(/\D/g, ''));

await app.goto(URL);
await app.evaluate(() => localStorage.clear());
// The buttons in the app open the cloud in a new tab.
for (const [route, label] of [['#/', 'My cloud'], ['#/results', 'See my cloud']]) {
  await app.goto(URL + route);
  const [popup] = await Promise.all([context.waitForEvent('page'), app.getByRole('link', { name: label }).click()]);
  await popup.getByText('Robert’s cloud').waitFor();
  console.log(`"${label}" button opens the cloud in a new tab`);
  await popup.close();
}
await app.goto(URL + '#/photos');
await cloudTab.goto(URL + '#/cloud');
await cloudTab.getByText('Robert’s cloud').waitFor();
const before = await filesInCloud();
console.log('cloud tab before upload:', before);
await cloudTab.screenshot({ path: `${OUT}/cloud-1-before.png` });

await app.getByRole('tab', { name: 'Only on phone' }).click();
const boxes = app.getByRole('checkbox', { name: /^Select (?!all)/ });
for (let i = 0; i < 3; i++) await boxes.nth(i).click();
await app.locator('main').getByRole('button', { name: 'Upload', exact: true }).last().click();
await app.getByRole('button', { name: /Save to cloud and keep on phone/ }).click();

await cloudTab.getByText('Arriving now: 3 photos').waitFor({ timeout: 3000 });
await cloudTab.waitForTimeout(500);
await cloudTab.screenshot({ path: `${OUT}/cloud-2-arriving.png` });
console.log('cloud tab shows "Arriving now" while uploading');

await app.getByText('Done!').waitFor();
await cloudTab.getByText('3 just arrived').waitFor({ timeout: 3000 });
const after = await filesInCloud();
console.log('cloud tab after upload:', after);
await cloudTab.waitForTimeout(400);
await cloudTab.screenshot({ path: `${OUT}/cloud-3-arrived.png` });

await browser.close();
if (after !== before + 3) throw new Error(`expected ${before + 3} files in cloud, got ${after}`);
if (errors.length) throw new Error(errors.join('\n'));
console.log('Two-tab cloud check passed.');
