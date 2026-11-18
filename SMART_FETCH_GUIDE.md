# 🚀 Smart Fetch Guide - Plugin GooglePlayGrowth

## O Problema

Google Play carrega os dados **dinamicamente** no navegador com JavaScript. Quando você faz um simples `fetch()` ou `curl`, você recebe apenas um HTML vazio (~228 caracteres).

```
❌ Teste: fetch('https://play.google.com/store/apps/details?id=com.example.app')
└─ Retorna: HTML shell vazio (sem título, sem descrição, sem rating)
```

## A Solução: Sistema Inteligente de Aquisição

Criamos um sistema que:

1. **Tenta fetch primeiro** (rápido, ~100ms)
2. **Detecta se é conteúdo dinâmico** (HTML vazio = sinal claro)
3. **Automaticamente oferece usar navegador** (Claude in Chrome)
4. **Fallback para entrada manual** (se tudo falhar)

```
┌─────────────────┐
│  HTTP Fetch     │ ← Rápido
└────────┬────────┘
         │
    ┌────▼─────┐
    │ É vazio?  │
    └────┬─────┘
         │ SIM
    ┌────▼──────────────┐
    │ Usa Navegador      │ ← Claude in Chrome
    │ ou Manual Input    │
    └───────────────────┘
```

## 📁 Arquivos Criados

```
lib/
├── smart-fetch.js           # Detecta conteúdo dinâmico
├── browser-reader.js        # Estratégia de navegador
├── data-orchestrator.js     # Orquestra todo o fluxo
├── config.example.js        # Configurações
├── integration-example.js   # Exemplos de uso
├── README.md                # Documentação detalhada
└── SMART_FETCH_GUIDE.md     # Este arquivo
```

## 🏃 Quick Start

### Passo 1: Importar o Orquestrador

```javascript
const { PlayStoreDataOrchestrator } = require('./lib/data-orchestrator');
```

### Passo 2: Criar uma instância

```javascript
const orchestrator = new PlayStoreDataOrchestrator({
  language: 'pt-BR',
  country: 'BR',
  useCache: true  // Evita requisições repetidas
});
```

### Passo 3: Adquirir dados

```javascript
const result = await orchestrator.acquireData(
  'https://play.google.com/store/apps/details?id=com.colorsgoods.bionlabs.app'
);
```

### Passo 4: Processar resultado

```javascript
if (result.isDynamic) {
  // ⚠️  Precisa de navegador
  console.log(result.instruction);
  console.log(result.nextSteps);
} else if (result.success) {
  // ✅ Dados obtidos com sucesso
  console.log(result.data);
} else {
  // ❌ Falha
  console.log(result.reason);
}
```

## 💻 Rodando no CLI

### Opção 1: Testar com Node.js

```bash
# No diretório do projeto
cd C:\Users\Pablo\desktop\projetos\googlePlayGrowth

# Criar teste.js
cat > teste.js << 'EOF'
const { PlayStoreDataOrchestrator } = require('./lib/data-orchestrator');

async function main() {
  const orchestrator = new PlayStoreDataOrchestrator({
    language: 'pt-BR',
    country: 'BR'
  });

  const result = await orchestrator.acquireData(
    'https://play.google.com/store/apps/details?id=com.colorsgoods.bionlabs.app'
  );

  console.log('\n📊 RESULTADO:');
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
EOF

# Executar
node teste.js
```

### Opção 2: Usando via Claude Code Plugin

```bash
# Certifique-se que o plugin está instalado
claude --plugins list | grep playgrowth

# Rodar uma skill
claude playgrowth:audit "https://play.google.com/store/apps/details?id=com.colorsgoods.bionlabs.app"
```

### Opção 3: Integração em Script Python

```python
# Se quiser usar de um script Python
import subprocess
import json

result = subprocess.run([
    'node', '-e',
    '''
    const { PlayStoreDataOrchestrator } = require('./lib/data-orchestrator');
    const orch = new PlayStoreDataOrchestrator();
    orch.acquireData(process.argv[1]).then(r => console.log(JSON.stringify(r)));
    ''',
    'https://play.google.com/store/apps/details?id=com.example.app'
], capture_output=True, text=True)

data = json.loads(result.stdout)
print(data)
```

## 🌐 Usando com Claude in Chrome

Quando o sistema detecta conteúdo dinâmico, ele oferece automaticamente:

### Passo-a-passo automático:

1. **Sistema detecta**: "Conteúdo dinâmico"
2. **Sistema oferece**: Instruções para navegador
3. **Você executa** (no seu prompt Claude Code):

```
ToolSearch("select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__read_page")
```

4. **Sistema automaticamente**:
   - Abre a URL no navegador
   - Espera carregar
   - Lê o conteúdo renderizado
   - Extrai dados

## 🔍 Como Detecta Conteúdo Dinâmico

O sistema procura por indicadores no HTML:

```javascript
// Se encontrar QUALQUER um desses, é conteúdo real:
- 'nonce='              // Google Play CSRF token
- 'bootstrappedData'    // Variável com dados
- '"offers":'           // Estrutura de preços
- 'itemprop='           // Microdata estruturado

// Se NÃO encontrar NENHUM desses E o HTML < 500 caracteres
// → É um shell vazio → conteúdo dinâmico!
```

## 💾 Cache Inteligente

O sistema cache automaticamente para evitar requisições repetidas:

```javascript
// Primeira chamada: faz fetch
const result1 = await orchestrator.acquireData(url);  // ~100-200ms

// Segunda chamada MESMA URL: retorna do cache
const result2 = await orchestrator.acquireData(url);  // ~1ms + "source: cache"

// Limpar cache quando necessário
orchestrator.clearCache();
```

## 📊 Validação de Dados

Após adquirir, valida automaticamente:

```javascript
const validation = orchestrator.validateData(result.data);

if (!validation.valid) {
  console.log(`Faltam: ${validation.missing}`);
}

console.log(`Completude: ${validation.completeness}%`);
```

## 🛠️ Configuração Customizada

Copie o arquivo de exemplo:

```bash
cp lib/config.example.js lib/config.js
```

Customize conforme necessário:

```javascript
const config = require('./lib/config');

const orchestrator = new PlayStoreDataOrchestrator({
  language: config.localization.defaultLanguage,
  country: config.localization.defaultCountry,
  timeout: config.fetch.timeout,
  retries: config.fetch.maxRetries,
  useCache: config.cache.enabled
});
```

## 🧪 Testando com Diferentes URLs

```javascript
// Teste com vários apps
const apps = [
  'com.colorsgoods.bionlabs.app',           // Esperado: dinâmico
  'com.bionlabs.dailyfaith',                // Esperado: dinâmico
  'com.example.simpleapp'                   // Pode variar
];

for (const packageId of apps) {
  const url = `https://play.google.com/store/apps/details?id=${packageId}`;
  const result = await orchestrator.acquireData(url);
  
  console.log(`\n${packageId}:`);
  console.log(`  Fonte: ${result.source}`);
  console.log(`  Status: ${result.success ? '✅' : '⚠️'}`);
}
```

## 🐛 Troubleshooting

### Problema: "Sempre retorna conteúdo dinâmico"

**Solução**: Google Play pode estar bloqueando requisições frequentes
- Adicione delays entre requisições
- Use VPN se necessário
- Verifique se a URL está correta

```javascript
// Com delay
for (const url of urls) {
  const result = await orchestrator.acquireData(url);
  await new Promise(r => setTimeout(r, 2000)); // 2 segundos de espera
}
```

### Problema: "Navegador não disponível"

**Solução**: Instale Claude in Chrome
```bash
# No seu navegador Chrome, instale a extensão Claude in Chrome
# Ou use o navegador nativo do Claude Code
```

### Problema: "Seletores CSS não funcionam"

**Solução**: Google Play muda frequentemente
- Atualize `lib/browser-reader.js` → `PLAY_STORE_SELECTORS`
- Use as ferramentas de desenvolvimento do navegador (F12)
- Localize os novos seletores e atualize

## 📈 Performance

**Benchmarks estimados** (em ms):

| Método | Tempo | Confiabilidade |
|--------|-------|----------------|
| Fetch (sucesso) | 100-200ms | Alta |
| Fetch (detecta dinâmico) | 100-200ms | Alta |
| Navegador | 2000-5000ms | Muito alta |
| Cache | 1-5ms | Alta |
| Entrada manual | Instant | Depende do usuário |

## 🚀 Próximos Passos

1. **Integre em cada skill** (audit, keywords, competitors, optimize)
2. **Teste com apps reais** do usuário
3. **Colete feedback** sobre falhas
4. **Atualize seletores** CSS conforme Google muda
5. **Adicione mais idiomas/mercados** conforme necessário

## 📚 Documentação Completa

Para mais detalhes, veja:
- `lib/README.md` - Documentação técnica completa
- `lib/integration-example.js` - Exemplos de integração
- `lib/config.example.js` - Todas as opções de configuração
- `references/data-acquisition.md` - Regras de evidência e aquisição

## 💡 Exemplo Real: Auditoria de um App

```javascript
const { PlayStoreDataOrchestrator, handleAcquisitionResult } = require('./lib/data-orchestrator');

async function auditApp(googlePlayUrl) {
  console.log(`\n📱 Auditando: ${googlePlayUrl}`);
  
  const orch = new PlayStoreDataOrchestrator({
    language: 'pt-BR',
    country: 'BR'
  });

  // Adquire dados com estratégia inteligente
  const result = await orch.acquireData(googlePlayUrl);

  // Processa resultado
  const handler = handleAcquisitionResult(result);

  if (handler.action === 'continue') {
    // ✅ Dados obtidos - começa a auditoria
    console.log('\n✅ Iniciando análise...');
    
    const appData = handler.data;
    console.log(`\n📊 Dados da app:`);
    console.log(`  Título: ${appData.title || 'N/A'}`);
    console.log(`  Descrição: ${(appData.shortDescription || '').substring(0, 50)}...`);
    console.log(`  Rating: ${appData.rating || 'N/A'}`);
    
    // Continua com lógica de auditoria...
    return { status: 'audit_in_progress', data: appData };
  }

  if (handler.action === 'wait_for_browser') {
    // ⚠️  Precisa de navegador
    console.log(result.instruction);
    return { status: 'browser_required', steps: result.nextSteps };
  }

  // ❌ Falha
  console.log(`\n❌ Erro: ${result.reason}`);
  return { status: 'error', reason: result.reason };
}

// Uso
auditApp('https://play.google.com/store/apps/details?id=com.colorsgoods.bionlabs.app');
```

---

**Made with ❤️ para o GooglePlayGrowth Plugin**

Tenha dúvidas? Consulte `lib/README.md` ou `lib/integration-example.js`
