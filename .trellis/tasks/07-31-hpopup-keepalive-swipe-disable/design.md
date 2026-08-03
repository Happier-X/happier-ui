# HPopup keepAlive + swipeClose 技术设计

## 1. 边界与契约

| 项 | 值 |
|----|----|
| 修改文件 | `src/components/HPopup.vue`、`src/styles/components/popup.css`、`docs/components/popup.md`、（可选）`playground/src/App.vue` |
| 新增 prop | `keepAlive?: boolean = false`；`swipeClose?: boolean = true` |
| 默认行为 | 两 prop 取默认值时与 0.0.7 完全一致（无回归红线） |
| 兼容性 | 仅新增可选 prop，无 API 破坏；HBottomSheet / HDialog 不接收新 prop（保持各自 API 不动） |

## 2. R1 keepAlive —— 模板与 Transition 的相互作用

### 2.1 问题

当前 `<Transition>` 子元素用 `v-if="visible"` + `:key="transitionKey"`：关闭即卸载。直接改成 `v-show` 会改变默认路径的挂载时机（懒挂载 → 常驻），且 `v-if`/`v-show` 同时切换存在"v-show 立即 display:none 杀死离场动画"的风险。

### 2.2 方案：两指令互斥切换（同一元素上永不同时翻转）

```html
<Transition :name="transitionName" @after-leave="emitAfterLeave">
  <div
    v-if="visible || keepAlive"
    v-show="keepAlive ? visible : true"
    :key="keepAlive ? undefined : transitionKey"
    class="h-popup__slot-anchor"
  >
```

| 模式 | v-if | v-show | Transition 驱动 | 效果 |
|------|------|--------|-----------------|------|
| `keepAlive=false`（默认） | 跟随 `visible` | 恒 `true` | v-if 挂载/卸载 | 与 0.0.7 逐字节一致（含 key 强制重挂载） |
| `keepAlive=true` | 恒 `true`（首渲即挂载） | 跟随 `visible` | v-show display 切换（Vue 3 Transition 原生支持 v-show） | 内容常驻，关闭仅隐藏，重开重放入场动画 |

关键点：任一渲染周期内两个指令**不同时翻转**，因此 Transition 的离场动画不会被 v-show 的 display:none 提前杀死。

### 2.3 配套调整

- `watch(modelValue)`：`transitionKey.value++` 仅在 `!props.keepAlive` 时执行（keepAlive 下递增 key 会重挂载、销毁保活内容，违背本意）。
- 隐藏态安全性：`rootStyle` 已保证 `visibility:hidden` + `pointer-events:none`（根元素），slot-anchor 再叠 `display:none`；隐藏态 focus/点击/Esc/手势均不可达。`aria-modal` dialog 随 `visibility:hidden` 对 AT 隐藏。
- `emitAfterLeave`（清 `panelStyle`）在 v-show 路径同样触发（Transition leave 完成回调），relative 遗留坐标清理不受影响。
- `useScrollLock` 以 `visible` 为条件，与 keepAlive 无关，打开才锁、关闭即释放。

### 2.4 风险与回退

- 若 v-show + Transition 的 `after-leave` 在隐藏后不再触发（理论不成立，Vue 3 文档明确支持），备选：`@after-leave` 依赖保留并手动 `nextTick` 兜底——实现后以 build + 演示实测验证为准。
- 若发现 keepAlive 首渲即挂载造成意外副作用（如 relative 形态初始聚焦），隐藏态 rootEl `tabindex="-1"` + visibility:hidden 已阻断 focus；无需额外处理。

## 3. R2 swipeClose —— 手势禁用

### 3.1 方案

- `onTouchStart` 首行守卫：`if (!props.swipeClose) return`。`swipeTracking` 只能由 `onTouchStart` 置 true，故 Move/End 逻辑天然失效；HPopup 不产生任何 `preventDefault`，手势完全交还宿主。
- 模板 touch 绑定保持原样（早退开销可忽略，且避免模板三目表达式可读性损失）。
- CSS：`touch-action` 复位。fullscreen panel 默认 `touch-action: pan-y`；禁用后需 `auto` 让宿主 JS + CSS 全权接管。新增根级修饰类：

```html
rootClasses = computed(() => [
  `h-popup--position-${props.position}`,
  { 'h-popup--dragging': ..., 'h-popup--snapping': ..., 'h-popup--swipe-disabled': !props.swipeClose && props.position === 'fullscreen' },
])
```

```css
.h-popup--position-fullscreen.h-popup--swipe-disabled .h-popup__panel {
  touch-action: auto;
}
```

- `.h-popup--dragging` 的 `touch-action: none` 在禁用态不可达（dragging 永远不置位）。
- 仅 fullscreen 需要该修饰类（其他 position 无 touch-action 声明）；类绑定加 `position === 'fullscreen'` 条件避免无意义类名。

### 3.2 保留不变的关闭通道

overlay 点击（`closeOnOverlay`）、Esc（`closeOnEsc`）、closeable X、程序化 `v-model` —— 全部走既有 `requestClose()`，与 swipeClose 无关。

## 4. 兼容性与迁移

- 消费者升级 0.0.8：不加 prop 即零行为变化；Muses 传 `:keep-alive="true"` + `:swipe-close="false"` 即可迁移 PlayerPage。
- HBottomSheet / HDialog 不新增透传（Out of Scope），其行为完全不变。
- 样式层：新增规则挂在既有 `@layer components` 内，选择器基于现有 BEM 修饰类模式（`.h-popup--position-fullscreen.h-popup--swipe-disabled`）。

## 5. 回滚

- 改动集中在 3 个源文件 + 1 个文档；`git revert` 单提交可整体回退。
- 无新依赖、无运行时状态机变更（keepAlive 仅为模板指令组合 + watch 分支；swipeClose 为守卫 + 修饰类）。
