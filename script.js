/* ============================================
   script.js — Portfolio Interactions
   ============================================ */

// ---- Particle Canvas ----
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.6 ? '#38bdf8' : '#818cf8',
    };
  }

  function createParticles() {
    const count = Math.min(Math.floor((W * H) / 12000), 100);
    particles = Array.from({ length: count }, createParticle);
  }

  createParticles();

  function drawLine(p1, p2, dist, maxDist) {
    const opacity = (1 - dist / maxDist) * 0.15;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    const maxDist = 130;

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`).replace('rgb', 'rgba');
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) drawLine(p, p2, dist, maxDist);
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  animate();
})();


// ---- Navbar scroll effect & active links ----
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link tracking
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('open');
    });
  });
})();


// ---- Typed text effect ----
(function initTyped() {
  const phrases = [
    'CS Engineer (AI)',
    'Software Developer',
    'AI & Software Enthusiast',
    'Problem Solver',
    'Open to Placements',
  ];

  const el = document.getElementById('typed-text');
  if (!el) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function type() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        typingTimeout = setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    typingTimeout = setTimeout(type, isDeleting ? 50 : 80);
  }

  setTimeout(type, 1500);
})();


// ---- Intersection Observer: Reveal on scroll ----
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);

          // Trigger skill bars if inside skill section
          const bars = entry.target.querySelectorAll('.skill-bar-fill');
          bars.forEach((bar) => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
              bar.style.width = width + '%';
            }, 200);
          });
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => observer.observe(el));
})();


// ---- Stagger project & cert cards on scroll ----
(function initStaggerCards() {
  const cardGroups = [
    '.project-card',
    '.cert-card',
    '.skill-category',
    '.timeline-item',
    '.stat-card',
    '.contact-card',
  ];

  cardGroups.forEach((selector) => {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.08}s`;
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cardGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((card) => observer.observe(card));
  });
})();


// ---- Contact form — sends via mailto: to snehinrao1930@gmail.com ----
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.getElementById('btn-icon');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.querySelector('#sender-name').value.trim();
    const email   = form.querySelector('#sender-email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) { shakeButton(); return; }
    if (!isValidEmail(email)) { shakeButton(); return; }

    btn.disabled = true;
    btnText.textContent = 'Opening Email...';
    btnIcon.className = 'fas fa-spinner fa-spin';

    // Build a fully pre-filled mailto: link so the email lands in Snehin's inbox
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const mailtoUrl = `mailto:snehinrao1930@gmail.com?subject=${subject}&body=${body}`;

    // Open default mail client with pre-filled content
    window.location.href = mailtoUrl;

    setTimeout(() => {
      btnText.textContent = 'Email Client Opened ✓';
      btnIcon.className = 'fas fa-check';
      btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
      btn.style.boxShadow = '0 0 24px rgba(74, 222, 128, 0.4)';

      setTimeout(() => {
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fas fa-paper-plane';
        btn.style.background = '';
        btn.style.boxShadow = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    }, 1000);
  });

  function shakeButton() {
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 600);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();


// ---- Project filter tabs ----
(function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#projects-grid .project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide cards with a smooth fade
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();




// ---- Smooth tilt effect on project cards ----
(function initTilt() {
  const cards = document.querySelectorAll('.project-card, .cert-card, .skill-category');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -5;
      const rotateY = ((x - cx) / cx) * 5;
      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


// ---- Cursor glow effect ----
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
})();


// ---- Add shake keyframe dynamically ----
(function addShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
    .shake { animation: shake 0.5s ease; }
  `;
  document.head.appendChild(style);
})();


// ---- Hero greeting time-aware ----
(function initGreeting() {
  const el = document.getElementById('hero-greeting');
  if (!el) return;
  const hour = new Date().getHours();
  let greet = 'Hello, World! 👋';
  if (hour < 12) greet = 'Good Morning! ☀️';
  else if (hour < 17) greet = 'Good Afternoon! 👋';
  else if (hour < 21) greet = 'Good Evening! 🌆';
  else greet = 'Hello, Night Owl! 🌙';
  el.textContent = greet;
})();
