# Implement: HeroUI 风格 HSelect

## 前置

- 读 `.trellis/spec/frontend/component-guidelines.md`、`type-safety.md`、`state-management.md`。
- 参考实现：`HDialog.vue`（Teleport + Esc + overlay）、`HInput.vue`（label/error/size 结构）、`useTeleportTarget.ts`。

## 顺序清单

1. **tokens**（`src/styles/tokens.css`）
   - 新增 `--h-select-*`：popover max-height、gap、option padding、check size、variant 底色/边框映射。
   - 新增 `--h-z-select: 1150`（并在 z 索引区补 `--h-z-select`）。
   - 保留/复用 input 尺寸 token。

2. **组件逻辑**（`src/components/HSelect.vue` 全量重写）
   - Props（withDefaults）：`options`、`modelValue`、`placeholder`(默认 "请选择")、`label`、`description`、`error`、`variant`(默认 flat)、`color`(默认 default)、`size`(默认 md)、`radius`(默认 md)、`labelPlacement`(inside/outside，默认 outside)、`disabled`、`invalid`、`clearable`、`disabledKeys`(可选，(string\|number)[])、`name`、`ariaLabel`、`teleport`(默认 body)。
   - Emits：`update:modelValue`、`change`、`open-change`(boolean)。
   - Slots：`#value`(scope selectedOption)、`#option`(scope option)、`#start`、`#end`、`#indicator`、`#empty`(无选项)。
   - 内部：`open`、`activeIndex`、triggerEl/popoverEl ref、`useId`。
   - 定位函数：打开时算 fixed 坐标 + flip；`open` watch 里 nextTick 定位。
   - 键盘：trigger 上 Enter/Space/↓ 打开；listbox 交互用 ArrowUp/Down/Home/End/Enter/Esc，走 `aria-activedescendant`。
   - 点击外部关闭：`open` 为 true 时挂 `pointerdown` capture 监听，命中 trigger/popover 外则关闭；卸载/关闭时移除。
   - 隐藏 `<input type="hidden">` 承载 `name`+value 供表单。
   - a11y：trigger `role="button"`（或 `role="combobox" aria-haspopup="listbox" aria-expanded aria-controls`）；popover `role="listbox"`；option `role="option" aria-selected aria-disabled`；label `for`/`id` 关联，无 label 用 `ariaLabel`；error `role="alert"`。

3. **样式**（`src/styles/components/select.css` 全量重写）
   - `@layer components`；BEM 见 design。
   - 4 variant × 5 color 强调 × 3 size × 5 radius × 状态（disabled/invalid/open/focus-visible）。
   - popover + option（hover/active/selected/disabled）+ check + scrollbar。
   - iOS 防缩放：trigger font-size ≥ 16px（sm/md min 16px）。
   - 无 elevation 阴影。

4. **导出**（`src/index.ts`）
   - `HSelect` 已导出；确认 `export type { HSelectOption }` 保留；如需要导出新类型（variant/color union）则补。

5. **playground**（`playground/src/App.vue`）
   - 演示段：基础、label(inside/outside)、placeholder、4 variant、color、3 size、radius、disabled、invalid+error、clearable、disabledKeys、`#option` 自定义、`#start`/`#end`、长列表滚动。

6. **docs**（`docs/components/select.md` 重写）
   - 简介、示例、API 表（props/emits/slots）、无障碍要点、与原生版差异说明（破坏性）。

7. **spec 同步**（`.trellis/spec/frontend/component-guidelines.md`）
   - 更新 HSelect 行、API 约定表、当前导出表：从「原生 select」改为「HeroUI 风格 popover 自定义面板」。

## 验证命令

```bash
npm run build:lib
npm run build:playground   # vue-tsc 类型检查
npm run docs:build
```

- 手动目视：playground 逐段（打开/键盘/翻转/清空/禁用项/自定义 slot）。
- 确认 `dist/components/HSelect.vue.d.ts` 类型正确。

## 风险文件 / 回滚点

- `src/components/HSelect.vue`、`src/styles/components/select.css` — 全量重写，破坏性最高；重写前保留旧内容 git 基线。
- `src/styles/tokens.css` — 只增不改现有值。
- 定位 + 点击外部监听 — 事件泄漏 / SSR 守卫（`typeof window`）需注意。

## 复查门

- 验收标准逐条对照 prd.md。
- 键盘导航 + a11y 属性实测。
- 三个 build 全绿后再报告完成。
