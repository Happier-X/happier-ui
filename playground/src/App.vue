<template>
  <main class="smoke">
    <header class="smoke__header">
      <h1 class="smoke__title">happier-ui 冒烟</h1>
      <p class="smoke__lead">
        导出 <code>HButton</code>、<code>HSwitch</code>、<code>HBottomSheet</code>、<code>HDialog</code>、<code>HInput</code>、<code>HCheckbox</code>、<code>HEmpty</code> 与
        <code>tokens.css</code>（纯 Vue，无 Ionic 壳）。
      </p>
      <div class="smoke__swatch" aria-hidden="true" />
    </header>

    <section class="smoke__section" aria-labelledby="button-heading">
      <h2 id="button-heading" class="smoke__section-title">HButton variants × sizes</h2>
      <div
        v-for="size in buttonSizes"
        :key="size"
        class="smoke__button-block"
      >
        <p class="smoke__hint">size={{ size }}</p>
        <div class="smoke__row smoke__row--wrap">
          <h-button
            v-for="variant in buttonVariants"
            :key="`${size}-${variant}`"
            :variant="variant"
            :size="size"
            @click="onButtonClick"
          >
            {{ variant }}
          </h-button>
          <h-button :size="size" disabled>disabled</h-button>
          <h-button :size="size" variant="outline">
            <template #leading>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </template>
            leading
          </h-button>
        </div>
      </div>
      <p v-if="buttonClicks > 0" class="smoke__ping">Button 点击：{{ buttonClicks }}</p>
    </section>

    <section class="smoke__section" aria-labelledby="switch-heading">
      <h2 id="switch-heading" class="smoke__section-title">HSwitch</h2>
      <div class="smoke__row smoke__row--wrap smoke__switch-row">
        <label class="smoke__switch-item">
          <span class="smoke__hint smoke__hint--inline">md v-model</span>
          <h-switch v-model="switchOn" aria-label="示例开关" />
          <span class="smoke__hint smoke__hint--inline">{{ switchOn ? 'on' : 'off' }}</span>
        </label>
        <label class="smoke__switch-item">
          <span class="smoke__hint smoke__hint--inline">disabled on</span>
          <h-switch :model-value="true" disabled aria-label="禁用开" />
        </label>
        <label class="smoke__switch-item">
          <span class="smoke__hint smoke__hint--inline">disabled off</span>
          <h-switch :model-value="false" disabled aria-label="禁用关" />
        </label>
      </div>
      <p class="smoke__hint">sizes</p>
      <div class="smoke__row smoke__row--wrap">
        <h-switch v-model="switchSm" size="sm" aria-label="小开关" />
        <h-switch v-model="switchMd" size="md" aria-label="中开关" />
        <h-switch v-model="switchLg" size="lg" aria-label="大开关" />
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="sheet-heading">
      <h2 id="sheet-heading" class="smoke__section-title">HBottomSheet</h2>
      <div class="smoke__row smoke__row--wrap">
        <h-button @click="sheetOpen = true">打开底部面板</h-button>
        <h-button variant="outline" @click="openSheetNoOverlayClose">
          打开（遮罩不关）
        </h-button>
      </div>
      <p v-if="sheetCloseCount > 0" class="smoke__ping">
        close 次数：{{ sheetCloseCount }}
      </p>

      <h-bottom-sheet
        v-model="sheetOpen"
        title="示例底部面板"
        @close="onSheetClose"
      >
        <p class="smoke__sheet-copy">
          遮罩点击或 Esc 可关闭。内容区可放表单、操作按钮等。
        </p>
        <div class="smoke__row smoke__row--wrap">
          <h-button size="sm" @click="sheetOpen = false">完成</h-button>
          <h-button size="sm" variant="ghost" @click="sheetOpen = false">取消</h-button>
        </div>
      </h-bottom-sheet>

      <h-bottom-sheet
        v-model="sheetNoOverlayClose"
        :close-on-overlay="false"
        title="遮罩不关闭"
        @close="onSheetClose"
      >
        <p class="smoke__sheet-copy">
          点击遮罩不会关闭；请用 Esc 或下方按钮。
        </p>
        <h-button size="sm" @click="sheetNoOverlayClose = false">关闭</h-button>
      </h-bottom-sheet>
    </section>

    <section class="smoke__section" aria-labelledby="dialog-heading">
      <h2 id="dialog-heading" class="smoke__section-title">HDialog</h2>
      <div class="smoke__row smoke__row--wrap">
        <h-button @click="dialogOpen = true">打开对话框</h-button>
        <h-button variant="outline" @click="dialogNoOverlayClose = true">
          打开（遮罩不关）
        </h-button>
      </div>
      <p v-if="dialogCloseCount > 0" class="smoke__ping">
        dialog close 次数：{{ dialogCloseCount }}
      </p>

      <h-dialog
        v-model="dialogOpen"
        title="确认操作"
        description="这是居中 Dialog 示例。遮罩或 Esc 可关闭。"
        @close="onDialogClose"
      >
        <p class="smoke__sheet-copy">也可在内容区放自定义正文。</p>
        <template #actions>
          <h-button size="sm" variant="ghost" @click="dialogOpen = false">取消</h-button>
          <h-button size="sm" @click="dialogOpen = false">确认</h-button>
        </template>
      </h-dialog>

      <h-dialog
        v-model="dialogNoOverlayClose"
        :close-on-overlay="false"
        title="遮罩不关闭"
        description="请用 Esc 或按钮关闭。"
        @close="onDialogClose"
      >
        <template #actions>
          <h-button size="sm" @click="dialogNoOverlayClose = false">关闭</h-button>
        </template>
      </h-dialog>
    </section>

    <section class="smoke__section" aria-labelledby="input-heading">
      <h2 id="input-heading" class="smoke__section-title">HInput</h2>
      <div class="smoke__field-stack">
        <h-input
          v-model="simpleName"
          label="v-model 示例"
          description="标准受控输入"
          placeholder="输入名称"
        />
        <p class="smoke__hint smoke__hint--inline">当前值：{{ simpleName || '（空）' }}</p>
        <h-input
          model-value="bad"
          label="错误态"
          error="请输入有效内容"
          size="sm"
        />
        <h-input
          model-value="disabled"
          label="禁用"
          disabled
          size="lg"
        />
      </div>

      <p class="smoke__hint smoke__hint--spaced">TanStack Vue Form 对接</p>
      <form class="smoke__field-stack" @submit.prevent.stop="onTanstackSubmit">
        <form.Field name="email">
          <template #default="{ field }">
            <h-input
              label="Email"
              type="email"
              placeholder="you@example.com"
              :name="field.name"
              :model-value="String(field.state.value ?? '')"
              :error="fieldError(field.state.meta.errors)"
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </template>
        </form.Field>
        <form.Field name="password">
          <template #default="{ field }">
            <h-input
              label="Password"
              type="password"
              :name="field.name"
              :model-value="String(field.state.value ?? '')"
              :error="fieldError(field.state.meta.errors)"
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </template>
        </form.Field>
        <div class="smoke__row smoke__row--wrap">
          <h-button type="submit" size="sm">提交 TanStack 表单</h-button>
        </div>
        <p v-if="tanstackSubmitMsg" class="smoke__ping">{{ tanstackSubmitMsg }}</p>
      </form>
    </section>

    <section class="smoke__section" aria-labelledby="checkbox-heading">
      <h2 id="checkbox-heading" class="smoke__section-title">HCheckbox</h2>
      <div class="smoke__field-stack">
        <h-checkbox
          v-model="checkOn"
          label="接受条款"
        />
        <p class="smoke__hint smoke__hint--inline">
          v-model：{{ checkOn ? 'checked' : 'unchecked' }}
        </p>
        <h-checkbox
          :model-value="true"
          disabled
          label="禁用（已选）"
        />
        <h-checkbox
          :model-value="false"
          disabled
          label="禁用（未选）"
        />
        <div class="smoke__row smoke__row--wrap">
          <h-checkbox v-model="checkSm" size="sm" label="sm" />
          <h-checkbox v-model="checkMd" size="md" label="md" />
          <h-checkbox v-model="checkLg" size="lg" label="lg" />
        </div>
        <h-checkbox
          :model-value="selectAll"
          :indeterminate="selectIndeterminate"
          label="全选（半选演示）"
          @update:model-value="onSelectAll"
        />
        <div class="smoke__field-stack smoke__field-stack--indent">
          <h-checkbox v-model="itemA" label="子项 A" />
          <h-checkbox v-model="itemB" label="子项 B" />
          <h-checkbox v-model="itemC" label="子项 C" />
        </div>
        <h-checkbox
          v-model="checkAriaOnly"
          aria-label="无文案复选框"
        />
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="empty-heading">
      <h2 id="empty-heading" class="smoke__section-title">HEmpty</h2>
      <div class="smoke__empty-frame">
        <h-empty
          title="暂无内容"
          description="这里还没有任何项目。可添加数据或调整筛选条件。"
        >
          <template #icon>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M3 9h18"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </template>
          <h-button size="sm" @click="emptyActionClicks += 1">添加项目</h-button>
          <h-button size="sm" variant="ghost">了解更多</h-button>
        </h-empty>
      </div>
      <p v-if="emptyActionClicks > 0" class="smoke__ping">
        empty action 点击：{{ emptyActionClicks }}
      </p>
      <p class="smoke__hint smoke__hint--spaced">仅标题 + 描述</p>
      <div class="smoke__empty-frame smoke__empty-frame--short">
        <h-empty
          title="搜索无结果"
          description="试试其他关键词。"
        />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm } from '@tanstack/vue-form'
import { HBottomSheet, HButton, HCheckbox, HDialog, HEmpty, HInput, HSwitch } from 'happier-ui'

const buttonClicks = ref(0)
const switchOn = ref(true)
const switchSm = ref(false)
const switchMd = ref(true)
const switchLg = ref(false)
const sheetOpen = ref(false)
const sheetNoOverlayClose = ref(false)
const sheetCloseCount = ref(0)
const dialogOpen = ref(false)
const dialogNoOverlayClose = ref(false)
const dialogCloseCount = ref(0)
const simpleName = ref('')
const tanstackSubmitMsg = ref('')
const checkOn = ref(false)
const emptyActionClicks = ref(0)
const checkSm = ref(false)
const checkMd = ref(true)
const checkLg = ref(false)
const checkAriaOnly = ref(false)
const itemA = ref(true)
const itemB = ref(false)
const itemC = ref(false)

const selectAll = computed(() => itemA.value && itemB.value && itemC.value)
const selectIndeterminate = computed(() => {
  const n = [itemA.value, itemB.value, itemC.value].filter(Boolean).length
  return n > 0 && n < 3
})

const onSelectAll = (value: boolean) => {
  itemA.value = value
  itemB.value = value
  itemC.value = value
}

type DemoForm = {
  email: string
  password: string
}

const form = useForm({
  defaultValues: {
    email: '',
    password: '',
  } satisfies DemoForm,
  onSubmit: async ({ value }) => {
    tanstackSubmitMsg.value = `已提交：${value.email} / ${'*'.repeat(value.password.length || 0)}`
  },
})

const fieldError = (errors: unknown[]) => {
  const first = errors[0]
  if (first == null) return undefined
  if (typeof first === 'string') return first
  if (typeof first === 'object' && first !== null && 'message' in first) {
    return String((first as { message: unknown }).message)
  }
  return String(first)
}

const onTanstackSubmit = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  void form.handleSubmit()
}

const buttonVariants = [
  'primary',
  'secondary',
  'tertiary',
  'outline',
  'ghost',
  'danger',
  'danger-soft',
] as const
const buttonSizes = ['sm', 'md', 'lg'] as const

const onButtonClick = () => {
  buttonClicks.value += 1
}

const openSheetNoOverlayClose = () => {
  sheetNoOverlayClose.value = true
}

const onSheetClose = () => {
  sheetCloseCount.value += 1
}

const onDialogClose = () => {
  dialogCloseCount.value += 1
}
</script>

<style scoped>
.smoke {
  max-width: 36rem;
  margin: 0 auto;
  padding: var(--h-space-lg, 16px);
  padding-bottom: calc(var(--h-space-xl, 24px) + env(safe-area-inset-bottom, 0px));
}

.smoke__header {
  margin-bottom: var(--h-space-xl, 24px);
}

.smoke__title {
  margin: 0 0 var(--h-space-sm, 8px);
  font-size: 1.25rem;
  color: var(--h-color-primary, #006fee);
}

.smoke__lead {
  margin: 0 0 var(--h-space-md, 12px);
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-ink-muted, #666);
  text-wrap: pretty;
}

.smoke__swatch {
  width: 100%;
  height: 8px;
  border-radius: var(--h-radius-pill, 999px);
  background: var(--h-color-primary, #006fee);
}

.smoke__section {
  margin-bottom: var(--h-space-xl, 24px);
}

.smoke__section-title {
  margin: 0 0 var(--h-space-sm, 8px);
  font-size: var(--h-font-label, 12px);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--h-color-ink-muted, #666);
}

.smoke__hint {
  margin: 0 0 var(--h-space-sm, 8px);
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-ink-muted, #666);
}

.smoke__ping {
  margin: var(--h-space-sm, 8px) 0 0;
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-primary, #006fee);
}

.smoke__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--h-space-sm, 8px);
}

.smoke__row--wrap {
  margin-bottom: var(--h-space-md, 12px);
}

.smoke__button-block {
  margin-bottom: var(--h-space-sm, 8px);
}

.smoke__switch-row {
  margin-bottom: var(--h-space-md, 12px);
}

.smoke__switch-item {
  display: inline-flex;
  align-items: center;
  gap: var(--h-space-sm, 8px);
}

.smoke__hint--inline {
  margin: 0;
}

.smoke__sheet-copy {
  margin: 0 0 var(--h-space-md, 12px);
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-ink-muted, #666);
  text-wrap: pretty;
}

.smoke__field-stack {
  display: flex;
  flex-direction: column;
  gap: var(--h-space-md, 12px);
  margin-bottom: var(--h-space-md, 12px);
}

.smoke__hint--spaced {
  margin-top: var(--h-space-md, 12px);
}

.smoke__field-stack--indent {
  margin-left: var(--h-space-lg, 16px);
  margin-bottom: 0;
}

.smoke__empty-frame {
  overflow: hidden;
  border: 1px solid var(--h-color-border-subtle, #e0e0e0);
  border-radius: var(--h-radius-control, 12px);
  background: var(--h-color-surface, #ffffff);
}

.smoke__empty-frame .h-empty {
  min-height: 22rem;
}

.smoke__empty-frame--short .h-empty {
  min-height: 12rem;
}
</style>
