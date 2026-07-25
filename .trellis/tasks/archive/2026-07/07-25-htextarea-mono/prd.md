# HTextarea 支持等宽字体（monospace）

对应 GitHub issue #8。

## Goal

让 `HTextarea` 能为内部 `<textarea>` 应用等宽字体族，改善 JSON / 环境变量 / curl 等结构化文本的可读性与对齐，并区分易混字符（`0`/`O`、`1`/`l`）。

## Background

`HTextarea` 根元素是 `<div class="h-textarea">`，外部传入的 `class` 落在外层 div，而表单元素默认不继承父级 `font-family`，因此在外层加 `font-mono` 对真正的 `<textarea>` 无效。当前也没有等宽开关，导致从手写 `<textarea class="font-mono">` 迁移到 `HTextarea` 后无法保留等宽体验。

## Requirements

- `HTextarea` 新增 prop：`mono?: boolean`，默认 `false`。
  - `mono` 为真时，为内部 `.h-textarea__control` 应用等宽字体族。
- 新增 token `--h-font-mono`（等宽字体栈），供 mono 模式引用；消费方可覆盖。
- 用 BEM 修饰类 `h-textarea--mono`（挂在根 div），CSS 在 `src/styles/components/textarea.css` 的 `@layer components` 中定义，遵循 `var(--h-…, fallback)` 约定。
- 不改动现有 v-model / label / error / size / resize / count 契约与 DOM 结构。

## Constraints

- 不引入新依赖。
- 不改 `h-*` 现有类名语义；仅新增修饰类与 token。
- 向后兼容：默认 `mono=false`，现有用法零变化。

## Acceptance Criteria

- [ ] `HTextarea` 传 `mono` 时内部 `<textarea>` 呈等宽字体；不传时保持原字体。
- [ ] 新增 `--h-font-mono` token，mono 样式引用它并带系统等宽 fallback。
- [ ] `component-guidelines.md`（HTextarea 描述 / API 约定 / 当前导出表）、docs `textarea.md`、playground 演示同步更新。
- [ ] `npm run build:lib` 与 playground `vue-tsc` 通过。

## Notes

- 场景：粘贴 JSON 分享串、curl、多行环境变量。
