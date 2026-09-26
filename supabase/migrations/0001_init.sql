-- Mr. Tux — initial schema: accounts, size profiles, order intake.
--
-- How to run this:
--   1. Open your Supabase project → SQL Editor → New query.
--   2. Paste this whole file in and click Run.
-- It's safe to re-run (every statement is "if not exists" / "or replace").

-- 1. Profiles ---------------------------------------------------------------
-- One row per signed-up customer, created automatically (see trigger below).
-- is_staff is off by default. To give a Mr. Tux team member staff access —
-- so they can see every order, not just their own — open Table Editor →
-- profiles, find their row, and flip is_staff to true.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_staff boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own row" on public.profiles;
create policy "profiles: read own row"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles: staff can read all profiles" on public.profiles;
create policy "profiles: staff can read all profiles"
  on public.profiles for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Size profiles ------------------------------------------------------------
-- One row per signed-in customer. Mirrors the SizeProfile type in
-- src/context/AppContext.tsx. Guests (not signed in) never write here —
-- their sizes stay in the browser only, same as today.
create table if not exists public.size_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  method text,
  measurements jsonb,
  brand_sizes jsonb,
  shoe_size text,
  belt_size text,
  updated_at timestamptz not null default now()
);

alter table public.size_profiles enable row level security;

drop policy if exists "size_profiles: owner can read" on public.size_profiles;
create policy "size_profiles: owner can read"
  on public.size_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "size_profiles: owner can insert" on public.size_profiles;
create policy "size_profiles: owner can insert"
  on public.size_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "size_profiles: owner can update" on public.size_profiles;
create policy "size_profiles: owner can update"
  on public.size_profiles for update
  using (auth.uid() = user_id);

drop policy if exists "size_profiles: staff can read all" on public.size_profiles;
create policy "size_profiles: staff can read all"
  on public.size_profiles for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff));

-- 3. Orders -------------------------------------------------------------------
-- One row per placed order / intake. user_id is null for guest checkout —
-- most Mr. Tux customers won't bother creating an account, and that's fine.
-- guest_name / guest_email carry contact info for staff follow-up in that case.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  guest_name text,
  guest_email text,
  items jsonb not null,
  total numeric not null,
  event jsonb,
  delivery_from text,
  delivery_to text,
  return_by timestamptz,
  placed_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Anyone can submit an order — including guests using the public anon key.
-- This is intake, same as someone filling out a paper order form. The check
-- only stops a signed-in user from writing an order under someone else's id.
drop policy if exists "orders: anyone can insert" on public.orders;
create policy "orders: anyone can insert"
  on public.orders for insert
  with check (user_id is null or user_id = auth.uid());

drop policy if exists "orders: owner can read own" on public.orders;
create policy "orders: owner can read own"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "orders: staff can read all" on public.orders;
create policy "orders: staff can read all"
  on public.orders for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff));

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_reference_idx on public.orders (reference);

-- 4. API grants -----------------------------------------------------------
-- These make the tables reachable through the Data API at all (RLS above
-- then controls exactly which rows each request can touch). Written
-- explicitly so this migration works regardless of the "Automatically
-- expose new tables" project setting.
grant usage on schema public to anon, authenticated;

grant select on public.profiles to authenticated;
grant select, insert, update on public.size_profiles to authenticated;
grant insert on public.orders to anon, authenticated;
grant select on public.orders to authenticated;
