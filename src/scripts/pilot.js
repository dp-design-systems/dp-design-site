// scripts/pilot.js
// Page-specific behavior for /pages/products/pilot.html
// - Modal open/close via <dialog>
// - Resilient embeds (demo + calculator fallbacks)

function bindModals(){
  document.addEventListener('click', (e)=>{
    const opener = e.target.closest('[data-open]');
    if(opener){
      const id = opener.getAttribute('data-open');
      const dlg = document.getElementById(id);
      if(dlg && dlg.showModal){ dlg.showModal(); }
    }
  });
}

async function resilientEmbed(iframeId, fallbackSelector){
  const frame = document.getElementById(iframeId);
  if(!frame) return;
  // Give the iframe a chance to load; if it errors or times out, render fallback
  let loaded = false;
  const timer = setTimeout(()=>{
    if(!loaded){
      const tpl = document.querySelector(fallbackSelector);
      if(tpl){
        const parent = frame.closest('.card__media');
        if(parent){ parent.innerHTML = ''; parent.appendChild(tpl.content.cloneNode(true)); }
      }
    }
  }, 6000);

  frame.addEventListener('load', ()=>{ loaded = true; clearTimeout(timer); });
  frame.addEventListener('error', ()=>{
    const tpl = document.querySelector(fallbackSelector);
    if(tpl){
      const parent = frame.closest('.card__media');
      if(parent){ parent.innerHTML = ''; parent.appendChild(tpl.content.cloneNode(true)); }
    }
  });
}

function initDemoLinks(){
  const link = document.getElementById('demo-download');
  if(link){
    // Placeholder: update when the demo repo is ready
    link.href = 'https://example.com/demo/files/sample-export.zip';
  }
}

// Bootstrap
(function init(){
  bindModals();
  resilientEmbed('demo-frame', '#demo-fallback');
  // Calculator iframe uses its own static local fallback file, so we don't need a template
  resilientEmbed('config-calc-frame', '#config-calc-fallback');
  initDemoLinks();
})();
