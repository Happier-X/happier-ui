<template>
  <main class="smoke">
    <header class="smoke__header">
      <h1 class="smoke__title">happier-ui 冒烟</h1>
      <p class="smoke__lead">
        第二宿主：纯 Vue + Capacitor 配置，无 Muses 业务、无 Ionic 壳。
      </p>
      <div class="smoke__swatch" aria-hidden="true" />
    </header>

    <section class="smoke__section" aria-labelledby="empty-heading">
      <h2 id="empty-heading" class="smoke__section-title">HEmptyState</h2>
      <h-empty-state
        compact
        title="暂无内容"
        description="这是跨项目接入 happier-ui 的空态示例（compact）。"
      >
        <template #icon>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M9 10h.01M15 10h.01M9.5 15c.8 1 1.9 1.5 2.5 1.5s1.7-.5 2.5-1.5" />
          </svg>
        </template>
        <h-button size="sm" variant="secondary">去添加</h-button>
      </h-empty-state>
    </section>

    <section class="smoke__section" aria-labelledby="section-heading">
      <h2 id="section-heading" class="smoke__section-title">HListSection + HListRow</h2>
      <h-list-section title="正在播放 / 选中" inset>
        <h-list-row
          title="正在播放示例"
          subtitle="副标题 · playing 优先于 selected"
          playing
          show-playing-indicator
        >
          <template #start>
            <span class="smoke__thumb" aria-hidden="true" />
          </template>
        </h-list-row>
        <h-list-row
          title="选中行"
          subtitle="selected 态"
          selected
        >
          <template #start>
            <span class="smoke__thumb smoke__thumb--muted" aria-hidden="true" />
          </template>
        </h-list-row>
        <h-list-row
          title="紧凑行"
          subtitle="density=compact"
          density="compact"
        >
          <template #start>
            <span class="smoke__thumb smoke__thumb--muted" aria-hidden="true" />
          </template>
        </h-list-row>
      </h-list-section>

      <p class="smoke__hint smoke__hint--spaced">flat（默认 inset=false）</p>
      <h-list-section title="Flat 全宽">
        <div class="smoke__list">
          <h-list-row title="普通行" subtitle="仅 start 槽色块">
            <template #start>
              <span class="smoke__thumb smoke__thumb--muted" aria-hidden="true" />
            </template>
          </h-list-row>
        </div>
      </h-list-section>
    </section>

    <section class="smoke__section" aria-labelledby="setting-heading">
      <h2 id="setting-heading" class="smoke__section-title">HSettingRow</h2>
      <div class="smoke__list">
        <h-setting-row
          label="示例开关"
          description="end 槽使用原生 checkbox（无 ion-toggle）"
        >
          <template #end>
            <input v-model="enabled" type="checkbox" aria-label="示例开关" />
          </template>
        </h-setting-row>
        <h-setting-row
          label="可点击行"
          description="interactive + click"
          interactive
          lines="none"
          @click="onSettingClick"
        />
      </div>
      <p v-if="settingClicks > 0" class="smoke__ping">设置行点击：{{ settingClicks }}</p>
    </section>

    <section class="smoke__section" aria-labelledby="icon-heading">
      <h2 id="icon-heading" class="smoke__section-title">HIconButton variants</h2>
      <p class="smoke__hint">default / ghost / subtle / danger / on-media / loading</p>
      <div class="smoke__row">
        <h-icon-button
          v-for="v in iconVariants"
          :key="v"
          :ariaLabel="`variant ${v}`"
          :variant="v"
          @click="onPing"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </h-icon-button>
        <h-icon-button ariaLabel="loading" loading>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </h-icon-button>
      </div>
      <div class="smoke__on-media" aria-label="on-media 预览底">
        <h-icon-button ariaLabel="on-media" variant="on-media">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </h-icon-button>
      </div>
      <p v-if="pingCount > 0" class="smoke__ping">IconButton 点击：{{ pingCount }}</p>
    </section>

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
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  HButton,
  HEmptyState,
  HIconButton,
  HListRow,
  HListSection,
  HSettingRow,
} from 'happier-ui'

const enabled = ref(true)
const pingCount = ref(0)
const buttonClicks = ref(0)
const settingClicks = ref(0)

const iconVariants = ['default', 'ghost', 'subtle', 'danger'] as const
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

const onPing = () => {
  pingCount.value += 1
}

const onButtonClick = () => {
  buttonClicks.value += 1
}

const onSettingClick = () => {
  settingClicks.value += 1
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

.smoke__list {
  border: 1px solid var(--h-color-separator, #e0e0e0);
  border-radius: var(--h-radius-md, 12px);
  overflow: hidden;
}

.smoke__thumb {
  display: block;
  width: var(--h-cover-size-sm, 48px);
  height: var(--h-cover-size-sm, 48px);
  border-radius: var(--h-radius-cover-sm, 8px);
  background: var(--h-color-primary, #006fee);
  opacity: 0.35;
}

.smoke__thumb--muted {
  background: var(--h-color-ink-muted, #92949c);
  opacity: 0.25;
}

.smoke__hint {
  margin: 0 0 var(--h-space-sm, 8px);
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-ink-muted, #666);
}

.smoke__hint--spaced {
  margin-top: var(--h-space-md, 12px);
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

.smoke__on-media {
  display: inline-flex;
  margin-top: var(--h-space-sm, 8px);
  padding: var(--h-space-sm, 8px);
  border-radius: var(--h-radius-md, 12px);
  background: var(--h-immersive-surface, #171b2b);
}
</style>
