# HeroUI 风格 Select（自定义下拉面板）

## Goal

原地升级 `HSelect`：脱离原生 `<select>`，用可控 popover 面板呈现选项，视觉/交互对齐 **HeroUI Web（React）Select**，覆盖单选场景的自定义样式、键盘导航与无障碍语义。

## Background

- 现有 `src/components/HSelect.vue` 基于原生 `<select>` + `<option>`，无法自定义面板样式/动画；原任务把「自定义下拉面板、搜索、多选、分组」列为 Out of Scope。
- 视觉基准是 **HeroUI Web**，不是 HeroUI Native。移动端 picker 形态不在本组件内实现（未来单列组件）。
- 可复用资产：`useTeleportTarget`、`HBottomSheet`/`HDialog` 浮层模式、`--h-*` token、HInput 的 label/description/error 模式。
- 库版本 0.0.6，API 仍可破坏性升级。

## Key Decisions

| ID | 决策 | 说明 |
|----|------|------|
| D1 | 原地升级 `HSelect` | 退役原生 `<select>` 方案，对外只保留一个 Select |
| D2 | 视觉对齐 HeroUI **Web** | popover-only；移动 picker 不在范围 |
| D3 | MVP = 单选核心 | 不含多选 / 搜索 / 分组 |
| D4 | 延续 `options` 数组驱动 | 与 HTabBar / HTable / HSidebar 惯例一致；slot 提供自定义 |

## Requirements

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `options` | `HSelectOption[]` | `[]` | 选项列表 |
| `modelValue` | `string \| number` | `''` | 当前选中值（v-model） |
| `placeholder` | `string` | `'Select an option'` | 未选中时提示 |
| `label` | `string` | — | 标签文字 |
| `description` | `string` | — | 辅助说明（对齐 HInput） |
| `error` | `string` | — | 错误信息（对齐 HInput，`role="alert"`） |
| `disabled` | `boolean` | `false` | 禁用 |
| `clearable` | `boolean` | `false` | 有值时显示清空按钮 |
| `invalid` | `boolean` | `false` | 强制无效态；有 `error` 时自动无效 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `variant` | `'flat' \| 'bordered' \| 'faded' \| 'underlined'` | `'flat'` | 触发器视觉变体（对齐 HeroUI Web） |
| `color` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | 焦点/强调色 |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | 圆角 |
| `labelPlacement` | `'outside' \| 'inside'` | `'outside'` | 标签位置（outside = 上方；inside = trigger 内） |
| `name` | `string` | — | 原生 name（隐藏 input 或透传） |
| `ariaLabel` | `string` | — | 无 label 时的可访问名称 |
| `teleport` | `string \| HTMLElement \| false` | `'body'` | popover 挂载目标 |

```ts
interface HSelectOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}
```

### Events

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `string \| number` | 选中值改变 |
| `change` | `string \| number` | 用户确认选择后触发（程序写 modelValue 不触发） |

### Slots

| 名称 | 作用域 | 说明 |
|------|--------|------|
| `option` | `{ option: HSelectOption }` | 自定义选项内容 |
| `value` | `{ option: HSelectOption \| null, placeholder: string }` | 自定义 trigger 显示值 |
| `start` | — | trigger 左侧内容 |
| `end` | — | trigger 右侧内容（在 indicator 前） |
| `indicator` | `{ open: boolean }` | 自定义下拉指示器（默认 chevron） |

### 交互与结构

1. **Trigger**：可聚焦按钮外观控件，展示当前值 / placeholder + indicator。
2. **Popover 面板**：Teleport 到 `body`（默认），相对 trigger 下方对齐，宽度默认匹配 trigger；点遮罩 / Esc / 选中后关闭。
3. **选项列表**：`role="listbox"`；每项 `role="option"` + `aria-selected`；选中项显示 check indicator；disabled 项不可选。
4. **键盘**：
   - Trigger 关闭态：Enter / Space / ArrowDown 打开。
   - 打开态：ArrowUp/Down 移动高亮，Home/End 跳首尾，Enter 选中，Esc 关闭；焦点回到 trigger。
5. **Clearable**：有值且未 disabled 时显示清空；清空触发 `update:modelValue('')` + `change('')`。
6. **无障碍**：trigger `role="combobox"` + `aria-expanded` + `aria-controls` + `aria-haspopup="listbox"`；有 label 时关联；无 label 用 `ariaLabel`；invalid 时 `aria-invalid`。

### 视觉

- 样式写在 `src/styles/components/select.css` 的 `@layer components`，类前缀 `h-select*`。
- variant / size / color / radius 用 BEM modifier（如 `.h-select--flat`、`.h-select--primary`）。
- 无 elevation/Material 阴影；popover 可用极轻边框 + surface 背景区分层级。
- 新增必要 token 到 `tokens.css`（z-index、popover 尺寸、variant 色），数值走 `--h-*`。

### 交付

- 重写 `src/components/HSelect.vue` + `src/styles/components/select.css`。
- `src/index.ts` 继续导出 `HSelect` 与 `HSelectOption`。
- playground 演示：基础、label、placeholder、尺寸、variant、color、radius、disabled、clearable、invalid/error、自定义 option/value/start/end/indicator slot。
- `docs/components/select.md` 更新为自定义面板版（简介、示例、API、无障碍）。
- `.trellis/spec/frontend/component-guidelines.md` 同步 API 与当前导出表。

## Acceptance Criteria

- [ ] `HSelect` 不再使用原生 `<select>` / `<option>`；面板为自定义 popover。
- [ ] v-model 双向绑定正确；用户选择触发 `change`，程序写 modelValue 不触发 `change`。
- [ ] clearable 清空后 `update:modelValue('')` + `change('')`。
- [ ] disabled 态不可打开、不可清空。
- [ ] 4 variant × 3 size × 5 color × 5 radius 的 BEM 类可应用且视觉可用（playground 覆盖主要组合）。
- [ ] labelPlacement outside / inside 均可用。
- [ ] description / error / invalid 行为对齐 HInput。
- [ ] 键盘导航（打开/移动/选中/关闭）与 combobox/listbox 语义正确。
- [ ] popover 默认 teleport 到 body，可通过 `teleport` 覆盖。
- [ ] 有值选项显示 check indicator；disabled option 不可选。
- [ ] slots：option / value / start / end / indicator 可用。
- [ ] playground + docs + component-guidelines 同步。
- [ ] `npm run build:lib`、`build:playground`、`docs:build` 通过。

## Out Of Scope

- 多选（`selectionMode="multiple"` / chips）。
- 搜索筛选 / 异步加载 options。
- 选项分组（sections / optgroup）。
- 移动端 bottom-sheet / dialog / picker 展示形态。
- 复合子组件 API（`HSelectItem` 等）。
- 受控 open 状态（`isOpen` / `update:isOpen`）。
- floating-ui / Popper 等第三方定位库（MVP 用简单定位：下方对齐 + 宽度匹配 trigger）。
- `labelPlacement="outside-left"`。
- 虚拟列表 / 长列表性能优化。
