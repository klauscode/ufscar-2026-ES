import { supabase } from '@/lib/supabase'
import type { NewsItem } from '@/lib/types'

export default async function NewsPage() {
  const { data } = await supabase
    .from('news')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const news: NewsItem[] = data ?? []

  return (
    <div className="space-y-6">
      <header className="panel px-6 py-6">
        <p className="font-display text-xs uppercase tracking-[0.34em] text-[var(--text-3)]">
          Comunicados
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">Avisos da turma</h1>
        <p className="mt-2 text-sm text-[var(--text-2)]">
          Informes importantes com destaque automatico para o que foi fixado.
        </p>
      </header>

      {news.length > 0 ? (
        <div className="space-y-4">
          {news.map((item) => (
            <article key={item.id} className="panel overflow-hidden">
              {item.pinned && (
                <div className="h-1" style={{ background: 'linear-gradient(90deg, var(--warn), var(--accent))' }} />
              )}
              <div className="px-6 py-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-xl font-semibold text-[var(--text)]">{item.title}</h2>
                  {item.pinned && (
                    <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ background: 'rgba(169,77,30,0.14)', color: 'var(--warn)' }}>
                      Fixado
                    </span>
                  )}
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--text-2)]">{item.body}</p>
                <p className="mt-4 text-sm text-[var(--text-3)]">
                  {new Date(item.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel px-6 py-12 text-center">
          <p className="font-display text-2xl font-semibold text-[var(--text)]">Nenhum aviso no momento</p>
          <p className="mt-2 text-sm text-[var(--text-3)]">Quando sair algo novo, ele aparece aqui.</p>
        </div>
      )}
    </div>
  )
}
