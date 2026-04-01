import { supabase } from '@/lib/supabase'

export default async function NewsPage() {
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Avisos</h1>

      {news && news.length > 0 ? (
        <ul className="space-y-4">
          {news.map((n: any) => (
            <li
              key={n.id}
              className={`rounded-xl border p-5 shadow-sm ${
                n.pinned
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  {n.pinned && (
                    <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">
                      Fixado
                    </span>
                  )}
                  <h2 className="font-semibold text-gray-800 text-lg">{n.title}</h2>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{n.body}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(n.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">Nenhum aviso no momento.</p>
      )}
    </div>
  )
}
