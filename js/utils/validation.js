window.ValidationUtil = (() => {
  const email = value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const indianPhone = value => /^[6-9]\d{9}$/.test(String(value).replace(/\D/g,''));
  const required = value => String(value ?? '').trim().length > 0;
  const futureOrToday = value => { const d=new Date(`${value}T00:00:00`); const t=new Date(); t.setHours(0,0,0,0); return d >= t; };
  function markField(input, message=''){
    const field = input.closest('.field');
    if(!field) return;
    const error = field.querySelector('.field-error');
    input.setAttribute('aria-invalid', message ? 'true':'false');
    field.classList.toggle('has-error', Boolean(message));
    if(error) error.textContent = message;
  }
  return { email, indianPhone, required, futureOrToday, markField };
})();
