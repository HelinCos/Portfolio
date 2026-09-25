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
