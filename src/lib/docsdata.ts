import * as fs from "node:fs";
import * as path from "node:path";

const DOCS_ROOT = path.resolve(process.cwd(), "docs");
const MANUAL_DIR = path.join(DOCS_ROOT, "Manual");

export type ManualChapter = {
  id: string;
  title: string;
  content: string;
  order: number;
};

export type ManualProduct = {
  id: string;
  name: string;
  version?: string;
  description?: string;
  icon?: string;
  assetStoreUrl?: string;
};

export type ManualMeta = {
  generatedAt?: string;
  defaultLang: string;
  supportedLangs: string[];
};

export type ManualNavGroup = {
  key: string;
  title: Record<string, string>;
  chapters: string[];
};

export type ManualConfig = {
  product: ManualProduct;
  meta: ManualMeta;
  navigation: {
    groups: ManualNavGroup[];
  };
};

export type ManualEntry = {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  generatedAt?: string;
  config?: ManualConfig;
  chapters: ManualChapter[];
};

/**
 * 列出 docs/Manual 目录下所有可用的产品文档
 * 新结构: docs/Manual/{product-id}/manual-config.json
 */
export function listDocsManuals(): ManualEntry[] {
  const manuals: ManualEntry[] = [];

  if (!fs.existsSync(MANUAL_DIR)) {
    return manuals;
  }

  const entries = fs.readdirSync(MANUAL_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const productDir = path.join(MANUAL_DIR, entry.name);
    const configFile = path.join(productDir, "manual-config.json");

    // 检查是否有配置文件
    if (!fs.existsSync(configFile)) continue;

    try {
      const configContent = fs.readFileSync(configFile, "utf-8");
      const config = JSON.parse(configContent) as ManualConfig;

      manuals.push({
        slug: entry.name,
        title: config.product?.name || entry.name,
        description: config.product?.description || "",
        generatedAt: config.meta?.generatedAt,
        config,
        chapters: []
      });
    } catch {
      // 配置文件解析失败，跳过
      continue;
    }
  }

  return manuals;
}

/**
 * 加载指定 Manual 的数据
 * 新结构: docs/Manual/{slug}/{lang}/*.md
 */
export function loadManualData(slug: string, lang: "zh" | "en"): ManualEntry | null {
  const productDir = path.join(MANUAL_DIR, slug);
  const langDir = path.join(productDir, lang);
  const configFile = path.join(productDir, "manual-config.json");

  // 检查语言目录是否存在
  if (!fs.existsSync(langDir)) {
    // 尝试回退到默认语言
    const defaultLangDir = path.join(productDir, "zh");
    if (!fs.existsSync(defaultLangDir)) {
      return null;
    }
    return loadManualDataFromDir(defaultLangDir, slug, configFile);
  }

  return loadManualDataFromDir(langDir, slug, configFile);
}

/**
 * 从指定目录加载 Markdown 章节
 */
function loadManualDataFromDir(langDir: string, slug: string, configFile: string): ManualEntry | null {
  try {
    // 加载配置
    let config: ManualConfig | null = null;
    if (fs.existsSync(configFile)) {
      const configContent = fs.readFileSync(configFile, "utf-8");
      config = JSON.parse(configContent) as ManualConfig;
    }

    // 读取目录下所有 .md 文件
    const files = fs.readdirSync(langDir).filter(f => f.endsWith(".md"));
    const chapters: ManualChapter[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(langDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      
      // 从文件名提取 ID (去掉 .md 后缀)
      const id = file.replace(/\.md$/, "");
      
      // 从内容提取标题 (第一个 # 开头的行)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : id;

      chapters.push({
        id,
        title,
        content,
        order: i
      });
    }

    // 按文件名排序
    chapters.sort((a, b) => a.id.localeCompare(b.id));

    return {
      slug,
      title: config?.product?.name || slug,
      description: config?.product?.description || "",
      generatedAt: config?.meta?.generatedAt,
      config: config || undefined,
      chapters
    };
  } catch {
    return null;
  }
}

function parseManualDataContent(content: string, slug: string): ManualEntry | null {
  try {
    // 提取 generatedAt
    const generatedAtMatch = content.match(/generatedAt\s*=\s*["']([^"']+)["']/);
    const generatedAt = generatedAtMatch ? generatedAtMatch[1] : undefined;

    // 提取 chapters 数组
    const chaptersMatch = content.match(/chapters\s*=\s*\[([\s\S]*?)\];/);
    if (!chaptersMatch) {
      return null;
    }

    const chaptersStr = chaptersMatch[1];
    const chapters: ManualChapter[] = [];

    // 使用正则提取每个 chapter 对象
    const chapterRegex = /\{\s*id:\s*["']([^"']+)["'],\s*relPath:\s*["'][^"']*["'],\s*title:\s*["']([^"']+)["'],\s*content:\s*["']([\s\S]*?)["']\s*\}/g;

    let match;
    let order = 0;
    while ((match = chapterRegex.exec(chaptersStr)) !== null) {
      chapters.push({
        id: match[1],
        title: match[2],
        content: unescapeContent(match[3]),
        order: order++
      });
    }

    // 如果正则没匹配到，尝试简单解析
    if (chapters.length === 0) {
      // 简化解析：提取 id 和 title
      const simpleRegex = /id:\s*["']([^"']+)["'][\s\S]*?title:\s*["']([^"']+)["']/g;
      while ((match = simpleRegex.exec(chaptersStr)) !== null) {
        chapters.push({
          id: match[1],
          title: match[2],
          content: "",
          order: order++
        });
      }
    }

    return {
      slug,
      title: slug === "unity-easy-chart" ? "Unity Easy Chart" : slug,
      description: "",
      generatedAt,
      chapters
    };
  } catch {
    return null;
  }
}

function unescapeContent(str: string): string {
  return str
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}

/**
 * 加载 Manual 的配置文件 (JSON 格式)
 * 新结构: docs/Manual/{slug}/manual-config.json
 */
export function loadManualConfig(slug: string): ManualConfig | null {
  const productDir = path.join(MANUAL_DIR, slug);
  const configFile = path.join(productDir, "manual-config.json");

  if (!fs.existsSync(configFile)) {
    return null;
  }

  try {
    const content = fs.readFileSync(configFile, "utf-8");
    return JSON.parse(content) as ManualConfig;
  } catch {
    return null;
  }
}
