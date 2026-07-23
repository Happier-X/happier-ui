# 执行计划：HNavBar

1. 新增 `--h-nav-bar-height`、顶部栏背景/边框及层级 token，并补充兼容映射（如有必要）。
2. 实现 `src/components/HNavBar.vue`：`header` 语义、title/#title、left/right、showBack、backAriaLabel、fixed/safeArea、事件与 HIcon。
3. 从 `src/index.ts` 导出 `HNavBar`。
4. 更新 playground：展示默认返回、title、#title、#left、#right，并回显左右事件；确保 fixed 顶栏不遮挡内容。
5. 更新 README 与 frontend specs（component-guidelines、tokens、quality、index）。
6. 运行 `npm run build:playground`。

## 验证

```bash
npm run build:playground
```

## Review gates

- 标题在左右区域宽度不同情况下仍视觉居中且单行省略。
- `fixed` 与 `safeArea` 可独立关闭，默认均为 true。
- #left 优先于 showBack；事件名称使用 `handleLeftClick` / `handleRightClick`，模板 kebab-case。
- 不引入 Router、导航栈或新的运行时依赖。
