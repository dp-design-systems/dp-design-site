// scripts/pilot.js
// Логика за /pages/products/pilot.html
// - свиваеми блокове (folds)
// - overlay за основните стълбове
// - resilient embeds за демото и калкулатора

function initFolds() {
  const isDesktop = window.matchMedia('(min-width: 960px)').matches;

  document.querySelectorAll('.fold').forEach((fold, index) => {
    const head = fold.querySelector('.fold__head');
    const body = fold.querySelector('.fold__body');
    if (!head || !body) return;

    const startOpen =
      fold.dataset.open === 'true' ||
      (isDesktop && fold.dataset.desktopDefault === 'open');

    const applyState = (open) => {
      if (open) {
        fold.classList.add('fold--open');
        body.style.maxHeight = body.scrollHeight + 'px';
        head.setAttribute('aria-expanded', 'true');
      } else {
        fold.classList.remove('fold--open');
        body.style.maxHeight = '0px';
        head.setAttribute('aria-expanded', 'false');
      }
    };

    applyState(startOpen);

    head.addEventListener('click', () => {
      const isOpen = fold.classList.toggle('fold--open');
      if (isOpen) {
        body.style.maxHeight = body.scrollHeight + 'px';
        head.setAttribute('aria-expanded', 'true');
      } else {
        body.style.maxHeight = '0px';
        head.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function initOverlays() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-overlay-open]');
    if (trigger) {
      const id = trigger.getAttribute('data-overlay-open');
      const ov = document.getElementById(id);
      if (ov) {
        ov.removeAttribute('hidden');
        document.body.classList.add('overlay-open');
      }
      return;
    }

    if (
      e.target.matches('[data-overlay-close]') ||
      e.target.classList.contains('overlay')
    ) {
      const ov =
        e.target.closest('.overlay') ||
        document.querySelector('.overlay:not([hidden])');
      if (ov) {
        ov.setAttribute('hidden', '');
        document.body.classList.remove('overlay-open');
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const ov = document.querySelector('.overlay:not([hidden])');
      if (ov) {
        ov.setAttribute('hidden', '');
        document.body.classList.remove('overlay-open');
      }
    }
  });
}

function resilientEmbed(iframeId, fallbackSelector, timeoutMs = 5000) {
  const frame = document.getElementById(iframeId);
  if (!frame) return;

  const tpl = fallbackSelector
    ? document.querySelector(fallbackSelector)
    : null;

  let settled = false;

  const applyFallback = () => {
    if (settled || !tpl) return;
    settled = true;
    const parent = frame.closest('.card__media') || frame.parentElement;
    if (parent) {
      parent.innerHTML = '';
      parent.appendChild(tpl.content.cloneNode(true));
    }
  };

  const timer = setTimeout(applyFallback, timeoutMs);

  frame.addEventListener('load', () => {
    settled = true;
    clearTimeout(timer);
  });

  frame.addEventListener('error', () => {
    clearTimeout(timer);
    applyFallback();
  });
}

function initDemoLinks() {
  const link = document.getElementById('demo-download');
  if (link) {
    // TODO: подмени с реалния ZIP от GitHub, когато е готов демото
    link.href = 'https://example.com/demo/files/sample-export.zip';
  }
}

(function init() {
  initFolds();
  initOverlays();
  resilientEmbed('demo-frame', '#demo-fallback', 5000);
  // Калкулаторът в момента е локален компонент; оставяме fallback за бъдещ външен URL
  resilientEmbed('config-calc-frame', '#config-calc-fallback', 5000);
  initDemoLinks();
})();
