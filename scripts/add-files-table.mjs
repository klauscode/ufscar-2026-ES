import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://jivnnjdihejegzeueupf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppdm5uamRpaGVqZWd6ZXVldXBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA4MTkwNywiZXhwIjoyMDkwNjU3OTA3fQ.A45r92IAiKnawCZ7fPIlK40XOn2nGDmkQBxWebexWu8'
)

const { error } = await supabase.rpc('exec_sql', { sql: `
  create table if not exists files (
    id uuid primary key default gen_random_uuid(),
    subject text not null,
    title text not null,
    url text not null,
    file_date date not null,
    created_at timestamptz default now()
  );
  alter table files enable row level security;
  create policy "Public read files" on files for select using (true);
` })

if (error) {
  // rpc might not exist, try direct query approach
  console.log('RPC not available, please run this SQL manually in Supabase SQL Editor:')
  console.log(`
create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  title text not null,
  url text not null,
  file_date date not null,
  created_at timestamptz default now()
);
alter table files enable row level security;
create policy "Public read files" on files for select using (true);
  `)
} else {
  console.log('files table created!')
}
