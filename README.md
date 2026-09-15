# Fernando Tamberlini — site pessoal

Site responsivo em português com HTML, CSS e JavaScript, sem framework ou etapa de build.

## Executar com uv

```sh
uv run --no-project python -m http.server 8000 --bind 127.0.0.1
```

Acesse http://localhost:8000. Também é possível abrir `index.html` diretamente; se a área de transferência não estiver disponível, o botão de cópia seleciona o comando e orienta a cópia manual.

## Arquivos

- `index.html`: conteúdo, disciplinas, 19 perfis de cientistas, reflexões e apresentação.
- `content/cientistas/cientistas.html` e `content/divagacoes/divagacoes.html`: páginas com menu lateral (itens em ordem alfabética) e conteúdo carregado dos arquivos da mesma pasta; sem escolha, mostram um item aleatório.
- `css/estilo.css`: identidade visual, responsividade, foco por teclado e impressão.
- `js/script.js`: menu móvel, abertura por âncora, sorteio de cinco cientistas e três divagações na `index.html` e a busca/filtros/cópia dos 24 comandos na página de ensino (roda só onde houver o bloco `#commands`).
- `js/lista.js`: script compartilhado das páginas de cientistas e divagações (menu lateral, carregamento do conteúdo e sorteio inicial).
- `content/cientistas/`, `content/divagacoes/`: uma página HTML por cientista e por divagação.
- `content/ensino/ensino.html`: destino do menu "Ensino" — menu lateral de disciplinas, cards das 3 disciplinas e os guias Git e Cheat sheet (com a busca de comandos), estes últimos em blocos recolhíveis na própria página. Usa `js/script.js`.
- `content/ensino/<disc>/<disc>.html` (`mpccd.html`, `mdcoo.html`, `pfei.html`): página de cada disciplina, com o mesmo estilo do site e o mesmo menu lateral.
- `img/favicon.svg`: ícone do site.
- `img/<slug>.jpg`: foto de cada cientista (usada no card da página inicial e no topo da página individual); onde não há foto, mantém-se o monograma com as iniciais.

## Conteúdo e manutenção

Cada página de disciplina reproduz o conteúdo do acervo original: MPCCD de `https://ftamberlini.dev.br/202602/mpccd.html`, MDCOO e PFEI de `https://ftamberlini.dev.br/202502/{mdcoo,pfei}.html`. Links de arquivos apontam para o domínio original. Os links para os materiais originais estão nas disciplinas. As datas antigas não são apresentadas como calendário atual. Os perfis incluem referências para leitura adicional. As reflexões são textos editoriais propostos para o site, sem atribuição de experiências pessoais ao professor.

Edite os textos em `index.html` e o array `commands` em `js/script.js`. As fontes DM Sans e Manrope usam Google Fonts, com alternativas locais caso o serviço não esteja disponível. Todo o conteúdo editorial continua acessível sem JavaScript; busca, filtros e cópia precisam de JavaScript.

## Publicar

Envie `index.html` e as pastas `css/`, `js/`, `img/` e `content/` para qualquer hospedagem estática. Não é necessário Python ou uv em produção. As páginas de cientistas e divagações carregam o conteúdo via `fetch`, então precisam ser servidas por HTTP (não abrir o arquivo direto); sem servidor, os links do menu lateral abrem a página estática correspondente.
