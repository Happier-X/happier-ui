# HButton 合并 isIconOnly 并修正 ghost 配色

## Goal

对齐 HeroUI Native：图标按钮不再是独立组件，而是 HButton 的 `isIconOnly` 能力；同时把 ghost variant 的配色改回 HeroUI 的「透明底 + 墨色字」，去掉当前的蓝字蓝光底。

## Background

- HeroUI Native 的 Button 用 `isIconOnly` prop 表达纯图标（`.button__root--is-icon-only`：`padding:0; aspect-ratio:1`），图标作为 children 传入，不存在独立的 IconButton 组件。
- HeroUI Native 的 ghost：`background: transparent`，label 用 `--color-default-foreground`（正文/墨色），并非主色蓝。当前本库把 ghost 做成主色蓝字 + 主色柔光底，视觉偏向 light/secondary，与参考不一致。

## Requirements

- HButton 新增能力：
  - `isIconOnly?: boolean`（默认 false）：方形按钮，`aspect-ratio:1`、`padding:0`，尺寸边长复用现有 button height token。
  - `shape?: 'square' | 'circle'`（默认 square）：仅在 `isIconOnly` 语义下影响圆角；square 用 `--h-radius-control`，circle 用全圆角 token。
  - `ariaLabel?: string`：纯图标时提供可访问名。图标本身为装饰性（aria-hidden）。
  - 图标通过默认插槽传入（与 HeroUI children 一致）。
- 修正 ghost variant 配色，对齐 HeroUI Native：
  - 文字色：`--h-color-primary` → `--h-color-ink`（墨色/正文色）。
  - 按下态底色：主色柔光 → 中性 `--h-color-surface-secondary`。
- 删除独立的 `HIconButton` 组件及 `icon-button.css`，把其中仍需保留的尺寸/形状规则并入 `button.css`。
- 同步更新所有引用点：`src/index.ts` 导出、`HSidebar` 内置折叠按钮、`playground/src/App.vue` 示例。
- 共享配色 selector 从 `.h-button, .h-icon-button` 收敛为仅 `.h-button`，避免遗留死类名。

## Constraints

- 保持 web / 移动端通用，主色与 token 继续用 `--h-*`。
- 不引入新依赖；沿用现有 HIcon。
- 变更后 `npm run build`（或等价构建/类型检查）通过。

## Acceptance Criteria

- [ ] HButton 支持 `isIconOnly` + `shape` + `ariaLabel`，纯图标按钮方形显示且可访问名正确。
- [ ] ghost variant 为透明底 + 墨色字，按下态为中性底，视觉与 HeroUI Native 一致。
- [ ] `HIconButton.vue` 与 `icon-button.css` 已删除，仓库无残留引用（grep 无 `HIconButton` / `h-icon-button`）。
- [ ] `HSidebar`、`index.ts`、playground 均改用新的 `HButton isIconOnly`。
- [ ] 构建 / 类型检查通过，playground 正常渲染。

## Notes

- 参考来源：HeroUI Native button.styles.ts / button.css（beta 分支）。
