import { supabase } from '@/lib/supabase'

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const COLORS = [
  'bg-indigo-500', 'bg-violet-500', 'bg-blue-500',
  'bg-cyan-500', 'bg-emerald-500', 'bg-rose-500',
  'bg-amber-500', 'bg-pink-500', 'bg-teal-500',
]

function subjectColor(subject: string) {
  let hash = 0
  for (const c of subject) hash = c.charCodeAt(0) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

export default async function SchedulePage() {
  const { data: slots } = await supabase
    .from('schedule').select('*').order('day_of_week').order('start_time')

  const byDay: Record<number, any[]> = {}
  for (let i = 0; i < 6; i++) byDay[i] = []
  slots?.forEach((s: any) => { if (byDay[s.day_of_week] !== undefined) byDay[s.day_of_week].push(s) })

  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grade de Horários</h1>
        <p className="text-gray-500 text-sm mt-1">Semana letiva · Educação Especial</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DAYS.map((day, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition ${
              i === today ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-100'
            }`}
          >
            <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
              <span className="font-semibold text-gray-800 text-sm">{day}</span>
              {i === today && (
                <span className="text-xs bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">Hoje</span>
              )}
            </div>
            <div className="divide-y divide-gray-50">
              {byDay[i].length > 0 ? byDay[i].map((s: any) => (
                <div key={s.id} className="px-5 py-3 flex items-center gap-3">
                  <div className={`w-1.5 h-10 rounded-full ${subjectColor(s.subject)}`} />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{s.subject}</p>
                    <p className="text-xs text-gray-400">
                      {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)}
                      {s.room ? ` · ${s.room}` : ''}
                    </p>
                    {s.professor && <p className="text-xs text-gray-400">{s.professor}</p>}
                  </div>
                </div>
              )) : (
                <p className="px-5 py-4 text-sm text-gray-400">Sem aulas</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
