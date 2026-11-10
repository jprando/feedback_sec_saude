<script setup lang="ts">
import { TIPO_SERVICO_OPTIONS } from '~/constants/feedback'
import { getEmptyFeedbackForm } from '~/types/feedback'
import TipoSelector from '~/components/feedback/TipoSelector.vue'
import UnidadeSelector from '~/components/feedback/UnidadeSelector.vue'
import NotaSelector from '~/components/feedback/NotaSelector.vue'
import type { FeedbackFormData } from '~/types/feedback'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (event: 'submit', payload: FeedbackFormData): void
}>()

const router = useRouter()

const form = reactive<FeedbackFormData>(getEmptyFeedbackForm())
const submitAttempted = ref(false)

const descricaoObrigatoriaError = computed(() => {
  if (!submitAttempted.value) return ''
  if (!form.descricao || form.descricao.trim() === '') {
    return 'Descrição é obrigatória.'
  }
  return ''
})

const unidadeObrigatoriaError = computed(() => {
  if (!submitAttempted.value) return ''
  if (!form.regiao || !form.unidade) {
    return 'Região e unidade são obrigatórias.'
  }
  return ''
})

const tipoServicoObrigatorioError = computed(() => {
  if (!submitAttempted.value) return ''
  if (!form.tipoServico) {
    return 'Tipo de serviço é obrigatório.'
  }
  if (form.tipoServico === 'outros' && form.tipoServicoOutro.trim() === '') {
    return 'Informe qual é o tipo de serviço.'
  }
  return ''
})

const notaObrigatoriaError = computed(() => {
  if (!submitAttempted.value) return ''
  if (!form.nota) {
    return 'Nota é obrigatória.'
  }
  return ''
})

const canSubmit = computed(() => {
  return !props.loading
})

const submitForm = () => {
  submitAttempted.value = true
  const hasErrors = !!(
    descricaoObrigatoriaError.value
    || unidadeObrigatoriaError.value
    || tipoServicoObrigatorioError.value
    || notaObrigatoriaError.value
  )
  if (hasErrors) return
  emit('submit', { ...form })
}

const resetForm = () => {
  Object.assign(form, getEmptyFeedbackForm())
  submitAttempted.value = false
}

defineExpose({ resetForm })

watch(() => form.regiao, () => {
  form.unidade = ''
})

watch(() => form.tipoServico, (tipoServico) => {
  if (tipoServico !== 'outros') {
    form.tipoServicoOutro = ''
  }
})
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-5 sm:space-y-6">
    <TipoSelector v-model="form.tipo" />

    <div>
      <label class="block text-sm font-semibold mb-3">
        Tipo de serviço *
      </label>
      <div class="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          v-for="opcao in TIPO_SERVICO_OPTIONS"
          :key="opcao.value"
          type="button"
          @click="form.tipoServico = opcao.value"
          :class="[
            'flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all text-center',
            form.tipoServico === opcao.value
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400'
              : 'border-slate-200 dark:border-slate-700'
          ]"
        >
          <i :class="opcao.icon" class="text-xl"></i>
          <span class="text-xs font-medium">{{ opcao.label }}</span>
        </button>
      </div>
      <UInput
        v-if="form.tipoServico === 'outros'"
        v-model="form.tipoServicoOutro"
        placeholder="Digite o tipo de serviço *"
        size="lg"
        class="mt-3 w-full"
        maxlength="80"
      />
      <p v-if="tipoServicoObrigatorioError" class="mt-2 text-xs text-red-600 dark:text-red-400">
        {{ tipoServicoObrigatorioError }}
      </p>
    </div>

    <UnidadeSelector
      v-model:regiao="form.regiao"
      v-model:unidade="form.unidade"
    />
    <p v-if="unidadeObrigatoriaError" class="-mt-2 text-xs text-red-600 dark:text-red-400">
      {{ unidadeObrigatoriaError }}
    </p>

    <div class="space-y-3">
      <label class="block text-sm font-semibold mb-2">
        Descrição *
      </label>
      <UTextarea
        v-model="form.descricao"
        placeholder="Descreva sua manifestação..."
        :rows="5"
        class="w-full"
        maxlength="500"
      />
      <div class="text-xs text-slate-500 mt-1">
        {{ form.descricao.length }}/500
      </div>
      <p v-if="descricaoObrigatoriaError" class="text-xs text-red-600 dark:text-red-400">
        {{ descricaoObrigatoriaError }}
      </p>
    </div>

    <NotaSelector v-model="form.nota" />
    <p v-if="notaObrigatoriaError" class="-mt-2 text-xs text-red-600 dark:text-red-400">
      {{ notaObrigatoriaError }}
    </p>

    <div class="flex flex-col gap-3 pt-3 sm:pt-4 pb-2 sm:pb-0">
      <UButton
        type="submit"
        block
        :loading="props.loading"
        :disabled="!canSubmit"
      >
        {{ props.loading ? 'Enviando...' : 'Enviar' }}
      </UButton>

      <UButton
        type="button"
        variant="ghost"
        block
        @click="router.push('/acompanhar')"
      >
        Ver Status do Envio
      </UButton>
    </div>
  </form>
</template>
