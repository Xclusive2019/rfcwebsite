alter table public.bookings
  add column if not exists company text,
  add column if not exists division text;
