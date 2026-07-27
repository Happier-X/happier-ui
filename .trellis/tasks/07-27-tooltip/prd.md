# HTooltip PRD

## 需求
在 happier-ui 中提供符合 HeroUI Native 视觉的 HTooltip 组件。

## 功能列表与要求

### 触发与展示
- **触发器（Trigger）**：包裹的目标元素（插槽）。支持 hover（鼠标）、focus（键盘）触发。支持 click/tap（移动端）以处理没有 hover 的情况。
- **内容（Content）**：通过插槽或 `content` prop 提供 Tooltip 文字。
- **显隐延迟**：可配置 `delay`（进入延迟，默认如 200ms），提升用户体验。

### 视觉与样式（HeroUI 风格）
- **无 Material elevation**：使用 `--h-color-surface` 背景 + 柔和阴影，或语义色（primary/success/warning/danger）纯色背景 + 白色文字。
- **Token**：使用 `--h-*` tokens，如 `--h-radius-md`，`--h-space-md`，`--h-font-xs`。
- **Color**：default（浅色底+细边框）、primary、success、warning、danger。
- **radius**：none / sm / md / lg / full。

### 定位与行为
- **Teleport**：默认 `teleport="body"`。
- **Placement**：`top` | `bottom` | `left` | `right`。
- **自动翻转（Flip）**：接近视口边界时自动翻转方向。
- **Arrow**：`showArrow` 默认 false；用旋转 45° 的正方形 + border 实现（而非传统 border triangle），以兼容带边框的 default variant。
- 窗口滚动或 resize 时关闭。

### 无障碍 (A11y)
- `role="tooltip"`，打开时触发器设置 `aria-describedby` 指向 tooltip。

## 验收标准
- [ ] 包裹内容在 hover/focus 时显示 Tooltip
- [ ] 移动端点击触发器能显示，点击外部关闭
- [ ] 接近视口边缘时能翻转方向避免越界
- [ ] Token 驱动，支持 color、radius
- [ ] Playground 中增加演示，支持切换 placement
- [ ] 文档页面注册到 VitePress 侧边栏