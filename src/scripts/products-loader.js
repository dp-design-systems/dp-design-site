// Инжектира компонент и добавя логика за "Details" (tap-to-expand на мобилно)
(async () => {
  const mount = document.getElementById('products');
  if (!mount) return;

  try {
    const res = await fetch('/components/products.html', { cache: 'no-cache' });
    mount.innerHTML = await res.text();

    // Детайли (expand/collapse)
    const moreBtns = mount.querySelectorAll('.dp-card__more');
    moreBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('aria-controls');
        const panel = id ? mount.querySelector(`#${id}`) : null;
        if (!panel) return;
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        panel.hidden = isOpen;
      });
    });
  } catch (e) {
    console.error('Products load failed:', e);
  }
})();
