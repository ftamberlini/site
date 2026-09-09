'use strict';
document.body.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
function revealTarget() {
  const id = location.hash.slice(1);
  const target = document.getElementById(id);
  if (target?.tagName === 'DETAILS') {
    target.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
}
window.addEventListener('hashchange', revealTarget);
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  const target = document.getElementById(link.hash.slice(1));
  if (target?.tagName === 'DETAILS') target.open = true;
}));
revealTarget();
const commands = [
  ['SO', 'pwd', 'Bash: mostra a pasta atual.'],
  ['SO', 'ls -lah', 'Bash: lista arquivos, incluindo ocultos, com detalhes.'],
  ['SO', 'cd projetos', 'Bash / PowerShell: entra na pasta projetos.'],
  ['SO', 'mkdir meu-site', 'Bash / PowerShell: cria uma pasta.'],
  ['SO', 'cp origem.txt copia.txt', 'Bash: copia um arquivo. Pode sobrescrever o destino.'],
  ['SO', 'cat arquivo.txt', 'Bash: exibe o conteúdo de um arquivo de texto.'],
  ['SO', 'Get-Location', 'PowerShell: mostra a pasta atual.'],
  ['SO', 'Get-ChildItem -Force', 'PowerShell: lista arquivos e pastas, incluindo ocultos.'],
  ['SO', 'Get-Content arquivo.txt', 'PowerShell: lê um arquivo de texto.'],
  ['Git', 'git status', 'Mostra o estado dos arquivos e da branch.'],
  ['Git', 'git diff', 'Mostra alterações ainda não preparadas.'],
  ['Git', 'git add index.html', 'Prepara as alterações desse arquivo para o commit.'],
  ['Git', 'git commit -m "Atualiza conteúdo"', 'Registra as alterações preparadas.'],
  ['Git', 'git log --oneline', 'Exibe um resumo do histórico de commits.'],
  ['Git', 'git switch -c minha-branch', 'Cria uma branch e muda para ela.'],
  ['Git', 'git restore --staged index.html', 'Retira da preparação, preservando a edição local.'],
  ['Git', 'git fetch', 'Busca referências remotas sem integrar alterações.'],
  ['JavaScript', 'const nome = "Ada";', 'Declara uma variável que não pode ser reatribuída.'],
  ['JavaScript', 'console.log("Olá, mundo!");', 'Exibe uma mensagem no console.'],
  ['JavaScript', 'const dobro = n => n * 2;', 'Define uma função; dobro(4) retorna 8.'],
  ['JavaScript', '[1, 2, 3].map(n => n * 2)', 'Transforma cada item: retorna [2, 4, 6].'],
  ['JavaScript', '[1, 2, 3].filter(n => n > 1)', 'Seleciona itens: retorna [2, 3].'],
  ['JavaScript', 'document.querySelector("h1")', 'Seleciona o primeiro h1; retorna null se não existir.'],
  ['JavaScript', 'JSON.stringify({ nome: "Ada" })', 'Converte um objeto em texto JSON.']
];
const commandList = document.querySelector('#commands');
const search = document.querySelector('#command-search');
const status = document.querySelector('#command-status');
let filter = 'all';
let toastTimeout;
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function announce(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.textContent = ''; }, 4500);
}
async function copyCommand(command, button) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(command);
    announce('Comando copiado.');
  } catch {
    const range = document.createRange();
    range.selectNodeContents(button.parentElement.querySelector('code'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    announce('Comando selecionado. Use Ctrl+C ou ⌘C para copiar.');
  }
}
function renderCommands() {
  const term = normalize(search.value.trim());
  const results = commands.filter(command => (filter === 'all' || command[0] === filter) && normalize(command.join(' ')).includes(term));
  commandList.replaceChildren();
  results.forEach(([category, command, description]) => {
    const row = document.createElement('div'); row.className = 'command-row';
    const label = document.createElement('span'); label.className = 'command-category'; label.textContent = category;
    const code = document.createElement('code'); code.textContent = command;
    const text = document.createElement('p'); text.textContent = description;
    const button = document.createElement('button'); button.className = 'copy-button'; button.textContent = 'Copiar'; button.setAttribute('aria-label', `Copiar ${command}`);
    button.addEventListener('click', () => copyCommand(command, button));
    row.append(label, code, text, button); commandList.append(row);
  });
  status.textContent = results.length ? `${results.length} comandos encontrados.` : 'Nenhum comando encontrado. Tente outro termo ou categoria.';
}
if (commandList && search) {
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => {
      const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
    });
    renderCommands();
  }));
  search.addEventListener('input', renderCommands);
  renderCommands();
}
function pickRandom(container, selector, keep) {
  if (!container) return;
  const items = Array.from(container.querySelectorAll(selector));
  if (items.length <= keep) return;
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  items.slice(keep).forEach(item => item.remove());
  items.slice(0, keep).forEach(item => container.append(item));
}
pickRandom(document.querySelector('#scientist-grid'), '.scientist-card', 5);
pickRandom(document.querySelector('.essay-grid'), 'article', 3);
