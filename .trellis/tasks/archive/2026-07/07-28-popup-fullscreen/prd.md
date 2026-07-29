# Popup 增加 fullscreen 形态（含下滑关闭手势）

## Goal

为 `HPopup` 新增 `position="fullscreen"` 形态——面板完全占满视口（`inset: 0`），无圆角、无 header 区、**下滑手势关闭**。是一种"页面级全屏模态"（非展开式 bottom→full 过渡），区别于现有 position=center/bottom 的半屏/居中形态。

## Background

- 现有 6 种 `position`（bottom/top/left/right/center/relative）均不占满视口，各有固定圆角+标题区。
- 项目中尚无覆盖整屏的浮层（`HBottomSheet` 虽可触顶但不能占满）——Muses 可能用到"全屏过滤面板""全屏表单页"等场景。
- 下滑关闭是移动端纯直觉手势（iOS/Android 惯例：顶部导航/Modal 下滑 dismiss），HeroUI Native 没有先例但 Vant 有 `close-on-popstate` / `closeable` 而无手势；本项目首个手势。

## Key Decisions

| # | 决策 | 选择 | 理由 |
|---|------|------|------|
| D1 | 形态名 | **`position="fullscreen"`** | HTML Fullscreen API 命名一致，区别于 `full` 可能误解为 `width: 100%` |
| D2 | 视觉边界 | **选项 A：纯全屏 `inset: 0`**，无圆角无 safe-area 内边距 | 用户确认；全页式模态无视觉边界 |
| D3 | 标题区 | **不渲染 header**（无 title 区域）；宿主通过 slot 自管头部 | 全屏形态 header 多余；宿主内嵌 NavBar 自控 |
| D4 | 关闭方式 | **保留 overlay/Esc/closeable + 新增下滑手势** | overlay/Esc 全形态一致；下滑是全屏特有直觉手势 |
| D5 | 下滑手势阈值 | **下滑 ≥ 80px 或速度 ≥ 0.3 px/ms** 触发关闭（任一条满足即可）；pixel 优先 velocity 兜底 | 常见手势模型（惯性速度+绝对位移）; 不达阈则弹簧回弹 |
| D6 | 手势实现范围 | **仅 touch 事件**（`touchstart/touchmove/touchend`），不处理 mouse drag | 移动端优先；Web 端无需下滑 |
| D7 | overlay | **保留 overlay**，与其他带遮罩形态一致（center/bottom 也有 overlay） | 避免全屏无遮罩误触背景 |
| D8 | `handle` prop | **falsy 占位**：fullscreen 不听 `handle` prop | `handle` 仅 bottom 有效；fullscreen 画面整屏无需视觉手柄 |
| D9 | z-index | **复用 `--h-popup-z`**（1200），与 bottom/center 同级 | 全屏模态与半屏弹层同权重，不另建 token |

## Requirements

### R1：fullscreen 形态

- `position="fullscreen"`：面板 `position: fixed; inset: 0; z-index: var(--h-popup-z)`。
- CSS modifier: `.h-popup--position-fullscreen`。
- 动画：入场 `translateY(8px) | opacity(0→1)`（平滑微动），出场 `translateY(100%) | opacity(1→0)`（下滑消失）。持续 `330ms`（略长于 220ms 以匹配手势物理感）。
- **无圆角**、**无 safe-area 内边距**（inset: 0 覆盖安全区）、**无 handle**（忽略 prop）。
- **不渲染 header 区域**：模板中 `<header v-if="title || $slots.title">` 改为 `v-if="(title || $slots.title) && position !== 'fullscreen'"`。
- 宽度/高度由宿主管：仅 `overflow: auto`（滚动由内容驱动）。

### R2：下滑关闭手势

- 仅在 `position="fullscreen"` + `modelValue === true` 时启用 touch 监听。
- 触摸事件绑定在 HPopup `rootEl` 或其直接 deck div 上：
  - `touchstart`：记录 `startY`、`startTime`。
  - `touchmove`：实时计算 `deltaY = currentY - startY`；仅 **向下滑（deltaY > 0）生效**，向上忽略不作动作；设 `transform: translateY(deltaY === max(0, ...))` 于 panel（或面板 wraper），overlay 透明度随 delta 渐变：`max(0, 1 - deltaY/winHeight)`。
  - `touchend`：取 `deltaY`、计算速度：`velocity = abs(deltaY) / (duration || 1)`；若 `deltaY ≥ 80` **OR** `velocity ≥ 0.3` → 触发 `requestClose()`（emit `update:modelValue(false)` + `close`）；否则弹簧回弹（CSS transition `transform→0 | opacity→1` 于 `250ms ease-out`）。
- 手势期间锁 body 滚动（**且屏面板本身的 overflow 也 lock** 避免将下滑传递给内容区域滚动）——通过在最表层 div 加 `touch-action: none` CSS。
- 多指识别：只处理第一指（`e.touches[0]`），第二指忽略、不 handle pinch。

### R3：保留现有 close 通道

- Overlay / Esc / `closeable`（X按钮）仍按现有 `requestClose` 统一关闭路径运行——fullscreen 亦然。
- 手势关闭触发同 `requestClose()` ⊢ emit chain。

### R4：header 排除

- HPopup 模板中 header 的 `v-if` 加 `&& position !== 'fullscreen'` 条件——全屏无 title/`#title` header。
- `aria-labelledby`：fullscreen 不渲染 header + 透传 `aria-label`（若 prop 非空）到 panel；否则面板无 label（不强制——宿主在内容区自绑 aria）。

### R5：token

- 可选 token：不新增 `--h-popup-fullscreen-duration` 专门 token（反正 duration 靠 CSS 写死 330ms + CSS 变量覆盖可 override）。暂不扩大 token 矩阵。

### R6：文档

- 更新 `docs/components/popup.md` 加 fullscreen 演示（含下滑手势描述 + closeable 按钮备选关闭）。
- 更新 sidebar 不需要改（已在组件列表内）。

## Acceptance Criteria

- [ ] **AC1**: `position="fullscreen"` 渲染时面板 `inset: 0`、无圆角、无 safe-area padding、无 header 区域（即使 prop `title` 有值也不渲染标题）。
- [ ] **AC2**: 仅向下滑≥80px 或速度≥0.3 px/ms 时触发关闭；不达阈弹簧回弹（≤250ms 弹性动画）。
- [ ] **AC3**: 下滑期间 overlay 透明度随 deltaY 渐变（clip 0→完全透明, 并隐藏蒙层）。
- [ ] **AC4**: Overlay click / Esc / closeable X 按钮仍可关闭 fullscreen。
- [ ] **AC5**: `handle` prop 在 fullscreen 无作用（无视觉手柄出现）。
- [ ] **AC6**: `lockScroll: true`（默认）打开 fullscreen 时 body 不可滚；手势期间锁面板内部滚动（`touch-action: none`）。
- [ ] **AC7**: `npm run build:playground` + `docs:build` 通过；fullscreen 演示段可交互。
- [ ] **AC8**: 其他 6 种 position 行为不受影响（无回归——center/bottom/relative 等保持旧行为和视觉效果）。

## Out of Scope

- 双指捏合/缩放
- 多指手势同时识别
- 横向手势关闭（只在 `position=left/right` 增加横向 dismiss 是 future）
- 半屏→全屏过渡动画（drag to expand 如 iOS Maps 搜索抽屉）
- mouse 拖拽关闭 Web 端全屏
- 手势速度曲线定制（固定 `0.3px/ms`）
- fullscreen 退出动画用 `<Transition>` 配合 gesture（退出动画在 `visible = false` 后由 CSS animation `both` 控制；手势后无须自定义）

## Risks

| 风险 | 缓解 |
|------|------|
| 下滑手势与面板内容 overflow 冲突（菜单、列表滑块）| `touch-action: none` 锁面板区 + 排除 `scroll` event 干扰 |
| fullscreen 加手势后 HPopup 源码膨胀 | gesture 函数封装独立 `useSwipeToClose`（内联不抽 composable 亦 fine）；`position === 'fullscreen'` 的条件分支仅 2 处（header 不渲染 + gesture 注册） |
| `aria-labelledby` 在 fullscreen 无 header 时为 undefined → 面板无可访问名 | 宿主导入 `aria-label` prop 兜底（同现有行为） |

## Notes

- 本次改动范围：HPopup.vue（手势逻辑 + header 条件）+ popup.css（1 modifier + 1 动画 sequence）+ popup.md（文档更新）+ 1 playground 演示段。不触及 HBottomSheet/HDialog wrapper。
- 手势体验参考：iOS 下滑 dismiss（tweet detail / safari tab 等有物理弹簧感但本项目走弹性 transition 而非 UIKit 动力学）。