# LumaxForge Official Site

LumaxForgeLLC 官网，展示 Asset Store 插件产品。  
技术栈：Astro SSG + Content Collections + MDX + Cloudflare Pages。

## 1. 本地开发

```bash
npm install
npm run dev
```

构建命令：

```bash
npm run build
```

输出目录：`dist`

## 2. 路由规范

- 中文首页：`/zh`
- 英文首页：`/en`
- 产品列表：`/<lang>/products`
- 产品详情：`/<lang>/products/<slug>`

## 3. 如何新增一个产品

1. 新建中英文内容文件：
   - `src/content/products/<slug>.zh.mdx`
   - `src/content/products/<slug>.en.mdx`
2. 填写 frontmatter：
   - `productSlug`、`lang`、`title`、`summary`、`assetStoreUrl`
   - 可选：`gallery`、`youtube`、`videos`、`downloads`、`updatedAt`
3. 在正文中可直接使用 MDX 组件：
   - `<ImageGallery images={[...]} />`
   - `<VideoPlayer src="/media/xxx.mp4" />`
   - `<YouTubeEmbed id="xxxxxxx" />`
   - `<DocLink href="/docs/xxx.pdf" label="Docs" />`
4. 媒体文件放到：
   - 图片/视频：`public/media/<slug>/...`
   - 文档：`public/docs/<slug>/...`

## 4. Cloudflare Pages 部署

1. 代码推送到 GitHub 仓库。
2. Cloudflare Dashboard -> Pages -> Create project -> Connect to Git。
3. 构建配置：
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. 等待首次部署完成。

## 5. 绑定域名

1. Pages 项目 -> Custom domains -> 添加根域名（如 `lumaxforge.com`）。
2. 再添加 `www.lumaxforge.com`。
3. 在 Cloudflare Rules -> Redirect Rules 设置：
   - `www.lumaxforge.com/*` 301 到 `https://lumaxforge.com/${1}`
4. 根路径 `/` 已通过 `public/_redirects` 跳转到 `/zh`。
