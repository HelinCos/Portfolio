const toggle = document.querySelector('.menu-toggle');
const tabs = document.querySelector('.tabs');

toggle.addEventListener('click', () => {
  const isOpen = tabs.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
});

tabs.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    tabs.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  });
});

// Ganze Arbeiten-Karte klickbar machen, wenn sie einen Link enthält
const modal = document.getElementById('pdf-modal');
const modalFrame = document.getElementById('pdf-modal-frame');

function openInModalOrTab(href) {
  if (href.toLowerCase().endsWith('.pdf')) {
    modalFrame.src = href;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  } else {
    window.open(href, '_blank', 'noopener');
  }
}

if (modal) {
  modal.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modalFrame.src = '';
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modalFrame.src = '';
    }
  });
}

document.querySelectorAll('.work-card').forEach(card => {
  const link = card.querySelector('.work-link');
  if (link) {
    card.classList.add('work-card--clickable');
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        e.preventDefault();
        openInModalOrTab(link.href);
        return;
      }
      openInModalOrTab(link.href);
    });
  }
});
