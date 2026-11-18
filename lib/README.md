# Lib - Smart Data Acquisition para Google Play

Este diretório contém os módulos inteligentes de aquisição de dados que detectam e lidam com o carregamento dinâmico do Google Play.

## 📊 Arquitetura

### 1. **smart-fetch.js**
Faz fetch HTTP e detecta se a resposta é apenas um HTML shell vazio (sinal de conteúdo dinâmico).

**Funções principais:**
- `smartFetch(url, options)` - Fetch com retry e detecção de shell vazio
- `isEmptyShell(html)` - Verifica se HTML é apenas um shell vazio
- `extractFromHTML(html)` - Extrai dados básicos do HTML estático
- `acquirePlayStoreData(url, options)` - Orquestra a estratégia fetch → browser

**Exemplo de uso:**
```javascript
const { acquirePlayStoreData } = require('./lib/smart-fetch');

const result = await acquirePlayStoreData(
  'https://play.google.com/store/apps/details?id=com.example.app',
  { language: 'pt', country: 'BR' }
);

if (result.isDynamic) {
  console.log('⚠️  Conteúdo dinâmico detectado - use navegador');
}
```

### 2. **browser-reader.js**
Oferece as instruções e scripts necessários para ler a página via navegador (Claude in Chrome, etc).

**Funções principais:**
- `acquireWithBrowser(url, options)` - Prepara a estratégia de navegador
- `extractFromDOM(document, selectors)` - Extrai dados usando seletores CSS
- `getExtractionScript()` - Gera script JavaScript para executar no navegador
- `PLAY_STORE_SELECTORS` - Mapeamento de seletores CSS para campos do Play Store

**Exemplo de uso:**
```javascript
const { acquireWithBrowser } = require('./lib/browser-reader');

const strategy = acquireWithBrowser(url, {
  language: 'pt-BR',
  country: 'BR'
});

console.log(strategy.instructions);
// Exibe instruções sobre como carregar ferramentas de navegador
```

### 3. **data-orchestrator.js**
Orquestra toda a estratégia: Fetch → Detecção → Browser → Fallback do usuário.

**Classe principal:**
`PlayStoreDataOrchestrator` - Gerencia o fluxo completo

**Exemplo de uso:**
```javascript
const { PlayStoreDataOrchestrator } = require('./lib/data-orchestrator');

const orchestrator = new PlayStoreDataOrchestrator({
  language: 'pt-BR',
  country: 'BR',
  useCache: true
});

const result = await orchestrator.acquireData(
  'https://play.google.com/store/apps/details?id=com.example.app'
);

if (result.isDynamic) {
  console.log('Navegador necessário:');
  console.log(result.instruction);
  console.log('Próximos passos:');
  console.log(result.nextSteps);
}
```

## 🔄 Fluxo de Aquisição

```
┌─────────────────────────────────────────────┐
│ acquireData(url) - Orquestrador             │
└──────────────┬──────────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Fase 1: HTTP Fetch   │
    └──────────┬───────────┘
               │
        ┌──────▼──────┐
        │ Sucesso?    │
        └──┬──────┬───┘
        SIM│      │NÃO
           │      └──────────────┐
           │                     ▼
           │            ┌────────────────────┐
           │            │ Fase 2: Detecção   │
           │            │ É conteúdo         │
           │            │ dinâmico?          │
           │            └─┬──────────────┬──┘
           │              │ SIM    NÃO   │
           │              │             │
           │              ▼             ▼
           │        ┌──────────────┐  ┌────────┐
           │        │ Fase 3:      │  │ Falha  │
           │        │ Oferece      │  │ Fetch  │
           │        │ Navegador    │  └────────┘
           │        └──────────────┘
           │
        ┌──▼─────────────────────────────┐
        │ Retorna resultado com:          │
        │ - Dados (fetch) ou              │
        │ - Instrução navegador (dinâmico)│
        │ - Erro + fallback (falha)       │
        └─────────────────────────────────┘
```

## 🌐 Usando com Claude in Chrome

Quando o orquestrador detecta conteúdo dinâmico, ele fornece instruções automáticas:

### Passo 1: Carregar ferramentas de navegador
```
ToolSearch("select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__read_page")
```

### Passo 2: Abrir URL
```javascript
// Executar no Claude Code:
mcp__claude-in-chrome__navigate(url)
```

### Passo 3: Ler página
```javascript
// O Claude automaticamente extrai dados usando:
mcp__claude-in-chrome__read_page()
```

### Passo 4 (Opcional): Script de extração
Para dados mais estruturados, executar JavaScript:
```javascript
mcp__claude-in-chrome__javascript_tool(script)
```

## 📋 Seletores CSS do Google Play

O `PLAY_STORE_SELECTORS` em `browser-reader.js` mapeia os principais campos:

```javascript
{
  title: 'h1[itemprop="name"]',
  shortDescription: '[itemprop="description"]',
  fullDescription: '[itemprop="text"]',
  rating: '[itemprop="ratingValue"]',
  reviewCount: '[itemprop="reviewCount"]',
  category: '[itemprop="applicationCategory"]',
  developer: '[itemprop="author"] [itemprop="name"]',
  icon: 'img[alt="Imagem do ícone"]',
  screenshots: 'img[alt*="screenshot"]'
}
```

> ⚠️ **Nota**: Google Play muda sua estrutura frequentemente. Se os seletores não funcionarem, atualize em `browser-reader.js` → `PLAY_STORE_SELECTORS`.

## 💾 Cache

O orquestrador oferece cache automático para evitar requisições desnecessárias:

```javascript
const orchestrator = new PlayStoreDataOrchestrator({
  useCache: true  // Ativado por padrão
});

// Segunda chamada para a mesma URL retorna do cache
const result1 = await orchestrator.acquireData(url);
const result2 = await orchestrator.acquireData(url); // ← obtém do cache

// Limpar cache quando necessário
orchestrator.clearCache();
```

## 🧪 Testando

```javascript
const { PlayStoreDataOrchestrator } = require('./lib/data-orchestrator');

async function test() {
  const orchestrator = new PlayStoreDataOrchestrator({
    language: 'pt-BR',
    country: 'BR'
  });

  const result = await orchestrator.acquireData(
    'https://play.google.com/store/apps/details?id=com.colorsgoods.bionlabs.app'
  );

  console.log('Status:', orchestrator.getStatus());
  console.log('Resultado:', result);
}

test().catch(console.error);
```

## 🔗 Integração com Skills

Cada skill do plugin pode usar o orquestrador:

```javascript
// Em skills/audit/index.js, skills/optimize/index.js, etc
const { PlayStoreDataOrchestrator } = require('../../lib/data-orchestrator');

async function runSkill(url) {
  const orchestrator = new PlayStoreDataOrchestrator({
    language: process.env.LANGUAGE || 'pt',
    country: process.env.COUNTRY || 'BR'
  });

  const result = await orchestrator.acquireData(url);

  if (result.isDynamic) {
    // Retorna instrução para usar navegador
    return {
      status: 'browser_required',
      instruction: result.instruction,
      nextSteps: result.nextSteps
    };
  }

  if (!result.success) {
    return { status: 'error', reason: result.reason };
  }

  // Continua com os dados obtidos
  return { status: 'success', data: result.data };
}
```

## 🚀 Próximos Passos

- [ ] Testar com aplicativos reais
- [ ] Adicionar cache persistente (banco de dados)
- [ ] Implementar retry policy mais sofisticado
- [ ] Adicionar métricas de performance
- [ ] Suporte para mais idiomas/mercados
- [ ] Validação automática de seletores CSS

## 📝 Notas

- O Google Play pode bloquear requisições muito frequentes - use cache!
- Os seletores CSS podem mudar quando Google atualizar a interface
- Para máxima compatibilidade, sempre use navegador quando disponível
- Fallback para entrada manual é sempre uma opção para o usuário
