import AdminPanel from '@/components/AdminPanel'
import { requireAdminPage } from '@/lib/admin-auth'
import { supabase } from '@/lib/supabase'
import type { FileItem, HomeworkItem, NewsItem, ScheduleItem, TodoItem } from '@/lib/types'

export default async function AdminPage() {
  const user = await requireAdminPage()

  const [
    { data: scheduleData },
    { data: homeworkData },
    { data: filesData },
    { data: newsData },
    { data: todosData },
  ] = await Promise.all([
    supabase.from('schedule').select('*').order('day_of_week').order('start_time'),
    supabase.from('homework').select('*').order('deadline'),
    supabase.from('files').select('*').order('file_date', { ascending: false }),
    supabase.from('news').select('*').order('created_at', { ascending: false }),
    supabase.from('todos').select('*').order('created_at'),
  ])

  return (
    <div className="space-y-6">
      <section className="panel flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.34em] text-[var(--text-3)]">
            Painel administrativo
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">Gerencie o dashboard</h1>
          <p className="mt-2 text-sm text-[var(--text-2)]">
            Logado como {user.email ?? 'admin'}.
          </p>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="button-secondary px-4 py-2 text-sm">
            Sair
          </button>
        </form>
      </section>

      <AdminPanel
        initialSchedule={(scheduleData ?? []) as ScheduleItem[]}
        initialHomework={(homeworkData ?? []) as HomeworkItem[]}
        initialFiles={(filesData ?? []) as FileItem[]}
        initialNews={(newsData ?? []) as NewsItem[]}
        initialTodos={(todosData ?? []) as TodoItem[]}
      />
    </div>
  )
}
