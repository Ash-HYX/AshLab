# AshLab 文章格式

只在创建文章、修改 Frontmatter、处理封面或定时发布时读取本参考。

## 推荐 Frontmatter

```yaml
---
title: "文章标题"
published: 2026-10-31
updated: 2026-10-31
description: "用于文章列表和分享元数据的简短摘要。"
cover_path: ""
categories:
  - 学习笔记
tags:
  - C++
draft: true
pinned: false
featured: false
slug: "stable-unique-slug"
lang: "zh_CN"
# publish_at: "2026-11-01T08:00:00+08:00"
---
```

## 字段规则

- `title`：必填，显示标题。
- `published`：必填，首次发布日期；普通修改不要改变。
- `updated`：正文有实质变化时更新为当前 Asia/Shanghai 日期。
- `description`：建议填写一至两句纯文本摘要，不复制大段正文。
- `cover_path`：可选。留空时不显示封面占位。
- `categories`：数组，可以有多个分类。
- `tags`：数组，可以有多个标签。
- `draft`：`true` 时生产构建不发布；开发环境仍可能显示。
- `pinned`：是否置顶。
- `featured`：是否标记为精选。
- `slug`：文章 URL 标识，全站唯一；发布后保持稳定。
- `lang`：中文文章使用 `zh_CN`。
- `publish_at`：可选，使用带 `+08:00` 的 ISO 时间；时间未到时生产构建隐藏文章。

兼容字段 `image` 和 `category` 只用于旧内容。新文章使用 `cover_path` 和 `categories`。

## 图片组织

推荐目录结构：

```text
src/content/posts/example/
|-- index.md
|-- cover.webp
`-- diagram.png
```

对应写法：

```yaml
cover_path: "./cover.webp"
```

正文中使用相对路径引用同目录图片。已放在 `public/` 下的共享资源使用以 `/` 开头的站点路径。

## Markdown 约束

- Frontmatter 标题已经由页面布局渲染，正文不要再写相同的一级标题。
- 保留代码块语言标识，例如 `cpp`、`python`、`java`。
- 不破坏 LaTeX 的 `$...$` 和 `$$...$$` 边界。
- 外部链接保留原目标；除非用户要求，不删除查询参数或替换来源。
- 中文内容使用简体中文；代码、标识符和专有名词保持原样。

