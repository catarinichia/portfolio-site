// ==========================================================================
// Portfolio interactivity — nav, scroll reveal, progress bar, hero parallax,
// magnetic buttons, project card tilt, stat counters.
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Footer year -------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile nav toggle ---------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (e.target.closest('.nav-dropdown__chevron')) return;
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Work nav dropdown (category -> project flyout / accordion) ---------
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const chevron = dropdown.querySelector('.nav-dropdown__chevron');
    if (chevron) {
      chevron.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const willOpen = !dropdown.classList.contains('is-open');
        document.querySelectorAll('.nav-dropdown.is-open').forEach(d => { if (d !== dropdown) d.classList.remove('is-open'); });
        dropdown.classList.toggle('is-open', willOpen);
      });
    }

    dropdown.querySelectorAll('.nav-dropdown__cat').forEach(cat => {
      cat.setAttribute('tabindex', '0');
      cat.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const willOpen = !cat.classList.contains('is-open');
        dropdown.querySelectorAll('.nav-dropdown__cat').forEach(c => { if (c !== cat) c.classList.remove('is-open'); });
        cat.classList.toggle('is-open', willOpen);
      });
      cat.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cat.click(); }
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
    }
  });

  // ---- Header background on scroll + progress bar -------------------------
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('progressBar');

  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);

    if (progressBar) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressBar.style.width = progress + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Scroll reveal --------------------------------------------------------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ---- Stat count-up ----------------------------------------------------
  const statNums = document.querySelectorAll('.stat__num');
  if (statNums.length && 'IntersectionObserver' in window) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || '';
      if (prefersReducedMotion || target === 0) {
        el.textContent = target + suffix;
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + (progress >= 1 ? suffix : '');
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statNums.forEach(el => statIo.observe(el));
  }

  // ---- Hero blob parallax (desktop, pointer devices only) -------------------
  const heroBlob = document.getElementById('heroBlob');
  const hero = document.querySelector('.hero');
  if (heroBlob && hero && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 40;
      const y = (e.clientY / innerHeight - 0.5) * 40;
      heroBlob.style.transform = `translate(${x}px, calc(-50% + ${y}px))`;
    });
  }

  // ---- Magnetic buttons ---------------------------------------------------
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ---- Project card tilt ---------------------------------------------------
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ---- Numbered tiles: video autoplay + loop while the number is hovered ---
  document.querySelectorAll('.num-tile').forEach(tile => {
    const video = tile.querySelector('.tile-video');
    if (!video) return;
    const play = () => video.play().catch(() => {});
    const stop = () => { video.pause(); video.currentTime = 0; };
    tile.addEventListener('mouseenter', play);
    tile.addEventListener('mouseleave', stop);
    tile.addEventListener('focus', play);
    tile.addEventListener('blur', stop);
  });

  // ---- Contact page: enquiry form (Formspree) -----------------------------
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    const formNote = document.getElementById('formNote');
    const formSuccess = document.getElementById('formSuccess');

    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (enquiryForm.action.includes('YOUR_FORM_ID')) {
        if (formNote) {
          formNote.textContent = 'Form isn’t connected yet — add your Formspree endpoint in contact.html to enable sending.';
          formNote.style.color = 'var(--accent)';
        }
        return;
      }

      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const response = await fetch(enquiryForm.action, {
          method: 'POST',
          body: new FormData(enquiryForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          enquiryForm.hidden = true;
          if (formSuccess) formSuccess.classList.add('is-visible');
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        if (formNote) {
          formNote.textContent = 'Something went wrong sending this — please email me directly instead.';
          formNote.style.color = 'var(--accent)';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }
});
