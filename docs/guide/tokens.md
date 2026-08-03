# Token 与 utility

## 权威

- 文件：`src/styles/tokens.css`（包内：`happier-ui/tokens.css` / styles 内嵌）
- 前缀：**`--h-*`**
- 视觉：HeroUI Native 语义角色（oklch 默认色板，accent `oklch(0.6 0.2 230)` 为主色）；**禁止** Material elevation

## 宿主接入

```css
@import "tailwindcss";
@import "happier-ui/styles";
```

## `@theme` 与 `h-` utility

映射在 `theme.css`。公共 utility **带 `h-` 命名空间**，与 token 对应：

| Token | Utility 示例 |
|-------|----------------|
| `--h-color-primary` | `bg-h-primary` `text-h-primary` |
| `--h-color-primary-contrast` | `text-h-primary-contrast` |
| `--h-color-surface` | `bg-h-surface` |
| `--h-color-surface-secondary` | `bg-h-surface-secondary` |
| `--h-color-ink` | `text-h-ink` |
| `--h-color-ink-muted` | `text-h-ink-muted` |
| `--h-color-border-subtle` | `border-h-border-subtle` |
| `--h-space-sm` / `md` / `lg` | `p-h-sm` `gap-h-md` `px-h-lg` |
| `--h-radius-control` | `rounded-h-control` |
| `--h-font-label` | `text-h-label` |

**不**把无前缀 `bg-primary` 作为库公共契约（避免与宿主冲突）。

### 演示

<div class="h-demo h-demo--row">
  <span class="rounded-h-control bg-h-primary px-h-md py-h-sm text-h-primary-contrast text-h-label">bg-h-primary</span>
  <span class="rounded-h-control bg-h-surface-secondary px-h-md py-h-sm text-h-ink text-h-label">bg-h-surface-secondary</span>
  <span class="rounded-h-control border border-h-border-subtle px-h-md py-h-sm text-h-ink-muted text-h-label">text-h-ink-muted</span>
</div>

```html
<div class="bg-h-surface text-h-ink rounded-h-control p-h-md gap-h-sm">
  …
</div>
```

## CSS 变量用法

组件与业务 CSS 推荐带 fallback：

```css
.my-row {
  color: var(--h-color-ink-muted, #92949c);
  border-radius: var(--h-radius-control, 12px);
  min-height: var(--h-touch-target, 48px);
}
```

## 分组概览

| 组 | 示例 |
|----|------|
| 主色阶 | `--h-primary-50` … `--h-primary-900`（由 accent 派生） |
| 语义色 | `--h-color-accent` / `--h-color-primary`、`--h-color-surface`、`--h-color-danger`、`--h-color-focus-ring` |
| 间距 / 圆角 / 字号 | `--h-space-*`、`--h-radius-*`、`--h-font-*` |
| 控件专用 | `--h-button-*`、`--h-input-*`、`--h-switch-*`、`--h-dialog-*` … |
| 触控 / 层级 | `--h-touch-target`、`--h-z-nav`、`--h-z-tab` |

组件级尺寸 token 可只做 CSS 变量，不必全部 utility 化。

## 兼容别名

styles 内保留 `--muses-* → var(--h-*)`，供 Muses 存量字符串过渡。**新代码只写 `--h-*`。**

## 反模式

- 组件内写死某色（如 `#006fee`）而不走 `--h-color-primary`
- 新增 elevation shadow「看起来更立体」
- 把无前缀 `bg-primary` 写成库公共 utility
- 继续文档化 0.0.1「只引 style.css、无需 Tailwind」路径
