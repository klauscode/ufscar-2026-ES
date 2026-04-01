import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const DAY_NAMES = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
const COLORS = ['#6366f1','#8b5cf6','#0ea5e9','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6']

function subjectColor(s: string) {
  let h = 0; for (const c of s) h = c.charCodeAt(0) + ((h << 5) - h)
  return COLORS[Math.abs(h) % COLORS.length]
}

function daysUntil(d: string) {
  return (new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
}

function getNextClass(allSlots: any[], dow: number) {
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()

  // Remaining today
  const todayNext = allSlots
    .filter(s => s.day_of_week === dow)
    .filter(s => { const [h, m] = s.start_time.split(':').map(Number); return h * 60 + m > nowMin })
    .sort((a, b) => a.start_time.localeCompare(b.start_time))[0]

  if (todayNext) return { ...todayNext, label: 'Hoje' }

  // Next days this week
  for (let i = 1; i <= 6; i++) {
    const next = (dow + i) % 7
    const classes = allSlots
      .filter(s => s.day_of_week === next)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
    if (classes.length > 0) return { ...classes[0], label: DAY_NAMES[next] }
  }
  return null
}

export default async function HomePage() {
  const today = new Date()
  const dow = today.getDay() === 0 ? 6 : today.getDay() - 1

  const [{ data: allSlots }, { data: homework }, { data: news }] = await Promise.all([
    supabase.from('schedule').select('*').order('day_of_week').order('start_time'),
    supabase.from('homework').select('*').gte('deadline', new Date().toISOString()).order('deadline').limit(4),
    supabase.from('news').select('*').eq('pinned', true).order('created_at', { ascending: false }).limit(1),
  ])

  const todaySlots = allSlots?.filter(s => s.day_of_week === dow) ?? []
  const nextClass = allSlots ? getNextClass(allSlots, dow) : null
  const nextColor = nextClass ? subjectColor(nextClass.subject) : '#6366f1'

  return (
    <div className="space-y-4">

      {/* Date header */}
      <div className="flex items-baseline justify-between pt-2 pb-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
            {today.toLocaleDateString('pt-BR', { weekday: 'long' })}
          </p>
          <p className="text-2xl font-bold mt-0.5" style={{ color: 'var(--text)' }}>
            {today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {homework && homework.length > 0 && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
            {homework.length} tarefa{homework.length !== 1 ? 's' : ''} pendente{homework.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Pinned news banner */}
      {news && news[0] && (
        <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3" style={{ boxShadow: 'var(--shadow)' }}>
          <span className="text-base shrink-0">📌</span>
          <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{news[0].title}</p>
          <Link href="/news" className="text-xs shrink-0 font-medium" style={{ color: 'var(--accent)' }}>Ver →</Link>
        </div>
      )}

      {/* Next class — spotlight card */}
      {nextClass ? (
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{ boxShadow: `0 0 0 1px ${nextColor}22, 0 20px 60px ${nextColor}18` }}
        >
          {/* Glow background */}
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 20% 50%, ${nextColor}18 0%, transparent 60%)` }} />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${nextColor}30, transparent 70%)`, transform: 'translate(30%, -30%)' }} />

          <div className="glass relative rounded-3xl p-7" style={{ boxShadow: 'none', border: `1px solid ${nextColor}22` }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: nextColor }}>
                  Próxima Aula · {nextClass.label}
                </p>
                <h2 className="text-2xl font-bold leading-snug" style={{ color: 'var(--text)' }}>
                  {nextClass.subject}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl" style={{ background: `${nextColor}15`, color: nextColor }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {nextClass.start_time?.slice(0,5)} – {nextClass.end_time?.slice(0,5)}
                  </span>
                  {nextClass.room && (
                    <span className="text-sm font-medium px-3 py-1.5 rounded-xl" style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                      {nextClass.room}
                    </span>
                  )}
                </div>
                {nextClass.professor && (
                  <p className="text-sm mt-3" style={{ color: 'var(--text-3)' }}>{nextClass.professor}</p>
                )}
              </div>

              {/* Time blob */}
              <div className="shrink-0 text-right hidden sm:block">
                <p className="text-5xl font-bold tabular-nums leading-none" style={{ color: nextColor }}>
                  {nextClass.start_time?.slice(0,5)}
                </p>
                <p className="text-xs mt-1 font-medium" style={{ color: 'var(--text-3)' }}>início</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-3xl px-7 py-8 text-center" style={{ boxShadow: 'var(--shadow)' }}>
          <p className="text-3xl mb-2">🎓</p>
          <p className="font-semibold" style={{ color: 'var(--text)' }}>Sem aulas programadas</p>
        </div>
      )}

      {/* Bento row: today's classes + upcoming homework */}
      <div className="grid gap-4 md:grid-cols-5">

        {/* Today's full schedule — 2 cols */}
        <div className="md:col-span-2 glass rounded-2xl overflow-hidden lift" style={{ boxShadow: 'var(--shadow)' }}>
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Hoje</p>
            <Link href="/schedule" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Grade →</Link>
          </div>
          {todaySlots.length > 0 ? todaySlots.map(s => {
            const color = subjectColor(s.subject)
            return (
              <div key={s.id} className="px-5 py-3.5 flex items-center gap-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div className="w-1 h-9 rounded-full shrink-0" style={{ background: color }} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{s.subject}</p>
                  <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-3)' }}>
                    {s.start_time?.slice(0,5)}–{s.end_time?.slice(0,5)}{s.room ? ` · ${s.room}` : ''}
                  </p>
                </div>
              </div>
            )
          }) : (
            <p className="px-5 py-6 text-sm" style={{ color: 'var(--text-3)' }}>Sem aulas hoje.</p>
          )}
        </div>

        {/* Homework — 3 cols */}
        <div className="md:col-span-3 glass rounded-2xl overflow-hidden lift" style={{ boxShadow: 'var(--shadow)' }}>
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Tarefas</p>
            <Link href="/homework" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Ver tudo →</Link>
          </div>
          {homework && homework.length > 0 ? homework.map(hw => {
            const d = daysUntil(hw.deadline)
            const urgent = d < 1
            const soon = d < 3
            return (
              <div key={hw.id} className="px-5 py-3.5 flex items-center justify-between gap-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: urgent ? '#ef4444' : soon ? '#f97316' : 'var(--text-3)' }} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{hw.title}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--accent)' }}>{hw.subject}</p>
                  </div>
                </div>
                <span className="text-xs font-bold shrink-0 px-2.5 py-1 rounded-full"
                  style={{
                    background: urgent ? '#fef2f2' : soon ? '#fff7ed' : 'var(--surface-2)',
                    color: urgent ? '#ef4444' : soon ? '#f97316' : 'var(--text-3)',
                  }}>
                  {urgent ? 'Hoje!' : `${Math.ceil(d)}d`}
                </span>
              </div>
            )
          }) : (
            <div className="px-5 py-8 text-center">
              <p className="text-2xl mb-1">✅</p>
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>Tudo em dia!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
