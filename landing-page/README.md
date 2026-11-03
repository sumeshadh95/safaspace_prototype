# SafeSpace landing page

The product landing page for SafeSpace, a phone storage helper for older adults (ICT Business Management, Xamk Mikkeli). The page **communicates the promise**; its "Try the demo" buttons open the **prototype**, which demonstrates the experience.

It is built with Vite, React, TypeScript, Tailwind CSS and lucide-react. It is fully static and deploys to GitHub Pages.

## Run it

```bash
npm install
npm run dev
```

Open **http://localhost:5310**. If that port is busy, Vite picks the next free one and prints it.

## Edit the text

All copy lives in **`src/content.ts`**, including the headline, features, steps, FAQ, persona quote and footer. You can change words there without touching any component. The placeholders `[NAMES]` and `[PRICE]` are at the top of that file.

To add real quotes from usability tests later, add them to the `stories` array in `src/content.ts`, and keep a truthful label.

## Change the prototype link and email

Open **`src/config.ts`**:

- `PROTOTYPE_URL` is where every "Try the demo" button goes. It points to `http://localhost:5288/` while developing, and to `/app/` on the live site, where the app is served from the same domain (see "Put it online" in the main README). Set `VITE_PROTOTYPE_URL` to override it.
- `TEAM_EMAIL` is used by "Partner with us" and "Contact us".

## Refresh the app screenshots

The screenshots in `public/screenshots/` come from the prototype. Start the prototype first (`npm run dev` in the prototype folder), then run:

```bash
npm run screenshots
```

It resets the demo, fixes the clock to the morning (so Home says "Good morning, Robert"), clicks through Home → Results → Photos → Upload → Delete → Undo at 390×844 (2× sharpness), and saves `01-home.png` to `06-undo-toast.png`. If a step can't find its button, it logs a clear message and keeps the old picture.

Before every `npm run dev` and `npm run build`, `scripts/prepare-screenshots.mjs` does two things. It makes a WebP copy of each screenshot. It also measures the colour along each screenshot's top edge (into `src/generated/screenshots.json`), so the phone's status bar blends into the screen.

**Using your own screenshots:** put PNGs with the same names in `public/screenshots/`. They are used as they are, and everything above happens automatically on the next `npm run dev` or `npm run build`.

## Use a real hero photo

Put a photo at **`public/images/hero-lake.jpg`** (for example a Mikkeli lake view, landscape, about 2400px wide) and restart `npm run dev`. The page then uses it instead of the drawn lake illustration. Delete the file to go back to the illustration.

## The phone frames

Screenshots are shown in `src/components/PhoneFrame.tsx`, a brand-free phone drawn in CSS. It has:
- a graphite body with a soft metal rim, a thin even bezel and side buttons
- a status bar (time, signal, wifi, battery) with a small round camera in the middle

## Sharing image

`public/og-image.png` (1200×630) is the picture shown when the link is shared. To remake it from the hero while the site runs:

```bash
npm run og
```

## Publish on GitHub Pages

1. Make this `landing-page` folder its own GitHub repository (for example `safespace-landing`) and push it to the `main` branch.
2. On GitHub, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Every push to `main` now runs `.github/workflows/deploy.yml`. Your site appears at `https://<your-user>.github.io/<repo-name>/`, and the address is shown in the Actions run.

The workflow sets Vite's `base` to `/<repo-name>/` automatically, so images and scripts load correctly on Pages. It also sets the full site address for the sharing preview.

To test a production build with a Pages-style path locally:

```bash
BASE_PATH=/safespace-landing/ npm run build
npx vite preview --base /safespace-landing/
```

In Git Bash on Windows, put `MSYS_NO_PATHCONV=1` before both commands. Otherwise Git Bash rewrites `/safespace-landing/` into a Windows path.

## Check the page

While the site runs:

```bash
npm run check
```

This opens the page at 1440px, 390px and 360px wide and checks:
- every section renders and no image is broken
- nothing scrolls sideways on phones
- every "Try the demo" button opens `PROTOTYPE_URL` in a new tab
- the mobile menu and the FAQ work

It saves full-page screenshots to `site-check/`.
