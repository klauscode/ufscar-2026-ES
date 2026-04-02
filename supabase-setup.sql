-- Run this file in the Supabase SQL Editor.

create table if not exists schedule (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null,
  start_time time not null,
  end_time time not null,
  subject text not null,
  room text,
  professor text
);

create table if not exists homework (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  title text not null,
  description text,
  deadline timestamptz not null,
  created_at timestamptz default now()
);

create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  done boolean default false,
  created_at timestamptz default now()
);

create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  pinned boolean default false,
  created_at timestamptz default now()
);

create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  title text not null,
  url text not null,
  file_date date not null,
  created_at timestamptz default now()
);

alter table schedule enable row level security;
alter table homework enable row level security;
alter table todos enable row level security;
alter table news enable row level security;
alter table files enable row level security;

create policy "Public read schedule" on schedule for select using (true);
create policy "Public read homework" on homework for select using (true);
create policy "Public read todos" on todos for select using (true);
create policy "Public read news" on news for select using (true);
create policy "Public read files" on files for select using (true);

create policy "Anyone can toggle todo" on todos
  for update using (true) with check (true);
