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
document.querySelectorAll('.work-card').forEach(card => {
  const link = card.querySelector('.work-link');
  if (link) {
    card.classList.add('work-card--clickable');
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      window.open(link.href, '_blank', 'noopener');
    });
  }
});
