// Инжектира hero.html в #app-hero (същата идея като header-loader.js)
(async () => {
  const mount = document.getElementById('app-hero');
  if (!mount) return;
  try {
    const res = await fetch('/components/hero.html', { cache: 'no-cache' });
    mount.innerHTML = await res.text();
  } catch (e) {
    console.error('Hero load failed:', e);
  }
})();
