/* ── script.js ── */

// ── CONFIG ── //
const GITHUB_USERNAME = 'Abhisheik912';
// Once your backend is live on Render, replace this URL:
const BACKEND_URL = 'https://YOUR-BACKEND.onrender.com/contact';
// Path to your learning log JSON in the same repo:
const LEARNING_LOG_URL = 'learning-log.json';

// ── NAVBAR HAMBURGER ── //
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});
// Close mobile nav on link click
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMobile.classList.remove('open'));
});

// ── ACTIVE NAV LINK ON SCROLL ── //
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// ── REVEAL ON SCROLL ── //
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ── STATUS BAR ── //
async function loadStatus() {
  try {
    const res = await fetch(LEARNING_LOG_URL + '?v=' + Date.now());
    const data = await res.json();
    const statusEl = document.getElementById('statusText');
    if (data.currentStatus) {
      statusEl.textContent = data.currentStatus;
    }
  } catch (e) {
    document.getElementById('statusText').textContent =
      'Currently enrolled in Error Makes Clever DevOps Bootcamp';
  }
}
loadStatus();

// ── GITHUB PROJECTS ── //
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
    );
    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();

    // Filter out forked repos, sort by updated
    const filtered = repos
      .filter(r => !r.fork)
      .slice(0, 6);

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="projects-loading"><span>No public repos found yet.</span></div>';
      return;
    }

    const icons = {
      HTML: '🌐', CSS: '🎨', JavaScript: '⚡', Python: '🐍',
      Shell: '📜', Dockerfile: '🐳', default: '📁'
    };

    grid.innerHTML = filtered.map(repo => {
      const icon = icons[repo.language] || icons.default;
      const updated = new Date(repo.updated_at).toLocaleDateString('en-US', {
        month: 'short', year: 'numeric'
      });
      const desc = repo.description || 'No description yet — check the repo for details.';
      const lang = repo.language || 'Misc';
      return `
        <a class="project-card reveal" href="${repo.html_url}" target="_blank" rel="noopener">
          <div class="project-card-header">
            <span class="project-icon">${icon}</span>
            <span class="project-stars">★ ${repo.stargazers_count}</span>
          </div>
          <div class="project-name">${repo.name}</div>
          <div class="project-desc">${desc}</div>
          <div class="project-meta">
            <span class="project-lang">${lang}</span>
            <span class="project-updated">Updated ${updated}</span>
          </div>
        </a>
      `;
    }).join('');

    // Re-observe new elements for reveal animation
    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  } catch (err) {
    grid.innerHTML = `
      <div class="projects-loading">
        <span>Could not load repos right now. <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" style="color:var(--accent)">View on GitHub →</a></span>
      </div>`;
  }
}
loadProjects();

// ── LEARNING LOG ── //
async function loadLearningLog() {
  const grid = document.getElementById('learningGrid');
  try {
    const res = await fetch(LEARNING_LOG_URL + '?v=' + Date.now());
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();

    if (!data.entries || data.entries.length === 0) {
      grid.innerHTML = '<div class="projects-loading"><span>Learning log coming soon.</span></div>';
      return;
    }

    grid.innerHTML = data.entries.map(entry => {
      const statusClass = entry.status === 'done' ? 'done' :
                          entry.status === 'in-progress' ? 'in-progress' : 'upcoming';
      const statusLabel = entry.status === 'done' ? '✓ Done' :
                          entry.status === 'in-progress' ? '⟳ In Progress' : '○ Up Next';
      const tags = (entry.tags || []).map(t =>
        `<span class="learning-tag">${t}</span>`
      ).join('');
      return `
        <div class="learning-card reveal">
          <div class="learning-card-top">
            <span class="learning-week">${entry.week}</span>
            <span class="learning-status ${statusClass}">${statusLabel}</span>
          </div>
          <h4>${entry.title}</h4>
          <p>${entry.description}</p>
          <div class="learning-tags">${tags}</div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  } catch (err) {
    // Fallback placeholder entries while learning-log.json doesn't exist yet
    const placeholders = [
      {
        week: 'Week 1', title: 'Linux & Git Foundations',
        description: 'Covered Linux CLI basics, file permissions, process management, and full Git workflow from init to push.',
        tags: ['Linux', 'Git', 'CLI'], status: 'done'
      },
      {
        week: 'Week 2', title: 'GitHub & Static Deployment',
        description: 'Built and deployed static sites using GitHub Pages. Practiced branching strategies and pull requests.',
        tags: ['GitHub', 'GitHub Pages', 'Branching'], status: 'done'
      },
      {
        week: 'Week 3', title: 'Docker & Containerization',
        description: 'Currently learning Docker fundamentals — images, containers, Dockerfiles, and docker-compose.',
        tags: ['Docker', 'Containers'], status: 'in-progress'
      },
      {
        week: 'Week 4', title: 'CI/CD with GitHub Actions',
        description: 'Will cover writing workflows, automated testing, and deployment pipelines.',
        tags: ['GitHub Actions', 'CI/CD'], status: 'upcoming'
      }
    ];

    grid.innerHTML = placeholders.map(entry => {
      const statusClass = entry.status === 'done' ? 'done' :
                          entry.status === 'in-progress' ? 'in-progress' : 'upcoming';
      const statusLabel = entry.status === 'done' ? '✓ Done' :
                          entry.status === 'in-progress' ? '⟳ In Progress' : '○ Up Next';
      const tags = entry.tags.map(t => `<span class="learning-tag">${t}</span>`).join('');
      return `
        <div class="learning-card reveal">
          <div class="learning-card-top">
            <span class="learning-week">${entry.week}</span>
            <span class="learning-status ${statusClass}">${statusLabel}</span>
          </div>
          <h4>${entry.title}</h4>
          <p>${entry.description}</p>
          <div class="learning-tags">${tags}</div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }
}
loadLearningLog();

// ── CONTACT FORM ── //
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim()
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  formStatus.className = 'form-status';
  formStatus.textContent = '';

  // If backend not set up yet, show a friendly message
  if (BACKEND_URL.includes('YOUR-BACKEND')) {
    setTimeout(() => {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Backend not connected yet. Please email directly: abhisheik912@gmail.com';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }, 600);
    return;
  }

  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      formStatus.className = 'form-status success';
      formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
      form.reset();
    } else {
      throw new Error('Server error');
    }
  } catch (err) {
    formStatus.className = 'form-status error';
    formStatus.textContent = 'Something went wrong. Please email: abhisheik912@gmail.com';
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Send Message';
});