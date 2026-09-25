// Shared header and footer for every page. Include it where each should appear:
//   <script src="js/layout.js" data-part="header"></script>
//   <script src="js/layout.js" data-part="footer"></script>
// Loaded without defer on purpose, so the header is in place before the page is drawn.
(() => {
  const NAV = [
    ['index.html', 'Domů'],
    ['treninky.html', 'Tréninky'],
    ['camp.html', 'Discgolf camp'],
    ['treneri.html', 'Trenéři'],
    ['index.html#kontakt', 'Kontakt'],
  ];

  const page = location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';

  function navLink([href, label]) {
    const [file, hash] = href.split('#');
    const target = file.replace(/\.html$/, '');
    // On the home page, jump links stay on the page instead of reloading it.
    const url = hash && target === page ? `#${hash}` : href;
    const current = !hash && target === page ? ' aria-current="page"' : '';
    return `<a href="${url}"${current}>${label}</a>`;
  }

  const HEADER = `
<header class="site">
  <div class="wrap bar">
    <a class="brand" href="index.html">
      <img src="images/logo-header.png" alt="" width="46" height="39">
      <span class="brand-name">Prague Hawks</span>
    </a>
    <nav class="main" aria-label="Hlavní navigace">
      ${NAV.map(navLink).join('\n      ')}
    </nav>
  </div>
</header>`;

  const FOOTER = `
<footer class="site">
  <div class="wrap">
    <span>© 2026 Discgolf team Prague Hawks, z.s.</span>
    <span>Prototyp – fotky a označená místa doplnit</span>
  </div>
</footer>`;

  const script = document.currentScript;
  script.insertAdjacentHTML('afterend', script.dataset.part === 'footer' ? FOOTER : HEADER);
})();
