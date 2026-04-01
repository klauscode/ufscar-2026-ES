import { supabase } from '@/lib/supabase'

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const COLORS = ['#4f46e5','#7c3aed','#0891b2','#059669','#d97706','#dc2626','#db2777','#9333ea','#0284c7']

function subjectColor(s: string) {
  let h = 0; for (const c of s) h = c.charCodeAt(0) + ((h << 5) - h)
  return COLORS[Math.abs(h) % COLORS.length]
}

export default async function SchedulePage() {
  const { data: slots } = await supabase.from('schedule').select('*').order('day_of_week').order('start_time')
  const byDay: Record<number, any[]> = {}
  for (let i = 0; i < 6; i++) byDay[i] = []
  slots?.forEach((s: any) => { if (byDay[s.day_of_week] !== undefined) byDay[s.day_of_week].push(s) })
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Grade de Horários</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>Semana letiva · Educação Especial 2026/1</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DAYS.map((day, i) => (
          <div
            key={i}
            className="rounded-2xl border overflow-hidden transition-all"
            style={{
              background: 'var(--surface)',
              borderColor: i === today ? 'var(--accent)' : 'var(--border)',
              boxShadow: i === today ? '0 0 0 1px var(--accent), var(--shadow)' : 'var(--shadow)',
            }}
          >
            <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{day}</span>
              {i === today && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Hoje</span>
              )}
            </div>
            <div>
              {byDay[i].length > 0 ? byDay[i].map((s: any) => (
                <div key={s.id} className="px-4 py-3 flex items-center gap-3 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="w-1 h-10 rounded-full shrink-0" style={{ background: subjectColor(s.subject) }} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{s.subject}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                      {s.start_time?.slice(0,5)}–{s.end_time?.slice(0,5)}{s.room ? ` · ${s.room}` : ''}
                    </p>
                    {s.professor && <p className="text-xs" style={{ color: 'var(--text-3)' }}>{s.professor}</p>}
                  </div>
                </div>
              )) : (
                <p className="px-4 py-5 text-sm" style={{ color: 'var(--text-3)' }}>Sem aulas</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
