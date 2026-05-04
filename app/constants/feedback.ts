import type { RegiaoItem, TipoOption, TipoServicoOption } from '~/types/feedback'

export const REGIOES: RegiaoItem[] = [
  {
    label: 'SEDE',
    unidades: [
      'CENTRO MUNICIPAL DE SAÚDE DR HUMBERTO SALEME DO VALLE',
      'UNIDADE DE VIGILÂNCIA EM SAÚDE DE DOMINGOS MARTINS',
      'UNIDADE DE ASSISTÊNCIA FARMACÊUTICA MUNICIPAL DE D. MARTINS',
      'CENTRO DE FISIOTERAPIA MUNICIPAL DE DOMINGOS MARTINS',
      'UNIDADE DE REFERÊNCIA EM SAÚDE MENTAL DE DOMINGOS MARTINS',
      'SECRETARIA MUNICIPAL DE SAÚDE DE DOMINGOS MARTINS',
      'CLÍNICA ODONTOLÓGICA SEDE'
    ]
  },
  {
    label: 'MELGAÇO',
    unidades: [
      'UNIDADE DE SAÚDE DE MELGAÇO',
      'UNIDADE DE SAÚDE JARDEL HAESE',
      'POSTO DE ATENDIMENTO FAZENDA GERMANO SCHWANZ'
    ]
  },
  {
    label: 'PARAJU',
    unidades: [
      'UNIDADE DE SAÚDE DA FAMÍLIA DE PARAJU',
      'UNIDADE DE SAÚDE DE ALTO PARAJU'
    ]
  },
  {
    label: 'PONTO ALTO',
    unidades: [
      'UNIDADE DE SAÚDE JOAQUIM TESCH',
      'UNIDADE DE SAÚDE DE PONTO ALTO'
    ]
  },
  {
    label: 'TIJUCO PRETO',
    unidades: [
      'UNIDADE DE SAÚDE DE ALTO TIJUCO PRETO',
      'UNIDADE DE SAÚDE DE TIJUCO PRETO',
      'UNIDADE DE SAÚDE DE SÃO RAFAEL'
    ]
  },
  {
    label: 'PEDRA AZUL',
    unidades: [
      'UNIDADE DE SAÚDE DA FAMÍLIA DE PEDRA AZUL',
      'UNIDADE DE SAÚDE PAUL VOLGT'
    ]
  },
  {
    label: 'SANTA ISABEL',
    unidades: [
      'UNIDADE DE SAÚDE LEONOR GOMES CAMPOS'
    ]
  },
  {
    label: 'BIRIRICAS',
    unidades: [
      'UNIDADE DE SAÚDE DE BIRIRICAS'
    ]
  },
  {
    label: 'BARCELOS',
    unidades: [
      'UNIDADE DE SAÚDE ADOLPHO PIZZOL',
      'POSTO DE SAÚDE DE CRISTO REI'
    ]
  }
]

export const TIPO_OPTIONS: TipoOption[] = [
  { label: 'Informação', value: 'informacao', icon: 'i-lucide-info' },
  { label: 'Elogio', value: 'elogio', icon: 'i-lucide-star' },
  { label: 'Sugestão', value: 'sugestao', icon: 'i-lucide-lightbulb' },
  { label: 'Reclamação', value: 'reclamacao', icon: 'i-lucide-alert-circle' }
]

export const TIPO_SERVICO_OPTIONS: TipoServicoOption[] = [
  { label: 'Médico', value: 'medico' },
  { label: 'Triagem', value: 'triagem' },
  { label: 'Psicólogo', value: 'psicologo' },
  { label: 'Outros', value: 'outros' }
]

export const NOTA_OPTIONS = Array.from({ length: 10 }, (_, index) => index + 1)