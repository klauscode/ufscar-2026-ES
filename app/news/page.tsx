import { supabase } from '@/lib/supabase'

export default async function NewsPage() {
  const { data: news } = await supabase
    .from('news').select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Avisos</h1>
        <p className="text-gray-500 text-sm mt-1">Comunicados da turma</p>
      </div>

      {news && news.length > 0 ? (
        <ul className="space-y-4">
          {news.map((n: any) => (
            <li key={n.id} className={`rounded-2xl border shadow-sm overflow-hidden ${n.pinned ? 'border-amber-200' : 'border-gray-100'}`}>
              {n.pinned && <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-400" />}
              <div className={`px-6 py-5 ${n.pinned ? 'bg-amber-50' : 'bg-white'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {n.pinned && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 mb-2">
                        📌 Fixado
                      </span>
                    )}
                    <h2 className="font-semibold text-gray-900 text-base">{n.title}</h2>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">{n.body}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  {new Date(n.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-12 text-center">
          <p className="text-3xl mb-2">📭</p>
          <p className="font-semibold text-gray-700">Nenhum aviso no momento.</p>
        </div>
      )}
    </div>
  )
}
