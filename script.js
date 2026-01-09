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

  // Particles animation
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 50;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
  }

  function updateParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(14, 165, 233, ${p.opacity})`;
      ctx.fill();
    });
  }

  function animateParticles() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  createParticles();
  animateParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Typing effect for hero subtitle
  const subtitleEl = document.querySelector('.subtitle');
  const originalText = subtitleEl.textContent;
  subtitleEl.textContent = '';
  let i = 0;
  function typeWriter() {
    if (i < originalText.length) {
      subtitleEl.textContent += originalText.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }
  setTimeout(typeWriter, 1000);

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

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  // Progress bar animations
  function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
      const level = bar.getAttribute('data-level');
      bar.style.width = level + '%';
    });
  }

  // Trigger progress animations when skills section is visible
  const skillsSection = document.getElementById('skills');
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateProgressBars();
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  skillsObserver.observe(skillsSection);

  // Load projects.json and render
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
      console.warn('Using fallback projects due to error:', err);
      const fallback = [
        {
          title: 'Sample Project',
          description: 'Replace this with your project. Edit projects.json.',
          tech: ['JavaScript', 'HTML', 'CSS'],
          links: { repo: '#', demo: '#' }
        }
      ];
      allProjects = fallback;
      renderProjects(fallback);
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
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn primary';
    viewBtn.textContent = 'View Details';
    viewBtn.addEventListener('click', () => openProjectModal(project));
    actions.appendChild(viewBtn);

    if (links.demo) {
      const a = document.createElement('a');
      a.href = links.demo;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'btn';
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

  // Project search and filter
  const searchInput = document.getElementById('projectSearch');
  const filterButtons = document.querySelectorAll('.filter-btn');

  function filterProjects() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');

    const filtered = allProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                           project.description.toLowerCase().includes(searchTerm) ||
                           project.tech.some(t => t.toLowerCase().includes(searchTerm));
      const matchesFilter = activeFilter === 'all' || project.tech.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()));
      return matchesSearch && matchesFilter;
    });

    renderProjects(filtered);
  }

  searchInput.addEventListener('input', filterProjects);
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects();
    });
  });

  // Project modal
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const closeModal = document.querySelector('.close-modal');

  function openProjectModal(project) {
    const { title, description, tech = [], links = {} } = project;
    modalBody.innerHTML = `
      <h2>${title}</h2>
      <p>${description}</p>
      <h3>Technologies Used</h3>
      <ul class="tech-list">
        ${tech.map(t => `<li>${t}</li>`).join('')}
      </ul>
      <div class="cta-row">
        ${links.demo ? `<a href="${links.demo}" target="_blank" rel="noopener noreferrer" class="btn primary">Live Demo</a>` : ''}
        ${links.repo ? `<a href="${links.repo}" target="_blank" rel="noopener noreferrer" class="btn">Source Code</a>` : ''}
      </div>
    `;
    modal.style.display = 'block';
  }

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Close modal on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
    }
  });

  loadProjects();

  // Load testimonials
  async function loadTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    try {
      const res = await fetch('./testimonials.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch testimonials');
      const testimonials = await res.json();
      if (!Array.isArray(testimonials)) throw new Error('Malformed testimonials.json');
      grid.innerHTML = '';
      for (const testimonial of testimonials) {
        grid.appendChild(renderTestimonialCard(testimonial));
      }
    } catch (err) {
      console.warn('Failed to load testimonials:', err);
    }
  }

  function renderTestimonialCard(testimonial) {
    const { name, role, message, image } = testimonial;
    const card = document.createElement('div');
    card.className = 'testimonial-card';

    const img = document.createElement('img');
    img.src = image;
    img.alt = name;
    card.appendChild(img);

    const nameEl = document.createElement('div');
    nameEl.className = 'name';
    nameEl.textContent = name;
    card.appendChild(nameEl);

    const roleEl = document.createElement('div');
    roleEl.className = 'role';
    roleEl.textContent = role;
    card.appendChild(roleEl);

    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    messageEl.textContent = `"${message}"`;
    card.appendChild(messageEl);

    return card;
  }

  loadTestimonials();

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = 'Sending...';
    formStatus.className = 'form-status';

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Simulate form submission (replace with actual endpoint)
    try {
      // For demo purposes, just show success after delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      formStatus.textContent = 'Message sent successfully!';
      formStatus.className = 'form-status success';
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = 'Failed to send message. Please try again.';
      formStatus.className = 'form-status error';
    }
  });

  // Back to top button
  const backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();