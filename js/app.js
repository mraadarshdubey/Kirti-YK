/**
 * Kirti YK - Tarot Clarity Session Landing Page Logic
 * Stack: Plain Vanilla JavaScript + GSAP & ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initQuestionAccordion();
  initFAQ();
  initModal();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. Site Header & Scroll Detection
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Interactive Problem Question Cards (Expandable Perspective Insights)
   -------------------------------------------------------------------------- */
function initQuestionAccordion() {
  const questionCards = document.querySelectorAll('.question-card');
  if (!questionCards.length) return;

  questionCards.forEach((card) => {
    const headerBtn = card.querySelector('.question-card-header');
    if (!headerBtn) return;

    headerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isAlreadyActive = card.classList.contains('active');

      // Close other question cards for a focused experience
      questionCards.forEach((other) => {
        if (other !== card) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.question-card-header');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked card
      if (isAlreadyActive) {
        card.classList.remove('active');
        headerBtn.setAttribute('aria-expanded', 'false');
      } else {
        card.classList.add('active');
        headerBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Accessible FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item, index) => {
    const button = item.querySelector('.faq-button');
    const content = item.querySelector('.faq-content');

    if (!button || !content) return;

    // Set accessibility IDs & attributes
    const questionId = `faq-q-${index}`;
    const answerId = `faq-a-${index}`;
    button.setAttribute('id', questionId);
    button.setAttribute('aria-controls', answerId);
    button.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
    content.setAttribute('id', answerId);
    content.setAttribute('aria-labelledby', questionId);
    content.setAttribute('role', 'region');

    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for clean accordion behavior
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-button');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Interactive Booking Modal Flow & Dynamic Topic Population
   -------------------------------------------------------------------------- */
function initModal() {
  const modalOverlay = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const bookingForm = document.getElementById('bookingForm');
  const formView = document.getElementById('modalFormView');
  const confView = document.getElementById('modalConfView');
  const confCloseBtn = document.getElementById('confCloseBtn');
  const clarityTopicInput = document.getElementById('clarityTopic');

  if (!modalOverlay) return;

  // Open modal triggers with optional custom topic pre-filling
  const openTriggers = document.querySelectorAll('[data-open-modal]');
  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = trigger.getAttribute('data-topic');
      openModal(topic);
    });
  });

  function openModal(topic = null) {
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Pre-populate topic textarea if passed
    if (clarityTopicInput) {
      if (topic) {
        clarityTopicInput.value = topic;
      }
    }

    // Reset views if previously submitted
    if (formView && confView) {
      formView.style.display = 'block';
      confView.style.display = 'none';
    }

    // Auto focus first input
    const firstInput = modalOverlay.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (confCloseBtn) {
    confCloseBtn.addEventListener('click', closeModal);
  }

  // Close when clicking background outside card
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Securing Slot...';
      }

      // Simulate quick secure checkout transition
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        if (formView && confView) {
          formView.style.display = 'none';
          confView.style.display = 'block';

          // Fire celebratory rose & gold confetti
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#D94F8A', '#F7D5E4', '#C9A96E', '#3C8D70']
            });
          }
        }
      }, 700);
    });
  }
}

/* --------------------------------------------------------------------------
   4. GSAP ScrollTrigger Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Entrance Timeline
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.85 } });
  heroTl.from('.hero-badge-row', { opacity: 0, y: 18, delay: 0.15 })
        .from('.hero-headline', { opacity: 0, y: 25, duration: 1 }, '-=0.55')
        .from('.hero-subheadline', { opacity: 0, y: 18 }, '-=0.6')
        .from('.hero-cta-group', { opacity: 0, y: 22 }, '-=0.5')
        .from('.hero-values-strip .hero-value-item', { opacity: 0, y: 12, stagger: 0.12 }, '-=0.4')
        .from('.hero-visual-wrap', { opacity: 0, scale: 0.94, duration: 1.1 }, '-=0.9')
        .from('.hero-floating-card', { opacity: 0, x: -20, duration: 0.7 }, '-=0.5')
        .from('.hero-handwritten', { opacity: 0, duration: 0.9, stagger: 0.2 }, '-=0.6')
        .from('.hero-sparkle', { opacity: 0, scale: 0, stagger: 0.15, duration: 0.6, ease: 'back.out(2)' }, '-=0.7');

  // Scroll reveals for section titles and cards
  if (typeof ScrollTrigger !== 'undefined') {
    // Parallax on hero image
    gsap.to('.hero-image-frame img', {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      },
      y: 40,
      ease: 'none'
    });

    gsap.utils.toArray('.reveal-up').forEach((elem) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.75,
        ease: 'power2.out'
      });
    });

    gsap.utils.toArray('.reveal-stagger').forEach((container) => {
      const items = container.children;
      gsap.from(items, {
        scrollTrigger: {
          trigger: container,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 28,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out'
      });
    });

    // Urgency price box spotlight animation
    gsap.from('.urgency-price-box', {
      scrollTrigger: {
        trigger: '.urgency-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0.88,
      duration: 0.85,
      ease: 'back.out(1.4)',
      delay: 0.3
    });
  }
}
