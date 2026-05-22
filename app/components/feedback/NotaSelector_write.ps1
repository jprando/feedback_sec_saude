$component = @'
<script setup lang="ts">
import { NOTA_OPTIONS } from '~/constants/feedback'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

const rangeFor = (nota: number) => {
  if (nota <= 4) return 'low'
  if (nota <= 7) return 'mid'
  return 'high'
}

const faceConfig = (nota: number) => {
  const palette = {
    low: { bg: '#FEF2F2', ring: '#FCA5A5', stroke: '#B91C1C' },
    mid: { bg: '#FFFBEB', ring: '#FDE68A', stroke: '#B45309' },
    high: { bg: '#ECFDF5', ring: '#86EFAC', stroke: '#065F46' }
  }

  const meta = palette[rangeFor(nota) as keyof typeof palette]

  const variants = {
    1: { eyeType: 'cross', mouth: 'M8 16c1.333-1.333 2.667-1.333 4 0' },
    2: { eyeType: 'cross', mouth: 'M8 15.5c1.333-1.333 2.667-1.333 4 0' },
    3: { eyeType: 'line', mouth: 'M8 16c1.333-1.333 2.667-1.333 4 0' },
    4: { eyeType: 'semi', mouth: 'M8 16c1.333-0.7 2.667-0.7 4 0' },
    5: { eyeType: 'dot', mouth: 'M8 15h8' },
    6: { eyeType: 'dot', mouth: 'M8 15c1.333 0.333 2.667 0.333 4 0' },
    7: { eyeType: 'happy', mouth: 'M8 14.5c1.333 0.833 2.667 0.833 4 0' },
    8: { eyeType: 'happy', mouth: 'M8 14c1.333 1.333 2.667 1.333 4 0' },
    9: { eyeType: 'happy', mouth: 'M8 13.5c1.333 1.667 2.667 1.667 4 0' },
    10: { eyeType: 'happy', mouth: 'M8 13c1.333 2 2.667 2 4 0' }
  }

  return {
    ...meta,
    ...variants[nota as keyof typeof variants],
    label: `Expressão da nota ${nota}`
  }
}

const ariaLabel = (nota: number) => `Nota ${nota} - ${faceConfig(nota).label}`

const buttonClasses = (nota: number) => {
  const isSelected = props.modelValue === nota
  const range = rangeFor(nota)
  let palette = ''

  if (range === 'low') palette = isSelected ? 'border-red-300 bg-red-50 text-red-700' : 'border-red-100 text-red-600'
  else if (range === 'mid') palette = isSelected ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-amber-100 text-amber-600'
  else palette = isSelected ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-emerald-100 text-emerald-600'

  const state = isSelected ? 'scale-105 shadow-sm ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950' : 'hover:scale-105 hover:shadow-sm'
  return `flex flex-col gap-2 items-center justify-center rounded-3xl border px-3 py-3 transition-all duration-200 ease-in-out text-sm font-medium bg-white dark:bg-slate-900 ${palette} ${state}`
}

const onKeydown = (e: KeyboardEvent) => {
  const current = props.modelValue || 0
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (current < NOTA_OPTIONS.length) emit('update:modelValue', current + 1)
    e.preventDefault()
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (current > 1) emit('update:modelValue', current - 1)
    e.preventDefault()
  }
  if (e.key === 'Home') {
    emit('update:modelValue', 1)
    e.preventDefault()
  }
  if (e.key === 'End') {
    emit('update:modelValue', NOTA_OPTIONS.length)
    e.preventDefault()
  }
}
</script>

<template>
  <div class="space-y-4">
    <label class="block text-sm font-semibold">Nota *</label>

    <div role="radiogroup" @keydown="onKeydown" class="grid grid-cols-5 gap-2 sm:grid-cols-10">
      <button
        v-for="nota in NOTA_OPTIONS"
        :key="nota"
        role="radio"
        :aria-checked="props.modelValue === nota"
        :aria-label="ariaLabel(nota)"
        :tabindex="props.modelValue === nota ? 0 : -1"
        type="button"
        @click="emit('update:modelValue', nota)"
        :class="buttonClasses(nota)"
      >
        <span class="text-base sm:text-sm">{{ nota }}</span>
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="rounded-full border p-1"
          :style="{ backgroundColor: faceConfig(nota).bg, borderColor: faceConfig(nota).ring }"
        >
          <circle cx="12" cy="12" r="10" :stroke="faceConfig(nota).ring" stroke-width="1.2" :fill="faceConfig(nota).bg" />

          <template v-if="faceConfig(nota).eyeType === 'cross'">
            <path d="M7.3 8.3l1.4 1.4" :stroke="faceConfig(nota).stroke" stroke-width="1.5" stroke-linecap="round" />
            <path d="M7.3 9.7l1.4-1.4" :stroke="faceConfig(nota).stroke" stroke-width="1.5" stroke-linecap="round" />
            <path d="M15.3 8.3l-1.4 1.4" :stroke="faceConfig(nota).stroke" stroke-width="1.5" stroke-linecap="round" />
            <path d="M15.3 9.7l-1.4-1.4" :stroke="faceConfig(nota).stroke" stroke-width="1.5" stroke-linecap="round" />
          </template>

          <template v-else-if="faceConfig(nota).eyeType === 'line'">
            <path d="M8.5 9.8h2" :stroke="faceConfig(nota).stroke" stroke-width="1.5" stroke-linecap="round" />
            <path d="M13.5 9.8h2" :stroke="faceConfig(nota).stroke" stroke-width="1.5" stroke-linecap="round" />
          </template>

          <template v-else-if="faceConfig(nota).eyeType === 'semi'">
            <path d="M8.2 10.3c0 .5.8.8 1.4.5" :stroke="faceConfig(nota).stroke" stroke-width="1.5" stroke-linecap="round" fill="none" />
            <path d="M14.4 10.3c0 .5-.8.8-1.4.5" :stroke="faceConfig(nota).stroke" stroke-width="1.5" stroke-linecap="round" fill="none" />
          </template>

          <template v-else-if="faceConfig(nota).eyeType === 'happy'">
            <path d="M8.5 10.2c0 .8.8 1.4 1.6 1.4s1.6-.6 1.6-1.4" :stroke="faceConfig(nota).stroke" stroke-width="1.5" stroke-linecap="round" fill="none" />
            <path d="M13.9 10.2c0 .8.8 1.4 1.6 1.4s1.6-.6 1.6-1.4" :stroke="faceConfig(nota).stroke" stroke-width="1.5" stroke-linecap="round" fill="none" />
          </template>

          <template v-else>
            <circle cx="8.5" cy="10" r="1" :fill="faceConfig(nota).stroke" />
            <circle cx="15.5" cy="10" r="1" :fill="faceConfig(nota).stroke" />
          </template>

          <path :d="faceConfig(nota).mouth" :stroke="faceConfig(nota).stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
button[role='radio'] {
  min-height: 108px;
}

button[role='radio']:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.85);
  outline-offset: 3px;
}
</style>
'@
Set-Content -LiteralPath 'nuxt-app\app\components\feedback\NotaSelector.vue' -Value $component -Encoding utf8