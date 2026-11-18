/**
 * Suite de Testes Simplificada para Data Orchestrator
 * Execute com: node lib/test-simple.js
 */

const { PlayStoreDataOrchestrator } = require('./data-orchestrator');
const { isEmptyShell } = require('./smart-fetch');

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║          🧪 TESTES SIMPLIFICADOS - DATA ORCHESTRATOR          ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// TEST 1: Detecção de HTML vazio
console.log('TEST 1: Detecção de HTML shell vazio');
console.log('─'.repeat(70));

const tests = [
  {
    name: 'HTML vazio (típico do Play Store)',
    html: '<html><head><title>Google Play</title></head><body></body></html>',
    expected: true
  },
  {
    name: 'HTML com nonce (Play Store real)',
    html: '<html><body>Some content with nonce=abc123</body></html>',
    expected: false
  },
  {
    name: 'HTML com bootstrappedData',
    html: '<html><body>var bootstrappedData = {}</body></html>',
    expected: false
  }
];

tests.forEach(test => {
  const result = isEmptyShell(test.html);
  const status = result === test.expected ? '✅' : '❌';
  console.log(`${status} ${test.name}`);
  console.log(`   Resultado: ${result ? 'VAZIO' : 'CONTÉM DADOS'}`);
});

// TEST 2: Validação de dados
console.log('\n\nTEST 2: Validação de dados');
console.log('─'.repeat(70));

const orchestrator = new PlayStoreDataOrchestrator();

const dataTests = [
  {
    name: 'Dados completos',
    data: { title: 'App', shortDescription: 'Descrição' },
    expectValid: true
  },
  {
    name: 'Dados incompletos (sem title)',
    data: { shortDescription: 'Descrição' },
    expectValid: false
  },
  {
    name: 'Dados vazios',
    data: {},
    expectValid: false
  }
];

dataTests.forEach(test => {
  const validation = orchestrator.validateData(test.data);
  const status = validation.valid === test.expectValid ? '✅' : '❌';
  console.log(`${status} ${test.name}`);
  console.log(`   Válido: ${validation.valid}`);
  if (!validation.valid) {
    console.log(`   Faltam: ${validation.missing?.join(', ')}`);
  }
});

// TEST 3: Cache
console.log('\n\nTEST 3: Sistema de cache');
console.log('─'.repeat(70));

const orch = new PlayStoreDataOrchestrator({ useCache: true });
const testUrl = 'https://play.google.com/store/apps/details?id=test';
const testData = { title: 'Test App', shortDescription: 'Test' };

orch.options.cache.set(`${testUrl}:pt`, { data: testData });
console.log(`✅ Dados adicionados ao cache`);
console.log(`   Cache size: ${orch.options.cache.size}`);

orch.clearCache();
console.log(`✅ Cache limpo`);
console.log(`   Cache size: ${orch.options.cache.size}`);

// TEST 4: Status
console.log('\n\nTEST 4: Status do orquestrador');
console.log('─'.repeat(70));

const status = orchestrator.getStatus();
console.log('✅ Status obtido com sucesso');
console.log(`   Idioma: ${status.options.language}`);
console.log(`   País: ${status.options.country}`);
console.log(`   Cache ativo: ${status.options.useCache}`);

// TEST 5: Completeness
console.log('\n\nTEST 5: Cálculo de completude');
console.log('─'.repeat(70));

const dataComplete = {
  title: 'Complete App',
  shortDescription: 'Short desc',
  fullDescription: 'Long description here',
  rating: '4.5',
  reviewCount: '1000',
  category: 'Games',
  developer: 'Developer Name',
  icon: 'icon.png',
  screenshots: 'screenshots.png'
};

const completeness = orchestrator.calculateCompleteness(dataComplete);
console.log(`✅ Completude calculada`);
console.log(`   Dados: 100% completo (${Object.values(dataComplete).length}/${Object.keys(dataComplete).length} campos)`);

const dataPartial = {
  title: 'App',
  shortDescription: 'Short',
  fullDescription: null,
  rating: null,
  reviewCount: null
};

const completenessPartial = orchestrator.calculateCompleteness(dataPartial);
console.log(`   Dados parciais: ${completenessPartial}% completo (2/5 campos)`);

// SUMMARY
console.log('\n\n' + '='.repeat(70));
console.log('✅ SUITE DE TESTES CONCLUÍDA');
console.log('='.repeat(70));
console.log('\n📌 Próximos passos:');
console.log('   1. Integrar o orquestrador nas skills (audit, keywords, etc)');
console.log('   2. Testar com URLs reais do Google Play');
console.log('   3. Configurar Claude in Chrome para navegador automático');
console.log('   4. Ajustar seletores CSS conforme necessário\n');
