# HFloatingBubble 执行计划

## 实现顺序

1. **token**：`src/styles/tokens.css` 新增「浮动气泡」分组变量与 `--h-z-floating-bubble`；层级分组登记。
2. **样式**：新建 `src/styles/components/floating-bubble.css`（`@layer components`，BEM + `var(--h-…, fallback)`，含 dragging 关闭 transition）；`src/styles/components.css` 追加 `@import`。
3. **组件**：新建 `src/components/HFloatingBubble.vue`：
   - Props / Emits / 类型（含 `HFloatingBubbleOffset` 等）。
   - 内部 state + 受控同步 watch（值比较防回环）。
   - onMounted 初始化默认右下角位置、解析 teleport 目标、注册 resize。
   - Pointer 拖拽（down/move/up/cancel + setPointerCapture + moved 阈值）。
   - axis 分支、clamp 边界、magnetic 吸附。
   - click 抑制逻辑；Teleport 包裹 + disabled 降级。
   - default slot 优先，回退 `HIcon`（传入 icon 时）。
4. **导出**：`src/index.ts` 导出 `HFloatingBubble` 与 `export type { HFloatingBubbleOffset, HFloatingBubbleAxis, HFloatingBubbleMagnetic }`。
5. **playground**：`playground/src/App.vue` 增加演示段（基础 y 轴拖拽 / 自由磁吸 xy+magnetic=x / v-model:offset 受控 / lock）。
6. **文档**：新建 `docs/components/floating-bubble.md`（示例 + Props/Emits/Slots/无障碍表）；如有侧边栏配置需登记。
7. **规范表**：更新 `.trellis/spec/frontend/component-guidelines.md`（命名、API 约定、当前导出表、新组件清单落项）与 `tokens.md` 分组表。

## 验证命令

```bash
npm run build:lib          # 库构建 + vue-tsc 类型（含 dts）
npm run build:playground   # playground 构建，确认演示段类型/编译通过
npm run dev:playground     # 目视回归：拖拽、磁吸、受控、lock、teleport
```

## 目视回归清单

- [ ] 默认渲染在右下角，可沿 y 轴拖拽，松手不越界。
- [ ] `axis="xy" magnetic="x"`：自由拖拽后横向吸附最近边缘。
- [ ] `v-model:offset` 受控：外部按钮设置坐标气泡即时移动；拖拽回写父状态。
- [ ] `axis="lock"`：不可拖拽，仅可点击。
- [ ] 拖拽后不误触发 click；纯点击 / 键盘 Enter 正常触发 click。
- [ ] 缩放窗口后气泡自动回到边界内。
- [ ] teleport 默认挂到 body；`:teleport="false"` 原地渲染仍可用。
- [ ] 触控热区 ≥ 48px；default slot 覆盖 icon。

## 风险与回滚点

- 受控 offset 回环死循环：在 watch 同步与 emit 处做值相等短路；若异常先移除 magnetic 再排查。
- 拖拽与 click 冲突：moved 阈值可调（默认 3px）。
- Teleport SSR：解析目标推迟到 onMounted；SSR/无 document 时 disabled 原地渲染。
- 回滚：新增文件独立，删除 `HFloatingBubble.vue` / `floating-bubble.css` / 相关 import 与导出即可还原，不影响既有组件。

## 说明

- 无单元测试框架，验证以类型检查 + 双 build + playground 目视为准（与既有组件一致）。
