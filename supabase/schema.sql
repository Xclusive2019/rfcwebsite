-- Run this in the Supabase SQL Editor

-- ============================================
-- bookings
-- ============================================
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text not null,
  booking_date date not null,
  booking_time time not null,
  status text not null default 'pending',
  notes text,
  company text,
  division text,
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "Allow public insert on bookings"
  on public.bookings
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow authenticated select on bookings"
  on public.bookings
  for select
  to authenticated
  using (true);

-- ============================================
-- booking_availability
-- ============================================
create table if not exists public.booking_availability (
  id uuid primary key default gen_random_uuid(),
  available_date date not null,
  start_time time not null,
  end_time time not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  unique (available_date, start_time, end_time)
);

alter table public.booking_availability enable row level security;

create policy "Allow public insert on booking_availability"
  on public.booking_availability
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow authenticated select on booking_availability"
  on public.booking_availability
  for select
  to authenticated
  using (true);

-- ============================================
-- quiz_submissions
-- ============================================
create table if not exists public.quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  company text,
  answers jsonb not null default '{}'::jsonb,
  score integer,
  created_at timestamptz not null default now()
);

alter table public.quiz_submissions enable row level security;

create policy "Allow public insert on quiz_submissions"
  on public.quiz_submissions
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow authenticated select on quiz_submissions"
  on public.quiz_submissions
  for select
  to authenticated
  using (true);

-- ============================================
-- contacts
-- ============================================
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

create policy "Allow public insert on contacts"
  on public.contacts
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow authenticated select on contacts"
  on public.contacts
  for select
  to authenticated
  using (true);

-- ============================================
-- chat_conversations
-- ============================================
create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.chat_conversations enable row level security;

create policy "Allow public insert on chat_conversations"
  on public.chat_conversations
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow authenticated select on chat_conversations"
  on public.chat_conversations
  for select
  to authenticated
  using (true);

-- ============================================
-- blog_posts
-- ============================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  excerpt text,
  author text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "Allow public insert on blog_posts"
  on public.blog_posts
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow authenticated select on blog_posts"
  on public.blog_posts
  for select
  to authenticated
  using (true);
