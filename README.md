# happier-ui

适用于 **Web 端与移动端** 的 Vue 语义 UI 与设计 token（`--h-*`）。纯 Vue 实现；视觉参考 HeroUI Native。

## 安装

```bash
npm install happier-ui vue @lucide/vue
```

在应用入口导入组件样式与设计 token：

```ts
import 'happier-ui/style.css'
import 'happier-ui/tokens.css'
```

然后按需导入组件：

```ts
import { HButton, HNavBar, HTabBar } from 'happier-ui'
```

`vue` 与 `@lucide/vue` 是 peer dependencies，由宿主应用提供。

## 当前导出

- **`HButton`** — 文字按钮（HeroUI Native 风格 variants / sizes）
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
- **`happier-ui/tokens.css`** — `--h-*` 设计 token

## 布局

```text
happier-ui/
  src/                 # 库源码（tokens + H* 组件）
  dist/                # npm 发布产物（JS / CSS / 类型声明）
  playground/          # 纯 Vue 冒烟 / 开发预览
  package.json
```

## 开发（本仓库）

```bash
cd C:\code\happier-ui
npm install
npm run dev:playground   # http://localhost:5174
npm run build:playground
npm run build:lib         # 构建 dist 发布产物
```

## 本地联调（Muses）

同级仓库开发时，Muses 根 `package.json` 可继续使用：

```json
"happier-ui": "file:../happier-ui"
```

```bash
cd C:\code\muses
npm install
npm run dev
```

在 `happier-ui` 改组件后，Muses 一般需刷新 dev server；依赖元数据变更时再 `npm install`。

### 接入示例

```ts
import { HBottomSheet, HButton, HCheckbox, HDialog, HEmpty, HIcon, HImage, HInput, HNavBar, HSwitch, HTabBar } from 'happier-ui'
import 'happier-ui/style.css'
import 'happier-ui/tokens.css'
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

`HEmpty` 不提供 `compact` 或历史 `HEmptyState` / `MEmptyState` 别名；宿主可通过外层布局控制高度。

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

库 **peer** 依赖 `@lucide/vue`（当前发布行建议 `^1.25.0`；旧包名 `lucide-vue-next` 已弃用）。宿主自行按需 import 图标：

```vue
<script setup lang="ts">
import { Search, Star } from '@lucide/vue'
</script>

<template>
  <h-icon :icon="Search" size="md" />
  <h-icon :icon="Star" variant="fill" color="var(--h-color-primary)" aria-label="收藏" />
</template>
```

`variant="fill"` 会设置 `fill=currentColor` 与 `stroke=none`。Lucide **不正式**提供 filled 图标集，仅部分图标（如 star/heart）效果较好。

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

不内置路由：宿主监听 `v-model` 自行跳转。图标为 Vue 组件，内部用 `HIcon` 渲染。

`fixed` 与 `safe-area` 两个 prop **默认都为 `true`**：默认固定在视口底部，并用 `padding-bottom: env(safe-area-inset-bottom)` 让背景延伸进 Home Indicator。两者可独立关闭：`<h-tab-bar :fixed="false" :safe-area="false" … />`。

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

`#left` 会覆盖 `showBack` 的默认返回按钮，`#title` 会覆盖 `title` 文本，`#right` 无默认内容。左右区域点击分别透传 `MouseEvent`。组件**不内置 Vue Router、导航栈或 `history.back()`**，实际导航由宿主处理。

`fixed` 与 `safe-area` 默认均为 `true` 且可独立关闭；安全区通过顶部 `env(safe-area-inset-top)` 叠加在 `--h-nav-bar-height`（默认 `56px`）之外。

领域组件（封面、播放器、`MPage`）永远留 Muses。

## Peer

- **必选**：`vue` ^3.5
- **使用 `HIcon` 时**：`@lucide/vue` >= 0.400  

## 不做

- 本仓库不塞 Muses 业务
- 不内置 Vue Router / Ionic 导航栈

## 发版（GitHub Actions）

与 Muses 类似：推送 `v*` tag 触发 `.github/workflows/release.yml`，构建 `dist` 后 `npm publish`。

1. 仓库 Secrets 配置 **`NPM_TOKEN`**（npm automation token，需 publish 权限）。
2. 将 `package.json` 的 `version` 与即将打的 tag 对齐（`v0.0.2` → `0.0.2`）。
3. 推送代码后打 tag 并推送：

```bash
git tag v0.0.2
git push origin v0.0.2
```

Workflow 会校验 tag 版本与 `package.json` 一致，不一致则失败（避免误发旧版本）。

## License

[MIT](./LICENSE) © 2026 Happier

