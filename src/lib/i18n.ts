export const LANGS = ["zh", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "zh";

type Dictionary = {
  siteName: string;
  navHome: string;
  navProducts: string;
  heroTitle: string;
  heroSubtitle: string;
  productsTitle: string;
  productsSubtitle: string;
  details: string;
  buyOnAssetStore: string;
  docs: string;
  productInfo: string;
  productTags: string;
  productUpdated: string;
  productVersion: string;
  productUnity: string;
  productPrice: string;
  productMedia: string;
  updatedText: string;
  manualTitle: string;
  chapterList: string;
  backToProduct: string;
};

export const TEXT: Record<Lang, Dictionary> = {
  zh: {
    siteName: "LumaxForge",
    navHome: "首页",
    navProducts: "产品",
    heroTitle: "LumaxForgeLLC 的 Unity 工具产品官网",
    heroSubtitle: "面向 Unity 开发者的高效率插件，支持文档、图片、视频、YouTube 内容统一展示。",
    productsTitle: "产品列表",
    productsSubtitle: "所有产品来自 Asset Store，可直接跳转购买和查看文档。",
    details: "查看详情",
    buyOnAssetStore: "Asset Store",
    docs: "文档",
    productInfo: "产品信息",
    productTags: "标签",
    productUpdated: "更新时间",
    productVersion: "版本",
    productUnity: "Unity 兼容",
    productPrice: "价格",
    productMedia: "媒体",
    updatedText: "最近更新",
    manualTitle: "使用手册",
    chapterList: "章节目录",
    backToProduct: "返回产品页"
  },
  en: {
    siteName: "LumaxForge",
    navHome: "Home",
    navProducts: "Products",
    heroTitle: "Official Site of LumaxForgeLLC Unity Products",
    heroSubtitle: "High-efficiency plugins for Unity developers with unified docs, image, video, and YouTube content blocks.",
    productsTitle: "Products",
    productsSubtitle: "All products are from Asset Store with direct links for purchase and documentation.",
    details: "View Details",
    buyOnAssetStore: "Asset Store",
    docs: "Docs",
    productInfo: "Product Info",
    productTags: "Tags",
    productUpdated: "Updated",
    productVersion: "Version",
    productUnity: "Unity Compatibility",
    productPrice: "Price",
    productMedia: "Media",
    updatedText: "Last updated",
    manualTitle: "Manual",
    chapterList: "Chapters",
    backToProduct: "Back to Product"
  }
};

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}
