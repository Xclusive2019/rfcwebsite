-- Fix duplicated virtual training dates on /training/virtual.
-- The real-schedule seed (20260618160000) inserted rows with no conflict guard
-- and no unique constraint, so a re-run duplicated every session (each date
-- appeared twice). Remove the extra copies, keeping one row per session, then
-- add a unique index so this can never happen again.

-- Keep the earliest physical row of each identical session, delete the rest.
delete from public.training_sessions a
using public.training_sessions b
where a.ctid > b.ctid
  and a.title      = b.title
  and a.start_date = b.start_date
  and a.format     = b.format;

-- Guard against future duplicate inserts of the same session.
create unique index if not exists training_sessions_unique_session
  on public.training_sessions (title, start_date, format);
