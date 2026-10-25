window.Notify = (() => {
  function ensure(){
    let wrap = document.querySelector('.toast-stack');
    if(!wrap){ wrap=document.createElement('div'); wrap.className='toast-stack'; wrap.setAttribute('aria-live','polite'); document.body.append(wrap); }
    return wrap;
  }
  function toast(message, type='info'){
    const el=document.createElement('div'); el.className=`toast toast--${type}`; el.textContent=message; ensure().append(el);
    requestAnimationFrame(()=>el.classList.add('is-visible'));
    setTimeout(()=>{ el.classList.remove('is-visible'); setTimeout(()=>el.remove(),220); },3200);
  }
  function confirmDialog({title='Please confirm',message='Continue?',confirmText='Confirm',danger=false}={}){
    return new Promise(resolve=>{
      const overlay=document.createElement('div'); overlay.className='dialog-backdrop';
      overlay.innerHTML=`<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialogTitle"><h2 id="dialogTitle">${FormatUtil.escape(title)}</h2><p>${FormatUtil.escape(message)}</p><div class="dialog__actions"><button class="btn btn--ghost" data-action="cancel">Cancel</button><button class="btn ${danger?'btn--danger':'btn--primary'}" data-action="confirm">${FormatUtil.escape(confirmText)}</button></div></div>`;
      document.body.append(overlay); const focusable=[...overlay.querySelectorAll('button')]; focusable[0].focus();
      const close = answer => { overlay.remove(); resolve(answer); };
      overlay.addEventListener('click',e=>{ const a=e.target.dataset.action; if(a==='confirm') close(true); if(a==='cancel'||e.target===overlay) close(false); });
      overlay.addEventListener('keydown',e=>{ if(e.key==='Escape') close(false); });
    });
  }
  return { toast, confirmDialog };
})();
