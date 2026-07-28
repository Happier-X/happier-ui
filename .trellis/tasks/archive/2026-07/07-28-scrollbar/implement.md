# HScrollbar 实施清单

## 有序步骤

### 1. Token
- [ ] 在 `src/styles/tokens.css` 末尾（或合适分组）新增 `--h-scrollbar-*`：
  - `--h-scrollbar-size-sm/md/lg`
  - `--h-scrollbar-thumb` / `--h-scrollbar-thumb-hover` / `--h-scrollbar-track`

### 2. 组件 SFC
- [ ] 新建 `src/components/HScrollbar.vue`
  - template：根 `div.h-scrollbar` + 修饰符类 + `:data-scrollbar` + default slot
  - script setup：`defineProps` + `withDefaults`；导出 `HScrollbarProps`
  - 无 emits、无 style、无 JS 副作用

### 3. 组件 CSS
- [ ] 新建 `src/styles/components/scrollbar.css`（`@layer components`）
  - base + axis / size / color 修饰符
  - `[data-scrollbar=thin|default|none]` 规则
  - webkit 伪元素 + Firefox 标准属性
  - `@media (hover: none) and (pointer: coarse)` 移动端回退
- [ ] 在 `src/styles/components.css` 追加 `@import "./components/scrollbar.css"`

### 4. 公共导出
- [ ] `src/index.ts` 增加：
  ```ts
  export { default as HScrollbar } from './components/HScrollbar.vue'
  export type { HScrollbarProps } from './components/HScrollbar.vue'
  ```

### 5. 文档
- [ ] 新建 `docs/components/scrollbar.md`（基础 / mode / axis / size / color / API 表）
- [ ] `docs/.vitepress/config.ts` 侧栏加入 `{ text: 'Scrollbar 滚动条', link: '/components/scrollbar' }`

### 6. Playground
- [ ] `playground/src/App.vue` 增加 HScrollbar smoke 区（固定高度列表 + mode/size/color 变体）

### 7. Spec 同步（实现后）
- [ ] `trellis-update-spec`：把 HScrollbar 记入 `component-guidelines.md` 命名表与参考实现

## 验证命令

```bash
# 类型检查
npm run typecheck

# 文档 dev（可选）
npm run docs:dev

# playground
npm run dev:playground
```

手动验收（对照 prd AC1–AC8）：
1. Chromium：thin 模式可见细窄 thumb；hover 略深
2. Firefox：thin 模式 `scrollbar-width: thin` 生效
3. DevTools 移动端模拟：自定义 thumb 消失
4. mode=default / none 行为正确
5. axis x/y/both 溢出方向正确
6. size / color 视觉变化正确
7. `src/index.ts` 可 import
8. typecheck 通过

## 风险点与回滚

| 风险 | 缓解 |
|------|------|
| `color-mix` 旧浏览器不支持 | 用 `rgba` fallback 写在同一声明前 |
| 宿主未设高度 → 看起来「不滚动」 | 文档明确要求设 height / max-height |
| webkit 伪元素在 both 方向宽度/高度 | CSS 同时设 width 与 height |
| playground 文件大，编辑冲突 | 仅在末尾追加 section，不改既有区 |

回滚：删除 design.md「回滚」一节列出的 6 处改动。

## 开始前门禁

- [x] prd.md 收敛完成
- [x] design.md 完成
- [x] implement.md 完成
- [ ] implement.jsonl / check.jsonl 已填真实 spec 条目
- [ ] 用户对最终规划摘要明确批准
- [ ] 之后才可 `task.py start`
