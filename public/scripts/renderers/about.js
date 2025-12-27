import { loadContent } from '../content.js';
import { renderMarkdown, renderInlineMarkdown, renderMermaidIn } from '../markdown.js';

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

export async function renderAbout(root) {
  const data = await loadContent();
  const about = data.about || {};
  const name = about.name || 'About Me';
  const tagline = about.tagline || '';
  const bio = renderMarkdown(about.bio || '');
  const tldr = renderMarkdown(about.tldr || '');
  const network = renderMarkdown(about.network || '');
  const img = about.image || 'assets/images/placeholder.svg';
  root.innerHTML = '';

  const hero = el(`
    <section class="hero hero-parallel full-bg">
      <div class="hero-media">
        <img loading="lazy" src="${img}" alt="${name}" />
        <div class="card glass hero-copy">
          ${tldr}
        </div>
      </div>
      <div class="hero-right">
        <div class="card glass hero-copy">
          <div class="kicker">Hello</div>
          <h1 class="title">${name}</h1>
          <p class="subtitle">${tagline}</p>
          <div class="chips"></div>
        </div>
        <div class="card glass about-body">
          ${bio}
        </div>
      </div>
    </section>
  `);
  root.appendChild(hero);

  const chips = hero.querySelector('.chips');
  (about.highlights || []).slice(0, 6).forEach(t => {
    const c = el(`<span class="chip">${t}</span>`);
    chips.appendChild(c);
  });

  if (network) {
    const networkBlock = el(`
      <section class="section">
        <div class="card glass about-body">
          ${network}
        </div>
      </section>
    `);
    root.appendChild(networkBlock);
  }

  // if (about.roles && about.roles.length) {
  //   const roles = el(`
  //     <section class="section">
  //       <div class="card glass about-body">
  //         <h2>Open to roles in</h2>
  //         <div class="chips wrap">
  //           ${(about.roles || []).map(i => `<span class="chip chip-muted">${renderInlineMarkdown(i)}</span>`).join('')}
  //         </div>
  //         </div>
  //     </section>
  //   `);
  //   root.appendChild(roles);
  // }

  // if (about.interests && about.interests.length) {
  //   const interests = el(`
  //     <section class="section">
  //     <div class="card glass about-body">
  //       <h2>Interests</h2>
  //       <ul class="list">
  //         ${(about.interests || []).map(i => `<li>${renderInlineMarkdown(i)}</li>`).join('')}
  //       </ul>
  //       </div>
  //     </section>
  //   `);
  //   root.appendChild(interests);
  // }

  renderMermaidIn(root);
}
