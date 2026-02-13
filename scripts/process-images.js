import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs-extra';
import path from 'path';

const RAW_DIR = 'raw-images';
const OUT_DIR = 'public/images';
const DISH_DIR = 'src/content/dishes';

const files = await glob(`${RAW_DIR}/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}`);

for (const img of files) {
  const rel = path.relative(RAW_DIR, img);
  const outBase = path.join(OUT_DIR, rel).replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const outSmall = outBase.replace('.webp', '-small.webp');

  await fs.ensureDir(path.dirname(outBase));
  await sharp(img).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 75 }).toFile(outBase);
  await sharp(img).rotate().resize({ width: 400, withoutEnlargement: true }).webp({ quality: 65 }).toFile(outSmall);
}

const markdownFiles = await glob(`${DISH_DIR}/*.md`);
for (const file of markdownFiles) {
  const source = await fs.readFile(file, 'utf-8');
  const match = source.match(/\nimage:\s*([^\n]+)/);
  if (!match) continue;
  const imageName = match[1].trim().replace(/['"]/g, '');

  const largeOut = path.join(OUT_DIR, `${imageName}.webp`);
  const smallOut = path.join(OUT_DIR, `${imageName}-small.webp`);

  if (!(await fs.pathExists(largeOut))) {
    await fs.ensureDir(path.dirname(largeOut));
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='100%' height='100%' fill='#0f172a'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='72' font-family='Arial' fill='#e5e7eb'>${imageName}</text></svg>`;
    await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(largeOut);
    await sharp(Buffer.from(svg)).resize({ width: 400 }).webp({ quality: 70 }).toFile(smallOut);
  }
}

console.log(`Processed ${files.length} raw image(s).`);
