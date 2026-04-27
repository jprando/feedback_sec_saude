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