import type { H3Event } from 'h3'

type D1Result<T> = {
  results: T[]
}

type D1Statement = {
  bind: (...values: unknown[]) => D1Statement
  run: () => Promise<unknown>
  first: <T>() => Promise<T | null>
  all: <T>() => Promise<D1Result<T>>
}

export type D1Database = {
  prepare: (query: string) => D1Statement
}

type CloudflareEventContext = {
  cloudflare?: {
    env?: {
      DB?: D1Database
    }
  }
}

export const getDb = (event: H3Event): D1Database => {
  const context = event.context as CloudflareEventContext
  const db = context.cloudflare?.env?.DB

  if (!db) {
    throw new Error('D1 binding DB nao configurado. Verifique o wrangler.jsonc e o deploy na Cloudflare.')
  }

  return db
}

type TableColumn = {
  name: string
}

export const ensureFeedbackTable = async (db: D1Database) => {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      tipo_servico TEXT NOT NULL DEFAULT '',
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

  const columns = await db.prepare('PRAGMA table_info(feedbacks)').all<TableColumn>()
  const hasTipoServico = columns.results.some(column => column.name === 'tipo_servico')

  if (!hasTipoServico) {
    await db.prepare("ALTER TABLE feedbacks ADD COLUMN tipo_servico TEXT NOT NULL DEFAULT ''").run()
  }
}