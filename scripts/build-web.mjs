// Copies the website into www/ for the Android app (Capacitor's webDir).
// The repo root is also the GitHub Pages site, so it holds files the app must not ship
// (node_modules, android/, this script); only the menu, shared files, the privacy page and each game folder are copied.
// Google Fonts links are removed from the copied HTML so the app never goes online; Android's built-in fonts are used instead.
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, 'www');
const SKIP = new Set(['node_modules', 'android', 'www', 'scripts']);

// Every top-level folder with an index.html is a game; new games are picked up without editing this list.
const games = readdirSync(root).filter(name =>
  !name.startsWith('.') && !SKIP.has(name) &&
  statSync(join(root, name)).isDirectory() && existsSync(join(root, name, 'index.html')));
const entries = ['index.html', 'privacy.html', 'manifest.webmanifest', 'icons', 'shared', ...games];

rmSync(out, { recursive: true, force: true });
for (const name of entries) cpSync(join(root, name), join(out, name), { recursive: true });

const FONT_LINK = /^[ \t]*<link[^>]+(fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>\r?\n/gm;
for (const page of ['index.html', 'privacy.html', ...games.map(g => join(g, 'index.html'))]) {
  const file = join(out, page);
  writeFileSync(file, readFileSync(file, 'utf8').replace(FONT_LINK, ''));
}

console.log(`www/ ready: menu + ${games.length} games (${games.join(', ')})`);
