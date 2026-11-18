# Data acquisition and evidence rules

Google Play listings are rendered client-side. Tested 2026-11-17: WebFetch on a Play URL returned only a page shell (~228 chars, no description, rating or screenshots). Never assume a fetch worked; inspect what came back.

## Smart Acquisition System (Novo)

O plugin agora inclui um sistema inteligente de aquisição que detecta automaticamente conteúdo dinâmico e usa o navegador como fallback.

**Localização**: `lib/data-orchestrator.js`

**Como funciona**:
1. Tenta HTTP fetch (rápido)
2. Detecta se o resultado é um HTML shell vazio (indica conteúdo dinâmico)
3. Se dinâmico, automaticamente oferece usar navegador (Claude in Chrome, etc)
4. Se falhar, pede entrada manual do usuário

**Para ativar**:
```javascript
const { PlayStoreDataOrchestrator } = require('./lib/data-orchestrator');

const orchestrator = new PlayStoreDataOrchestrator({
  language: 'pt-BR',
  country: 'BR'
});

const result = await orchestrator.acquireData(url);
// Retorna automaticamente instrução para usar navegador se detectar dinâmico
```

## Cascade Manual (caso o sistema automático seja desativado)

1. **Native browser tools**, if present in the session (built-in browser pane `mcp__Claude_Browser__*`, or Claude in Chrome `mcp__claude-in-chrome__*`). Open the URL, read the rendered text, and view screenshots/icon. Load the matching skill/tool schema first. Do not write scripts, headless automation or HTML parsing.
2. **WebFetch / WebSearch**. Try the URL (add `&hl=<lang>&gl=<country>` for the target market). If content is a shell, say so and move on. WebSearch can find the app's own site, press and public third-party pages; treat these as secondary evidence.
3. **User fallback**. Ask the user to paste: title, short description, full description, category, rating, review count, and optionally screenshots/icon as images (analyze with Read). Ask only for what is missing.

If the user gave no URL, ask for it before anything else. Accept `id=` package names and build the URL.

## Evidence labels (mandatory on every finding)
- `[página]` read directly from the Play page in this session.
- `[usuário]` pasted or provided by the user.
- `[web]` from another public source (cite URL).
- `[inferência]` reasoned from the above; state the reasoning.
- `[hipótese]` plausible but untested.

A field not obtained is written as **não disponível**. Never fill it from memory or guess. Never invent competitors, review quotes, ratings, install counts or search volumes. Competitors must come from search results or the page's similar-apps list and be checked to exist.

## Failure message
When access fails, state exactly what was tried and what is missing, then ask for the minimum input needed. Do not produce a full audit on empty data; produce a partial one clearly scoped to what was read.

## Output hygiene
Do not change anything on Google Play. All text is a proposal for the user to review and approve.
