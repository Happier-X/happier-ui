# HPopup bottom 拖拽关闭 — 技术设计

## 现状（改动前）

- 手势状态机集中在 `HPopup.vue`：非响应式局部变量 `swipeTracking / swipeStartX / swipeStartY / swipeStartTime` + 响应式 `swipeDragging / swipeSnapping / swipeDeltaY`；计时器 `swipeResetTimer`。
- `onTouchStart`：`position !== 'fullscreen'` 直接早退；`panel.scrollTop > 0` 早退。
- `onTouchMove`：仅向下且 deltaX 小于 deltaY 时接管；接管后 `event.preventDefault()`。
- `onTouchEnd`：达阈 → 复位 delta + 立即 `requestClose()`；未达阈 → snapping 回弹（`swipeDeltaY → 0`，250ms）。
- `gesturePanelStyle / gestureOverlayStyle`：条件均为 `position === 'fullscreen'`。
- CSS：`.h-popup--position-fullscreen.h-popup--dragging / --snapping / --swipe-disabled` 三组规则；panel 基础 `touch-action: pan-y` + `overscroll-behavior-y: contain`。
- bottom panel：无 touch-action 声明（浏览器默认 auto）；关闭即卸载（`h-popup-fade` 无 CSS 规则，无离场动画）。

## 目标结构

```
手势状态机（HPopup.vue，bottom + fullscreen 共用）
   ├─ onTouchStart  → 位置放宽 + panel.contains 守卫 + snapping 期间忽略
   ├─ onTouchMove   → 不变（scrollTop / 方向 / preventDefault 守卫已通用）
   ├─ onTouchEnd    → 达阈：bottom 走「滑出再关」/ fullscreen 保持「立即关」
   │                 未达阈：snapping 回弹（共用）
   └─ resetSwipe    → 同时清理 swipeResetTimer（回弹）与 swipeCloseTimer（滑出关层）
```

## 组件契约（API 变化）

| 项 | 变化 |
|----|------|
| `swipeClose`（默认 `true`） | 语义由「fullscreen 下滑手势开关」扩展为「bottom/fullscreen 下滑关闭手势开关」；`false` 时两者均禁用、面板 `touch-action` 复位 `auto` |
| props / emits | **零新增、零删除**（AC10） |

## 数据流

### 手势判定（onTouchStart）

```ts
if (!props.swipeClose) return
if (props.position !== 'fullscreen' && props.position !== 'bottom') return
if (!visible.value || event.touches.length !== 1) return
const touch = event.touches[0]
const panel = panelEl.value
if (!touch || !panel || panel.scrollTop > 0) return
// bottom 下 overlay 区域起拖不触发；fullscreen 面板铺满视口，恒为 true
if (!panel.contains(event.target as Node)) return
// snapping（滑出/回弹）期间忽略新 touch，避免打断过渡
if (swipeSnapping.value) return
// ... 记录起点
```

### 拖动与遮罩（onTouchMove / computed）

- `gesturePanelStyle` / `gestureOverlayStyle` 条件：`position === 'fullscreen' || position === 'bottom'`。
- 抽 `getViewportHeight()`：`typeof window === 'undefined' ? 1 : Math.max(window.innerHeight, 1)`，overlay 渐隐与滑出目标共用。
- `onTouchMove` 不动：向下 + `scrollTop === 0` + deltaX < deltaY 才接管并 preventDefault——对 bottom 天然成立（panel 自身即滚动容器）。

### 松手分流（onTouchEnd）

```ts
const shouldClose = swipeDeltaY.value >= SWIPE_DISTANCE_THRESHOLD
  || velocity >= SWIPE_VELOCITY_THRESHOLD

if (shouldClose) {
  if (props.position === 'fullscreen') {
    // 保持现有：复位 + 立即关闭（离场动画由 h-popup-fullscreen-out 承担）
    swipeDragging.value = false
    swipeSnapping.value = false
    swipeDeltaY.value = 0
    requestClose()
  } else {
    // bottom：先滑出视口再关闭（bottom 无离场动画，直接卸载会跳变）
    swipeDragging.value = false
    swipeSnapping.value = true
    swipeDeltaY.value = getViewportHeight()   // transition 从当前位移滑到视口外
    swipeCloseTimer = setTimeout(() => {
      swipeCloseTimer = undefined
      requestClose()
    }, SWIPE_SNAP_DURATION)
  }
  return
}
// 未达阈：snapping 回弹（现有逻辑，不动）
```

### 状态清理

- `swipeCloseTimer`：新局部计时器（仅 bottom 滑出路径）。`resetSwipe()` 同时 `clearTimeout` 两个计时器；`onTouchCancel` / 关闭 watcher / `onBeforeUnmount` 均走 `resetSwipe`。
- 关闭 watcher 的 `resetSwipe()` 保持原位：滑出结束后 `requestClose → visible=false` 时 panel 已在视口外，delta 归零不可见，无跳变。
- 不做 `after-leave` 依赖（bottom 无离场 Transition）。

## CSS（popup.css）

追加于 bottom 段之后、fullscreen 段之前（镜像 fullscreen 三态）：

```css
/* bottom 手势基础：纵向滚动原生 + 过度滚动不冒泡 */
.h-popup--position-bottom .h-popup__panel {
  touch-action: pan-y;
  overscroll-behavior-y: contain;
}

/* 拖动期：锁面板滚动 + 禁用入场动画，transform 跟随手指 */
.h-popup--position-bottom.h-popup--dragging .h-popup__panel {
  animation: none;
  transition: none;
  touch-action: none;
}

/* 未达阈回弹 / 滑出离场：250ms ease-out */
.h-popup--position-bottom.h-popup--snapping .h-popup__panel {
  animation: none;
  transition: transform 250ms var(--h-ease-standard, ease-out);
}
.h-popup--position-bottom.h-popup--snapping .h-popup__overlay {
  transition: opacity 250ms var(--h-ease-standard, ease-out);
}

/* 手势禁用：touch-action 交还宿主 */
.h-popup--position-bottom.h-popup--swipe-disabled .h-popup__panel {
  touch-action: auto;
}
```

- `rootClasses` 的 `h-popup--swipe-disabled` 条件：`!props.swipeClose && (position === 'fullscreen' || position === 'bottom')`。
- 选择器特异性均高于 `.h-popup--position-bottom .h-popup__panel` 基础规则，无层叠问题。

## 兼容性与回归

- **fullscreen**：手势代码零改动（仅条件放宽时 `position !== 'bottom'` 分支被跳过，fullscreen 路径逐字节不变）；CSS 不动。
- **其他 position**：`onTouchStart` 仍早退；`touch-action` 声明仅加在 bottom，left/right/center/top/relative 无任何变化。
- **HBottomSheet**：不经 prop 变化，`showHandle` 默认 true 的既有实例自动获得手势（scrollTop=0 向下拖，触屏行为增强，不破坏 API）。
- **keepAlive**：滑出 → 关闭（v-show 隐藏）→ `resetSwipe` 归零不可见；重开 panel 回原位，入场动画照常。无冲突。

## 验收验证方式

- `npx vue-tsc --noEmit -p tsconfig.lib.json` 零错误。
- `npm run build:lib` / `npm run build:playground` / `npm run docs:build` 全通过。
- trellis-check 子代理核验：手势分流分支、守卫、CSS 三态、docs/playground 一致性。
- 手动（真机/DevTools touch 模拟）验证 AC1–AC8。
