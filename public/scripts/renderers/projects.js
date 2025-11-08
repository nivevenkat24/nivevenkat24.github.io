import { loadContent } from '../content.js';

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
  root.appendChild(grid);

  projects.forEach(p => {
    const img = p.image || 'assets/images/project-placeholder.svg';
    const card = el(`
      <article class="card glass">
        <img src="${img}" alt="${p.title || 'Project'}" />
        <h3>${p.title || 'Untitled Project'}</h3>
        <p>${p.subtitle || ''}</p>
        <div class="chips">${(p.tags || []).map(t => `<span class='chip'>${t}</span>`).join('')}</div>
      </article>
    `);
    grid.appendChild(card);

    card.addEventListener('click', () => showProjectModal(p));
  });
}

function showProjectModal(p) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.5)';
  overlay.style.backdropFilter = 'blur(4px)';
  overlay.style.zIndex = '100';

  const modal = el(`
    <div class="card glass" style="max-width:900px;margin:40px auto;padding:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <h3 style="margin:0">${p.title || ''}</h3>
        <button class="button" id="closeModal">Close</button>
      </div>
      ${p.image ? `<img src='${p.image}' alt='' style='width:100%;height:260px;object-fit:cover;border-radius:12px;margin:12px 0;' />` : ''}
      ${p.overview ? `<p class='muted'>${p.overview.replace(/\n/g, '<br/>')}</p>` : ''}
      ${section('Stack', p.stack)}
      ${section('Focus', p.focus)}
      ${section('Target Users', p.target_users)}
      ${section('Impact', p.impact)}
      ${links(p.links)}
    </div>
  `);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  modal.querySelector('#closeModal').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function section(title, arr) {
  if (!arr || !arr.length) return '';
  return `
    <div class='section'>
      <h2>${title}</h2>
      <ul class='list'>${arr.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>
  `;
}

function links(items) {
  if (!items || !items.length) return '';
  return `
    <div class='section'>
      <h2>Links</h2>
      <div class='chips'>${items.map(i => `<a class='chip' href='${i.url}' target='_blank' rel='noopener'>${i.label}</a>`).join('')}</div>
    </div>
  `;
}

