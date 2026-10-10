-- FangManga x MangaDex integration. Run in Supabase SQL Editor after backup.
ALTER TABLE public.manga ADD COLUMN IF NOT EXISTS mangadex_id text UNIQUE;
ALTER TABLE public.manga ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual';
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS mangadex_id text UNIQUE;
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS translated_language text;
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS external_url text;
CREATE INDEX IF NOT EXISTS chapters_manga_chapter_number_idx ON public.chapters (manga_id, chapter_number DESC);
