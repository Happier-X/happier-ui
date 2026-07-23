# 新增 HImage 图片组件

## Goal

新增纯 Vue **`HImage`**：通用图片基元；支持 `src` / `alt`、fit / radius / loading、失败 fallback；导出 + playground + spec。

## 背景

- 当前导出：`HButton`、`HSwitch`、`HBottomSheet`、`HDialog`、`HInput`、`HCheckbox`、`HEmpty`、tokens。
- 本轮定位为**图片基元**，不做 gallery / viewer / zoom。
- 命名已确认：**`HImage`**（文件 `HImage.vue`，类前缀 `h-image*`）。

## MVP 需求

| 能力 | 约定 |
|------|------|
| 命名 | 导出 `HImage`；类名 `h-image` / `h-image__*` |
| 基础 | `src`、`alt`（必填） |
| 原生属性 | `width?`、`height?`、`loading?: 'eager' | 'lazy'`（默认 lazy） |
| 视觉 | `fit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'`（默认 cover）、`radius: 'none' | 'sm' | 'md' | 'lg' | 'full'`（默认 md） |
| 失败兜底 | **默认占位 + 可选 `#fallback` slot** |
| 导出 / 演示 | `src/index.ts`；playground 基础 + fallback |
| 文档 / spec | README + guidelines |

## 明确不做

- 不做 gallery / viewer / zoom
- 不做渐进式 skeleton / blur-up
- 不做 aspect-ratio prop（宿主 CSS 控制）
- 不改 Muses

## Acceptance Criteria

- [x] 存在 `HImage.vue` 并导出 `HImage`
- [x] 可演示 fit / radius / fallback
- [x] 样式 `h-image*` + `--h-*`；`npm run build:playground` 通过
- [x] 更新 component-guidelines / tokens / quality / README

## Notes

- 轻量任务，优先 PRD-only。
