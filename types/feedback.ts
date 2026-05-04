export type ManifestacaoTipo = 'informacao' | 'elogio' | 'sugestao' | 'reclamacao'
export type ServicoTipo = 'medico' | 'triagem' | 'psicologo' | 'outros'

export interface FeedbackFormData {
  tipo: ManifestacaoTipo
  tipoServico: ServicoTipo | ''
  regiao: string
  unidade: string
  nota: number
  descricao: string
  nome: string
  telefone: string
  email: string
  anonimo: boolean
}

export interface RegiaoItem {
  label: string
  unidades: string[]
}

export interface TipoOption {
  label: string
  value: ManifestacaoTipo
  icon: string
}

export interface TipoServicoOption {
  label: string
  value: ServicoTipo
}

export type ToastType = 'success' | 'error'

export interface ToastState {
  show: boolean
  message: string
  type: ToastType
}

export interface ProtocoloModalState {
  show: boolean
  protocolo: string
}

export const getEmptyFeedbackForm = (): FeedbackFormData => ({
  tipo: 'informacao',
  tipoServico: '',
  regiao: '',
  unidade: '',
  nota: 0,
  descricao: '',
  nome: '',
  telefone: '',
  email: '',
  anonimo: false
})