// ===== MOBILE MENU =====
function setupMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu');
  const nav = document.getElementById('main-nav');

  if (!menuBtn || !nav) return;

  const toggleMenu = () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  };

  menuBtn.addEventListener('click', toggleMenu);

  // Close when clicking nav links
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) toggleMenu();
  });
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.href === '#') return;

    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: targetPosition - headerHeight,
      behavior: 'smooth'
    });

    history.pushState(null, null, targetId);
  });
}

// ===== FORM HANDLING =====
async function handleFormSubmit(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error('Submission failed');

    form.insertAdjacentHTML('beforeend', `
      <div class="form-success" aria-live="polite">
        Pesan terkirim! Kami akan segera menghubungi Anda.
      </div>
    `);
    
    form.reset();
    setTimeout(() => {
      document.querySelector('.form-success')?.remove();
    }, 5000);

  } catch (error) {
    alert('Error: Silakan coba lagi atau hubungi kami via WhatsApp');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupSmoothScroll();

  // Form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(contactForm);
    });
  }

  // Set current year
  document.getElementById('current-year').textContent = new Date().getFullYear();
});

// ===== SCROLL HEADER EFFECT =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (!header) return;

  const currentScroll = window.pageYOffset;
  header.classList.toggle('scrolled', currentScroll > 50);
  lastScroll = currentScroll;
}, { passive: true });
