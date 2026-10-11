import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "body-sublimation/index.md");
const outputPath = path.join(root, "body-sublimation/index.html");

const escapeHtml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function inlineMarkdown(value) {
  const lineBreaks = value.replace(/ {2}\\n/g, "\n");
  return escapeHtml(lineBreaks)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\^([0-9,]+)\^/g, "<sup>$1</sup>")
    .replaceAll("\n", "<br>");
}

function parseFrontMatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("index.md must begin with front matter");

  const metadata = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    metadata[key] = JSON.parse(rawValue);
  }
  return { metadata, markdown: match[2].trim() };
}

function parseMarkdown(markdown) {
  const document = { title: "", sections: [] };
  let section;
  let item;
  let subitem;
  let paragraph = [];
  let code = null;

  const currentNodes = () => subitem?.nodes ?? item?.nodes ?? section?.nodes;
  const flushParagraph = () => {
    if (!paragraph.length) return;
    currentNodes()?.push({ type: "paragraph", value: paragraph.join("\n") });
    paragraph = [];
  };

  for (const line of `${markdown}\n`.split("\n")) {
    if (code) {
      if (line.startsWith("```")) {
        currentNodes().push({ type: "code", value: code.lines.join("\n") });
        code = null;
      } else {
        code.lines.push(line);
      }
      continue;
    }
    if (line.startsWith("|")) {
      flushParagraph();
      const nodes = currentNodes();
      if (nodes.at(-1)?.type !== "table") nodes.push({ type: "table", rows: [] });
      if (!/^\|[\s|:-]+\|$/.test(line)) nodes.at(-1).rows.push(line.split("|").slice(1, -1).map((cell) => cell.trim()));
    } else if (line.startsWith("```")) {
      flushParagraph();
      code = { lines: [] };
    } else if (line.startsWith("#### ")) {
      flushParagraph();
      subitem = { title: line.slice(5), nodes: [] };
      item.subitems.push(subitem);
    } else if (line.startsWith("### ")) {
      flushParagraph();
      subitem = null;
      item = { title: line.slice(4), nodes: [], subitems: [] };
      section.items.push(item);
    } else if (line.startsWith("## ")) {
      flushParagraph();
      item = null;
      subitem = null;
      section = { title: line.slice(3), nodes: [], items: [] };
      document.sections.push(section);
    } else if (line.startsWith("# ")) {
      flushParagraph();
      document.title = line.slice(2);
    } else if (/^!\[[^\]]*\]\([^)]+\)$/.test(line)) {
      flushParagraph();
      const [, alt, src] = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      (item?.nodes ?? section.nodes).push({ type: "image", alt, src });
    } else if (line.trim() === "") {
      flushParagraph();
    } else {
      paragraph.push(line);
    }
  }
  return document;
}

const renderParagraphs = (nodes) => nodes
  .filter((node) => node.type === "paragraph")
  .map((node) => `            <p>${inlineMarkdown(node.value)}</p>`)
  .join("\n");

const renderFigure = (node, className = "") => {
  const classAttribute = className ? ` class="${className}"` : "";
  if (/\.mp4$/i.test(node.src)) {
    return `<figure${classAttribute}><video controls autoplay muted loop playsinline preload="metadata" aria-label="${escapeHtml(node.alt)}"><source src="${escapeHtml(node.src)}" type="video/mp4">Your browser does not support embedded video. <a href="${escapeHtml(node.src)}">Download the video</a>.</video></figure>`;
  }
  return `<figure${classAttribute}><img src="${escapeHtml(node.src)}" loading="lazy" alt="${escapeHtml(node.alt)}"></figure>`;
};

function renderFeature(item, reverse = false) {
  const image = item.nodes.find((node) => node.type === "image");
  const copy = [
    "          <div class=\"feature-copy\">",
    `            <h3>${inlineMarkdown(item.title)}</h3>`,
    renderParagraphs(item.nodes),
  ];
  if (item.subitems.length) {
    copy.push("            <div class=\"state-pair\">");
    item.subitems.forEach((state, index) => {
      const kind = index === 0 ? "gas" : "solid";
      copy.push(`              <div><span class="state-mark state-mark--${kind}" aria-hidden="true"></span><strong>${inlineMarkdown(state.title)}</strong>${renderParagraphs(state.nodes).trim()}</div>`);
    });
    copy.push("            </div>");
  }
  copy.push("          </div>");
  const figure = `          ${renderFigure(image)}`;
  const contents = reverse ? [figure, ...copy] : [...copy, figure];
  return `        <article class="feature-row${reverse ? " feature-row--reverse" : ""}">\n${contents.filter(Boolean).join("\n")}\n        </article>`;
}

function renderSection(section) {
  const id = {
    "Abstract": "abstract-heading",
    "Beyond Our Natural Reach": "motivation-heading",
    'What is Body "Sublimation"?': "concept-heading",
    "How the Extended Hand Works": "works-heading",
    "User Study": "study-heading",
    "Application Scenarios": "applications-heading",
    "Conclusion": "conclusion-heading",
    "Preview Video": "preview-heading",
    "BibTeX": "bibtex-heading",
  }[section.title];

  if (section.title === "How the Extended Hand Works" || section.title === "Application Scenarios") {
    return `    <section class="band band--gray" aria-labelledby="${id}">
      <div class="page-container">
        <h2 id="${id}">${section.title}</h2>
${section.items.map((item, index) => renderFeature(item, index % 2 === 1)).join("\n")}
      </div>
    </section>`;
  }

  if (section.title === 'What is Body "Sublimation"?') {
    return `    <section class="content-section concept-section page-container" aria-labelledby="${id}">
      <h2 id="${id}">${escapeHtml(section.title)}</h2>
      <div class="concept-layout">
        ${renderFigure(section.nodes.find((node) => node.type === "image"), "concept-figure")}
        <div>${renderParagraphs(section.nodes)}</div>
      </div>
    </section>`;
  }

  if (section.title === "User Study") {
    const images = section.nodes.filter((node) => node.type === "image");
    const results = section.items.map((item) => {
      const [number, title] = item.title.split(" — ");
      return `        <article><strong>${number}</strong><h3>${title}</h3>${renderParagraphs(item.nodes).trim()}</article>`;
    }).join("\n");
    return `    <section class="content-section content-section--study page-container" aria-labelledby="${id}">
      <div class="study-intro">
        <div class="abstract-copy">
          <h2 id="${id}">${section.title}</h2>
${renderParagraphs(section.nodes.filter((node) => node.type === "paragraph" && !node.value.startsWith("Questionnaire")))}
          <p><strong>PT — Pass-through:</strong> the original hand and robot remain visible.</p>
          <p><strong>SU — Body Sublimation:</strong> both are hidden and replaced by a virtual hand.</p>
        </div>
        <figure class="study-conditions">
          <img src="${escapeHtml(images[0].src)}" loading="lazy" alt="${escapeHtml(images[0].alt)}">
        </figure>
      </div>
      ${renderFigure(images[1], "study-figure")}
      ${renderParagraphs(section.nodes.filter((node) => node.type === "paragraph" && node.value.startsWith("Questionnaire")))}
      <div class="study-table-wrap" tabindex="0" role="region" aria-label="Questionnaire results table">
        <table class="study-table">
          <caption>Table 1. Questionnaire results: median (IQR)</caption>
          <thead><tr>${section.nodes.find((node) => node.type === "table").rows[0].map((cell) => `<th scope="col">${escapeHtml(cell)}</th>`).join("")}</tr></thead>
          <tbody>${section.nodes.find((node) => node.type === "table").rows.slice(1).map((row) => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${escapeHtml(cell)}</th>` : `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
      <div class="result-grid">
${results}
      </div>
    </section>`;
  }

  if (section.title === "BibTeX") {
    const code = section.nodes.find((node) => node.type === "code");
    return `    <section class="bibtex-section" aria-labelledby="${id}">
      <div class="page-container">
        <h2 id="${id}">${section.title}</h2>
        <div class="citation-actions"><button type="button" id="copy-bibtex">Copy BibTeX</button><span id="copy-status" role="status" aria-live="polite"></span></div>
        <pre><code id="bibtex-code">${escapeHtml(code.value)}</code></pre>
      </div>
    </section>`;
  }

  if (section.title === "Preview Video") {
    const videoUrl = section.nodes.find((node) => node.type === "paragraph")?.value;
    const videoId = new URL(videoUrl).searchParams.get("v");
    if (!videoId) throw new Error("Preview Video must contain a YouTube watch URL");
    return `    <section class="content-section page-container" aria-labelledby="${id}">
      <h2 id="${id}">${section.title}</h2>
      <div class="video-embed">
        <iframe src="https://www.youtube-nocookie.com/embed/${escapeHtml(videoId)}" title="Body Sublimation preview video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
    </section>`;
  }

  return `    <section class="content-section page-container" aria-labelledby="${id}">
      <h2 id="${id}">${section.title}</h2>
${renderParagraphs(section.nodes)}
    </section>`;
}

function renderPage(metadata, document) {
  return `<!doctype html>
<!-- Generated from index.md by npm run build. Do not edit this file directly. -->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(metadata.description)}">
  <meta property="og:title" content="${escapeHtml(metadata.page_title)}">
  <meta property="og:description" content="${escapeHtml(metadata.og_description)}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="${escapeHtml(metadata.og_image)}">
  <meta property="og:url" content="${escapeHtml(metadata.canonical_url)}">
  <title>${escapeHtml(metadata.page_title)}</title>
  <link rel="icon" href="../images/favicon.ico">
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="project.css">
</head>
<body class="paper-page">
  <header class="paper-header page-container">
    <a class="home-link" href="../" aria-label="Back to Masahiro Ohta's homepage">← Masahiro Ohta</a>
    <h1>${inlineMarkdown(document.title).replace(": ", ":<br class=\"title-break\"> ")}</h1>
    <div class="authors">${inlineMarkdown(metadata.authors).split(/<br>|, (?=(?:<a|[A-Z]))/).map((author) => `<span class="author">${author.trim().replace(/,$/, "")}</span>`).join("")}</div>
    <div class="affiliation">${metadata.affiliation.split(" / ").map((affiliation) => `<span>${inlineMarkdown(affiliation)}</span>`).join("")}</div>
    <p class="venue">${escapeHtml(metadata.venue_badge ?? metadata.venue)}</p>
    <p class="equal-note">${escapeHtml(metadata.equal_note)}</p>
    <nav class="paper-links" aria-label="Publication links">
      <a href="${escapeHtml(metadata.paper_url)}">Paper <span aria-hidden="true">↗</span></a>
      <a href="${escapeHtml(metadata.acm_url)}" target="_blank" rel="noopener">ACM DL <span aria-hidden="true">↗</span></a>
    </nav>
  </header>

  <main>
    <section class="abstract-overview page-container" aria-labelledby="abstract-heading">
      <div class="abstract-copy">
        <h2 id="abstract-heading">Abstract</h2>
${renderParagraphs(document.sections.find((section) => section.title === "Abstract").nodes)}
      </div>
      <figure class="abstract-image">
        <img src="${escapeHtml(metadata.abstract_image)}" alt="${escapeHtml(metadata.abstract_alt)}">
      </figure>
    </section>

${document.sections.filter((section) => section.title !== "Abstract").map(renderSection).join("\n\n")}

  </main>

  <footer class="paper-footer">
    <div class="page-container"><p>${escapeHtml(metadata.footer)}</p><a href="../">Masahiro Ohta</a></div>
  </footer>
  <script src="project.js" defer></script>
</body>
</html>
`;
}

const source = await readFile(sourcePath, "utf8");
const { metadata, markdown } = parseFrontMatter(source);
const document = parseMarkdown(markdown);
await writeFile(outputPath, renderPage(metadata, document));
console.log(`Built ${path.relative(root, outputPath)} from ${path.relative(root, sourcePath)}`);
