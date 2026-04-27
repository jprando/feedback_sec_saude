import { getPool } from '../utils/db'

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
    const pool = getPool()
    await pool.query(`ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS regiao VARCHAR(100) NOT NULL DEFAULT ''`)
    await pool.query(`ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS unidade VARCHAR(255) NOT NULL DEFAULT ''`)
    await pool.query(`ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS nota INTEGER NOT NULL DEFAULT 0`)

    const { rows } = await pool.query(
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
      WHERE protocolo = $1
      LIMIT 1`,
      [protocolo]
    )

    if (!rows.length) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Manifestacao nao encontrada'
      }
    }

    return {
      success: true,
      feedback: rows[0]
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
