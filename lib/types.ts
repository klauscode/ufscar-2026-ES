export type ScheduleItem = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  subject: string
  room: string | null
  professor: string | null
}

export type HomeworkItem = {
  id: string
  subject: string
  title: string
  description: string | null
  deadline: string
  created_at: string | null
}

export type TodoItem = {
  id: string
  text: string
  done: boolean
  created_at: string | null
}

export type NewsItem = {
  id: string
  title: string
  body: string
  pinned: boolean
  created_at: string
}

export type FileItem = {
  id: string
  subject: string
  title: string
  url: string
  file_date: string
  created_at: string | null
}
