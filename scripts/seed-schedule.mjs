import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://jivnnjdihejegzeueupf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppdm5uamRpaGVqZWd6ZXVldXBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA4MTkwNywiZXhwIjoyMDkwNjU3OTA3fQ.A45r92IAiKnawCZ7fPIlK40XOn2nGDmkQBxWebexWu8'
)

const slots = [
  {
    day_of_week: 0,
    start_time: '08:00',
    end_time: '12:00',
    subject: 'Processos Investigat. Educ. Especial I: Planej. Trab. Científico',
    room: 'AT8 Sala 180',
    professor: 'Profa. Lara Ferreira dos Santos e Profa. Amanda Maria dos Santos Silva',
  },
  {
    day_of_week: 1,
    start_time: '08:00',
    end_time: '12:00',
    subject: 'Ética e Educação Especial',
    room: 'AT2 Sala 45',
    professor: 'Profa. Enicéia Gonçalves Mendes',
  },
  {
    day_of_week: 1,
    start_time: '14:00',
    end_time: '18:00',
    subject: 'Políticas Educacionais e Funcionamento da Educação Especial',
    room: 'AT1 Sala 16',
    professor: 'Profa. Rosimeire Maria Orlando',
  },
  {
    day_of_week: 2,
    start_time: '08:00',
    end_time: '12:00',
    subject: 'Referenciais Teóricos do Desenvolvimento Humano',
    room: 'AT2 Sala 28',
    professor: 'Profa. Carolina Severino Lopes da Costa',
  },
  {
    day_of_week: 3,
    start_time: '08:00',
    end_time: '12:00',
    subject: 'Educação e Educação Especial: Contextos Históricos',
    room: 'AT2 Sala 31',
    professor: 'Prof. Leonardo Santos Amâncio Cabral',
  },
  {
    day_of_week: 3,
    start_time: '14:00',
    end_time: '18:00',
    subject: 'Teorias Pedagógicas Aplicadas à Educação Especial',
    room: 'AT2 Sala 31',
    professor: 'Profa. Rosimeire Maria Orlando',
  },
]

const { error } = await supabase.from('schedule').insert(slots)
if (error) {
  console.error('Error:', error.message)
} else {
  console.log('All 6 classes inserted successfully!')
}
