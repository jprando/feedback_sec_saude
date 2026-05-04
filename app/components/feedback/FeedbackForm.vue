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
  return ''
})

const notaObrigatoriaError = computed(() => {
  if (!submitAttempted.value) return ''
  if (!form.nota) {
    return 'Nota é obrigatória.'
  }
  return ''
})

const formatarTelefone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)}${digits.slice(3, 7)}-${digits.slice(7)}`
}

const onTelefoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const formatted = formatarTelefone(input.value)

  input.value = formatted
  form.telefone = formatted
}

const onPhoneKeydown = (event: KeyboardEvent) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (allowedKeys.includes(event.key)) return
  if (!/^[0-9]$/.test(event.key)) event.preventDefault()
}

const canSubmit = computed(() => {
  return !props.loading
})

const submitForm = () => {
  submitAttempted.value = true
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
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-5 sm:space-y-6">
    <TipoSelector v-model="form.tipo" />

    <div>
      <label class="block text-sm font-semibold mb-2">
        Tipo de serviço *
      </label>
      <USelect
        v-model="form.tipoServico"
        :items="TIPO_SERVICO_OPTIONS"
        placeholder="Selecione o tipo de serviço"
        size="lg"
        class="w-full"
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
      <textarea
        v-model="form.descricao"
        placeholder="Descreva sua manifestação..."
        class="w-full h-36 sm:h-32 p-4 rounded-xl border bg-white dark:bg-slate-900"
        maxlength="500"
      />
      <div class="text-xs text-slate-500 mt-1">
        {{ form.descricao.length }}/500
      </div>
      <p v-if="descricaoObrigatoriaError" class="text-xs text-red-600 dark:text-red-400">
        {{ descricaoObrigatoriaError }}
      </p>
    </div>

    <div class="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 px-4 py-3">
      <UCheckbox v-model="form.anonimo" />
      <label class="text-sm">
        Não quero me identificar
      </label>
    </div>

    <div v-if="!form.anonimo" class="space-y-3 sm:space-y-4">
      <UInput v-model="form.nome" placeholder="Nome" />
      <UInput
        v-model="form.telefone"
        type="tel"
        inputmode="numeric"
        autocomplete="tel"
        placeholder="Telefone"
        @input="onTelefoneInput"
        @keydown="onPhoneKeydown"
      />

      <UInput v-model="form.email" placeholder="Email" />
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