window.StorageUtil = (() => {
  const cfg = window.RestaurantConfig;
  const prefix = `${cfg.storagePrefix}:v${cfg.appVersion}:`;

  function key(name){ return `${prefix}${name}`; }
  function available(){
    try { const test = key('__test'); localStorage.setItem(test,'1'); localStorage.removeItem(test); return true; }
    catch { return false; }
  }
  function get(name, fallback){
    if(!available()) return fallback;
    try { const raw = localStorage.getItem(key(name)); return raw === null ? fallback : JSON.parse(raw); }
    catch { return fallback; }
  }
  function set(name, value){
    if(!available()) return false;
    try { localStorage.setItem(key(name), JSON.stringify(value)); window.dispatchEvent(new CustomEvent('kanso:storage',{detail:{name,value}})); return true; }
    catch { return false; }
  }
  function remove(name){ try { localStorage.removeItem(key(name)); return true; } catch { return false; } }
  function clearDemo(){
    if(!available()) return;
    Object.keys(localStorage).filter(k => k.startsWith(prefix)).forEach(k => localStorage.removeItem(k));
  }
  return { key, get, set, remove, clearDemo, available };
})();
