// Builds the whole website into dist-site/ for one host (Cloudflare Pages, Vercel, Netlify…):
//   /       -> the landing page (landing-page/)
//   /app/   -> the SafeSpace app (this folder)
// Run with `npm run build:site`.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const landing = path.join(root, 'landing-page');
const out = path.join(root, 'dist-site');
const run = (cmd, cwd = root) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, MSYS_NO_PATHCONV: '1' } });
};

fs.rmSync(out, { recursive: true, force: true });

// 1. The app, served from /app/
run('npm run seed');
run('npx tsc --noEmit');
run(`npx vite build --base /app/ --outDir "${path.join(out, 'app')}" --emptyOutDir`);

// 2. The landing page, served from /
if (!fs.existsSync(path.join(landing, 'node_modules'))) run('npm ci', landing);
run('npm run build', landing);
fs.cpSync(path.join(landing, 'dist'), out, { recursive: true });

console.log('\nWebsite ready in dist-site/  (landing page at /, app at /app/)');
