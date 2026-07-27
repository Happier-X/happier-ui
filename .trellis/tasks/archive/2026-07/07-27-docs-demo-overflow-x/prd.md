# docs-demo-overflow-x

## Goal

修复组件库文档站中热力图（HHeatmap）演示超出正文内容区域的问题，并把「文档演示区对超宽内容的处理约定」沉淀到 spec，避免后续组件文档重复踩坑。

## Background

- `.h-heatmap` 为 `display: inline-flex` 固有宽度组件：一年数据 ≈ 53 列 ×（格子边长 + 间距），medium 档总宽约 800px+。
- VitePress 正文内容区约 688px，导致热力图演示横向溢出页面。
- 热力图与 GitHub 贡献图同类，属于「内容天然比容器宽」的组件；格子边长是设计 token（10/12/15px），不应为迁就容器而压缩。

## Requirements

- 文档演示容器 `.h-demo` 对超宽内容提供横向滚动（`overflow-x: auto`），不修改组件库源码、不调整热力图 token。
- 该约定需覆盖所有组件文档演示（table 等潜在超宽演示同样受益）。
- 在 `.trellis/spec/frontend/` 记录此约定。
- `npm run docs:build` 构建通过。

## Acceptance Criteria

- [x] `docs/.vitepress/theme/custom.css` 的 `.vp-doc .h-demo` 增加 `overflow-x: auto`
- [x] 热力图文档页（docs/components/heatmap.md）演示不再撑破内容区，容器内可横向滚动
- [x] `npm run docs:build` 通过，产物 CSS 包含 `overflow-x:auto`
- [ ] spec 文档记录约定并提交

## Notes

- 轻量任务，PRD-only；实现已在会话中直接完成（单行 CSS）。
