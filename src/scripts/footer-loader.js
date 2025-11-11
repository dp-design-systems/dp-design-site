(async () => {
  const mount = document.getElementById('app-footer');
  if (!mount) return;
  const res = await fetch('/components/footer.html?v=dev'); // версия за анти-кеш
  mount.innerHTML = await res.text();
})();

