// Generates the icon set and the social share image from the logo, so they
// always match the site. Run with: npm run assets
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import os from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const pub = resolve(root, "public");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  resolve(os.homedir(), "Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"),
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error("No Chrome found. Set CHROME_PATH or run: npx playwright install chromium");
  process.exit(1);
}

const logo = readFileSync(resolve(root, "src/assets/tdw_logo_mark.png")).toString("base64");
const rokkitt = readFileSync(resolve(root, "src/assets/fonts/rokkitt-var.woff2")).toString("base64");
const franklin = readFileSync(resolve(root, "src/assets/fonts/librefranklin-var.woff2")).toString("base64");

const FONTS = `
@font-face{font-family:Rokkitt;src:url(data:font/woff2;base64,${rokkitt}) format('woff2-variations');font-weight:100 900}
@font-face{font-family:'Libre Franklin';src:url(data:font/woff2;base64,${franklin}) format('woff2-variations');font-weight:100 900}
`;

const PAPER = "#EDE3CF", INK = "#11284F", SAUCE = "#C8371D", GOLD = "#F2B126";

// Browser tabs sit on light OR dark chrome, so favicons must be transparent.
// iOS and Android maskable icons are the exception: they get composited onto
// a background we do not control, and transparent areas come out black.
const iconPage = (size, { background = "transparent", scale = 0.96 } = {}) => `<style>${FONTS}
  html,body{margin:0;width:${size}px;height:${size}px}
  body{background:${background};display:flex;align-items:center;justify-content:center}
  img{width:${Math.round(size * scale)}px;image-rendering:auto}
</style><img src="data:image/png;base64,${logo}">`;

const ogPage = `<style>${FONTS}
  html,body{margin:0;width:1200px;height:630px}
  body{background:${PAPER};display:flex;flex-direction:column;justify-content:center;
       padding:0 86px;box-sizing:border-box;font-family:'Libre Franklin',sans-serif}
  .row{display:flex;align-items:center;gap:40px}
  img{height:168px}
  h1{font-family:Rokkitt,serif;font-weight:800;text-transform:uppercase;font-size:104px;
     line-height:.95;letter-spacing:-.015em;color:${INK};margin:0}
  h1 b{color:${SAUCE};font-weight:800}
  .rule{height:8px;background:${INK};margin:46px 0 30px}
  p{margin:0;font-size:34px;font-weight:600;color:${INK};letter-spacing:.01em}
  .gold{color:${GOLD};-webkit-text-stroke:1px ${INK}}
</style>
<div class="row"><img src="data:image/png;base64,${logo}"><h1>Touchdown <b>Wings</b></h1></div>
<div class="rule"></div>
<p>Wings &middot; Tenders &middot; Hibachi &nbsp;<span class="gold">&#9670;</span>&nbsp; Tullahoma, TN &nbsp;<span class="gold">&#9670;</span>&nbsp; (931) 913-2888</p>`;

const browser = await chromium.launch({ executablePath });

const ICONS = [
  { size: 16,  name: "favicon-16.png" },
  { size: 32,  name: "favicon-32.png" },
  { size: 48,  name: "favicon-48.png" },
  { size: 192, name: "logo192.png" },
  { size: 512, name: "logo512.png" },
  // opaque on purpose — these are composited by the OS
  { size: 180, name: "apple-touch-icon.png", background: PAPER, scale: 0.84 },
  { size: 512, name: "maskable512.png", background: PAPER, scale: 0.62 },
];

for (const { size, name, background, scale } of ICONS) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });
  await page.setContent(iconPage(size, { background, scale }));
  await page.waitForTimeout(120);
  await page.screenshot({ path: resolve(pub, name), omitBackground: !background });
  console.log(`  wrote ${name.padEnd(22)} ${size}x${size} ${background ? "opaque" : "transparent"}`);
  await page.close();
}

const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.setContent(ogPage);
await og.waitForTimeout(250);
await og.screenshot({ path: resolve(pub, "og-image.png") });
console.log("  wrote og-image.png 1200x630");
await og.close();
await browser.close();

// Pack the three small PNGs into a classic favicon.ico
const sizes = [16, 32, 48];
const pngs = sizes.map((s) => readFileSync(resolve(pub, `favicon-${s}.png`)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s === 256 ? 0 : s, 0); e.writeUInt8(s === 256 ? 0 : s, 1);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8); e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
writeFileSync(resolve(pub, "favicon.ico"), Buffer.concat([header, ...entries, ...pngs]));
console.log("  wrote favicon.ico (16/32/48)");
