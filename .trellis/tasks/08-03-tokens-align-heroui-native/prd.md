# 配色对齐 HeroUI Native + 语义自洽（tokn oklch 迁移）

## Goal

把 `--h-*` 的**配色值**对齐 HeroUI Native（v3，oklch 默认色板），同时让**我们自己的语义 token 命名保持合理自洽**（不照搬 HeroUI 的 `--surface/--foreground` 等词汇）。保留 `--h-*` 前缀与 `--muses-*` 兼容别名，保持对现有组件/宿主的**非破坏**（同名 token 复用）。

## Background / 现状（证据）

- 权威 token：`src/styles/tokens.css`（`src/tokens.css` 仅 re-export）。前缀 `--h-*`；`theme.css` 映射出 `h-` utility。
- 当前实现实为 **HeroUI v2 编号色阶 + hex** 方案：`--h-primary-50…900`（`#006` 主色）+ 每个语义色 hex。视觉上仅是「名义对齐」Native。
- HeroUI Native（v3）：**单一 accent + oklch**，编号色阶淡出，靠 `oklch(from …)` 派生 hover/soft。
- 使用量（src）：`--h-color-primary`×50、`ink-muted`×49、`border-subtle`×39、`ink`×38、`surface`×35、`surface-secondary`×26、`danger`×22、`focus-ring`×20。
- **编号色阶在用**：`button.css` hover/active/soft 用 `--h-primary-400/600/50/100/200`；docs 文档化了 hover/active 映射 → 保留由 accent 派生的色阶为非破坏优先。
- **`-rgb` 半透明**：`--h-color-primary-rgb`（15 处）+ `--h-color-danger-rgb`（12 处）+ `--h-color-primary-contrast-rgb`（2 处）做 `rgba(var(--h-color-x-rgb), a)` 透明底色（badge/button/input/select/tag/scrollbar）。→ 保留 `-rgb` 三元组 + rgba 写法，最小 diff。
- 冗余待清理：`--h-color-surface-secondary` 与 `--h-color-bg-muted` 同为 `#f4f4f5`；`--h-color-separator = border-subtle`。
- 明暗遵守方案 C（base+media+class），只覆中性色。
- 兼容链路：`--muses-*` → `var(--h-*)`（仅 tokens.css / docs 引用，轻）。

## HeroUI Native 默认语义值（oklch，采纳）

| 角色 | 亮 | 暗 |
|------|----|----|
| accent | `0.6 0.2 230` | （我们的主色不随明暗变 → 常量） |
| success | `0.72 0.14 165` | 常量 |
| warning | `0.78 0.12 85` | 常量 |
| danger | `0.68 0.18 15` | 常量 |
| default/背景/中性 | `0.94~0.98` 系 | `0.22 0.046 230` 系 |
| separator | `0.91 0.015 230` | — |

## Requirements

1. `--h-color-primary` 色值替换为对齐 HeroUI accent 的 oklch `oklch(0.6 0.2 230)`；引入 `--h-color-accent` 为其Hero-aligned 规范名，`primary` 作 alias。
2. `--h-color-success / warning / danger` 值对齐 HeroUI 默认（oklch，常量不随明暗）。
3. 中性色（ink / ink-muted / surface / surface-secondary / border-subtle / separator / bg-muted / bg-hover）改为 oklch 中性系（230 hue 家族），亮暗两态各自对齐 HeroUI 中性深浅；仍按方案 C 覆。
4. 保留 `-rgb` 三元组（=`对应 OKLCH/hex 的 sRGB 值`），组件 rgba 写法不动。
5. 保留 `--h-primary-50…900` 派生色阶（由 accent 派生，非破坏 button/docs）；语义自洽做去重：`bg-muted` 与 `surface-secondary` 收敛一致、`separator` 与 `border-subtle` 收敛。
6. `@theme`、docs、spec /tokens.md、`--muses-*` 连动更新，保持 `bg-h-primary/…` 等 utility 名称不变。
7. 不加 Material elevation shadow。

## Acceptance Criteria

- [x] `tokens.css` 基础语义色全部为 oklch（accent/success/warning/danger + 中性亮暗），主色对齐 HeroUI `oklch(0.6 0.2 230)`。
- [x] `--h-color-* -rgb` 三元组仍与服务色成同一视觉色（primary=`0,144,223`、danger=`242,96,116`）；rgba 写法不动，构建验证。
- [x] button 各 variant 色阶派生自新 accent，hover/active/soft 引用不变。
- [x] `h-` utility 名不变，`@theme` 已有 accent 映射，primary/surface/ink 等值自动跟随。
- [x] 明/暗 media/class 两组逐字一致。
- [x] docs/guide/tokens.md 与 `.trellis/spec/frontend/tokens.md` 已更新为「oklch + HeroUI Native 色值」口径。
- [x] `npm run build:lib` / `build:playground` 均通过。

## Out of Scope

- 不改名 `--h-color-surface` 等为 HeroUI 词汇（保留我们语义名，仅值对齐 + 去重自洽）。
- 不批量把组件从 rgba → color-mix 迁移（保留 `-rgb` 三元组模式）。
- 不引入 Material elevation / 新投影 token。
- 不因本次改动给组件添加新视觉变化（仅换色源，观感尽量一致）。

## Open Questions

- 无阻塞（方向已定；具体中性 oklch 数值实现期定）。