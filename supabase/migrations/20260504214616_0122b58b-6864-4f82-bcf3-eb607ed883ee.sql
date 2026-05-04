
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  explorer_name text not null default '',
  avatar text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- stamps
create table public.stamps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  country text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, country)
);

alter table public.stamps enable row level security;
create policy "Users view own stamps" on public.stamps for select using (auth.uid() = user_id);
create policy "Users insert own stamps" on public.stamps for insert with check (auth.uid() = user_id);
create policy "Users delete own stamps" on public.stamps for delete using (auth.uid() = user_id);

-- country_progress
create table public.country_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  country text not null,
  story_read boolean not null default false,
  games_done boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, country)
);

alter table public.country_progress enable row level security;
create policy "Users view own progress" on public.country_progress for select using (auth.uid() = user_id);
create policy "Users insert own progress" on public.country_progress for insert with check (auth.uid() = user_id);
create policy "Users update own progress" on public.country_progress for update using (auth.uid() = user_id);
create policy "Users delete own progress" on public.country_progress for delete using (auth.uid() = user_id);

-- mini_game_scores
create table public.mini_game_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null,
  score integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, game_id)
);

alter table public.mini_game_scores enable row level security;
create policy "Users view own scores" on public.mini_game_scores for select using (auth.uid() = user_id);
create policy "Users insert own scores" on public.mini_game_scores for insert with check (auth.uid() = user_id);
create policy "Users update own scores" on public.mini_game_scores for update using (auth.uid() = user_id);

-- updated_at helper
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger country_progress_touch before update on public.country_progress
  for each row execute function public.touch_updated_at();
create trigger mini_game_scores_touch before update on public.mini_game_scores
  for each row execute function public.touch_updated_at();

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, explorer_name, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'explorer_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
