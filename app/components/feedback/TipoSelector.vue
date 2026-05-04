<script setup lang="ts">
import { TIPO_OPTIONS } from '~/constants/feedback'
import type { ManifestacaoTipo } from '~/types/feedback'

const props = defineProps<{
  modelValue: ManifestacaoTipo
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: ManifestacaoTipo): void
}>()
</script>

<template>
  <div>
    <label class="block text-sm font-semibold mb-3">
      Tipo de Manifestação *
    </label>
    <div class="grid grid-cols-2 gap-3 sm:gap-4">
      <button
        v-for="tipo in TIPO_OPTIONS"
        :key="tipo.value"
        type="button"
        @click="emit('update:modelValue', tipo.value)"
        :class="[
          'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all text-left',
          props.modelValue === tipo.value
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400'
            : 'border-slate-200 dark:border-slate-700'
        ]"
      >
        <i :class="tipo.icon" class="text-xl"></i>
        <span class="text-xs font-medium text-center">
          {{ tipo.label }}
        </span>
      </button>
    </div>
  </div>
</template>