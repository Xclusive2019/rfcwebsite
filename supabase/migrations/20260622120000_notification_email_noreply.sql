-- Route admin notifications to the noreply mailbox, which auto-forwards to
-- info@rfcsa.co.za in xneelo. Only updates the row if it still holds a prior
-- default, so a value an admin has customised in the panel is left untouched.
update public.admin_settings
set value = 'noreply@rfcsa.co.za'
where key = 'notification_email'
  and value = 'info@rfcsa.co.za';

-- Ensure the setting exists at all (in case it was never seeded).
insert into public.admin_settings (key, value)
values ('notification_email', 'noreply@rfcsa.co.za')
on conflict (key) do nothing;
