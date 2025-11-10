// Вмъква header.html и инициализира поведението (без DOMContentLoaded)
(async () => {
  const mount = document.getElementById('app-header');
  if (!mount) return;

  try {
    const res = await fetch('/components/header.html', { cache: 'no-cache' });
    const html = await res.text();
    mount.innerHTML = html;

    // Burger + Drawer
    const burger = mount.querySelector('.dp-burger');
    const drawer = mount.querySelector('#dp-drawer');
    const overlay = mount.querySelector('.dp-overlay');

    const closeDrawer = () => {
      if (!burger || !drawer || !overlay) return;
      burger.setAttribute('aria-expanded', 'false');
      drawer.hidden = true;
      overlay.hidden = true;
      document.documentElement.style.overflow = '';
    };

    const openDrawer = () => {
      if (!burger || !drawer || !overlay) return;
      burger.setAttribute('aria-expanded', 'true');
      drawer.hidden = false;
      overlay.hidden = false;
      // малка рамка за да позволим CSS транзишъна
      requestAnimationFrame(() => { drawer.style.transform = 'translateX(0)'; });
      document.documentElement.style.overflow = 'hidden';
    };

    if (burger && drawer && overlay) {
      burger.addEventListener('click', () => {
        const open = burger.getAttribute('aria-expanded') === 'true';
        // ресет на начална позиция при отваряне
        if (!open) drawer.style.transform = 'translateX(-100%)';
        open ? closeDrawer() : openDrawer();
      });

      overlay.addEventListener('click', closeDrawer);
      window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

      // авто-затваряне при resize към десктоп
      const mq = window.matchMedia('(min-width: 721px)');
      mq.addEventListener('change', e => { if (e.matches) closeDrawer(); });
    }

    // Езици (визуален state за сега)
    const langBtns = mount.querySelectorAll('.dp-lang-btn');
    langBtns.forEach(btn => btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    }));

    // Търсене: на мобилно показваме prompt за простота (по-късно overlay)
    const searchBtn = mount.querySelector('.dp-search-icon');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const q = prompt('Search');
        if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
      });
    }
  } catch (e) {
    console.error('Header load failed:', e);
  }
})();
