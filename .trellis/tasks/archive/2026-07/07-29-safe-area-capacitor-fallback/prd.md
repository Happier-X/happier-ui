# HNavBar / HTabBar safe-area fallback to Capacitor 8 `--safe-area-inset-*`

## Goal

为 `HNavBar`（顶部）和 `HTabBar`（底部）的 safe-area 样式增加 **Capacitor 8 `--safe-area-inset-*` 自定义属性回退**，解决 Android 15+ Edge-to-Edge 模式下 `env()` 返回 0 导致内容与状态栏/导航栏重叠的问题。

## Background

- Capacitor 8 的 `SystemBars` 插件（默认 `insetsHandling: "css"`）向文档根注入 `--safe-area-inset-top` / `--safe-area-inset-bottom` 等自定义属性，值来自 Android 系统栏真实高度。
- 旧版 Android WebView（< 140）不支持 `env(safe-area-inset-top)` 或返回 0，导致 HNavBar/HTabBar 的 safe-area padding 失效。
- 当前代码只读 `env(safe-area-inset-top, 0px)` / `env(safe-area-inset-bottom, 0px)`，未消费 Capacitor 注入的值。

## Requirements

### R1：三阶回退

- **顶部（nav-bar）**：`padding-top` 依次回退 `var(--safe-area-inset-top, env(safe-area-inset-top, 0px))`
- **底部（tab-bar）**：`padding-bottom` 依次回退 `var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))`

优先使用 Capacitor 注入的自定义属性 → 标准 `env()` → `0px` 兜底。

### R2：兼容性

- 保留 `constant()` 前缀回退（iOS < 11.2）——当前 nav-bar 有 `constant(safe-area-inset-top)` 但 tab-bar 无 `constant()`。统一为：`constant()` 放在 `env()` 之前。
- 变更后旧项目（无 Capacitor 注入）行为不变——`var(--safe-area-inset-top, ...)` 在没有自定义属性时正常退到 `env()`。

### R3：scope

仅修改 `src/styles/components/nav-bar.css` 和 `src/styles/components/tab-bar.css`。不涉及 Vue 模板、TS、token、文档。

## Acceptance Criteria

- [ ] **AC1**: `.h-nav-bar--safe-area` 的 `padding-top` 优先使用 `var(--safe-area-inset-top, ...)`，然后 `constant(safe-area-inset-top)`，然后 `env(safe-area-inset-top, 0px)`。
- [ ] **AC2**: `.h-tab-bar--safe-area` 的 `padding-bottom` 优先使用 `var(--safe-area-inset-bottom, ...)`，然后 `constant(safe-area-inset-bottom)`，然后 `env(safe-area-inset-bottom, 0px)`。
- [ ] **AC3**: `npm run build:lib` + `npm run build:playground` 通过，无 style 相关告警。
- [ ] **AC4**: 无行为回归——未设置 Capacitor 的环境下表现与改动前一致。

## Out of Scope

- 其他组件的 safe-area（如 `HPopup`、`HBottomSheet` 等）——后续独立处理。
- 新增文档或 playground 演示——纯 CSS 变更，不涉及可视化交互。
- Capacitor 注入逻辑——由 Capacitor `SystemBars` 插件管理，本项目不介入。
