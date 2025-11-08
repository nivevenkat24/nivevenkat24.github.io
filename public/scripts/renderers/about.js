import { loadContent } from '../content.js';

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

export async function renderAbout(root) {
  const data = await loadContent();
  const about = data.about || {};
  const name = about.name || 'About Me';
  const tagline = about.tagline || '';
  const bio = (about.bio || '').split(/\n\n+/).map(p => `<p class="muted">${p}</p>`).join('');
  const img = about.image || 'assets/images/placeholder.svg';

  root.innerHTML = '';

  const hero = el(`
    <section class="hero">
      <div class="card glass">
        <div class="kicker">Hello</div>
        <h1 class="title">${name}</h1>
        <p class="subtitle">${tagline}</p>
        ${bio}
        <div class="chips"></div>
      </div>
      <div>
        <img src="${img}" alt="${name}" />
      </div>
    </section>
  `);
  root.appendChild(hero);

  const chips = hero.querySelector('.chips');
  (about.highlights || []).slice(0, 6).forEach(t => {
    const c = el(`<span class="chip">${t}</span>`);
    chips.appendChild(c);
  });

  if (about.interests && about.interests.length) {
    const interests = el(`
      <section class="section">
        <h2>Interests</h2>
        <ul class="list">
          ${(about.interests || []).map(i => `<li>${i}</li>`).join('')}
        </ul>
      </section>
    `);
    root.appendChild(interests);
  }
}

