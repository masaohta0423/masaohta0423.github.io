import { readFile, writeFile } from "node:fs/promises";
import sections from "../papers/papers.js";

const path = new URL("../index.html", import.meta.url);
let html = await readFile(path, "utf8");

for (const [id, markup] of Object.entries(sections)) {
  const start = `<!-- build:${id} -->`;
  const end = `<!-- end:${id} -->`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!pattern.test(html)) throw new Error(`Missing build markers for ${id}`);
  html = html.replace(pattern, () => `${start}\n${markup.replace(/^[ \t]+$/gm, "")}\n${end}`);
}

await writeFile(path, html);
console.log("Built homepage lists from papers/papers.js");
