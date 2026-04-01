import { supabase } from '@/lib/supabase'

export default async function NewsPage() {
  const { data: news } = await supabase.from('news').select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Avisos</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>Comunicados da turma</p>
      </div>

      {news && news.length > 0 ? (
        <ul className="space-y-4">
          {news.map((n: any) => (
            <li key={n.id} className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
              {n.pinned && (
                <div className="h-0.5" style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316)' }} />
              )}
              <div className="px-6 py-5">
                {n.pinned && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold mb-2 px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#d97706' }}>
                    📌 Fixado
                  </span>
                )}
                <h2 className="font-semibold text-base" style={{ color: 'var(--text)' }}>{n.title}</h2>
                <p className="text-sm mt-2 leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-2)' }}>{n.body}</p>
                <p className="text-xs mt-4" style={{ color: 'var(--text-3)' }}>
                  {new Date(n.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border px-6 py-14 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-4xl mb-3">📭</p>
          <p className="font-semibold" style={{ color: 'var(--text)' }}>Nenhum aviso no momento.</p>
        </div>
      )}
    </div>
  )
}
