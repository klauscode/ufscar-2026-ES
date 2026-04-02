import HomeworkBoard from '@/components/HomeworkBoard'
import { supabase } from '@/lib/supabase'
import type { HomeworkItem } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function HomeworkPage() {
  const { data } = await supabase.from('homework').select('*').order('deadline')
  const homework: HomeworkItem[] = data ?? []
  const nowIso = new Date().toISOString()

  return (
    <div className="space-y-6">
      <header className="panel px-6 py-6">
        <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">Tarefas</h1>
      </header>

      <HomeworkBoard items={homework} nowIso={nowIso} />
    </div>
  )
}
