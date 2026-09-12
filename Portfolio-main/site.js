(() => {
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('.site-links');
  const closeMenu = () => { links?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); links.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-nav')) closeMenu(); });
  const page = location.pathname.split('/').pop() || 'index.html';
  links?.querySelectorAll('a').forEach(link => { if (link.getAttribute('href') === page) link.setAttribute('aria-current', 'page'); link.addEventListener('click', closeMenu); });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Preview media only runs on interaction; the main demo has native playback controls.
  document.querySelectorAll('.work-card').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    card.addEventListener('mouseenter', () => { if (!reduced.matches) video.play().catch(() => {}); });
    card.addEventListener('mouseleave', () => video.pause());
    card.addEventListener('focus', () => { if (!reduced.matches) video.play().catch(() => {}); });
    card.addEventListener('blur', () => video.pause());
  });
  if (reduced.matches) document.querySelectorAll('video[autoplay]').forEach(video => { video.autoplay = false; video.pause(); });
  // Direct project links from the homepage and a keyboard-contained gallery.
  if (typeof openProject === 'function') {
    const modal = document.querySelector('#modal');
    let returnFocus;
    const sync = () => {
      if (modal.classList.contains('open')) {
        returnFocus = document.activeElement;
        document.body.style.overflow = 'hidden';
        modal.querySelector('.close').focus();
      } else {
        document.body.style.overflow = '';
        if (returnFocus instanceof HTMLElement) returnFocus.focus();
      }
    };
    new MutationObserver(sync).observe(modal, { attributes: true, attributeFilter: ['class'] });
    modal.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const focusable = [...modal.querySelectorAll('button, a[href], video[controls], [tabindex="0"]')].filter(el => el.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    });
    const openHash = () => { const key = location.hash.slice(1); if (Object.hasOwn(projects, key)) openProject(key); };
    openHash(); window.addEventListener('hashchange', openHash);
  }
})();
