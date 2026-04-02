import { createClient } from '@supabase/supabase-js'
import { getSupabaseScriptEnv } from './load-env.mjs'

const { supabaseUrl, serviceRoleKey } = getSupabaseScriptEnv()

const supabase = createClient(supabaseUrl, serviceRoleKey)

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
