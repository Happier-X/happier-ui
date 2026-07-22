# Quality Guidelines（happier-ui）

## 完成定义（单个组件）

1. **实现**在 `src/components/H*.vue`，样式消费 `--h-*`。
2. **导出**于 `src/index.ts`。
3. **playground** 有可点击/可看见的演示（`playground/src/App.vue`）。
4. 视觉对照 **HeroUI Native** 移动端（无 Material 阴影）。
5. 键盘与焦点：可交互控件有 `:focus-visible`；按钮型有 Enter/Space（若可聚焦）。
6. 不引入业务与 Ionic Vue 运行时依赖。

## 验证命令

```bash
# 本仓库
npm install
npm run dev:playground      # 目视
npm run build:playground    # 打包冒烟

# 消费方（Muses，路径示例）
cd ../muses && npm run lint   # 若有
# 构建 / 单测按 Muses 仓库脚本
```

本库根脚本目前 **无** `lint` / `test` / `typecheck` 独立入口；以 playground build + 目视为准。新增工具链时再更新本节。

## 无障碍最低线

| 控件 | 要求 |
|------|------|
| `HIconButton` | 必填 `ariaLabel`；装饰 SVG `aria-hidden` |
| 可点击 `HListRow` | `role="button"`、`tabindex="0"`、键盘激活 |
| 表单槽位 | 宿主为 input/checkbox 提供 `aria-label` 或 label 关联 |

## 禁止

- `console.log` 留在提交的组件里（调试完删除）。
- 未 scoped 的全局标签选择器污染宿主（如裸 `button { … }` 写在库组件无限定）。
- 复制一整份 Ionic CSS 变量当设计系统。
- 提交 `playground/dist` 业务改动（构建产物不应当源码改）。

## Code review 关注点

- 是否用了 token 而非魔法数。
- slot 是否足够（避免为单一宿主 hardcode 子节点）。
- class 前缀是否继续扩散 `m-*`（新代码应 `h-*`）。
- 是否误把领域组件放进库。

## 文档语言

- `.trellis/spec` 与任务 PRD：**简体中文**（与 `AGENTS.md` 一致）。
- 代码标识符：英文。
