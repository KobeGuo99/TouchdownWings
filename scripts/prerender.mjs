// Renders the app to static HTML and writes it into build/index.html, so the
// menu, prices, hours, contact details and the Restaurant JSON-LD are all in
// the document before any JavaScript runs. React then hydrates that markup.
//
// Real server rendering is used rather than screenshotting a browser: only
// renderToString emits the text-node separators React needs to hydrate
// without discarding the markup. It also means the build needs no browser.
import * as esbuild from "esbuild";
import { readFile, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve, basename } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const build = resolve(root, "build");
const tmp = resolve(root, "node_modules/.cache/ssr-entry.mjs");

if (!existsSync(resolve(build, "index.html"))) {
  console.error("  prerender: build/index.html missing — run react-scripts build first");
  process.exit(1);
}

// Asset imports must resolve to the same hashed URLs the client bundle uses,
// otherwise the markup differs and hydration fails.
const manifest = JSON.parse(await readFile(resolve(build, "asset-manifest.json"), "utf8"));
const byBasename = new Map(
  Object.entries(manifest.files || {}).map(([key, url]) => [basename(key), url])
);

const assetPlugin = {
  name: "assets",
  setup(b) {
    // stylesheets contribute nothing to the HTML string
    b.onLoad({ filter: /\.css$/ }, () => ({ contents: "", loader: "js" }));
    b.onLoad({ filter: /\.(png|jpe?g|svg|gif|webp|woff2?)$/ }, (args) => {
      const name = basename(args.path);
      const hashed = [...byBasename.entries()].find(([k]) =>
        k.replace(/\.[0-9a-f]{8,}\./, ".") === name
      );
      const url = hashed ? hashed[1] : `/static/media/${name}`;
      return { contents: `export default ${JSON.stringify(url)};`, loader: "js" };
    });
  },
};

await esbuild.build({
  entryPoints: [resolve(here, "ssr-entry.jsx")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: tmp,
  jsx: "automatic",
  loader: { ".js": "jsx" },   // CRA allows JSX inside .js files
  define: { "process.env.NODE_ENV": '"production"' },
  external: ["react", "react-dom", "react-dom/server", "react/jsx-runtime"],
  plugins: [assetPlugin],
  logLevel: "warning",
});

const { default: render } = await import(pathToFileURL(tmp).href);
const markup = render();
await rm(tmp, { force: true });

let html = await readFile(resolve(build, "index.html"), "utf8");
if (!html.includes('<div id="root"></div>')) {
  console.error('  prerender: could not find an empty <div id="root"></div> to fill');
  process.exit(1);
}
html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

const fontPreloads = Object.entries(manifest.files || {})
  .filter(([key]) => key.endsWith(".woff2"))
  .map(([, url]) =>
    `<link rel="preload" as="font" type="font/woff2" crossorigin href="${url}">`)
  .join("\n    ");
if (fontPreloads) html = html.replace("</head>", `  ${fontPreloads}\n  </head>`);

await writeFile(resolve(build, "index.html"), html);
// GitHub Pages serves 404.html for unknown paths; same markup keeps those useful
await writeFile(resolve(build, "404.html"), html);

const count = (re) => (markup.match(re) || []).length;
console.log(`\n  prerendered build/index.html — ${(html.length / 1024).toFixed(0)} kB static HTML`);
console.log(`  preloaded ${(html.match(/rel="preload" as="font"/g) || []).length} font files`);
console.log(
  `  ${count(/class="cat"/g)} categories, ` +
  `${count(/class="(row-price|mx-p[^"]*)"/g)} prices, ` +
  `${count(/class="week-row/g)} hour rows, ` +
  `JSON-LD: ${markup.includes("application/ld+json")}\n`
);
