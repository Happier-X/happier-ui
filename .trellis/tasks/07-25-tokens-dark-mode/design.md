# Design — tokens 去 Ionic 依赖 + 独立暗色态（#11）

## 边界

只改 `src/styles/tokens.css`（token 源值 + 新增暗色覆盖块）。`theme.css` 的 `@theme` 桥接读的是 `var(--h-color-*)`，token 值变化自动透传，**无需改** theme.css。组件 CSS、组件 SFC、`h-*` class 名一律不动。

## 一、去 Ionic 依赖（浅色态默认值）

把 5 处 `var(--ion-*)` 换成库内基色，取值 = 原 fallback（保持 0.0.4 浅色观感不变）：

| token | 0.0.4（含 ion 反向依赖） | 改后（库内基色） |
|---|---|---|
| `--h-color-ink` | `var(--ion-text-color, #000000)` | `#000000` |
| `--h-color-ink-muted` | `var(--ion-color-medium, #92949c)` | `#92949c` |
| `--h-color-border-subtle` | `var(--ion-color-step-150, #e0e0e0)` | `#e0e0e0` |
| `--h-color-cover-placeholder` | `rgba(var(--ion-color-medium-rgb, 146,148,156), .16)` | `rgba(146, 148, 156, 0.16)` |
| `--h-color-danger` | `var(--ion-color-danger, #eb445a)` | `#eb445a` |

`--h-color-danger-rgb: 235, 68, 90` 已与 `#eb445a` 一致，无需改。改后全文 `grep --ion-` 为空。

## 二、暗色态（方案 C：media + class）

### 需要暗色覆盖的 token

只需覆盖「决定明暗观感」的中性色，主色阶 / success / warning / 圆角 / 间距等不随明暗变：

| token | 浅色 | 暗色 |
|---|---|---|
| `--h-color-surface` | `#ffffff` | `#1c1c1e` |
| `--h-color-surface-secondary` | `#f4f4f5` | `#2c2c2e` |
| `--h-color-ink` | `#000000` | `#ffffff` |
| `--h-color-ink-muted` | `#92949c` | `#a1a1aa` |
| `--h-color-border-subtle` | `#e0e0e0` | `#38383a` |
| `--h-color-cover-placeholder` | `rgba(146,148,156,.16)` | `rgba(255,255,255,.14)` |

派生 token（`--h-color-separator`、各 `--h-*-bg` 引用 surface 等）通过 `var()` 自动跟随，不用单独覆盖。`--muses-*` 别名同理自动继承。

`--h-color-danger`（#eb445a）在明暗下都可读，暂不翻转。主色 `--h-color-primary` 暗色下同样保留（HeroUI blue 在暗底可读）。

### 触发结构（关键：让 class 能双向覆盖 media）

三段式，保证「系统暗 + 用户手动切浅」也成立：

```css
:root {
  /* 浅色默认值（含去 ion 后的基色） */
  --h-color-surface: #ffffff;
  ...
}

/* 跟随系统：系统暗色时翻暗，但允许 .light 强制回浅 */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --h-color-surface: #1c1c1e;
    ...
  }
}

/* 手动：.dark 类无视系统强制暗色 */
:root.dark,
.dark {
  --h-color-surface: #1c1c1e;
  ...
}
```

- 仅系统暗 → `:root:not(.light)` 命中 → 暗。
- 系统暗 + 宿主挂 `.light` → media 块不命中 → 回浅。
- 系统浅 + 宿主挂 `.dark` → `.dark` 块命中 → 暗。
- 暗色值写两份（media 块 + class 块），用同一组变量值，避免漂移。

### `.dark` 选择器双写

`:root.dark`（class 挂在 `<html>`，如 VitePress）与 `.dark`（class 挂在任意容器，局部暗色）都覆盖，兼顾全局与局部。

## 兼容与回归

- 浅色态取值 = 原 fallback → 不引入 Ionic 的项目浅色观感与 0.0.4 完全一致；仍引入 Ionic 的项目失去 `--ion-*` 联动（可接受：#11 的目标就是解耦，且 muses 正在移除 Ionic）。
- `--muses-*` 别名不动，继续 `var(--h-*)`，Muses 存量样式与暗色自动继承。
- docs 的 VitePress 在 `<html>` 挂 `.dark`，命中 `:root.dark` → live demo 暗色随 VitePress 切换联动（顺带收益，无需额外代码）。

## 风险

- 暗色色值为一次性视觉判断，需 playground/docs 目视核验对比度（surface vs ink、border 可见性、heatmap 各 level 在暗底可辨）。
- `@media` + `:root:not(.light)` 的特异性低于 `:root.dark`，符合预期（class 应赢过 media）；需确认无组件 CSS 用更高特异性写死中性色（已知组件 CSS 均通过 `var(--h-*)` 取色，风险低）。
