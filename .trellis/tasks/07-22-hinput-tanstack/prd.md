# 新增 HInput 输入框（适配 TanStack Form）

## Goal

新增纯 Vue **`HInput`**：HeroUI Native 观感的文本输入；支持标准 `v-model`，且 API 可直接对接 **TanStack Vue Form** 的 `Field`（`:value` / `handleChange` / `handleBlur` / `name`）。库本身 **不 peer 依赖** `@tanstack/vue-form`。

## 背景

- 当前导出：`HButton`、`HSwitch`、`HBottomSheet`、`HDialog`、tokens。
- TanStack Vue Form 官方 Field 绑定：
  ```html
  <input
    :name="field.name"
    :value="field.state.value"
    @blur="field.handleBlur"
    @input="(e) => field.handleChange(e.target.value)"
  />
  ```
- 用户要求「能够适配 TanStackForm」：组件暴露等价绑定面，playground 演示对接方式。

## MVP 需求

| 能力 | 约定 |
|------|------|
| 受控值 | `modelValue: string` + `update:modelValue`（`v-model`） |
| TanStack 绑定 | 支持 `:model-value="field.state.value"` + `@update:model-value="field.handleChange"` + `@blur="field.handleBlur"` + `:name="field.name"` |
| 原生属性 | `type`（text/password/email/search/tel/url/number 等常用）、`placeholder`、`disabled`、`readonly`、`name`、`id`、`autocomplete`、`inputmode` |
| 表单元信息 | 可选 `label`、`description`、`error`（字符串）；`invalid` 可由 `error` 或显式 prop 推导 |
| 无障碍 | label 关联 input；`aria-invalid`、`aria-describedby`（description/error） |
| 视觉 | soft radius surface field；focus ring；error 边框/文案；`--h-*` |
| 导出 | `src/index.ts` → `HInput` |
| Playground | ① 普通 v-model 演示 ② TanStack Form Field 对接演示（playground 可加 dev 依赖） |

## 明确不做

- 不 peer / 不打包 `@tanstack/vue-form` 进库
- 不实现完整 Form / FieldArray / 校验引擎
- 不做 mask、autosize textarea（textarea 可后续 `HTextarea`）
- 不做 select/date/file 专用控件
- 不改 Muses

## Acceptance Criteria

- [x] 存在 `HInput.vue` 并导出
- [x] `v-model` 可用；blur/update 事件可用
- [x] 文档化 TanStack Field 绑定片段（README 或 playground 注释）
- [x] label / description / error / disabled / password 等基础态可演示
- [x] 样式 `h-input*` + `--h-*`；`npm run build:playground` 通过
- [x] 更新 component-guidelines / tokens / quality / README

## Notes

- 推荐对接写法见 design.md；playground 优先真实 `@tanstack/vue-form` 冒烟，若安装成本过高则用 mock field API 模拟同等绑定。
