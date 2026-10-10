# FangManga — detail manga/manhwa, filters, ZIP chapter import

## Fitur dalam revisi
- Kartu manga membuka `detail.html` terlebih dahulu, bukan langsung ke reader.
- Halaman detail menampilkan cover, judul, jenis konten, sinopsis, genre, status, jumlah dibaca, dan daftar chapter.
- Admin bisa memilih jenis konten Manga atau Manhwa.
- Katalog menyediakan filter jenis, genre, status, pencarian judul/sinopsis, dan pengurutan terbaru/populer/rating/judul.
- Upload chapter dari gambar biasa atau satu file ZIP berisi gambar JPG/JPEG/PNG/WebP. Nama file diurutkan secara natural (misalnya 1, 2, 10).
- Chapter dan halaman disimpan ke tabel `chapters` dan `pages`, gambar disimpan di bucket Supabase Storage bernama `manga`.

## Langkah pemasangan
1. Cadangkan website lama dan ekstrak semua file dari ZIP ini ke project.
2. Di Supabase SQL Editor, jalankan `supabase-catalog-features.sql` agar kolom `content_type` dan penghitung pembaca tersedia.
3. Pastikan bucket Storage `manga` sudah dibuat dan policy Storage mengizinkan akun admin yang login untuk upload, serta pembacaan publik jika ingin memakai `getPublicUrl`.
4. Pastikan tabel yang sudah dipakai project tetap tersedia dengan skema yang sesuai: `manga` (id UUID, title, slug, cover_url, description, genres, status, created_at), `chapters` (id UUID, manga_id UUID, chapter_number, title), `pages` (chapter_id UUID, page_number, image_url).
5. Buka `admin.html`, login dengan akun Supabase Auth, buat judul manga/manhwa, lalu upload chapter.

## Catatan penting
- ZIP sebaiknya berisi gambar untuk satu chapter. Subfolder di dalam ZIP didukung, tetapi semua gambar gambar dalam ZIP akan menjadi halaman untuk chapter yang dipilih.
- Rating tertinggi disediakan sebagai opsi pengurutan jika data `rating` ada. Revisi ini belum menambahkan sistem rating pengguna yang tersimpan; kolom rating kosong akan dianggap 0.
- Jika query Supabase gagal, cek Console browser, policy RLS, bucket Storage, dan nama kolom tabel. Jalankan SQL hanya pada project Supabase yang benar setelah membuat backup.


## Integrasi MangaDex
1. Jalankan `supabase-mangadex.sql` di SQL Editor Supabase setelah backup.
2. Deploy seluruh file yang sudah diperbarui.
3. Buka `admin.html`, login, cari judul di panel **Scraper MangaDex**, pilih bahasa chapter, lalu tekan **IMPOR + CHAPTER**.
4. Manga dan daftar chapter masuk ke katalog FangManga. Reader mengambil gambar chapter secara langsung dari endpoint MangaDex@Home saat dibaca, sehingga URL gambar yang sementara tidak disimpan permanen.

**Penting:** API MangaDex mensyaratkan atribusi ke MangaDex dan grup scanlation, menghormati permintaan penghapusan, serta melarang iklan/layanan berbayar untuk penggunaan API sesuai kebijakan mereka. Impor dibatasi ke konten aman (safe/suggestive) pada pencarian ini. Gunakan hanya chapter yang tersedia untuk penggunaan yang diizinkan.


## Perbaikan Vercel untuk `Failed to fetch`
ZIP ini menambahkan `api/mangadex.js` sebagai serverless proxy Vercel dan mengubah pencarian/impor MangaDex agar melewati `/api/mangadex`. Upload/deploy semua isi ZIP ke root project Vercel (folder `api` harus berada di root sejajar dengan `admin.html`). Setelah deploy berstatus Ready, buka `/api/mangadex?path=%2Fmanga%3Flimit%3D1` pada domain Vercel untuk menguji proxy; respons normal berupa JSON MangaDex. Jika mendapat 502, periksa Runtime Logs.
