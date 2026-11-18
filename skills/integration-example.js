/**
 * Exemplos de Integração - Skills com Multi-Language Support
 *
 * Demonstra como usar as 4 skills com suporte a múltiplos idiomas
 * e exportação em formato Play Console
 */

const { runAudit } = require('./audit/index');
const { analyzeCompetitors } = require('./competitors/index');
const { findKeywords } = require('./keywords/index');
const { optimizePlayStoreListing } = require('./optimize/index');

// ============================================================================
// EXEMPLO 1: Auditoria simples
// ============================================================================
async function example1_simpleAudit() {
  console.log('\n📊 EXEMPLO 1: Auditoria Simples\n');

  const url = 'https://play.google.com/store/apps/details?id=com.example.app';

  const result = await runAudit(url, {
    language: 'pt-BR',
    country: 'BR'
  });

  console.log(JSON.stringify(result, null, 2));
}

// ============================================================================
// EXEMPLO 2: Análise completa com múltiplos idiomas
// ============================================================================
async function example2_fullAnalysisMultiLanguage() {
  console.log('\n🌍 EXEMPLO 2: Análise Completa com Múltiplos Idiomas\n');

  const url = 'https://play.google.com/store/apps/details?id=com.example.app';

  // Passo 1: Auditoria em português
  console.log('▶️  Executando auditoria em pt-BR...\n');
  const audit = await runAudit(url, {
    language: 'pt-BR',
    country: 'BR'
  });

  if (audit.status !== 'success') {
    console.error('Erro na auditoria:', audit);
    return;
  }

  // Passo 2: Análise de keywords
  console.log('▶️  Analisando keywords...\n');
  const keywords = await findKeywords(url, {
    language: 'pt-BR',
    country: 'BR'
  });

  // Passo 3: Análise de competidores
  console.log('▶️  Analisando competidores...\n');
  const competitors = await analyzeCompetitors(url, {
    language: 'pt-BR',
    country: 'BR'
  });

  // Passo 4: Gerar propostas otimizadas
  console.log('▶️  Gerando propostas de otimização...\n');
  const optimization = await optimizePlayStoreListing(url, {
    language: 'pt-BR',
    country: 'BR'
  });

  // Passo 5: Gerar arquivo de importação multi-idioma
  console.log('▶️  Gerando arquivo para múltiplos idiomas...\n');
  const multiLang = await optimizePlayStoreListing(url, {
    language: 'pt-BR',
    country: 'BR',
    exportFormat: true,
    targetLanguages: ['pt-BR', 'en-US', 'es-ES', 'fr-FR'],
    outputPath: './play-console-import.txt'
  });

  return {
    audit,
    keywords,
    competitors,
    optimization,
    multiLanguageExport: multiLang
  };
}

// ============================================================================
// EXEMPLO 3: Workflow de otimização com validação
// ============================================================================
async function example3_optimizationWorkflow() {
  console.log('\n✨ EXEMPLO 3: Workflow de Otimização com Validação\n');

  const url = 'https://play.google.com/store/apps/details?id=com.example.app';

  try {
    // Obter dados atuais
    const audit = await runAudit(url, {
      language: 'pt-BR',
      country: 'BR'
    });

    if (audit.status === 'browser_required') {
      console.log('⚠️  Conteúdo dinâmico detectado');
      console.log('Instruções:', audit.instruction);
      return;
    }

    if (audit.status !== 'success') {
      throw new Error(audit.reason);
    }

    // Score atual
    console.log(`\n📊 Score Atual: ${audit.score.current}/100`);
    console.log('Breakdown:', audit.score.breakdown);

    // Plano de crescimento
    console.log('\n🚀 Plano de 30 Dias:');
    audit.growthPlan.experiments.forEach(exp => {
      console.log(`\nSemana ${exp.week}: ${exp.focus}`);
      exp.tasks.forEach(task => console.log(`  • ${task}`));
    });

    // Gerar propostas otimizadas
    const optimization = await optimizePlayStoreListing(url, {
      language: 'pt-BR',
      country: 'BR'
    });

    if (optimization.status === 'success') {
      console.log('\n✅ Propostas de otimização geradas');
      console.log('Validações:');
      Object.entries(optimization.currentMetadata).forEach(([field, data]) => {
        console.log(`  • ${field}: ${data.validation.message}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro no workflow:', error.message);
  }
}

// ============================================================================
// EXEMPLO 4: Exportação para múltiplos idiomas
// ============================================================================
async function example4_multiLanguageExport() {
  console.log('\n📦 EXEMPLO 4: Exportação para Múltiplos Idiomas\n');

  const url = 'https://play.google.com/store/apps/details?id=com.example.app';

  const languages = [
    'pt-BR', // Portuguese (Brazil)
    'en-US', // English (US)
    'es-ES', // Spanish (Spain)
    'fr-FR', // French
    'de-DE', // German
    'it-IT', // Italian
    'ja-JP'  // Japanese
  ];

  console.log(`Gerando arquivo de importação para ${languages.length} idiomas...\n`);

  const result = await optimizePlayStoreListing(url, {
    language: 'pt-BR',
    country: 'BR',
    exportFormat: true,
    targetLanguages: languages,
    outputPath: './play-console-translations.txt'
  });

  if (result.status === 'success') {
    console.log('✅ Arquivo criado:', result.file.filePath);
    console.log('\nPróximos passos:');
    console.log('1. Revisar tradução automática');
    console.log('2. Ajustar traduções conforme necessário');
    console.log('3. Importar em Google Play Console:');
    console.log('   - Acesse: Google Play Console > Sua App > Listing');
    console.log('   - Clique em "Importar/Exportar Listing"');
    console.log('   - Selecione o arquivo gerado');
    console.log('   - Revise e publique');
  }
}

// ============================================================================
// EXEMPLO 5: Monitoramento contínuo
// ============================================================================
async function example5_continuousMonitoring() {
  console.log('\n📈 EXEMPLO 5: Monitoramento Contínuo\n');

  const url = 'https://play.google.com/store/apps/details?id=com.example.app';
  const languages = ['pt-BR', 'en-US'];

  console.log('Monitorando 2 idiomas...\n');

  for (const language of languages) {
    console.log(`📍 Verificando ${language}...\n`);

    const audit = await runAudit(url, {
      language,
      country: language.split('-')[1] || 'BR'
    });

    if (audit.status === 'success') {
      console.log(`  Score: ${audit.score.current}/100`);
      console.log(`  Rating: ${audit.reputation.rating}`);
      console.log(`  Reviews: ${audit.reputation.reviewCount}`);
    }
  }
}

// ============================================================================
// EXEMPLO 6: Comparação antes/depois
// ============================================================================
async function example6_beforeAfterComparison() {
  console.log('\n🔄 EXEMPLO 6: Comparação Antes/Depois\n');

  const url = 'https://play.google.com/store/apps/details?id=com.example.app';

  // ANTES: Score atual
  console.log('📊 ANTES - Análise atual:\n');
  const auditBefore = await runAudit(url, {
    language: 'pt-BR'
  });

  if (auditBefore.status === 'success') {
    console.log(`Score: ${auditBefore.score.current}/100`);
    console.log(`Rating: ${auditBefore.reputation.rating}`);

    // Simular aplicação de melhorias
    console.log('\n✅ Depois de aplicar as 4 semanas do plano:\n');
    console.log(`Score esperado: ~${Math.min(100, auditBefore.score.current + 25)}/100`);
    console.log('Próximos passos:');
    auditBefore.growthPlan.experiments.forEach(exp => {
      console.log(`  • Semana ${exp.week}: ${exp.focus}`);
    });
  }
}

// ============================================================================
// EXECUTOR DE EXEMPLOS
// ============================================================================
async function runExamples(exampleNumber = null) {
  const examples = {
    1: example1_simpleAudit,
    2: example2_fullAnalysisMultiLanguage,
    3: example3_optimizationWorkflow,
    4: example4_multiLanguageExport,
    5: example5_continuousMonitoring,
    6: example6_beforeAfterComparison
  };

  if (exampleNumber && examples[exampleNumber]) {
    await examples[exampleNumber]();
  } else {
    console.log('📚 Exemplos de Integração - Escolha um:\n');
    console.log('1. Auditoria simples');
    console.log('2. Análise completa com múltiplos idiomas');
    console.log('3. Workflow de otimização com validação');
    console.log('4. Exportação para múltiplos idiomas');
    console.log('5. Monitoramento contínuo');
    console.log('6. Comparação antes/depois\n');
    console.log('Use: node skills/integration-example.js <número>\n');
  }
}

// Se executado diretamente
if (require.main === module) {
  const exampleNum = parseInt(process.argv[2]) || null;
  runExamples(exampleNum);
}

module.exports = {
  example1_simpleAudit,
  example2_fullAnalysisMultiLanguage,
  example3_optimizationWorkflow,
  example4_multiLanguageExport,
  example5_continuousMonitoring,
  example6_beforeAfterComparison,
  runExamples
};
