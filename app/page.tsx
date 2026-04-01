import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function daysUntil(d: string) {
  return (new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
}

function Badge({ deadline }: { deadline: string }) {
  const d = daysUntil(deadline)
  if (d < 1) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Hoje</span>
  if (d < 3) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">{Math.ceil(d)}d</span>
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-3)' }}>{Math.ceil(d)}d</span>
}

export default async function HomePage() {
  const today = new Date()
  const dow = today.getDay() === 0 ? 6 : today.getDay() - 1
  const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  const [{ data: schedule }, { data: homework }, { data: news }] = await Promise.all([
    supabase.from('schedule').select('*').eq('day_of_week', dow).order('start_time'),
    supabase.from('homework').select('*').gte('deadline', new Date().toISOString()).order('deadline').limit(4),
    supabase.from('news').select('*').eq('pinned', true).order('created_at', { ascending: false }).limit(2),
  ])

  return (
    <div className="space-y-5">

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden p-8" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%)', boxShadow: '0 8px 40px rgba(79,70,229,0.35)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(30%, -40%)' }} />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(-50%, 40%)' }} />
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium mb-1">
            {today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-3xl font-bold text-white">Olá, Turma! 👋</h1>
          <p className="text-indigo-300 text-sm mt-1">Educação Especial · UFSCar 2026</p>
        </div>
        <div className="relative z-10 flex gap-4 mt-6">
          <div className="rounded-xl px-4 py-3 text-center" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
            <p className="text-2xl font-bold text-white">{schedule?.length ?? 0}</p>
            <p className="text-xs text-indigo-200">aula{schedule?.length !== 1 ? 's' : ''} hoje</p>
          </div>
          <div className="rounded-xl px-4 py-3 text-center" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
            <p className="text-2xl font-bold text-white">{homework?.length ?? 0}</p>
            <p className="text-xs text-indigo-200">tarefa{homework?.length !== 1 ? 's' : ''} pendente{homework?.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Pinned news */}
      {news && news.map((n: any) => (
        <div key={n.id} className="flex gap-3 rounded-2xl px-5 py-4 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
          <span className="text-lg shrink-0">📌</span>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{n.title}</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>{n.body}</p>
          </div>
        </div>
      ))}

      {/* Bento grid */}
      <div className="grid gap-5 md:grid-cols-2">

        {/* Today's classes */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <span className="text-base">🗓</span>
              <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Aulas — {dayNames[dow]}</span>
            </div>
            <Link href="/schedule" className="text-xs font-medium transition-all" style={{ color: 'var(--accent)' }}>Ver tudo →</Link>
          </div>
          <div>
            {schedule && schedule.length > 0 ? schedule.map((s: any) => (
              <div key={s.id} className="px-5 py-3.5 flex items-center gap-4 border-b last:border-0 transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="shrink-0 text-center w-12">
                  <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{s.start_time?.slice(0,5)}</p>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>{s.end_time?.slice(0,5)}</p>
                </div>
                <div className="w-px h-8 rounded-full" style={{ background: 'var(--border)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.subject}</p>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>{[s.room, s.professor].filter(Boolean).join(' · ')}</p>
                </div>
              </div>
            )) : (
              <p className="px-5 py-8 text-sm text-center" style={{ color: 'var(--text-3)' }}>Sem aulas hoje.</p>
            )}
          </div>
        </div>

        {/* Upcoming homework */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <span className="text-base">📚</span>
              <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Próximas Tarefas</span>
            </div>
            <Link href="/homework" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Ver tudo →</Link>
          </div>
          <div>
            {homework && homework.length > 0 ? homework.map((hw: any) => (
              <div key={hw.id} className="px-5 py-3.5 flex items-center justify-between gap-3 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{hw.title}</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--accent)' }}>{hw.subject}</p>
                </div>
                <Badge deadline={hw.deadline} />
              </div>
            )) : (
              <div className="px-5 py-8 text-center">
                <p className="text-2xl mb-1">🎉</p>
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>Sem tarefas pendentes!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
