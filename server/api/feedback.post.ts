import { getDb } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const db = getDb(event)
    const body = await readBody(event)
    console.log('POST /api/feedback body:', body)

    const protocolo = `FB-${Date.now()}`

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        regiao TEXT NOT NULL DEFAULT '',
        unidade TEXT NOT NULL DEFAULT '',
        nota INTEGER NOT NULL DEFAULT 0,
        descricao TEXT NOT NULL,
        nome TEXT,
        telefone TEXT,
        email TEXT,
        anonimo INTEGER NOT NULL DEFAULT 0,
        protocolo TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    await db.prepare(
      `INSERT INTO feedbacks 
      (tipo, regiao, unidade, nota, descricao, nome, telefone, email, anonimo, protocolo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        body.tipo,
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
