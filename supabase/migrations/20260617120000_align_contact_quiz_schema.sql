-- Align contacts and quiz_submissions schema with the edge function / frontend payloads.

-- contacts: the contact form and submit-contact function send company and service.
alter table public.contacts
  add column if not exists company text,
  add column if not exists service text;

-- quiz_submissions: the audit quiz and submit-quiz function send a tier and do not
-- collect a full_name, so add tier and relax the full_name NOT NULL constraint.
alter table public.quiz_submissions
  add column if not exists tier text;

alter table public.quiz_submissions
  alter column full_name drop not null;
