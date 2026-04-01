import { supabase } from '@/lib/supabase'
import AdminPanel from '@/components/AdminPanel'

export default async function AdminPage() {
  const [
    { data: schedule },
    { data: homework },
    { data: todos },
    { data: news },
  ] = await Promise.all([
    supabase.from('schedule').select('*').order('day_of_week').order('start_time'),
    supabase.from('homework').select('*').order('deadline'),
    supabase.from('todos').select('*').order('created_at'),
    supabase.from('news').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
        <LogoutButton />
      </div>
      <AdminPanel
        initialSchedule={schedule ?? []}
        initialHomework={homework ?? []}
        initialTodos={todos ?? []}
        initialNews={news ?? []}
      />
    </div>
  )
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button
        type="submit"
        className="text-sm text-gray-400 hover:text-red-500 transition"
      >
        Sair
      </button>
    </form>
  )
}
