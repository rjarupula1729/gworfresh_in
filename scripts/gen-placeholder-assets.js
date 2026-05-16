// scripts/gen-placeholder-assets.js
// Generates minimal solid-color PNG placeholders for Expo build.
// Replace with real artwork before the public Play Store release.
//
// Usage:  node scripts/gen-placeholder-assets.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ── tiny PNG encoder (RGBA, single colour) ──────────────────
function crc32(buf) {
  let c, crc = -1;
  for (let i = 0; i < buf.length; i++) {
    c = (crc ^ buf[i]) & 0xff;
    for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function makePNG(w, h, [r, g, b]) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // colour type RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  // raw scanlines: filter byte 0 + RGB per pixel
  const row = Buffer.alloc(1 + w * 3);
  for (let x = 0; x < w; x++) { row[1 + x * 3] = r; row[2 + x * 3] = g; row[3 + x * 3] = b; }
  const raw = Buffer.concat(Array.from({ length: h }, () => row));
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

const GREEN = [15, 122, 62]; // #0f7a3e – GrowFresh brand
const ASSETS = path.join(__dirname, '..', 'assets');
fs.mkdirSync(ASSETS, { recursive: true });

const files = [
  ['icon.png', 1024, 1024],
  ['adaptive-icon.png', 1024, 1024],
  ['splash.png', 1242, 2436],
  ['favicon.png', 48, 48],
];

for (const [name, w, h] of files) {
  const out = path.join(ASSETS, name);
  fs.writeFileSync(out, makePNG(w, h, GREEN));
  console.log(`✅  ${name}  (${w}×${h})`);
}
console.log('\nDone. Replace with real artwork later.');
