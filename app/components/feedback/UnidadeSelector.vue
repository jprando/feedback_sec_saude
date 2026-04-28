<script setup lang="ts">
import { REGIOES } from '~/constants/feedback'

const props = defineProps<{
  regiao: string
  unidade: string
}>()

const emit = defineEmits<{
  (event: 'update:regiao', value: string): void
  (event: 'update:unidade', value: string): void
}>()

const regiaoOptions = REGIOES.map(regiao => ({
  label: regiao.label,
  value: regiao.label
}))

const regiaoAtiva = computed(() => REGIOES.find(regiao => regiao.label === props.regiao) || null)

const unidadesFiltradas = computed(() => {
  if (!regiaoAtiva.value) return []
  return regiaoAtiva.value.unidades
})

const truncateLabel = (text: string, maxLength = 58) => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}

const unidadeOptions = computed(() => {
  return unidadesFiltradas.value.map(unidade => ({
    label: truncateLabel(unidade),
    value: unidade
  }))
})

const onRegiaoChange = (value: string) => {
  emit('update:regiao', value)
  emit('update:unidade', '')
}

const onUnidadeChange = (value: string) => {
  emit('update:unidade', value ?? '')
}
</script>

<template>
  <div class="space-y-4 sm:space-y-5">
    <div>
      <label class="block text-sm font-semibold mb-2">
        Região
      </label>
      <USelect
        :model-value="regiao"
        :items="regiaoOptions"
        placeholder="Selecione a região"
        size="lg"
        @update:model-value="onRegiaoChange"
      />
    </div>

    <div>
      <label class="block text-sm font-semibold mb-2">
        Unidade / Local
      </label>

      <USelect
        class="mt-3 w-full"
        :model-value="unidade"
        :items="unidadeOptions"
        :placeholder="regiao ? 'Selecione a unidade' : 'Escolha uma região primeiro'"
        size="lg"
        :disabled="!regiao"
        @update:model-value="onUnidadeChange"
      />

      <p v-if="unidade" class="mt-2 text-xs text-slate-500 dark:text-slate-400 break-words">
        {{ unidade }}
      </p>

      <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Escolha a região acima. Depois filtre ou role a lista para encontrar a unidade.
      </p>
    </div>
  </div>
</template>