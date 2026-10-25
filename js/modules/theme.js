window.ThemeModule = (()=>{
  const KEY='theme';
  function apply(theme){document.documentElement.dataset.theme=theme;StorageUtil.set(KEY,theme);document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.setAttribute('aria-label',theme==='dark'?'Switch to light theme':'Switch to dark theme'));}
  function init(){const saved=StorageUtil.get(KEY,null);const preferred=saved||((window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');apply(preferred);document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-toggle]');if(!b)return;apply(document.documentElement.dataset.theme==='dark'?'light':'dark');});}
  return {init,apply};
})();
