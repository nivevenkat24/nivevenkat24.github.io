import { loadContent } from '../content.js';
import { renderMarkdown, renderInlineMarkdown, renderMermaidIn } from '../markdown.js';

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

export async function renderResume(root) {
  const data = await loadContent();
  const r = data.resume || {};
  root.innerHTML = '';

  const header = el(`
    <section class="section">
      <div class="resume-header">
        <div>
          <div class="kicker">Recruiters View</div>
          <h1 class="title">Resume</h1>
          ${r.summary ? `<div class="muted">${renderMarkdown(r.summary)}</div>` : ''}
        </div>
        ${r.download ? `<a class="button button-warm" href="${r.download}" target="_blank" rel="noopener">Download PDF</a>` : ''}
      </div>
    </section>
  `);
  root.appendChild(header);

  appendList(root, 'Skills', r.skills);
  appendBlocks(root, 'Experience', r.experience);
  appendList(root, 'Education', r.education);
  renderMermaidIn(root);
}

function appendList(root, title, arr) {
  if (!arr || !arr.length) return;
  const section = el(`
    <section class="section">
      <h2>${title}</h2>
      <ul class="list">${arr.map(i => `<li>${renderInlineMarkdown(i)}</li>`).join('')}</ul>
    </section>
  `);
  root.appendChild(section);
}

function appendBlocks(root, title, arr) {
  if (!arr || !arr.length) return;
  const section = el(`
    <section class="section">
      <h2>${title}</h2>
      <div class="list">${arr.map(i => `<div class='card glass'>${renderMarkdown(i)}</div>`).join('')}</div>
    </section>
  `);
  root.appendChild(section);
}
