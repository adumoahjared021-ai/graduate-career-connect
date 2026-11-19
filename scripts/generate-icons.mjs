import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const mark = `
  <g transform="translate(97.5 97.5) scale(13.21)" fill="none" stroke="#ffffff"
     stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19v-6.5a8 8 0 0 1 16 0V19" />
    <path d="M8.5 19v-4.2a3.5 3.5 0 0 1 7 0V19" />
    <path d="M2.5 19h19" />
  </g>`;

const rounded = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#134e45"/>${mark}
</svg>`;

const maskable = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#134e45"/>
  <g transform="translate(64 64) scale(0.8)">${mark}</g>
</svg>`;

await mkdir("public/icons", { recursive: true });

const outputs = [
  [rounded, "public/icons/icon.svg"],
  [rounded, "app/icon.svg"],
  [rounded, "public/icons/icon-192.png", 192],
  [rounded, "public/icons/icon-512.png", 512],
  [maskable, "public/icons/maskable-512.png", 512],
  [rounded, "app/apple-icon.png", 180],
];

for (const [svg, file, size] of outputs) {
  const image = sharp(Buffer.from(svg));
  await (size ? image.resize(size, size) : image).toFile(file);
  console.log("wrote", file);
}
