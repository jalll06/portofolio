// ===========================================================
// PORTOFOLIO DEVELOPER — script.js
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Tahun otomatis di footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Toggle menu mobile ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Highlight dock mobile aktif saat scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const dockLinks = document.querySelectorAll('.mobile-dock a');

  const setActiveDock = () => {
    let currentId = 'top';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) currentId = section.getAttribute('id');
    });
    dockLinks.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${currentId}`);
    });
  };
  window.addEventListener('scroll', setActiveDock, { passive: true });

  /* ---------- Reveal saat elemen masuk viewport ---------- */
  const revealTargets = document.querySelectorAll(
    '.about, .skill-group, .activity, .project, .timeline__item, .contact__grid'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Terminal typewriter ---------- */
  const typedEl = document.getElementById('typedText');
  const phrases = [
    'npm run build-future.js',
    'status: mencari magang software developer',
    'stack: React · Node.js · MySQL',
    'siap belajar cepat & kerja dalam tim'
  ];

  if (typedEl) {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1600);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 28 : 55);
    };
    type();
  }

  /* ---------- Render dot level skill (1-5) ---------- */
  document.querySelectorAll('.dots').forEach(container => {
    const levelHolder = container.querySelector('[data-lvl]');
    const level = levelHolder ? parseInt(levelHolder.getAttribute('data-lvl'), 10) : 0;
    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i <= level ? ' is-filled' : '');
      container.appendChild(dot);
    }
  });

  /* ---------- Grid aktivitas belajar (dummy, 12 minggu x 7 hari) ---------- */
  const activityGrid = document.getElementById('activityGrid');
  if (activityGrid) {
    const totalDays = 12 * 7;
    for (let i = 0; i < totalDays; i++) {
      const cell = document.createElement('span');
      cell.className = 'activity__cell';
      const intensity = Math.random();
      const opacity = 0.15 + intensity * 0.85;
      cell.style.background = `rgba(94, 234, 212, ${opacity.toFixed(2)})`;
      activityGrid.appendChild(cell);
    }
  }

  /* ---------- Tombol kembali ke atas ---------- */
  const toTopBtn = document.getElementById('toTop');
  if (toTopBtn) {
    window.addEventListener('scroll', () => {
      toTopBtn.classList.toggle('is-visible', window.scrollY > 480);
    }, { passive: true });
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Validasi & submit form kontak ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  const showFieldError = (fieldName, message) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    const errorEl = form.querySelector(`[data-error="${fieldName}"]`);
    if (field) field.closest('.field').classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      let valid = true;

      if (name.length < 2) { showFieldError('name', 'Mohon isi nama lengkap Anda.'); valid = false; }
      else showFieldError('name', '');

      if (!isValidEmail(email)) { showFieldError('email', 'Mohon isi alamat email yang valid.'); valid = false; }
      else showFieldError('email', '');

      if (message.length < 10) { showFieldError('message', 'Pesan minimal 10 karakter.'); valid = false; }
      else showFieldError('message', '');

      if (!valid) {
        formStatus.textContent = 'Mohon periksa kembali data yang diisi.';
        formStatus.style.color = 'var(--danger)';
        return;
      }

      // NOTE: masih simulasi lokal. Untuk mengirim pesan sungguhan,
      // hubungkan form ini ke layanan seperti Formspree, EmailJS,
      // atau endpoint backend milik Anda sendiri.
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.querySelector('.btn__label').textContent;
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn__label').textContent = 'Mengirim...';

      setTimeout(() => {
        formStatus.style.color = 'var(--cyan)';
        formStatus.textContent = `Terima kasih, ${name}! Pesan Anda sudah diterima (mode demo — belum terhubung ke server).`;
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn__label').textContent = originalLabel;
        form.reset();
      }, 900);
    });
  }

});
