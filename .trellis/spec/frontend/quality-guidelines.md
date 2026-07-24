# Quality Guidelines（happier-ui）

## 完成定义（单个组件）

1. **实现**在 `src/components/H*.vue`（BEM 类）+ `src/styles/components/*.css`（`@layer components`），样式消费 `--h-*`。
2. **导出**于 `src/index.ts`。
3. **playground** 有可点击/可看见的演示（`playground/src/App.vue`；TW4 + `happier-ui/styles`）。
4. 视觉对照 **HeroUI Native**（交付面向 Web 与移动端；无 Material 阴影）。
5. 键盘与焦点：可交互控件有 `:focus-visible`。
6. 不引入业务、Ionic Vue 或 `@heroui/*` 运行时依赖。

## 验证命令

```bash
npm install
npm run dev:playground
npm run build:playground
npm run build:lib
npm pack --dry-run
```

本库根脚本目前 **无** `lint` / `test` / `typecheck` 独立入口；以 playground build + 目视为准。发版前额外：`build:lib` 产物齐全（`index.js` / `index.d.ts` / `styles.css` / `tokens.css`），`npm pack --dry-run` 不含 `src` / `playground` / `.trellis`。

## 无障碍最低线

| 控件 | 要求 |
|------|------|
| `HButton` | 原生 `<button>`；disabled 时不可点；装饰 SVG `aria-hidden` |
| `HSwitch` | `role="switch"` + `aria-checked`；建议 `ariaLabel`；disabled 不切换 |
| `HBottomSheet` | `role="dialog"` + `aria-modal`；标题关联或 `ariaLabel`；Esc 可关闭 |
| `HDialog` | `role="dialog"` + `aria-modal`；title/description 关联或 `ariaLabel`；Esc 可关闭 |
| `HInput` | label 关联；`aria-invalid` / `aria-describedby`（description/error） |
| `HCheckbox` | 原生 checkbox；label 或 `ariaLabel`；`indeterminate` 半选 |
| `HEmpty` | `section` + 标题；icon 为装饰时由宿主提供 `aria-hidden`；操作槽可放可交互控件 |
| `HImage` | `alt` 必填；fallback 不应覆盖真实 alt 语义 |
| `HIcon` | 装饰默认 `aria-hidden`；有意义时 `ariaLabel` |
| `HTabBar` | `nav` + `aria-label`；项为 button；选中 `aria-current="page"`；fixed/safe-area 默认开 |
| `HNavBar` | 语义 `header`；默认标题为 `h1`；返回为原生 button 且由 `backAriaLabel` 命名；fixed/safe-area 默认开；不执行实际导航 |
| 图标-only 控件（若新增） | 必填可访问名称（`aria-label` 等） |

## 禁止

- `console.log` 留在提交的组件里。
- 未 scoped 的全局标签选择器污染宿主。
- 复制一整份 Ionic CSS 变量当设计系统。
- 提交 `playground/dist` 业务改动。
- 导出已声明移除的组件而不经任务评审。

## Code review 关注点

- 是否用了 token 而非魔法数。
- slot 是否足够。
- class 前缀是否为 `h-*`。
- 是否误把领域组件放进库。

## 文档语言

- `.trellis/spec` 与任务 PRD：**简体中文**。
- 代码标识符：英文。
