<script setup lang="ts">
import { NOTA_OPTIONS } from '~/constants/feedback'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

const notaClass = (nota: number) => {
  if (nota <= 3) return 'border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
  if (nota <= 7) return 'border-amber-400 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
  return 'border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
}
</script>

<template>
  <div class="space-y-3">
    <label class="block text-sm font-semibold mb-3">
      Nota *
    </label>
    <div class="grid grid-cols-5 gap-2 sm:gap-2.5">
      <button
        v-for="nota in NOTA_OPTIONS"
        :key="nota"
        type="button"
        @click="emit('update:modelValue', nota)"
        :class="[
          'h-11 w-full rounded-full border-2 text-sm font-bold transition-all duration-200 flex items-center justify-center bg-white dark:bg-slate-900 touch-manipulation',
          props.modelValue === nota
            ? `${notaClass(nota)} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950`
            : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
        ]"
      >
        {{ nota }}
      </button>
    </div>
    <p class="text-xs text-slate-500 dark:text-slate-400">
      Selecione uma nota de 1 a 10 para avaliar o atendimento.
    </p>
  </div>
</template>