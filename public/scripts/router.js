export function initRouter(routes, onChange) {
  function resolve() {
    const hash = window.location.hash || '#/about';
    const path = hash.replace(/^#\//, '');
    const [route] = path.split('/');
    const fn = routes[route] || routes['about'];
    onChange(route);
    fn();
  }
  window.addEventListener('hashchange', resolve);
  resolve();
}

