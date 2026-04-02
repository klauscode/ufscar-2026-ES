# Coursemate Dashboard

Dashboard da turma de Educacao Especial 2026 da UFSCar.

## O que existe

- Pagina inicial com resumo da semana
- Grade de horarios
- Lista de tarefas com prazos
- Arquivos por materia
- Avisos da turma
- Painel admin para atualizar tudo

## Stack

- Next.js App Router
- Supabase
- Tailwind CSS v4

## Ambiente

Crie um arquivo `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CLASS_PASSWORD=
```

Tambem existe um `.env.example` com placeholders.

## Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Banco

1. Crie um projeto no Supabase.
2. Rode `supabase-setup.sql` no SQL Editor.
3. Configure as variaveis de ambiente acima.

## Admin

- A rota `/enter` libera o acesso publico da turma via `CLASS_PASSWORD`.
- A rota `/admin/login` usa email e senha do Supabase Auth.
- As rotas `/api/admin/*` validam a sessao admin antes de usar o service role.

## Scripts

Os scripts em `scripts/` usam `.env.local` ou `.env` automaticamente:

- `scripts/add-files-table.mjs`
- `scripts/seed-schedule.mjs`

## Qualidade

Antes de subir mudancas:

```bash
npm run lint
npm run build
```
