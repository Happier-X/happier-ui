# Hook / Composable Guidelines（happier-ui）

## 现状

**本库当前没有** `composables/` 或自定义 `use*` hook。  
交互逻辑写在各 SFC 的 `<script setup>` 内（见 `HIconButton` 的 `onClick` / `onKeyGuard`，`HListRow` 的 `showStart` computed）。

## 何时抽取

满足再抽到 `src/composables/useXxx.ts`：

- 同一逻辑在 **≥2 个组件** 出现；或
- 逻辑与 DOM 结构无关且单测价值高（例如键盘激活、press 态工具函数）。

## 约定（一旦出现）

| 项 | 约定 |
|----|------|
| 命名 | `use` + 驼峰，如 `usePressHandlers` |
| 位置 | `src/composables/` |
| 导出 | 按需从 `src/index.ts` 导出；默认不强制公共 API |
| 依赖 | 只依赖 `vue`；不引入路由 / 请求库 |
| 职责 | 不持有业务实体（歌单、音源）；不写副作用到 localStorage 除非是通用 UI 偏好 |

## 反模式

- 为「看起来干净」给每个组件强行抽 hook。
- 把 Muses 的 pinia / 播放状态搬进本库 composable。
- 在 composable 里依赖 `ionRouter` 等宿主 API。

## 参考

- 组件内逻辑范本：`src/components/HListRow.vue`（`computed` + 键盘）
- 应用层 hook 不属于本库：留在 Muses 等宿主
