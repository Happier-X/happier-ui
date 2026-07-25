# HSelect 下拉选择框

## Goal

实现 `HSelect` 下拉选择框组件，补齐表单控件族（HInput / HCheckbox / HSwitch），用于 `model-hub` 等项目的下拉选择场景。

## Background

- `model-hub` 项目中有 5 处使用原生 `<select>` + Tailwind 实现的下拉选择框（排序模式、供应商选择、状态码筛选、每页条数等）。
- 作为表单控件族的一员，API 模式对标 `HInput`：`label` / `size` / `disabled` / `v-model`。
- 基于原生 `<select>` + `<option>`，保留浏览器原生弹出行为，不做自定义下拉面板。

## Requirements

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `options` | `HSelectOption[]` | `[]` | 选项列表 |
| `modelValue` | `string \| number` | `''` | 当前选中值（v-model） |
| `placeholder` | `string` | — | 未选中时提示文字（渲染为 disabled 空 option） |
| `label` | `string` | — | 标签文字（同 HInput label） |
| `disabled` | `boolean` | `false` | 禁用 |
| `clearable` | `boolean` | `false` | 是否显示清空按钮 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸（对齐 HInput 尺寸体系） |
| `name` | `string` | — | 原生 name |
| `ariaLabel` | `string` | — | 无 label 时的可访问名称 |

```ts
interface HSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}
```

### Events

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `string \| number` | 选中值改变时触发 |
| `change` | `string \| number` | 用户确认选择后触发（程序写 modelValue 不触发） |

### Slots

| 名称 | 作用域 | 说明 |
|------|--------|------|
| `option` | `{ option: HSelectOption }` | 自定义选项渲染 |

## Design

### 结构

```vue
<div class="h-select" :class="[...]">
  <label v-if="label" class="h-select__label">{{ label }}</label>
  <div class="h-select__wrapper">
    <select class="h-select__control" ...>
      <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
      <option v-for="opt in options" ...>{{ opt.label }}</option>
    </select>
    <!-- clearable 按钮（select 有值且未 disabled 时） -->
    <button v-if="clearable && modelValue" class="h-select__clear" @click="onClear" />
    <!-- 下拉箭头装饰 -->
    <svg class="h-select__arrow" ... />
  </div>
</div>
```

### 样式

- `src/styles/components/select.css`：`@layer components`，尺寸/间距/字体对齐 HInput 的 `--h-input-*` token。
- 原生 select 用 `appearance: none`，通过伪元素或包装层自定义箭头。
- 尺寸 `sm/md/lg` 复用 HInput 的 `--h-input-height-*`、`--h-input-pad-x-*`、`--h-input-font-*`。
- iOS 防缩放：`font-size >= 16px`（lg 默认 16px；sm/md 强制 min 16px）。
- disabled 态 opacity + cursor。

### 布局

- label 在上，select 在下，gap 与 HInput 一致。
- 清空按钮 + 箭头在 select 右侧绝对定位。

## Acceptance Criteria

- [ ] `src/components/HSelect.vue` 实现组件逻辑与 BEM 类。
- [ ] `src/styles/components/select.css` 写 `@layer components` 视觉规则；`src/styles/components.css` 增加 `@import`。
- [ ] `src/index.ts` 导出 `HSelect`。
- [ ] playground 展示：基础、label、placeholder、尺寸、disabled、clearable、自定义 option slot。
- [ ] `docs/components/select.md` 文档页（简介、示例、API 表、无障碍要点）。
- [ ] `.trellis/spec/frontend/component-guidelines.md` 同步 API 约定与当前导出表。
- [ ] v-model 双向绑定、change emit 行为正确。
- [ ] clearable 清空后触发 `update:modelValue('')`。
- [ ] disabled 态不可交互。
- [ ] iOS font-size >= 16px 防缩放。
- [ ] `npm run build:lib`、`build:playground`、`docs:build` 通过。

## Out Of Scope

- 自定义下拉面板、搜索筛选、多选、分组。
- 异步加载 options。
- 与路由/状态管理库绑定。
