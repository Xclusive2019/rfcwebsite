-- Replace the placeholder virtual-facilitation seed with the real schedule
-- published on the live site (rfcsa.co.za food-safety-training-schedule),
-- covering upcoming sessions from 18 Jun 2026 through Aug 2026.
-- Prices are not published on the live calendar (quoted on registration),
-- so price is left null. Admin can edit/extend these in the admin panel.

-- Remove the original placeholder seed rows (matched by their seed course codes).
delete from public.training_sessions
where course_code in ('4.1.1', 'ISO22002', 'FSSCV7', 'IA-2326', 'R638', 'HACCP-SUP', 'SIZA');

insert into public.training_sessions (course_code, title, description, start_date, end_date, price, format, sort_order)
values
  (null, 'FSSC V7 Transition Training', null, '2026-06-18', '2026-06-18', null, 'virtual', 1),
  (null, 'HACCP for Supervisors', null, '2026-06-19', '2026-06-19', null, 'virtual', 2),
  (null, 'R638 Regulation', 'SAATCA Accredited — FSM Reg No: 066.', '2026-06-22', '2026-06-22', null, 'virtual', 3),
  (null, 'Internal Auditors Training', 'Two-day internal auditor training.', '2026-06-23', '2026-06-24', null, 'virtual', 4),
  (null, 'FSSC V6 Implementation', null, '2026-06-25', '2026-06-26', null, 'virtual', 5),
  (null, 'SIZA Social Training', null, '2026-06-29', '2026-06-29', null, 'virtual', 6),
  (null, 'SIZA Social / Cold Chain Requirements', null, '2026-06-30', '2026-06-30', null, 'virtual', 7),
  (null, 'HACCP for Supervisors', null, '2026-07-02', '2026-07-02', null, 'virtual', 8),
  (null, 'FSSC V7 Transition Training', null, '2026-07-06', '2026-07-06', null, 'virtual', 9),
  (null, 'BRCGS V9 Implementation', null, '2026-07-06', '2026-07-08', null, 'virtual', 10),
  (null, 'Root Cause Analysis', null, '2026-07-07', '2026-07-07', null, 'virtual', 11),
  (null, 'Food Safety for Maintenance & Utility Workers', null, '2026-07-08', '2026-07-08', null, 'virtual', 12),
  (null, 'Global GAP v6 Implementation', null, '2026-07-09', '2026-07-10', null, 'virtual', 13),
  (null, 'HACCP Implementation', null, '2026-07-13', '2026-07-14', null, 'virtual', 14),
  (null, 'TACCP & VACCP', null, '2026-07-15', '2026-07-15', null, 'virtual', 15),
  (null, 'ISO 22002-1:2025', null, '2026-07-16', '2026-07-16', null, 'virtual', 16),
  (null, 'FSSC V7 Transition Training', null, '2026-07-17', '2026-07-17', null, 'virtual', 17),
  (null, 'HACCP for Supervisors', null, '2026-07-20', '2026-07-20', null, 'virtual', 18),
  (null, 'Internal Auditors Training', 'Two-day internal auditor training.', '2026-07-21', '2026-07-22', null, 'virtual', 19),
  (null, 'FSSC V7 Implementation', null, '2026-07-23', '2026-07-24', null, 'virtual', 20),
  (null, 'Cold Chain Requirements', null, '2026-07-27', '2026-07-27', null, 'virtual', 21),
  (null, 'SIZA Social Training', null, '2026-07-28', '2026-07-29', null, 'virtual', 22),
  (null, 'Allergen Awareness', null, '2026-07-30', '2026-07-30', null, 'virtual', 23),
  (null, 'Food Safety for Maintenance & Utility Workers', null, '2026-08-04', '2026-08-04', null, 'virtual', 24),
  (null, 'Allergen Awareness Training', null, '2026-08-05', '2026-08-05', null, 'virtual', 25),
  (null, 'FSSC V7 Transition Training', null, '2026-08-06', '2026-08-06', null, 'virtual', 26),
  (null, 'Root Cause Analysis', null, '2026-08-07', '2026-08-07', null, 'virtual', 27),
  (null, 'Global GAP v6 Implementation', null, '2026-08-11', '2026-08-12', null, 'virtual', 28),
  (null, 'HACCP Implementation', null, '2026-08-13', '2026-08-14', null, 'virtual', 29),
  (null, 'Food Safety Culture', null, '2026-08-17', '2026-08-17', null, 'virtual', 30),
  (null, 'TACCP & VACCP', null, '2026-08-18', '2026-08-18', null, 'virtual', 31),
  (null, 'ISO 22002-1:2025', null, '2026-08-19', '2026-08-19', null, 'virtual', 32),
  (null, 'FSSC V7 Transition Training', null, '2026-08-20', '2026-08-20', null, 'virtual', 33),
  (null, 'HACCP for Supervisors', null, '2026-08-21', '2026-08-21', null, 'virtual', 34),
  (null, 'R638 Regulation', 'SAATCA Accredited — FSM Reg No: 066.', '2026-08-24', '2026-08-24', null, 'virtual', 35),
  (null, 'Internal Auditors Training', 'Two-day internal auditor training.', '2026-08-25', '2026-08-26', null, 'virtual', 36),
  (null, 'FSSC V6 Implementation', null, '2026-08-27', '2026-08-28', null, 'virtual', 37);
