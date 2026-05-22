<script setup lang="ts">
import { computed } from 'vue'
import { NOTA_OPTIONS } from '~/constants/feedback'

type NotaMood = 'critical' | 'low' | 'neutral' | 'positive' | 'excellent'

interface NotaConfig {
  nota: number
  emoji: string
  label: string
  mood: NotaMood
}

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

const notaConfig: Record<number, NotaConfig> = {
  1: { nota: 1, emoji: '😫', label: 'Extremamente insatisfeito', mood: 'critical' },
  2: { nota: 2, emoji: '😞', label: 'Muito insatisfeito', mood: 'critical' },
  3: { nota: 3, emoji: '😒', label: 'Insatisfeito', mood: 'low' },
  4: { nota: 4, emoji: '😕', label: 'Parcialmente insatisfeito', mood: 'low' },
  5: { nota: 5, emoji: '😐', label: 'Neutro negativo', mood: 'neutral' },
  6: { nota: 6, emoji: '🙂', label: 'Neutro', mood: 'neutral' },
  7: { nota: 7, emoji: '🙂‍↕️', label: 'Levemente satisfeito', mood: 'positive' },
  8: { nota: 8, emoji: '😊', label: 'Satisfeito', mood: 'positive' },
  9: { nota: 9, emoji: '😄', label: 'Muito satisfeito', mood: 'excellent' },
  10: { nota: 10, emoji: '🤩', label: 'Extremamente satisfeito', mood: 'excellent' }
}

const selectedConfig = computed<NotaConfig | null>(() => notaConfig[props.modelValue] ?? null)

const moodText = computed(() => {
  if (!selectedConfig.value) return 'Selecione uma nota para ver a leitura emocional.'
  return `${selectedConfig.value.label}.`
})

const bandLabel = (nota: number) => {
  if (nota <= 4) return 'ruim'
  if (nota <= 7) return 'neutro'
  return 'bom'
}

const rangeClasses: Record<NotaMood, { chip: string; active: string; idle: string; ring: string; glow: string }> = {
  critical: {
    chip: 'bg-rose-50 text-rose-700 ring-rose-200/70',
    active: 'border-rose-300/80 bg-rose-50/95 text-rose-900 shadow-[0_10px_24px_-16px_rgba(190,18,60,0.35)]',
    idle: 'border-rose-100 bg-white text-rose-700 hover:border-rose-200 hover:bg-rose-50/60',
    ring: 'ring-rose-200/70',
    glow: 'shadow-[0_0_0_1px_rgba(251,113,133,0.12),0_12px_28px_-20px_rgba(190,18,60,0.35)]'
  },
  low: {
    chip: 'bg-orange-50 text-orange-800 ring-orange-200/70',
    active: 'border-orange-300/80 bg-orange-50/95 text-orange-950 shadow-[0_10px_24px_-16px_rgba(217,119,6,0.28)]',
    idle: 'border-orange-100 bg-white text-orange-700 hover:border-orange-200 hover:bg-orange-50/60',
    ring: 'ring-orange-200/70',
    glow: 'shadow-[0_0_0_1px_rgba(251,146,60,0.10),0_12px_28px_-20px_rgba(217,119,6,0.28)]'
  },
  neutral: {
    chip: 'bg-amber-50 text-amber-800 ring-amber-200/70',
    active: 'border-amber-300/80 bg-amber-50/95 text-amber-950 shadow-[0_10px_24px_-16px_rgba(180,83,9,0.24)]',
    idle: 'border-amber-100 bg-white text-amber-700 hover:border-amber-200 hover:bg-amber-50/60',
    ring: 'ring-amber-200/70',
    glow: 'shadow-[0_0_0_1px_rgba(251,191,36,0.10),0_12px_28px_-20px_rgba(180,83,9,0.24)]'
  },
  positive: {
    chip: 'bg-emerald-50 text-emerald-800 ring-emerald-200/70',
    active: 'border-emerald-300/80 bg-emerald-50/95 text-emerald-950 shadow-[0_10px_24px_-16px_rgba(5,150,105,0.24)]',
    idle: 'border-emerald-100 bg-white text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50/60',
    ring: 'ring-emerald-200/70',
    glow: 'shadow-[0_0_0_1px_rgba(52,211,153,0.10),0_12px_28px_-20px_rgba(5,150,105,0.24)]'
  },
  excellent: {
    chip: 'bg-emerald-50 text-emerald-900 ring-emerald-200/70',
    active: 'border-emerald-300/80 bg-emerald-50/95 text-emerald-950 shadow-[0_10px_24px_-16px_rgba(4,120,87,0.26)]',
    idle: 'border-emerald-100 bg-white text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50/60',
    ring: 'ring-emerald-200/70',
    glow: 'shadow-[0_0_0_1px_rgba(110,231,183,0.10),0_12px_28px_-20px_rgba(4,120,87,0.26)]'
  }
}

const getNotaConfig = (nota: number): NotaConfig => notaConfig[nota] ?? notaConfig[6]!

const buttonClasses = (nota: number) => {
  const config = getNotaConfig(nota)
  const isSelected = props.modelValue === nota
  const palette = rangeClasses[config.mood]

  return [
    'group relative flex h-20 w-full min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-2 text-center transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950',
    isSelected
      ? `${palette.active} ${palette.ring} ${palette.glow} scale-[1.02]`
      : `${palette.idle} hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-16px_rgba(15,23,42,0.18)]`
  ]
}

const emojiClasses = (nota: number) => {
  const config = getNotaConfig(nota)
  const isSelected = props.modelValue === nota
  const palette = rangeClasses[config.mood]

  return [
    'text-xl sm:text-2xl leading-none transition-transform duration-200 ease-out',
    isSelected ? 'scale-110' : 'group-hover:scale-[1.06]',
    isSelected ? palette.glow : ''
  ]
}

const legendClasses = computed(() => {
  if (!selectedConfig.value) {
    return 'bg-slate-50 text-slate-600 ring-slate-200/70'
  }
  return rangeClasses[selectedConfig.value.mood].chip
})

const selectedNotaLabel = computed(() => selectedConfig.value?.label ?? 'Selecione uma nota')
const selectedNotaMood = computed(() => selectedConfig.value ? bandLabel(selectedConfig.value.nota) : 'prévia')
const selectedNotaValue = computed(() => selectedConfig.value?.nota ?? '—')

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
  <div class="space-y-3">
    <div class="flex items-end justify-between gap-4">
      <label class="block text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Nota *
      </label>
      <span class="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        Ruim → Neutro → Bom
      </span>
    </div>

    <div
      role="radiogroup"
      aria-label="Escala de nota de 1 a 10"
      @keydown="onKeydown"
      class="grid grid-cols-5 gap-2 sm:grid-cols-10 sm:gap-2"
    >
      <button
        v-for="nota in NOTA_OPTIONS"
        :key="nota"
        role="radio"
        :aria-checked="props.modelValue === nota"
        :aria-label="`Nota ${nota} - ${getNotaConfig(nota).label}`"
        :tabindex="props.modelValue === nota ? 0 : -1"
        type="button"
        @click="emit('update:modelValue', nota)"
        :class="buttonClasses(nota)"
      >
        <span class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500/80 dark:text-slate-400/80">
          {{ nota }}
        </span>
        <span :class="emojiClasses(nota)" aria-hidden="true">
          {{ getNotaConfig(nota).emoji }}
        </span>
      </button>
    </div>

    <div class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/50">
      <div class="flex items-center gap-3">
        <Transition name="chip" mode="out-in">
          <span
            :key="selectedNotaValue"
            class="inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-semibold ring-1 ring-inset"
            :class="legendClasses"
          >
            {{ selectedNotaValue }}
          </span>
        </Transition>
        <div class="min-w-0">
          <p class="text-sm font-medium text-slate-900 dark:text-slate-100">
            {{ selectedNotaLabel }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {{ moodText }}
          </p>
        </div>
      </div>

      <div class="hidden sm:block text-right">
        <p class="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Leitura emocional
        </p>
        <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {{ selectedNotaMood }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chip-enter-active,
.chip-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.chip-enter-from,
.chip-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.98);
}

.chip-enter-to,
.chip-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
