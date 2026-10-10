-- Jalankan di Supabase SQL Editor untuk mendukung tipe Manga/Manhwa.
ALTER TABLE public.manga ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'manga';
ALTER TABLE public.manga DROP CONSTRAINT IF EXISTS manga_content_type_check;
ALTER TABLE public.manga ADD CONSTRAINT manga_content_type_check CHECK (content_type IN ('manga','manhwa'));

-- Fungsi penghitung pembaca yang dipakai halaman detail.
ALTER TABLE public.manga ADD COLUMN IF NOT EXISTS views bigint NOT NULL DEFAULT 0;
CREATE OR REPLACE FUNCTION public.increment_manga_views(target_manga_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  UPDATE public.manga SET views = COALESCE(views, 0) + 1 WHERE id = target_manga_id;
$$;
GRANT EXECUTE ON FUNCTION public.increment_manga_views(uuid) TO anon, authenticated;
