# happier-ui

跨 Capacitor + Vue 的语义 UI 与设计 token（`--h-*`）。  
**独立仓库**，与 `muses` 同级开发；消费方用本地 `file:` 依赖接入。

## 当前导出

- **`HButton`** — 文字按钮（HeroUI Native 风格 variants / sizes）
- **`HSwitch`** — 开关（`v-model`、sizes、disabled）
- **`HBottomSheet`** — 底部面板（`v-model`、遮罩关闭、标题/内容槽）
- **`HDialog`** — 居中对话框（`v-model`、遮罩/Esc、标题/描述/操作槽）
- **`HInput`** — 文本输入（`v-model`、label/error；可对接 TanStack Vue Form Field）
- **`HCheckbox`** — 复选框（`v-model`、label、`indeterminate` 半选）
- **`HEmpty`** — 空状态（title/description、icon 与操作槽）
- **`HImage`** — 图片（fit/radius/loading、失败 fallback）
- **`happier-ui/tokens.css`** — `--h-*` 设计 token

## 布局

```text
happier-ui/
  src/                 # 库源码（tokens + H* 组件）
  playground/          # 纯 Vue 冒烟 / 开发预览
  package.json
```

## 开发（本仓库）

```bash
cd C:\code\happier-ui
npm install
npm run dev:playground   # http://localhost:5174
npm run build:playground
```

## 被 Muses 引用

Muses 根 `package.json`：

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
import { HBottomSheet, HButton, HCheckbox, HDialog, HEmpty, HImage, HInput, HSwitch } from 'happier-ui'
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

领域组件（封面、播放器、`MPage`）永远留 Muses。

## Peer

- **必选**：`vue` ^3.5  

## 不做

- 本仓库不塞 Muses 业务  
- 默认不 npm 公网发布（`private: true`）  
