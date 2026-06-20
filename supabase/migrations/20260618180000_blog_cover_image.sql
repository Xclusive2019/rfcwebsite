-- Add cover_image column to blog_posts
alter table public.blog_posts
  add column if not exists cover_image text;

-- Storage bucket for blog images
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload
create policy "Allow authenticated upload to blog-images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'blog-images');

-- Allow authenticated users to delete their uploads
create policy "Allow authenticated delete from blog-images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'blog-images');

-- Allow public read of blog images
create policy "Allow public read of blog-images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'blog-images');
