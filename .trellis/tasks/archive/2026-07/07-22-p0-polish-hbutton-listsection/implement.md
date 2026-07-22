# 执行计划：P0 打磨 + HButton + HListSection

## 顺序

1. **tokens** — 在 `src/tokens.css` 补 button 高度/padding、focus ring 等本任务用到的 `--h-*`。
2. **HIconButton** — variants + loading；整理 danger（prop vs class）。
3. **HListRow** — `selected` + `density`。
4. **HSettingRow** — `h-*` 类名 + `--h-*`；可选 interactive。
5. **HEmptyState** — `h-*` + `--h-*`；compact / icon slot。
6. **HButton** — 新建，7 variants × 3 sizes 或 AC 规定的核心集。
7. **HListSection** — 新建，title + inset/flat。
8. **index.ts** — 导出。
9. **playground** — 演示矩阵。
10. **spec** — 更新 `component-guidelines.md` 导出表；tokens.md 若有新组则补一句。
11. **验证** — `npm run build:playground`。

## 验证命令

```bash
npm run build:playground
npm run dev:playground   # 目视（可选）
```

## 检查点

- [ ] 无 `@ionic/vue` / heroui RN import
- [ ] 无新 `m-*` 类
- [ ] 无魔法数主色（fallback 除外）
- [ ] AC 清单全勾

## 回滚点

- 每完成一个组件可独立提交；失败时只回退该文件 + index 导出行。
