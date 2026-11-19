(() => {
  const script = document.currentScript;
  const base = script ? new URL('.', script.src) : new URL('.', location.href);
  const logo = new URL('icons/icon-192.png', base).toString();
  let deferredPrompt = null;
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const style = document.createElement('style');
  style.textContent = `
    #ml-install-toast{position:fixed;z-index:2147483000;left:50%;bottom:calc(14px + env(safe-area-inset-bottom));transform:translate(-50%,14px);width:min(520px,calc(100vw - 24px));box-sizing:border-box;opacity:0;pointer-events:none;transition:opacity .22s ease,transform .22s ease;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    #ml-install-toast.ml-visible{opacity:1;transform:translate(-50%,0);pointer-events:auto}
    #ml-install-toast .ml-install-card{display:grid;grid-template-columns:54px minmax(0,1fr) auto;align-items:center;gap:12px;padding:13px 14px;background:#fff;color:#172b3a;border:1px solid rgba(16,42,67,.14);border-radius:18px;box-shadow:0 8px 34px rgba(0,0,0,.22)}
    #ml-install-toast .ml-install-icon{width:52px;height:52px;border-radius:12px;object-fit:cover;display:block}
    #ml-install-toast .ml-install-copy{min-width:0;text-align:left}
    #ml-install-toast h2{font-size:15px;line-height:1.2;margin:0 0 4px;font-weight:800}
    #ml-install-toast p{font-size:12px;line-height:1.35;color:#607080;margin:0}
    #ml-install-toast .ml-install-actions{display:flex;align-items:center;gap:7px}
    #ml-install-toast button{font:inherit;cursor:pointer}
    #ml-install-toast .ml-install-primary{border:0;border-radius:999px;background:#4B0E7A;color:#fff;padding:10px 14px;font-size:12px;font-weight:800;white-space:nowrap}
    #ml-install-toast .ml-install-close{border:0;background:transparent;color:#607080;font-size:23px;line-height:1;padding:3px}
    #ml-install-toast .ml-install-help{grid-column:1/-1;padding:10px 12px;border-radius:10px;background:#f1f5f9;text-align:left;font-size:12px;line-height:1.45;color:#334155}
    @media(max-width:420px){#ml-install-toast .ml-install-card{grid-template-columns:44px minmax(0,1fr) auto;gap:9px;padding:11px}#ml-install-toast .ml-install-icon{width:44px;height:44px}#ml-install-toast h2{font-size:14px}#ml-install-toast p{font-size:11px}#ml-install-toast .ml-install-primary{padding:9px 11px;font-size:11px}}
    @media(prefers-reduced-motion:reduce){#ml-install-toast{transition:none}}
  `;
  document.head.appendChild(style);

  function showInstall() {
    if (isStandalone() || document.getElementById('ml-install-toast')) return;
    const toast = document.createElement('div');
    toast.id = 'ml-install-toast';
    toast.innerHTML = `<div class="ml-install-card" role="region" aria-label="Install ML Donations">
      <img class="ml-install-icon" src="${logo}" alt="ML Donations logo">
      <div class="ml-install-copy"><h2>Install ML Donations</h2><p>Keep us one tap away on your device.</p></div>
      <div class="ml-install-actions"><button class="ml-install-primary" type="button" id="ml-install-action">Install</button><button class="ml-install-close" type="button" aria-label="Dismiss install suggestion">×</button></div>
      <div class="ml-install-help" id="ml-install-help" hidden></div>
    </div>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('ml-visible'));
    const close = () => { toast.classList.remove('ml-visible'); setTimeout(() => toast.remove(), 240); };
    toast.querySelector('.ml-install-close').addEventListener('click', close);
    const action = toast.querySelector('#ml-install-action');
    const help = toast.querySelector('#ml-install-help');
    action.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (choice && choice.outcome === 'accepted') close();
        else { help.hidden = false; help.textContent = 'If the install prompt did not appear, use your browser menu and choose Install app or Add to Home Screen.'; }
        return;
      }
      help.hidden = false;
      if (isIOS()) {
        help.innerHTML = 'On iPhone or iPad, tap <b>Share</b> in Safari, choose <b>Add to Home Screen</b>, then tap <b>Add</b>.';
      } else if (isSafari) {
        help.textContent = 'In Safari on Mac, use the File or Share menu and choose Add to Dock when available.';
      } else {
        help.textContent = 'Open your browser menu (⋮ or ⋯) and choose Install app, Install this site as an app, or Add to Home Screen.';
      }
      action.textContent = 'Got it';
      action.onclick = close;
    });
  }

  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredPrompt = event; });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; const toast = document.getElementById('ml-install-toast'); if (toast) toast.remove(); });
  window.addEventListener('load', () => { if (!isStandalone()) setTimeout(showInstall, 1100); });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register(new URL('service-worker.js', base).toString(), { scope: base.pathname }).catch(error => console.warn('Service worker registration failed', error)));
  }
})();
