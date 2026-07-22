# 执行计划：移除 legacy primitives

1. 改写 `src/index.ts` → 仅 `HButton`
2. 删除 5 个组件文件
3. 精简 `playground/src/App.vue` 为 HButton 演示
4. 更新 `component-guidelines.md` 与 `README.md`
5. `npm run build:playground`
6. `rg` 确认 src/playground/spec 无残留导出引用

验证：`npm run build:playground`
