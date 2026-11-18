/**
 * Skill: playgrowth:audit
 *
 * Auditoria completa de ASO para um app no Google Play:
 * - Análise de metadata
 * - Análise de visuals
 * - Análise de reputação
 * - Análise de competição
 * - Análise de keywords
 * - Score geral
 * - Plano de crescimento
 */

const { PlayStoreDataOrchestrator } = require('../../lib/data-orchestrator');
const { getSupportedLanguages } = require('../../lib/multi-language-generator');

/**
 * Calcula score de metadata
 */
function scoreMetadata(appData) {
  let score = 0;
  let maxScore = 0;

  // Título (máx 30 chars)
  maxScore += 15;
  if (appData.title) {
    const titleLength = appData.title.length;
    if (titleLength > 0 && titleLength <= 30) {
      score += 15;
    } else if (titleLength > 30) {
      score += 10; // Excede limite
    } else {
      score += 5; // Muito curto
    }
  }

  // Descrição curta (máx 80 chars)
  maxScore += 15;
  if (appData.shortDescription) {
    const descLength = appData.shortDescription.length;
    if (descLength > 20 && descLength <= 80) {
      score += 15;
    } else if (descLength > 80) {
      score += 8;
    } else {
      score += 5;
    }
  }

  // Descrição completa (máx 4000 chars)
  maxScore += 15;
  if (appData.fullDescription) {
    const fullLength = appData.fullDescription.length;
    if (fullLength > 100 && fullLength <= 4000) {
      score += 15;
    } else if (fullLength > 4000) {
      score += 8;
    } else {
      score += 5;
    }
  }

  // Rating
  maxScore += 20;
  if (appData.rating) {
    const rating = parseFloat(appData.rating);
    if (rating >= 4.5) {
      score += 20;
    } else if (rating >= 4.0) {
      score += 15;
    } else if (rating >= 3.5) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // Icon
  maxScore += 10;
  if (appData.icon) {
    score += 10;
  }

  // Screenshots
  maxScore += 10;
  if (appData.screenshots) {
    score += 10;
  }

  // Category
  maxScore += 15;
  if (appData.category) {
    score += 15;
  }

  return {
    current: Math.round((score / maxScore) * 100),
    maxPossible: 100,
    breakdown: {
      metadata: score,
      maxMetadata: maxScore
    }
  };
}

/**
 * Gera plano de crescimento de 30 dias
 */
function generateGrowthPlan(auditScore) {
  const plan = {
    period: '30 dias',
    experiments: []
  };

  if (auditScore.current < 50) {
    plan.experiments = [
      {
        week: 1,
        focus: 'Metadata básica',
        tasks: [
          'Otimizar título (máx 30 chars)',
          'Reescrever descrição curta',
          'Melhorar descrição completa'
        ]
      },
      {
        week: 2,
        focus: 'Visuals',
        tasks: [
          'Atualizar ícone do app',
          'Revisar primeiros screenshots',
          'Adicionar preview text'
        ]
      }
    ];
  } else if (auditScore.current < 75) {
    plan.experiments = [
      {
        week: 1,
        focus: 'A/B Testing',
        tasks: [
          'Testar 2 variações de título',
          'Testar descrições com keywords diferentes'
        ]
      },
      {
        week: 2,
        focus: 'Localization',
        tasks: [
          'Adicionar suporte multi-idioma',
          'Localizar para mercados-alvo'
        ]
      }
    ];
  } else {
    plan.experiments = [
      {
        week: 1,
        focus: 'Optimization avançada',
        tasks: [
          'Refinar com feedback de reviews',
          'Testar variações de categoria'
        ]
      },
      {
        week: 2,
        focus: 'Growth hacking',
        tasks: [
          'Implementar store listing experiments',
          'Monitorar métricas de impressão'
        ]
      }
    ];
  }

  return plan;
}

/**
 * Função principal da skill
 */
async function runAudit(url, options = {}) {
  const {
    language = 'pt-BR',
    country = 'BR',
    includeCompetitors = true,
    includeKeywords = true
  } = options;

  console.log('\n📊 AUDITORIA DE ASO - GOOGLE PLAY\n');
  console.log(`URL: ${url}`);
  console.log(`Idioma: ${language}\n`);

  // Passo 1: Adquirir dados
  console.log('📱 Passo 1: Adquirindo dados do app...\n');

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

  // Passo 2: Análise de metadata
  console.log('✅ Passo 2: Analisando metadata...\n');

  const metadataScore = scoreMetadata(appData);

  // Passo 3: Análise de reputação
  console.log('⭐ Passo 3: Analisando reputação...\n');

  const reputation = {
    rating: appData.rating || 'N/A',
    reviewCount: appData.reviewCount || 'N/A',
    status: appData.rating ? (parseFloat(appData.rating) >= 4.0 ? 'Excelente' : 'Bom') : 'Não avaliada'
  };

  // Passo 4: Plano de crescimento
  console.log('🚀 Passo 4: Gerando plano de crescimento...\n');

  const growthPlan = generateGrowthPlan(metadataScore);

  // Resultado final
  return {
    status: 'success',
    type: 'audit',
    appData,
    score: metadataScore,
    reputation,
    growthPlan,
    supportedLanguages: getSupportedLanguages().length,
    nextSteps: [
      'Revisar score e recomendações',
      'Executar experimentos do plano de crescimento',
      'Usar skill optimize para melhorar textos',
      'Monitorar impacto com Play Console'
    ],
    recommendations: [
      'Priorizar metadata',
      'Testar variações',
      'Monitorar reviews',
      'Executar plano de 30 dias'
    ]
  };
}

module.exports = {
  runAudit,
  scoreMetadata,
  generateGrowthPlan
};
