---
name: ash-blog-maintainer
description: 维护 AshLab 静态博客中的 Markdown 文章，包括新增或修改文章、同步 wiki 原稿、维护 Frontmatter、执行本地检查，以及在用户明确要求时提交并推送内容更新。仅用于 AshLab 内容维护，不用于主题重构、依赖升级或 Vercel 配置。
---

# Ash Blog Maintainer

在 AshLab 仓库中完成文章维护，并尽量保持改动小、可核对。

## 先确认仓库与范围

- 工作目录应包含 `package.json`，且包名为 `ash-blog`。
- 先运行 `git status --short`。保留用户已有改动，不撤销、不覆盖无关文件。
- 网站发布文章的唯一读取目录是 `src/content/posts/`；`wiki/` 不会被网站自动读取。
- 普通文章请求只修改文章、对应 Wiki 原稿和必要的文章资源。不要顺带修改主题、横幅、依赖、部署配置或生成目录。
- 不修改 `dist/`、`.astro/`、`node_modules/` 中的文件。

## 选择工作方式

### 修改现有文章

1. 用标题、slug 或正文关键词在 `src/content/posts/` 中定位发布文件。
2. 检查 `wiki/` 中是否存在同标题原稿。
3. 按用户要求修改正文，保留原有语气、链接、公式、代码和 Markdown 结构；不要自行扩写或重写未要求的部分。
4. 如果发布文章与 Wiki 明显是同一篇，正文改动默认同步到两处；Frontmatter 只存在于发布文件中。用户明确要求仅修改一处时除外。
5. 实质性正文修改时，将发布文件的 `updated` 更新为当前 Asia/Shanghai 日期，格式为 `YYYY-MM-DD`。
6. 除非用户明确要求，不修改 `published`、`slug`、`draft`、`pinned` 或 `featured`。

### 用户说“Wiki 有变动”

1. 找到新增或修改的 `wiki/**/*.md` 文件，并读取完整内容。
2. 按标题查找现有发布文章。
3. 已有发布文章时，将 Wiki 的正文变化同步进去，但保留发布文章 Frontmatter；不要用整文件覆盖。
4. Wiki 首行若是与文章标题相同的一级标题，发布副本中删除该重复 H1，因为页面布局已经显示标题。
5. 新 Wiki 尚无发布副本时，按“新增文章”流程创建；默认保留为草稿，除非用户明确要求发布。

### 新增文章

1. 选择简短、稳定、全站唯一的英文或拼音 slug。先搜索现有 `slug:`，避免重复。
2. 运行 `pnpm new-post <slug> "<中文标题>"` 生成模板，不手写另一套字段结构。
3. 填写摘要、分类和标签；默认 `draft: true`。用户明确要求立即发布时才设为 `false`。
4. 删除模板正文中与 Frontmatter 标题重复的 `# 标题`。
5. 图片较多时使用 `src/content/posts/<slug>/index.md` 和同目录资源；封面写为 `cover_path: "./cover.webp"`。公共图片才使用 `/assets/...` 路径。

修改 Frontmatter、创建文章或处理定时发布时，读取 [references/article-format.md](references/article-format.md)。

## 本地验证

完成编辑后执行：

```bash
pnpm check
pnpm build
```

- 两个命令都成功才算完成。
- 允许报告项目已有的非阻断提示，但不能把构建错误当作成功。
- 草稿在开发模式中可能可见，但生产构建会隐藏；不要仅根据开发页面判断文章已经发布。
- 如果依赖已经安装而 `pnpm` 仅因包管理器元数据联网失败，可使用仓库 `node_modules/.bin` 中的本地 Astro 和 Pagefind 可执行文件完成等价检查。不要擅自升级依赖。

## Git 与上传边界

- 用户只要求修改或预览时，不提交、不推送、不部署。
- 提交前确认 `.gitignore` 已屏蔽本地代理与编辑器状态目录：`.pi/`、`.claude/`、`.codex/`、`.cursor/` 等，以及 `.env`、`tmp/`、构建产物。缺少时补上该规则，避免把本地工具状态提交进仓库。
- 用户明确要求上传到 GitHub 时，先完成检查，再扫描常见密钥格式并查看暂存差异。
- 仅提交本次任务和用户明确放入仓库的相关文件；不要丢弃其他改动。
- 使用普通 `git push`，禁止强推、重写历史或删除远程分支。
- 认证失败时停止并说明需要登录，不索取或回显聊天中的密钥。
- 推送后比较本地 `HEAD` 与远程分支哈希，并确认是否一致。

## 交付说明

简要报告：

- 修改或新增了哪些文章；
- 是否同步了 Wiki；
- `draft` 状态和文章 URL；
- `pnpm check`、`pnpm build` 是否通过；
- 是否提交或推送，以及提交哈希。

