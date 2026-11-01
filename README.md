# Pneu.com Jundiaí — Site estático para GitHub e Vercel

Site responsivo sem Lovable, React ou dependências de compilação. **Não requer npm install / npm run build.**

## Publicar no GitHub

1. Crie um repositório (ex.: `pneucom-jundiai-site`).
2. Envie **todos os arquivos e a pasta `assets/` diretamente à raiz do repositório**, incluindo `index.html` e `vercel.json`. Evite aninhar uma pasta `PneuCom_GitHub_Vercel` dentro da raiz do repositório.
3. Confira se o GitHub mostra `index.html` ao lado de `vercel.json`.

## Publicar na Vercel

1. Vercel → Add New → Project → importe o repositório GitHub.
2. Framework Preset: **Other**.
3. Root Directory: **./** (raiz do repositório).
4. Build Command: **desativado / vazio**. Install Command: **desativado** (sem dependências).
5. Output Directory: **.** (raiz; se o painel exibir campo, especifique `.`).
6. Deploy. Em Settings → Domains, configure o domínio **após confirmar domínio e DNS**.

`vercel.json` usa `cleanUrls: true`, então `/diesel-leve.html` redireciona para `/diesel-leve` na Vercel. Mantenha os HTMLs na raiz.

## Conteúdo incluído

- Homepage `index.html`, `diesel-leve.html`, `linha-leve.html`, `alinhamento-balanceamento.html`, `frotas.html`, `sobre.html` e `contato.html`.
- `style.css`, `app.js`, imagens em `assets/`, `robots.txt`, `404.html`, `vercel.json`.
- Rolagem animada, menu responsivo, painéis de serviços, galeria, formulários que preparam mensagens no WhatsApp.

## CONFERIR ANTES DE PUBLICAR — importante

- **WhatsApp provisório:** site contém o número `5511991783385` / `(11) 99178-3385`, herdado do protótipo anterior; não confirmado. Aparece em links nos arquivos HTML e na variável `WA_NUMBER` de `app.js`. Faça busca global e substitua se necessário.
- **Localização/horários:** confirme endereço, mapa e dados operacionais no conteúdo e no JSON-LD.
- **Fotografias:** as imagens são **conceituais/ilustrativas**. Devem ser substituídas por fotos reais autorizadas antes de apresentação pública como fotos da oficina.
- **Domínio/SEO:** após confirmar domínio definitivo, definir URL canônica absoluta em cada página, URLs OG e sitemap.xml e atualizar robots.txt com endereço do sitemap. Não use domínio não confirmado. Depois cadastrar domínio no Google Search Console.
- **Integrações:** o botão WhatsApp abre o serviço externo; não há backend, CRM, agendamento com calendário, painel de edição, envio de e-mails ou banco de dados.
- **Métricas:** não exibir avaliações, depoimentos ou números inventados. Medir conversões com consentimento e privacidade adequados.

## Testar localmente

```bash
python3 -m http.server 8000
```

Acesse http://localhost:8000. Com servidor local, links internos seguem `.html`; na Vercel são redirecionados para URLs limpas.

### Status

Empacotamento e integridade de referências locais: verificados. A publicação real no GitHub/Vercel e DNS **ainda não foi executada**.
