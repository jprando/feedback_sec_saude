<script setup lang="ts">
import { NOTA_OPTIONS } from '~/constants/feedback'
import { computed, ref } from 'vue'

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

const selectedRange = computed(() => rangeFor(props.modelValue || 0))

const ariaLabel = (nota: number) => `Nota ${nota}`

const buttonClasses = (nota: number) => {
  const base = 'flex-1 h-10 sm:h-12 flex items-center justify-center rounded-xl border transition-transform duration-200 ease-in-out select-none bg-white dark:bg-slate-900'
  const isSelected = props.modelValue === nota
  const range = rangeFor(nota)
  let palette = ''

  if (range === 'low') palette = isSelected ? 'border-red-300 bg-red-50 text-red-700' : 'border-red-100 text-red-600'
  else if (range === 'mid') palette = isSelected ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-amber-100 text-amber-600'
  else palette = isSelected ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-emerald-100 text-emerald-600'

  const state = isSelected ? 'scale-105 shadow-sm ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950' : 'hover:scale-[1.02] hover:shadow-sm'
  return `${base} ${palette} ${state}`
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

const localFocused = ref(false)
</script>

<template>
  <div class="space-y-3">
    <label class="block text-sm font-semibold">
      Nota *
    </label>

    <div role="radiogroup" @keydown="onKeydown" class="flex gap-1 sm:gap-2 items-center justify-between w-full">
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
        <span class="text-sm font-medium">{{ nota }}</span>
      </button>
    </div>

    <div class="mt-4 flex items-center justify-center">
      <transition name="fade" mode="out-in">
        <div :key="selectedRange" class="flex items-center gap-3">
          <svg v-if="selectedRange === 'low'" width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="rounded-full p-2 bg-red-50 transform transition-transform duration-300">
            <circle cx="12" cy="12" r="10" stroke="#FCA5A5" stroke-width="1.2" fill="#FEF2F2" />
            <circle cx="9" cy="10" r="1" fill="#DC2626" />
            <circle cx="15" cy="10" r="1" fill="#DC2626" />
            <path d="M8 16c1.333-1.333 2.667-1.333 4 0" stroke="#DC2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <svg v-else-if="selectedRange === 'mid'" width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="rounded-full p-2 bg-amber-50 transform transition-transform duration-300">
            <circle cx="12" cy="12" r="10" stroke="#FDE68A" stroke-width="1.2" fill="#FFFBEB" />
            <circle cx="9" cy="10" r="1" fill="#B45309" />
            <circle cx="15" cy="10" r="1" fill="#B45309" />
            <path d="M8 15h8" stroke="#B45309" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <svg v-else width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="rounded-full p-2 bg-emerald-50 transform transition-transform duration-300">
            <circle cx="12" cy="12" r="10" stroke="#86EFAC" stroke-width="1.2" fill="#ECFDF5" />
            <circle cx="9" cy="10" r="1" fill="#065F46" />
            <circle cx="15" cy="10" r="1" fill="#065F46" />
            <path d="M8 14c1.333 1.333 2.667 1.333 4 0" stroke="#065F46" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
