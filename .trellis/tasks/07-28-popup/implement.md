# HPopup 实施规划

## 实施顺序（有序，依赖在前）

### 阶段 1：底座

- [ ] **1.1** `src/composables/useScrollLock.ts`：引用计数式锁体滚 SSR 安全。验证手段：暂在 playground console 测试锁/解锁卖点。
- [ ] **1.2** `src/styles/tokens.css`：新增 `--h-popup-z / --h-popup-z-center / --h-popup-z-relative / --h-popup-overlay-bg / --h-popup-radius / --h-popup-max-width-center / --h-popup-max-width-side / --h-popup-duration / --h-popup-duration-overlay / --h-popup-close-gap / --h-popup-close-size`；各 token 取正常值（见 design.md z-index 层表格）；`--h-z-popup` 引用 `--h-popup-z`。
- [ ] **1.3** `src/styles/components/popup.css`：`@layer components` 中 BEM：`h-popup` wrapper、`__overlay`、`__panel`、`__handle`（月同 HBottomSheet 1:1 视觉）、`__close` + `positions`、`__header/__title/__body/__footer`；modifiers `--position-bottom/top/left/right/center/relative` + 各自动画 keyframes；safe-area 补 bottom/top；`__close--top-left` etc。
- [ ] **1.4** `src/styles/components.css`：增加 `@import "./components/popup.css"`（位置在 dialog.css 前）。

### 阶段 2：HPopup 组件

- [ ] **2.1** `src/components/HPopup.vue`：
  - props/emits/slots 按 design.md 实现。
  - 骨架：template 结构按 design.md。
  - 脚本：`useTeleportTarget`（已有）、`useScrollLock`（新）、`positionRelative()` 相对定位函数（源码内联）、`requestClose`/`onEsc`/`onOverlayClick`/`onCloseIcon` 统一关闭路径、`watch modelValue`（开启后 nextTick→open emit+focus+lockScroll；关键后 after-leave emit via `transitionend`/`@after-leave` hook on `<Transition>`）。
  - `position !== 'relative'` 时用 `<Transition name="h-popup-fade">` wrap overlay（或 CSS animation `both` 如现有 dialog.css）；panel 内不可再独立 transition（overlay+panel 一齐走 CSS animation、`v-if` 移除后 animation `both` 保持结束帧）。
  - `after-leave` 实现：监听 panel `animationend` 事件（或 `<Transition>` `@after-leave`）后在 root v-if=false 后发出。具体：因使用 `v-if="modelValue"` 全根移除，无法自监听过渡关闭→ **做法**：不依赖 `v-if` 直接靠 `v-show` 或内部 open state keep root 但用 `v-if`+`<Transition>` 包裹面板（wrapper 常驻、panel 走 `<Transition>`）。选择：采用 `wrapper` 常驻（不 `v-if` 全根）、面板用 `<Transition name="h-popup-<position>" @after-leave="emit('after-leave')">`、overlay 同 transition。这避免了丢失 rootEl ref 的问题且 after-leave 可捕获。
  - 注意：`v-if` 全根移除会导致 `rootEl` ref 在关闭后丢失→下次打开需要 `nextTick` 重新取 ref 不破坏 focus 规则；若 wrapper 常驻则 rootEl 始终在 DOM 无需重获取——**采用 wrapper 常驻方案**（`v-show` ≈ `show` 控制 display 无问题但有 CSS animation + v-show 协作缺陷→改 `v-if` 只包裹 overlay+panel 内部 `<Transition>`，wrapper 真正常驻 `v-if="modelValue"` 改为 `<div v-if="modelValue"`→对，为了有效调用 after-leave，wrapper 需常驻）→最终方案：`<div v-if="modelValue"` → `<div :class="visibilityClasses">` 一直存在（`visibility: hidden` 关闭态）。overlay + panel 由 `<Transition name="h-popup--position-<x>">` 包裹。关闭时 `v-if=false`（内部 on leave）trigger transition→after-leave emit。wrapper 本身不插入 if 移除，只是为了 lockScroll 第一次初始化不被重新 focus。

### 阶段 3：重构 HBottomSheet / HDialog

- [ ] **3.1** 重写 `src/components/HBottomSheet.vue`：模板变薄包装，HPopup `position="bottom"` + `handle="showHandle"` + `title/ariaLabel/teleport` + `#title` slot 透传；emit `update:modelValue` 与 `close` 原样转发；保留旧文件完整注释。`useTeleportTarget` 旧 import 移除。
- [ ] **3.2** 重写 `src/components/HDialog.vue`：`HPopup position="center"` 包装；`title/description` → title slot 合并渲染（HDialog 内包装带 description 的 header 走到 `#title` slot）；`#actions` → `#footer`；emit 原样转发。
- [ ] **3.3** 清理 `src/styles/components/bottom-sheet.css` / `dialog.css`：替换为 stub（`@layer components { /* migrated to popup.css; kept for backward import compatibility */ }` + 保留注释标明哪些旧 token 已废）。`components.css` 两 import 保持不删。

### 阶段 4：导出与文档

- [ ] **4.1** `src/index.ts`：增加 `export { default as HPopup } from './components/HPopup.vue'`（HBottomSheet/HDialog 导出不变）
- [ ] **4.2** 更新 `.trellis/spec/frontend/component-guidelines.md`：「当前导出」表增加 `HPopup` 行，verbose 说明 props/emits/slots/a11y；同时更新 HBottomSheet/HDialog 对应行标记"内部基于 HPopup"。更新「API 约定」表增加 Popup 一行。
- [ ] **4.3** `docs/components/popup.md`：中文页——简介、position 示例（bottom/center/left/relative+closeable 四个用例）、props/emits/slots 表、a11y 要点。侧栏 `.vitepress` config 加入口。
- [ ] **4.4** `playground/src/App.vue`：新增 `HPopup` 演示段（参考现有 dialog/bottomsheet toast 演示风格）——覆盖：bottom panel（默认 showHandle + closeOnOverlay）、center dialog（title+footer）、left panel（drawer 风格）、relative-to-trigger（绑定按钮触发弹出下方菜单）。

### 阶段 5：验证

- [ ] **5.1** `npm run build:lib`（Vite build → dist）
- [ ] **5.2** `npm pack --dry-run`：确认 `dist/` 文件列表不含 src/playground/docs/.trellis
- [ ] **5.3** `npm run build:playground`：确认 TW4 + styles 加载不报错，新演示段可见可交互
- [ ] **5.4** 手工浏览器验证 playground：
  - bottom panel: overlay click → 关；Esc → 关；handle 可见；body 锁滚动确认
  - center dialog: 居中、缩放动画、title+description+actions
  - left panel: slide-right 动画
  - relative trigger: 按钮 click → 弹出下方 → 自动翻转 (若视口空间不足) → resize 窗口重定位
  - closeable button：visible 在 top-right 点关
  - HBottomSheet/HDialog 旧演示段外观无变化（A/B 对照）
- [ ] **5.5** `npm run docs:build`（可选）

## 高风险文件 / 回滚点

- **`HBottomSheet.vue` / `HDialog.vue`**：若重构后行为漂移超过可接受 → 直接 revert 文件保留旧拷贝（旧样式保留在面板.css 但移走的 stub 可临时恢复内容改为旧规则集）。HPopup 仍可完成不对它们重构而以"独立组件"取代 MVP（实施中可再决策）。
- **`components.css`**：若删除旧 import 引发消费方解析失败 → 保持旧文件存在即可（不 import 但仍然 valid），最低改法是保留文件 body、不 touch。
- **`tokens.css`**：新 token 命名与旧 `--h-bottom-sheet-*` / `--h-dialog-*` 不应冲突；旧 token 持久保留。

## 实现对齐原则

- `withDefaults` + `defineProps<{...}>()` （typed）— 项目全组件均此风格
- `defineEmits` 对象形式（如 `defineEmits<{ 'update:modelValue': [boolean], close: [] }>()`）
- CSS BEM class 一律前缀 `h-popup__*`
- `useTeleportTarget(() => props.teleport)` — SSR-safe 现有模式
- `useId()` — 生成稳定 `titleId` 作 `aria-labelledby`
- `role="dialog"` + `aria-modal`（relative 除外 modal=false 或无）——满足无障碍最低线
- 键盘 `@keydown.esc.prevent`
- `handle` prop 仅 `position="bottom"` 有用；`closeable` 所有 position 可启用
- 提交前 `npm run build:playground` 一次