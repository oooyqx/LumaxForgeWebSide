export const LANGS = ["zh", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "zh";

type Dictionary = {
  siteName: string;
  navHome: string;
  navProducts: string;
  navAssetStore: string;
  navDocs: string;
  heroTitle: string;
  heroSubtitle: string;
  productsTitle: string;
  productsSubtitle: string;
  productsEmpty: string;
  assetStoreTitle: string;
  assetStoreSubtitle: string;
  assetStoreEmpty: string;
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
    navProducts: "Products",
    navAssetStore: "Asset Store",
    navDocs: "文档",
    heroTitle: "LumaxForge",
    heroSubtitle: "",
    productsTitle: "",
    productsSubtitle: "",
    productsEmpty: "当前还没有解决方案产品内容。",
    assetStoreTitle: "Asset Store",
    assetStoreSubtitle: "探索我们在 Unity Asset Store 上发布的工具和资源，助力您的游戏开发。",
    assetStoreEmpty: "当前没有可展示的 Asset Store 产品数据。",
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
    backToProduct: "返回产品"
  },
  en: {
    siteName: "LumaxForge",
    navHome: "Home",
    navProducts: "Products",
    navAssetStore: "Asset Store",
    navDocs: "Docs",
    heroTitle: "LumaxForge",
    heroSubtitle: "",
    productsTitle: "",
    productsSubtitle: "",
    productsEmpty: "No solution products have been added yet.",
    assetStoreTitle: "Asset Store",
    assetStoreSubtitle: "Explore our tools and resources published on Unity Asset Store to power up your game development.",
    assetStoreEmpty: "No Asset Store product data is available yet.",
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
