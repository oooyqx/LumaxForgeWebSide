#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = { root: process.cwd(), outDir: "src/content/products", lang: ["zh", "en"] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root") out.root = argv[++i];
    else if (a === "--outDir") out.outDir = argv[++i];
    else if (a === "--lang") out.lang = argv[++i].split(",").map((s) => s.trim());
    else if (a === "--map") out.mapFile = argv[++i];
  }
  return out;
}

function slugify(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureDir(filePath) {
  fs.mkdirSync(filePath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readTextIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return undefined;
  }
}

function pickTitle(meta) {
  return meta?.pluginName || "Untitled Product";
}

function loadMapping(mapFilePath) {
  if (!mapFilePath) return {};
  try {
    return readJson(mapFilePath);
  } catch {
    return {};
  }
}

function decodeHtml(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(html) {
  return decodeHtml(html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function takeExcerpt(text, maxLength = 160) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const shortened = text.slice(0, maxLength);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${(lastSpace > 70 ? shortened.slice(0, lastSpace) : shortened).trim()}...`;
}

function findMatchingDivEnd(html, startIndex) {
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = startIndex;
  let depth = 0;
  let match;

  while ((match = tagRe.exec(html))) {
    if (match[0][1] === "/") {
      depth -= 1;
      if (depth === 0) return match.index;
      continue;
    }

    depth += 1;
  }

  return -1;
}

function extractDraftDataContents(html, labelId) {
  const marker = `aria-labelledby="${labelId}"`;
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) return undefined;

  const contentsMarker = '<div data-contents="true">';
  const contentsIndex = html.indexOf(contentsMarker, markerIndex);
  if (contentsIndex < 0) return undefined;

  const start = contentsIndex + contentsMarker.length;
  const end = findMatchingDivEnd(html, contentsIndex);
  if (end < 0 || end <= start) return undefined;

  return html.slice(start, end).trim();
}

function readSummaryFromAssetsData(root, folderName) {
  const descriptionHtml = readTextIfExists(path.join(root, "assetsdata", folderName, "description.html"));
  if (!descriptionHtml) return "";
  const draft = extractDraftDataContents(descriptionHtml, "edit-label-description");
  return takeExcerpt(stripTags(draft || ""));
}

function escapeYaml(text) {
  return String(text ?? "").replace(/"/g, '\\"');
}

function createMdx({ lang, productSlug, title, assetDataFolder, summary }) {
  const fallbackSummary =
    lang === "zh"
      ? "基于抓取到的 assetsdata 自动生成的产品详情页，媒体和描述内容会从原始目录中解析。"
      : "Auto-generated product page. Media and description blocks are parsed from the captured assetsdata folder.";

  const docsUrl = lang === "zh" ? `/zh/products/${productSlug}/manual` : `/en/products/${productSlug}/manual`;
  const note =
    lang === "zh"
      ? `本页面主要内容由 \`assetsdata/${assetDataFolder}\` 自动解析，包括图片、视频地址、描述和技术细节。`
      : `This page is primarily driven by parsed data from \`assetsdata/${assetDataFolder}\`, including images, video URLs, description, and technical details.`;

  return `---
productSlug: ${productSlug}
lang: ${lang}
title: "${escapeYaml(title)}"
summary: "${escapeYaml(summary || fallbackSummary)}"
assetDataFolder: "${escapeYaml(assetDataFolder)}"
# docsUrl: ${docsUrl}
# tags: []
# price: TBD
# version: 1.x
# unityVersion: 2021.3+
---

${note}
`;
}

const args = parseArgs(process.argv.slice(2));
const assetsRoot = path.join(args.root, "assetsdata");
const outDir = path.join(args.root, args.outDir);
const mapping = loadMapping(args.mapFile ? path.join(args.root, args.mapFile) : undefined);

ensureDir(outDir);

const folders = fs
  .readdirSync(assetsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

let created = 0;
for (const folderName of folders) {
  const metaPath = path.join(assetsRoot, folderName, "metadata.json");
  if (!fs.existsSync(metaPath)) continue;

  const meta = readJson(metaPath);
  const title = pickTitle(meta);
  const summary = readSummaryFromAssetsData(args.root, folderName);
  const mapped = mapping?.[folderName];
  const productSlug = mapped?.productSlug || slugify(title || folderName);

  for (const lang of args.lang) {
    const fileName = `${productSlug}.${lang}.mdx`;
    const target = path.join(outDir, fileName);
    if (fs.existsSync(target)) continue;

    fs.writeFileSync(target, createMdx({ lang, productSlug, title, assetDataFolder: folderName, summary }), "utf8");
    created++;
  }
}

process.stdout.write(`assetsdata-to-products: created ${created} file(s) in ${args.outDir}\n`);
