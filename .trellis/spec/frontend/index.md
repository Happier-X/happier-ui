# Frontend Development Guidelines

happier-ui：**纯 Vue 语义 UI 组件库** + `--h-*` token / `h-` utility，适用于 **Web 与移动端**。样式体系：**Tailwind CSS v4 CSS-first**（HeroUI v3 式接入）。无应用路由、无全局业务 store。

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | 仓库布局、styles 与依赖边界 | Filled |
| [Component Guidelines](./component-guidelines.md) | 组件模式、BEM 层、导出、反模式 | Filled |
| [Design Tokens](./tokens.md) | `--h-*` / `@theme` / `h-` utility | Filled |
| [Hook Guidelines](./hook-guidelines.md) | 当前无 composable；抽取条件 | Filled |
| [State Management](./state-management.md) | 无全局 store；props/emit | Filled |
| [Type Safety](./type-safety.md) | props/emits 与 TS 约定 | Filled |
| [Quality Guidelines](./quality-guidelines.md) | 完成定义、验证、a11y | Filled |

## 快速规则

1. 新 UI：`src/components/H*.vue` + `src/styles/components/*.css`；导出走 `src/index.ts`；导航栏只提供语义 UI 与事件，不内置路由。
2. 视觉参考 **HeroUI Native**；数值只进 `src/styles/tokens.css`；utility 用 `h-` 命名空间。
3. 消费方需 Tailwind v4 + `@import "happier-ui/styles"`。
4. 先 `playground`，再补 `docs/components` 文档页，再给 Muses 通过 npm 消费。
5. 音乐领域与 Ionic / `@heroui/*` 不进库。
6. 文档站 `docs/`（VitePress + GitHub Pages）与 playground 并存；**不**进 npm tarball。

## Quality Check（实现后）

- [ ] 组件使用 `--h-*` / BEM，无新增 `m-*` 类前缀债务
- [ ] 无大块 scoped 视觉 CSS 与 styles 双源
- [ ] playground 可演示（TW4 + styles）
- [ ] 新/改公共 `H*` 有对应 `docs/components` 页（API 与源码一致）
- [ ] 无 `@ionic/vue` / `@heroui/*` import
- [ ] `npm run build:playground` 通过；改 docs 时 `npm run docs:build` 通过
- [ ] 未引入业务实体类型或全局 store
- [ ] 发版：`npm run build:lib` + `npm pack --dry-run`；exports 含 styles/tokens；无 `style.css` 旧路径；不把源码/docs/任务目录打进包
