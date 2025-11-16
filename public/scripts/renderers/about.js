import { loadContent } from '../content.js';

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

// Lightweight Markdown renderer (headings, lists, emphasis, code, links, blockquotes)
function renderMarkdown(md) {
  if (!md) return '';

  const escapeHtml = (str) => str.replace(/[&<>]/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  }[ch] || ch));

  const inline = (text) => {
    let out = escapeHtml(text);
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
    out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/__(.+?)__/g, '<strong>$1</strong>');
    out = out.replace(/\*(.+?)\*/g, '<em>$1</em>');
    out = out.replace(/_(.+?)_/g, '<em>$1</em>');
    out = out.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
    return out;
  };

  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  let html = '';
  let inList = false;
  let listType = null;
  let inCode = false;
  let codeBuffer = [];

  const closeList = () => {
    if (inList) {
      html += listType === 'ol' ? '</ol>' : '</ul>';
      inList = false;
      listType = null;
    }
  };

  const flushCode = () => {
    if (inCode) {
      html += `<pre><code>${codeBuffer.map(escapeHtml).join('\n')}</code></pre>`;
      inCode = false;
      codeBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (line.startsWith('```')) {
      if (inCode) {
        flushCode();
      } else {
        closeList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(raw);
      continue;
    }

    if (!line) {
      closeList();
      continue;
    }

    if (/^-{3,}$/.test(line)) {
      closeList();
      html += '<hr />';
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      html += `<h${level}>${inline(headingMatch[2])}</h${level}>`;
      continue;
    }

    if (/^>/.test(line)) {
      closeList();
      const content = line.replace(/^>\s?/, '');
      html += `<blockquote class="muted">${inline(content)}</blockquote>`;
      continue;
    }

    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    const ulMatch = line.match(/^[-*+]\s+(.*)$/);
    if (olMatch || ulMatch) {
      const type = olMatch ? 'ol' : 'ul';
      if (!inList || listType !== type) {
        closeList();
        inList = true;
        listType = type;
        html += type === 'ol' ? '<ol class="list">' : '<ul class="list">';
      }
      const item = inline(olMatch ? olMatch[2] : ulMatch[1]);
      html += `<li>${item}</li>`;
      continue;
    }

    closeList();
    html += `<p class="muted">${inline(line)}</p>`;
  }

  closeList();
  flushCode();
  return html;
}

export async function renderAbout(root) {
  const data = await loadContent();
  const about = data.about || {};
  const name = about.name || 'About Me';
  const tagline = about.tagline || '';
  const bio = renderMarkdown(about.bio || '');
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
