# Ash Blog

Ash 的个人静态博客，基于 [Fuwari](https://github.com/saicaca/fuwari) 和 Astro 二次开发。

## 本地开发

要求 Node.js 22 或更高版本，包管理器使用 pnpm。

```bash
pnpm install
pnpm dev
```

开发服务器默认为 `http://localhost:4321`。

## 常用命令

```bash
pnpm dev                         # 开发服务器
pnpm check                       # Astro 类型检查
pnpm build                       # 生产构建并生成 Pagefind 索引
pnpm preview                     # 预览生产构建
pnpm new-post matrix-power       # 创建草稿文章
pnpm new-post matrix-power 标题  # 创建草稿并指定中文标题
pnpm optimize-banners            # 重新生成横幅 WebP
```

## 写文章

文章位于 `src/content/posts/`。推荐一篇文章使用一个独立目录，封面和正文图片放在文章目录内。

```yaml
---
title: "文章标题"
published: 2026-10-31
updated: 2026-10-31
description: "用于列表和分享卡片的摘要。"
cover_path: "./cover.png"
categories:
  - 算法
  - 数学
tags:
  - 快速幂
  - C++
draft: false
pinned: false
featured: false
slug: "matrix-fast-power"
lang: "zh_CN"
# publish_at: "2026-11-01T08:00:00+08:00"
---
```

- `draft: true` 的文章不会进入生产构建。
- `publish_at` 晚于当前时间时，文章在到期前不会生成。
- `slug` 应保持全站唯一，发布后不要随意修改。
- 未设置 `cover_path` 时，文章卡片不会显示封面占位。

## 主要配置

- 站点、导航、社交链接和横幅：`src/config.ts`
- 友链与时间线：`src/data/site.ts`
- 头像：`public/assets/profile/avatar.jpg`
- 横幅候选：`public/assets/banners/candidates/`
- 正式横幅：`public/assets/banners/optimized/`

## 部署

1. 将仓库推送到 GitHub。
2. 在 Vercel 中导入 `Ash-HYX/AshLab`。
3. Framework Preset 选择 Astro，构建命令使用 `pnpm build`。
4. 在 Vercel 项目中启用 Web Analytics。
5. 如需定时发布，创建 Deploy Hook，并将地址保存为 GitHub Actions Secret：`VERCEL_DEPLOY_HOOK`。
6. 配置正式域名后，将环境变量 `SITE_URL` 设置为完整站点地址。

Pull Request 会由 Vercel 自动生成预览地址。GitHub Actions 会运行类型检查和生产构建。

## 版权

程序基于 Fuwari，遵循上游 MIT License。Ash 原创文章默认采用 CC BY-NC-SA 4.0。第三方和生成素材以仓库内说明为准。
