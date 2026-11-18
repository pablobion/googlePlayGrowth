/**
 * Browser Reader para Google Play
 *
 * Coordena o uso de ferramentas de navegador (Claude in Chrome, etc)
 * para extrair dados do Google Play quando fetch falha
 */

/**
 * Instruções para usar navegador como fallback
 */
function getBrowserInstructions(url, reason) {
  return {
    isDynamic: true,
    method: 'browser',
    url: url,
    reason: reason,
    instructions: {
      option1: {
        name: 'Claude in Chrome (Recomendado)',
        tools: [
          'mcp__claude-in-chrome__tabs_context_mcp',
          'mcp__claude-in-chrome__navigate',
          'mcp__claude-in-chrome__read_page'
        ],
        steps: [
          '1. Carrega a extensão Claude in Chrome no seu navegador',
          '2. Use mcp__claude-in-chrome__tabs_context_mcp para verificar tabs abertas',
          '3. Use mcp__claude-in-chrome__navigate para abrir a URL',
          '4. Use mcp__claude-in-chrome__read_page para ler o conteúdo renderizado'
        ]
      },
      option2: {
        name: 'WebFetch com documentação',
        note: 'Tente novamente com `&hl=pt-BR&gl=BR` na URL'
      }
    },
    codeTemplate: `
// Exemplo de código para usar o navegador
const result = await acquireWithBrowser(url, {
  language: 'pt-BR',
  country: 'BR',
  extractors: {
    title: 'h1[itemprop="name"]',
    rating: '[itemprop="ratingValue"]',
    description: '[itemprop="description"]'
  }
});
    `
  };
}

/**
 * Template de extractores CSS para Google Play
 * Atualizado para a estrutura atual do Play Store
 */
const PLAY_STORE_SELECTORS = {
  // Metadados principais
  title: {
    primary: 'h1[itemprop="name"]',
    fallback: ['h1.AHe75c', '.EY8Mke[data-heading-level="1"]']
  },

  shortDescription: {
    primary: '[itemprop="description"]',
    fallback: ['.DWPuf .Gtdjkd', '.DWPuf span']
  },

  fullDescription: {
    primary: '[itemprop="text"]',
    fallback: ['.DWPuf', '.PHBdkf']
  },

  rating: {
    primary: '[itemprop="ratingValue"]',
    fallback: ['[aria-label*="rating"]', '.TT9eCd']
  },

  reviewCount: {
    primary: '[itemprop="reviewCount"]',
    fallback: ['[aria-label*="review"]', '.lVjWfd']
  },

  category: {
    primary: '[itemprop="applicationCategory"]',
    fallback: ['a[href*="category="]', '.K9KKqd']
  },

  developer: {
    primary: '[itemprop="author"] [itemprop="name"]',
    fallback: ['a[href*="developer"]', '.DWPuf .Z3UeUe']
  },

  // Assets
  icon: {
    primary: 'img[alt="Imagem do ícone"]',
    fallback: ['img.T75of', 'img[itemprop="image"]']
  },

  screenshots: {
    primary: 'img[alt*="screenshot"]',
    fallback: ['div[role="presentation"] img', '.OXXcse img']
  }
};

/**
 * Extrai dados do DOM usando seletores CSS
 */
function extractFromDOM(document, selectors = PLAY_STORE_SELECTORS) {
  const data = {};

  for (const [field, selectorConfig] of Object.entries(selectors)) {
    let value = null;

    // Tenta seletor primário
    if (selectorConfig.primary) {
      const element = document.querySelector(selectorConfig.primary);
      if (element) {
        value = element.textContent?.trim() || element.getAttribute('content');
      }
    }

    // Tenta fallbacks
    if (!value && selectorConfig.fallback) {
      for (const selector of selectorConfig.fallback) {
        const element = document.querySelector(selector);
        if (element) {
          value = element.textContent?.trim() || element.getAttribute('content');
          if (value) break;
        }
      }
    }

    data[field] = value;
  }

  return data;
}

/**
 * Função para executar no contexto do navegador (via javascript_tool)
 */
function getExtractionScript() {
  return `
(function() {
  const SELECTORS = ${JSON.stringify(PLAY_STORE_SELECTORS)};
  const data = {};

  for (const [field, config] of Object.entries(SELECTORS)) {
    let value = null;

    // Tenta primário
    if (config.primary) {
      const el = document.querySelector(config.primary);
      value = el?.textContent?.trim() || el?.getAttribute('content');
    }

    // Tenta fallbacks
    if (!value && config.fallback) {
      for (const sel of config.fallback) {
        const el = document.querySelector(sel);
        value = el?.textContent?.trim() || el?.getAttribute('content');
        if (value) break;
      }
    }

    data[field] = value;
  }

  return {
    success: true,
    data: data,
    timestamp: new Date().toISOString(),
    url: window.location.href
  };
})();
  `;
}

/**
 * Coordena a leitura via navegador
 */
async function acquireWithBrowser(url, options = {}) {
  const {
    language = 'pt-BR',
    country = 'BR',
    timeout = 15000
  } = options;

  let urlWithLang;
  try {
    urlWithLang = new URL(url);
    urlWithLang.searchParams.set('hl', language);
    urlWithLang.searchParams.set('gl', country);
  } catch (error) {
    // Se URL for inválida, retorna com URL original
    urlWithLang = url;
  }

  const finalUrl = typeof urlWithLang === 'string' ? urlWithLang : urlWithLang.toString();

  return {
    method: 'browser',
    url: finalUrl,
    script: getExtractionScript(),
    instructions: `
# Instruções para ler com navegador

## Passo 1: Carregar ferramentas de navegador
Use ToolSearch para carregar as ferramentas Claude in Chrome:
\`\`\`
ToolSearch com query: "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__javascript_tool"
\`\`\`

## Passo 2: Abrir a URL
\`\`\`
mcp__claude-in-chrome__navigate(url: "${urlWithLang}")
\`\`\`

## Passo 3: Executar script de extração
\`\`\`
mcp__claude-in-chrome__javascript_tool(code: ${JSON.stringify(getExtractionScript())})
\`\`\`

Isso retornará os dados em JSON pronto para usar.
    `,
    selectors: PLAY_STORE_SELECTORS,
    recommendedTools: [
      'mcp__claude-in-chrome__tabs_context_mcp',
      'mcp__claude-in-chrome__navigate',
      'mcp__claude-in-chrome__read_page',
      'mcp__claude-in-chrome__javascript_tool'
    ].filter(Boolean)
  };
}

/**
 * Registra a estratégia de fallback em um log estruturado
 */
function logFallbackStrategy(result) {
  const timestamp = new Date().toISOString();
  const summary = {
    timestamp,
    method: result.method,
    isDynamic: result.isDynamic,
    reason: result.reason,
    url: result.url
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 ESTRATÉGIA DE FALLBACK');
  console.log('='.repeat(60));
  console.log(JSON.stringify(summary, null, 2));
  console.log('='.repeat(60) + '\n');

  return summary;
}

module.exports = {
  getBrowserInstructions,
  acquireWithBrowser,
  extractFromDOM,
  getExtractionScript,
  PLAY_STORE_SELECTORS,
  logFallbackStrategy
};
