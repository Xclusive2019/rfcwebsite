-- Shop: move the food-grade lubricant range into a managed products table so
-- admins can add/edit/remove items, with images and Spanjaard data sheets.

-- ============================================
-- products
-- ============================================
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  code              text not null,
  name              text not null,
  pack              text not null default '',
  unit              text not null default '',
  qty_per_carton    integer not null default 1,
  price             numeric(12, 2) not null default 0,
  category          text not null default 'Food Grade (NSF Certified)',
  image_url         text,
  data_sheet_url    text,
  data_sheet_is_pdf boolean not null default false,
  is_active         boolean not null default true,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now()
);

create unique index if not exists products_code_key on public.products (code);

alter table public.products enable row level security;

-- Public shop only sees active products.
create policy "Allow public select active products"
  on public.products
  for select
  to anon
  using (is_active = true);

-- Admins can see everything (including hidden items).
create policy "Allow authenticated select on products"
  on public.products
  for select
  to authenticated
  using (true);

create policy "Allow authenticated insert on products"
  on public.products
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated update on products"
  on public.products
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete on products"
  on public.products
  for delete
  to authenticated
  using (true);

-- ============================================
-- Storage bucket for product images
-- ============================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Allow authenticated upload to product-images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Allow authenticated delete from product-images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images');

create policy "Allow public read of product-images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'product-images');

-- ============================================
-- Seed the existing range (Spanjaard food-grade, NSF certified)
-- ============================================
insert into public.products
  (code, name, pack, unit, qty_per_carton, price, image_url, data_sheet_url, data_sheet_is_pdf, sort_order)
values
  ('50310404', 'Belt Dressing FG 400ml (EDP)',              'Aerosol',   '400ml', 12,   113.00, '/products/belt-dressing.jpg',       'https://www.spanjaard.biz/wp-content/uploads/2024/10/BELT-DRESSING-TDS.pdf',                  true,  1),
  ('50500200', 'Chain Lube HT (Synthetic) FG 400ml (EDP)',  'Aerosol',   '400ml', 12,   199.00, '/products/chain-lube-ht.jpg',       'https://www.spanjaard.biz/product/synthetic-chain-lube-ht/',                                 false, 2),
  ('50500201', 'Chain Lube WR (Synthetic) FG 400ml (EDP)',  'Aerosol',   '400ml', 12,   252.00, '/products/chain-lube-wr.jpg',       'https://www.spanjaard.biz/product/synthetic-chain-lube-wr/',                                 false, 3),
  ('51181400', 'FMG X Spray FG 400ml (EDP)',                'Aerosol',   '400ml', 12,    98.00, '/products/fmg-x-spray.jpg',         'https://www.spanjaard.biz/product/fmg-x-spray/',                                             false, 4),
  ('51180400', 'FMG X Grease FG 400g Cartridge (EDP)',      'Cartridge', '400g',  12,   247.00, '/products/fmg-x-grease.jpg',        'https://www.spanjaard.biz/product/fmg-x-nsf-h1/',                                            false, 5),
  ('51170500', 'FMG X Grease 500g FG (EDP)',                'Tin',       '500g',  12,   272.00, '/products/fmg-x-grease.jpg',        'https://www.spanjaard.biz/product/fmg-x-nsf-h1/',                                            false, 6),
  ('51170006', 'FMG-X Grease 4.5kg',                        'Bucket',    '4.5kg',  1,  1988.00, '/products/fmg-x-grease.jpg',        'https://www.spanjaard.biz/product/fmg-x-nsf-h1/',                                            false, 7),
  ('51170005', 'FMG X Grease 5kg (E)',                      'Tin',       '5kg',    1,  2300.00, '/products/fmg-x-grease.jpg',        'https://www.spanjaard.biz/product/fmg-x-nsf-h1/',                                            false, 8),
  ('51170015', 'FMG X Grease 15kg (E)',                     'Drum',      '15kg',   1,  6825.00, '/products/fmg-x-grease.jpg',        'https://www.spanjaard.biz/product/fmg-x-nsf-h1/',                                            false, 9),
  ('51170016', 'FMG-X Grease 18kg',                         'Bucket',    '18kg',   1,  7800.00, '/products/fmg-x-grease.jpg',        'https://www.spanjaard.biz/product/fmg-x-nsf-h1/',                                            false, 10),
  ('51520501', 'HTS Silicone Grease FG 500g (EDP)',         'Tin',       '500g',  12,   326.00, '/products/hts-silicone-grease.jpg', 'https://www.spanjaard.biz/wp-content/uploads/2024/10/HTS-TDS-230823.pdf',                     true,  11),
  ('51520007', 'HTS Silicone Grease 4.5kg',                 'Bucket',    '4.5kg',  1,  1292.00, '/products/hts-silicone-grease.jpg', 'https://www.spanjaard.biz/wp-content/uploads/2024/10/HTS-TDS-230823.pdf',                     true,  12),
  ('51520005', 'HTS Silicone Grease 5kg (E)',               'Tin',       '5kg',    1,  2888.00, '/products/hts-silicone-grease.jpg', 'https://www.spanjaard.biz/wp-content/uploads/2024/10/HTS-TDS-230823.pdf',                     true,  13),
  ('51520015', 'HTS Silicone Grease 15kg (E)',              'Drum',      '15kg',   1,  8820.00, '/products/hts-silicone-grease.jpg', 'https://www.spanjaard.biz/wp-content/uploads/2024/10/HTS-TDS-230823.pdf',                     true,  14),
  ('51520018', 'HTS Silicone Grease 18kg',                  'Bucket',    '18kg',   1,  5021.00, '/products/hts-silicone-grease.jpg', 'https://www.spanjaard.biz/wp-content/uploads/2024/10/HTS-TDS-230823.pdf',                     true,  15),
  ('51520050', 'HTS Silicone Grease 50kg',                  'Drum',      '50kg',   1, 28455.00, '/products/hts-silicone-grease.jpg', 'https://www.spanjaard.biz/wp-content/uploads/2024/10/HTS-TDS-230823.pdf',                     true,  16),
  ('52340402', 'Lectro Kleen K2 400g (EDP)',                'Aerosol',   '400g',  12,   315.00, '/products/lectro-kleen.jpg',        'https://www.spanjaard.biz/wp-content/uploads/2024/10/Lectro-Kleen-TDS-.pdf',                  true,  17),
  ('53750225', 'Silicone Spray 200ml (EDP)',                'Aerosol',   '200ml', 24,    56.00, '/products/silicone-spray.webp',     'https://www.spanjaard.biz/wp-content/uploads/2024/10/Silicone-Spray-TDS-.pdf',                true,  18),
  ('53750403', 'Silicone Spray 400ml (EDP)',                'Aerosol',   '400ml', 12,    72.00, '/products/silicone-spray.webp',     'https://www.spanjaard.biz/wp-content/uploads/2024/10/Silicone-Spray-TDS-.pdf',                true,  19),
  ('53750405', 'Silicone Spray FG 400ml (EDP)',             'Aerosol',   '400ml', 12,    80.00, '/products/silicone-spray.webp',     'https://www.spanjaard.biz/wp-content/uploads/2024/10/Silicone-Spray-TDS-.pdf',                true,  20),
  ('53731100', 'Silicone Paste 100g (EDP)',                 'Tube',      '100g',  24,   109.00, '/products/silicone-paste.jpg',      'https://www.spanjaard.biz/product/silicone-paste-nsf-h1/',                                   false, 21),
  ('53740501', 'Silicone Paste FG 500g (EDP)',              'Tin',       '500g',  12,   326.00, '/products/silicone-paste.jpg',      'https://www.spanjaard.biz/product/silicone-paste-nsf-h1/',                                   false, 22),
  ('53740006', 'Silicone Paste 4.5kg',                      'Bucket',    '4.5kg',  1,  1309.00, '/products/silicone-paste.jpg',      'https://www.spanjaard.biz/product/silicone-paste-nsf-h1/',                                   false, 23),
  ('53740005', 'Silicone Paste 5kg (E)',                    'Tin',       '5kg',    1,  2888.00, '/products/silicone-paste.jpg',      'https://www.spanjaard.biz/product/silicone-paste-nsf-h1/',                                   false, 24),
  ('53740015', 'Silicone Paste 15kg (E)',                   'Drum',      '15kg',   1,  8820.00, '/products/silicone-paste.jpg',      'https://www.spanjaard.biz/product/silicone-paste-nsf-h1/',                                   false, 25),
  ('53740018', 'Silicone Paste 18kg',                       'Bucket',    '18kg',   1,  5084.00, '/products/silicone-paste.jpg',      'https://www.spanjaard.biz/product/silicone-paste-nsf-h1/',                                   false, 26),
  ('53780400', 'Spark M/Purpose Lube FG 400ml (EDP)',       'Aerosol',   '400ml', 12,   135.00, '/products/spark.jpg',               'https://www.spanjaard.biz/wp-content/uploads/2024/10/Spark-Multi-Purpose-Lubricant-TDS-.pdf', true,  27)
on conflict (code) do nothing;
