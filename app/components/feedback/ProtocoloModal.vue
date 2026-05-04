<script setup lang="ts">
const props = defineProps<{
  show: boolean
  protocolo: string
  copied: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'copy'): void
}>()
</script>

<template>
  <Transition name="modal">
    <div
      v-if="props.show"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="emit('close')" />

      <div class="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
          Enviado com sucesso
        </p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
          Obrigado pela sua contribuição!
        </h2>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sua manifestação foi registrada com sucesso. Sua participação ajuda a melhorar nossos serviços.
        </p>
        <p class="mt-3 text-base font-semibold text-slate-900 dark:text-white">
          Seu protocolo
        </p>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Anote ou copie esse código para consultar o status depois.
        </p>

        <div class="mt-5 rounded-2xl border border-dashed border-green-300 dark:border-green-800 bg-green-50/70 dark:bg-green-950/20 px-4 py-4 text-center">
          <p class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Protocolo
          </p>
          <p class="mt-2 break-all text-xl font-bold text-slate-900 dark:text-white">
            {{ props.protocolo }}
          </p>
        </div>

        <div class="mt-5 flex flex-col gap-3 sm:flex-row">
          <UButton
            block
            :icon="props.copied ? 'i-lucide-check' : 'i-lucide-copy'"
            @click="emit('copy')"
          >
            {{ props.copied ? 'Protocolo copiado' : 'Copiar e fechar' }}
          </UButton>
          <UButton block variant="soft" color="neutral" @click="emit('close')">
            Fechar
          </UButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 180ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 180ms ease, opacity 180ms ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: translateY(10px) scale(0.98);
  opacity: 0;
}
</style>