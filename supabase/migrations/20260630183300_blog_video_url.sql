-- Add optional YouTube / video URL to blog posts

alter table public.blog_posts add column if not exists video_url text;
