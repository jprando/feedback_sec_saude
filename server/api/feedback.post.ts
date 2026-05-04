import { ensureFeedbackTable, getDb } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const db = getDb(event)
    const body = await readBody(event)
    console.log('POST /api/feedback body:', body)

    const protocolo = `FB-${Date.now()}`

    await ensureFeedbackTable(db)

    await db.prepare(
      `INSERT INTO feedbacks 
      (tipo, tipo_servico, regiao, unidade, nota, descricao, nome, telefone, email, anonimo, protocolo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        body.tipo,
        body.tipoServico,
        body.regiao,
        body.unidade,
        body.nota,
        body.descricao,
        body.nome,
        body.telefone,
        body.email,
        body.anonimo ? 1 : 0,
        protocolo
      ).run()

    return {
      success: true,
      protocolo
    }

  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao salvar feedback'
    }
  }
})
