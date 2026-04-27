<script setup lang="ts">
import { useFeedback } from '~/composables/useFeedback'
import FeedbackForm from '~/components/feedback/FeedbackForm.vue'
import ProtocoloModal from '~/components/feedback/ProtocoloModal.vue'
import Toast from '~/components/feedback/Toast.vue'
import type { FeedbackFormData } from '~/types/feedback'

const feedbackFormRef = ref<{ resetForm: () => void } | null>(null)

const {
  loading,
  copiedProtocolo,
  toast,
  protocoloModal,
  enviarFeedback,
  fecharModalProtocolo,
  copiarProtocolo
} = useFeedback()

const enviar = async (payload: FeedbackFormData) => {
  const success = await enviarFeedback(payload)

  if (success) {
    feedbackFormRef.value?.resetForm()
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
    <div class="px-4 py-6 sm:px-6 sm:py-8 max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold mb-2">
          Manifeste-se
        </h1>
        <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Sua opinião é importante para nós. Compartilhe comentários, sugestões ou elogios sobre nossos serviços.
        </p>
      </div>

      <FeedbackForm
        ref="feedbackFormRef"
        :loading="loading"
        @submit="enviar"
      />
    </div>

    <ProtocoloModal
      :show="protocoloModal.show"
      :protocolo="protocoloModal.protocolo"
      :copied="copiedProtocolo"
      @close="fecharModalProtocolo"
      @copy="copiarProtocolo"
    />

    <Toast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
    />
  </div>
</template>
