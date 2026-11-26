-- ===========================================================================
-- Kessoku Family (KSF) — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query → Run.
-- It is safe to re-run (idempotent).
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Site configuration (all editable content lives in a single JSONB row)
-- ---------------------------------------------------------------------------
create table if not exists public.site_config (
  id          text primary key default 'main',
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.site_config enable row level security;

-- Everyone (including anonymous visitors) may read the public content.
drop policy if exists "site_config public read" on public.site_config;
create policy "site_config public read"
  on public.site_config for select
  using (true);

-- Only authenticated admins may write.
drop policy if exists "site_config admin insert" on public.site_config;
create policy "site_config admin insert"
  on public.site_config for insert
  to authenticated
  with check (true);

drop policy if exists "site_config admin update" on public.site_config;
create policy "site_config admin update"
  on public.site_config for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "site_config admin delete" on public.site_config;
create policy "site_config admin delete"
  on public.site_config for delete
  to authenticated
  using (true);

-- Seed the single configuration row.
insert into public.site_config (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Member registrations
-- ---------------------------------------------------------------------------
create table if not exists public.registrations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  gender      text,
  tiktok      text,
  gen         text,
  skill       text,
  cn_format   text,
  cn_value    text,
  created_at  timestamptz not null default now()
);

create index if not exists registrations_created_at_idx
  on public.registrations (created_at desc);

alter table public.registrations enable row level security;

-- Visitors may submit a registration…
drop policy if exists "registrations public insert" on public.registrations;
create policy "registrations public insert"
  on public.registrations for insert
  to anon, authenticated
  with check (true);

-- …but only authenticated admins may read, update or delete them.
drop policy if exists "registrations admin read" on public.registrations;
create policy "registrations admin read"
  on public.registrations for select
  to authenticated
  using (true);

drop policy if exists "registrations admin update" on public.registrations;
create policy "registrations admin update"
  on public.registrations for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "registrations admin delete" on public.registrations;
create policy "registrations admin delete"
  on public.registrations for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- 3. Storage bucket for media (images & videos)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 52428800)  -- 50 MB per file
on conflict (id) do nothing;

-- Public read of media objects.
drop policy if exists "media public read" on storage.objects;
create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

-- Only authenticated admins can upload / replace / delete.
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
