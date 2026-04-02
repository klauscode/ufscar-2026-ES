# Setup Guide - Dashboard da Turma

## Antes de comecar

- Conta no GitHub
- Conta no Supabase
- Conta na Vercel
- Node.js LTS

## 1. Supabase

1. Crie um projeto.
2. Abra o SQL Editor.
3. Rode o conteudo de `supabase-setup.sql`.
4. Em `Settings > API`, copie:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`
5. Em `Authentication > Users`, crie ou convide a conta admin.

## 2. Variaveis de ambiente

Crie `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CLASS_PASSWORD=
```

## 3. Rodar localmente

```bash
npm install
npm run dev
```

## 4. Deploy na Vercel

1. Importe o repositorio.
2. Cadastre as mesmas variaveis de ambiente.
3. Faca o deploy.

## 5. Fluxo de uso

- Turma entra por `/enter` com a senha de classe.
- Admin entra por `/admin/login` com email e senha do Supabase.
- Conteudo do dashboard e editado em `/admin`.

## 6. O que o admin pode editar

- Horarios
- Tarefas
- Arquivos
- Avisos

## 7. Atualizacao de conteudo

Sempre que voce fizer `git push`, a Vercel redeploya automaticamente.
