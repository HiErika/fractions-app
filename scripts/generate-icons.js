/**
 * Generate apple-touch-icon.png (180x180 purple gradient with rounded corners).
 * Run: node scripts/generate-icons.js
 *
 * For a proper icon with the pizza emoji, replace the output with a
 * 180x180 PNG export of public/pizza-icon-192x192.svg using an image editor.
 */

import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

const width = 180;
const height = 180;
const pixels = Buffer.alloc(width * height * 4);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const t = (x + y) / (width + height);
    // Purple gradient: #a855f7 -> #7c3aed
    pixels[i] = Math.round(168 + (124 - 168) * t);
    pixels[i + 1] = Math.round(85 + (58 - 85) * t);
    pixels[i + 2] = Math.round(247 + (237 - 247) * t);
    pixels[i + 3] = 255;

    // Round corners (radius 30)
    const r = 30;
    const dx = Math.min(x, width - 1 - x);
    const dy = Math.min(y, height - 1 - y);
    if (dx < r && dy < r) {
      const dist = Math.sqrt((r - dx) ** 2 + (r - dy) ** 2);
      if (dist > r) pixels[i + 3] = 0;
    }
  }
}

// Build raw image data with filter bytes
const raw = Buffer.alloc(height * (1 + width * 4));
for (let y = 0; y < height; y++) {
  raw[y * (1 + width * 4)] = 0; // filter: none
  pixels.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
}

const compressed = deflateSync(raw);

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type), data]);
  const crc = crc32(typeAndData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeAndData, crcBuf]);
}

const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 6;  // color type: RGBA
ihdr[10] = 0; // compression
ihdr[11] = 0; // filter
ihdr[12] = 0; // interlace

const png = Buffer.concat([
  signature,
  makeChunk('IHDR', ihdr),
  makeChunk('IDAT', compressed),
  makeChunk('IEND', Buffer.alloc(0)),
]);

writeFileSync(new URL('../public/apple-touch-icon.png', import.meta.url), png);
console.log('Created public/apple-touch-icon.png (180x180 purple gradient)');
