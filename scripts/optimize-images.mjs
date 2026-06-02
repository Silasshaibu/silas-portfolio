// One-off: resize/re-encode large JPEGs in /public to cut page weight.
// Caps width at 1600px and re-encodes JPEG at quality 78 (mozjpeg).
// Run: node scripts/optimize-images.mjs
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const MAX_W = 1600;
const QUALITY = 78;

const files = (await readdir(publicDir)).filter((f) => /\.(jpe?g)$/i.test(f));
let before = 0, after = 0;

for (const file of files) {
  const path = join(publicDir, file);
  const orig = (await stat(path)).size;
  const img = sharp(path);
  const meta = await img.metadata();
  const width = Math.min(meta.width ?? MAX_W, MAX_W);
  const buf = await img
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  // Only overwrite if we actually saved bytes.
  if (buf.length < orig) {
    await writeFile(path, buf);
    before += orig; after += buf.length;
    console.log(`${file}: ${(orig / 1024).toFixed(0)}KB -> ${(buf.length / 1024).toFixed(0)}KB`);
  } else {
    console.log(`${file}: kept (${(orig / 1024).toFixed(0)}KB)`);
  }
}

console.log(`\nTotal: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB`);
