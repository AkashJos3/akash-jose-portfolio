(() => {
  let saved;
  try { saved = localStorage.getItem('akash-theme'); } catch {}
  document.documentElement.dataset.theme = saved === 'dark' || saved === 'light'
    ? saved : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
})();
