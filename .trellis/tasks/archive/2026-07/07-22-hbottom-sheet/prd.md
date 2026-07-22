# 新增 HBottomSheet 底部面板

## Goal

在 happier-ui 新增纯 Vue **`HBottomSheet`**：从屏幕底部滑出的基础面板，支持 `v-model`、遮罩关闭、标题/内容槽、CSS 动画与 `--h-*` token；playground 可演示并导出。视觉直接对齐 HeroUI Native Bottom Sheet 的移动端观感，但不引入 RN / `@gorhom/bottom-sheet` / Ionic Modal 引擎。

## 背景

- 当前库导出：`HButton`、`HSwitch`、`tokens.css`。
- HeroUI Native Bottom Sheet 参考：overlay + content + title/description/close，支持底部滑入、遮罩、手势/portal；本任务只做 Vue Web MVP。
- 范围：仅 happier-ui；不接 Muses。

## MVP 需求

| 能力 | 约定 |
|------|------|
| 开关态 | `modelValue: boolean` + `update:modelValue`（`v-model`） |
| 遮罩关闭 | `closeOnOverlay?: boolean`，默认 `true` |
| 关闭事件 | `close` emit，触发于用户请求关闭（overlay / Esc / close button） |
| 标题 | `title?: string`，也支持 `#title` slot 覆盖 |
| 内容 | default slot |
| 底部安全区 | 面板 padding-bottom 包含 `env(safe-area-inset-bottom)` |
| 动画 | overlay fade + sheet translateY；纯 CSS transition |
| 无障碍 | `role="dialog"`、`aria-modal="true"`、标题关联；Esc 关闭；打开时仅渲染 overlay/sheet |
| 视觉 | rounded top corners、surface、overlay、drag handle（装饰） |
| Token | sheet/overlay/radius/z-index 等按需加 `--h-*` |
| 导出 | `src/index.ts` 导出 `HBottomSheet` |
| Playground | 展示打开按钮、标题、内容、关闭方式 |

## 明确不做（MVP）

- 不做拖拽关闭 / swipe-to-dismiss
- 不做多 snap points / 半屏全屏动态高度
- 不做 Portal / Teleport（先原地渲染，避免复杂宿主约束）
- 不做 focus trap（后续可加）；仅 Esc 与语义角色
- 不做 ActionSheet 列表语义（后续可加 `HActionList`）
- 不引入 Ionic Modal / HeroUI RN / @gorhom/bottom-sheet
- 不改 Muses

## Acceptance Criteria

- [x] 存在 `src/components/HBottomSheet.vue` 且导出 `HBottomSheet`
- [x] 支持 `v-model` 打开/关闭；overlay 点击可关闭且可禁用
- [x] 支持 `title` prop、`#title` slot、default 内容槽
- [x] Esc 可请求关闭；关闭时 emit `update:modelValue(false)` 与 `close`
- [x] 样式消费 `--h-*`，类前缀 `h-bottom-sheet*`
- [x] playground 演示通过 `npm run build:playground`
- [x] 更新 README 与 `.trellis/spec/frontend/component-guidelines.md` 当前导出表

## Notes

- HeroUI Native Bottom Sheet anatomy 包含 Root / Trigger / Portal / Overlay / Content / Close / Title / Description；本任务收敛为单 Vue 组件 API。
