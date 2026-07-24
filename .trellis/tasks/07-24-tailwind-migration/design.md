# 技术设计：Tailwind v4 / HeroUI 式样式体系

## 目标形态（消费方）

对齐最新 HeroUI（v3）的 CSS-first 接入，而非 v2 的 JS plugin：

```css
/* 消费方全局 CSS（如 app.css） */
@import "tailwindcss";
@import "happier-ui/styles";
```

```ts
import { HButton } from 'happier-ui'
```

业务侧可同时：

```html
<div class="bg-h-surface text-h-ink rounded-h-control p-h-md">…</div>
```

```css
color: var(--h-color-ink);
```

**相对 `0.0.1` 破坏点**

| `0.0.1` | `0.0.2` |
|---------|---------|
| 仅 `import 'happier-ui/style.css'` + `tokens.css`，无需 Tailwind | **必须** Tailwind v4 + `@import "happier-ui/styles"` |
| 组件样式打进预编译 `dist/style.css` 即可用 | 组件 BEM 样式依赖宿主 Tailwind 管道解析 styles 包 |
| peer：`vue`、`@lucide/vue` | 增加 peer：`tailwindcss` `^4` |

不做旧入口兼容。

## 包内文件结构（拟定）

```
src/
  index.ts                 # 组件导出（不变）
  styles/
    index.css              # 公共 styles 入口：tokens + theme + components
    tokens.css             # 从现 tokens 迁入/整理：:root --h-*（及 --muses-* 别名）
    theme.css              # @theme 映射 → h- utility
    components.css         # @import 各组件层，或汇总 @layer components
    components/
      button.css
      switch.css
      …
  components/
    HButton.vue            # 模板 BEM 类；无大块 scoped 视觉 CSS
```

设计原则：

- **token 权威**仍在 CSS 变量 `--h-*`（可继续支持宿主覆盖）。
- **`theme.css`** 只做 `@theme` 桥接，不重新发明色板。
- **组件视觉**在 `@layer components` 的 `.h-*` BEM 中实现（`@apply` 或直接 CSS + `var(--h-*)`）。
- Vue SFC **移除**大块 `<style scoped>` 视觉规则；允许极少结构/动画例外时优先仍进 components 层，避免 scoped 与全局 BEM 双源。

## `@theme` / utility 命名契约

保留 **`h-` 命名空间**，与 `--h-*` 可读对应：

| Token（CSS 变量） | `@theme` 键（示意） | Utility 示例 |
|-------------------|---------------------|--------------|
| `--h-color-primary` | `--color-h-primary` | `bg-h-primary` `text-h-primary` |
| `--h-color-surface` | `--color-h-surface` | `bg-h-surface` |
| `--h-color-ink` | `--color-h-ink` | `text-h-ink` |
| `--h-color-ink-muted` | `--color-h-ink-muted` | `text-h-ink-muted` |
| `--h-space-md` | `--spacing-h-md` | `p-h-md` `gap-h-md` |
| `--h-radius-control` | `--radius-h-control` | `rounded-h-control` |

实现时按 Tailwind v4 `@theme` 语法精确落地；**不**暴露无前缀 `bg-primary` 作为公共契约。

色阶 `--h-primary-50`…`900` 映射为 `h-primary-50` 等（若体积可接受）；组件级尺寸 token（`--h-button-height-md`）可继续只做 CSS 变量，不必全部变成 utility。

## 组件样式策略

- 模板：`class="h-button h-button--primary h-button--md"`（与现有一致）。
- 样式：`src/styles/components/*.css` 内：

```css
@layer components {
  .h-button { /* @apply 或原生属性 + var(--h-*) */ }
  .h-button--primary { … }
}
```

- 覆盖（消费方，对齐 HeroUI 文档思路）：

```css
@layer components {
  .h-button--primary {
    @apply bg-h-primary-600;
  }
}
```

- **不**全局引入 `tailwind-variants`；variant 用 BEM 修饰符 + 少量 `:class` 绑定即可。

## 构建与 exports

### 发布物

- JS：`dist/index.js` + `dist/index.d.ts`（组件逻辑；**external** `vue`、`@lucide/vue`）。
- CSS：**发布 styles 源/打包结果**供消费方 `@import`，而不是依赖「零 Tailwind 的单一 style.css」。

建议 `package.json` exports（实现时可微调路径，需与 README 一致）：

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js"
  },
  "./styles": "./dist/styles.css",
  "./styles.css": "./dist/styles.css",
  "./tokens.css": "./dist/tokens.css",
  "./package.json": "./package.json"
}
```

说明：

- **`happier-ui/styles`**：完整入口（tokens + theme + components）。主推。
- **`happier-ui/tokens.css`**：仅变量（可选；给只要变量、自行映射的宿主）。
- **删除或不再文档化** `0.0.1` 的「只引 `style.css` 即可跑组件」路径。
- `files`：至少包含 `dist`、`LICENSE`、`README.md`；若 styles 以源码子路径发布，则 `files` 含对应目录——优先 **构建合并为 `dist/styles.css`**，避免把整个 `src` 打进包。

### 库构建注意

- 库 JS 的 Vite lib build **不要**再把组件 scoped CSS 抽成「可独立使用的完整 style.css」作为唯一方案。
- playground / 消费方：用 `@tailwindcss/vite`（或官方推荐的 Vite + TW4 方式）处理 CSS；content 扫描 **应用源码 + 本库组件**（若 class 只在 CSS 的 BEM 里，扫描以实际 class 出现位置为准）。
- `sideEffects` 保留 CSS。
- `peerDependencies`：`vue`、`@lucide/vue`、`tailwindcss` `^4`。

### version

- `package.json` → **`0.0.2`**
- 发布前 `npm pack` 检视；无 token、无 `.trellis`、无 playground。

## Playground

- 入口 CSS：`@import "tailwindcss"` + `@import` 库 styles（dev 可用 workspace 别名指向 `src/styles/index.css`）。
- 去掉仅依赖旧 `tokens.css` + 无 TW 的路径。
- 验收：各 `H*` 演示区视觉与迁移前大致一致（HeroUI Native 观感）。

## 迁移批次（节奏 B）

| 批次 | 内容 | 完成定义 |
|------|------|----------|
| 0 脚手架 | 依赖、styles 入口、`@theme`、playground、exports 草案 | playground 能加载 TW + 示例 `bg-h-primary`；旧组件可暂双轨但目标尽快拆 scoped |
| 1 基础 | `HButton`、`HIcon`、`HEmpty`、`HImage` | 无 scoped 视觉 CSS；演示 OK |
| 2 表单 | `HInput`、`HCheckbox`、`HSwitch` | 同上 |
| 3 导航 | `HNavBar`、`HTabBar` | 同上 |
| 4 浮层 | `HDialog`、`HBottomSheet` | 同上；z-index/动画保持 token |
| 5 收尾 | 删残留 scoped、README/spec、version 0.0.2、pack 验证 | AC 清单；再请求 publish |

批次是检查点，**不是**多个 npm 版本。

## 风险与取舍

| 风险 | 缓解 |
|------|------|
| 消费方未装 TW4 → 组件无样式 | README 醒目说明；peerDeps |
| `@apply` 与自定义 utility 顺序 | 统一 layer；优先 `var(--h-*)` 原生属性 |
| 主题映射遗漏导致视觉回归 | 以 playground 逐组件对照；token 不删只搬 |
| lib 打包误把 tailwind preflight 打进包 | styles 由消费方 `@import "tailwindcss"`；库 styles 不含重复 preflight 或明确文档 |
| `0.0.1` 用户升级断裂 | 明确 breaking；不提供 shim |

## 与 npm-publish 任务关系

- `0.0.1` 已在 registry → publish 任务的「首次公开」事实完成。
- 本任务交付 **`0.0.2` 破坏性样式体系**；publish 动作可在本任务收尾执行，或在 npm-publish 任务中跟进，但 **版本与产物以本 design 为准**。
