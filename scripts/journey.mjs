// Walks the full demo journey at 390×844 and saves screenshots to journey-screenshots/.
// Start the app first (`npm run dev`), then run `npm run journey`.
import fs from 'node:fs';
import { chromium } from 'playwright';

const URL = process.env.APP_URL ?? 'http://localhost:5288/';
const OUT = 'journey-screenshots';
fs.mkdirSync(OUT, { recursive: true });

async function launch() {
  try {
    return await chromium.launch();
  } catch {
    return chromium.launch({ channel: 'msedge' });
  }
}

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

let n = 0;
const shot = async (name, opts = {}) => {
  const file = `${OUT}/${String(++n).padStart(2, '0')}-${name}.png`;
  await page.waitForTimeout(400); // let sheets and toasts finish sliding in
  await page.screenshot({ path: file, ...opts });
  console.log('  screenshot', file);
};
const step = (s) => console.log(`- ${s}`);
const expectText = async (text) => {
  await page.getByText(text, { exact: false }).first().waitFor({ timeout: 6000 });
};
const storageText = () => page.locator('main').getByText(/GB of 64 GB used/).first().textContent();

// Start clean
await page.goto(URL);
await page.evaluate(() => localStorage.clear());
await page.goto(URL);
await page.evaluate(() => document.fonts.ready);

step('Home');
await expectText('61 GB of 64 GB used');
await expectText('Almost full');
await shot('home');

step('Check my phone -> scanning');
await page.getByRole('button', { name: 'Check my phone' }).click();
await expectText('Looking at your photos and files');
await shot('scanning');

step('Results');
await expectText('Check complete');
await expectText('87 photos and videos are safe in your cloud');
await expectText('about 1,000 new photos');
await expectText('72 of 120 saved in cloud');
await expectText('15 of 25 saved in cloud');
await expectText('12 of 30 saved in cloud');
await shot('results');
await shot('results-full', { fullPage: false });
// Make sure "Bring back removed files" is reachable by scrolling
const bring = page.getByRole('button', { name: 'Bring back removed files' });
await bring.scrollIntoViewIfNeeded();
await shot('results-bottom');

step('Photos list');
await page.getByRole('button', { name: /^Photos:/ }).click();
await expectText('72 saved in cloud · 48 only on this phone');
await shot('photos-list');

step('Filter: Only on phone, select 3');
await page.getByRole('tab', { name: 'Only on phone' }).click();
const boxes = page.getByRole('checkbox', { name: /^Select (?!all)/ });
for (let i = 0; i < 3; i++) await boxes.nth(i).click();
await expectText('3 selected');
await shot('three-selected');

step('Upload -> save and remove');
await page.locator('main').getByRole('button', { name: 'Upload', exact: true }).last().click();
await expectText('Save to cloud and remove from phone');
await shot('upload-sheet');
await page.getByRole('button', { name: /Save to cloud and remove from phone/ }).click();
await expectText('Saving 3 photos');
await shot('upload-progress');
await expectText('Done!');
await expectText('3 photos are now safe in your cloud');
await shot('upload-done');
await page.getByRole('button', { name: 'OK' }).click();
await expectText('3 photos removed from phone');
await expectText('72 saved in cloud · 45 only on this phone');
await shot('undo-toast');

step('Undo');
await page.getByRole('button', { name: 'Undo' }).click();
await expectText('75 saved in cloud · 45 only on this phone');
await shot('after-undo');

step('Delete a cloud-saved photo');
await page.getByRole('tab', { name: 'Saved in cloud' }).click();
const firstSaved = page.getByRole('button', { name: /^Delete / }).first();
await firstSaved.click();
await expectText('Remove from phone?');
await shot('delete-saved-sheet');
await page.getByRole('button', { name: 'Remove from phone', exact: true }).click();
await expectText('1 photo removed from phone');
await expectText('74 saved in cloud · 45 only on this phone');
await shot('removed-toast');

step('Delete an unsaved photo shows the calm warning (then cancel)');
await page.getByRole('tab', { name: 'Only on phone' }).click();
await page.getByRole('button', { name: /^Delete / }).first().click();
await expectText('This photo is only on your phone');
await shot('delete-unsaved-sheet');
await page.getByRole('button', { name: 'Cancel' }).click();

step('Preview by tapping a row');
await page.getByRole('button', { name: /^Open / }).first().click();
await page.getByRole('dialog').waitFor();
await shot('preview');
await page.getByRole('dialog').getByRole('button', { name: 'Back' }).click();

step('Bring back');
await page.getByRole('button', { name: 'Back' }).first().click();
await expectText('Check complete');
await bring.click();
await expectText('Bring back removed files');
await expectText('Bring back to phone');
await shot('bring-back');
await page.getByRole('button', { name: 'Bring back to phone' }).first().click();
await expectText('is back on your phone');
await expectText('Nothing to bring back');
await shot('brought-back');

step('Remove one more, then refresh: state must persist');
await page.getByRole('button', { name: 'Back' }).first().click();
await page.getByRole('button', { name: /^Photos:/ }).click();
await page.getByRole('tab', { name: 'Saved in cloud' }).click();
await page.getByRole('button', { name: /^Delete / }).first().click();
await page.getByRole('button', { name: 'Remove from phone', exact: true }).click();
await expectText('74 saved in cloud');
await page.reload();
await expectText('74 saved in cloud · 45 only on this phone');
const cloudCount = await page.evaluate(() => JSON.parse(localStorage.getItem('safespace.cloud')).length);
console.log('  cloud entries after refresh:', cloudCount);
if (cloudCount !== 102) throw new Error(`expected 102 files in cloud, got ${cloudCount}`);
await shot('after-refresh');

step('Home storage dropped, then Reset demo');
await page.goto(URL);
console.log('  storage now:', await storageText());
await page.getByRole('button', { name: 'Demo' }).click();
await page.getByRole('button', { name: 'Show cloud contents' }).click();
await shot('demo-panel');
await page.getByRole('button', { name: 'Reset demo' }).click();
await expectText('61 GB of 64 GB used');
await page.getByRole('button', { name: 'Check my phone' }).click();
await expectText('87 photos and videos are safe in your cloud');
await expectText('72 of 120 saved in cloud');

const themeNow = () => page.evaluate(() => document.documentElement.dataset.theme);

step('Dark mode');
await page.goto(URL);
await page.getByRole('switch', { name: 'Dark mode' }).click();
if ((await themeNow()) !== 'dark') throw new Error('dark mode did not turn on');
await shot('home-dark');
await page.getByRole('button', { name: 'Check my phone' }).click();
await expectText('Check complete');
await shot('results-dark');
await page.getByRole('button', { name: /^Photos:/ }).click();
await expectText('saved in cloud ·');
await shot('photos-dark');
await page.reload();
if ((await themeNow()) !== 'dark') throw new Error('dark mode was not kept after a refresh');
console.log('  dark mode kept after refresh');
await page.goto(URL);
await page.getByRole('switch', { name: 'Dark mode' }).click();
if ((await themeNow()) !== 'light') throw new Error('dark mode did not turn off');

step('Power saving');
await page.getByRole('button', { name: /^Power saving/ }).click();
await expectText('Turn on power saving?');
await shot('power-saving-sheet');
await page.getByRole('button', { name: 'Turn on power saving' }).click();
await expectText('Turn off power saving');
await shot('power-saving-home');

await page.getByRole('button', { name: 'Phone', exact: true }).click();
for (const d of ['0', '4', '0', '1', '2', '3', '4', '5', '6', '7']) await page.getByRole('button', { name: d, exact: true }).click();
await expectText('040 123 4567');
await shot('saver-phone');
await page.getByRole('button', { name: 'Call', exact: true }).click();
await expectText('No real call is made');
await shot('saver-calling');
await page.getByRole('button', { name: 'End call' }).click();
await page.getByRole('button', { name: 'Back' }).click();

await page.getByRole('button', { name: 'Contacts', exact: true }).click();
await page.getByRole('button', { name: 'Call Anna' }).click();
await expectText('Calling');
await page.getByRole('button', { name: 'End call' }).click();
await shot('saver-contacts');
await page.getByRole('button', { name: 'Back' }).click();

for (const app of ['Messages', 'Camera', 'Photos']) {
  await page.getByRole('button', { name: app, exact: true }).click();
  if (app === 'Camera') {
    await page.getByRole('button', { name: 'Take photo' }).click();
    await expectText('no photo is saved');
  }
  await shot(`saver-${app.toLowerCase()}`);
  await page.getByRole('button', { name: 'Back' }).click();
}

await page.getByRole('button', { name: 'SafeSpace', exact: true }).click();
await expectText('Power saving is on');
if ((await themeNow()) !== 'dark') throw new Error('SafeSpace should be dark in power saving');
await shot('saver-safespace');
await page.getByRole('button', { name: 'Simple home' }).click();
await page.reload();
await expectText('Turn off power saving');
console.log('  power saving kept after refresh');
await page.getByRole('button', { name: 'Turn off power saving' }).click();
await expectText('Check my phone');
if ((await themeNow()) !== 'light') throw new Error('theme should be light again after power saving');

step('Desktop frame');
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(URL);
await shot('desktop-frame');
await page.getByRole('switch', { name: 'Dark mode' }).click();
await shot('desktop-frame-dark');
await page.getByRole('switch', { name: 'Dark mode' }).click();
await page.getByRole('button', { name: /^Power saving/ }).click();
await page.getByRole('button', { name: 'Turn on power saving' }).click();
await expectText('Turn off power saving');
await shot('desktop-frame-saver');
await page.getByRole('button', { name: 'Turn off power saving' }).click();

await browser.close();
if (errors.length) {
  console.log('Console errors:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('Journey complete, no errors.');
