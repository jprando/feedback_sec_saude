# Sistema de Ouvidoria / Feedback

Aplicacao web para registro e acompanhamento de manifestacoes da area da saude no municipio de Domingos Martins.

O projeto foi criado para apoiar uma boa causa: dar voz ao cidadao, facilitar o envio de elogios, sugestoes, reclamacoes e solicitacoes, e fortalecer a escuta da secretaria de saude com mais transparencia e proximidade com a populacao.

## Para que serve

Este sistema permite que qualquer usuario envie uma manifestacao de forma simples, com opcao de anonimato, e receba um protocolo unico para acompanhamento posterior.

Ele serve como um canal digital de ouvidoria, ajudando a organizar o atendimento e a registrar as demandas de forma centralizada.

## Stack

- Nuxt 3
- Vue 3
- TypeScript
- Tailwind CSS
- Nuxt UI
- Cloudflare D1
- Cloudflare Workers
- Node.js

## Funcionalidades

- Registro de manifestacoes
- Envio anonimo opcional
- Geracao automatica de protocolo
- Consulta de manifestacao por protocolo
- Interface responsiva para desktop e mobile

## Como rodar localmente

### Pre-requisitos

- Node.js instalado
- pnpm instalado
- Conta na Cloudflare
- Wrangler CLI (incluido nas dependencias do projeto)

### Passo a passo

1. Clone o repositorio.
2. Instale as dependencias:

```bash
pnpm install
```

3. Faca login no Wrangler:

```bash
pnpm exec wrangler login
```

4. Crie o banco D1:

```bash
pnpm exec wrangler d1 create feedback-db
```

5. Copie o `database_id` retornado e atualize o arquivo `wrangler.jsonc`.

6. Aplique o schema inicial:

```bash
pnpm exec wrangler d1 execute feedback-db --file=./db/init.sql --remote
```

7. Rode a aplicacao localmente:

```bash
pnpm dev
```

A aplicacao ficara disponivel em `http://localhost:3000`.

8. Deploy na Cloudflare Workers:

```bash
pnpm deploy
```

## Variaveis de ambiente

Para o fluxo com D1 + Workers, nao e necessario configurar `DATABASE_URL`.

As configuracoes do banco sao feitas por binding no `wrangler.jsonc`:

- `d1_databases[].binding = "DB"`
- `d1_databases[].database_id = "..."`

Opcionalmente, para automacao CI/CD, voce pode usar variaveis como `CLOUDFLARE_ACCOUNT_ID` e `CLOUDFLARE_API_TOKEN`.

## Banco de dados

O schema do banco esta em `db/init.sql` e pode ser aplicado com `wrangler d1 execute`.

## Estrutura do projeto

- `app/pages/index.vue` - Formulario principal de envio
- `app/pages/acompanhar.vue` - Tela de consulta de protocolo
- `server/api/feedback.post.ts` - Endpoint de criacao de manifestacao
- `server/api/feedback.get.ts` - Endpoint de consulta de manifestacao
- `db/init.sql` - Script de criacao inicial do banco

## Fluxo da aplicacao

1. O usuario acessa o formulario.
2. Preenche a manifestacao e envia.
3. O sistema grava os dados no Cloudflare D1.
4. Um protocolo unico e gerado.
5. O usuario pode acompanhar a manifestacao depois.

## Proposito do projeto

Este sistema foi pensado para contribuir com um atendimento mais humano, organizado e acessivel para a populacao de Domingos Martins.

Mais do que uma plataforma de feedback, ele representa um canal de participacao que ajuda a ouvir melhor a comunidade e apoiar melhorias reais nos servicos publicos.
