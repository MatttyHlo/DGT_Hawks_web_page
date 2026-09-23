// Hash router: #/<page> shows a page section, #/<anchor> scrolls to a section on the home page.
(() => {
  const PAGES = ['domu', 'treninky', 'camp', 'treneri'];
  const ANCHORS = ['aktuality', 'kontakt'];
  const HOME = 'domu';
  // Contact panel sits outside <main> and is shown only on the home page.
  const HOME_ONLY = document.getElementById('kontakt');

  function currentKey() {
    return (location.hash.replace(/^#\/?/, '') || HOME).split('?')[0];
  }

  function showPage(page) {
    document.querySelectorAll('main > .page').forEach(s =>
      s.classList.toggle('active', s.id === 'page-' + page));
    HOME_ONLY.hidden = page !== HOME;
  }

  function markNav(active) {
    document.querySelectorAll('nav.main a').forEach(a => {
      if (a.dataset.route === active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function route() {
    const key = currentKey();
    const isAnchor = ANCHORS.includes(key);
    const page = PAGES.includes(key) ? key : HOME;

    showPage(page);
    markNav(isAnchor ? key : page);

    if (isAnchor) {
      requestAnimationFrame(() =>
        document.getElementById(key).scrollIntoView({ behavior: 'smooth' }));
    } else {
      window.scrollTo(0, 0);
    }
  }

  window.addEventListener('hashchange', route);
  route();
})();
