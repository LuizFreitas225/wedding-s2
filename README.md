# Site de casamento — Luiz & Maysa

Site estático minimalista (HTML, CSS, JS) pronto para **GitHub Pages**.

## Conteúdo do repositório

- `index.html` — página única com todas as seções
- `assets/css/styles.css` — estilos (paleta lilás, responsivo)
- `assets/js/main.js` — contagem regressiva, galeria (lightbox), música de fundo
- `assets/img/` — fotos para o site (`hero.jpg`, `galeria-01.jpg` … `galeria-07.jpg`, `favicon.svg`)
- `assets/audio/` — coloque aqui `jesus-meu-esposo.mp3` (veja `assets/audio/README.txt`)
- `imagens/` — cópias originais exportadas do WhatsApp (referência)
- `.nojekyll` — evita que o GitHub Pages use Jekyll em arquivos/pastas especiais

## O que você precisa editar antes de publicar

1. **Links (RSVP e presentes)** — em `index.html`, nos botões:
   - `data-todo="link-rsvp"` → troque `href="#"` pelo URL do formulário de confirmação.
   - `data-todo="link-presentes"` → troque `href="#"` pelo URL da lista de presentes.

2. **Open Graph / compartilhamento** — em `index.html`, meta tags `og:url` e `og:image`:
   - Substitua `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/` pela URL real após o deploy.

3. **Texto “Nossa história”** — edite os parágrafos na seção correspondente em `index.html`.

4. **Endereço da chácara** (quando quiserem divulgar) — altere o parágrafo com `data-todo="endereco-chacara"` ou o texto da recepção.

5. **Música** — adicione o arquivo `assets/audio/jesus-meu-esposo.mp3`. Sem ele, o botão de música pode falhar ao tocar.

6. **Fotos** — substitua os arquivos em `assets/img/` mantendo os mesmos nomes, ou atualize os caminhos em `index.html`.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie estes arquivos (branch `main`).
2. No repositório: **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, branch `main`, pasta **`/ (root)`**.
4. Aguarde alguns minutos; o site ficará em `https://<usuario>.github.io/<repositorio>/`.

Se usar domínio próprio, adicione um arquivo `CNAME` na raiz (documentação do GitHub Pages).

## Desenvolvimento local

Abra `index.html` no navegador ou use um servidor estático, por exemplo:

```bash
cd /caminho/para/casamento
python3 -m http.server 8080
```

Acesse `http://localhost:8080`.

---

Com amor, L & M — 18 de julho de 2026.
