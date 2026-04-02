import { supabase } from '@/lib/supabase'

function urgency(deadline: string) {
  const d = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  if (d < 1) return { bar: '#ef4444', badge: 'bg-red-100 text-red-600', label: 'Hoje!' }
  if (d < 3) return { bar: '#f97316', badge: 'bg-orange-100 text-orange-600', label: `${Math.ceil(d)} dias` }
  return { bar: '#4f46e5', badge: '', label: `${Math.ceil(d)} dias` }
}

export default async function HomeworkPage() {
  const { data: homework } = await supabase.from('homework').select('*').order('deadline')
  const upcoming = homework?.filter((h: any) => new Date(h.deadline) >= new Date()) ?? []
  const past = homework?.filter((h: any) => new Date(h.deadline) < new Date()) ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Tarefas</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
          {upcoming.length > 0 ? `${upcoming.length} pendente${upcoming.length !== 1 ? 's' : ''}` : 'Tudo em dia!'}
        </p>
      </div>

      <div className="space-y-3">
        {upcoming.length > 0 ? upcoming.map((hw: any) => {
          const { bar, badge, label } = urgency(hw.deadline)
          return (
            <div key={hw.id} className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
              <div className="h-0.5" style={{ background: bar }} />
              <div className="px-6 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>{hw.title}</p>
                  <p className="text-sm font-medium mt-1" style={{ color: 'var(--accent)' }}>{hw.subject}</p>
                  {hw.description && <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-2)' }}>{hw.description}</p>}
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-block text-sm font-semibold px-2.5 py-1 rounded-full ${badge || 'text-sm font-semibold px-2.5 py-1 rounded-full'}`}
                    style={!badge ? { background: 'var(--surface-2)', color: 'var(--text-2)' } : {}}>
                    {label}
                  </span>
                  <p className="text-sm mt-1.5" style={{ color: 'var(--text-3)' }}>
                    {new Date(hw.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="rounded-2xl border px-6 py-14 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-4xl mb-3">🎉</p>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>Sem tarefas pendentes!</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Aproveite enquanto dura.</p>
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>Anteriores</p>
          <div className="space-y-2">
            {past.map((hw: any) => (
              <div key={hw.id} className="rounded-xl border px-5 py-3 flex justify-between items-center opacity-40" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm font-medium line-through" style={{ color: 'var(--text-2)' }}>{hw.title}</p>
                  <p className="text-sm" style={{ color: 'var(--text-3)' }}>{hw.subject}</p>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>{new Date(hw.deadline).toLocaleDateString('pt-BR')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
