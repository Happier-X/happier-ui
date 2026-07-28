# HPopup 技术设计

## 架构概览

```
             HPopup.vue (全形态定位基座，非引擎)
                  |
   ┌──────────────┼──────────────┐
   │              │              │
HPopup.vue     HBottomSheet.vue  HDialog.vue
 (position:     (→HPopup)        (→HPopup)
 bottom/center/
 left/right/top/
 relative)
```

- **HPopup** 做定位、overlay、关闭、滚动锁定、标题栏、关闭按钮、teleport——即所有共享浮层行为的唯一底座。
- **HBottomSheet / HDialog** 变为薄包装：固定 `position="bottom"` 或 `position="center"`，透传 props + slot；保持旧 API 不变。
- `useScrollLock` 是唯一新增 composable，供 HPopup 单选计数式锁滚动。
- `useTeleportTarget` 继续复用不修改。

## 组件契约

### HPopup props

已有浮层共享收敛为以下 prop 集：

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `modelValue` | `boolean` | `false` | v-model 控制显隐 |
| `position` | `'bottom' \| 'top' \| 'left' \| 'right' \| 'center' \| 'relative'` | `'bottom'` | 浮层形态/定位 |
| `triggerRef` | `HTMLElement \| null` | `null` | **仅 `position='relative'` 时必填**——相对定位的触发元素 |
| `closeOnOverlay` | `boolean` | `true` | 点蒙层是否关闭（`relative` 无 overlay 时忽略） |
| `closeOnEsc` | `boolean` | `true` | Esc 是否关闭 |
| `lockScroll` | `boolean` | `true` | 是否锁 body 滚动 |
| `title` | `string` | `undefined` | prop 标题文本，无 slot 时自动绑定 `aria-labelledby` |
| `title` (slot) | `#title` | 覆盖 prop 标题 |
| `closeable` | `boolean` | `false` | 是否显示内置关闭按钮 |
| `closeIconPosition` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'top-right'` | 关闭按钮位置 |
| `ariaLabel` | `string` | `undefined` | `title` + `#title` 均无时的兜底可访问名 |
| `teleport` | `string \| HTMLElement \| false` | `'body'` | Teleport 目标（`false` 就地渲染） |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'lg'` | 面板圆角（`--h-radius-lg` 默认 20px） |
| `duration` | `number` | 对应 `--h-popup-duration` (220ms) | 面板过渡时长（宿主可覆盖回 180ms 对齐旧 dialog） |
| `handle` | `boolean` | `false` | **底部面板可选拖拽手柄**（HeroUI Native Bottom Sheet Handle）——供 HBottomSheet `showHandle` prop 驱动 |

### HPopup emits

| Emit | Payload | 说明 |
|------|---------|------|
| `update:modelValue` | `boolean` | v-model 双向绑定 |
| `close` | `()` | 每次关闭发出（无论来源） |
| `open` | `()` | v-model 由 false→true 后、DOM ready（nextTick）后发出 |
| `after-leave` | `()` | CSS 过渡完毕（供宿主销毁/清理） |
| `click-overlay` | `()` | 点击 overlay 时发出（可选） |
| `click-close-icon` | `()` | 点击内置关闭按钮时发出（可选） |

### HPopup slots

| Slot | Scope | 说明 |
|------|-------|------|
| `default` | — | **必填**，弹层内容 |
| `title` | — | 覆盖 prop `title` |
| `footer` | — | 底部操作区（对齐 HDialog `#actions`） |

## 内部结构（HPopup SFC template 骨架）

```html
<Teleport :to="teleportTo" :disabled="teleportDisabled">
  <div v-if="modelValue" ref="rootEl" tabindex="-1" class="h-popup" @keydown.esc.prevent="onEsc">
    <!-- overlay（除 relative 外渲染） -->
    <div v-if="position !== 'relative'" class="h-popup__overlay" aria-hidden="true" @click="onOverlayClick" />
    <!-- 面板 -->
    <section
      class="h-popup__panel"
      role="dialog"
      aria-modal="position !== 'relative' ? true : undefined"
      aria-labelledby="...| titleId | ariaLabel"
    >
      <!-- 拖拽手柄（position=bottom + handle=true） -->
      <div v-if="position === 'bottom' && handle" class="h-popup__handle" aria-hidden="true" />
      <!-- 关闭按钮 -->
      <button v-if="closeable" class="h-popup__close" :class="closeIconClass" @click="onCloseIcon"> 
        <HIcon icon="X" size="20" aria-hidden="true" />
      </button>
      <!-- 标题 -->
      <header v-if="title || $slots.title" class="h-popup__header">
        <slot name="title"> <h2 :id="titleId" class="h-popup__title">{{ title }}</h2> </slot>
      </header>
      <!-- 内容 -->
      <div class="h-popup__body"><slot /></div>
      <!-- footer -->
      <footer v-if="$slots.footer" class="h-popup__footer"><slot name="footer" /></footer>
    </section>
  </div>
</Teleport>
```

## 定位逻辑分层

### 1. overlay 全屏形态（bottom / top / left / right / center）

CSS-only 动画：面板 `position: relative`（在 wrapper `position: fixed; inset: 0; display: flex` 内），动画由 `h-popup--position-<x>` modifier 驱动（`@keyframes h-popup-slide-up/-down/-left/-right/-center`）。

- **z-index**: `var(--h-popup-z, 1200)` 覆盖层的 anchor（wrapper 写 z）

### 2. relative 形态（相对 trigger）

**运行时 JS 定位（position="relative"）**：
- 打开时调 `positionRelative(triggerEl, panelEl)`:
  1. `trigger.getBoundingClientRect()` + `panel.offsetWidth/Height`
  2. 首选 `placement` = `bottom`（Vant/React Aria 惯例：优先向下方展开）
  3. 检测四边空间：若下方不足且上方足够→翻转 top；top 不足试 left/right；都紧靠时选最大可用方向
  4. 设 `panel.style.{position:'fixed', top, left}` + z（`var(--h-z-popup-relative, 1160)`）
- `open` 后 listen `window resize` + `window scroll`(capture:true)：调 `positionRelative` 重算位置（不关闭）。
- 模型内不锁 `body`（因为 overlay 无，界面仍可用）。

**边界夹**: `top ≥ 4px` / `left ≥ 4px` / `right ≤ vw-4` / `bottom ≤ vh-4`（二次防溢出）。

**宽度**: triggerWidth 或 `auto`（如菜单）：默认 `min-width: triggerWidth` + `max-width: 300px`（可 `max-width` prop 覆盖）。

## useScrollLock composable

```ts
// src/composables/useScrollLock.ts
export function useScrollLock(options: { enabled: ComputedRef<boolean> | (() => boolean) })
// SSR guard; 使用引用计数 `locks` (module-level)，多弹层协作
// 锁逻辑：documentElement.style.overflow = 'hidden'; paddingRight = `${scrollbarWidth}px` 防横跳
// un-lock: overflow: '', paddingRight: '' (仅在 lock count=0 时)
// onBeforeUnmount: decrement count + 还原
```

## HBottomSheet.vue 重构 bridge

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: boolean
  closeOnOverlay?: boolean
  showHandle?: boolean
  title?: string
  ariaLabel?: string
  teleport?: string | HTMLElement | false
}>(), {
  modelValue: false,
  closeOnOverlay: true,
  showHandle: true,
  title: undefined,
  ariaLabel: undefined,
  teleport: 'body',
})
const emit = defineEmits<{ 'update:modelValue': [boolean], close: [] }>()
// title slot → HPopup #title: 透传
// default slot → HPopup default: 透传
</script>
<template>
  <HPopup
    :model-value="modelValue"
    position="bottom"
    :handle="showHandle"
    :close-on-overlay="closeOnOverlay"
    :close-on-esc="true"
    :lock-scroll="true"
    :title="title"
    :aria-label="ariaLabel"
    :teleport="teleport"
    :radius="'lg'"
    :duration="220"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #title><slot name="title" /></template>
    <slot />
  </HPopup>
</template>
```

HBottomSheet 不再有独立样式/模板逻辑——全迁 HPopup。保留文件 `src/components/HBottomSheet.vue` 且导出不变。旧 `src/styles/components/bottom-sheet.css` 保留但减化为 `@import` 转发 popup.css 的对应规则（或 empty 以避免消费方 `import` 报错；具体实现时评估后决定）。`components.css` 中 `bottom-sheet.css` 导入保留不删。

## HDialog.vue 重构 bridge

同模式：固定 `position="center"`，props (modelValue/closeOnOverlay/closeOnEsc/title/description/ariaLabel/teleport) 透传，emit 为 `update:modelValue` / `close`。`#title/#description` → HPopup `#title`（description 并入 title slot 区或同 header），`#actions` → HPopup `#footer`。prop `description` 通过 HPopup 不暴露（HDialog wrapper 自行渲染 description 到 slot 区）。见 implement.md 详细。

## CSS 体系策略

### 旧文件处置
- `bottom-sheet.css` / `dialog.css`: **不删除**（保证 `components.css` 旧 import 不报错），内容替换为一个 `@layer components { /* 迁移至 popup.css */ }` 的空 stub 或注释块。色彩与动画定义全在 `popup.css` 中由 `h-popup--position-bottom/center` modifier 承担——不再靠文件级 `bottom-sheet.css` 扮演角色。
- 消费方样式入口 `happier-ui/styles` 不变。

### popup.css 骨架

```css
@layer components {
  .h-popup { position: fixed; inset: 0; /* z handled by specific modifier */ }
  .h-popup__overlay { position: absolute; inset: 0; background: ...; animation: ... }
  .h-popup__panel { position: relative; ...> ... }

  /* modifiers */
  .h-popup--position-bottom {
    z-index: var(--h-popup-z, var(--h-z-bottom-sheet, 1200));
    display: flex; align-items: flex-end; justify-content: center;
    /* .h-popup__panel { ... margin/padding safe-area ... } */
  }
  /* ... center/top/left/right/relative ... */
  
  /* close icon */
  .h-popup__close { ... }
  .h-popup__close--top-left { ... }
  /* ... */
}
```

## z-index 层级

| 上下文 | Token | 值 | 说明 |
|--------|-------|----|------|
| Popup 贴边/居中 | `--h-popup-z` | `1200` | 覆盖层（对齐旧 `--h-bottom-sheet-z`） |
| Popup center | `--h-popup-z-center` | `var(--h-popup-z) \| 1210`（可选 layer 细分）| 若需比 bottom 高 10 |
| Popup relative | `--h-popup-z-relative` | `1160` | 低于 select=1150 但高于 bubble=999 |
| select popover | `--h-z-select` | `1150` | 不动 |
| floating-bubble | `--h-z-floating-bubble` | `999` | 不动 |
| toast | `--h-z-toast` | `1220` | 不动 |

> 理由：relative popup = 1160 > select 1150 ———— 不对：select 应该优先于 popup？等会：select popover 的 z 是 1150、relative popup 若同为 popover 场景可能冲突。保守方案：relative popup 用 `var(--h-z-popup-relative, 1160)` 略高于 select 5px 避免 select 遮盖 popup（但如果有 popup 内装 select 则 Z 层级无嵌套差）。实际上 popup 承载 select 机率不高（select 自带 popover）。保持 1160、select 也 1150、合理；若场面冲突由宿主覆盖。

## 数据流

```
宿主 v-model 写 true
  → HPopup watch open: nextTick + open emit + lockScroll(enabled? → useScrollLock.lock) + position==relative? → positionRelative()
  面板渲染、CSS 动画入场
外部破坏→closeOnOverlay/Esc/closeable→requestClose()
  → emit update:modelValue(false) + close + lockScroll.unlock
  → v-if=false 后 → after-leave emit
```