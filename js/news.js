// News cards on the home page, loaded from the Facebook Graph API.
// Without a token/endpoint the placeholder posts below are shown.
// Keep the token off the public site: set `endpoint` to your own server/proxy instead.
(() => {
  const CONFIG = {
    page: 'praguehawks',
    token: '',
    endpoint: '',
    count: 3,
  };

  const PLACEHOLDER_POSTS = [
    { created_time: '2026-09-15', message: 'Začíná nová sezóna! První trénink v úterý od 17:00. Noví hráči vítáni, disky půjčíme. (ukázkový text – doplní se z FB)', permalink_url: 'https://www.facebook.com/praguehawks', full_picture: 'images/team-photo.jpg' },
    { created_time: '2026-08-24', message: 'Letní camp je za námi. Díky všem za skvělý týden, fotky najdete v galerii. (ukázkový text)', permalink_url: 'https://www.facebook.com/praguehawks' },
    { created_time: '2026-06-10', message: 'Výsledky z posledního turnaje sezóny a poděkování všem hráčům. (ukázkový text)', permalink_url: 'https://www.facebook.com/praguehawks' },
  ];

  const container = document.getElementById('news');

  const escapeHtml = s => String(s).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function truncate(s, n = 150) {
    s = (s || '').trim();
    return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s;
  }

  function formatDate(d) {
    const date = new Date(d);
    return isNaN(date) ? d : date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function postHtml(p, i) {
    const featured = i === 0;
    const media = p.full_picture
      ? `<figure class="post-media" style="background-image:url('${escapeHtml(encodeURI(p.full_picture).replace(/'/g, '%27'))}')"></figure>`
      : '';
    return `
      <article class="post${featured ? ' featured' : ''}">
        ${media}
        <div class="post-body">
          <time datetime="${escapeHtml(p.created_time)}">${escapeHtml(formatDate(p.created_time))}</time>
          <p>${escapeHtml(truncate(p.message || 'Nový příspěvek na Facebooku', featured ? 260 : 120))}</p>
          <a class="more" href="${escapeHtml(p.permalink_url)}" target="_blank" rel="noopener">Číst na Facebooku →</a>
        </div>
      </article>`;
  }

  function render(posts) {
    container.innerHTML = posts.slice(0, CONFIG.count).map((p, i) => postHtml(p, i)).join('');
  }

  function feedUrl() {
    if (CONFIG.endpoint) return CONFIG.endpoint;
    if (!CONFIG.token) return '';
    return `https://graph.facebook.com/v21.0/${CONFIG.page}/posts`
      + `?fields=message,created_time,permalink_url,full_picture&limit=${CONFIG.count}`
      + `&access_token=${encodeURIComponent(CONFIG.token)}`;
  }

  async function load() {
    const url = feedUrl();
    if (!url) return render(PLACEHOLDER_POSTS);
    try {
      const json = await (await fetch(url)).json();
      render(json.data && json.data.length ? json.data : PLACEHOLDER_POSTS);
    } catch {
      render(PLACEHOLDER_POSTS);
    }
  }

  load();
})();
