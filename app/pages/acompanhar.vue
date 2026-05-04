<script setup lang="ts">
type Feedback = {
  id: number
  tipo: string
  tipoServico: string
  descricao: string
  nome: string | null
  telefone: string | null
  email: string | null
  anonimo: boolean
  protocolo: string
  created_at: string
}

const protocolo = ref('')
const loading = ref(false)
const resultado = ref<Feedback | null>(null)
const erro = ref('')
const copiado = ref(false)

const tipoLabel: Record<string, string> = {
  informacao: 'Informação',
  elogio: 'Elogio',
  sugestao: 'Sugestão',
  reclamacao: 'Reclamação'
}

const tipoServicoLabel: Record<string, string> = {
  medico: 'Médico',
  recepcao: 'Recepção',
  ambiente: 'Ambiente',
  odontologia: 'Odontologia',
  farmacia: 'Farmácia',
  enfermagem: 'Enfermagem',
  outros: 'Outros'
}

const buscar = async () => {
  const valor = protocolo.value.trim().toUpperCase()

  if (!valor) {
    erro.value = 'Informe um protocolo válido.'
    resultado.value = null
    return
  }

  try {
    loading.value = true
    erro.value = ''
    resultado.value = null

    const response = await $fetch<{ success: boolean; feedback?: Feedback; message?: string }>('/api/feedback', {
      query: { protocolo: valor }
    })

    if (response.success && response.feedback) {
      resultado.value = response.feedback
    } else {
      erro.value = response.message || 'Não foi possível localizar a manifestação.'
    }
  } catch (error: any) {
    erro.value = error?.data?.message || error?.message || 'Não foi possível consultar o protocolo.'
  } finally {
    loading.value = false
  }
}

const copiarProtocolo = async () => {
  if (!resultado.value?.protocolo || !navigator?.clipboard) return

  await navigator.clipboard.writeText(resultado.value.protocolo)
  copiado.value = true
  setTimeout(() => {
    copiado.value = false
  }, 2000)
}

const formatoData = computed(() => {
  return (value: string) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(new Date(value))
})
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
    <div class="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-500/10 via-sky-500/5 to-transparent pointer-events-none" />
    <div class="max-w-4xl mx-auto px-4 py-8 sm:py-12 relative">
      <div class="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] items-start mb-8">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Status
          </p>
          <h1 class="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            Consulte o status do seu envio
          </h1>
          <p class="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">
            Digite o protocolo recebido para visualizar a confirmação e os dados do envio.
          </p>
        </div>

        <div class="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-5 shadow-sm">
          <p class="text-sm font-semibold text-slate-900 dark:text-white">
            Como consultar o status
          </p>
          <ol class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>1. Localize o protocolo enviado no momento do registro.</li>
            <li>2. Cole o código no campo abaixo.</li>
            <li>3. Consulte para ver o status do envio.</li>
          </ol>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 sm:p-6">
        <form class="flex flex-col sm:flex-row gap-3" @submit.prevent="buscar">
          <UInput
            v-model="protocolo"
            placeholder="Ex: FB-1713870000000"
            class="flex-1"
            icon="i-lucide-search"
            @keyup.enter="buscar"
          />
          <UButton :loading="loading" type="submit" size="lg">
            {{ loading ? 'Buscando...' : 'Consultar' }}
          </UButton>
        </form>

        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
          O protocolo normalmente começa com <span class="font-medium">FB-</span>.
        </p>
      </div>

      <div v-if="erro" class="mt-6 rounded-2xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 p-4">
        {{ erro }}
      </div>

      <div v-if="resultado" class="mt-6 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/25 p-5 sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Envio localizado
            </p>
            <h2 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              Protocolo {{ resultado.protocolo }}
            </h2>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Seu envio foi registrado com sucesso. Esta tela serve para confirmar os dados informados.
            </p>
          </div>
          <div class="flex flex-col items-start gap-2">
            <UBadge color="success" variant="soft" size="lg">
              Recebida
            </UBadge>
            <UButton
              color="neutral"
              variant="soft"
              icon="i-lucide-copy"
              size="sm"
              @click="copiarProtocolo"
            >
              {{ copiado ? 'Copiado' : 'Copiar protocolo' }}
            </UButton>
          </div>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          <div class="rounded-2xl bg-white/80 dark:bg-slate-900/70 p-4">
            <p class="text-xs uppercase tracking-wider text-slate-500">Status atual</p>
            <p class="mt-1 font-semibold">
              Recebida
            </p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Registro localizado no sistema com esse protocolo.
            </p>
          </div>

          <div class="rounded-2xl bg-white/80 dark:bg-slate-900/70 p-4">
            <p class="text-xs uppercase tracking-wider text-slate-500">Tipo</p>
            <p class="mt-1 font-semibold">
              {{ tipoLabel[resultado.tipo] || resultado.tipo }}
            </p>
          </div>

          <div class="rounded-2xl bg-white/80 dark:bg-slate-900/70 p-4">
            <p class="text-xs uppercase tracking-wider text-slate-500">Tipo de serviço</p>
            <p class="mt-1 font-semibold">
              {{ tipoServicoLabel[resultado.tipoServico] || resultado.tipoServico || 'Não informado' }}
            </p>
          </div>

          <div class="rounded-2xl bg-white/80 dark:bg-slate-900/70 p-4">
            <p class="text-xs uppercase tracking-wider text-slate-500">Data de envio</p>
            <p class="mt-1 font-semibold">
              {{ formatoData(resultado.created_at) }}
            </p>
          </div>

          <div class="rounded-2xl bg-white/80 dark:bg-slate-900/70 p-4 sm:col-span-2">
            <p class="text-xs uppercase tracking-wider text-slate-500">Descrição</p>
            <p class="mt-1 leading-relaxed whitespace-pre-line">
              {{ resultado.descricao }}
            </p>
          </div>

          <div class="rounded-2xl bg-white/80 dark:bg-slate-900/70 p-4">
            <p class="text-xs uppercase tracking-wider text-slate-500">Identificação</p>
            <p class="mt-1 font-semibold">
              {{ resultado.anonimo ? 'Anônima' : 'Identificada' }}
            </p>
          </div>

          <div class="rounded-2xl bg-white/80 dark:bg-slate-900/70 p-4">
            <p class="text-xs uppercase tracking-wider text-slate-500">Contato</p>
            <p class="mt-1 font-semibold">
              {{ resultado.anonimo ? 'Não informado' : (resultado.nome || 'Não informado') }}
            </p>
            <p v-if="!resultado.anonimo" class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              O atendimento pode usar esse contato para retornar.
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
