-- Admin panel: extend blog_posts, add RLS write policies, create admin_settings table.

-- ============================================
-- blog_posts: add missing columns
-- ============================================
alter table public.blog_posts
  add column if not exists category  text,
  add column if not exists pillar    text,
  add column if not exists read_time text,
  add column if not exists featured  boolean not null default false;

-- ============================================
-- blog_posts: RLS policies
-- ============================================

-- Public (anon) can read published posts so BlogPage.tsx can fetch them
create policy "Allow anon select on published blog_posts"
  on public.blog_posts
  for select
  to anon
  using (published = true);

-- Authenticated admin can update and delete
create policy "Allow authenticated update on blog_posts"
  on public.blog_posts
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete on blog_posts"
  on public.blog_posts
  for delete
  to authenticated
  using (true);

-- ============================================
-- bookings: RLS write policies for admin
-- ============================================
create policy "Allow authenticated update on bookings"
  on public.bookings
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete on bookings"
  on public.bookings
  for delete
  to authenticated
  using (true);

-- ============================================
-- booking_availability: RLS write policies for admin
-- ============================================
create policy "Allow authenticated update on booking_availability"
  on public.booking_availability
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete on booking_availability"
  on public.booking_availability
  for delete
  to authenticated
  using (true);

-- Also allow anon to read availability so BookingPage.tsx can check blocked slots
create policy "Allow anon select on booking_availability"
  on public.booking_availability
  for select
  to anon
  using (true);

-- ============================================
-- admin_settings: key/value store for admin config
-- ============================================
create table if not exists public.admin_settings (
  key   text primary key,
  value text not null
);

alter table public.admin_settings enable row level security;

create policy "Allow authenticated select on admin_settings"
  on public.admin_settings
  for select
  to authenticated
  using (true);

create policy "Allow authenticated insert on admin_settings"
  on public.admin_settings
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated update on admin_settings"
  on public.admin_settings
  for update
  to authenticated
  using (true)
  with check (true);

-- Seed default settings
insert into public.admin_settings (key, value)
values
  ('notification_email', 'noreply@rfcsa.co.za'),
  ('notify_on_booking',  'true'),
  ('notify_on_contact',  'true'),
  ('notify_on_quiz',     'true')
on conflict (key) do nothing;

-- ============================================
-- blog_posts: seed the 12 existing hardcoded posts
-- ============================================
insert into public.blog_posts (slug, title, excerpt, content, category, pillar, read_time, featured, published, published_at, author)
values
  (
    'understanding-r638-food-premises',
    'Understanding R638: What Food Businesses Must Know in 2025',
    'A comprehensive breakdown of R638 regulations and what every food business operator needs to comply with in the current regulatory environment.',
    'A comprehensive breakdown of R638 regulations and what every food business operator needs to comply with in the current regulatory environment.',
    'Regulations',
    'R638 & COA Compliance',
    '8 min',
    true,
    true,
    '2025-01-15 00:00:00+00',
    'RFC Team'
  ),
  (
    'haccp-implementation-guide',
    'HACCP Implementation: A Step-by-Step Guide for Food Manufacturers',
    'Learn how to implement a robust HACCP system in your food manufacturing facility with our practical, actionable guide.',
    'Learn how to implement a robust HACCP system in your food manufacturing facility with our practical, actionable guide.',
    'HACCP',
    'HACCP Implementation',
    '12 min',
    true,
    true,
    '2025-02-10 00:00:00+00',
    'RFC Team'
  ),
  (
    'fssc-22000-certification-journey',
    'Your FSSC 22000 Certification Journey: From Gap Analysis to Audit',
    'Everything you need to know about achieving FSSC 22000 certification, including common pitfalls and how to avoid them.',
    'Everything you need to know about achieving FSSC 22000 certification, including common pitfalls and how to avoid them.',
    'Certifications',
    'FSSC 22000',
    '10 min',
    true,
    true,
    '2025-03-05 00:00:00+00',
    'RFC Team'
  ),
  (
    'food-safety-culture-building',
    'Building a Food Safety Culture: Why Leadership Matters',
    'Explore how senior leadership commitment to food safety culture drives compliance, reduces incidents, and creates lasting organisational change.',
    'Explore how senior leadership commitment to food safety culture drives compliance, reduces incidents, and creates lasting organisational change.',
    'Food Safety Culture',
    'Food Defence & Culture',
    '7 min',
    false,
    true,
    '2025-04-01 00:00:00+00',
    'RFC Team'
  ),
  (
    'coa-compliance-exporters',
    'Certificate of Acceptability: A Guide for Export-Oriented Food Businesses',
    'How to obtain and maintain your COA while meeting export market requirements — practical steps for South African food exporters.',
    'How to obtain and maintain your COA while meeting export market requirements — practical steps for South African food exporters.',
    'Export',
    'R638 & COA Compliance',
    '9 min',
    false,
    true,
    '2025-04-20 00:00:00+00',
    'RFC Team'
  ),
  (
    'small-business-food-safety',
    'Food Safety on a Budget: Practical Tips for Small Food Businesses',
    'You don''t need a large compliance team to meet food safety standards. Here''s how small businesses can build effective systems affordably.',
    'You don''t need a large compliance team to meet food safety standards. Here''s how small businesses can build effective systems affordably.',
    'Small Business',
    'Audience-Specific',
    '6 min',
    false,
    true,
    '2025-05-12 00:00:00+00',
    'RFC Team'
  ),
  (
    'internal-audit-checklist',
    'Internal Auditing for Food Safety: Building Your Audit Programme',
    'A practical framework for scheduling, conducting, and acting on internal food safety audits to maintain continuous improvement.',
    'A practical framework for scheduling, conducting, and acting on internal food safety audits to maintain continuous improvement.',
    'Auditing',
    'FSSC 22000',
    '11 min',
    false,
    true,
    '2025-06-08 00:00:00+00',
    'RFC Team'
  ),
  (
    'allergen-management-best-practices',
    'Allergen Management: Protecting Consumers and Your Business',
    'With allergen-related recalls on the rise, here''s how to implement a robust allergen management programme that meets regulatory and retailer requirements.',
    'With allergen-related recalls on the rise, here''s how to implement a robust allergen management programme that meets regulatory and retailer requirements.',
    'Allergens',
    'HACCP Implementation',
    '8 min',
    false,
    true,
    '2025-07-14 00:00:00+00',
    'RFC Team'
  ),
  (
    'comply-cloud-digital-food-safety',
    'Digital Food Safety Management: How Technology Is Transforming Compliance',
    'From paper-based checklists to cloud-based systems, discover how digital tools are revolutionising food safety management for South African businesses.',
    'From paper-based checklists to cloud-based systems, discover how digital tools are revolutionising food safety management for South African businesses.',
    'Technology',
    'Audience-Specific',
    '7 min',
    false,
    true,
    '2025-08-05 00:00:00+00',
    'RFC Team'
  ),
  (
    'risk-management-food-chain',
    'Risk Management Across the Food Chain: A Holistic Approach',
    'Effective food safety risk management goes beyond your facility. Learn how to assess and mitigate risks throughout your entire supply chain.',
    'Effective food safety risk management goes beyond your facility. Learn how to assess and mitigate risks throughout your entire supply chain.',
    'Risk Management',
    'HACCP Implementation',
    '10 min',
    false,
    true,
    '2025-09-18 00:00:00+00',
    'RFC Team'
  ),
  (
    'fssc-22000-version-6',
    'FSSC 22000 Version 6: Key Changes and What They Mean for Your Business',
    'Version 6 of FSSC 22000 introduced significant changes to food safety culture, food defence, and environmental monitoring. Here''s what you need to action.',
    'Version 6 of FSSC 22000 introduced significant changes to food safety culture, food defence, and environmental monitoring. Here''s what you need to action.',
    'FSSC 22000',
    'FSSC 22000',
    '9 min',
    false,
    true,
    '2025-10-22 00:00:00+00',
    'RFC Team'
  ),
  (
    'pest-control-food-facilities',
    'Integrated Pest Management in Food Facilities: Standards and Best Practices',
    'Pest control is a critical food safety prerequisite. Learn how to implement an integrated pest management programme that satisfies auditor requirements.',
    'Pest control is a critical food safety prerequisite. Learn how to implement an integrated pest management programme that satisfies auditor requirements.',
    'Risk Management',
    'R638 & COA Compliance',
    '8 min',
    false,
    true,
    '2025-11-30 00:00:00+00',
    'RFC Team'
  )
on conflict (slug) do nothing;
