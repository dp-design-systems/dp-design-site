// Инжектира компонент и добавя логика за "Details" (tap-to-expand на мобилно)
(async () => {
  const mount = document.getElementById('products');
  if (!mount) return;

  try {
    const res = await fetch('/components/products.html', { cache: 'no-cache' });
    mount.innerHTML = await res.text();

    // Клик върху карта -> overlay; втори клик/ESC -> затваряне
    const cards = mount.querySelectorAll('.dp-card');

    function closeOverlay(card){
      const ov = card.querySelector('.dp-card__overlay');
      if (!ov) return;
      ov.hidden = true;
      card.classList.remove('is-open');
    }

    cards.forEach(card => {
      const overlay = card.querySelector('.dp-card__overlay');
      const closeBtn = card.querySelector('.dp-card__close');

      // Отваряне
      card.addEventListener('click', (e) => {
        // ако кликът е върху CTA вътре в overlay – не пречим
        if (e.target.closest('.dp-card__overlay-cta') || e.target === closeBtn) return;
        overlay.hidden = false;
        card.classList.add('is-open');
      });

      // Затваряне с X
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeOverlay(card);
      });
    });

    // ESC за затваряне на всички отворени
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      mount.querySelectorAll('.dp-card.is-open').forEach(closeOverlay);
    });
  } catch (e) {
    console.error('Products load failed:', e);
  }
})();

