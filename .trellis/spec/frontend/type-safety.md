# Type Safety（happier-ui）

## 基线

- 组件脚本：`<script setup lang="ts">`。
- playground：`playground/tsconfig.json` + `vite-env.d.ts`。
- 库本体目前 **无** 独立 `tsconfig` / 构建声明文件；以 Vue SFC + 源码导出（`package.json` `"exports": { ".": "./src/index.ts" }`）被 Vite 宿主消费。

## Props / Emits

```ts
// 推荐：泛型 props + withDefaults；事件用对象类型
const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  playing?: boolean
  button?: boolean
}>(), {
  subtitle: undefined,
  playing: false,
  button: true,
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()
```

参考：`HListRow.vue`、`HIconButton.vue`。

## 约定

| 项 | 约定 |
|----|------|
| 可选 prop | `?` + `withDefaults`；对象/字符串默认可用 `undefined` |
| 联合字面量 | `'md' \| 'lg'`、`'default' \| 'on-media'` 等，避免宽 `string` 装变体 |
| 插槽 | 运行时 `useSlots()`；不为每个 slot 强行写复杂类型，除非公共 API 需要 |
| 外部类型文件 | 暂无 `src/types/`；跨组件类型出现 ≥2 次再抽 |
| `any` | 禁止在公共 props/emits 使用 |

## ion-icon 与宿主类型

`HIconButton` 模板中可选 `<ion-icon>`。无 Ionic 类型包时可能触发模板类型告警——**可接受**：不为此把 `@ionic/vue` 加进 peer。宿主若用 Ionic，自备类型。

## 反模式

- 为图省事把 `color` / `variant` 收成无文档的自由 `string` 且无 CSS 映射说明。
- 在库内引用 Muses 的业务类型（`Track`、`Playlist` 等）。
- 新增 `.d.ts` 全局污染 `Window` 除非 Web Component 注册必需。
