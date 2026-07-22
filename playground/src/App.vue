<template>
  <main class="smoke">
    <header class="smoke__header">
      <h1 class="smoke__title">happier-ui 冒烟</h1>
      <p class="smoke__lead">
        导出 <code>HButton</code>、<code>HSwitch</code>、<code>HBottomSheet</code>、<code>HDialog</code> 与
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
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HBottomSheet, HButton, HDialog, HSwitch } from 'happier-ui'

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
</style>
