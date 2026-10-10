// Vercel serverless proxy for the public MangaDex API.
// Keeps browser requests same-origin to avoid browser-side CORS/network failures.
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawPath = typeof req.query.path === 'string' ? req.query.path : '';
  let parsedPath;
  try {
    parsedPath = new URL(rawPath, 'https://api.mangadex.org');
  } catch (_) {
    return res.status(400).json({ error: 'Invalid MangaDex API path' });
  }
  // Allow only MangaDex manga endpoints; query strings such as ?title=... are valid.
  if (!(parsedPath.pathname === '/manga' || parsedPath.pathname.startsWith('/manga/')) || parsedPath.pathname.includes('..') || parsedPath.pathname.includes('\\') || parsedPath.origin !== 'https://api.mangadex.org') {
    return res.status(400).json({ error: 'Invalid MangaDex API path' });
  }

  try {
    const upstream = await fetch('https://api.mangadex.org' + parsedPath.pathname + parsedPath.search, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FangManga/1.0 (MangaDex API proxy)'
      }
    });
    const body = await upstream.text();
    return res.status(upstream.status).send(body);
  } catch (error) {
    console.error('MangaDex proxy failed:', error);
    return res.status(502).json({ error: 'Vercel tidak dapat menghubungi MangaDex. Periksa Runtime Logs dan coba lagi.' });
  }
};
