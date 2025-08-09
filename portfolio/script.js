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

  // Achievements
  async function loadAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    try {
      const res = await fetch('./achievements.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch achievements');
      const items = await res.json();
      if (!Array.isArray(items)) throw new Error('Malformed achievements.json');
      grid.innerHTML = '';
      for (const a of items) grid.appendChild(renderAchievement(a));
    } catch (err) {
      console.warn('Achievements fallback:', err);
      grid.innerHTML = '<p class="muted">Add achievements in achievements.json</p>';
    }
  }
  function renderAchievement(item) {
    const { title, issuer, date, link, description } = item;
    const card = document.createElement('article');
    card.className = 'card achievement';
    const h3 = document.createElement('h3'); h3.textContent = title || 'Achievement';
    const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = [issuer, date].filter(Boolean).join(' • ');
    const p = document.createElement('p'); p.textContent = description || '';
    const actions = document.createElement('div'); actions.className = 'cta-row';
    if (link) { const a = document.createElement('a'); a.href = link; a.target = '_blank'; a.rel = 'noopener'; a.className = 'btn'; a.textContent = 'View'; actions.appendChild(a); }
    card.append(h3, meta, p, actions);
    return card;
  }

  // Experience
  async function loadExperience() {
    const list = document.getElementById('experienceTimeline');
    if (!list) return;
    try {
      const res = await fetch('./experience.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch experience');
      const items = await res.json();
      if (!Array.isArray(items)) throw new Error('Malformed experience.json');
      list.innerHTML = '';
      for (const e of items) list.appendChild(renderExperience(e));
    } catch (err) {
      console.warn('Experience fallback:', err);
      list.innerHTML = '<li class="muted">Add roles in experience.json</li>';
    }
  }
  function renderExperience(item) {
    const { role, company, period, location, bullets = [], link } = item;
    const li = document.createElement('li');
    const roleEl = document.createElement('p'); roleEl.className = 'role'; roleEl.textContent = role || 'Role';
    const companyEl = document.createElement('p'); companyEl.className = 'company'; companyEl.textContent = [company, location].filter(Boolean).join(' • ');
    const periodEl = document.createElement('p'); periodEl.className = 'period'; periodEl.textContent = period || '';
    const ul = document.createElement('ul');
    bullets.forEach(b => { const i = document.createElement('li'); i.textContent = b; ul.appendChild(i); });
    const actions = document.createElement('div'); actions.className = 'cta-row';
    if (link) { const a = document.createElement('a'); a.href = link; a.target = '_blank'; a.rel = 'noopener'; a.className = 'btn'; a.textContent = 'Company'; actions.appendChild(a); }
    li.append(roleEl, companyEl, periodEl, ul, actions);
    return li;
  }

  // Blog
  async function loadBlog() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    try {
      const res = await fetch('./blog.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch blog');
      const items = await res.json();
      if (!Array.isArray(items)) throw new Error('Malformed blog.json');
      grid.innerHTML = '';
      for (const p of items) grid.appendChild(renderPost(p));
    } catch (err) {
      console.warn('Blog fallback:', err);
      grid.innerHTML = '<p class="muted">Add posts in blog.json</p>';
    }
  }
  function renderPost(post) {
    const { title, excerpt, date, tags = [], url } = post;
    const card = document.createElement('article');
    card.className = 'card blog-card';
    const h3 = document.createElement('h3'); h3.textContent = title || 'Untitled';
    const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = [date, (tags || []).join(', ')].filter(Boolean).join(' • ');
    const p = document.createElement('p'); p.textContent = excerpt || '';
    const actions = document.createElement('div'); actions.className = 'cta-row';
    if (url) { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.className = 'btn primary'; a.textContent = 'Read'; actions.appendChild(a); }
    card.append(h3, meta, p, actions);
    return card;
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
  loadAchievements();
  loadExperience();
  loadBlog();
})();