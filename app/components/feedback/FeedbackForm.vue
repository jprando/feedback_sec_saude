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

const nomeObrigatorioError = computed(() => {
  if (!submitAttempted.value || form.anonimo) return ''
  return !form.nome.trim() ? 'Nome é obrigatório.' : ''
})

const telefoneObrigatorioError = computed(() => {
  if (!submitAttempted.value || form.anonimo) return ''
  return !form.telefone.trim() ? 'Telefone é obrigatório.' : ''
})

const emailInvalidoError = computed(() => {
  if (!submitAttempted.value || form.anonimo) return ''
  if (!form.email.trim()) return 'Email é obrigatório.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Informe um email válido.'
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
  const hasErrors = !!(
    descricaoObrigatoriaError.value ||
    unidadeObrigatoriaError.value ||
    tipoServicoObrigatorioError.value ||
    notaObrigatoriaError.value ||
    nomeObrigatorioError.value ||
    telefoneObrigatorioError.value ||
    emailInvalidoError.value
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

    <div class="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 px-4 py-3">
      <UCheckbox v-model="form.anonimo" />
      <label class="text-sm">
        Não quero me identificar
      </label>
    </div>

    <div v-if="!form.anonimo" class="space-y-3 sm:space-y-4">
      <div>
        <UInput v-model="form.nome" placeholder="Nome *" />
        <p v-if="nomeObrigatorioError" class="mt-1 text-xs text-red-600 dark:text-red-400">
          {{ nomeObrigatorioError }}
        </p>
      </div>
      <div>
        <UInput
          v-model="form.telefone"
          type="tel"
          inputmode="numeric"
          autocomplete="tel"
          placeholder="Telefone *"
          @input="onTelefoneInput"
          @keydown="onPhoneKeydown"
        />
        <p v-if="telefoneObrigatorioError" class="mt-1 text-xs text-red-600 dark:text-red-400">
          {{ telefoneObrigatorioError }}
        </p>
      </div>
      <div>
        <UInput v-model="form.email" type="email" placeholder="Email *" />
        <p v-if="emailInvalidoError" class="mt-1 text-xs text-red-600 dark:text-red-400">
          {{ emailInvalidoError }}
        </p>
      </div>
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