-- PUBLIC READING: anyone can read manga/chapter/page records.
create policy "public read manga" on public.manga for select using (true);
create policy "public read chapters" on public.chapters for select using (true);
create policy "public read pages" on public.pages for select using (true);

-- ADMIN WRITES: only authenticated users can write. For a single-admin project,
-- replace the UUID below with your admin user's auth.users.id for tighter security.
create policy "authenticated insert manga" on public.manga for insert to authenticated with check (true);
create policy "authenticated update manga" on public.manga for update to authenticated using (true) with check (true);
create policy "authenticated delete manga" on public.manga for delete to authenticated using (true);
create policy "authenticated insert chapters" on public.chapters for insert to authenticated with check (true);
create policy "authenticated update chapters" on public.chapters for update to authenticated using (true) with check (true);
create policy "authenticated delete chapters" on public.chapters for delete to authenticated using (true);
create policy "authenticated insert pages" on public.pages for insert to authenticated with check (true);
create policy "authenticated update pages" on public.pages for update to authenticated using (true) with check (true);
create policy "authenticated delete pages" on public.pages for delete to authenticated using (true);

-- Storage: public bucket already makes files readable. Authenticated users may upload/delete.
create policy "authenticated upload manga files" on storage.objects for insert to authenticated with check (bucket_id = 'manga');
create policy "authenticated update manga files" on storage.objects for update to authenticated using (bucket_id = 'manga') with check (bucket_id = 'manga');
create policy "authenticated delete manga files" on storage.objects for delete to authenticated using (bucket_id = 'manga');
