import { ensureFeedbackTable, getDb } from '../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const protocolo = String(query.protocolo || '').trim()

  if (!protocolo) {
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'Informe um protocolo para consulta'
    }
  }

  try {
    const db = getDb(event)

    await ensureFeedbackTable(db)

    const feedback = await db.prepare(
      `SELECT
        id,
        tipo,
        tipo_servico AS tipoServico,
        regiao,
        unidade,
        nota,
        descricao,
        nome,
        telefone,
        email,
        anonimo,
        protocolo,
        created_at
      FROM feedbacks
      WHERE protocolo = ?
      LIMIT 1`
    ).bind(protocolo).first<Record<string, unknown>>()

    if (!feedback) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Manifestacao nao encontrada'
      }
    }

    return {
      success: true,
      feedback: {
        ...feedback,
        anonimo: Boolean(feedback.anonimo)
      }
    }
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao consultar manifestacao'
    }
  }
})
