(function () {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    document.documentElement.dataset.theme = storedTheme;
  } else {
    document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
  }

  const themeBtn = document.getElementById('themeToggle');
  themeBtn?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll reveal (skipped when the user prefers reduced motion)
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('fade-in');
      observer.observe(section);
    });
  }

  // Projects
  let allProjects = [];

  async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    try {
      const res = await fetch('./projects.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch projects');
      const projects = await res.json();
      if (!Array.isArray(projects)) throw new Error('Malformed projects.json');
      allProjects = projects;
      renderProjects(projects);
    } catch (err) {
      grid.innerHTML = '<p class="muted">Projects could not be loaded — see <a href="https://github.com/Aisenh037">github.com/Aisenh037</a>.</p>';
    }
  }

  function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';
    for (const project of projects) {
      grid.appendChild(renderProjectCard(project));
    }
  }

  function renderProjectCard(project) {
    const { title, impact, description, tech = [], links = {} } = project;
    const card = document.createElement('article');
    card.className = 'card';

    const h3 = document.createElement('h3');
    h3.textContent = title || 'Untitled Project';
    card.appendChild(h3);

    if (impact) {
      const impactEl = document.createElement('p');
      impactEl.className = 'impact';
      impactEl.textContent = impact;
      card.appendChild(impactEl);
    }

    const p = document.createElement('p');
    p.textContent = description || '';
    card.appendChild(p);

    if (tech.length) {
      const ul = document.createElement('ul');
      ul.className = 'tech-list';
      tech.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    const actions = document.createElement('div');
    actions.className = 'cta-row';
    if (links.repo) {
      const a = document.createElement('a');
      a.href = links.repo;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'btn small';
      a.textContent = 'Source';
      actions.appendChild(a);
    }
    if (links.demo) {
      const a = document.createElement('a');
      a.href = links.demo;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'btn small primary';
      a.textContent = 'Live demo';
      actions.appendChild(a);
    }
    card.appendChild(actions);

    return card;
  }

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProjects(filter === 'all' ? allProjects : allProjects.filter(p => p.category === filter));
    });
  });

  loadProjects();

  // Back to top
  const backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();
