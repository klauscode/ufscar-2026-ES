# Setup Guide — Dashboard da Turma

## What you need before starting
- A free GitHub account → github.com
- A free Supabase account → supabase.com
- A free Vercel account → vercel.com
- Node.js installed → nodejs.org (LTS version)

---

## Step 1 — Supabase (database)

1. Go to **supabase.com** → New project → give it a name → choose a region (South America if available, or US East)
2. Once created, go to **SQL Editor** → New query
3. Paste the entire contents of `supabase-setup.sql` → click **Run**
4. Go to **Settings → API** → copy:
   - `Project URL` → this is your `SUPABASE_URL`
   - `anon public` key → this is your `SUPABASE_ANON_KEY`
   - `service_role` key → this is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)
5. Go to **Authentication → Users** → click **Invite user** → enter the admin's email
6. The admin will receive an email to set their password

---

## Step 2 — GitHub

1. Go to **github.com** → New repository → name it `coursemate-dashboard` → Create
2. In your terminal, inside the project folder, run:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/coursemate-dashboard.git
   git push -u origin main
   ```

---

## Step 3 — Vercel (hosting)

1. Go to **vercel.com** → Add New Project → Import your GitHub repository
2. Before deploying, click **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | (paste from Supabase) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (paste from Supabase) |
   | `SUPABASE_SERVICE_ROLE_KEY` | (paste from Supabase) |
   | `CLASS_PASSWORD` | `turma2026` (or any password you choose) |

3. Click **Deploy** → wait ~60 seconds
4. Your site is live at `coursemate-dashboard.vercel.app` (or similar)

---

## Step 4 — Share with the class

Send this to your coursemates:
- **Link:** `https://coursemate-dashboard.vercel.app`
- **Senha:** `turma2026` (or whatever you set as CLASS_PASSWORD)

---

## How to update content (admin)

1. Go to `https://coursemate-dashboard.vercel.app/admin`
2. Log in with your email and password (set up in Supabase step 5)
3. Use the tabs to add/remove content:
   - **Horários** — add or remove classes from the weekly schedule
   - **Tarefas** — add homework with deadlines, remove when done
   - **To-do** — manage the shared class checklist
   - **Avisos** — post announcements, pin important ones

---

## How to update the class password

1. Go to **vercel.com** → your project → Settings → Environment Variables
2. Edit `CLASS_PASSWORD` → save
3. Vercel will redeploy automatically

---

## Updating the site code

Any time you push to GitHub (`git push`), Vercel redeploys automatically within ~60 seconds.
