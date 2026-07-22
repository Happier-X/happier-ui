# 技术设计：HDialog

## API

```ts
modelValue?: boolean
closeOnOverlay?: boolean // true
closeOnEsc?: boolean // true
title?: string
description?: string
ariaLabel?: string

emit('update:modelValue', false)
emit('close')
```

Slots：`title` / `description` / default / `actions`。

## 结构

- fixed root，overlay + centered panel。
- root `tabindex=-1`，打开后 nextTick focus；keydown Esc 按 `closeOnEsc`。
- 自动 `useId()` 生成 titleId / descriptionId；仅 prop 文本时自动关联；自定义 slot 时调用方用 `ariaLabel`（MVP 不支持 slot 自动 id 注入）。

## 视觉

- overlay 可复用 bottom-sheet overlay 色 fallback，但单独 `--h-dialog-*` token 保持可调。
- panel max-width 420px，移动端左右留 16px。
- actions flex，默认右对齐，允许换行。
- entering animation：overlay opacity + panel scale(.96)/translateY(8px)。关闭立即卸载，与 HBottomSheet MVP 一致。

## 文件

`HDialog.vue`、index、tokens、playground、README、frontend specs。
