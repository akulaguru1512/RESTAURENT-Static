window.FormatUtil = (() => {
  const cfg = window.RestaurantConfig;
  const money = value => new Intl.NumberFormat(cfg.restaurant.locale,{style:'currency',currency:cfg.restaurant.currency,maximumFractionDigits:0}).format(Number(value)||0);
  const date = value => new Intl.DateTimeFormat(cfg.restaurant.locale,{dateStyle:'medium'}).format(new Date(value));
  const dateTime = value => new Intl.DateTimeFormat(cfg.restaurant.locale,{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
  const escape = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
  const uid = prefix => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  return { money,date,dateTime,escape,uid };
})();
