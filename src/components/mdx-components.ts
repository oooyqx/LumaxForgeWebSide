import type { MDXComponents } from "mdx/types";
import ImageGallery from "./mdx/ImageGallery.astro";
import VideoPlayer from "./mdx/VideoPlayer.astro";
import YouTubeEmbed from "./mdx/YouTubeEmbed.astro";
import DocLink from "./mdx/DocLink.astro";

export const mdxComponents: MDXComponents = {
  ImageGallery,
  VideoPlayer,
  YouTubeEmbed,
  DocLink
};
