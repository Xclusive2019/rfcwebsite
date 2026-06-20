-- Training calendar (Virtual Facilitation) + admin-editable external system links.

-- ============================================
-- training_sessions: admin-managed virtual facilitation calendar
-- ============================================
create table if not exists public.training_sessions (
  id          uuid primary key default gen_random_uuid(),
  course_code text,
  title       text not null,
  description text,
  start_date  date not null,
  end_date    date,
  price       text,
  format      text not null default 'virtual',
  register_url text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.training_sessions enable row level security;

-- Public can read active sessions for the calendar page
create policy "Allow anon select active training_sessions"
  on public.training_sessions
  for select
  to anon
  using (is_active = true);

-- Admin (authenticated) full access
create policy "Allow authenticated select on training_sessions"
  on public.training_sessions
  for select
  to authenticated
  using (true);

create policy "Allow authenticated insert on training_sessions"
  on public.training_sessions
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated update on training_sessions"
  on public.training_sessions
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete on training_sessions"
  on public.training_sessions
  for delete
  to authenticated
  using (true);

-- ============================================
-- admin_settings: allow anon to read the public link keys only
-- ============================================
create policy "Allow anon select public admin_settings"
  on public.admin_settings
  for select
  to anon
  using (key in (
    'comply_cloud_system_url',
    'virtual_training_register_url',
    'elearning_url'
  ));

-- Seed editable external links
insert into public.admin_settings (key, value)
values
  ('comply_cloud_system_url',       'https://complycloud.flowsheet.co.za/'),
  ('virtual_training_register_url', 'https://complycloud.flowsheet.co.za/public/checklists/view/173/23'),
  ('elearning_url',                 'https://rfcacademy.co.za')
on conflict (key) do nothing;

-- ============================================
-- Seed initial virtual facilitation sessions (admin can edit/replace)
-- ============================================
insert into public.training_sessions (course_code, title, description, start_date, end_date, price, format, sort_order)
values
  ('4.1.1', 'Introduction to HACCP', 'Foundational HACCP training for HACCP and food safety team members.', '2026-06-17', '2026-06-17', 'R1,790 p/p (incl. VAT)', 'virtual', 1),
  ('ISO22002', 'ISO 22002-1:2025 Prerequisite Programmes', 'Understanding the updated prerequisite programme requirements for food manufacturing.', '2026-06-19', '2026-06-19', 'R1,950 p/p (incl. VAT)', 'virtual', 2),
  ('FSSCV7', 'FSSC V7 Transition Training', 'Transition training covering the key changes introduced in FSSC 22000 Version 7.', '2026-06-23', '2026-06-23', 'R2,150 p/p (incl. VAT)', 'virtual', 3),
  ('IA-2326', 'Internal Auditors Training', 'Two-day internal auditor training against GFSI-benchmarked standards.', '2026-06-23', '2026-06-24', 'R3,450 p/p (incl. VAT)', 'virtual', 4),
  ('R638', 'R638 Regulation (SAATCA Accredited)', 'SAATCA-accredited training on Regulation R638 compliance for food premises.', '2026-06-26', '2026-06-26', 'R1,625 p/p (incl. VAT)', 'virtual', 5),
  ('HACCP-SUP', 'HACCP for Supervisors', 'Practical HACCP training tailored for supervisors and line managers.', '2026-07-01', '2026-07-01', 'R1,790 p/p (incl. VAT)', 'virtual', 6),
  ('SIZA', 'SIZA Social Training', 'SIZA social and ethical compliance training for the agricultural supply chain.', '2026-07-06', '2026-07-06', 'R2,350 p/p (incl. VAT)', 'virtual', 7)
on conflict do nothing;
