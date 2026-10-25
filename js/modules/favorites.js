window.FavoritesModule = (()=>{
  const KEY='favorites', RECENT='recent';
  const get=()=>StorageUtil.get(KEY,[]).filter(id=>MenuData.some(m=>m.id===id));
  const set=list=>StorageUtil.set(KEY,[...new Set(list)]);
  function toggle(id){const list=get();const i=list.indexOf(id);if(i>=0){list.splice(i,1);Notify.toast('Removed from favorites');}else{list.push(id);Notify.toast('Saved to favorites','success');}set(list);syncButtons();return i<0;}
  function has(id){return get().includes(id)}
  function addRecent(id){let list=StorageUtil.get(RECENT,[]).filter(x=>x!==id&&MenuData.some(m=>m.id===x));list.unshift(id);list=list.slice(0,RestaurantConfig.recentlyViewedLimit);StorageUtil.set(RECENT,list)}
  function recent(){return StorageUtil.get(RECENT,[]).map(id=>MenuData.find(m=>m.id===id)).filter(Boolean)}
  function recommendations(){const ids=[...get(),...StorageUtil.get(RECENT,[])];const seeds=ids.map(id=>MenuData.find(m=>m.id===id)).filter(Boolean);if(!seeds.length)return [...MenuData].sort((a,b)=>b.popularity-a.popularity).slice(0,4);const cuisines=new Set(seeds.map(x=>x.cuisine));return MenuData.filter(x=>!ids.includes(x.id)&&cuisines.has(x.cuisine)&&x.available).sort((a,b)=>b.rating-a.rating).slice(0,4)}
  function syncButtons(){document.querySelectorAll('[data-favorite-id]').forEach(b=>{const active=has(b.dataset.favoriteId);b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));b.textContent=active?'♥':'♡';});}
  function init(){document.addEventListener('click',e=>{const b=e.target.closest('[data-favorite-id]');if(b)toggle(b.dataset.favoriteId);});syncButtons();}
  return {get,toggle,has,addRecent,recent,recommendations,init,syncButtons};
})();
