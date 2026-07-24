# 组件库文档

## Goal

为 **happier-ui** 建立 **VitePress** 文档站：覆盖 **TW4 接入**、**token / `h-` utility**、**全部 11 个 `H*` 组件**（API + 示例），并通过 **GitHub Pages** 自动部署公开访问。

## 背景（仓库已确认）

- 11 个公共组件；样式体系 0.0.2：TW4 + `happier-ui/styles` + `--h-*` / `h-` utility + BEM。
- 现有：README + playground 冒烟；无 docs 站。
- 仓库 `homepage` 仍指向 GitHub README；仅有 npm `release.yml`，无 Pages workflow。
- 语言：文档默认 **简体中文**。

## 已确认决策

- 任务类型：**复杂**
- 对齐 **0.0.2** 接入；不写 0.0.1 无 Tailwind 主路径
- **形态：VitePress**；playground 保留冒烟
- **首版内容：全量 11 组件** + 指南页
- **部署：GitHub Pages + Actions 自动部署**

## 开放决策

（无。产品决策已收敛；实现细节见 `design.md`。）

## MVP 需求

| 能力 | 约定 |
|------|------|
| 站点 | VitePress；本地 `docs:dev` / 构建 `docs:build` |
| 指南 | 首页、快速开始、安装与 TW4、token/utility、主题/BEM 覆盖、相对 0.0.1 breaking |
| 组件 | 11 个 `H*` 各一页：简介、可运行/可复制示例、props/emits/slots、a11y 要点 |
| 样式 | 文档内组件演示正确加载 happier styles + TW4 |
| 部署 | GitHub Pages workflow；README 链到文档 URL |
| 规范 | frontend/directory 等 spec 补充 docs 约定 |

## 明确不做

- Storybook / 仅 README 扩写
- 多语言、HeroUI 全站复刻、`@heroui/*`
- 改造 Muses 业务文档
- 替代 playground（两者并存）
- 在本任务内强制 `npm publish 0.0.2`（可链文档，发版另确认）

## Acceptance Criteria

- [ ] `npm run docs:dev` 可本地预览；`npm run docs:build` 成功
- [ ] 指南页覆盖接入 + token + breaking
- [ ] 11 个 `H*` 均有文档页，示例与 0.0.2 API 一致
- [ ] 文档站内组件演示样式正确（TW4 + styles）
- [ ] GitHub Pages workflow 存在；README 写明本地与线上文档入口
- [ ] package.json scripts / 相关 spec 已更新
- [ ] playground 仍可独立运行

## Notes

- 线上 URL 形如 `https://happier-x.github.io/happier-ui/`（以仓库 owner/name 为准）；`base` 需匹配。
- 用户需在 GitHub 仓库 Settings → Pages 将 Source 设为 **GitHub Actions**（首次部署）。
