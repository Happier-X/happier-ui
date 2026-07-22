# 技术设计：HBottomSheet

## 契约

```ts
modelValue?: boolean
closeOnOverlay?: boolean // default true
showHandle?: boolean     // default true
title?: string
ariaLabel?: string       // 无 title 时建议传

// emits
'update:modelValue': [value: boolean]
'close': []
```

模板结构：

```html
<div v-if="modelValue" class="h-bottom-sheet" @keydown.esc="requestClose">
  <div class="h-bottom-sheet__overlay" @click="onOverlayClick" />
  <section class="h-bottom-sheet__panel" role="dialog" aria-modal="true" ...>
    <div v-if="showHandle" class="h-bottom-sheet__handle" aria-hidden="true" />
    <header v-if="title || $slots.title" class="h-bottom-sheet__header">
      <slot name="title"><h2 :id="titleId">{{ title }}</h2></slot>
    </header>
    <div class="h-bottom-sheet__body"><slot /></div>
  </section>
</div>
```

## 状态与动画

- MVP 用 `v-if` 渲染；CSS transition 只能表现 entering，关闭会直接卸载。若要关闭动画，使用内部 `isVisible` / `isLeaving` 延迟卸载会复杂。本任务优先保持简单：打开时有 slide/fade，关闭直接隐藏可接受。
- 可用 `@animationend` + internal state 后续优化；不纳入 MVP。

## 关闭逻辑

```ts
const requestClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
```

- overlay click：`closeOnOverlay` 为 true 才关闭。
- Esc：在 root 上监听；需要 root `tabindex="-1"` 并在打开时 focus。实现可用 `ref` + `watch(nextTick focus)`。

## A11y

- `role="dialog"`、`aria-modal="true"`。
- 有 `title` prop 时自动生成 `titleId` 并设置 `aria-labelledby`。
- 无标题时使用 `ariaLabel` 映射 `aria-label`。
- 不做 focus trap；后续再加。

## Token（建议新增）

```css
--h-bottom-sheet-z: 1200;
--h-bottom-sheet-overlay-bg: rgba(0, 0, 0, 0.36);
--h-bottom-sheet-radius: 24px;
--h-bottom-sheet-max-width: 640px;
--h-bottom-sheet-duration: 220ms;
```

## 文件

- `src/components/HBottomSheet.vue`
- `src/index.ts`
- `src/tokens.css`
- `playground/src/App.vue`
- `README.md`
- `.trellis/spec/frontend/component-guidelines.md` / `tokens.md` / `quality-guidelines.md`

## 风险

| 风险 | 处理 |
|------|------|
| 原地渲染受父容器 stacking context 影响 | playground 可用；README/spec 标注非 portal MVP |
| 无 focus trap | 明确不做；保留 Esc 与 dialog 语义 |
| 关闭动画缺失 | MVP 可接受；后续可加内部状态 |
