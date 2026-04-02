import TodoList from '@/components/TodoList'
import { supabase } from '@/lib/supabase'
import type { TodoItem } from '@/lib/types'

export default async function TodosPage() {
  const { data } = await supabase.from('todos').select('*').order('created_at')
  const todos: TodoItem[] = data ?? []

  return (
    <div className="space-y-6">
      <header className="panel px-6 py-6">
        <p className="font-display text-xs uppercase tracking-[0.34em] text-[var(--text-3)]">
          Checklist compartilhado
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">O que a turma precisa resolver</h1>
        <p className="mt-2 text-sm text-[var(--text-2)]">
          Marque pendencias coletivas sem misturar isso com os prazos individuais de tarefa.
        </p>
      </header>

      <TodoList initialTodos={todos} />
    </div>
  )
}
