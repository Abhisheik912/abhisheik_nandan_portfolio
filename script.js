/* ── TYPED TITLE EFFECT ── */
const titles = [
  'DevOps Engineer',
  'Infrastructure Specialist',
  'Linux Administrator',
  'Automation Engineer',
  'DNS & Hosting Expert'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-title');

function typeTitle() {
  const current = titles[titleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typedEl.textContent = current.substring(0, charIndex);

  let delay = isDeleting ? 50 : 90;

  if (!isDeleting && charIndex === current.length) {
    delay = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    titleIndex = (titleIndex + 1) % titles.length;
    delay = 400;
  }

  setTimeout(typeTitle, delay);
}

typeTitle();

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ── MOBILE HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});

// Close mobile nav on link click
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
  });
});

/* ── INTERSECTION OBSERVER: REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ── SKILL BARS ANIMATE ── */
const skillBars = document.querySelectorAll('.skill-bar');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));

/* ── GITHUB CONTRIBUTION GRID ── */
function buildContribGrid() {
  const grid = document.getElementById('contribGrid');
  if (!grid) return;

  const totalCells = 26 * 4; // 26 cols × 4 rows (simplified)
  const levels = ['', 'l1', 'l2', 'l3', 'l4'];

  // Seeded random pattern for demo
  const seed = [
    0,0,1,0,2,1,0,0,3,1,0,2,1,0,0,1,2,0,0,1,0,0,3,1,0,0,
    0,1,2,1,3,2,1,0,2,3,1,2,1,0,1,2,3,1,0,2,1,0,1,2,0,1,
    1,2,3,2,4,3,2,1,3,4,2,3,2,1,2,3,4,2,1,3,2,1,4,3,1,2,
    0,1,2,1,3,2,0,1,2,1,0,2,1,0,1,2,1,0,1,2,1,0,2,1,0,1,
  ];

  seed.forEach((level, i) => {
    const cell = document.createElement('div');
    cell.className = `contrib-cell ${levels[level]}`;
    grid.appendChild(cell);
  });
}

buildContribGrid();

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── ACTIVE NAV LINK HIGHLIGHTING ── */
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinksAll.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--green)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── TERMINAL LINES STAGGER ── */
const terminalLines = document.querySelectorAll('.terminal-body p');
terminalLines.forEach((line, i) => {
  line.style.animationDelay = `${i * 0.18}s`;
  line.style.opacity = '0';
  line.style.transform = 'translateY(6px)';
  line.style.animation = `termFadeIn 0.4s ease forwards ${i * 0.12 + 0.5}s`;
});

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes termFadeIn {
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

/* ── CARD TILT EFFECT (subtle) ── */
function addTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      card.style.transform = `perspective(600px) rotateY(${dx * 3}deg) rotateX(${-dy * 3}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

addTilt('.project-card');
addTilt('.skill-card');

/* ── HERO GLOW FOLLOW MOUSE ── */
const heroGlow1 = document.querySelector('.hero-glow-1');
const heroGlow2 = document.querySelector('.hero-glow-2');

document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  if (heroGlow1) {
    heroGlow1.style.transform = `translate(${x * 40 - 20}px, ${y * 40 - 20}px)`;
  }
  if (heroGlow2) {
    heroGlow2.style.transform = `translate(${-x * 30 + 15}px, ${-y * 30 + 15}px)`;
  }
}, { passive: true });

/* ── COUNTER ANIMATION FOR STATS ── */
function animateCounter(el, target) {
  let start = 0;
  const duration = 1400;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '+');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const match = num.textContent.match(/(\d+)/);
        if (match) {
          const val = parseInt(match[1]);
          num.dataset.suffix = num.textContent.includes('+') ? '+' : '';
          animateCounter(num, val);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
