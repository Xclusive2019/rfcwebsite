-- Shop: quote requests submitted from the Food Grade Lubricants shop page.

-- ============================================
-- quote_requests
-- ============================================
create table if not exists public.quote_requests (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text,
  company      text,
  product_code text,
  product_name text,
  product_pack text,
  unit_price   numeric(12, 2),
  quantity     integer,
  message      text,
  created_at   timestamptz not null default now()
);

alter table public.quote_requests enable row level security;

-- Public (anon) can submit a quote request from the shop page.
create policy "Allow public insert on quote_requests"
  on public.quote_requests
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated admins can read submitted quote requests.
create policy "Allow authenticated select on quote_requests"
  on public.quote_requests
  for select
  to authenticated
  using (true);

-- Notification toggle for the admin settings panel.
insert into public.admin_settings (key, value)
values ('notify_on_quote', 'true')
on conflict (key) do nothing;
