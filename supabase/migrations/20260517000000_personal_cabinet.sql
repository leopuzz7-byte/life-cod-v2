-- Личный кабинет: профили и история разборов
--
-- Эту миграцию нужно применить в Supabase SQL Editor:
-- https://app.supabase.com/project/xpbseiltakjxazxetpbr/sql/new
-- Скопировать всё ниже и нажать Run.

-- 1. Таблица профилей (один-к-одному с auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  birth_day integer not null check (birth_day between 1 and 31),
  birth_month integer not null check (birth_month between 1 and 12),
  birth_year integer not null check (birth_year between 1900 and 2100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Таблица сохранённых разборов
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  method_id text not null,
  methodology text not null,
  tier text not null,
  result_type text not null,
  input jsonb not null,
  result jsonb not null,
  title text,
  created_at timestamptz not null default now()
);

create index if not exists analyses_user_created
  on public.analyses(user_id, created_at desc);

-- 3. Row Level Security: каждый видит только свои данные
alter table public.profiles enable row level security;
alter table public.analyses enable row level security;

-- Политики для profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Политики для analyses
drop policy if exists "analyses_select_own" on public.analyses;
create policy "analyses_select_own" on public.analyses
  for select using (auth.uid() = user_id);

drop policy if exists "analyses_insert_own" on public.analyses;
create policy "analyses_insert_own" on public.analyses
  for insert with check (auth.uid() = user_id);

drop policy if exists "analyses_delete_own" on public.analyses;
create policy "analyses_delete_own" on public.analyses
  for delete using (auth.uid() = user_id);

-- 4. Триггер на обновление updated_at у profiles
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
