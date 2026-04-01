import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function daysUntil(deadline: string) {
  return (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
}

function DeadlineBadge({ deadline }: { deadline: string }) {
  const days = daysUntil(deadline)
  if (days < 1) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Hoje!</span>
  if (days < 3) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">{Math.ceil(days)}d</span>
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{Math.ceil(days)}d</span>
}

export default async function HomePage() {
  const today = new Date()
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1

  const [{ data: schedule }, { data: homework }, { data: news }] = await Promise.all([
    supabase.from('schedule').select('*').eq('day_of_week', dayOfWeek).order('start_time'),
    supabase.from('homework').select('*').gte('deadline', new Date().toISOString()).order('deadline').limit(5),
    supabase.from('news').select('*').eq('pinned', true).order('created_at', { ascending: false }).limit(3),
  ])

  const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="rounded-2xl p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }} />
        <p className="text-indigo-200 text-sm font-medium mb-1">
          {today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-3xl font-bold">Olá, Turma!</h1>
        <p className="text-indigo-200 mt-1 text-sm">Engenharia de Software · UFSCar 2026</p>
      </div>

      {/* Pinned news */}
      {news && news.length > 0 && (
        <section>
          {news.map((n: any) => (
            <div key={n.id} className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-3">
              <span className="text-amber-400 text-lg mt-0.5">📌</span>
              <div>
                <p className="font-semibold text-amber-900">{n.title}</p>
                <p className="text-sm text-amber-700 mt-0.5">{n.body}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      <div className="grid gap-6 md:grid-cols-2">

        {/* Today's classes */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Aulas hoje — {dayNames[dayOfWeek]}</h2>
            <Link href="/schedule" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">Ver tudo →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {schedule && schedule.length > 0 ? schedule.map((s: any) => (
              <div key={s.id} className="px-6 py-4 flex items-center gap-4">
                <div className="text-center min-w-[48px]">
                  <p className="text-xs font-bold text-indigo-600">{s.start_time?.slice(0, 5)}</p>
                  <p className="text-xs text-gray-400">{s.end_time?.slice(0, 5)}</p>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">{s.subject}</p>
                  <p className="text-xs text-gray-400">{[s.room, s.professor].filter(Boolean).join(' · ')}</p>
                </div>
              </div>
            )) : (
              <p className="px-6 py-6 text-sm text-gray-400">Sem aulas hoje.</p>
            )}
          </div>
        </section>

        {/* Upcoming homework */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Próximas tarefas</h2>
            <Link href="/homework" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">Ver tudo →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {homework && homework.length > 0 ? homework.map((hw: any) => (
              <div key={hw.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{hw.title}</p>
                  <p className="text-xs text-indigo-500">{hw.subject}</p>
                </div>
                <DeadlineBadge deadline={hw.deadline} />
              </div>
            )) : (
              <p className="px-6 py-6 text-sm text-gray-400">Nenhuma tarefa pendente.</p>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
