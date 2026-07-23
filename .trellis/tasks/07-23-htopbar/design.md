# 技术设计：HNavBar

## API

```ts
title?: string
showBack?: boolean // 默认 false；无 #left 时显示内置返回按钮
backAriaLabel?: string // 默认「返回」
fixed?: boolean // 默认 true；是否固定在视口顶部
safeArea?: boolean // 默认 true；是否适配顶部安全区
```

插槽：

- `#left`：左侧操作区；存在时覆盖 `showBack` 的内置返回按钮
- `#title`：覆盖 `title` 默认文本
- `#right`：右侧操作区

事件：

```ts
handleLeftClick: [event: MouseEvent]
handleRightClick: [event: MouseEvent]
```

模板中使用 kebab-case：`@handle-left-click`、`@handle-right-click`。
事件由左右区域的 click 监听器透传；组件不调用 Router 或 `history.back()`。

## 结构

```html
<header class="h-nav-bar" :class="{ 'h-nav-bar--fixed': fixed, 'h-nav-bar--safe-area': safeArea }">
  <div class="h-nav-bar__inner">
    <div class="h-nav-bar__left" @click="onLeftClick">
      <slot name="left"><button v-if="showBack" aria-label="返回">...</button></slot>
    </div>
    <div class="h-nav-bar__title">
      <slot name="title"><h1 v-if="title">{{ title }}</h1></slot>
    </div>
    <div class="h-nav-bar__right" @click="onRightClick"><slot name="right" /></div>
  </div>
</header>
```

`#title` 有内容时覆盖 `title`。左右区域使用固定可伸缩列，标题使用绝对居中或三列约束，确保左右宽度不同不改变标题中心；标题单行省略。

## 样式与 token

- `fixed=true`：`position: fixed; top: 0; left: 0; right: 0; z-index: var(--h-z-nav, 30)`
- `fixed=false`：普通文档流
- `safeArea=true`：根元素 `padding-top: env(safe-area-inset-top, 0px)`，背景延伸到状态栏安全区域
- 内容高度：`--h-nav-bar-height`，默认 `56px`
- surface、底部分割线、focus-visible 使用现有 `--h-*` token；无 shadow/elevation
- `ChevronLeft` 从 `@lucide/vue` 引入，使用内部 `HIcon`

## 边界

- 不提供路由、导航栈、历史返回或 `HPageShell`
- 不提供 subtitle、折叠大标题、actions 数组
- 不新增 `HNavBarItem` 子组件
