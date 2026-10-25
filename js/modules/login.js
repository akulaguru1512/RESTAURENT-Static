window.LoginModule = (() => {
  const PROFILE_KEY = 'profile';
  const defaultProfile = {signedIn:false,name:'Demo Guest',email:'',phone:'',preferences:'Mild spice, window seating',addresses:[],points:780};

  function profile(){
    const stored = StorageUtil.get(PROFILE_KEY, {});
    return {...defaultProfile, ...(stored && typeof stored === 'object' ? stored : {})};
  }
  function saveProfile(value){ return StorageUtil.set(PROFILE_KEY, value); }
  function setError(form, name, message=''){
    const input = form.elements[name];
    const error = form.querySelector(`[data-error-for="${name}"]`);
    if(error) error.textContent = message;
    if(input && input.setAttribute){
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      input.closest('.field')?.classList.toggle('has-error', Boolean(message));
    }
  }
  function validEmail(value){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()); }
  function validPhone(value){ return /^[6-9]\d{9}$/.test(String(value).trim()); }
  function validatePassphrase(value){ return String(value).length >= 6; }

  function switchTab(name){
    document.querySelectorAll('[data-auth-tab]').forEach(btn => {
      const active = btn.dataset.authTab === name;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-auth-panel]').forEach(panel => {
      panel.hidden = panel.dataset.authPanel !== name;
    });
    const panel = document.querySelector(`[data-auth-panel="${name}"]`);
    panel?.querySelector('input')?.focus();
  }

  function handleLogin(form){
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    const passphrase = String(data.get('passphrase') || '');
    let ok = true;
    setError(form,'email'); setError(form,'passphrase');
    if(!validEmail(email)){ setError(form,'email','Enter a valid email address.'); ok = false; }
    if(!validatePassphrase(passphrase)){ setError(form,'passphrase','Use at least 6 demonstration characters.'); ok = false; }
    if(!ok) return;

    const p = profile();
    p.signedIn = true;
    p.email = email;
    if(!p.name || p.name === 'Demo Guest') p.name = email.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g, c=>c.toUpperCase()) || 'Kansō Demo Member';
    saveProfile(p);
    sessionStorage.setItem('kanso:demoSession','active');
    form.reset();
    Notify.toast('Demo profile activated. No password was stored.','success');
    setTimeout(()=>{ location.href = 'profile.html'; }, 350);
  }

  function handleRegister(form){
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const passphrase = String(data.get('passphrase') || '');
    const accepted = data.get('terms') === 'on';
    let ok = true;
    ['name','email','phone','passphrase','terms'].forEach(field=>setError(form,field));
    if(name.length < 2){ setError(form,'name','Enter at least 2 characters.'); ok = false; }
    if(!validEmail(email)){ setError(form,'email','Enter a valid email address.'); ok = false; }
    if(!validPhone(phone)){ setError(form,'phone','Enter a valid 10-digit Indian mobile number.'); ok = false; }
    if(!validatePassphrase(passphrase)){ setError(form,'passphrase','Use at least 6 demonstration characters.'); ok = false; }
    if(!accepted){ setError(form,'terms','Please confirm you understand the demo limitation.'); ok = false; }
    if(!ok) return;

    const existing = profile();
    saveProfile({...existing,signedIn:true,name,email,phone});
    sessionStorage.setItem('kanso:demoSession','active');
    form.reset();
    Notify.toast('Local demo profile created. The passphrase was not saved.','success');
    setTimeout(()=>{ location.href = 'profile.html'; }, 350);
  }

  function init(){
    document.addEventListener('click', event => {
      const tab = event.target.closest('[data-auth-tab]');
      if(tab) switchTab(tab.dataset.authTab);

      const toggle = event.target.closest('[data-password-toggle]');
      if(toggle){
        const input = toggle.parentElement.querySelector('input');
        const showing = input.type === 'text';
        input.type = showing ? 'password' : 'text';
        toggle.textContent = showing ? 'Show' : 'Hide';
        toggle.setAttribute('aria-label', `${showing ? 'Show' : 'Hide'} demo passphrase`);
      }

      if(event.target.closest('[data-demo-fill]')){
        const form = document.querySelector('[data-login-form]');
        form.elements.email.value = 'guest@kansotable.demo';
        form.elements.passphrase.value = 'kanso-demo';
        Notify.toast('Demo-only details filled in.','success');
      }
    });

    document.addEventListener('submit', event => {
      if(event.target.matches('[data-login-form]')){ event.preventDefault(); handleLogin(event.target); }
      if(event.target.matches('[data-register-form]')){ event.preventDefault(); handleRegister(event.target); }
    });

    const p = profile();
    if(p.signedIn){
      const emailField = document.querySelector('[data-login-form] [name="email"]');
      if(emailField && p.email) emailField.value = p.email;
    }
  }

  return {init};
})();
