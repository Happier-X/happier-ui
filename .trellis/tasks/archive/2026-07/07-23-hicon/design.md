# 技术设计：HIcon

## 依赖

- 根 `package.json`：
  ```json
  "peerDependencies": {
    "vue": "^3.5.0",
    "@lucide/vue": ">=0.400.0"
  }
  ```
- playground：`dependencies` 增加 `@lucide/vue`（具体版本安装时锁定）。
- 库 **不** `import` 具体图标实体（仅渲染传入的组件）；不 peer 强制类型包。

## API

```ts
icon: Component // 必填，Lucide Vue 图标
variant?: 'stroke' | 'fill' // default 'stroke'
size?: 'sm' | 'md' | 'lg' | number // default 'md'
strokeWidth?: number // default 2
color?: string // default 继承 currentColor
ariaLabel?: string
```

## 渲染

```html
<span class="h-icon" :class="size class" :style="{ color }">
  <component
    :is="icon"
    :size="resolvedPx"
    :stroke-width="strokeWidth"
    :color="color || 'currentColor'"
    :fill="variant === 'fill' ? 'currentColor' : 'none'"
    :stroke="variant === 'fill' ? 'none' : 'currentColor'"
    :aria-hidden="ariaLabel ? undefined : true"
    :aria-label="ariaLabel"
  />
</span>
```

fill 时：`fill=currentColor` + `stroke=none`（Lucide 文档允许；部分图标效果好）。  
stroke 时：`fill=none` + stroke currentColor（Lucide 默认）。

`resolvedPx`：sm/md/lg → token（如 16/20/24）；number → 该数值。

## Token

```css
--h-icon-size-sm: 16px;
--h-icon-size-md: 20px;
--h-icon-size-lg: 24px;
```

## 文件

`HIcon.vue`、tokens、index、package.json peer、playground、README、specs。
