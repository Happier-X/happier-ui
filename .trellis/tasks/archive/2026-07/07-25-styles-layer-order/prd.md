# styles.css 顶部声明 @layer 顺序（修 #10）

## Goal

在 `happier-ui` 发布的 `dist/styles.css` 顶部显式声明 CSS 层叠层顺序（`@layer theme, base, components, utilities;`），消除库对消费方 CSS 引入顺序的敏感性，避免 Tailwind v4 项目里因 `happier-ui/styles` 先于 `@import "tailwindcss"` 加载导致 preflight（base 层）盖掉组件样式（.h-button 等呈裸样式）。

## Background

- GitHub issue #10。
- CSS cascade layer 的相对顺序由**首次出现顺序**决定。当前 `dist/styles.css` 把组件样式裸包在 `@layer components { ... }`，但文件内**不**前置声明 layer 顺序。
- 消费方若先 `import "happier-ui/styles"` 再 `import` 含 `@import "tailwindcss"` 的 CSS，则 `components` 层被注册到最前，Tailwind 展开的 `theme/base/utilities` 追加其后 → base 层（preflight reset）优先级高于 components → 组件样式被覆盖。
- 修法：在层叠层内容出现**之前**声明一次 `@layer theme, base, components, utilities;`，锁定 `components` 相对 `base` 的位置，无论消费方先加载谁都不再敏感。
- `dist/styles.css` 由 `vite.config.ts` 的 `emitHappierUiStyles` 插件从 `src/styles/index.css` 组装（内联 `@import`）。`index.css` 顶部当前是块注释 + `@import "./tokens.css"` / `theme.css` / `components.css`。
- 关键约束：`@layer <names>;` 声明语句在 CSS 中必须位于任何 `@import` **之后**才合法吗？—— 否。CSS 规范里 `@import` 必须在样式表最前（除 `@charset` 和 `@layer` 语句形式之外）。`@layer name, name;`（不带块的语句形式）**允许**出现在 `@import` 之前，且这正是锁定顺序的推荐写法。需确认最终 `dist/styles.css` 里声明位于文件顶部、且不破坏内联后的 `@import` 合法性（本库 index.css 的 `@import` 会被插件内联展开，产物中可能已无 `@import`，需构建后核验）。

## Requirements

- R1. `dist/styles.css` 文件**顶部**（第一条规则之前）包含 `@layer theme, base, components, utilities;` 声明。
- R2. 通过在 `src/styles/index.css` 顶部（注释之后、首个 `@import` 之前或紧随其后视合法性而定）加入该声明实现；产物由 `emitHappierUiStyles` 组装后须保留该行在顶部。
- R3. 不改变现有 `--h-*` token、`h-*` class 名、组件视觉。
- R4. `dist/tokens.css`（仅变量）不需要该声明（无 `@layer components` 包裹）。
- R5. spec 记录该约定：styles 入口须前置声明 layer 顺序，防引入顺序敏感。

## Acceptance Criteria

- [ ] `npm run build:lib` 后，`dist/styles.css` 首行（忽略注释）为 `@layer theme, base, components, utilities;`。
- [ ] `dist/styles.css` 内仍含原有 `@layer components { ... }` 组件规则，视觉规则未变。
- [ ] `npm run build:lib` / `npm run build:playground` / `npm run docs:build` 三者通过（HSidebar `ImportMeta.env` 预存在报错除外）。
- [ ] playground 组件样式正常（layer 声明未破坏本地 Tailwind 管道）。
- [ ] `.trellis/spec/frontend/tokens.md` 或 `directory-structure.md` 记一条 layer 顺序约定。

## Out of Scope

- 修改 Tailwind 版本或组件 CSS 内容。
- issue #11 的去 Ionic / 暗色态（独立任务）。

## Resolved Decisions

1. layer 顺序取 Tailwind v4 默认约定 `theme, base, components, utilities`，锁定 `components` 在 `base` 之后。
2. 声明语句放 `src/styles/index.css`，构建后核验 `dist/styles.css` 顶部保留。
