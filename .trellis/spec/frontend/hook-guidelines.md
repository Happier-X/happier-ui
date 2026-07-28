# Hook / Composable Guidelines（happier-ui）

## 现状

本库共享 composable：`src/composables/useTeleportTarget.ts`（供 HToast / HDialog / HBottomSheet / HPopup / HFloatingBubble 等浮层组件复用 Teleport 目标解析）；`src/composables/useScrollLock.ts`（引用计数式 body 滚动锁定，SSR 安全，`HPopup` 默认 `lockScroll: true` 会启用）。
其余交互逻辑仍写在各 SFC 的 `<script setup>` 内（见 `HButton` 的 click / disabled 处理）。

## 何时抽取

满足再抽到 `src/composables/useXxx.ts`：

- 同一逻辑在 **≥2 个组件** 出现；或
- 逻辑与 DOM 结构无关且单测价值高。

## 约定（一旦出现）

| 项 | 约定 |
|----|------|
| 命名 | `use` + 驼峰，如 `usePressHandlers` |
| 位置 | `src/composables/` |
| 导出 | 按需从 `src/index.ts` 导出；默认不强制公共 API |
| 依赖 | 只依赖 `vue`；不引入路由 / 请求库 |
| 职责 | 不持有业务实体；不写副作用到 localStorage 除非是通用 UI 偏好 |

## 反模式

- 为「看起来干净」给每个组件强行抽 hook。
- 把 Muses 的 pinia / 播放状态搬进本库 composable。
- 在 composable 里依赖 `ionRouter` 等宿主 API。

## 参考

- 组件内逻辑范本：`src/components/HButton.vue`
- Composable 范本：`src/composables/useTeleportTarget.ts`（只依赖 vue；SSR 安全；多组件复用）、`src/composables/useScrollLock.ts`（模块级引用计数 + onBeforeUnmount 自动还原）
