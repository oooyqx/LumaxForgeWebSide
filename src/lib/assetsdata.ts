import fs from "node:fs";
import path from "node:path";

export type AssetsVideo = {
  url: string;
  type: string;
  file?: string;
};

export type AssetsImage = {
  url: string;
  previewUrl?: string;
  kind: "local" | "cover" | "social" | "gallery" | "remote" | "screenshot";
  source: string;
  fileName?: string;
  linkedVideoUrl?: string;
};

export type AssetsData = {
  pluginId?: string;
  pluginName?: string;
  category?: string;
  unityVersion?: string;
  uploadedAtUtc?: string;
  fileCount?: number;
  fileSize?: string;
  renderPipelines?: string[];
  videos?: AssetsVideo[];
  images?: string[];
  mediaImages?: AssetsImage[];
  cardImage?: string;
  assetStoreUrl?: string;
  descriptionHtml?: string;
  technicalDetailsHtml?: string;
  descriptionText?: string;
  sources?: {
    description?: string;
    detail?: string;
    media?: string;
  };
};

export type AssetsDataFolderEntry = {
  folderName: string;
  slug: string;
  title: string;
  data: AssetsData;
};

function readTextIfExists(filePath: string) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return undefined;
  }
}

function readJsonIfExists<T>(filePath: string): T | undefined {
  const txt = readTextIfExists(filePath);
  if (!txt) return undefined;
  try {
    return JSON.parse(txt) as T;
  } catch {
    return undefined;
  }
}

function match1(re: RegExp, text: string) {
  const m = text.match(re);
  return m?.[1]?.trim();
}

function decodeHtml(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function collapseWhitespace(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function stripTags(html: string) {
  return collapseWhitespace(decodeHtml(html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ")));
}

function takeExcerpt(text: string, maxLength = 180) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const shortened = text.slice(0, maxLength);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${(lastSpace > 80 ? shortened.slice(0, lastSpace) : shortened).trim()}...`;
}

function findMatchingDivEnd(html: string, startIndex: number) {
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = startIndex;
  let depth = 0;
  let match: RegExpExecArray | null;

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

function extractDraftDataContents(html: string, labelId: string) {
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

function cleanupDraftHtml(html: string) {
  return html
    .replace(/\sdata-offset-key="[^"]*"/g, "")
    .replace(/\sdata-editor="[^"]*"/g, "")
    .replace(/\sdata-block="true"/g, "")
    .replace(/\sdata-contents="true"/g, "")
    .replace(/\sdata-text="true"/g, "")
    .replace(/\scontenteditable="true"/g, "")
    .replace(/\sspellcheck="false"/g, "")
    .replace(/\sstyle=""/g, "")
    .replace(/<span\b[^>]*>\s*<\/span>/g, "")
    .trim();
}

function encodeAssetPath(folderName: string, ...segments: string[]) {
  return ["/assetsdata", encodeURIComponent(folderName), ...segments.map((segment) => encodeURIComponent(segment))]
    .join("/")
    .replace(/%2F/g, "/");
}

function listLocalImagesRecursive(folderName: string, rootDir: string, relativeDir = "images"): AssetsImage[] {
  const targetDir = path.join(rootDir, relativeDir);
  try {
    const entries = fs.readdirSync(targetDir, { withFileTypes: true });
    return entries.flatMap((entry) => {
      if (entry.isDirectory() && (entry.name === "screenshots_videos" || entry.name === "marketing_images")) {
        return [];
      }
      const nextRelative = path.posix.join(relativeDir.replace(/\\/g, "/"), entry.name);
      if (entry.isDirectory()) {
        return listLocalImagesRecursive(folderName, rootDir, nextRelative);
      }
      if (!/\.(png|jpe?g|webp|gif|svg)$/i.test(entry.name)) return [];
      return [
        {
          url: encodeAssetPath(folderName, ...nextRelative.split("/")),
          previewUrl: encodeAssetPath(folderName, ...nextRelative.split("/")),
          kind: "local" as const,
          source: nextRelative,
          fileName: entry.name
        }
      ];
    });
  } catch {
    return [];
  }
}

function normalizeVideoUrl(url: string) {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return undefined;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();

    if (host === "youtu.be") {
      const videoId = parsed.pathname.replace(/^\/+/, "").split("/")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : trimmed;
    }

    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      if (parsed.pathname === "/watch") {
        const videoId = parsed.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : trimmed;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const videoId = parsed.pathname.split("/")[2];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : trimmed;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return trimmed;
      }
    }
  } catch {
    return undefined;
  }

  return trimmed;
}

function baseName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "");
}

function preferFullImage(url: string) {
  return url.replace(/_thumb(?=\.[a-z0-9]+$)/i, "");
}

function dedupeImages(images: AssetsImage[]) {
  const seen = new Set<string>();
  return images.filter((image) => {
    const key = `${image.url}|${image.linkedVideoUrl ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeVideos(videos: AssetsVideo[]) {
  const seen = new Set<string>();
  return videos.filter((video) => {
    const key = `${video.type}:${video.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractBackgroundImageUrls(html: string) {
  const urls = new Set<string>();
  const re = /background-image:\s*url\(&quot;(https?:\/\/[^"&]+)"\)/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    urls.add(preferFullImage(match[1]));
  }
  return [...urls];
}

function extractAssetStoreImageUrls(html: string) {
  const urls = new Set<string>();
  const re = /https?:\/\/assetstore-cdn[^"'&)\s]+/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    urls.add(preferFullImage(match[0]));
  }
  return [...urls];
}

function slugifyAssetName(name: string) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readScreenshotMedia(folderName: string, root: string) {
  const imagesDir = path.join(root, "images", "screenshots_videos");
  const videosDir = path.join(root, "videos", "screenshots_videos");
  const videoMap = new Map<string, string>();
  const directVideos: AssetsVideo[] = [];
  const screenshotImages: AssetsImage[] = [];

  try {
    const videoFiles = fs.readdirSync(videosDir, { withFileTypes: true }).filter((entry) => entry.isFile());
    for (const file of videoFiles) {
      const url = normalizeVideoUrl(readTextIfExists(path.join(videosDir, file.name)) ?? "");
      if (!url) continue;
      videoMap.set(baseName(file.name), url);
      directVideos.push({
        url,
        type: "embed",
        file: path.join("videos", "screenshots_videos", file.name)
      });
    }
  } catch {
    // ignore
  }

  try {
    const imageFiles = fs.readdirSync(imagesDir, { withFileTypes: true }).filter((entry) => entry.isFile());
    for (const file of imageFiles) {
      if (!/\.(png|jpe?g|webp|gif|svg)$/i.test(file.name)) continue;
      const url = encodeAssetPath(folderName, "images", "screenshots_videos", file.name);
      screenshotImages.push({
        url,
        previewUrl: url,
        kind: "screenshot",
        source: "images/screenshots_videos",
        fileName: file.name,
        linkedVideoUrl: videoMap.get(baseName(file.name))
      });
    }
  } catch {
    // ignore
  }

  return {
    images: screenshotImages,
    videos: directVideos
  };
}

export { slugifyAssetName };

export function loadAssetsData(folderName: string, projectRoot = process.cwd()): AssetsData {
  const root = path.join(projectRoot, "public", "assetsdata", folderName);
  const meta = readJsonIfExists<any>(path.join(root, "metadata.json"));
  const descriptionHtmlSource = readTextIfExists(path.join(root, "description.html"));
  const detailHtml = readTextIfExists(path.join(root, "detail.html"));
  const mediaHtml = readTextIfExists(path.join(root, "media.html"));

  const out: AssetsData = {
    pluginId: meta?.pluginId,
    pluginName: meta?.pluginName,
    videos: meta?.videos ?? undefined,
    sources: {
      description: meta?.pages?.description?.url,
      detail: meta?.pages?.detail?.url,
      media: meta?.pages?.media?.url
    }
  };

  const mediaImages: AssetsImage[] = [];
  const localImages = listLocalImagesRecursive(folderName, root);
  mediaImages.push(...localImages);

  // 读取 marketing_images/Card image.jpg 作为卡片图片
  const cardImagePath = path.join(root, "images", "marketing_images", "Card image.jpg");
  if (fs.existsSync(cardImagePath)) {
    out.cardImage = encodeAssetPath(folderName, "images", "marketing_images", "Card image.jpg");
  }

  const screenshotMedia = readScreenshotMedia(folderName, root);
  mediaImages.push(...screenshotMedia.images);
  out.videos = dedupeVideos([...(out.videos ?? []), ...screenshotMedia.videos]);

  const uploadHtml = readTextIfExists(path.join(root, "upload.html"));
  if (uploadHtml) {
    out.unityVersion = match1(/data-test="upload-package-unity-version">([^<]+)</i, uploadHtml) ?? out.unityVersion;
    const uploadedLine = match1(/<p class="jss18 jss22">([^<]+UTC,[^<]+)<\/p>/i, uploadHtml);
    if (uploadedLine) {
      const parts = uploadedLine.split(",").map((s) => s.trim());
      out.uploadedAtUtc = parts[0] ? parts[0] : undefined;
      const fileCount = parts.find((part) => /files?/i.test(part));
      const fileSize = parts.find((part) => /\b(MB|GB)\b/i.test(part));
      if (fileCount) out.fileCount = Number(fileCount.replace(/[^\d]/g, "")) || undefined;
      if (fileSize) out.fileSize = fileSize;
    }

    const pipelines: string[] = [];
    if (/render-pipline-checkbox-standard-rp[^>]*Mui-checked/i.test(uploadHtml)) pipelines.push("Built-in");
    if (/render-pipline-checkbox-urp[^>]*Mui-checked/i.test(uploadHtml)) pipelines.push("URP");
    if (/render-pipline-checkbox-hdrp[^>]*Mui-checked/i.test(uploadHtml)) pipelines.push("HDRP");
    if (/render-pipline-checkbox-custom-rp[^>]*Mui-checked/i.test(uploadHtml)) pipelines.push("Custom RP");
    out.renderPipelines = pipelines.length ? pipelines : undefined;
  }

  const shouldUseRemoteImages = localImages.length === 0;

  if (detailHtml) {
    out.category = match1(/aria-label="Category"[^>]*value="([^"]+)"/i, detailHtml) ?? out.category;
    if (!out.category) {
      out.category = match1(/id="edit-label-category"[\s\S]{0,800}?value="([^"]+)"/i, detailHtml) ?? out.category;
    }

    // 提取 Asset Store 公开链接
    const assetStoreMatch = detailHtml.match(/https:\/\/assetstore\.unity\.com\/packages\/[^"'<>\s]+/i);
    if (assetStoreMatch) {
      out.assetStoreUrl = assetStoreMatch[0];
    }

    if (shouldUseRemoteImages) {
      mediaImages.push(
        ...extractAssetStoreImageUrls(detailHtml).map((url) => ({
          url,
          previewUrl: url.replace(/(?=\.[a-z0-9]+$)/i, "_thumb"),
          kind: "remote" as const,
          source: "detail.html"
        }))
      );
    }
  }

  if (mediaHtml && shouldUseRemoteImages) {
    mediaImages.push(
      ...extractBackgroundImageUrls(mediaHtml).map((url) => ({
        url,
        previewUrl: url.replace(/(?=\.[a-z0-9]+$)/i, "_thumb"),
        kind: "gallery" as const,
        source: "media.html"
      })),
      ...extractAssetStoreImageUrls(mediaHtml).map((url) => ({
        url,
        previewUrl: url.replace(/(?=\.[a-z0-9]+$)/i, "_thumb"),
        kind: "gallery" as const,
        source: "media.html"
      }))
    );
  }

  try {
    const videoFilesDir = path.join(root, "videos");
    const files = fs.readdirSync(videoFilesDir, { withFileTypes: true });
    const fileVideos: AssetsVideo[] = files
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((file) => /embed|url/i.test(file))
      .map((file) => ({
        file,
        url: normalizeVideoUrl(readTextIfExists(path.join(videoFilesDir, file)) ?? ""),
        type: /embed/i.test(file) ? "embed" : "url"
      }))
      .filter((video): video is { file: string; url: string; type: string } => Boolean(video.url));

    out.videos = dedupeVideos([...(out.videos ?? []), ...fileVideos]);
  } catch {
    // ignore
  }

  const embeddedVideos = [descriptionHtmlSource, detailHtml, mediaHtml]
    .filter(Boolean)
    .flatMap((html) => [...String(html).matchAll(/<iframe[^>]+src="(https?:\/\/[^"]+)"/gi)].map((match) => match[1]))
    .filter((url) => /youtube\.com\/embed|player\.vimeo\.com/i.test(url))
    .map((url) => ({ url, type: "embed" }));
  out.videos = dedupeVideos([...(out.videos ?? []), ...embeddedVideos]);

  if (descriptionHtmlSource) {
    const richDescription = extractDraftDataContents(descriptionHtmlSource, "edit-label-description");
    if (richDescription) {
      out.descriptionHtml = cleanupDraftHtml(richDescription);
      out.descriptionText = takeExcerpt(stripTags(richDescription));
    }

    const technicalDetails = extractDraftDataContents(descriptionHtmlSource, "edit-label-technical-details");
    if (technicalDetails) {
      out.technicalDetailsHtml = cleanupDraftHtml(technicalDetails);
    }
  }

  if (!out.technicalDetailsHtml && detailHtml) {
    const technicalDetails = extractDraftDataContents(detailHtml, "edit-label-technical-details");
    if (technicalDetails) {
      out.technicalDetailsHtml = cleanupDraftHtml(technicalDetails);
    }
  }

  out.mediaImages = dedupeImages(mediaImages);
  out.images = out.mediaImages.map((image) => image.url);
  return out;
}

export function listAssetsDataFolders(projectRoot = process.cwd()): AssetsDataFolderEntry[] {
  const assetsRoot = path.join(projectRoot, "public", "assetsdata");
  try {
    return fs
      .readdirSync(assetsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .map((folderName) => {
        const data = loadAssetsData(folderName, projectRoot);
        const title = data.pluginName || folderName;
        return {
          folderName,
          slug: slugifyAssetName(title || folderName),
          title,
          data
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch {
    return [];
  }
}
