
 ⛅️ wrangler 4.86.0 (update available 4.93.1)
─────────────────────────────────────────────
Resource location: remote 

🌀 Executing on remote database feedback_db (aaf50009-6a66-4529-81eb-24f551d10355):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 command in 0.14ms
[
  {
    "results": [
      {
        "sql": "CREATE TABLE _cf_KV (\n        key TEXT PRIMARY KEY,\n        value BLOB\n      ) WITHOUT ROWID"
      },
      {
        "sql": "CREATE TABLE feedbacks (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  tipo TEXT NOT NULL,\n  regiao TEXT NOT NULL,\n  unidade TEXT NOT NULL,\n  nota INTEGER NOT NULL DEFAULT 0,\n  descricao TEXT NOT NULL,\n  nome TEXT,\n  telefone TEXT,\n  email TEXT,\n  anonimo INTEGER NOT NULL DEFAULT 0,\n  protocolo TEXT NOT NULL UNIQUE,\n  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP\n, tipo_servico TEXT NOT NULL DEFAULT '')"
      },
      {
        "sql": "CREATE TABLE sqlite_sequence(name,seq)"
      }
    ],
    "success": true,
    "meta": {
      "served_by": "v3-prod",
      "served_by_region": "WNAM",
      "served_by_colo": "DFW",
      "served_by_primary": true,
      "timings": {
        "sql_duration_ms": 0.1351
      },
      "duration": 0.1351,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 24576,
      "rows_read": 4,
      "rows_written": 0,
      "total_attempts": 1
    }
  }
]
