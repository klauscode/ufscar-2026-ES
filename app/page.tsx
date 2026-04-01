import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function urgencyColor(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now()
  const days = diff / (1000 * 60 * 60 * 24)
  if (days < 1) return 'text-red-600 font-bold'
  if (days < 3) return 'text-orange-500 font-semibold'
  return 'text-gray-600'
}

export default async function HomePage() {
  const today = new Date()
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1 // Mon=0

  const [{ data: schedule }, { data: homework }, { data: news }] = await Promise.all([
    supabase
      .from('schedule')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .order('start_time'),
    supabase
      .from('homework')
      .select('*')
      .gte('deadline', new Date().toISOString())
      .order('deadline')
      .limit(5),
    supabase
      .from('news')
      .select('*')
      .eq('pinned', true)
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Olá, Turma!</h1>

      {/* Today's schedule */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Aulas hoje — {dayNames[dayOfWeek]}
        </h2>
        {schedule && schedule.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {schedule.map((s: any) => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <p className="font-semibold text-blue-700">{s.subject}</p>
                <p className="text-sm text-gray-500">
                  {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)}
                </p>
                {s.room && <p className="text-sm text-gray-400">{s.room}</p>}
                {s.professor && <p className="text-sm text-gray-400">{s.professor}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Sem aulas hoje.</p>
        )}
        <Link href="/schedule" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
          Ver grade completa →
        </Link>
      </section>

      {/* Upcoming homework */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Próximas tarefas</h2>
        {homework && homework.length > 0 ? (
          <ul className="space-y-2">
            {homework.map((hw: any) => (
              <li key={hw.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">{hw.title}</p>
                  <p className="text-sm text-gray-500">{hw.subject}</p>
                </div>
                <span className={`text-sm ${urgencyColor(hw.deadline)}`}>
                  {new Date(hw.deadline).toLocaleDateString('pt-BR')}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">Nenhuma tarefa pendente.</p>
        )}
        <Link href="/homework" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
          Ver todas as tarefas →
        </Link>
      </section>

      {/* Pinned news */}
      {news && news.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Avisos fixados</h2>
          <div className="space-y-3">
            {news.map((n: any) => (
              <div key={n.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="font-semibold text-yellow-800">{n.title}</p>
                <p className="text-sm text-yellow-700 mt-1 whitespace-pre-wrap">{n.body}</p>
              </div>
            ))}
          </div>
          <Link href="/news" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
            Ver todos os avisos →
          </Link>
        </section>
      )}
    </div>
  )
}
