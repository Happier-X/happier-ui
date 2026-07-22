# Type Safety（happier-ui）

## 基线

- 组件脚本：`<script setup lang="ts">`。
- playground：`playground/tsconfig.json` + `vite-env.d.ts`。
- 库本体目前 **无** 独立 `tsconfig` / 构建声明文件；以 Vue SFC + 源码导出（`package.json` `"exports": { ".": "./src/index.ts" }`）被 Vite 宿主消费。

## Props / Emits

```ts
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-soft' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
```

参考：`HButton.vue`。

## 约定

| 项 | 约定 |
|----|------|
| 可选 prop | `?` + `withDefaults` |
| 联合字面量 | 变体/尺寸用字面量联合，避免宽 `string` |
| 插槽 | 运行时槽位；不为每个 slot 强行写复杂类型除非公共 API 需要 |
| 外部类型文件 | 暂无 `src/types/`；跨组件类型出现 ≥2 次再抽 |
| `any` | 禁止在公共 props/emits 使用 |

## 反模式

- 为图省事把 `variant` 收成无文档的自由 `string`。
- 在库内引用 Muses 的业务类型（`Track`、`Playlist` 等）。
