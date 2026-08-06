# 修复 HSidebar import.meta.env 类型错误（库构建）

## Goal

修复库构建中唯一的 TS 类型错误：`src/components/HSidebar.vue:119` 使用 `import.meta.env.DEV`，但 `tsconfig.lib.json` 未引入 `vite/client` 类型，导致 `vue-tsc` / `vite-plugin-dts` 报 `TS2339: Property 'env' does not exist on type 'ImportMeta'`。让 `npm run build:lib` 与全库类型检查零错误通过。

## 已确认事实（仓库证据）

- `src/components/HSidebar.vue:119`：`if (import.meta.env.DEV) { ... }`（开发期可访问名校验，仅 dev 提醒不阻塞，生产零开销）。
- `tsconfig.lib.json` 的 `compilerOptions` 无 `"types"` 字段；`include: ["src/**/*.ts", "src/**/*.vue"]`。
- `vue-tsc --noEmit -p tsconfig.lib.json` 全库扫描：**仅此 1 处错误**。
- `node_modules/vite/client.d.ts` 只 `/// <reference path="./types/importMeta.d.ts" />`（声明 `ImportMetaEnv` / `ImportMeta.env`），不依赖 node 类型。
- 现有 `node_modules/@types/*`（estree/hast/markdown-it 等）均为 docs 工具链依赖，src 库代码不引用。
- `dist/` 已 gitignore；HSidebar 的 `.d.ts` 不导出 `import.meta.env` 相关声明，加 `types` 不影响发布产物。

## Requirements

- [R1] `tsconfig.lib.json` 的 `compilerOptions` 增加 `"types": ["vite/client"]`，使 `import.meta.env` 类型可用。
- [R2] 不修改 `HSidebar.vue` 业务逻辑（dev-only 校验语义保持不变）。
- [R3] 不引入 node 类型或其它无关全局类型（`types` 数组只列 `vite/client`，避免限制/污染全局类型作用域）。
- [R4] 发布产物（dist 声明文件）不受影响。

## Acceptance Criteria

- [ ] `npx vue-tsc --noEmit -p tsconfig.lib.json` 零错误
- [ ] `npm run build:lib` 通过（无 `TS2339` 报错，`vite-plugin-dts` 正常产出声明）
- [ ] `git diff tsconfig.lib.json` 仅新增 `types` 一行
- [ ] `npm run docs:build` 仍通过（回归）
- [ ] spec：`.trellis/spec/frontend/*` 无需变更（纯构建配置修复，无组件/API/token 变化）；如需记录则补一行说明

## Out of Scope

- 修改 `HSidebar.vue` 逻辑或 API
- 其它组件/样式/token 变更
- 引入 `@types/node` 等新依赖

## Notes

- 备选方案（不采用）：在 src 加 `vite-env.d.ts`（会被 vite-plugin-dts 拷贝进 dist，消费方无 vite 时解析失败）；`/// <reference types="vite/client" />` 内联进 SFC（非标准位置，可靠性低）。
- 风险低：`"types"` 数组会限制全局 @types 自动包含，但 src 库代码无此类依赖（已确认）。
