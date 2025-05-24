(function() {
  const projectsUrl = 'data/projects.json';
  let projects = [];
  let activeFilter = 'all';

  const gridContainer = document.getElementById('portfolio-grid');
  const detailSection = document.getElementById('project-detail');
  const filterButtons = document.querySelectorAll('.filter-btn');

  async function init() {
    try {
      const res = await fetch(projectsUrl);
      projects = await res.json();
      const slug = window.location.hash.slice(1);
      if (slug) showDetail(slug);
      else {
        renderGrid(activeFilter);
      }
      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          activeFilter = btn.getAttribute('data-filter');
          filterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          window.location.hash = '';
          detailSection.style.display = 'none';
          renderGrid(activeFilter);
        });
      });
      window.addEventListener('hashchange', onRouteChange);
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  }

  function onRouteChange() {
    const slug = window.location.hash.slice(1);
    if (slug) showDetail(slug);
    else {
      detailSection.style.display = 'none';
      document.querySelector('section.section').style.display = 'block';
      renderGrid(activeFilter);
    }
  }

  function renderGrid(filter) {
    document.querySelector('section.section').style.display = 'block';
    gridContainer.innerHTML = '';
    const items = filter === 'all' ? projects : projects.filter(p => p.category.toLowerCase().includes(filter));
    items.forEach(p => {
      const div = document.createElement('div');
      div.className = 'portfolio-item';
      div.innerHTML = `
        <img src="${p.mainImage}" alt="${p.title}" class="portfolio-img">
        <div class="portfolio-overlay">
          <span class="portfolio-category">${p.category}</span>
          <h3 class="portfolio-title">${p.title}</h3>
          <a href="#${p.slug}" class="portfolio-btn">Ver Detalhes</a>
        </div>
      `;
      gridContainer.appendChild(div);
    });
  }

  function showDetail(slug) {
    const p = projects.find(pr => pr.slug === slug);
    if (!p) return;
    document.querySelector('section.section').style.display = 'none';
    detailSection.style.display = 'block';
    detailSection.innerHTML = `
      <div class="container">
        <div class="project-container">
          <div class="project-gallery">
            <img src="${p.mainImage}" alt="${p.title}" class="project-main-img">
            <div class="project-thumbnails">
              ${p.thumbnails.map(src => `<div class="project-thumb"><img src="${src}" alt="${p.title}"></div>`).join('')}
            </div>
          </div>
          <div class="project-info">
            <div class="project-header">
              <h1 class="project-title">${p.title}</h1>
              <p class="project-category">${p.category}</p>
            </div>
            <div class="project-description"><p>${p.description}</p></div>
            <div class="project-meta">
              ${p.meta.map(m => `<div class="meta-item"><span class="meta-title">${m.title}</span><span class="meta-info">${m.info}</span></div>`).join('')}
            </div>
            <div class="tech-stack">
              ${p.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            <div class="project-links">
              ${Object.entries(p.links).map(([name, url]) => `<a href="${url}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">${name}</a>`).join('')}
            </div>
            <div style="margin-top:20px;"><a href="#" class="btn btn-secondary">Voltar</a></div>
          </div>
        </div>
      </div>
    `;
  }

  init();
})();
