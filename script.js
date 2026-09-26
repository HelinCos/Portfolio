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
const modalContent = document.getElementById('pdf-modal-content');
const modalFrame = document.getElementById('pdf-modal-frame');
const bookViewer = document.getElementById('book-viewer');
const canvasLeft = document.getElementById('book-canvas-left');
const canvasRight = document.getElementById('book-canvas-right');
const pageIndicator = document.getElementById('book-page-indicator');
const btnPrev = bookViewer ? bookViewer.querySelector('.book-prev') : null;
const btnNext = bookViewer ? bookViewer.querySelector('.book-next') : null;

const galleryViewer = document.getElementById('gallery-viewer');
const galleryImage = document.getElementById('gallery-image');
const galleryIndicator = document.getElementById('gallery-indicator');
const galleryPrevBtn = galleryViewer ? galleryViewer.querySelector('.gallery-prev') : null;
const galleryNextBtn = galleryViewer ? galleryViewer.querySelector('.gallery-next') : null;
let galleryImages = [];
let galleryIndex = 0;

// Diese PDFs bekommen den Buch-Viewer mit zwei Seiten nebeneinander
const BOOK_VIEWER_FILES = ['wasser.pdf', 'laerm.pdf'];

let pdfDoc = null;
let spreadStart = 1;

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

function isBookPdf(href) {
  return BOOK_VIEWER_FILES.some(name => href.endsWith(name));
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modalFrame.src = '';
  modalFrame.style.display = 'none';
  bookViewer.classList.remove('active');
  galleryViewer.classList.remove('active');
  modalContent.classList.remove('book-mode');
  pdfDoc = null;
  galleryImages = [];
}

function openIframe(href) {
  bookViewer.classList.remove('active');
  galleryViewer.classList.remove('active');
  modalContent.classList.remove('book-mode');
  modalFrame.style.display = 'block';
  modalFrame.src = href;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

async function renderPageToCanvas(pageNum, canvas) {
  if (!pageNum || pageNum < 1 || pageNum > pdfDoc.numPages) {
    canvas.style.display = 'none';
    return;
  }
  canvas.style.display = 'block';
  const page = await pdfDoc.getPage(pageNum);
  const raw = page.getViewport({ scale: 1 });
  const maxHeight = Math.min(window.innerHeight * 0.76, 900);
  const scale = maxHeight / raw.height;
  const viewport = page.getViewport({ scale });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
}

async function renderSpread() {
  const total = pdfDoc.numPages;
  let leftNum, rightNum;
  if (spreadStart === 1) {
    leftNum = 1;
    rightNum = null;
  } else {
    leftNum = spreadStart;
    rightNum = spreadStart + 1 <= total ? spreadStart + 1 : null;
  }
  await renderPageToCanvas(leftNum, canvasLeft);
  await renderPageToCanvas(rightNum, canvasRight);
  pageIndicator.textContent = rightNum ? `Seite ${leftNum}–${rightNum} von ${total}` : `Seite ${leftNum} von ${total}`;
  if (btnPrev) btnPrev.disabled = spreadStart <= 1;
  if (btnNext) btnNext.disabled = (rightNum || leftNum) >= total;
}

async function openBookViewer(href) {
  modalFrame.style.display = 'none';
  galleryViewer.classList.remove('active');
  bookViewer.classList.add('active');
  modalContent.classList.add('book-mode');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  pageIndicator.textContent = 'Lädt …';
  const loadingTask = pdfjsLib.getDocument(href);
  pdfDoc = await loadingTask.promise;
  spreadStart = 1;
  renderSpread();
}

function renderGalleryImage() {
  galleryImage.src = galleryImages[galleryIndex];
  galleryIndicator.textContent = `Bild ${galleryIndex + 1} von ${galleryImages.length}`;
  if (galleryPrevBtn) galleryPrevBtn.disabled = galleryIndex === 0;
  if (galleryNextBtn) galleryNextBtn.disabled = galleryIndex === galleryImages.length - 1;
}

function openGallery(images) {
  galleryImages = images;
  galleryIndex = 0;
  modalFrame.style.display = 'none';
  bookViewer.classList.remove('active');
  galleryViewer.classList.add('active');
  modalContent.classList.add('book-mode');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  renderGalleryImage();
}

if (galleryPrevBtn) {
  galleryPrevBtn.addEventListener('click', () => {
    if (galleryIndex > 0) { galleryIndex--; renderGalleryImage(); }
  });
}
if (galleryNextBtn) {
  galleryNextBtn.addEventListener('click', () => {
    if (galleryIndex < galleryImages.length - 1) { galleryIndex++; renderGalleryImage(); }
  });
}

if (btnPrev) {
  btnPrev.addEventListener('click', () => {
    if (spreadStart <= 1) return;
    spreadStart = spreadStart === 2 ? 1 : spreadStart - 2;
    renderSpread();
  });
}
if (btnNext) {
  btnNext.addEventListener('click', () => {
    const total = pdfDoc.numPages;
    let next = spreadStart === 1 ? 2 : spreadStart + 2;
    if (next > total) return;
    spreadStart = next;
    renderSpread();
  });
}

function openInModalOrTab(href) {
  if (href.toLowerCase().endsWith('.pdf')) {
    if (isBookPdf(href) && window.pdfjsLib) {
      openBookViewer(href);
    } else {
      openIframe(href);
    }
  } else {
    window.open(href, '_blank', 'noopener');
  }
}

if (modal) {
  modal.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (bookViewer.classList.contains('active')) {
      if (e.key === 'ArrowRight' && btnNext) btnNext.click();
      if (e.key === 'ArrowLeft' && btnPrev) btnPrev.click();
    }
    if (galleryViewer.classList.contains('active')) {
      if (e.key === 'ArrowRight' && galleryNextBtn) galleryNextBtn.click();
      if (e.key === 'ArrowLeft' && galleryPrevBtn) galleryPrevBtn.click();
    }
  });
}

document.querySelectorAll('.work-card').forEach(card => {
  const link = card.querySelector('.work-link');
  const galleryList = card.dataset.gallery ? card.dataset.gallery.split(',') : null;

  if (link) {
    // Der Link (z.B. "Auf Figma ansehen") navigiert normal und öffnet nicht zusätzlich die Galerie/das Modal
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  if (galleryList || link) {
    card.classList.add('work-card--clickable');
    card.addEventListener('click', () => {
      if (galleryList) {
        openGallery(galleryList);
      } else if (link) {
        openInModalOrTab(link.href);
      }
    });
  }
});
