
msg.textContent = 'Mengambil chapter dari MangaDex...';

const lang = $('#mdLanguage').value;
let offset = 0;
let all = [];

for (let n = 0; n < 4; n++) {
  const u = new URL(`${MD_API}/manga/${id}/feed`);

  u.searchParams.set('limit', '100');
  u.searchParams.set('offset', String(offset));
  u.searchParams.set('order[chapter]', 'desc');

  // "all" berarti jangan memasang filter bahasa.
  if (lang !== 'all') {
    u.searchParams.set('translatedLanguage[]', lang);
  }

  // Hanya mengambil chapter yang tersedia di feed MangaDex.
  u.searchParams.set('includeExternalUrl', '0');

  const feed = await mdFetch(u);
  all.push(...(feed.data || []));

  if (all.length >= 100 || offset + 100 >= feed.total) {
    break;
  }

  offset += 100;
}

let imported = 0;
let skipped = 0;

for (const ch of all) {
  const num = parseFloat(ch.attributes?.chapter);

  if (!Number.isFinite(num)) {
    skipped++;
    continue;
  }

  const { data: found, error: findErr } = await sb
    .from('chapters')
    .select('id')
    .eq('mangadex_id', ch.id)
    .maybeSingle();

  if (findErr) {
    throw Error(
      'Periksa migrasi database untuk kolom chapters.mangadex_id: ' +
      findErr.message
    );
  }

  if (found) {
    skipped++;
    continue;
  }

  const { error } = await sb.from('chapters').insert({
    manga_id: existing.id,
    chapter_number: num,
    title: ch.attributes?.title || '',
    mangadex_id: ch.id,
    translated_language: ch.attributes?.translatedLanguage || lang,
    external_url: ch.attributes?.externalUrl || null
  });

  if (error) {
    throw Error('Gagal impor chapter: ' + error.message);
  }

  imported++;
}

msg.textContent =
  `Selesai: ${title}. Chapter baru diimpor: ${imported}; ` +
  `dilewati: ${skipped}. Bahasa: ${lang}.`;

await loadManga();
