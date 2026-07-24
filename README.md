# happier-ui

适用于 **Web 端与移动端** 的 Vue 语义 UI 与设计 token（`--h-*`）。  
**0.0.2+** 样式体系对齐 **HeroUI v3 / Tailwind CSS v4 CSS-first**：组件在 Tailwind 设计系统上构建；消费方接入 token/theme 后，**既能用组件，也能在业务代码里用同一套 `h-` utility**。

视觉参考 HeroUI Native；Vue 自实现，不依赖 `@heroui/*` 或 Ionic。

## 安装

```bash
npm install happier-ui vue @lucide/vue tailwindcss@^4
```

### Tailwind v4 接入（必需）

在应用全局 CSS（如 `app.css`）中：

```css
@import "tailwindcss";
@import "happier-ui/styles";
```

Vite 需启用官方插件，例如：

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

然后按需导入组件：

```ts
import { HButton, HNavBar, HTabBar } from 'happier-ui'
```

### Token 与 utility

- **CSS 变量（权威）**：`var(--h-color-primary)`、`var(--h-space-md)` …
- **`h-` utility**（由 `@theme` 映射，与 token 对应）：

```html
<div class="bg-h-surface text-h-ink rounded-h-control p-h-md gap-h-sm">
  …
</div>
```

| Token | Utility 示例 |
|-------|----------------|
| `--h-color-primary` | `bg-h-primary` `text-h-primary` |
| `--h-color-surface` | `bg-h-surface` |
| `--h-color-ink` | `text-h-ink` |
| `--h-space-md` | `p-h-md` `gap-h-md` |
| `--h-radius-control` | `rounded-h-control` |

仅需变量、自行映射时可用：

```css
@import "happier-ui/tokens.css";
```

组件 BEM 类名在 `@layer components` 中（如 `.h-button` / `.h-button--primary`），可用同源 layer 覆盖。

### Peer dependencies

| 包 | 版本 |
|----|------|
| `vue` | `^3.5` |
| `@lucide/vue` | `^1.25`（使用 `HIcon` / 内含图标的组件时） |
| `tailwindcss` | `^4` |

## Breaking：相对 0.0.1

| 0.0.1 | 0.0.2 |
|-------|-------|
| `import 'happier-ui/style.css'` + `tokens.css`，**无需** Tailwind | **必须** Tailwind v4 + `@import "happier-ui/styles"` |
| 预编译 `dist/style.css` 即可用组件 | 组件样式依赖宿主 Tailwind 管道解析 styles 包 |
| peer：`vue`、`@lucide/vue` | 增加 peer：`tailwindcss` `^4` |

**无 0.0.1 兼容 shim**；升级请改接入方式。旧入口 `style.css` 已移除。

## 当前导出

- **`HButton`** — 文字按钮（variants / sizes）
- **`HSwitch`** — 开关（`v-model`、sizes、disabled）
- **`HBottomSheet`** — 底部面板（`v-model`、遮罩关闭、标题/内容槽）
- **`HDialog`** — 居中对话框（`v-model`、遮罩/Esc、标题/描述/操作槽）
- **`HInput`** — 文本输入（`v-model`、label/error；可对接 TanStack Vue Form Field）
- **`HCheckbox`** — 复选框（`v-model`、label、`indeterminate` 半选）
- **`HEmpty`** — 空状态（title/description、icon 与操作槽）
- **`HImage`** — 图片（fit/radius/loading、失败 fallback）
- **`HIcon`** — 图标（Lucide 组件、`variant` stroke/fill）
- **`HTabBar`** — 底部导航（`v-model` key、`items` 图标+文案、safe-area）
- **`HNavBar`** — 顶部标题栏（左右/标题插槽、默认返回按钮、safe-area；无路由）
- **`happier-ui/styles`** — tokens + `@theme` + 组件 BEM（主推）
- **`happier-ui/tokens.css`** — 仅 `--h-*` 变量（可选）

## 布局

```text
happier-ui/
  src/
    components/H*.vue    # 组件逻辑 + BEM 类名（无大块 scoped 视觉 CSS）
    styles/              # tokens / theme(@theme) / components
    index.ts
  dist/                  # npm 发布产物
  playground/            # Vite 冒烟（TW4）
```

## 开发（本仓库）

```bash
cd C:\code\happier-ui
npm install
npm run dev:playground   # http://localhost:5174
npm run build:playground
npm run build:lib         # 构建 dist（含 styles.css / tokens.css）
```

## 本地联调（Muses）

同级仓库开发时，Muses 根 `package.json` 可继续使用：

```json
"happier-ui": "file:../happier-ui"
```

宿主需按上文接入 **Tailwind v4 + `happier-ui/styles`**（不再只引 `style.css`）。

```bash
cd C:\code\muses
npm install
npm run dev
```

### HInput + TanStack Vue Form

库 **不** peer 依赖 `@tanstack/vue-form`。在宿主用 Field 绑定：

```vue
<form.Field name="email">
  <template #default="{ field }">
    <h-input
      label="Email"
      :name="field.name"
      :model-value="String(field.state.value ?? '')"
      @update:model-value="field.handleChange"
      @blur="field.handleBlur"
    />
  </template>
</form.Field>
```

### HEmpty

```vue
<h-empty title="暂无内容" description="这里还没有数据。">
  <template #icon>
    <span aria-hidden="true">◎</span>
  </template>
  <h-button size="sm">添加内容</h-button>
</h-empty>
```

### HImage

```vue
<h-image
  src="/cover.jpg"
  alt="封面"
  :width="120"
  :height="120"
  fit="cover"
  radius="md"
>
  <template #fallback>
    <span aria-hidden="true">◎</span>
  </template>
</h-image>
```

### HIcon + Lucide

```vue
<script setup lang="ts">
import { Search, Star } from '@lucide/vue'
</script>

<template>
  <h-icon :icon="Search" size="md" />
  <h-icon :icon="Star" variant="fill" color="var(--h-color-primary)" aria-label="收藏" />
</template>
```

### HTabBar

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Home, Search, User } from '@lucide/vue'
import { HTabBar } from 'happier-ui'

const tab = ref('home')
const items = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'search', label: '搜索', icon: Search },
  { key: 'me', label: '我的', icon: User },
]
</script>

<template>
  <h-tab-bar v-model="tab" :items="items" />
</template>
```

`fixed` 与 `safe-area` 默认均为 `true`，可独立关闭。不内置路由。

### HNavBar

```vue
<h-nav-bar
  title="播放列表"
  show-back
  @handle-left-click="onBack"
  @handle-right-click="onSave"
>
  <template #right><button type="button">保存</button></template>
</h-nav-bar>
```

组件**不内置** Vue Router 或 `history.back()`。

领域组件（封面、播放器等）留在宿主应用。

## 不做

- 不引入 `@heroui/*` / Ionic
- 不提供 0.0.1 的「无 Tailwind 单文件 style.css」接入
- 本仓库不塞 Muses 业务

## 发版（GitHub Actions）

推送 `v*` tag 触发 `.github/workflows/release.yml`，构建 `dist` 后 `npm publish`。

1. 仓库 Secrets 配置 **`NPM_TOKEN`**。
2. `package.json` version 与 tag 对齐（`v0.0.2` → `0.0.2`）。
3. 推送 tag：

```bash
git tag v0.0.2
git push origin v0.0.2
```

## License

[MIT](./LICENSE) © 2026 Happier
