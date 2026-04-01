import { supabase } from '@/lib/supabase'

function urgencyBadge(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now()
  const days = diff / (1000 * 60 * 60 * 24)
  if (days < 1) return { label: 'Hoje!', cls: 'bg-red-100 text-red-700' }
  if (days < 3) return { label: `${Math.ceil(days)}d`, cls: 'bg-orange-100 text-orange-700' }
  return { label: `${Math.ceil(days)}d`, cls: 'bg-gray-100 text-gray-600' }
}

export default async function HomeworkPage() {
  const { data: homework } = await supabase
    .from('homework')
    .select('*')
    .order('deadline')

  const upcoming = homework?.filter((hw: any) => new Date(hw.deadline) >= new Date()) ?? []
  const past = homework?.filter((hw: any) => new Date(hw.deadline) < new Date()) ?? []

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Pendentes</h2>
        {upcoming.length > 0 ? (
          <ul className="space-y-3">
            {upcoming.map((hw: any) => {
              const badge = urgencyBadge(hw.deadline)
              return (
                <li key={hw.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{hw.title}</p>
                      <p className="text-sm text-blue-600 font-medium">{hw.subject}</p>
                      {hw.description && (
                        <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">{hw.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${badge.cls}`}>
                        {badge.label}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(hw.deadline).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">Nenhuma tarefa pendente.</p>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-400 mb-3">Anteriores</h2>
          <ul className="space-y-2 opacity-60">
            {past.map((hw: any) => (
              <li key={hw.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between">
                <div>
                  <p className="font-medium text-gray-600 line-through">{hw.title}</p>
                  <p className="text-sm text-gray-400">{hw.subject}</p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(hw.deadline).toLocaleDateString('pt-BR')}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
