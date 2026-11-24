import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sections from "../papers/papers.js";

const path = new URL("../index.html", import.meta.url);
let html = await readFile(path, "utf8");
const css = await readFile(new URL("../style.css", import.meta.url));
const cssVersion = createHash("sha256").update(css).digest("hex").slice(0, 12);
html = html.replace(/href="style\.css(?:\?v=[^"]*)?"/, `href="style.css?v=${cssVersion}"`);

for (const [id, markup] of Object.entries(sections)) {
  const start = `<!-- build:${id} -->`;
  const end = `<!-- end:${id} -->`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!pattern.test(html)) throw new Error(`Missing build markers for ${id}`);
  html = html.replace(pattern, () => `${start}\n${markup.replace(/^[ \t]+$/gm, "")}\n${end}`);
}

await writeFile(path, html);
console.log("Built homepage lists from papers/papers.js");
