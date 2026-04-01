import { supabase } from '@/lib/supabase'
import FilesView from '@/components/FilesView'

export default async function ArquivosPage() {
  const [{ data: files }, { data: schedule }] = await Promise.all([
    supabase.from('files').select('*').order('file_date', { ascending: false }),
    supabase.from('schedule').select('subject').order('day_of_week'),
  ])

  // Unique subjects in schedule order
  const subjects = [...new Set(schedule?.map((s: any) => s.subject) ?? [])]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Arquivos</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
          Slides, PDFs e materiais por matéria
        </p>
      </div>

      {subjects.length > 0 ? (
        <FilesView files={files ?? []} subjects={subjects} />
      ) : (
        <div className="rounded-2xl border px-6 py-12 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-3xl mb-2">📚</p>
          <p className="font-semibold" style={{ color: 'var(--text)' }}>Nenhuma matéria na grade ainda.</p>
        </div>
      )}
    </div>
  )
}
