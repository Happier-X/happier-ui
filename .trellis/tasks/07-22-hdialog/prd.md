# 新增 HDialog 对话框组件

## Goal

新增纯 Vue **`HDialog`**：居中模态对话框，支持 `v-model`、遮罩/Esc 关闭、标题/描述/内容/操作槽、CSS 动画与 `--h-*`；视觉对齐 HeroUI Native Dialog，不引 RN / Ionic Modal。

## 背景

- 当前导出：`HButton`、`HSwitch`、`HBottomSheet`、tokens。
- `HDialog` 与 `HBottomSheet` 共享 modal 基础语义，但布局为居中 surface。
- 范围：仅 happier-ui；不改 Muses。

## MVP 需求

| 能力 | 约定 |
|------|------|
| 状态 | `modelValue` + `update:modelValue` |
| 遮罩 | `closeOnOverlay?: boolean`，默认 true |
| Esc | 默认关闭；`closeOnEsc?: boolean` 默认 true |
| 文本 | `title?: string`、`description?: string` |
| Slots | `#title`、`#description`、default、`#actions` |
| 关闭 | 用户请求关闭时 emit `update:modelValue(false)` + `close` |
| 无障碍 | `role="dialog"`、`aria-modal`、title/description 关联；打开时 focus root |
| 视觉 | overlay fade + 居中 panel scale/fade；surface、soft radius；无 elevation 重阴影 |
| Token | dialog overlay/z/radius/max-width/duration |
| Playground | 普通 dialog、不可点遮罩关闭、actions 演示 |

## 明确不做

- 不做 Teleport / Portal
- 不做 focus trap / 自动恢复触发器焦点
- 不做 AlertDialog 的强确认语义
- 不做拖拽/手势
- 不引入 RN / Ionic Modal

## Acceptance Criteria

- [x] 新增并导出 `HDialog`
- [x] v-model、overlay/Esc 关闭与可禁用行为正确
- [x] title/description props 与对应 slots、default/actions slots 可用
- [x] `role="dialog"` / `aria-modal` / labelledby/describedby 正确
- [x] 使用 `h-dialog*` + `--h-*`
- [x] playground + README/spec 更新，`npm run build:playground` 通过
