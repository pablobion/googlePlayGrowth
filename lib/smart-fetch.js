/**
 * Smart Fetch Handler para Google Play
 *
 * Detecta automaticamente se o conteúdo é dinâmico e usa navegador como fallback
 */

const MIN_CONTENT_SIZE = 500; // Tamanho mínimo que esperamos de um listing real
const INDICATORS_JS_REQUIRED = [
  'nonce=', // Google Play usa nonces para CSRF
  'bootstrappedData', // Variável global que Google usa
  '"offers":', // Estrutura de dados esperada
];

/**
 * Detecta se a resposta é apenas um HTML shell vazio (conteúdo dinâmico)
 */
function isEmptyShell(htmlContent) {
  if (!htmlContent) {
    return true;
  }

  // Procura por indicadores de conteúdo real
  const hasRealContent = INDICATORS_JS_REQUIRED.some(indicator =>
    htmlContent.includes(indicator)
  );

  if (hasRealContent) {
    return false; // Tem conteúdo real
  }

  // Sem indicadores - verifica tamanho
  return htmlContent.length < MIN_CONTENT_SIZE;
}

/**
 * Faz fetch inteligente com detecção de conteúdo dinâmico
 */
async function smartFetch(url, options = {}) {
  const {
    maxRetries = 2,
    timeout = 10000,
    language = 'en',
    country = 'US'
  } = options;

  // Adiciona parâmetros de linguagem e país à URL
  const urlWithParams = new URL(url);
  urlWithParams.searchParams.set('hl', language);
  urlWithParams.searchParams.set('gl', country);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(urlWithParams.toString(), {
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();

      // Verifica se é um shell vazio (conteúdo dinâmico)
      if (isEmptyShell(html)) {
        return {
          success: false,
          isDynamic: true,
          reason: 'Conteúdo renderizado dinamicamente no cliente',
          needsBrowser: true,
          html: html // Retorna o HTML vazio para referência
        };
      }

      return {
        success: true,
        isDynamic: false,
        html: html,
        url: urlWithParams.toString()
      };

    } catch (error) {
      if (attempt === maxRetries) {
        return {
          success: false,
          isDynamic: null, // Não conseguimos determinar
          reason: `Erro ao fazer fetch: ${error.message}`,
          needsBrowser: true,
          error: error.message
        };
      }
      // Aguarda antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}

/**
 * Extrai dados básicos do HTML estático quando disponível
 */
function extractFromHTML(html) {
  const data = {
    title: null,
    shortDescription: null,
    fullDescription: null,
    rating: null,
    reviewCount: null,
    category: null
  };

  try {
    // Tenta encontrar meta tags
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) data.title = titleMatch[1];

    // Tenta encontrar descrição em meta tags
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    if (descMatch) data.shortDescription = descMatch[1];

  } catch (error) {
    console.error('Erro ao extrair dados do HTML:', error);
  }

  return data;
}

/**
 * Função principal que coordena a estratégia de aquisição
 */
async function acquirePlayStoreData(url, options = {}) {
  const {
    useBrowserIfAvailable = true,
    language = 'pt',
    country = 'BR'
  } = options;

  console.log(`\n📱 Iniciando aquisição de dados para: ${url}`);
  console.log(`📊 Tentando fetch primeiro...`);

  // Passo 1: Tenta fetch
  const fetchResult = await smartFetch(url, { language, country });

  if (fetchResult.success) {
    console.log(`✅ Fetch bem-sucedido - conteúdo estático detectado`);
    const extracted = extractFromHTML(fetchResult.html);
    return {
      method: 'fetch',
      success: true,
      data: extracted,
      html: fetchResult.html,
      url: fetchResult.url
    };
  }

  if (fetchResult.isDynamic && useBrowserIfAvailable) {
    console.log(`⚠️  Conteúdo dinâmico detectado`);
    console.log(`🌐 Switching para navegador...`);

    return {
      method: 'browser',
      success: false,
      isDynamic: true,
      reason: fetchResult.reason,
      needsBrowser: true,
      instruction: 'Use mcp__claude-in-chrome__* ou navegador nativo para ler esta página'
    };
  }

  console.log(`❌ Falha ao adquirir dados: ${fetchResult.reason}`);
  return {
    method: 'failed',
    success: false,
    reason: fetchResult.reason,
    error: fetchResult.error
  };
}

module.exports = {
  smartFetch,
  acquirePlayStoreData,
  isEmptyShell,
  extractFromHTML
};
