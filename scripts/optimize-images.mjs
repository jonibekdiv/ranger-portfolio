// Converts the full-size screenshots in assets-src/ into small WebP files in public/img.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const src = fileURLToPath(new URL('../assets-src/', import.meta.url))
const out = fileURLToPath(new URL('../public/img/', import.meta.url))
await mkdir(out, { recursive: true })

const jobs = [
  ['esport.png', 'esport', 1280],
  ['loftmir.png', 'loftmir', 1280],
  ['menu.png', 'menu', 1280],
  ['avatar.jpg', 'avatar', 320],
]
for (const [file, name, width] of jobs) {
  await sharp(src + file).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${out}${name}.webp`)
  console.log('ok', name)
}
