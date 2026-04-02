import HomeworkBoard from '@/components/HomeworkBoard'
import { supabase } from '@/lib/supabase'
import type { HomeworkItem } from '@/lib/types'

export default async function HomeworkPage() {
  const { data } = await supabase.from('homework').select('*').order('deadline')
  const homework: HomeworkItem[] = data ?? []
  const nowIso = new Date().toISOString()

  return (
    <div className="space-y-6">
      <header className="panel px-6 py-6">
        <p className="font-display text-xs uppercase tracking-[0.34em] text-[var(--text-3)]">
          Entregas
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">Tarefas da turma</h1>
        <p className="mt-2 text-sm text-[var(--text-2)]">
          Clique em uma tarefa para abrir a descricao renderizada com markdown.
        </p>
      </header>

      <HomeworkBoard items={homework} nowIso={nowIso} />
    </div>
  )
}
