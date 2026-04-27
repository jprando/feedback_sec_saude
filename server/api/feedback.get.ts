import { getDb } from '../utils/db'

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

    const feedback = await db.prepare(
      `SELECT
        id,
        tipo,
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
