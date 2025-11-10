(async () => {
  const mount = document.getElementById('products');
  if (!mount) return;

  try {
    const res = await fetch('/components/products.html', { cache: 'no-cache' });
    mount.innerHTML = await res.text();

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

      // Отваряне с клик по картата
      card.addEventListener('click', (e) => {
        // ако кликът е върху CTA вътре в overlay – не пречим
        if (e.target.closest('.dp-card__overlay-cta') || e.target === closeBtn) return;
        // ако вече е отворена и кликаш върху самия overlay фон → ще го обработим по-долу
        overlay.hidden = false;
        card.classList.add('is-open');
      });

      // Затваряне с Х
      closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeOverlay(card);
      });

      // Клик върху тъмния фон на overlay (не по съдържанието) → затваря
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay(card);
      });
    });

    // Клик НЯКЪДЕ ИЗВЪН карта → затваря всички отворени
    document.addEventListener('click', (e) => {
      const openCards = mount.querySelectorAll('.dp-card.is-open');
      openCards.forEach(c => {
        if (!c.contains(e.target)) closeOverlay(c);
      });
    });

    // Esc → затваря всички отворени
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      mount.querySelectorAll('.dp-card.is-open').forEach(closeOverlay);
    });

  } catch (e) {
    console.error('Products load failed:', e);
  }
})();
