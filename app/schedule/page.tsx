import { supabase } from '@/lib/supabase'

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default async function SchedulePage() {
  const { data: slots } = await supabase
    .from('schedule')
    .select('*')
    .order('day_of_week')
    .order('start_time')

  // Group by day
  const byDay: Record<number, any[]> = {}
  for (let i = 0; i < 6; i++) byDay[i] = []
  slots?.forEach((s: any) => {
    if (byDay[s.day_of_week] !== undefined) byDay[s.day_of_week].push(s)
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Grade de Horários</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DAYS.map((day, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-2 font-semibold text-sm">
              {day}
            </div>
            <div className="divide-y divide-gray-100">
              {byDay[i].length > 0 ? (
                byDay[i].map((s: any) => (
                  <div key={s.id} className="px-4 py-3">
                    <p className="font-medium text-gray-800">{s.subject}</p>
                    <p className="text-xs text-gray-500">
                      {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)}
                    </p>
                    {s.room && <p className="text-xs text-gray-400">{s.room}</p>}
                    {s.professor && <p className="text-xs text-gray-400">{s.professor}</p>}
                  </div>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-gray-400">Sem aulas</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
