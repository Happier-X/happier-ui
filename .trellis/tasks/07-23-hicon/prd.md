# 新增 HIcon 图标组件（Lucide）

## Goal

新增纯 Vue **`HIcon`**：基于 **Lucide** 的图标基元；支持尺寸、颜色、`variant: 'stroke' | 'fill'`、a11y；导出 + playground + spec。

## 背景

- 当前导出：`HButton`、`HSwitch`、`HBottomSheet`、`HDialog`、`HInput`、`HCheckbox`、`HEmpty`、`HImage`、tokens。
- 图标库：**Lucide**（`@lucide/vue`，**peer**；旧包 `lucide-vue-next` 已弃用）。
- 选型：传 Lucide 组件 `:icon`（不做 `name` 字符串）。
- 风格：`variant="stroke" | "fill"`（默认 stroke）。
- Lucide **不正式**提供 filled 图标集；fill 对部分图标有效，文档写明局限。

## MVP 需求

| 能力 | 约定 |
|------|------|
| 命名 | `HIcon` / `HIcon.vue` / `h-icon*` |
| 图标源 | `@lucide/vue`（peer）；宿主 `import { Search } from '@lucide/vue'` |
| 选型 API | 必填 `icon: Component`（Lucide Vue 图标组件） |
| 风格 | `variant?: 'stroke' \| 'fill'`（默认 `stroke`） |
| 尺寸 | `size?: 'sm' \| 'md' \| 'lg' \| number`（默认 `md`）；字面量走 token，数值为 px |
| 线宽 | `strokeWidth?: number`（默认 2；`fill` 时内部可收敛 stroke） |
| 颜色 | 默认 `currentColor`；可选 `color?: string` |
| a11y | 无 `ariaLabel` → `aria-hidden`；有 `ariaLabel` → 暴露可访问名称 |
| 导出 / 演示 | `src/index.ts`；playground：常用图标 + stroke/fill 对比 + sizes |
| 文档 / spec | README（peer + fill 局限）+ component-guidelines / tokens / quality |

## 明确不做

- 不接 Ionicons / Material Icons
- 不做字符串 `name` 映射
- 不做 `HIconButton`
- 不把 `@lucide/vue` 打进库 `dependencies`
- 不 re-export 全量 Lucide 到 `happier-ui` 根
- 不改 Muses

## Acceptance Criteria

- [x] 存在 `src/components/HIcon.vue` 并导出 `HIcon`
- [x] 可渲染 Lucide 组件；`variant="fill"` 可演示对比
- [x] `size` 支持 sm/md/lg 与 number；color / a11y 可用
- [x] 根 `package.json` peer 声明 `@lucide/vue`；playground 安装依赖
- [x] playground + README/spec；`npm run build:playground` 通过

## Notes

- 中等任务：见 `design.md` / `implement.md`。
