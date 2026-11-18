/**
 * Skill: playgrowth:optimize
 *
 * Otimiza o listing de um app no Google Play:
 * - Título (30 chars)
 * - Descrição curta (80 chars)
 * - Descrição completa (4000 chars)
 *
 * Com opção de gerar em múltiplos idiomas
 */

const { PlayStoreDataOrchestrator } = require('../../lib/data-orchestrator');
const { generateMultiLanguageCopy, formatPlayConsoleImport, savePlayConsoleFormat, getSupportedLanguages } = require('../../lib/multi-language-generator');
const path = require('path');

/**
 * Valida limites de caracteres
 */
function validateCharacterLimits(text, fieldName, maxChars) {
  const count = text.length;
  const isValid = count <= maxChars;
  return {
    field: fieldName,
    count,
    maxChars,
    isValid,
    message: isValid ? `✅ ${count}/${maxChars}` : `❌ ${count}/${maxChars} (excede por ${count - maxChars})`
  };
}

/**
 * Gera propostas de texto otimizado
 */
function generateProposals(appData, keywords = []) {
  const proposals = {
    title: [],
    shortDescription: [],
    fullDescription: null
  };

  // Propostas de título (máx 30 chars)
  const appName = appData.title || '';
  const category = appData.category || '';

  proposals.title = [
    {
      text: appName,
      count: appName.length,
      rationale: 'Nome original do app'
    },
    {
      text: `${appName} - ${keywords[0] || category}`.substring(0, 30),
      count: `${appName} - ${keywords[0] || category}`.substring(0, 30).length,
      rationale: 'Com palavra-chave prioritária'
    },
    {
      text: `${appName}: ${appData.shortDescription || ''}`.substring(0, 30),
      count: `${appName}: ${appData.shortDescription || ''}`.substring(0, 30).length,
      rationale: 'Com proposição de valor'
    }
  ];

  // Propostas de descrição curta (máx 80 chars)
  proposals.shortDescription = [
    {
      text: appData.shortDescription || '',
      count: (appData.shortDescription || '').length,
      rationale: 'Descrição original'
    },
    {
      text: `${appData.shortDescription || ''} ${keywords[0] || ''}`.substring(0, 80),
      count: `${appData.shortDescription || ''} ${keywords[0] || ''}`.substring(0, 80).length,
      rationale: 'Com palavra-chave'
    }
  ];

  // Descrição completa (máx 4000 chars)
  proposals.fullDescription = {
    text: appData.fullDescription || '',
    count: (appData.fullDescription || '').length,
    suggestions: [
      'Confirmar funcionalidades principais',
      'Verificar tom de voz',
      'Adicionar case de uso',
      'Destacar diferencial competitivo'
    ]
  };

  return proposals;
}

/**
 * Função principal da skill
 */
async function optimizePlayStoreListing(url, options = {}) {
  const {
    language = 'pt-BR',
    country = 'BR',
    exportFormat = false, // true para gerar arquivo de importação
    targetLanguages = [language],
    outputPath = null
  } = options;

  console.log('\n🚀 OTIMIZADOR DE LISTING - GOOGLE PLAY\n');
  console.log(`URL: ${url}`);
  console.log(`Idioma: ${language}`);
  console.log(`Exportar para: ${exportFormat ? 'Play Console' : 'Propostas'}\n`);

  // Passo 1: Adquirir dados do app
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

  // Passo 2: Validar dados atuais
  console.log('✅ Passo 2: Validando dados atuais...\n');

  const validations = [
    validateCharacterLimits(appData.title || '', 'App name', 30),
    validateCharacterLimits(appData.shortDescription || '', 'Short description', 80),
    validateCharacterLimits(appData.fullDescription || '', 'Full description', 4000)
  ];

  validations.forEach(v => console.log(`${v.message} - ${v.field}`));
  console.log();

  // Passo 3: Gerar propostas
  console.log('💡 Passo 3: Gerando propostas...\n');

  const proposals = generateProposals(appData, []);

  // Se opção de exportação está ativa
  if (exportFormat) {
    console.log('📦 Passo 4: Gerando arquivo de importação...\n');

    const multiLangData = await generateMultiLanguageCopy(appData, {
      sourceLanguage: language,
      targetLanguages: targetLanguages
    });

    // Salvar arquivo
    const fileName = `play-console-translations-${new Date().toISOString().split('T')[0]}.txt`;
    const filePath = outputPath || path.join(process.cwd(), fileName);

    const saveResult = savePlayConsoleFormat(multiLangData, filePath);

    return {
      status: 'success',
      type: 'export',
      appData,
      multiLanguageData: multiLangData,
      file: saveResult,
      message: `✅ Arquivo de importação criado: ${filePath}`
    };
  }

  // Retorno normal com propostas
  return {
    status: 'success',
    type: 'proposals',
    appData,
    currentMetadata: {
      title: { text: appData.title, validation: validations[0] },
      shortDescription: { text: appData.shortDescription, validation: validations[1] },
      fullDescription: { text: appData.fullDescription, validation: validations[2] }
    },
    proposals,
    supportedLanguages: getSupportedLanguages().length,
    nextSteps: [
      'Revisar propostas',
      'Aprovar textos antes de publicar',
      'Usar --exportFormat para gerar arquivo de importação',
      'Testar com múltiplos idiomas'
    ]
  };
}

module.exports = {
  optimizePlayStoreListing,
  validateCharacterLimits,
  generateProposals,
  getSupportedLanguages
};
