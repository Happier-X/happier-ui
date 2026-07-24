# 快速开始

**happier-ui** 是面向 **Web 与移动端** 的 Vue 3 语义 UI 库。样式体系对齐 **HeroUI v3 / Tailwind CSS v4 CSS-first**：消费方接入 token 后，既能使用 `H*` 组件，也能在业务代码中使用同一套 `h-` utility。

## 前提

- Node.js ≥ 18
- Vue `^3.5`
- Tailwind CSS `^4`
- 使用 `HIcon` / 内含图标的组件时：`@lucide/vue` `^1.25`

## 三步接入

### 1. 安装

```bash
npm install happier-ui vue @lucide/vue tailwindcss@^4
```

### 2. 全局 CSS

```css
@import "tailwindcss";
@import "happier-ui/styles";
```

### 3. Vite 启用 Tailwind 插件

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

### 使用组件

```vue
<script setup lang="ts">
import { HButton } from 'happier-ui'
</script>

<template>
  <h-button variant="primary">开始</h-button>
</template>
```

### 业务侧使用同一套 utility

```html
<div class="bg-h-surface text-h-ink rounded-h-control p-h-md gap-h-sm">
  …
</div>
```

## 下一步

- [安装与 Tailwind v4](./installation) — peers、exports、路径说明
- [Token 与 utility](./tokens) — `--h-*` 与 `h-` 对照
- [主题与覆盖](./theming) — CSS 变量与 BEM layer
- [从 0.0.1 升级](./migration-0.0.2) — breaking 变更
- [组件文档](/components/button)

## 本仓库开发

```bash
npm install
npm run docs:dev          # 本文档站
npm run dev:playground    # 组件冒烟（http://localhost:5174）
npm run build:lib         # 构建 npm dist
```

文档站与 playground **并存**：playground 用于库内冒烟，文档站用于 API 与可复制示例。
