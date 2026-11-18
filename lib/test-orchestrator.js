/**
 * Test Suite para Data Orchestrator
 *
 * Execute com: node lib/test-orchestrator.js
 */

const { PlayStoreDataOrchestrator, handleAcquisitionResult } = require('./data-orchestrator');

// ============================================================================
// TESTES BÁSICOS
// ============================================================================

async function testBasicFlow() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 1: Fluxo básico de aquisição');
  console.log('='.repeat(70));

  const orchestrator = new PlayStoreDataOrchestrator({
    language: 'pt-BR',
    country: 'BR'
  });

  try {
    const result = await orchestrator.acquireData(
      'https://play.google.com/store/apps/details?id=com.colorsgoods.bionlabs.app'
    );

    console.log('\n✅ Teste completado');
    console.log(`Resultado: ${JSON.stringify(result, null, 2)}`);

    return result;
  } catch (error) {
    console.log('\n❌ Erro:', error.message);
    return null;
  }
}

async function testEmptyShellDetection() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 2: Detecção de HTML shell vazio');
  console.log('='.repeat(70));

  const { isEmptyShell } = require('./smart-fetch');

  const testCases = [
    {
      name: 'HTML vazio (típico do Play Store)',
      html: '<html><head><title>Google Play</title></head><body></body></html>',
      expectedEmpty: true
    },
    {
      name: 'HTML com conteúdo real',
      html: '<html><head><title>App</title></head><body><div itemprop="name">My App</div><div itemprop="description">Great app</div></body></html>',
      expectedEmpty: false
    },
    {
      name: 'HTML com nonce (Play Store real)',
      html: '<html><body>Some content with nonce=abc123 here</body></html>',
      expectedEmpty: false
    }
  ];

  console.log('\nTestando detecção de shell vazio:\n');

  for (const test of testCases) {
    const isShell = isEmptyShell(test.html);
    const passed = isShell === test.expectedEmpty;

    console.log(`${passed ? '✅' : '❌'} ${test.name}`);
    console.log(`   Resultado: ${isShell ? 'VAZIO' : 'CONTÉM DADOS'}`);
    console.log(`   Esperado: ${test.expectedEmpty ? 'VAZIO' : 'CONTÉM DADOS'}\n`);
  }
}

async function testCache() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 3: Sistema de cache');
  console.log('='.repeat(70));

  const orchestrator = new PlayStoreDataOrchestrator({
    language: 'pt-BR',
    country: 'BR',
    useCache: true
  });

  console.log('\nTestando cache:\n');

  const url = 'https://play.google.com/store/apps/details?id=com.example.test';

  // Simula dados em cache
  orchestrator.options.cache.set(
    `${url}:pt`,
    {
      success: true,
      title: 'App Teste',
      shortDescription: 'Descrição teste',
      timestamp: new Date().toISOString()
    }
  );

  console.log('1️⃣  Adicionado ao cache');
  console.log(`   Cache size: ${orchestrator.options.cache.size}`);

  console.log('\n2️⃣  Tentando recuperar do cache...');
  const result = await orchestrator.acquireData(url);

  if (result.source === 'cache') {
    console.log('✅ Recuperado com sucesso do cache');
    console.log(`   Dados: ${JSON.stringify(result.data)}`);
  } else {
    console.log('⚠️  Não foi recuperado do cache (esperado se sistema live)');
  }

  console.log('\n3️⃣  Limpando cache...');
  orchestrator.clearCache();
  console.log(`✅ Cache limpo. Nova size: ${orchestrator.options.cache.size}`);
}

async function testValidation() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 4: Validação de dados');
  console.log('='.repeat(70));

  const orchestrator = new PlayStoreDataOrchestrator();

  const testCases = [
    {
      name: 'Dados válidos',
      data: {
        title: 'App Válido',
        shortDescription: 'Uma descrição válida e bem completa',
        fullDescription: 'Descrição completa do app',
        rating: '4.5',
        reviewCount: '1000'
      },
      shouldBeValid: true
    },
    {
      name: 'Dados incompletos (falta title)',
      data: {
        shortDescription: 'Uma descrição',
        fullDescription: 'Descrição completa'
      },
      shouldBeValid: false
    },
    {
      name: 'Dados vazios',
      data: {
        title: null,
        shortDescription: null
      },
      shouldBeValid: false
    }
  ];

  console.log('\nTestando validação:\n');

  for (const test of testCases) {
    const validation = orchestrator.validateData(test.data);
    const passed = validation.valid === test.shouldBeValid;

    console.log(`${passed ? '✅' : '❌'} ${test.name}`);
    console.log(`   Válido: ${validation.valid}`);

    if (!validation.valid) {
      console.log(`   Faltam: ${validation.missing?.join(', ') || 'nenhum campo específico'}`);
    } else {
      console.log(`   Completude: ${validation.completeness}%`);
    }
    console.log('');
  }
}

async function testBrowserInstructions() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 5: Instruções de navegador');
  console.log('='.repeat(70));

  const { acquireWithBrowser } = require('./browser-reader');

  const url = 'https://play.google.com/store/apps/details?id=com.example.app';
  const strategy = acquireWithBrowser(url, {
    language: 'pt-BR',
    country: 'BR'
  });

  console.log('\n✅ Estratégia de navegador gerada:\n');
  console.log(`URL: ${strategy.url}`);
  console.log(`Ferramentas recomendadas: ${strategy.recommendedTools.length}`);

  console.log('\nSeletores CSS mapeados:');
  for (const [field, selectors] of Object.entries(strategy.selectors || {})) {
    console.log(`  - ${field}: ${selectors.primary}`);
  }

  console.log('\n📝 Instruções geradas:');
  console.log(strategy.instructions.substring(0, 200) + '...\n');
}

async function testResultHandling() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 6: Processamento de resultados');
  console.log('='.repeat(70));

  const testResults = [
    {
      name: 'Resultado bem-sucedido (fetch)',
      result: {
        source: 'fetch',
        success: true,
        data: { title: 'App', shortDescription: 'Desc' },
        confidence: 'alto'
      }
    },
    {
      name: 'Resultado dinâmico (navegador necessário)',
      result: {
        source: 'browser_required',
        success: false,
        isDynamic: true,
        reason: 'Conteúdo renderizado dinamicamente',
        instruction: 'Use navegador'
      }
    },
    {
      name: 'Resultado do cache',
      result: {
        source: 'cache',
        success: true,
        data: { title: 'App em Cache' }
      }
    },
    {
      name: 'Resultado com falha',
      result: {
        source: 'failed',
        success: false,
        reason: 'Conexão timeout'
      }
    }
  ];

  console.log('\nTestando processamento de resultados:\n');

  for (const test of testResults) {
    console.log(`📌 ${test.name}`);

    try {
      const handler = handleAcquisitionResult(test.result);
      console.log(`   ✅ Ação: ${handler.action}`);
    } catch (error) {
      console.log(`   ⚠️  Aviso: ${error.message}`);
    }
    console.log('');
  }
}

async function testStatusReport() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 7: Relatório de status');
  console.log('='.repeat(70));

  const orchestrator = new PlayStoreDataOrchestrator({
    language: 'pt-BR',
    country: 'BR',
    useCache: true,
    timeout: 10000,
    retries: 2
  });

  const status = orchestrator.getStatus();

  console.log('\n✅ Status do orquestrador:\n');
  console.log(JSON.stringify(status, null, 2));
}

async function testErrorHandling() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 8: Tratamento de erros');
  console.log('='.repeat(70));

  const orchestrator = new PlayStoreDataOrchestrator({
    timeout: 100  // Timeout muito curto para forçar erro
  });

  console.log('\nTestando com URL inválida e timeout curto:\n');

  try {
    const result = await orchestrator.acquireData('https://play.google.com/invalid');
    console.log('Resultado:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Erro capturado (esperado):', error.message);
  }
}

// ============================================================================
// EXECUTAR TESTES
// ============================================================================

async function runAllTests() {
  console.log('\n' + '╔' + '='.repeat(68) + '╗');
  console.log('║' + ' '.repeat(15) + '🧪 SUITE DE TESTES - DATA ORCHESTRATOR' + ' '.repeat(16) + '║');
  console.log('╚' + '='.repeat(68) + '╝');

  const startTime = Date.now();

  try {
    // Testes que não precisam de rede
    await testEmptyShellDetection();
    await testCache();
    await testValidation();
    await testBrowserInstructions();
    await testResultHandling();
    await testStatusReport();
    await testErrorHandling();

    // Testes que precisam de rede (opcional)
    console.log('\n' + '='.repeat(70));
    console.log('TEST 0: Fluxo básico (requer conexão)');
    console.log('='.repeat(70));
    console.log('⏭️  Pulando teste com rede (execute manualmente se necessário)\n');
    // await testBasicFlow();

  } catch (error) {
    console.error('\n❌ Erro durante execução dos testes:', error);
  }

  const duration = Date.now() - startTime;

  console.log('\n' + '='.repeat(70));
  console.log('✅ SUITE DE TESTES CONCLUÍDA');
  console.log('='.repeat(70));
  console.log(`⏱️  Duração: ${duration}ms`);
  console.log('='.repeat(70) + '\n');
}

// Executar se chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testBasicFlow,
  testEmptyShellDetection,
  testCache,
  testValidation,
  testBrowserInstructions,
  testResultHandling,
  testStatusReport,
  testErrorHandling,
  runAllTests
};
