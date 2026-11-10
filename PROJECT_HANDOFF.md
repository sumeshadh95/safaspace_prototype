# SafeSpace Storage Guide: Project Handoff

This document is a complete overview for another developer or AI assistant picking up this project. It covers what was built, how it works, what decisions were made and why, how it was tested, and what is still open.

---

## 1. What this is

**SafeSpace Storage Guide** is a clickable **web app prototype** for a university demo (ICT Business Management course, Xamk). It is **not** a native Android or iOS app. It runs in the browser and looks and feels like a phone app.

- **Target user:** "Robert", an older adult (65+) who is not comfortable with technology. His phone is almost full and he is afraid to delete anything in case he loses memories.
- **Core story:** Robert's automatic cloud backup stopped in mid-2023 when he changed phones. So older files are mostly saved in the cloud, and newer files are mostly only on the phone.
- **The app's job:** help him safely see what is already saved, save the rest, remove saved files from the phone to free space, and always be able to undo or bring files back.
- **Design principles:** calm, warm and reassuring. Lots of white space, one main action per screen, large text and tap targets, icon + text together (never colour alone), no scary red alerts and no time pressure.

The visual design source is `design/SafeSpace UI.pdf` (note: the file name has a space, not an underscore). Page 1 is Home and page 2 is Results. Every other screen was designed in the same style.

---

## 2. Tech stack

| Area | Choice |
|---|---|
| Framework | React 19 + TypeScript (TS 7) |
| Build tool | Vite 8 (`@vitejs/plugin-react`) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`. Design tokens live in `@theme` in `src/index.css` |
| Icons | `lucide-react` (no emoji anywhere in the UI) |
| Font | Atkinson Hyperlegible (Google Fonts, linked in `index.html`) |
| Image processing | `sharp` (dev dependency, used only by the build scripts) |
| E2E testing | `playwright` (dev dependency, used only by `scripts/journey.mjs`) |
| Backend | **None.** The "phone" is a folder of mock files and the "cloud" is browser localStorage |
| Deploy target | Vercel or Netlify (static `dist/`) |

### npm scripts (`package.json`)

| Script | What it does |
|---|---|
| `npm run dev` | Runs `seed` first (via `predev`), then starts Vite |
| `npm run build` | Runs `seed` first (via `prebuild`), then `tsc --noEmit && vite build` |
| `npm run preview` | Serves the built `dist/` |
| `npm run seed` | `node scripts/seed-phone.mjs`: builds the mock phone and the manifest |
| `npm run photos` | `node scripts/make-mock-photos.mjs`: draws the 3 base photos if missing (`-- --force` redraws them) |
| `npm run journey` | `node scripts/journey.mjs`: full Playwright walkthrough with screenshots (the dev server must be running; set `APP_URL`) |

---

## 3. Folder structure

```
prototype/
├── design/SafeSpace UI.pdf          # Original design (page 1 Home, page 2 Results)
├── mock-source/                     # 3 base photos (committed; user can swap in own photos)
│   ├── photo-1.jpg                  # Lake at sunset (illustrated SVG -> JPG)
│   ├── photo-2.jpg                  # Garden with flowers
│   └── photo-3.jpg                  # Kitchen table with coffee cups
├── scripts/
│   ├── make-mock-photos.mjs         # Draws the 3 base photos as SVG, converts to 1200x900 JPG with sharp
│   ├── seed-phone.mjs               # Builds public/phone/ + src/data/phoneFiles.json (fixed random seed)
│   └── journey.mjs                  # Playwright end-to-end walkthrough at 390x844
├── public/
│   ├── favicon.svg
│   └── phone/                       # GENERATED (gitignored): ~145 image files + thumbs/ + .seed-stamp
├── src/
│   ├── main.tsx                     # React entry (StrictMode)
│   ├── App.tsx                      # Hash router + PhoneFrame + ActionsProvider + DemoPanel
│   ├── index.css                    # Tailwind import, @theme design tokens, keyframes, reduced-motion
│   ├── data/
│   │   ├── phoneFiles.json          # GENERATED manifest (gitignored)
│   │   └── files.ts                 # Types, FILES, FILES_BY_ID, CATEGORIES, phone size constants
│   ├── services/
│   │   └── cloud.ts                 # Fake cloud server on top of localStorage
│   ├── lib/
│   │   ├── usePhone.ts              # React hook: live derived stats (useSyncExternalStore on cloud.ts)
│   │   ├── actions.tsx              # ActionsProvider: upload/delete/bring-back flows, sheets, toast
│   │   └── format.ts                # Sizes, dates, "room for about N photos", plurals, greeting
│   ├── components/
│   │   ├── ui.tsx                   # PrimaryButton, SecondaryButton, TextButton, ProgressBar,
│   │   │                            #   StatusBadge, FileThumb, PlayBadge, SavedCheck, BackButton, TYPE_STYLE
│   │   ├── PhoneFrame.tsx           # Full screen on mobile; 390x844 phone frame on desktop
│   │   ├── Sheet.tsx                # Generic bottom sheet (dialog, Escape to close, focus handling)
│   │   ├── StorageCard.tsx          # "Phone space" card with bar + badge
│   │   ├── CategoryCard.tsx         # Photos / Videos / Documents card on Results
│   │   ├── FileRow.tsx              # One file row + SelectCircle
│   │   ├── YearGroup.tsx            # Big year heading + list
│   │   ├── FilterTabs.tsx           # All · Saved in cloud · Only on phone
│   │   ├── SelectionBar.tsx         # Sticky "3 selected · 12 MB" bar
│   │   ├── UploadSheet.tsx          # Save-to-cloud choice -> progress -> done
│   │   ├── DeleteSheet.tsx          # Remove-from-phone or calm "not saved yet" warning
│   │   ├── UndoToast.tsx            # Big bottom toast with Undo (8 s)
│   │   ├── PreviewScreen.tsx        # Large preview of one file with Upload/Delete
│   │   ├── BringBackScreen.tsx      # List of files removed from phone, "Bring back" buttons
│   │   └── DemoPanel.tsx            # Presenter tools: Reset demo, Show cloud contents
│   └── screens/
│       ├── HomeScreen.tsx           # Also exports Logo and PhoneIllustration
│       ├── ScanningScreen.tsx
│       ├── ResultsScreen.tsx
│       ├── CategoryScreen.tsx
│       └── CloudScreen.tsx         # #/cloud live gallery for a second tab (see section 15)
├── journey-screenshots/             # Output of npm run journey (gitignored)
├── index.html, vite.config.ts, tsconfig.json, .gitignore
├── README.md                        # Short user-facing guide (run, reset, own photos, deploy)
└── PROJECT_HANDOFF.md               # This file
```

The project is **not a git repository yet**. `.gitignore` is ready for when it becomes one.

---

## 4. Mock data: the "phone"

### 4.1 Base photos (`scripts/make-mock-photos.mjs`)
- Three simple flat-illustration scenes are written as inline SVG strings and converted with `sharp` to **1200x900 JPG** in `mock-source/`.
- No real people, no stock photos and no downloads.
- Existing files are **never overwritten** unless `--force` is passed, so a user's own photos are safe.
- The script exports `makeMockPhotos()`, which the seed script calls so that missing photos are drawn automatically.

### 4.2 Seed script (`scripts/seed-phone.mjs`)
- **Deterministic:** uses `mulberry32` with the fixed seed `20231108`, so the data is identical on every run and every laptop.
- **Caching:** writes `public/phone/.seed-stamp`, a SHA-1 of `SEED_VERSION` plus the bytes of the 3 base photos. If the stamp matches and the manifest exists, it skips the work ("Phone is already set up"). Changing a photo in `mock-source/` or bumping `SEED_VERSION` triggers a rebuild.
- **Output:** wipes `public/phone/` and writes these files, rotating through the 3 base images:
  - **120 photos** with realistic names: about 68% `IMG_YYYYMMDD_HHMMSS.jpg`, about 22% `WhatsApp Image YYYY-MM-DD at HH.MM.SS.jpeg`, and about 10% `Screenshot_YYYYMMDD_HHMMSS.png` (the PNGs really are PNG-encoded).
  - **25 videos:** the display name is `VID_YYYYMMDD_HHMMSS.mp4`, but the only real file is a thumbnail `VID_..._thumb.jpg`. No real video files exist; the UI draws a play icon on top.
  - **30 documents:** no files at all; the UI shows a file-type icon (PDF/DOCX/XLSX). Names come from a list of realistic templates, some date-aware (`Bank_statement_February_2018.pdf`, `Pension_letter_2018.pdf`, `Medicine_list.docx`, `Train_ticket_Helsinki.pdf`, `Recipe_karjalanpiirakka.pdf`, `Tax_decision_2021.pdf`, `Cottage_rental_Saimaa.pdf`, `Monthly_budget.xlsx`, …).
  - `public/phone/thumbs/*.jpg`: 168x168 thumbnails for every photo and video, used in lists so 120 full images don't load at once.
- **Manifest** `src/data/phoneFiles.json`: an array of
  ```ts
  { id: "p001"|"v001"|"d001", name, type: "photo"|"video"|"document",
    path: string|null,      // URL-encoded full image (photos) / thumb image (videos) / null (docs)
    thumb: string|null,     // URL-encoded small thumbnail, null for docs
    date: ISO string, sizeMB: number, initialCloud: boolean }
  ```
  `path` and `thumb` are run through `encodeURI` because WhatsApp names contain spaces.

### 4.3 Dates and initial cloud status
- Dates are spread from **1 March 2017 to 31 October 2026**, at daytime hours.
- Cutoff: **1 July 2023** (the phone change).
- For each type, the script generates exactly as many "old" dates (before the cutoff) as the target saved count, and the rest "new". It then flips a few each way so it doesn't look perfectly clean:
  - Photos: 72 old / 48 new; 4 old ones marked not saved, 4 new ones marked saved, so **72 of 120 saved**.
  - Videos: 15 old / 10 new; 2 + 2 exceptions, so **15 of 25 saved**.
  - Documents: 12 old / 18 new; 2 + 2 exceptions, so **12 of 30 saved**.
- Result: **87 photos and videos in the cloud**, which matches the design.

### 4.4 Display sizes (what the UI shows, not real file sizes)
- Ranges: photos 2–5 MB, videos 50–400 MB, documents 0.1–3 MB.
- A `fitToTotal()` helper scales random sizes to an **exact total** while keeping each value in range, rounded to 0.1 MB:
  - Photos total **420 MB**, videos total **5,600 MB (5.6 GB)** and documents total **45 MB**. These match the design cards.
  - Videos are split so that **saved photos + saved videos = exactly 3,500 MB**. 3500 ÷ 3.5 = 1,000, so the summary reads "room for about **1,000** new photos", exactly as in the design.

Verified seed output: `photo 120/72/420.0 MB`, `video 25/15/5600.0 MB`, `document 30/12/45.0 MB`, `savedMedia 3500.0 MB`.

---

## 5. The "cloud": `src/services/cloud.ts`

A small module that pretends to be a cloud server.

### localStorage keys (ids and timestamps only, never image data)
- `safespace.cloud`: `[{ id, uploadedAt }]`, the files saved in the cloud.
- `safespace.phone`: `[{ id, removedAt }]`, the files removed from the phone.

### Behaviour
- **First load:** if either key is missing, it seeds from `initialCloud` in the manifest (with `uploadedAt` set to the file's own date) and writes both keys.
- **All localStorage access is wrapped in try/catch.** If storage is blocked or full, it keeps working from in-memory `Map`s.
- An in-memory `version` counter and a listener set back `useSyncExternalStore`.

### File states (derived, never stored directly)
| State | In cloud? | On phone? |
|---|---|---|
| `phone-only` ("Only on phone") | no | yes |
| `phone-and-cloud` ("Saved in cloud") | yes | yes |
| `cloud-only` (removed from phone, can be brought back) | yes | no |
| `deleted` (gone) | no | no |

### API
- `getStatus(id)`, `getRemovedAt(id)`, `getCloudContents()`
- `upload(ids, onProgress?)` is async. It takes about **1.5 s** and reports progress 0→1 every 50 ms, then adds the ids to the cloud.
- `removeFromPhone(ids)`, `restoreToPhone(ids)`
- `deletePermanently(ids)` removes the files from the cloud and marks them removed from the phone, which makes them `deleted`.
- `snapshot(ids)` / `restoreSnapshot(snap)` record and restore the exact before-state of some files. **Undo** uses this pair.
- `resetDemo()` clears both keys and re-seeds from the manifest.
- `subscribe(listener)`, `getVersion()` (for React).

---

## 6. Derived state: `src/lib/usePhone.ts`

`usePhone()` re-renders on any cloud change and returns:
- `statusOf(id)`
- `categories[type]` = `{ files (on phone only), saved, phoneOnly, sizeMB }`
- `usedMB = 61,000 − (display size of all files no longer on the phone)` and `totalMB = 64,000`. It uses **1 GB = 1,000 MB** consistently, so 5,600 MB shows as "5.6 GB".
- `mediaInCloud`: photos and videos in the cloud, including ones removed from the phone (the "87 … are safe in your cloud" headline).
- `removableMB`: size of photos and videos that are saved **and** still on the phone (drives "room for about N new photos").
- `removedFiles`: `cloud-only` files sorted newest-removed first (for Bring back).

**Design decision:** category cards and the category list count **only files currently on the phone**. Removed files live on the Bring back screen. Deleted files disappear everywhere.

---

## 7. Formatting rules: `src/lib/format.ts`
- `formatSize`: under 100 MB shows one decimal ("3.4 MB"); 100–999 MB shows a whole number ("420 MB"); 1,000 MB and above shows GB with one decimal ("5.6 GB").
- `formatDate`: `en-GB` long form, e.g. "12 June 2019".
- `roomForPhotos(mb) = mb ÷ 3.5`, rounded to the nearest **100** when the result is 100 or more. Small amounts round to the nearest 10, or to the exact number below 10, so a 12 MB removal doesn't say "about 0".
- `freedText(mb)`: "You freed 1.4 GB — room for about 400 new photos".
- `countText(files)`: "3 photos", "1 video", or "4 files" for a mix of types.
- `greeting()`: Good morning (before 12), Good afternoon (before 18), otherwise Good evening.

---

## 8. Navigation: `src/App.tsx`
- A simple **hash router**, so a refresh keeps the current screen: `#/` (or no hash) is the **phone's own home screen** (`src/screens/Launcher.tsx`), `#/home` is SafeSpace's Home, then `#/scan`, `#/results`, `#/photos`, `#/videos`, `#/documents`, `#/bring-back`.
- `#/scan` replaces itself with `#/results` when the scan finishes, so Back doesn't return to the scan.
- The scroll position resets to the top on route change.
- Layout: `PhoneFrame` > `ActionsProvider` > `<main>` (the scrolling area) + `DemoPanel`.
- `PhoneFrame` has `transform: translateZ(0)`, which makes `position: fixed` children (the preview) stick to the **frame** instead of the browser window in desktop mode.
- On a short laptop/projector screen the whole drawn phone shrinks to fit (CSS `zoom`, worked out from the window size), so the 390×844 screen is never cut off and "Check my phone" is always visible.

---

## 9. Screens and flows (all built)

### 1. Home (`HomeScreen.tsx`), matched to PDF page 1
Logo (green shield tile + "SafeSpace") → a phone-with-shield illustration (custom inline SVG on a 148px light-blue circle) → time-based greeting "Good …, Robert" → "Your phone is almost full. Let's check your photos and files safely." → `StorageCard` → the "Check my phone" primary button (search icon) → "Nothing is deleted without asking you" (shield icon). A tiny grey **Demo** link sits in the bottom-right corner.
- `StorageCard` shows the badge **"Almost full"** (orange) only while less than 5 GB is free (`isAlmostFull`, also used for the Home greeting line), otherwise **"Space OK"** (green with an icon). The bar is orange when full, green otherwise. It shows "61 GB of 64 GB used", which updates live.

### 2. Scanning (`ScanningScreen.tsx`)
A pulse animation of two expanding rings (no spinning), "Looking at your photos and files…", "Nothing will be deleted." and a progress bar. It moves on automatically after **3 s**.

### 3. Results (`ResultsScreen.tsx`), matched to PDF page 2
- Green check circle + "Check complete".
- Green summary panel: "**87** photos and videos are safe in your cloud", then "You can remove them from your phone to make room for **about 1,000 new photos**." All numbers are live. If only some are still removable it says "remove 84 of them"; if none are, it says they are already off the phone.
- "Tap a box to see your files", then 3 `CategoryCard`s (icon tile, name, size, count, saved-vs-not bar, "✓ 72 of 120 saved in cloud", chevron).
- "Bring back removed files" outline button, then a `StorageCard`, so live storage feedback is visible here too.
- The screen scrolls fully. The cut-off button from the design is fixed and the whole page is visible on 390x844.

### 4. Category list (`CategoryScreen.tsx`)
- A sticky "← Back" row, then the title, the info line "72 saved in cloud · 48 only on this phone" and `FilterTabs` (All · Saved in cloud · Only on phone). Changing the filter clears the selection.
- "Select all (N)" selects everything in the current filter.
- Files are sorted **oldest to newest** and grouped by year with big headings ("2017  7 files").
- `FileRow`: a 28px select circle (48px tap area) → a 56px thumbnail (videos get a play icon; documents get a type icon with PDF/DOCX/XLSX) → the name (truncated with …), the date, the size and a status badge (green "Saved in cloud" with a cloud-check icon, or orange "Only on phone" with a phone icon) → two stacked buttons with a 12px gap: **Upload** (blue, cloud-up icon) or a disabled "**Saved ✓**", and **Delete** (muted red outline, trash icon).
- Tapping the row body opens **PreviewScreen**: a large 4:3 image (or a big document icon), the full name, date, size, badge and the same Upload/Delete actions.
- **SelectionBar** (sticky bottom) shows "3 selected · 9.5 MB" + Upload / Delete / Cancel. Upload turns into a disabled "All saved" when every selected file is already saved.

### 5. Upload sheet (`UploadSheet.tsx`)
Title "Save to cloud" + "3 photos · 9.5 MB", then two large, clearly different choices:
- "Save to cloud and keep on phone" (white card, blue outline, phone icon)
- "Save to cloud and remove from phone" (solid blue, cloud icon) + "Frees up 9.5 MB. You can bring them back anytime."
- A "Cancel" text button.

It then shows a progress bar ("Saving 3 photos…"; only files not yet saved are uploaded), then "**Done!** 3 photos are now safe in your cloud." (+ the freed-space line if they were removed) and an OK button. When the sheet closes after a removal, the Undo toast appears. A `started` ref guards against React StrictMode double-starting the auto upload.

### 6. Delete sheet (`DeleteSheet.tsx`)
- **All selected files are saved:** "Remove from phone?" / "It stays (These N photos stay) safe in your cloud. You can bring it/them back anytime." The main button is "Remove from phone" (blue, because this is the safe action), plus Cancel.
- **Any file is not saved:** a calm orange info icon, "Not saved yet", and the message:
  - 1 file: "This photo is only on your phone. If you delete it, it may be gone."
  - All unsaved: "2 of these are only on your phone. If you delete them, they may be gone."
  - Mixed: "1 is safe in your cloud. 2 of these are only on your phone. If you delete them, they may be gone."
  - The main blue button is "**Save to cloud first**". It goes straight to the upload progress with "remove" pre-chosen. "**Delete anyway**" is a smaller muted-red outline button, and "Cancel" is a text button.
  - Delete anyway removes the saved files from the phone and permanently deletes the unsaved ones.

### 7. Undo and Bring back
- `UndoToast`: a large dark toast at the bottom showing the title (e.g. "3 photos removed from phone" / "2 photos deleted"), the detail line "You freed 9.5 MB — room for about 3 new photos" and a big full-width white **Undo** button. It lasts **8 s**; toasts without Undo ("3 photos are back on your phone") last 5 s. Undo calls `restoreSnapshot`.
- `BringBackScreen`: removed files sorted newest-removed first, each with thumbnail, name, date · size, "Removed 3 November 2026" and a "**Bring back to phone**" button. "**Bring back all (N)**" sits at the top. When the list is empty it says "Nothing to bring back".

### 8. Live feedback
Every action immediately updates the storage bar, cards, summary and list counts (all derived from `usePhone`), and the result is shown in plain words in the toast or the done sheet.

### Presenter tools (`DemoPanel.tsx`)
The tiny "Demo" link on Home opens a sheet with **Reset demo** (clears both keys, re-seeds and goes Home) and **Show cloud contents** (a table of id / file name / uploadedAt from `safespace.cloud`, newest first, with a total count).

---

## 10. Design tokens (in `src/index.css`, `@theme`)
- Background `#F6F8F7`; cards `#FFFFFF` with radius 22px and shadow `0 1px 2px rgba(23,38,42,.06), 0 8px 24px rgba(23,38,42,.05)`
- Text `#17262A` (`ink`), secondary text `#3C4B4F` (`ink-2`)
- Blue `#2448A8` (dark `#1B3889` on hover, soft `#E6EEF9`)
- Green `#1E6B46` (text), `#2E8B5A` (fill), `#E4F1E9` (soft)
- Orange `#D97A1E` (bar), `#FCEBD9` (badge background), `#8A4208` (badge text)
- Red `#A63A2B` (muted, outline or text only), soft `#F8E9E6`
- Violet tile `#EFE9F8` / `#5B3FA0`; "not saved" bar track `#F3E3D2`
- Main button: 68px tall, radius 20px, 22px bold text. Body text is generally 18–20px and headings 28–32px. Tap targets are at least 48px.
- **Exceptions to "body text at least 18px"** (made to fit 390px): file row meta 16–17px, status badges 14px, filter tabs 16px, the Demo link 12px (presenter-only) and the demo table 13px.

### Accessibility and motion
- Sheets and the preview use `role="dialog"` + `aria-modal`, Escape closes them, and focus moves into them and returns afterwards.
- Select circles use `role="checkbox"` + `aria-checked`. Progress bars and meters have ARIA values. Toasts are `role="status"` with `aria-live`.
- A `:focus-visible` outline appears in blue.
- `@media (prefers-reduced-motion: reduce)` turns off all animations and transitions. Progress still advances.
- **Wording rules are followed:** never "cache / sync / local storage / server / API / backup job / metadata" in the UI. The UI always says "on your phone", "saved in cloud", "remove from phone" and "bring back".

---

## 11. Bugs found and fixed during testing
1. **An unlayered `button { font: inherit }` rule overrode Tailwind v4 utilities** (Tailwind v4 puts utilities in CSS layers, and unlayered CSS wins). As a result, buttons lost their bold and size classes. Fixed by moving the base button rule into `@layer base`. **Watch for this when adding global CSS.**
2. "Good afternoon, Robert" wrapped onto two lines at 32px → the heading is now 30px with slight negative tracking, and fits on one line.
3. The "Only on phone" badge wrapped inside narrow rows → badges are now 14px, `whitespace-nowrap`, with tighter padding. Row action buttons are 92px wide.
4. The sticky category header took about 200px of the screen → now only the Back row is sticky.
5. The toast title was squeezed by the Undo button → the toast now stacks, with Undo as a full-width button below the text.
6. The toast covered the preview's Upload/Delete buttons → the preview and list now have extra bottom padding so content can scroll above the toast.
7. The scan pulse rings had the same colour as the circle → the rings are now `#C9D8F0`.
8. The "Demo" link was clipped by the rounded frame corner on desktop → moved inward (`right-9`).
9. The preview had to sit relative to the frame rather than the long scroll list → it uses `position: fixed` with the frame's `translateZ(0)` containing block.
10. Sheets re-ran their focus effect on every render because `onClose` was a new function each time → it is now stored in a ref.

---

## 12. Testing: `scripts/journey.mjs` (Playwright)

Runs at **390x844, deviceScaleFactor 2**, starts with cleared localStorage, and asserts text at each step:

Home (61 GB, "Almost full") → Check my phone → scanning → Results ("87 … safe", "about 1,000 new photos", 72/120, 15/25, 12/30; Bring back is reachable by scrolling) → Photos ("72 saved in cloud · 48 only on this phone") → filter "Only on phone" → select 3 → Upload → "Save to cloud and remove from phone" → progress → "Done! 3 photos are now safe in your cloud." → OK → toast "3 photos removed from phone" (72 · 45) → **Undo** (75 · 45) → delete a cloud-saved photo → "Remove from phone?" → toast (74 · 45) → delete an unsaved photo shows "This photo is only on your phone…" → Cancel → open the preview → Back → Results → Bring back → "Bring back to phone" → "Nothing to bring back" → remove one more → **page reload: the state persists** (74 · 45, and `safespace.cloud` has 102 entries) → Home → Demo → Show cloud contents → **Reset demo** → 61 GB, 87, 72/120 again → desktop 1280x900 frame screenshot.

- **Result:** passes end to end, with no console errors and no page errors.
- 21 screenshots are saved in `journey-screenshots/`, from `01-home.png` to `21-desktop-frame.png`.
- Home and Results screenshots were compared visually with the PDF and adjusted (spacing, sizes, colours and wording match closely).
- `npm run build` passes (`tsc --noEmit` is clean). The bundle is about 306 KB JS (89 KB gzipped) and 25 KB CSS.
- Port note: on the original machine, port 5173 was taken by another app, so testing used `npx vite --port 5199` with `APP_URL=http://localhost:5199/`.
- The Playwright Chromium download had network trouble at first. The script falls back to `channel: 'msedge'` if bundled Chromium can't launch.

---

## 13. Known limitations and ideas for later
- The greeting uses the presenter's local clock ("Good afternoon" during a daytime demo, not always "Good morning" as in the PDF).
- Storage only drops by the display size of the mock files (about 6 GB in total), so "Space OK" appears once more than 5 GB is free (under 59 GB used), about 2 GB of removals in.
- Only 3 base images are reused across 145 files, which is visually repetitive but intended.
- Removed files are not shown in the category list (only in Bring back).
- Changing the filter clears the current selection (a deliberate choice to avoid hidden selected items).
- Both the preview and an open sheet listen for Escape, so Escape closes both at once.
- No unit tests; only the Playwright journey.
- Not a git repository yet. Nothing has been deployed.
- Out of scope by design: native app, login, payments, family shared view, real device file access, real cloud and notifications.

## 14. Quick commands
```bash
npm install
npm run dev                         # seed + dev server
npm run build && npm run preview    # production check
npm run seed                        # rebuild mock phone after changing mock-source/
npm run journey                     # full E2E walkthrough with screenshots (expects http://localhost:5288/)
node scripts/cloud-tabs.mjs         # two-tab live cloud check
```

---

## 15. Update: live Cloud view in a second tab (added after the first handoff)

- **Why:** the user wanted to show the audience the "cloud" in one tab while the app uploads in another. The cloud is **not a folder**. It is localStorage, which tabs of the same origin share.
- **Route `#/cloud`** → `src/screens/CloudScreen.tsx`. It renders **without** the phone frame (`App.tsx` returns it early) because it is meant for a laptop tab. It shows "Robert's cloud", a Live indicator, stats (files in cloud + total size, photos, videos, documents), an "Arriving now: 3 photos · 45%" banner with a progress bar and incoming thumbnails during an upload, and a gallery sorted newest uploaded first, with a filter (All/Photos/Videos/Documents). Cards uploaded in the last 10 minutes get a blue ring and a "New" tag. Each card shows "Saved just now / date", the size, and "Also on phone" or "Removed from phone". Full images (`file.path`) are lazy-loaded.
- **`cloud.ts` changes:**
  - A new key **`safespace.uploading`** = `{ ids, progress }` is written on every upload tick and removed when the upload finishes or on `resetDemo()`. `getUploading()` exposes it.
  - A `window.addEventListener('storage', …)` handler reloads the cloud and phone maps (or the uploading state) when **another tab** changes them, then notifies React **without writing back**, which avoids loops. It ignores the moment during a reset when a key is temporarily missing.
  - The shared `notify()` helper bumps the version and calls listeners.
- **Demo panel:** a new primary link "**Open cloud in new tab**" (`href="#/cloud"`, `target="_blank"`).
- **Test:** `scripts/cloud-tabs.mjs` opens two pages in one browser context (app at 390x844, cloud at 1280x860), uploads 3 "only on phone" photos with "keep on phone", and asserts that the cloud tab shows "Arriving now: 3 photos" during the upload, "3 just arrived" afterwards, and that the count goes **99 → 102**. **Result: passed.** Screenshots `journey-screenshots/cloud-1-before.png`, `cloud-2-arriving.png` and `cloud-3-arrived.png`. Run it with `node scripts/cloud-tabs.mjs` while the dev server runs.
- **The full journey (`npm run journey`) and `npm run build` still pass** after this change.
- **Visible cloud buttons (added after user feedback that the cloud link was hard to find):**
  - A `CloudLink` component (`ui.tsx`) renders a green outlined link with cloud and external-link icons. It points to `href="#/cloud"` with `target="_blank"`.
  - Placed as **"My cloud"** at the top right of Home (next to the logo) and as a full-width **"See my cloud"** inside the green summary panel on Results.
  - `CloudScreen` has an "Open the app" link back to `#/`.
  - `cloud-tabs.mjs` clicks both buttons and checks that each opens the cloud in a new tab.
- **Port:** port 5173 is taken by another program on the demo laptop, so `vite.config.ts` sets `server.port = 5288` and `preview.port = 5289`, both with `strictPort: false`, so Vite falls forward to a free port instead of crashing. Both test scripts default to `http://localhost:5288/` (override with `APP_URL`).
- **Caveats:**
  - The upload takes only about 1.5 s, so the "Arriving now" banner is brief.
  - A private window or a different browser has its own separate cloud. The two tabs must be in the same browser profile.

---

## 16. Landing page (`landing-page/` folder, a separate Vite project)

**Purpose:** the landing page communicates the promise. Its "Try the demo" buttons open the prototype, which demonstrates the experience. It is a separate app with its own `package.json`, intended to be its **own GitHub repository**, deployed to GitHub Pages.

**Stack:** Vite 8 + React 19 + TypeScript + Tailwind v4 + lucide-react. The tokens in `src/index.css` are the same as the prototype (plus navy `#14244F` and blue hover `#1A3580`). Fonts are Atkinson Hyperlegible, plus Caveat for "Made in Mikkeli" only, subset to those letters via `text=`. The dev server runs on port **5310** and `vite preview` on 5311 (both with `strictPort: false`).

### Key files
- `src/config.ts`:
  - `PROTOTYPE_URL`, currently `http://localhost:5288/`. **Must be changed to the deployed prototype URL before publishing.**
  - `TEAM_EMAIL` (placeholder `[TEAM_EMAIL]`) and `PARTNER_MAILTO`.
- `src/content.ts`:
  - all copy: nav, hero, features, problem, howItWorks, screenshots (file names + alt text), showcase, safety, organisations, `stories` (persona array for future real quotes), faq, finalCta, footer
  - the placeholders `TEAM_NAMES = '[NAMES]'` and `PRICE = '[PRICE]'`
- `src/components/`:
  - `ui.tsx`: `DemoButton` (always `target="_blank"`, `data-cta="demo"`), `HowItWorksButton`, `Logo`, `SectionTitle`, `Container` (max 1200px), `Reveal` (IntersectionObserver fade-up), `TILE` colours
  - `PhoneFrame.tsx`: a generic CSS phone with a `<picture>` (WebP + PNG fallback), alt text from content, lazy by default
  - `Header.tsx`: sticky; border appears on scroll; desktop nav; mobile hamburger panel whose links close the menu and then smooth-scroll
  - `Hero.tsx` + `LakeIllustration.tsx`: an SVG golden-hour lake. Uses `public/images/hero-lake.jpg` instead if it exists (build-time flag `__HERO_PHOTO__` defined in `vite.config.ts`)
  - `Sections.tsx`: Features, Problem, HowItWorks, Showcase, Safety, Organisations, FinalCta
  - `StepArt.tsx`: the three decorative drawings in "How it works" (plain HTML + lucide icons, no images)
  - `Persona.tsx`: Robert, 72, labelled "Our user persona", with the line-art Mikkeli skyline SVG
  - `Faq.tsx`: an accordion using `aria-expanded`, `aria-controls` and a region
  - `Footer.tsx`
- `src/entry-server.tsx` + `scripts/prerender.mjs`: `npm run build` pre-renders the page HTML into `dist/index.html` (`<!--app-->` placeholder). `main.tsx` hydrates when HTML is present and creates the root in dev.
- `scripts/capture-screenshots.mjs` (`npm run screenshots`): Playwright at 390×844 @2x against `PROTOTYPE_URL`. It resets the demo, captures the 6 PNGs, logs and skips any step whose button can't be found, and resets again at the end.
- `scripts/make-webp.mjs`: runs before dev/build and makes WebP copies of the PNGs that are new or changed.
- `scripts/capture-og.mjs` (`npm run og`): captures the hero at 1440×756 and scales it with sharp to a 1200×630 `public/og-image.png`.
- `scripts/check-site.mjs` (`npm run check`):
  - runs at 1440, 390 and 360 widths
  - checks that sections exist, there is exactly one h1, no images are broken, every image has alt text, and nothing overflows horizontally
  - checks every `data-cta="demo"` link points to `PROTOTYPE_URL` with `_blank`, by actually clicking one
  - checks the mobile menu scrolls to Safety, the FAQ opens, and no section block stays hidden
  - saves full-page screenshots to `site-check/`
- `.github/workflows/deploy.yml`:
  - builds on push to main with `BASE_PATH=/<repo>/` and `VITE_SITE_URL=https://<owner>.github.io/<repo>/`
  - uploads `dist` and deploys with `actions/deploy-pages@v4`
  - In the repo, set Settings → Pages → Source to **GitHub Actions**.
- `index.html`: the title and meta description, Open Graph and Twitter tags (`%VITE_SITE_URL%og-image.png`), the favicon via `%BASE_URL%`, non-blocking font loading, and a `<noscript>` rule that shows `.reveal` blocks when JavaScript is off.

### Verified
- Screenshots were captured from the running prototype, and all 6 succeeded.
- `npm run check` passes on both the dev server and the production build served under `/safespace-landing/`:
  - 6 images, 4 demo links, 1 h1 and 0px horizontal overflow at 1440, 390 and 360
  - demo links open `http://localhost:5288/`
- Lighthouse on the production build:
  - desktop: Performance 95–98, Accessibility 100, Best Practices 100, SEO 100
  - mobile: Performance 89–91 (noisy across runs on the local laptop), and 100 for the other three

### Fixes made during testing
- The mobile header was too wide at 390px and 360px: the logo and button are smaller there, and the arrow is hidden under 400px.
- The mobile menu jumped to the wrong spot: it now closes first, then scrolls.
- Reveal used a negative rootMargin, so blocks at the very bottom could stay hidden: it now uses a threshold, and also reveals blocks that are already on screen at load or have been scrolled past.
- The showcase carousel fades in as one block, so off-screen phones aren't left hidden.
- Hero chips overlapped the screenshot: they are moved, and hidden under 640px.
- "Made in Mikkeli" overlapped the spire: it is now below the skyline.
- Google Fonts blocked the first paint: the stylesheet now loads with `rel="preload"` + `onload`.
- Added build-time pre-rendering.
- I tried `content-visibility: auto` and removed it, because it made full-page screenshots blank below the hero.

### Open items
- Replace `PROTOTYPE_URL` (the prototype is not deployed yet), `[TEAM_EMAIL]`, `[NAMES]` and `[PRICE]`.
- Neither project is a git repository yet, and nothing is pushed or deployed.
- The hero greeting in the screenshots says "Good afternoon" (the prototype follows the clock).

### 16b. Visual polish pass (after user feedback: "make it more beautiful", "the camera cutout looks messed up")
- **PhoneFrame redesigned:**
  - The old dark tab "notch" hanging into the screen is gone.
  - It is now a graphite body (gradient plus inset rim highlight), with side buttons, a thin even bezel and layered drop shadows. An optional `floorShadow` adds a shadow under the phone.
  - A status bar ("10:24", signal, wifi and battery SVG) with a small round punch-hole camera sits above the screenshot.
  - The status bar colour comes from `src/generated/screenshots.json`, written by `scripts/prepare-screenshots.mjs` (renamed from make-webp.mjs; `npm run images`). The script averages the top 3 pixel rows of each PNG.
  - Note: sharp's `stats()` ignores `extract()`, so the script reads the raw pixels instead.
- **Screenshots** are recaptured with `page.clock.setFixedTime(2026-11-03 09:30)`, so Home shows "Good morning, Robert" like the design PDF.
- **Hero:**
  - New eyebrow line: "For older adults and the families who help them".
  - The headline is split: the first sentence is a balanced block, then "Keep every memory." on its own line with a green highlighter stroke (`.highlight`, an SVG background with `box-decoration-break: clone`).
  - Buttons have a soft shadow, lift on hover, and the arrow nudges.
  - The two floating notes are now an icon tile plus two lines (text in `content.ts` → `hero.chips`).
  - A warm white glow sits behind the phones.
- **LakeIllustration redrawn:**
  - hazy hills, a forest line, a low sun with its path on the water, and islands with reflections
  - a red cottage with a lit window, a jetty, a rowing boat, tall tiered pines and a birch on the near shore
  - On phones the scene is anchored bottom-right behind the product picture (fixed-size box, `max-w-none`). On desktop it fills the hero, with the left wash.
- **Header:**
  - frosted glass once you scroll (`bg-white/90` + `backdrop-blur`)
  - scrollspy underline on the current section (`aria-current`)
  - Globe "EN" pill, and a "Try the demo" button inside the mobile menu
- **Sections:**
  - Eyebrow labels and subtitles (`content.ts`), and h2s at 34/44px.
  - Feature cards lift on hover.
  - "Sound familiar?" shows the worries as speech bubbles with tails.
  - How it works: three cards, each with a small drawing of that part of the app (`StepArt.tsx`: the phone with ripples and the "Check my phone" button; photos marked "Saved in cloud" / "Only on phone"; the save choices and the "You freed 3.5 GB" message with Undo), a coloured "Step N" label, and round arrows between the cards on desktop. "Try it yourself" sits under the cards.
  - The showcase is a soft blue stage with rings, the middle phone raised, and caption icons. On phones it is a scroll-snap carousel with dot buttons (IntersectionObserver on the scroller).
  - Safety: a round green glow behind the phone, an "Always asks first" note on the phone's corner, and the three promises as soft cards.
  - The organisations panel has a gradient and decorative rings.
  - Persona: a quote-icon tile, plus a more detailed Mikkeli skyline (Naisvuori tower, cathedral spire, birch, sailboat).
  - FAQ is two columns: the title plus a "Still wondering?" email card (after the questions on phones). Answers open smoothly (grid-rows transition; closed answers are `invisible`, so they aren't read aloud) with a plus that turns into an ×.
  - The final CTA band has light glows, lake waves and the three ticks.
  - The footer has column headings, a faint lake line and "Back to top".
- **Config:** `CONTACT_MAILTO` was added for general questions (the FAQ and footer); `PARTNER_MAILTO` stays for "Partner with us".
- **Build:**
  - `scripts/prerender.mjs` now also inlines the CSS file into `dist/index.html` (one less render-blocking request).
  - `public/robots.txt` was added.
  - `capture-og.mjs` waits only for the hero images (waiting on lazy images hung it).
- **Verified:**
  - `npm run check` passes on dev and on the production build under `/safespace-landing/` (1440, 390, 360).
  - Lighthouse on the production build:
    - mobile: Performance 90–92, Accessibility 100, Best Practices 100, SEO 100
    - desktop: Performance 99, and 100 for the other three
  - Pitfall: make sure port 5311 is really serving `vite preview`. A stray dev server there gives bogus Lighthouse numbers (26 s first paint).

---

## 17. App update: visual polish, dark mode and power saving (prototype)

**Requested by the user:**
- make the app look more beautiful and in line with the landing page
- add a light/dark mode button
- add a power-saving mode like the "ultra power saving" modes on Android phones: black background, only the most important apps, big icons. The design is our own, not a copy of any brand's screen.

### Theme system (`src/index.css`)
- All colours are Tailwind v4 `@theme` tokens. `:root[data-theme='dark']` overrides every token (unlayered, so it wins).
- New tokens:
  - `primary` / `primary-hover` are filled buttons (white text), separate from `blue`, which is used for text, icons and outlines. This is needed because dark mode uses a light blue for text but a mid blue for fills.
  - `success` is the filled check circle.
  - `card-2` is for inset surfaces such as tab tracks.
  - `outline` is the neutral button border.
  - `toast`, `scrim`, `desk` (page background around the phone frame) and `sky`.
- Every hard-coded `bg-white` and hex colour in the components was replaced with tokens. The power-saving screens deliberately use fixed black/grey hex colours.
- `.glow-primary` adds a soft coloured shadow under the main buttons, using `color-mix` with `--color-primary`.

### Settings store (`src/lib/settings.ts`)
- `safespace.theme` ('light'/'dark') and `safespace.powerSaving` ('true'), with try/catch and a `storage` listener (other tabs follow).
- Exposes `useSettings()`, `setTheme`, `setPowerSaving` and `resetSettings` (called by Demo → Reset demo).
- `BATTERY` holds the mock battery: 64%, about 14 hours normally, about 3 days with power saving.
- `index.html` has an inline script that applies the theme before the first paint.
- `App.tsx` sets `document.documentElement.dataset.theme` and the `theme-color` meta. The effective theme is dark while power saving is on (the cloud tab ignores power saving).

### Phone frame (`src/components/PhoneFrame.tsx` + `StatusBar.tsx`)
- On desktop (sm+), the frame matches the landing page's drawn phone: graphite gradient body, rim highlight, side buttons and an 11px bezel.
- A 36px status bar shows the live time (`useNow`), a punch-hole camera, signal, wifi and battery 64%. It is black in power saving, with a green battery fill.
- On a real phone it stays full-screen with no fake status bar.
- The app area below the status bar carries the `translateZ(0)` transform, so `position: fixed` overlays stay inside the screen. `Sheet` now uses `fixed inset-0`.

### Visual polish
- **Home:**
  - Quick settings tiles, the phone illustration in a gradient circle with two "ripple" rings, and tighter spacing so Home fits a 1440×900 laptop screen.
  - The storage card has a phone icon and a gradient bar.
- **Scanning:** shows a checklist (Photos / Videos / Documents: Waiting → Looking… → ✓ count) as the bar fills.
- **Results:** the check circle has a halo, the summary panel has a soft gradient, and the category cards have a chevron in a circle and a thicker bar.
- **Lists:**
  - Year headings with a divider line.
  - Rows with a shadow; selected rows get a blue ring.
  - A frosted selection bar.

### Quick settings (`src/components/QuickSettings.tsx`)
- **Dark mode** is a `role="switch"` (`aria-checked`). It is disabled while power saving is on.
- **Power saving** has `aria-pressed` and `aria-haspopup="dialog"` when off. Its visual On/Off pills are `aria-hidden`, so the accessible names stay "Dark mode" and "Power saving".
- The confirm sheet compares about 14 hours now with about 3 days with power saving.

### Power saving (`src/screens/PowerSaving.tsx`)
- `SaverView` is one of home, phone, messages, contacts, camera, photos, safespace (state lives in App and is not persisted). The on/off state is persisted.
- **Home:** date, big clock, battery, six 118px tiles (icon circle in the app's colour plus a 20px label) and a "Turn off power saving" button.
- **Phone:** 76px keypad buttons with digit grouping ("040 123 4567"), a call button and backspace.
- **Calling screen:** "This is a demo. No real call is made." and a red End call button.
- **Contacts:** four made-up people with one-tap call buttons.
- **Messages:** three static demo messages.
- **Camera:** viewfinder with a grid over a mock photo. The shutter flashes (skipped with reduced motion) and says "Demo: no photo is saved."
- **Photos:** the 10 newest on-phone photos in two large columns.
- **SafeSpace:** opens the normal app in dark mode, with `SaverBanner` ("Power saving is on" + "Simple home").

### The phone's home screen and the power saving takeover (added after peer feedback)
Testers could not tell the phone's power saving screens from SafeSpace, so the demo now makes the phone itself visible:
- **`src/screens/Launcher.tsx`**: an Android-style home screen (clock and date, 8 app icons, a 4-icon dock, dark abstract wallpaper). It is the start screen (`#/`). Only **SafeSpace** opens; other icons show "Only SafeSpace works in this demo". SafeSpace grows out of its icon (`.app-open`, transform-origin from the icon), with the home screen kept behind it for 450 ms. `PhoneFrame` gets `fullBleed` (wallpaper behind a transparent status bar, `StatusBar tone="clear"`).
- **`src/lib/system.ts`**: `switchPowerSaving(on, onSwitched?)` replaces direct `setPowerSaving` calls. It plays a 2.6 s takeover (`TAKEOVER`: switch at 1.1 s while the screen is dark, "on/off" text at 1.6 s). `useTakeover()` gives the running takeover.
- **`src/components/SystemTakeover.tsx`**: the phone's panel slides down from the top (time, battery, "Power saving mode", "Turning on…" then "Power saving is on", a progress bar, "SafeSpace will close. Your phone will show only the most important apps."). Behind it the screen goes black and the closing screen shrinks away (`.app-close`). Rendered through `PhoneFrame`'s `overlay`, so it also covers the status bar. With reduced motion it shows still, on black.
- Turning power saving **off** from its home screen returns to the phone's home screen; turning it off from inside SafeSpace keeps SafeSpace open.
- The phone's own screens (home screen, takeover, power saving, `SaverBanner`, status bar) use **Roboto** (`font-system`, loaded with Atkinson from Google Fonts); SafeSpace keeps Atkinson Hyperlegible.
- The SafeSpace confirm sheet now says "This is your phone's own setting. SafeSpace will close, …".
- Reset demo returns to the phone's home screen. `journey.mjs`, `cloud-tabs.mjs` and the landing `capture-screenshots.mjs` open SafeSpace at `#/home`.
- **Dark mode while power saving is on** (`QuickSettings.tsx`): the switch is `aria-disabled`, grey (`bg-card-2`) with a crossed-out moon (`MoonOff`: lucide Moon plus a backslash line, with a gap in the `--cut` colour behind it). The Home tile drops its On/Off pill and shows "Not available in power saving"; the Results pill shows the crossed moon, and a tap shows "Dark mode is not available in power saving. The screen stays dark to save battery." The journey checks it can't be changed.

- **Bigger tick areas** (`FileRow.tsx`, `CategoryScreen.tsx`): `SelectCircle` is now the whole tap target. On a file row it is the full-height strip on the left of the card (56px wide, `-my-2.5 self-stretch`); "Select all (n)" wraps its words inside the button (full width), so tapping the words works and its accessible name is "Select all (n)".

### Landing page polish (same round)
- **Why SafeSpace** cards: gradient icon tiles with a soft coloured glow, a colour line along the top and a large faint icon in the corner (`FEATURE_LOOKS` in `Sections.tsx`).
- **Sound familiar?**: speech bubbles in soft orange/violet/blue, gently tilted on wider screens, with a large faint quote mark; the answer is now a card with a "See how it works" link (`problem.link`).
- **Hero**: a hint under the buttons (`hero.demoHint`): "The demo opens on a phone's home screen. Tap the green SafeSpace icon to start."
- The showcase carousel (`ul` "App screens") is keyboard-focusable (`tabIndex={0}`), so axe reports no issues at 390, 768 and 1280.

### Landing page: seniors-first pass (design brief)
- **Order**: Hero → Sound familiar? → Why SafeSpace → How it works → Inside the app → Safety → **For families** (new) → For organisations → Robert's story → FAQ → Final CTA → Footer.
- **For families** (`Families` in `Sections.tsx`, `families` in `content.ts`, `#families`, warm cream background): "Helping a parent with their phone?", three tip cards (Try the demo together · Show them Undo · Let them lead), a "Try the demo together" button (`DemoButton` now takes a `label`), and a small drawn phone on its home screen with the SafeSpace icon pointed out ("Look for the green SafeSpace icon", anchored to the icon so it fits at every width).
- **Header**: the full menu shows from 1280px (`xl`) so it never wraps; below that a bordered **Menu** button with a visible label (aria-label "Open menu"/"Close menu"). On phones (<640px) the bar holds only the logo and Menu (the hero's "Try the demo" is right below); the static "EN" pill was removed (it looked like a button but did nothing).
- **Targets**: every link and button is at least 48×48 (header logo link, nav, footer links, carousel dots). Tagline text 14 → 15px. Hero top padding on phones 48 → 32px so "Try the demo" is in the first screen even at 320×700.
- **FAQ**: added "Can my family help me get started?" and "Is my information private?" (the demo uses made-up photos; nothing from the visitor's phone is used or sent).
- **Font**: Atkinson Hyperlegible is self-hosted in `public/fonts` (400 + 700 woff2 from @fontsource 5.3.0, OFL licence included) and preloaded in `index.html`; Caveat still comes from Google Fonts. This removed an intermittent layout shift of the hero landscape (Lighthouse CLS 0.44 → 0).
- `scripts/check-site.mjs` clicks the first **visible** "Try the demo" link (the header one is hidden on phones).
- Checked: axe clean at 320, 390, 640×450 (200% zoom), 768, 1024, 1366×768, 1366×657 and 1440; no sideways scroll; headline, explanation and "Try the demo" in the first screen at 390×844 and 1366×768. Lighthouse (mobile): accessibility, best practices and SEO 100; performance 77–79 (main remaining cost is hydrating the whole React page on a slow phone CPU).

### Tests
- `scripts/journey.mjs` now also covers:
  - the phone's home screen (another app's note, opening SafeSpace) and Reset demo returning to it
  - dark mode (toggle, Results and Photos screenshots, kept after a refresh, toggle back)
  - power saving: the sheet, turning it on, the keypad (040 123 4567), a call and End call, Contacts calling Anna, Messages, Camera shutter and Photos
  - SafeSpace inside power saving (dark), Simple home, a refresh keeping it on, and turning it off (back to light)
  - desktop frames in light, dark and power saving
- 35 screenshots. It passes with no console errors. `scripts/cloud-tabs.mjs` passes, and `npm run build` passes.
- The landing page screenshots were recaptured from the new app (`landing-page: npm run screenshots`), the Home alt text now mentions the two buttons, the OG image was regenerated, and `npm run check` passes.

