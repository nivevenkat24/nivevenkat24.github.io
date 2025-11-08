import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd());
const CONTENT_DIR = path.join(ROOT, 'content');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUTPUT = path.join(PUBLIC_DIR, 'data.json');

function normalize(str) {
  return str.replace(/\r\n?/g, '\n');
}

function parseSimpleText(txt) {
  // Generic parser for key: value with simple bullet sections
  const data = {};
  const lines = normalize(txt).split('\n');
  let currentKey = null;
  const arrayKeys = new Set([
    'highlights', 'interests', 'stack', 'focus', 'target_users', 'impact',
    'skills', 'experience', 'education', 'links', 'tags'
  ]);

  const isKeyLine = (line) => /^([A-Za-z0-9_\- ]+):\s*(.*)$/.test(line);

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;

    const keyMatch = raw.match(/^([A-Za-z0-9_\- ]+):\s*(.*)$/);
    if (keyMatch) {
      const key = keyMatch[1].trim().toLowerCase().replace(/\s+/g, '_');
      let value = keyMatch[2] || '';
      if (arrayKeys.has(key)) {
        data[key] = [];
      } else {
        data[key] = value;
      }
      currentKey = key;
      continue;
    }

    if (raw.startsWith('- ')) {
      const item = raw.slice(2).trim();
      if (currentKey && arrayKeys.has(currentKey)) {
        // links: support "label: url"
        if (currentKey === 'links' && /:\s+/.test(item)) {
          const [label, ...rest] = item.split(':');
          const url = rest.join(':').trim();
          data.links.push({ label: label.trim(), url });
        } else {
          data[currentKey].push(item);
        }
      }
      continue;
    }

    // Multiline text for certain keys
    if (currentKey && !arrayKeys.has(currentKey)) {
      data[currentKey] = (data[currentKey] ? (data[currentKey] + '\n') : '') + raw;
    }
  }

  return data;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readIfExists(p) {
  try { return await fs.readFile(p, 'utf8'); } catch { return null; }
}

async function loadAbout() {
  const p = path.join(CONTENT_DIR, 'about', 'about.txt');
  const txt = await readIfExists(p);
  return txt ? parseSimpleText(txt) : null;
}

async function loadProjects() {
  const dir = path.join(CONTENT_DIR, 'projects');
  let entries = [];
  try {
    entries = (await fs.readdir(dir)).filter(f => f.endsWith('.txt'));
  } catch { return []; }
  const projects = [];
  for (const f of entries) {
    const txt = await fs.readFile(path.join(dir, f), 'utf8');
    const parsed = parseSimpleText(txt);
    parsed.slug = f.replace(/\.txt$/, '');
    projects.push(parsed);
  }
  // Sort by title if exists
  projects.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  return projects;
}

async function loadResume() {
  const p = path.join(CONTENT_DIR, 'resume', 'resume.txt');
  const txt = await readIfExists(p);
  return txt ? parseSimpleText(txt) : null;
}

async function main() {
  const about = await loadAbout();
  const projects = await loadProjects();
  const resume = await loadResume();

  await ensureDir(PUBLIC_DIR);

  const payload = { about, projects, resume, generatedAt: new Date().toISOString() };
  await fs.writeFile(OUTPUT, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Wrote ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

