# HPopup keepAlive + swipeClose 实施计划

## 实施清单（按序）

1. **`src/components/HPopup.vue` — props**
   - `defineProps` 接口追加 `keepAlive?: boolean`、`swipeClose?: boolean`。
   - `withDefaults` 追加 `keepAlive: false`、`swipeClose: true`。
   - 组件头注释补充两 prop 说明。

2. **`src/components/HPopup.vue` — 模板 slot 锚点（R1）**
   - `<div v-if="visible" :key="transitionKey" class="h-popup__slot-anchor">` →
     `v-if="visible || keepAlive"` + `v-show="keepAlive ? visible : true"` + `:key="keepAlive ? undefined : transitionKey"`。
   - 加注释说明互斥切换原理（防未来改动踩 v-if+v-show 同时翻转的坑）。

3. **`src/components/HPopup.vue` — rootClasses（R2）**
   - 追加 `'h-popup--swipe-disabled': !props.swipeClose && props.position === 'fullscreen'`。

4. **`src/components/HPopup.vue` — onTouchStart 守卫（R2）**
   - 函数首行加 `if (!props.swipeClose) return`。

5. **`src/components/HPopup.vue` — watcher（R1）**
   - `transitionKey.value++` 改条件：`if (!props.keepAlive) transitionKey.value++`。

6. **`src/styles/components/popup.css` — swipe-disabled 规则（R2）**
   - fullscreen 段新增：
     `.h-popup--position-fullscreen.h-popup--swipe-disabled .h-popup__panel { touch-action: auto; }`
   - 注释说明：手势禁用时把 touch-action 交还宿主（宿主全权控制）。

7. **`docs/components/popup.md`（R3）**
   - Props 表新增 `keepAlive` / `swipeClose` 两行（类型/默认/说明）。
   - fullscreen 小节补一句：`:swipe-close="false"` 交给宿主手势；示例补充 `:keep-alive` 用法说明。
   - 行为说明小节同步两 prop 描述。

8. **`playground/src/App.vue`（R3，可选低成本）**
   - HPopup 演示段：加一个 keepAlive 计数器（关闭再打开计数不重置）+ swipeClose 关闭示例按钮。

## 验证命令

```bash
npm run build:lib          # exit 0
npm run build:playground   # exit 0
npm run docs:build         # exit 0
```

产物核验：

```bash
grep -n "keepAlive\|swipeClose" dist/HPopup.vue.d.ts          # 新 prop 类型
grep -n "swipe-disabled" dist/styles.css                       # 新 CSS 规则
grep -n "keepAlive\|swipeClose" docs/.vitepress/dist/components/popup.html   # 文档生效
```

## 验收映射

| AC | 验证方式 |
|----|---------|
| AC1 默认行为无回归 | HPopup.vue diff 审查（默认路径 v-if 行为不变）；build 全绿 |
| AC2 keepAlive 保活 | 模板/ watcher 逻辑审查；playground 计数器演示（dev:playground 手测：关闭再打开计数保留、入场动画重放） |
| AC3 隐藏态无交互 + 滚动锁 | rootStyle visibility:hidden 已覆盖；scrollLock 条件未改（`props.lockScroll && visible.value`） |
| AC4 swipeClose=false 禁手势 + touch-action:auto | onTouchStart 守卫审查；dist/styles.css grep swipe-disabled |
| AC5 转场/锁/Esc/overlay/z-index 保留 | 相关代码路径未改动（requestClose 链路、Transition、z-index token） |
| AC6 其他 position 无回归 | 修改点均带 position/keepAlive 条件；build 全绿 |
| AC7 构建 + 产物 | 上述验证命令全部通过 |
| AC8 文档 | docs 修改到位 + docs:build 通过 |

## 风险点 / 回滚

- **最高风险**：v-if + v-show 同元素互斥切换（设计 2.2）。守则：两指令永不同时翻转；保持 key 逻辑只在非 keepAlive 生效。若实测离场动画异常，回退方案见 design.md 2.4。
- 回滚：单提交 `git revert`；改动仅 3 源文件 + 1 文档。
- 不触碰：HBottomSheet.vue / HDialog.vue / bottom-sheet.css / dialog.css / tokens.css / 其他组件。

## 收尾（Phase 3）

- 按 trellis-check 全量核验后提交（feat 提交）。
- 更新 `.trellis/spec/frontend/component-guidelines.md`：HPopup 条目补充 keepAlive / swipeClose 行为描述。
- 记 journal。
