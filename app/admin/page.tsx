import { supabase } from '@/lib/supabase'
import AdminPanel from '@/components/AdminPanel'

export default async function AdminPage() {
  const [{ data: schedule }, { data: homework }, { data: files }, { data: news }] = await Promise.all([
    supabase.from('schedule').select('*').order('day_of_week').order('start_time'),
    supabase.from('homework').select('*').order('deadline'),
    supabase.from('files').select('*').order('file_date', { ascending: false }),
    supabase.from('news').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Painel Admin</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>Gerencie o conteúdo do dashboard</p>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="text-sm px-3 py-1.5 rounded-lg transition-all font-medium"
            style={{ color: 'var(--text-2)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            Sair
          </button>
        </form>
      </div>
      <AdminPanel
        initialSchedule={schedule ?? []}
        initialHomework={homework ?? []}
        initialFiles={files ?? []}
        initialNews={news ?? []}
      />
    </div>
  )
}
