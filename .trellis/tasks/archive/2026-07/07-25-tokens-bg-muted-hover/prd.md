# 补 --h-color-bg-muted / --h-color-bg-hover token（#11 清单 B 遗漏）

## Goal

把 5 个组件 CSS 在用、但 `src/styles/tokens.css` 从未定义的两个语义 token —— `--h-color-bg-muted`、`--h-color-bg-hover` —— 补进 tokens.css 权威定义，并给它们明/暗两态取值，让相关组件在暗色下背景正确翻转。

## Background

- GitHub issue #11 修复清单 B 项，v0.0.5 落地时遗漏（A 去 Ionic、C 暗色态已完成，B 未做）。
- **确认事实（源码核对）**：
  - `tokens.css` 全文无 `--h-color-bg-muted` / `--h-color-bg-hover` 定义（明色块、暗色 media 块、`.dark` 类块均无）。
  - 9 处组件 CSS 引用这两个 token，全靠各自浅色 fallback 兜底：
    - `select.css:130` `bg-muted, #f4f4f4`
    - `badge.css:34` `bg-muted, #f4f4f4`
    - `tag.css:35` `bg-muted, #f4f4f4`
    - `pagination.css:62` `bg-hover, #f0f0f0`、`:66` `bg-muted, #e8e8e8`
    - `table.css:26` `bg-muted, #f9f9f9`、`:50` `bg-hover, #f0f0f0`、`:74` `bg-hover, #f5f5f5`、`:109` `bg-muted, #f9f9f9`
  - 后果：暗色态下这些组件背景不翻转（fallback 恒为浅色），在暗底上突兀。
- **依赖边界**：不引入新依赖，纯 CSS token 补充（仅 `src/styles/tokens.css`）。

## Requirements

- R1. `tokens.css` `:root` 明色区新增 `--h-color-bg-muted: #f4f4f5`、`--h-color-bg-hover: #f0f0f0`（对齐 issue 清单 B 明色值，与现有组件 fallback 观感一致）。
- R2. 现有两个暗色块（`@media (prefers-color-scheme: dark) { :root:not(.light) }` 与 `:root.dark, .dark`）各新增这两个 token 暗色值：`--h-color-bg-muted: #2a2a2a`、`--h-color-bg-hover: #333333`（对齐清单 B 暗色值）。
- R3. 不改组件 CSS 里的 `var(--h-color-bg-*, fallback)` 引用与 fallback 值（fallback 仅作兜底，token 定义后正常路径走 token）。
- R4. 不改 `--h-*` token 名、`h-*` class 名、组件结构；仅在 tokens.css 增补定义。
- R5. 三个 build 通过（`build:lib` / `build:playground` / `docs:build`；HSidebar `ImportMeta.env` 预存在报错除外）。

## Acceptance Criteria

- [ ] `tokens.css` `:root` 含 `--h-color-bg-muted` / `--h-color-bg-hover` 明色定义。
- [ ] 两个暗色块各含这两个 token 的暗色值，与既有 6 个中性色 token 同块、无漂移。
- [ ] `dist/tokens.css` / `dist/styles.css` 明暗块均含这两个 token。
- [ ] 组件 CSS 引用与 fallback 未改动。
- [ ] 三个 build 通过。
- [ ] spec（tokens.md 分组表）登记这两个 token。

## Out of Scope

- 调整组件 CSS 的 fallback 值或引用方式。
- issue #11 A/C 项（已在 v0.0.5 完成）。
- 其他未定义 token 的排查（本任务只补这两个）。

## Key Decisions

1. 明色值取清单 B 的 `#f4f4f5` / `#f0f0f0`（与多数组件现有 fallback 一致，观感零变化）；暗色 `#2a2a2a` / `#333333`。
2. 与 #11 既有暗色块合并写入（同 media 块 + 同 `.dark` 类块），不新开触发结构，保持一致。
