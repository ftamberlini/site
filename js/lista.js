'use strict';
document.body.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menuButton && navigation) {
  const closeMenu = () => { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); };
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); }
  });
}

const painel = document.querySelector('.lista-conteudo');
const links = Array.from(document.querySelectorAll('.lista-menu a[data-slug]'));
const paginaAtual = location.pathname.split('/').pop() || 'index.html';

async function carregar(slug, mudarFoco) {
  const link = links.find(a => a.dataset.slug === slug) || links[0];
  if (!link) return;
  try {
    const resposta = await fetch(link.getAttribute('href'));
    if (!resposta.ok) throw new Error(String(resposta.status));
    const documento = new DOMParser().parseFromString(await resposta.text(), 'text/html');
    const corpo = documento.querySelector('main');
    if (!corpo) throw new Error('conteúdo ausente');
    corpo.querySelectorAll(`a[href$="${paginaAtual}"]`).forEach(a => a.closest('p')?.remove());
    painel.innerHTML = corpo.innerHTML;
    document.title = documento.querySelector('title')?.textContent || document.title;
  } catch {
    // Sem servidor HTTP o fetch falha: abre a página estática diretamente.
    window.location.href = link.getAttribute('href');
    return;
  }
  links.forEach(a => {
    const ativo = a === link;
    a.classList.toggle('ativo', ativo);
    if (ativo) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  const alvo = '#' + link.dataset.slug;
  if (location.hash !== alvo) history.replaceState(null, '', alvo);
  if (mudarFoco) painel.focus();
}

links.forEach(a => a.addEventListener('click', event => {
  event.preventDefault();
  carregar(a.dataset.slug, true);
}));

window.addEventListener('hashchange', () => {
  const slug = location.hash.slice(1);
  if (slug && links.some(a => a.dataset.slug === slug)) carregar(slug, true);
});

const inicial = location.hash.slice(1);
if (inicial && links.some(a => a.dataset.slug === inicial)) {
  carregar(inicial, false);
} else if (links.length) {
  carregar(links[Math.floor(Math.random() * links.length)].dataset.slug, false);
}
