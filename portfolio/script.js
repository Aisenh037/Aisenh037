(function () {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    document.documentElement.dataset.theme = storedTheme;
  } else if (prefersDark) {
    document.documentElement.dataset.theme = 'dark';
  }

  const themeBtn = document.getElementById('themeToggle');
  const setThemeIcon = () => {
    const theme = document.documentElement.dataset.theme || 'auto';
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-pressed', theme === 'dark');
  };
  themeBtn?.addEventListener('click', () => {
    const isDark = (document.documentElement.dataset.theme || 'dark') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    setThemeIcon();
  });
  setThemeIcon();

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href') || '';
      if (targetId.length > 1) {
        const el = document.querySelector(targetId);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', targetId);
        }
      }
    });
  });

  // Load projects.json and render
  async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    try {
      const res = await fetch('./projects.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch projects');
      const projects = await res.json();
      if (!Array.isArray(projects)) throw new Error('Malformed projects.json');
      grid.innerHTML = '';
      for (const project of projects) {
        grid.appendChild(renderProjectCard(project));
      }
    } catch (err) {
      console.warn('Using fallback projects due to error:', err);
      const fallback = [
        {
          title: 'Sample Project',
          description: 'Replace this with your project. Edit projects.json.',
          tech: ['JavaScript', 'HTML', 'CSS'],
          links: { repo: '#', demo: '#' }
        }
      ];
      const grid = document.getElementById('projectsGrid');
      grid.innerHTML = '';
      for (const project of fallback) {
        grid.appendChild(renderProjectCard(project));
      }
    }
  }

  function renderProjectCard(project) {
    const { title, description, tech = [], links = {} } = project;
    const card = document.createElement('article');
    card.className = 'card';

    const h3 = document.createElement('h3');
    h3.textContent = title || 'Untitled Project';
    card.appendChild(h3);

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
    if (links.demo) {
      const a = document.createElement('a');
      a.href = links.demo;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'btn primary';
      a.textContent = 'Live Demo';
      actions.appendChild(a);
    }
    if (links.repo) {
      const a = document.createElement('a');
      a.href = links.repo;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'btn';
      a.textContent = 'Source Code';
      actions.appendChild(a);
    }
    card.appendChild(actions);

    return card;
  }

  loadProjects();
})();