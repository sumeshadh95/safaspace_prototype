# SafeSpace Storage Guide

A clickable web prototype (not a native app) that helps older adults free up phone space without fear of losing memories. It is built for a demo in the ICT Business Management course at Xamk. It runs in the browser and looks like a phone app. On a laptop or projector it appears inside a phone-shaped frame.

## Run it

```bash
npm install
npm run dev
```

Open **http://localhost:5288**. The app uses port 5288 because 5173 is taken by another program on the demo laptop. If 5288 is ever busy, Vite picks the next free port and prints it. `npm run dev` and `npm run build` first run `npm run seed`, which builds the mock "phone" (see below).

## Dark mode and power saving

Two buttons at the top of Home:

- **Dark mode**: switches the whole app between light and dark. The choice is remembered after a refresh.
- **Power saving**: asks first, then shows a true-black home screen with only the most important apps as big tiles: Phone, Messages, Contacts, Camera, Photos and SafeSpace.
  - **Phone** has a big keypad, and **Contacts** has one-tap calling. Both show a "Calling…" screen that clearly says no real call is made.
  - **Camera** is demo-only.
  - **Photos** shows the newest photos from the mock phone.
  - **SafeSpace** opens the app in dark mode, with a black bar and a **Simple home** button to go back.
  - **Turn off power saving** returns to normal.

On a laptop or projector, the app sits in a drawn phone with a status bar (time, battery). In power saving the status bar turns black and the battery shows green.

## Reset the demo

On the Home screen, tap the small grey **Demo** link at the bottom right:

- **Reset demo**: clears the saved cloud state and goes back to the starting numbers (61 GB used, 72/15/12 saved), light mode and power saving off.
- **Show cloud contents**: shows a table of everything saved in the "cloud", which proves to the audience that uploads really happened.

## Show the cloud in a second tab

The "cloud" is not a folder. It is a list saved in the browser (localStorage) under `safespace.cloud`. To show it to the audience, open the app's Cloud view in a second tab of the **same browser**:

- tap **My cloud** (top right of Home) or **See my cloud** (in the green panel on Results), which opens it in a new tab
- or go to `http://localhost:5288/#/cloud` (or your deployed URL + `#/cloud`)

Put the two tabs side by side. When you upload in the app, the Cloud tab shows "Arriving now… %" with a progress bar, and then the new photos appear at the top marked **New**. Removing, bringing back and resetting also update the Cloud tab live. Note that a private window or a different browser has its own separate cloud.

The state is kept in the browser's localStorage, so it survives a page refresh. You can also clear the site data in the browser to reset.

## Use your own photos

The 3 base photos are in `mock-source/` (`photo-1.jpg`, `photo-2.jpg` and `photo-3.jpg`). Replace any of them with your own picture under the same name. Any size or orientation works, because it is cropped to 4:3. Then run:

```bash
npm run seed
```

The seed script notices the change and rebuilds `public/phone/`. To redraw the original illustrated photos, delete the files and run `npm run photos` (or `npm run photos -- --force`).

## Put it online (one site: landing page + app)

`npm run build:site` builds everything into `dist-site/`:
- `/` is the landing page (from `landing-page/`)
- `/app/` is the SafeSpace app

The landing page's "Try the demo" buttons point to `/app/` automatically.

**Cloudflare Pages:**
1. Go to **Workers & Pages → Create → Pages → Connect to Git** and choose this repository.
2. Enter these settings:
   - Framework preset: None
   - Build command: `npm run build:site`
   - Build output directory: `dist-site`
   - Root directory: empty
3. Deploy. The Node version comes from `.nvmrc` (22).

**Vercel:** import the repository and set Build command to `npm run build:site` and Output directory to `dist-site`.

After that, every push to `main` redeploys the whole site. To test the built site locally, run `npm run build:site`, then `npx vite preview --outDir dist-site`.

## Check the full journey automatically

Start the app, then run the Playwright walkthrough. It takes screenshots into `journey-screenshots/`:

```bash
npm run dev
npm run journey               # full walkthrough
node scripts/cloud-tabs.mjs   # app tab + cloud tab, checks the live upload
```

The first run may need `npx playwright install chromium`. If Chromium is missing, the script falls back to Microsoft Edge.
