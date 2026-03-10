import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://lumaxforge.com",
  integrations: [mdx(), sitemap()],
  output: "static",
  adapter: cloudflare()
});