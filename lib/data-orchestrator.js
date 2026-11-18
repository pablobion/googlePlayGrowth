/**
 * Data Orchestrator para Google Play Growth
 *
 * Coordena a aquisição inteligente de dados:
 * 1. Tenta fetch rápido
 * 2. Detecta conteúdo dinâmico
 * 3. Automaticamente usa navegador se disponível
 * 4. Fallback para entrada do usuário
 */

const smartFetch = require('./smart-fetch');
const browserReader = require('./browser-reader');

class PlayStoreDataOrchestrator {
  constructor(options = {}) {
    this.options = {
      language: options.language || 'pt',
      country: options.country || 'BR',
      timeout: options.timeout || 10000,
      retries: options.retries || 2,
      useCache: options.useCache !== false,
      cache: new Map(),
      ...options
    };
  }

  /**
   * Estratégia completa: Fetch → Detecção → Browser → Usuário
   */
  async acquireData(url, context = {}) {
    const cacheKey = `${url}:${this.options.language}`;

    // Verifica cache
    if (this.options.useCache && this.options.cache.has(cacheKey)) {
      console.log('💾 Dados obtidos do cache');
      return {
        source: 'cache',
        success: true,
        ...this.options.cache.get(cacheKey)
      };
    }

    console.log('\n' + '='.repeat(70));
    console.log('🔍 ORQUESTRADOR DE AQUISIÇÃO DE DADOS - GOOGLE PLAY');
    console.log('='.repeat(70));

    // Fase 1: Fetch rápido
    console.log('\n[Fase 1/3] Tentando fetch direto...');
    const fetchResult = await smartFetch.smartFetch(url, {
      language: this.options.language,
      country: this.options.country,
      timeout: this.options.timeout,
      maxRetries: this.options.retries
    });

    if (fetchResult.success) {
      console.log('✅ Sucesso! Conteúdo estático obtido via fetch');
      const extracted = smartFetch.extractFromHTML(fetchResult.html);

      const result = {
        source: 'fetch',
        success: true,
        method: 'HTTP fetch',
        data: extracted,
        html: fetchResult.html,
        url: fetchResult.url,
        timestamp: new Date().toISOString(),
        confidence: 'alto'
      };

      // Armazena em cache
      if (this.options.useCache) {
        this.options.cache.set(cacheKey, {
          ...result,
          timestamp: new Date().toISOString()
        });
      }

      return result;
    }

    // Fase 2: Detectou dinâmico?
    if (fetchResult.isDynamic) {
      console.log('\n[Fase 2/3] ⚠️  Conteúdo renderizado dinamicamente detectado');
      console.log('→ Google Play carrega dados via JavaScript');

      // Fase 3: Oferece navegador como solução
      console.log('\n[Fase 3/3] 🌐 Preparando estratégia de navegador...');

      const browserStrategy = browserReader.acquireWithBrowser(url, {
        language: this.options.language,
        country: this.options.country
      });

      return {
        source: 'browser_required',
        success: false,
        isDynamic: true,
        reason: fetchResult.reason,
        strategy: browserStrategy,
        instruction: this.generateBrowserInstruction(url),
        nextSteps: this.getBrowserNextSteps()
      };
    }

    // Fase 4: Falha no fetch
    console.log('\n❌ Falha ao adquirir dados via fetch');
    console.log(`Motivo: ${fetchResult.reason}`);

    return {
      source: 'failed',
      success: false,
      reason: fetchResult.reason,
      error: fetchResult.error,
      fallback: 'browser_or_user_input',
      nextSteps: [
        '1. Usar navegador com Claude in Chrome (se disponível)',
        '2. Pedir ao usuário para colar manualmente os dados'
      ]
    };
  }

  /**
   * Gera instrução clara para usar navegador
   */
  generateBrowserInstruction(url) {
    return `
╔══════════════════════════════════════════════════════════════╗
║          NAVEGADOR NECESSÁRIO - CONTEÚDO DINÂMICO            ║
╚══════════════════════════════════════════════════════════════╝

📱 URL: ${url}

A página do Google Play carrega dados dinamicamente no navegador.
Para continuar, você tem 2 opções:

OPÇÃO 1: Usar Claude in Chrome (Automático) ⭐ RECOMENDADO
─────────────────────────────────────────────
1. Execute no seu terminal:
   ! which claude  # Verifica se claude-code está instalado

2. Carregue as ferramentas de navegador:

   ToolSearch("select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__read_page")

3. Deixe o assistente ler a página automaticamente

OPÇÃO 2: Entrada Manual
──────────────────────
Você pode colar manualmente:
- Título
- Descrição curta
- Descrição completa
- Categoria
- Rating e contagem de reviews
- Screenshots/ícone (como imagens)

Qual opção você prefere?
    `;
  }

  /**
   * Próximos passos estruturados
   */
  getBrowserNextSteps() {
    return [
      {
        step: 1,
        action: 'Carregar ferramentas de navegador',
        command: 'ToolSearch("select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__read_page")',
        why: 'Permite ao Claude Code interagir com o navegador'
      },
      {
        step: 2,
        action: 'Abrir a URL no navegador',
        command: 'mcp__claude-in-chrome__navigate(url)',
        why: 'Carrega e renderiza a página com todos os dados dinâmicos'
      },
      {
        step: 3,
        action: 'Ler o conteúdo renderizado',
        command: 'mcp__claude-in-chrome__read_page()',
        why: 'Extrai o HTML com todos os dados já carregados'
      },
      {
        step: 4,
        action: 'Executar script de extração (opcional)',
        command: 'mcp__claude-in-chrome__javascript_tool(script)',
        why: 'Extrai dados estruturados direto do DOM'
      }
    ];
  }

  /**
   * Valida dados adquiridos
   */
  validateData(data) {
    const required = ['title', 'shortDescription'];
    const missing = required.filter(field => !data[field]);

    if (missing.length > 0) {
      return {
        valid: false,
        missing: missing,
        message: `Campos obrigatórios faltando: ${missing.join(', ')}`
      };
    }

    return {
      valid: true,
      completeness: this.calculateCompleteness(data)
    };
  }

  /**
   * Calcula completude dos dados
   */
  calculateCompleteness(data) {
    const fields = Object.values(data).filter(v => v !== null && v !== undefined);
    const total = Object.keys(data).length;
    return Math.round((fields.length / total) * 100);
  }

  /**
   * Limpa o cache
   */
  clearCache() {
    this.options.cache.clear();
    console.log('💾 Cache limpo');
  }

  /**
   * Exibe status do orchestrador
   */
  getStatus() {
    return {
      cacheSize: this.options.cache.size,
      options: {
        language: this.options.language,
        country: this.options.country,
        useCache: this.options.useCache,
        timeout: this.options.timeout,
        retries: this.options.retries
      }
    };
  }
}

/**
 * Função utilitária: processa resultado e define próxima ação
 */
function handleAcquisitionResult(result) {
  console.log('\n' + '='.repeat(70));
  console.log('📊 RESULTADO DA AQUISIÇÃO');
  console.log('='.repeat(70));

  switch (result.source) {
    case 'fetch':
      console.log('✅ Dados obtidos com sucesso via fetch');
      console.log(`📋 Campos obtidos: ${Object.keys(result.data).length}`);
      console.log(`⭐ Confiança: ${result.confidence}`);
      return { action: 'continue', data: result.data };

    case 'browser_required':
      console.log('⚠️  Navegador necessário para este app');
      console.log(result.instruction);
      return { action: 'wait_for_browser', strategy: result.strategy };

    case 'cache':
      console.log('💾 Dados obtidos do cache');
      return { action: 'continue', data: result.data };

    case 'failed':
      console.log('❌ Falha ao adquirir dados');
      console.log(`Motivo: ${result.reason}`);
      return {
        action: 'manual_input_or_browser',
        reason: result.reason
      };
  }
}

module.exports = {
  PlayStoreDataOrchestrator,
  handleAcquisitionResult
};
