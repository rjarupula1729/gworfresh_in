#!/usr/bin/env node
/* Watches db/ for JSON changes and rebuilds shared/gf-db-bundle.js.
 * Zero-dep — uses Node's built-in fs.watch (recursive on macOS).
 * Usage:   node scripts/db-watch-bundle.js
 *          npm run db:watch
 */
const fs   = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root    = path.resolve(__dirname, '..');
const dbDir   = path.join(root, 'db');
const builder = path.join(root, 'scripts/build-db-bundle.js');

function build(reason) {
  const t0 = Date.now();
  try {
    execFileSync('node', [builder], { stdio: 'inherit' });
    console.log(`   ↳ ${reason}  (${Date.now() - t0} ms)\n`);
  } catch (e) {
    console.error('   ✗ build failed:', e.message, '\n');
  }
}

console.log('👀  Watching db/ for changes …  (Ctrl-C to stop)\n');
build('initial build');

let debounce = null;
fs.watch(dbDir, { recursive: true }, (event, filename) => {
  if (!filename || !filename.endsWith('.json')) return;
  clearTimeout(debounce);
  debounce = setTimeout(() => build(`${event}: ${filename}`), 150);
});
