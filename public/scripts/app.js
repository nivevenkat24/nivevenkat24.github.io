import { initRouter } from './router.js';
import { renderAbout } from './renderers/about.js';
import { renderProjects } from './renderers/projects.js';
import { renderResume } from './renderers/resume.js';
import { renderContact } from './renderers/contact.js';

const app = document.getElementById('app');
const underline = document.querySelector('.tab-underline');
const tabs = Array.from(document.querySelectorAll('.tab'));
const backToTop = document.getElementById('backToTop');

function setActiveTab(route) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.route === route));
  const active = tabs.find(t => t.dataset.route === route) || tabs[0];
  const rect = active.getBoundingClientRect();
  const parentRect = active.parentElement.getBoundingClientRect();
  underline.style.left = `${rect.left - parentRect.left + 8}px`;
  underline.style.width = `${rect.width - 16}px`;
}

window.addEventListener('load', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
});

window.addEventListener('scroll', () => {
  if (!backToTop) return;
  backToTop.classList.toggle('show', window.scrollY > 300);
});

if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

initRouter({
  about: () => renderAbout(app),
  projects: () => renderProjects(app),
  resume: () => renderResume(app),
  contact: () => renderContact(app),
}, setActiveTab);
