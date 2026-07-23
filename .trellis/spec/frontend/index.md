# Frontend Development Guidelines

happier-ui：**纯 Vue 语义 UI 组件库** + `--h-*` token，适用于 **Web 与移动端**。无应用路由、无全局业务 store。

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | 仓库布局与依赖边界 | Filled |
| [Component Guidelines](./component-guidelines.md) | 组件模式、导出、slot、反模式 | Filled |
| [Design Tokens](./tokens.md) | `--h-*` / 兼容别名 / HeroUI Native | Filled |
| [Hook Guidelines](./hook-guidelines.md) | 当前无 composable；抽取条件 | Filled |
| [State Management](./state-management.md) | 无全局 store；props/emit | Filled |
| [Type Safety](./type-safety.md) | props/emits 与 TS 约定 | Filled |
| [Quality Guidelines](./quality-guidelines.md) | 完成定义、验证、a11y | Filled |

## 快速规则

1. 新 UI 只加 `src/components/H*.vue`，导出走 `src/index.ts`；导航栏只提供语义 UI 与事件，不内置路由。
2. 视觉参考 **HeroUI Native**（Web/移动端通用交付）；数值只进 `src/tokens.css`。
3. 先 `playground`，再给 Muses `file:` 消费。
4. 音乐领域与 Ionic 引擎不进库。

## Quality Check（实现后）

- [ ] 组件使用 `--h-*`，无新增 `m-*` 类前缀债务
- [ ] playground 可演示
- [ ] 无 `@ionic/vue` import
- [ ] `npm run build:playground` 通过
- [ ] 未引入业务实体类型或全局 store
- [ ] 发版相关改动：`npm run build:lib` + `npm pack --dry-run` 通过；exports 仍指向 dist；不把源码/任务目录打进包
