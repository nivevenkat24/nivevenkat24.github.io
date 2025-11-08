let cache = null;

export async function loadContent() {
  if (cache) return cache;
  const res = await fetch('data.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load data.json');
  cache = await res.json();
  return cache;
}

