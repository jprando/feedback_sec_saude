import { getPool } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const pool = getPool()
    const body = await readBody(event)
    console.log('POST /api/feedback body:', body)

    const protocolo = `FB-${Date.now()}`

    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL,
        regiao VARCHAR(100) NOT NULL DEFAULT '',
        unidade VARCHAR(255) NOT NULL DEFAULT '',
        nota INTEGER NOT NULL DEFAULT 0,
        descricao TEXT NOT NULL,
        nome VARCHAR(255),
        telefone VARCHAR(50),
        email VARCHAR(255),
        anonimo BOOLEAN NOT NULL DEFAULT FALSE,
        protocolo VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await pool.query(`ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS regiao VARCHAR(100) NOT NULL DEFAULT ''`)
    await pool.query(`ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS unidade VARCHAR(255) NOT NULL DEFAULT ''`)
    await pool.query(`ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS nota INTEGER NOT NULL DEFAULT 0`)

    await pool.query(
      `INSERT INTO feedbacks 
      (tipo, regiao, unidade, nota, descricao, nome, telefone, email, anonimo, protocolo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        body.tipo,
        body.regiao,
        body.unidade,
        body.nota,
        body.descricao,
        body.nome,
        body.telefone,
        body.email,
        body.anonimo,
        protocolo
      ]
    )

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
