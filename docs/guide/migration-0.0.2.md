# 从 0.0.1 升级到 0.0.2

**无 0.0.1 兼容 shim**。升级必须改接入方式。

## Breaking 对照

| 0.0.1 | 0.0.2 |
|-------|-------|
| `import 'happier-ui/style.css'` + `tokens.css`，**无需** Tailwind | **必须** Tailwind v4 + `@import "happier-ui/styles"` |
| 预编译 `dist/style.css` 即可用组件 | 组件样式依赖宿主 Tailwind 管道解析 styles 包 |
| peer：`vue`、`@lucide/vue` | 增加 peer：`tailwindcss` `^4` |
| 导出 `./style.css` | **已移除**；主推 `./styles` / `./styles.css` |

## 迁移步骤

1. 安装 `tailwindcss@^4` 与 `@tailwindcss/vite`（或等价 TW4 集成）。
2. 删除：

   ```ts
   import 'happier-ui/style.css'
   ```

3. 在全局 CSS 中改为：

   ```css
   @import "tailwindcss";
   @import "happier-ui/styles";
   ```

4. Vite（示例）启用 `tailwindcss()` 插件。
5. 确认 `package.json` 未再依赖已移除的 `style.css` 路径。
6. 业务若写死旧色值，逐步改为 `var(--h-*)` 或 `h-` utility。

## 组件 API

0.0.2 在 0.0.1 组件集合上扩展了完整 11 个 `H*` 导出；单组件 props 以各组件文档页为准。导航类组件（`HNavBar` / `HTabBar`）**不内置路由**，只抛事件 / 切换 key。

## 发版与文档

- npm：推送 `v*` tag → release workflow
- 文档站：GitHub Pages（本站）；仓库 Settings → Pages → Source 选 **GitHub Actions**
