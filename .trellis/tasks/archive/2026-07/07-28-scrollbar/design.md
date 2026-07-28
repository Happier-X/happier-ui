# HScrollbar 技术设计

## 架构与边界

### 组件职责

`HScrollbar` 是一个 **CSS-only 滚动容器**：

```
┌─ .h-scrollbar  (overflow 容器 + data-scrollbar + size/color/axis 修饰符) ─┐
│  default slot（任意内容）                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

- **不** 引入 JS thumb / track / 拖拽
- **不** 使用 ResizeObserver / scroll 监听
- **不** 需要 SSR guard（纯 CSS + Vue 属性绑定）
- 视觉与行为全部由 `src/styles/components/scrollbar.css` 中的 `@layer components` 规则决定

### 与 HeroUI 对齐方式

| HeroUI | happier-ui |
|--------|------------|
| `data-scrollbar="thin\|default\|none"` | 同名 `data-scrollbar` 属性 |
| `--scrollbar-thumb` / `--scrollbar-track` | `--h-scrollbar-thumb` / `--h-scrollbar-track`（走 `--h-*`） |
| `scrollbar` / `scrollbar-thin` / `scrollbar-none` utility | `.h-scrollbar` + 修饰符类 |
| 共享 scrollbar system 跨组件 | 单层容器（MVP 不级联子树） |

### 文件边界

| 文件 | 职责 |
|------|------|
| `src/components/HScrollbar.vue` | 模板 + props；无 style；无 emits |
| `src/styles/components/scrollbar.css` | `@layer components` 全部视觉与 overflow 规则 |
| `src/styles/components.css` | `@import "./components/scrollbar.css"` |
| `src/styles/tokens.css` | 新增 `--h-scrollbar-*` token（宽度 / 色） |
| `src/index.ts` | 导出 `HScrollbar` + `HScrollbarProps` |
| `docs/components/scrollbar.md` | 文档页 |
| `docs/.vitepress/config.ts` | 侧栏入口 |
| `playground/src/App.vue` | smoke 演示区 |

## Props 合约

```ts
export interface HScrollbarProps {
  /** 滚动条模式 */
  mode?: 'thin' | 'default' | 'none'   // 默认 'thin'；绑定到 data-scrollbar
  /** 滚动方向 */
  axis?: 'x' | 'y' | 'both'            // 默认 'y'
  /** thumb 宽度档 */
  size?: 'sm' | 'md' | 'lg'            // 默认 'md' → 4 / 6 / 8 px
  /** thumb 主题色 */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger'  // 默认 'default'
  /** 根元素 class 透传 */
  class?: string | string[] | Record<string, boolean>
  /** 根元素 style 透传（常用于固定高度） */
  style?: string | Record<string, string>
  /** 无障碍名（可选，滚动区域 aria-label） */
  ariaLabel?: string
}
```

### 映射

| prop | 模板绑定 |
|------|----------|
| `mode` | `:data-scrollbar="mode"` |
| `axis` | 类修饰符 `h-scrollbar--axis-x / y / both` |
| `size` | 类修饰符 `h-scrollbar--sm / md / lg` |
| `color` | 类修饰符 `h-scrollbar--color-default / primary / …` |
| `class` / `style` | 透传到根元素 |
| `ariaLabel` | `:aria-label` |

无 emits、无 expose、无具名 slot（仅 default）。

## CSS 设计

### Token（新增到 `tokens.css`）

```css
/* 滚动条（HScrollbar） */
--h-scrollbar-size-sm: 4px;
--h-scrollbar-size-md: 6px;
--h-scrollbar-size-lg: 8px;
--h-scrollbar-thumb: color-mix(in srgb, var(--h-color-ink) 18%, transparent);
--h-scrollbar-thumb-hover: color-mix(in srgb, var(--h-color-ink) 32%, transparent);
--h-scrollbar-track: transparent;
```

> 若宿主环境不支持 `color-mix`，用 `rgba(0,0,0,0.18)` 作 fallback。  
> color 变体（primary 等）在组件 CSS 中覆盖 `--h-scrollbar-thumb`。

### 选择器结构

```css
@layer components {
  .h-scrollbar {
    box-sizing: border-box;
    /* 默认纵向 */
    overflow-y: auto;
    overflow-x: hidden;
    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: var(--h-scrollbar-thumb) var(--h-scrollbar-track);
  }

  /* WebKit thin 模式 */
  .h-scrollbar[data-scrollbar="thin"]::-webkit-scrollbar { width / height: var(--h-scrollbar-size, …) }
  .h-scrollbar[data-scrollbar="thin"]::-webkit-scrollbar-thumb { background; border-radius: pill }
  .h-scrollbar[data-scrollbar="thin"]::-webkit-scrollbar-track { background: transparent }

  /* default 模式：不覆盖 webkit 伪元素 → 浏览器原生 */
  .h-scrollbar[data-scrollbar="default"] {
    scrollbar-width: auto;
    scrollbar-color: auto;
  }

  /* none 模式 */
  .h-scrollbar[data-scrollbar="none"] {
    scrollbar-width: none;
  }
  .h-scrollbar[data-scrollbar="none"]::-webkit-scrollbar { display: none; width: 0; height: 0 }

  /* axis 修饰符 */
  .h-scrollbar--axis-x  { overflow-x: auto; overflow-y: hidden }
  .h-scrollbar--axis-y  { overflow-y: auto; overflow-x: hidden }
  .h-scrollbar--axis-both { overflow: auto }

  /* size 修饰符 → 设 --h-scrollbar-size */
  .h-scrollbar--sm { --h-scrollbar-size: var(--h-scrollbar-size-sm) }
  .h-scrollbar--md { --h-scrollbar-size: var(--h-scrollbar-size-md) }
  .h-scrollbar--lg { --h-scrollbar-size: var(--h-scrollbar-size-lg) }

  /* color 修饰符 → 覆盖 --h-scrollbar-thumb */
  .h-scrollbar--color-primary { --h-scrollbar-thumb: color-mix(... primary ...) }
  /* … success / warning / danger */

  /* 移动端：pointer coarse → 回退原生（不强制自定义 thumb） */
  @media (hover: none) and (pointer: coarse) {
    .h-scrollbar[data-scrollbar="thin"] {
      scrollbar-width: auto;
      scrollbar-color: auto;
    }
    .h-scrollbar[data-scrollbar="thin"]::-webkit-scrollbar { width: 0; height: 0 }
  }
}
```

### 关键实现注意

1. **高度必须由宿主控制**：组件本身不设 `height`/`max-height`；文档示例用 `style="height: 200px"` 或 class 设高。
2. **webkit 伪元素宽度**：纵向用 `width`，横向用 `height`；`axis=both` 时两个都设。
3. **`scrollbar-gutter`**：MVP 不启用（避免布局跳动问题留给宿主）。
4. **无 elevation / box-shadow**。

## 数据流

无状态、无事件。props → 类名 / data 属性 → CSS 伪元素渲染。  
滚动本身是浏览器原生行为。

## 兼容性

| 环境 | 行为 |
|------|------|
| Chromium / Safari | webkit 伪元素自定义 thin thumb |
| Firefox | `scrollbar-width: thin` + `scrollbar-color`（无圆角） |
| 移动端 coarse pointer | 回退浏览器原生（隐藏自定义 thumb） |
| SSR | 无 window 依赖，安全 |

## 取舍

| 决策 | 原因 |
|------|------|
| CSS-only 而非 JS thumb | 对齐 HeroUI；零 SSR；移动端自动原生惯性 |
| `mode` prop 而非直接暴露 data 属性 | 与项目其他 prop 风格一致；data 属性仍写在 DOM 上便于调试 |
| 不级联子树 `data-scrollbar` | MVP 单容器足够；级联是框架级能力，超出组件范围 |
| 不实现 thumb 拖拽 | HeroUI 也不做；拖拽属于路线 B |
| `color-mix` + rgba fallback | 现代浏览器优先；老浏览器退化到半透明灰 |

## 回滚

删除 6 个文件改动即可完整回滚：
1. `HScrollbar.vue`
2. `scrollbar.css` + `components.css` import
3. `tokens.css` 中 `--h-scrollbar-*` 块
4. `index.ts` 导出
5. `docs/components/scrollbar.md` + config 侧栏
6. playground 演示区
