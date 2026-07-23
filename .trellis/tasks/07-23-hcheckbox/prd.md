# 新增 HCheckbox 复选框

## Goal

纯 Vue **`HCheckbox`**：HeroUI Native 观感的复选框；支持标准 `v-model`（boolean）、**半选 `indeterminate`**、label / disabled / size；导出 + playground + spec。库不引入 Ionic / Material。

## 背景

- 当前导出：`HButton`、`HSwitch`、`HBottomSheet`、`HDialog`、`HInput`、tokens。
- 与 `HSwitch` 同属布尔控件；与 `HInput` 一样可被宿主表单绑定，**不** peer 表单库。
- 视觉对齐 HeroUI Native Checkbox（简化，无 RN）。
- 半选常用于「部分子项已选」的表头/全选行；**group 逻辑仍由宿主计算**，本组件只负责展示与交互。

## MVP 需求

| 能力 | 约定 |
|------|------|
| 受控值 | `modelValue: boolean` + `update:modelValue` |
| 半选 | `indeterminate?: boolean`（默认 false）；**不**并入 v-model 第三态 |
| 半选语义 | `indeterminate === true` 时：视觉为半选指示（如横杠）；a11y 为 `aria-checked="mixed"`（或原生 `indeterminate`） |
| 点击行为 | 未 disabled 时：若当前 `indeterminate`，则 `update:modelValue` → **`true`**；否则切换 `!modelValue`。**宿主负责**在用户操作后清掉 `indeterminate`（组件可同步把内部原生 indeterminate 复位，但不强制双向 `v-model:indeterminate`） |
| 标签 | **仅**可选 `label?: string`；点击标签可切换（无默认 slot） |
| 状态 | `disabled`；focus-visible |
| 尺寸 | `sm` \| `md` \| `lg`（默认 md） |
| 无障碍 | 可访问名称（`label` 或 `ariaLabel`）；`aria-checked` true/false/mixed；键盘可切换 |
| 视觉 | 方框 + 勾选 / 半选指示；`--h-*`；无 elevation |
| 导出 / 演示 | `src/index.ts`；playground：开关、disabled、三尺寸、label、**半选态** |
| 文档 / spec | README + component-guidelines / tokens / quality |

## 明确不做

- 不 peer / 不打包 `@tanstack/vue-form` 等表单库
- 不实现完整 Form 校验引擎
- 不做 radio / switch 复刻（已有 `HSwitch`）
- **不做 `HCheckboxGroup`**（半选由宿主根据子项算出 `indeterminate` 传入）
- **不做 label 默认 slot**（仅 string `label`）
- 不做 `modelValue: boolean \| 'indeterminate'` 三态 v-model
- 不改 Muses

## Acceptance Criteria

- [x] 存在 `HCheckbox.vue` 并导出
- [x] `v-model` 可切换；disabled 不可切换
- [x] `indeterminate` 时显示半选；`aria-checked` 为 mixed（或等价）；点击后发出 `update:modelValue(true)`（宿主可清半选）
- [x] label / size / 半选 / 基础态可在 playground 演示
- [x] 样式 `h-checkbox*` + `--h-*`；`npm run build:playground` 通过
- [x] 更新 component-guidelines / tokens / quality / README

## Notes

- 仍为单组件交付；半选为 prop + 视觉/a11y，**无 group**。可选补短 `design.md`（indeterminate 与原生 input 同步）。
- 实现优先原生 `input type="checkbox"` + 隐藏样式，便于 `indeterminate` DOM 属性与键盘/表单语义。
