import { supabase } from '@/lib/supabase'

function urgencyInfo(deadline: string) {
  const days = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  if (days < 1) return { label: 'Hoje!', bar: 'bg-red-500', badge: 'bg-red-50 text-red-600 border-red-200' }
  if (days < 3) return { label: `${Math.ceil(days)} dias`, bar: 'bg-orange-400', badge: 'bg-orange-50 text-orange-600 border-orange-200' }
  return { label: `${Math.ceil(days)} dias`, bar: 'bg-indigo-400', badge: 'bg-indigo-50 text-indigo-600 border-indigo-200' }
}

export default async function HomeworkPage() {
  const { data: homework } = await supabase.from('homework').select('*').order('deadline')
  const upcoming = homework?.filter((hw: any) => new Date(hw.deadline) >= new Date()) ?? []
  const past = homework?.filter((hw: any) => new Date(hw.deadline) < new Date()) ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
        <p className="text-gray-500 text-sm mt-1">{upcoming.length} pendente{upcoming.length !== 1 ? 's' : ''}</p>
      </div>

      <section className="space-y-3">
        {upcoming.length > 0 ? upcoming.map((hw: any) => {
          const { label, bar, badge } = urgencyInfo(hw.deadline)
          return (
            <div key={hw.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`h-1 ${bar}`} />
              <div className="px-6 py-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{hw.title}</p>
                  <p className="text-xs font-medium text-indigo-500 mt-0.5">{hw.subject}</p>
                  {hw.description && (
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{hw.description}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${badge}`}>
                    {label}
                  </span>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {new Date(hw.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-12 text-center">
            <p className="text-3xl mb-2">🎉</p>
            <p className="font-semibold text-gray-700">Sem tarefas pendentes!</p>
            <p className="text-sm text-gray-400 mt-1">Aproveite enquanto dura.</p>
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Anteriores</h2>
          <div className="space-y-2">
            {past.map((hw: any) => (
              <div key={hw.id} className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex justify-between items-center opacity-50">
                <div>
                  <p className="text-sm font-medium text-gray-600 line-through">{hw.title}</p>
                  <p className="text-xs text-gray-400">{hw.subject}</p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(hw.deadline).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
