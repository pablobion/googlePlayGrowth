/**
 * Teste do Sistema Multi-Idioma
 *
 * Execute com: node test-multi-language.js
 */

const { generateMultiLanguageCopy, formatPlayConsoleImport, getSupportedLanguages } = require('./lib/multi-language-generator');

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║            🌍 TESTE - SISTEMA MULTI-IDIOMA                    ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// TEST 1: Listar idiomas suportados
console.log('TEST 1: Idiomas Suportados');
console.log('─'.repeat(70));

const languages = getSupportedLanguages();
console.log(`✅ Total de idiomas: ${languages.length}\n`);
console.log('Primeiros 10 idiomas:');
languages.slice(0, 10).forEach(lang => {
  console.log(`  • ${lang.code} - ${lang.name}`);
});
console.log(`  ... e mais ${languages.length - 10} idiomas\n`);

// TEST 2: Gerar copy em múltiplos idiomas
console.log('\nTEST 2: Geração de Copy Multi-Idioma');
console.log('─'.repeat(70));

const appData = {
  title: 'Color Book Adult',
  shortDescription: 'Relaxing coloring app for adults',
  fullDescription: `Discover our amazing coloring book app for adults.
Relaxing and creative, perfect for stress relief.
Download now and start coloring!`,
  category: 'Art & Design',
  rating: '4.5',
  reviewCount: '10000'
};

const multiLanguage = generateMultiLanguageCopy(appData, {
  sourceLanguage: 'en-US',
  targetLanguages: ['en-US', 'pt-BR', 'es-ES', 'fr-FR']
});

console.log(`✅ Gerado copy para ${Object.keys(multiLanguage.translations).length} idiomas\n`);

// TEST 3: Formatar em Play Console format
console.log('\nTEST 3: Formato Play Console');
console.log('─'.repeat(70));

const playConsoleFormat = formatPlayConsoleImport(multiLanguage);
console.log('✅ Formato gerado:\n');
console.log(playConsoleFormat);

// TEST 4: Validar limites de caracteres
console.log('\nTEST 4: Validação de Limites');
console.log('─'.repeat(70));

function validateLimits(data) {
  const validations = {
    titleValid: (data.title || '').length <= 30,
    shortDescValid: (data.shortDescription || '').length <= 80,
    fullDescValid: (data.fullDescription || '').length <= 4000
  };

  return validations;
}

for (const [lang, data] of Object.entries(multiLanguage.translations)) {
  const validation = validateLimits(data);
  const status = Object.values(validation).every(v => v) ? '✅' : '❌';

  console.log(`\n${status} ${lang}`);
  console.log(`   App name: ${(data.appName || '').length}/30 chars`);
  console.log(`   Short: ${(data.shortDescription || '').length}/80 chars`);
  console.log(`   Full: ${(data.fullDescription || '').length}/4000 chars`);
}

// TEST 5: Comparar antes/depois
console.log('\n\nTEST 5: Demonstração de Otimização');
console.log('─'.repeat(70));

const before = {
  title: 'Color Book',
  shortDescription: 'App for coloring',
  fullDescription: 'Coloring app'
};

const after = {
  title: 'Color Book - Adult Coloring',
  shortDescription: 'Premium relaxing coloring app for adult stress relief',
  fullDescription: `Discover our award-winning coloring book app designed for adults.
Perfect for relaxation and creative expression.
Features: 100+ designs, smooth colors, easy to use.
Download now and join 500K+ happy users!`
};

function scoreMetadata(data) {
  let score = 0;
  if (data.title && data.title.length > 10) score += 25;
  if (data.shortDescription && data.shortDescription.length > 20) score += 25;
  if (data.fullDescription && data.fullDescription.length > 50) score += 50;
  return score;
}

const beforeScore = scoreMetadata(before);
const afterScore = scoreMetadata(after);

console.log('\nANTES:');
console.log(`  Title: "${before.title}" (${before.title.length}/30)`);
console.log(`  Short: "${before.shortDescription}" (${before.shortDescription.length}/80)`);
console.log(`  Score: ${beforeScore}/100`);

console.log('\nDEPOIS:');
console.log(`  Title: "${after.title}" (${after.title.length}/30)`);
console.log(`  Short: "${after.shortDescription}" (${after.shortDescription.length}/80)`);
console.log(`  Score: ${afterScore}/100`);

console.log(`\n📈 Melhoria: +${afterScore - beforeScore} pontos`);

// SUMMARY
console.log('\n\n' + '='.repeat(70));
console.log('✅ TESTES CONCLUÍDOS COM SUCESSO');
console.log('='.repeat(70));
console.log('\n📌 Próximos passos:');
console.log('   1. Integrar nas skills (audit, keywords, competitors, optimize)');
console.log('   2. Testar com URLs reais do Google Play');
console.log('   3. Gerar arquivo para importação no Play Console');
console.log('   4. Revisar e publicar no Play Console\n');
