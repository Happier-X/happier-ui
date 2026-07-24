# 主题与覆盖

## 覆盖 CSS 变量

在宿主全局样式中，于 `happier-ui/styles` **之后**覆盖 `:root`（或主题作用域）：

```css
@import "tailwindcss";
@import "happier-ui/styles";

:root {
  --h-color-primary: #5b21b6;
  --h-radius-control: 16px;
}
```

`h-` utility 经 `@theme` 映射到同一批变量，覆盖 token 后 utility 与组件会一起变化（具体取决于 Tailwind 与变量引用方式）。

## 覆盖组件 BEM（`@layer components`）

组件类名在 **`@layer components`** 中，前缀 **`h-*`**，例如：

- `.h-button` / `.h-button--primary` / `.h-button--md`
- `.h-switch` / `.h-input` / `.h-dialog` …

同源 layer 中可追加或覆盖：

```css
@layer components {
  .h-button--primary {
    /* 宿主定制：慎用魔法数，优先改 token */
    letter-spacing: 0.02em;
  }
}
```

避免用未 layer 的全局标签选择器污染宿主。

## 深色 / 多主题

库当前以 **浅色 surface** 语义为主。多主题可由宿主切换 root 变量实现，例如：

```css
[data-theme='dark'] {
  --h-color-surface: #1f1f1f;
  --h-color-ink: #f4f4f5;
  --h-color-ink-muted: #a1a1aa;
  --h-color-border-subtle: #3f3f46;
}
```

沉浸播放等场景可使用 `--h-immersive-*` 一组 token（宿主按需）。

## 与 scoped 样式的边界

- **库组件**：视觉写在 `styles/components/*.css`，SFC **无**大块 scoped 视觉 CSS。
- **宿主**：可用 scoped 包业务类；不要复制整份 Ionic CSS 变量当设计系统。

## 触控与 a11y

- 默认可触控热区 ≥ `--h-touch-target`（48px）
- 可交互控件保留 `:focus-visible`
- 覆盖样式时勿去掉焦点环（可用 `--h-color-focus-ring`）
