import { loadContent } from '../content.js';
import { renderMarkdown, renderInlineMarkdown, renderMermaidIn } from '../markdown.js';

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

const ALLOWED_CATEGORIES = [
  'AI/Machine Learning',
  'Product Management + UX',
  'Data + Business Analytics / BI Systems',
  'Strategy & Consulting',
];

export async function renderProjects(root) {
  const data = await loadContent();
  const projects = (data.projects || []).map(p => ({
    ...p,
    _categories: parseCategories(p.categories),
    _parsedDate: parseDate(p.date),
  }));
  const categories = ['All', ...ALLOWED_CATEGORIES];
  let selectedCategory = 'All';
  let sortOrder = 'latest';

  root.innerHTML = '';
  const header = el(`
    <section class="section">
      <div class="kicker">Work</div>
      <h1 class="title">Projects</h1>
      <p class="muted">A selection of AI, automation, and engineering tools.</p>
    </section>
  `);
  root.appendChild(header);

  const controls = el(`
    <section class="section" style="margin-top:12px;">
      <div class="glass filter-bar">
        <div class="chips filter-chips"></div>
        <div style="margin-left:auto; display:flex; align-items:center; gap:8px;">
          <label class="muted" for="sortProjects" style="font-size:12px;">Sort</label>
          <select id="sortProjects" class="select">
            <option value="latest">Latest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>
    </section>
  `);
  root.appendChild(controls);

  const chipsContainer = controls.querySelector('.filter-chips');
  const sortSelect = controls.querySelector('#sortProjects');

  function renderChips() {
    chipsContainer.innerHTML = categories.map(cat => `
      <button class="chip chip-toggle ${cat === selectedCategory ? 'is-active' : ''}" data-cat="${cat}">${cat}</button>
    `).join('');
    chipsContainer.querySelectorAll('.chip-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedCategory = btn.dataset.cat;
        renderList();
        renderChips();
      });
    });
  }

  const grid = el(`<section class="grid"></section>`);
  root.appendChild(grid);

  function renderList() {
    grid.innerHTML = '';
    const filtered = projects
      .filter(p => selectedCategory === 'All' || p._categories.includes(selectedCategory))
      .sort((a, b) => sortProjects(a, b, sortOrder));

    filtered.forEach(p => {
      const img = p.image || 'assets/images/project-placeholder.svg';
      const card = el(`
        <article class="card glass">
          <img class="project-image" loading="lazy" decoding="async" src="${img}" alt="${p.title || 'Project'}" />
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
            <h3 style="margin:0;">${p.title || 'Untitled Project'}</h3>
            ${p.date ? `<span class="muted" style="font-size:12px; white-space:nowrap;">${p.date}</span>` : ''}
          </div>
          ${p.subtitle ? `<p class="muted">${renderInlineMarkdown(p.subtitle)}</p>` : ''}
          <div class="chips">${(p.tags || []).map(t => `<span class='chip'>${t}</span>`).join('')}</div>
        </article>
      `);
      grid.appendChild(card);
      card.addEventListener('click', () => showProjectModal(p));
    });
  }

  sortSelect.addEventListener('change', () => {
    sortOrder = sortSelect.value;
    renderList();
  });

  renderChips();
  renderList();

  renderMermaidIn(root);
}

function parseCategories(categories) {
  if (!categories) return [];
  const raw = Array.isArray(categories)
    ? categories.map(c => `${c}`)
    : `${categories}`.split(/[,/|]/);
  const normalized = raw
    .map(c => normalizeCategory(c))
    .filter(Boolean);
  return Array.from(new Set(normalized));
}

function normalizeCategory(value) {
  const c = `${value}`.toLowerCase();
  if (c.includes('machine')) return 'AI/Machine Learning';
  if (c.includes('product management')) return 'Product Management + UX';
  if (c.includes('strategy')) return 'Strategy & Consulting';
  if (c.includes('analytics') || c.includes('bi systems') || c.includes('business analytics') || c.includes('data +')) {
    return 'Data + Business Analytics / BI Systems';
  }
  return null;
}

function parseDate(dateString) {
  if (!dateString) return null;
  const parsed = new Date(dateString);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sortProjects(a, b, order) {
  const aDate = a._parsedDate;
  const bDate = b._parsedDate;

  if (aDate && bDate) return order === 'latest' ? bDate - aDate : aDate - bDate;
  if (aDate && !bDate) return -1;
  if (!aDate && bDate) return 1;
  return 0;
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
      ${p.image ? `<img class='project-image project-modal-img' src='${p.image}' alt='${p.title || ''}' />` : ''}
      ${(p.tags || []).length ? `<div class='chips' style='margin:6px 0 10px;'>${(p.tags || []).map(t => `<span class='chip'>${renderInlineMarkdown(t)}</span>`).join('')}</div>` : ''}
      ${p.overview ? `<div class='muted'>${renderMarkdown(p.overview)}</div>` : ''}
      ${p.demo_gif || p.gif ? `<img class='project-image project-demo-img' src='${p.demo_gif || p.gif}' alt='${p.title || ''} demo' />` : ''}
      ${section('Stack', p.stack)}
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
