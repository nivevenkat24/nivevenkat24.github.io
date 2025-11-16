// Shared Markdown helpers for rendering content-loaded text (no external deps)
const escapeHtml = (str = '') => str.replace(/[&<>]/g, (ch) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
}[ch] || ch));

const formatInline = (text = '') => {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/__(.+?)__/g, '<strong>$1</strong>');
  out = out.replace(/\*(.+?)\*/g, '<em>$1</em>');
  out = out.replace(/_(.+?)_/g, '<em>$1</em>');
  out = out.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  return out;
};

export function renderInlineMarkdown(text = '') {
  if (!text) return '';
  return formatInline(text);
}

// Lightweight Markdown renderer (headings, lists, emphasis, code, links, blockquotes, hr, mermaid)
export function renderMarkdown(mdText = '') {
  if (!mdText) return '';

  const lines = mdText.replace(/\r\n?/g, '\n').split('\n');
  let html = '';
  let inList = false;
  let listType = null;
  let inCode = false;
  let codeBuffer = [];
  let codeLang = null;

  const closeList = () => {
    if (inList) {
      html += listType === 'ol' ? '</ol>' : '</ul>';
      inList = false;
      listType = null;
    }
  };

  const flushCode = () => {
    if (inCode) {
      const content = codeBuffer.join('\n');
      if ((codeLang || '').toLowerCase() === 'mermaid') {
        html += `<div class="mermaid">${content}</div>`;
      } else {
        html += `<pre><code>${escapeHtml(content)}</code></pre>`;
      }
      inCode = false;
      codeBuffer = [];
      codeLang = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      if (inCode) {
        flushCode();
      } else {
        closeList();
        inCode = true;
        codeLang = lang || null;
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
      html += `<h${level}>${formatInline(headingMatch[2])}</h${level}>`;
      continue;
    }

    if (/^>/.test(line)) {
      closeList();
      const content = line.replace(/^>\s?/, '');
      html += `<blockquote>${formatInline(content)}</blockquote>`;
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
        html += type === 'ol' ? '<ol>' : '<ul>';
      }
      const item = formatInline(olMatch ? olMatch[2] : ulMatch[1]);
      html += `<li>${item}</li>`;
      continue;
    }

    closeList();
    html += `<p>${formatInline(line)}</p>`;
  }

  closeList();
  flushCode();
  return `<div class="markdown-body muted">${html}</div>`;
}

// Render any mermaid blocks within a container (call after inserting HTML)
let mermaidConfigured = false;
const ensureMermaid = () => {
  if (typeof window === 'undefined' || typeof window.mermaid === 'undefined') return false;
  if (!mermaidConfigured) {
    window.mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });
    mermaidConfigured = true;
  }
  return true;
};

export function renderMermaidIn(container = document) {
  if (!ensureMermaid() || !container) return;
  const blocks = Array.from(container.querySelectorAll('.mermaid'));
  if (!blocks.length) return;
  blocks.forEach(b => b.removeAttribute('data-processed'));
  if (typeof window.mermaid.run === 'function') {
    window.mermaid.run({ nodes: blocks });
  } else if (typeof window.mermaid.init === 'function') {
    window.mermaid.init(undefined, blocks);
  }
}
