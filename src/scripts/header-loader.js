// Вмъква header.html във всички страници.
// Без DOMContentLoaded – изпълнява се при зареждане на скрипта.
(async () => {
  const mount = document.getElementById('app-header');
  if (!mount) return;
  try {
    const res = await fetch('/components/header.html', { cache: 'no-cache' });
    const html = await res.text();
    mount.innerHTML = html;

    // Инициализация (burger, език, mobile search)
    const burger = mount.querySelector('.dp-burger');
    const mobileMenu = mount.querySelector('#dp-mobile-menu');
    if (burger && mobileMenu) {
      burger.addEventListener('click', () => {
        const open = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', String(!open));
        mobileMenu.hidden = open;
      });
    }

    // Език – демо селектор (може да закачи реална локализация по-късно)
    const langBtns = mount.querySelectorAll('.dp-lang-btn');
    langBtns.forEach(btn => btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      // TODO: тук можем да запишем предпочитание в localStorage
    }));

    // Mobile search – отваря input като overlay (минимален UX)
    const searchBtn = mount.querySelector('.dp-search-icon');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const q = prompt('Search'); // минимално, по-късно – custom overlay
        if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
      });
    }
  } catch (e) {
    console.error('Header load failed:', e);
  }
})();
