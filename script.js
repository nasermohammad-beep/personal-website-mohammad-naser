document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Header Scroll State & Top Scroll Progress Bar
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('scrollProgress');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 20);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Active Navigation Highlighting
    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (scrollY >= top) currentId = sec.getAttribute('id');
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Scroll Reveal & Animated Hero Counters
  const counters = document.querySelectorAll('[data-target]');
  let countersStarted = false;

  const animateCounters = () => {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach((counter) => {
      const target = Number(counter.dataset.target);
      const suffix = counter.dataset.suffix || '';
      const duration = 1200;
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        counter.textContent = `${Math.round(eased * target)}${suffix}`;
        if (elapsed < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    });
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('hero-content')) {
            animateCounters();
          }
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // 5. Interactive Service Pillar Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.filter;

      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      serviceCards.forEach((card) => {
        const match = selected === 'all' || card.dataset.category === selected;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  // Preselect service in contact form when clicking card CTA
  const serviceSelect = document.getElementById('serviceType');
  document.querySelectorAll('[data-preselect]').forEach((link) => {
    link.addEventListener('click', () => {
      if (serviceSelect) serviceSelect.value = link.dataset.preselect;
    });
  });

  // 6. Insights Reader Modal
  const insightsData = [
    {
      category: 'Operations & Strategy',
      title: 'Why Process Clarity Always Precedes Digital Transformation',
      paragraphs: [
        'Many digital transformation initiatives stall because organizations digitize fragmented, undocumented workflows. Software magnifies existing habits—good or bad.',
        'Before selecting tools, map end-to-end value streams, eliminate redundant handoffs, establish clear process ownership, and define baseline KPIs. When operational logic is clear, technology becomes a true force multiplier.'
      ]
    },
    {
      category: 'Quality & ISO',
      title: 'Turning ISO Standards into Living Operational Assets',
      paragraphs: [
        'Compliance-only management systems create shelfware that teams ignore between audits. Effective ISO implementation integrates risk-based thinking and clear SOPs directly into daily routines.',
        'Keep documentation concise, visual, and aligned with actual team workflows so quality assurance drives measurable efficiency rather than administrative overhead.'
      ]
    },
    {
      category: 'Career & Leadership',
      title: 'Bridging the Gap Between Technical Expertise and Leadership',
      paragraphs: [
        'High-performing specialists are often promoted for individual execution, yet leadership demands structured delegation, stakeholder alignment, and capability building.',
        'Invest intentionally in business acumen, structured communication, and coaching frameworks to multiply impact through the teams you lead.'
      ]
    }
  ];

  const modal = document.getElementById('insightModal');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.getElementById('closeModal');

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('.read-insight-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = insightsData[Number(btn.dataset.insight)];
      if (!item || !modal) return;

      modalCategory.textContent = item.category;
      modalTitle.textContent = item.title;
      modalBody.innerHTML = item.paragraphs.map((p) => `<p>${p}</p>`).join('');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // 7. Interactive Direct Inquiry Form Handler
  const inquiryForm = document.getElementById('inquiryForm');
  const formFeedback = document.getElementById('formFeedback');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const service = document.getElementById('serviceType').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formFeedback.style.color = '#dc2626';
        formFeedback.textContent = 'Please complete all required fields before sending.';
        return;
      }

      formFeedback.style.color = '#15803d';
      formFeedback.textContent = `Thank you, ${name}. Your ${service.toLowerCase()} inquiry has been prepared—you can also book directly via the consultation form.`;
      inquiryForm.reset();
    });
  }
});