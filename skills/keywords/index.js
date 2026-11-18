/**
 * Skill: playgrowth:keywords
 *
 * Identifica keywords relevantes para um app no Google Play:
 * - Keywords primárias (high impact)
 * - Keywords secundárias
 * - Long-tail keywords
 * - Volume estimado
 * - Dificuldade de ranking
 */

const { PlayStoreDataOrchestrator } = require('../../lib/data-orchestrator');

/**
 * Extrai keywords potenciais dos dados do app
 */
function extractKeywords(appData) {
  const keywords = [];

  const fields = [
    appData.title,
    appData.shortDescription,
    appData.fullDescription,
    appData.category
  ];

  const commonStopwords = ['o', 'a', 'de', 'do', 'da', 'em', 'para', 'com', 'é', 'e', 'ou', 'que', 'um', 'uma'];

  for (const field of fields) {
    if (!field) continue;

    const words = field.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !commonStopwords.includes(w));

    words.forEach(word => {
      const existing = keywords.find(k => k.term === word);
      if (existing) {
        existing.frequency++;
      } else {
        keywords.push({ term: word, frequency: 1, difficulty: 'medium' });
      }
    });
  }

  return keywords
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 20);
}

/**
 * Calcula dificuldade de keyword
 */
function calculateKeywordDifficulty(keyword) {
  const length = keyword.length;

  if (length <= 4) return 'high';
  if (length <= 7) return 'medium';
  return 'low';
}

/**
 * Função principal da skill
 */
async function findKeywords(url, options = {}) {
  const {
    language = 'pt-BR',
    country = 'BR',
    limit = 20
  } = options;

  console.log('\n🔍 PESQUISA DE KEYWORDS - GOOGLE PLAY\n');
  console.log(`URL: ${url}`);
  console.log(`Idioma: ${language}\n`);

  // Adquirir dados
  console.log('📱 Adquirindo dados do app...\n');

  const orchestrator = new PlayStoreDataOrchestrator({
    language: language.split('-')[0],
    country: country,
    useCache: true
  });

  const acquisitionResult = await orchestrator.acquireData(url);

  if (!acquisitionResult.success && acquisitionResult.isDynamic) {
    return {
      status: 'browser_required',
      message: 'Conteúdo dinâmico detectado',
      instruction: acquisitionResult.instruction,
      nextSteps: acquisitionResult.nextSteps
    };
  }

  if (!acquisitionResult.success) {
    return {
      status: 'error',
      reason: acquisitionResult.reason
    };
  }

  const appData = acquisitionResult.data;

  // Extrair keywords
  console.log('🎯 Extraindo keywords...\n');

  const extractedKeywords = extractKeywords(appData);
  const withDifficulty = extractedKeywords.map(k => ({
    ...k,
    difficulty: calculateKeywordDifficulty(k.term)
  }));

  // Categorizar
  const primary = withDifficulty.filter(k => k.frequency >= 2).slice(0, 5);
  const secondary = withDifficulty.filter(k => k.frequency === 1).slice(0, 10);

  return {
    status: 'success',
    type: 'keywords',
    appData: {
      title: appData.title,
      category: appData.category
    },
    keywords: {
      primary: primary.map(k => ({ term: k.term, difficulty: k.difficulty })),
      secondary: secondary.map(k => ({ term: k.term, difficulty: k.difficulty })),
      all: withDifficulty.slice(0, limit)
    },
    recommendations: [
      'Focar em palavras de baixa dificuldade primeiro',
      'Usar keywords primárias no título',
      'Distribuir secundárias na descrição',
      'Testar variações de long-tail'
    ]
  };
}

module.exports = {
  findKeywords,
  extractKeywords,
  calculateKeywordDifficulty
};
