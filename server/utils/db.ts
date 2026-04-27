import { Pool } from 'pg'

type GlobalDb = typeof globalThis & {
  __feedbackPool?: Pool
}

const getDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL?.trim()

  if (!databaseUrl) {
    throw new Error('DATABASE_URL nao configurada')
  }

  return databaseUrl
}

export const getPool = () => {
  const globalDb = globalThis as GlobalDb

  if (!globalDb.__feedbackPool) {
    globalDb.__feedbackPool = new Pool({
      connectionString: getDatabaseUrl(),
      ssl: {
        rejectUnauthorized: false
      }
    })
  }

  return globalDb.__feedbackPool
}