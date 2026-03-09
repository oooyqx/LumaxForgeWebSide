import { defineCollection, z } from "astro:content";

const productCollection = defineCollection({
  type: "content",
  schema: z.object({
    productSlug: z.string(),
    lang: z.enum(["zh", "en"]),
    title: z.string(),
    summary: z.string(),
    assetStoreUrl: z.string().url(),
    docsUrl: z.string().optional(),
    price: z.string().optional(),
    version: z.string().optional(),
    unityVersion: z.string().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    gallery: z.array(z.string()).default([]),
    youtube: z.array(z.string()).default([]),
    videos: z.array(z.string()).default([]),
    downloads: z
      .array(
        z.object({
          title: z.string(),
          url: z.string()
        })
      )
      .default([]),
    updatedAt: z.union([z.string(), z.date()]).optional()
  })
});

const manualCollection = defineCollection({
  type: "content",
  schema: z.object({
    productSlug: z.string(),
    lang: z.enum(["zh", "en"]),
    chapterSlug: z.string(),
    order: z.number().default(9999),
    title: z.string(),
    sourceFile: z.string().optional()
  })
});

export const collections = {
  products: productCollection,
  manuals: manualCollection
};
