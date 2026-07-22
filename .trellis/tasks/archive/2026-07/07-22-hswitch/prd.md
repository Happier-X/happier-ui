# 新增 HSwitch 开关组件

## Goal

在 happier-ui 新增纯 Vue **`HSwitch`**（开关），视觉对齐 HeroUI Native Switch 观感；支持受控 `v-model`、disabled、尺寸；playground 可演示并导出。

## 背景

- 当前库仅导出 `HButton` + `tokens.css`（legacy 列表/空态等已删）。
- 旧路线图有 `HToggle`；本任务命名采用 **`HSwitch`**（与 HeroUI Native 一致）。
- 范围：仅 happier-ui；不接 Muses。

## MVP 需求

| 能力 | 约定 |
|------|------|
| 受控值 | `modelValue: boolean` + `update:modelValue`（`v-model`） |
| 禁用 | `disabled?: boolean` |
| 尺寸 | `size?: 'sm' \| 'md' \| 'lg'`（默认 `md`） |
| 无障碍 | 可聚焦；`role="switch"`；`aria-checked`；可选 `ariaLabel` / 关联 label |
| 交互 | 点击 / Enter / Space 切换；disabled 不响应 |
| 视觉 | track + thumb；on 态 primary；off 态 muted/surface；pill；无 elevation；CSS transition（不引入 RN animation 库） |
| Token | 开关相关尺寸/色进 `--h-*`（按需） |
| 导出 | `src/index.ts` → `HSwitch` |
| Playground | on/off、disabled、sizes 演示 |

## 明确不做（MVP）

- 不做 StartContent/EndContent 图标插槽（HeroUI 高级用法，后续可加）
- 不做 spring/reanimated 级动画
- 不实现 label+description 整行「设置行」组合（宿主自行排版）
- 不引入 `@ionic/vue` / heroui RN
- 不改 Muses

## Acceptance Criteria

- [x] 存在 `src/components/HSwitch.vue` 且导出 `HSwitch`
- [x] 支持 `v-model` / disabled / size sm|md|lg
- [x] 键盘与 `role="switch"` / `aria-checked` 正确
- [x] 样式消费 `--h-*`，类前缀 `h-switch*`
- [x] playground 演示通过 `npm run build:playground`
- [x] 更新 `.trellis/spec/frontend/component-guidelines.md` 导出表

## Notes

- HeroUI Native 参考：`isSelected` / `onSelectedChange` / `isDisabled` → Vue 映射为 `modelValue` / `update:modelValue` / `disabled`
