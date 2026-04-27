import type {
  FeedbackFormData,
  ProtocoloModalState,
  ToastState,
  ToastType
} from '~/types/feedback'

const formatarTelefone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  return digits
}

const validarTelefone = (value: string) => {
  const digits = formatarTelefone(value)
  return digits.length === 11 && digits[2] === '9'
}

export const useFeedback = () => {
  const loading = ref(false)
  const copiedProtocolo = ref(false)
  let copiedTimeout: ReturnType<typeof setTimeout> | null = null
  const toast = ref<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })
  const protocoloModal = ref<ProtocoloModalState>({
    show: false,
    protocolo: ''
  })

  const showToast = (message: string, type: ToastType = 'success') => {
    toast.value = { show: true, message, type }

    setTimeout(() => {
      toast.value.show = false
    }, 3000)
  }

  const validarPayload = (payload: FeedbackFormData) => {
    if (!payload.descricao || payload.descricao.trim() === '') {
      return 'Preencha a descrição'
    }

    if (!payload.regiao || !payload.unidade) {
      return 'Selecione a região e a unidade'
    }

    if (!payload.nota) {
      return 'Selecione uma nota de 1 a 10'
    }

    if (!payload.anonimo && !validarTelefone(payload.telefone)) {
      return 'Telefone inválido. Use um celular brasileiro no formato (XX) 9XXXX-XXXX'
    }

    return null
  }

  const enviarFeedback = async (payload: FeedbackFormData) => {
    const validationError = validarPayload(payload)
    if (validationError) {
      showToast(validationError, 'error')
      return false
    }

    try {
      loading.value = true

      const response = await $fetch<{ success: boolean; protocolo?: string; message?: string }>('/api/feedback', {
        method: 'POST',
        body: payload
      })

      if (response.success) {
        protocoloModal.value = {
          show: true,
          protocolo: response.protocolo || ''
        }

        return true
      }

      showToast(response.message || 'Erro ao salvar', 'error')
      return false
    } catch (error: any) {
      showToast(error?.data?.message || error?.message || 'Erro ao enviar', 'error')
      return false
    } finally {
      loading.value = false
    }
  }

  const fecharModalProtocolo = () => {
    protocoloModal.value.show = false
    protocoloModal.value.protocolo = ''
  }

  const copiarProtocolo = async () => {
    if (!protocoloModal.value.protocolo || !navigator?.clipboard) return

    await navigator.clipboard.writeText(protocoloModal.value.protocolo)
    copiedProtocolo.value = true

    if (copiedTimeout) {
      clearTimeout(copiedTimeout)
    }

    copiedTimeout = setTimeout(() => {
      copiedProtocolo.value = false
    }, 1500)

    showToast('Protocolo copiado.', 'success')
  }

  return {
    loading,
    copiedProtocolo,
    toast,
    protocoloModal,
    enviarFeedback,
    fecharModalProtocolo,
    copiarProtocolo
  }
}