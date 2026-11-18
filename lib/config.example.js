/**
 * Arquivo de Configuração de Exemplo
 *
 * Copie este arquivo e customize conforme necessário para seu ambiente
 * cp lib/config.example.js lib/config.js
 */

module.exports = {
  // ==================== CONFIGURAÇÃO DE NAVEGADOR ====================
  browser: {
    // Habilita automaticamente o uso de navegador quando fetch falha
    autoFallbackToNavigator: true,

    // Timeout para operações de navegador (em ms)
    timeout: 15000,

    // Aguarda a página carregar completamente
    waitForPageLoad: true,

    // Aguarda elementos específicos aparecerem no DOM
    waitForSelectors: [
      'h1[itemprop="name"]',           // Título
      '[itemprop="description"]',       // Descrição
      '[itemprop="ratingValue"]'        // Rating
    ],

    // Tempo máximo de espera pelos seletores
    maxWaitTime: 10000
  },

  // ==================== CONFIGURAÇÃO DE FETCH ====================
  fetch: {
    // Número de tentativas antes de falhar
    maxRetries: 2,

    // Timeout para requisição HTTP (em ms)
    timeout: 10000,

    // User-Agent customizado
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',

    // Headers adicionais
    headers: {
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      'Referer': 'https://play.google.com/'
    },

    // Mínimo de caracteres para considerar um resultado válido
    minContentSize: 500,

    // Indicadores que o conteúdo é real (não um shell vazio)
    validContentIndicators: [
      'nonce=',
      'bootstrappedData',
      '"offers":',
      'itemprop='
    ]
  },

  // ==================== CONFIGURAÇÃO DE IDIOMA E LOCALIZACAO ====================
  localization: {
    // Idioma padrão
    defaultLanguage: 'pt',

    // País padrão
    defaultCountry: 'BR',

    // Mapeamento de idiomas para códigos de localização
    languageMap: {
      'pt': { hl: 'pt', gl: 'BR' },
      'pt-BR': { hl: 'pt-BR', gl: 'BR' },
      'en': { hl: 'en', gl: 'US' },
      'en-US': { hl: 'en', gl: 'US' },
      'es': { hl: 'es', gl: 'ES' },
      'fr': { hl: 'fr', gl: 'FR' },
      'de': { hl: 'de', gl: 'DE' }
    }
  },

  // ==================== CONFIGURAÇÃO DE CACHE ====================
  cache: {
    // Habilita cache de dados
    enabled: true,

    // Tipo de cache ('memory' ou 'persistent')
    type: 'memory',

    // TTL do cache em milissegundos (1 hora)
    ttl: 1 * 60 * 60 * 1000,

    // Caminho para banco de dados persistente (se type === 'persistent')
    dbPath: './data/cache.db',

    // Limpar cache automaticamente ao iniciar
    clearOnStart: false
  },

  // ==================== CONFIGURAÇÃO DE SELETORES CSS ====================
  selectors: {
    // Define os seletores CSS para cada campo
    // Usar 'primary' para o seletor preferido
    // Usar 'fallback' para alternativas caso o primário falhe

    title: {
      primary: 'h1[itemprop="name"]',
      fallback: [
        'h1.AHe75c',
        '.EY8Mke[data-heading-level="1"]',
        'h1'
      ]
    },

    shortDescription: {
      primary: '[itemprop="description"]',
      fallback: [
        '.DWPuf .Gtdjkd',
        '.DWPuf span',
        '[data-short-desc]'
      ]
    },

    fullDescription: {
      primary: '[itemprop="text"]',
      fallback: [
        '.DWPuf',
        '.PHBdkf',
        '[data-full-desc]'
      ]
    },

    rating: {
      primary: '[itemprop="ratingValue"]',
      fallback: [
        '[aria-label*="rating"]',
        '.TT9eCd',
        '.F3xywe'
      ]
    },

    reviewCount: {
      primary: '[itemprop="reviewCount"]',
      fallback: [
        '[aria-label*="review"]',
        '.lVjWfd'
      ]
    },

    category: {
      primary: '[itemprop="applicationCategory"]',
      fallback: [
        'a[href*="category="]',
        '.K9KKqd'
      ]
    },

    developer: {
      primary: '[itemprop="author"] [itemprop="name"]',
      fallback: [
        'a[href*="developer"]',
        '.DWPuf .Z3UeUe'
      ]
    },

    icon: {
      primary: 'img[alt="Imagem do ícone"]',
      fallback: [
        'img.T75of',
        'img[itemprop="image"]'
      ]
    },

    screenshots: {
      primary: 'img[alt*="screenshot"]',
      fallback: [
        'div[role="presentation"] img',
        '.OXXcse img'
      ]
    },

    downloads: {
      primary: '[itemprop="interactionStatistic"] [itemprop="userInteractionCount"]',
      fallback: [
        '.Ff99ff',
        '[aria-label*="download"]'
      ]
    },

    version: {
      primary: '[itemprop="softwareVersion"]',
      fallback: [
        '.Ff99ff:contains("Version")',
        '[data-version]'
      ]
    },

    lastUpdate: {
      primary: '[itemprop="datePublished"]',
      fallback: [
        '.Ff99ff:contains("Updated")',
        '[data-update-date]'
      ]
    }
  },

  // ==================== CONFIGURAÇÃO DE LOGGING ====================
  logging: {
    // Nível de log ('debug', 'info', 'warn', 'error')
    level: 'info',

    // Habilita logging no console
    console: true,

    // Habilita logging em arquivo
    file: false,

    // Caminho para arquivo de log
    logPath: './logs/orchestrator.log',

    // Habilita logs de timing (performance)
    timing: true,

    // Habilita logs de cache hits/misses
    cacheStats: true
  },

  // ==================== CONFIGURAÇÃO DE VALIDACAO ====================
  validation: {
    // Campos obrigatórios
    required: ['title', 'shortDescription'],

    // Comprimento mínimo para campos de texto
    minLength: {
      title: 10,
      shortDescription: 20,
      fullDescription: 50
    },

    // Comprimento máximo para campos de texto
    maxLength: {
      title: 50,
      shortDescription: 80,
      fullDescription: 4000
    },

    // Padrões regex para validação
    patterns: {
      rating: /^[\d.]+$/,
      reviewCount: /^\d+$/,
      icon: /\.(png|jpg|jpeg|webp)$/i
    }
  },

  // ==================== CONFIGURAÇÃO DE FALLBACK ====================
  fallback: {
    // Estratégias de fallback em ordem de prioridade
    strategies: [
      'browser',           // Usa navegador (Claude in Chrome)
      'manual_input',      // Pede entrada manual do usuário
      'cached_data',       // Usa dados em cache (se disponível)
      'partial_data'       // Usa dados parciais obtidos
    ],

    // Habilita fallback automático
    autoFallback: true,

    // Pede confirmação antes de cada fallback
    confirmFallback: false
  },

  // ==================== CONFIGURAÇÃO DE ENVIRONMENT ====================
  environment: {
    // Define o ambiente ('production', 'staging', 'development')
    env: process.env.NODE_ENV || 'development',

    // Habilita modo debug
    debug: process.env.DEBUG === 'true',

    // URL base do Google Play (pode variar por país)
    playStoreBaseUrl: 'https://play.google.com/store/apps/details',

    // Intervalo de retry (em ms, exponencial)
    retryBackoffMultiplier: 2,
    initialRetryDelay: 1000
  }
};

/**
 * Como usar a configuração em seu código:
 *
 * const config = require('./lib/config');
 *
 * const orchestrator = new PlayStoreDataOrchestrator({
 *   language: config.localization.defaultLanguage,
 *   country: config.localization.defaultCountry,
 *   timeout: config.fetch.timeout,
 *   retries: config.fetch.maxRetries,
 *   useCache: config.cache.enabled
 * });
 */
