// After `vite build`: puts the rendered page HTML into dist/index.html and inlines the (small)
// stylesheet, so text and layout appear before JavaScript and CSS files load. Better first paint and SEO.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ssrDir = path.resolve('dist-ssr');
const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const file = path.resolve('dist/index.html');
let html = fs.readFileSync(file, 'utf8');
if (!html.includes('<!--app-->')) throw new Error('dist/index.html has no <!--app--> placeholder');
html = html.replace('<!--app-->', render());

// <link rel="stylesheet" ... href="/base/assets/index-abc.css"> -> <style>…</style>
html = html.replace(/<link rel="stylesheet"[^>]*href="[^"]*\/assets\/([^"]+\.css)"[^>]*>/, (tag, name) => {
  const css = fs.readFileSync(path.resolve('dist/assets', name), 'utf8');
  return `<style>${css}</style>`;
});

fs.writeFileSync(file, html);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log('Pre-rendered dist/index.html (with inlined styles)');
