import { loadContent } from '../content.js';
import { renderMarkdown, renderInlineMarkdown, renderMermaidIn } from '../markdown.js';

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

export async function renderProjects(root) {
  const data = await loadContent();
  const projects = data.projects || [];

  root.innerHTML = '';
  const header = el(`
    <section class="section">
      <div class="kicker">Work</div>
      <h1 class="title">Projects</h1>
      <p class="muted">A selection of AI, automation, and engineering tools.</p>
    </section>
  `);
  root.appendChild(header);

  const grid = el(`<section class="grid"></section>`);

  // Filter UI
  const categories = [
    "All",
    "AI / Machine Learning Projects",
    "Product Management + UX",
    "Data + Business Analytics / BI Systems",
    "Strategy & Consulting Projects"
  ];

  const filterContainer = el(`<div class="filter-container" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px;"></div>`);

  categories.forEach(cat => {
    const btn = el(`<button class="chip ${cat === 'All' ? 'active' : ''}" style="cursor:pointer;font-size:14px;padding:8px 16px;">${cat}</button>`);
    btn.addEventListener('click', () => {
      // Update active state
      filterContainer.querySelectorAll('.chip').forEach(b => {
        b.classList.remove('active');
        b.style.borderColor = 'var(--card-border)';
        b.style.color = 'var(--muted)';
      });
      btn.classList.add('active');
      btn.style.borderColor = 'var(--accent)';
      btn.style.color = 'var(--accent)';

      // Filter grid
      grid.innerHTML = '';
      const filtered = cat === 'All'
        ? projects
        : projects.filter(p => (p.categories || []).includes(cat));

      renderGrid(filtered, grid);
    });
    filterContainer.appendChild(btn);
  });

  // Initial active style
  const allBtn = filterContainer.firstElementChild;
  allBtn.style.borderColor = 'var(--accent)';
  allBtn.style.color = 'var(--accent)';

  root.appendChild(filterContainer);
  root.appendChild(grid);

  renderGrid(projects, grid);
}

function renderGrid(projects, grid) {
  if (!projects.length) {
    grid.innerHTML = `<p class="muted">No projects found in this category.</p>`;
    return;
  }
  projects.forEach(p => {
    const img = p.image || 'assets/images/project-placeholder.svg';
    const card = el(`
      <article class="card glass">
        <img src="${img}" alt="${p.title || 'Project'}" />
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;">
            <h3 style="margin:0;">${p.title || 'Untitled Project'}</h3>
            ${p.date ? `<span style="font-size:0.8rem;color:var(--muted);white-space:nowrap;margin-left:8px;">${p.date}</span>` : ''}
        </div>
        <p>${p.subtitle || ''}</p>
        <div class="chips">${(p.tags || []).slice(0, 3).map(t => `<span class='chip'>${t}</span>`).join('')}</div>
      </article>
    `);
    grid.appendChild(card);

    card.addEventListener('click', () => showProjectModal(p));
  });

  renderMermaidIn(root);
}

function showProjectModal(p) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.5)';
  overlay.style.backdropFilter = 'blur(4px)';
  overlay.style.zIndex = '100';
  overlay.style.overflowY = 'auto';

  const modal = el(`
    <div class="card glass" style="max-width:900px;margin:40px auto;padding:20px;max-height:90vh;overflow:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <h3 style="margin:0">${p.title || ''}</h3>
        <button class="button" id="closeModal">Close</button>
      </div>
      ${p.image ? `<img src='${p.image}' alt='' style='width:100%;height:260px;object-fit:cover;border-radius:12px;margin:12px 0;' />` : ''}
      ${p.overview ? `<div class='section'><h2>Overview</h2><p class='muted'>${p.overview.replace(/\n/g, '<br/>')}</p></div>` : ''}
      ${p.problem ? `<div class='section'><h2>Problem</h2><p class='muted'>${p.problem.replace(/\n/g, '<br/>')}</p></div>` : ''}
      ${p.architecture ? `<div class='section'><h2>Architecture</h2><pre style='background:rgba(0,0,0,0.05);padding:12px;border-radius:8px;overflow-x:auto;'><code>${p.architecture}</code></pre></div>` : ''}
      ${section('Stack', p.stack)}
      ${section('Key Challenges', p.challenges)}
      ${section('What I Learned', p.learned)}
      ${section('Focus', p.focus)}
      ${section('Target Users', p.target_users)}
      ${section('Impact', p.impact)}
      ${section('Future Enhancements', p.future || p.future_enhancements)}
      ${links(p.links)}
    </div>
  `);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  renderMermaidIn(modal);
  modal.querySelector('#closeModal').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function section(title, arr) {
  if (!arr || !arr.length) return '';
  return `
    <div class='section'>
      <h2>${title}</h2>
      <div class='chips wrap'>${arr.map(i => `<span class='chip chip-muted'>${renderInlineMarkdown(i)}</span>`).join('')}</div>
    </div>
  `;
}

function links(items) {
  if (!items || !items.length) return '';
  return `
    <div class='section'>
      <h2>Links</h2>
      <div class='chips'>${items.map(i => `<a class='chip' href='${i.url}' target='_blank' rel='noopener'>${renderInlineMarkdown(i.label)}</a>`).join('')}</div>
    </div>
  `;
}
