/**
 * Exemplo de Integração - Como usar o Data Orchestrator em uma skill
 *
 * Este arquivo mostra como integrar o sistema inteligente de aquisição
 * em qualquer skill do plugin (audit, keywords, competitors, optimize)
 */

const { PlayStoreDataOrchestrator, handleAcquisitionResult } = require('./data-orchestrator');

/**
 * EXEMPLO 1: Uso simples no skill `audit`
 */
async function auditSkillExample(googlePlayUrl, userOptions = {}) {
  console.log('\n📱 Iniciando auditoria ASO...');

  // Cria orquestrador com opções do usuário
  const orchestrator = new PlayStoreDataOrchestrator({
    language: userOptions.language || 'pt-BR',
    country: userOptions.country || 'BR',
    useCache: true
  });

  try {
    // Adquire dados com estratégia automática
    const result = await orchestrator.acquireData(googlePlayUrl);

    // Processa o resultado
    const handler = handleAcquisitionResult(result);

    switch (handler.action) {
      case 'continue':
        // ✅ Dados obtidos com sucesso
        console.log('\n✅ Dados adquiridos com sucesso!');
        console.log('Continuando com análise...');

        // Aqui começa a análise de fato
        return performAudit(handler.data, googlePlayUrl);

      case 'wait_for_browser':
        // ⚠️  Precisa de navegador
        console.log(result.instruction);
        return {
          status: 'browser_required',
          message: 'Navegador necessário para ler esta página',
          instruction: result.instruction,
          strategy: handler.strategy,
          nextSteps: result.nextSteps
        };

      case 'manual_input_or_browser':
        // ❌ Falhou, oferece alternativas
        return {
          status: 'failed',
          reason: handler.reason,
          fallback: 'Por favor, forneça os dados manualmente ou use navegador'
        };
    }
  } catch (error) {
    console.error('Erro na aquisição de dados:', error);
    throw error;
  }
}

/**
 * EXEMPLO 2: Uso com tratamento customizado
 */
async function keywordsSkillExample(googlePlayUrl) {
  const orchestrator = new PlayStoreDataOrchestrator({
    language: 'pt-BR',
    country: 'BR',
    useCache: true
  });

  const result = await orchestrator.acquireData(googlePlayUrl);

  // Tratamento customizado por tipo de resultado
  if (result.source === 'fetch') {
    console.log('📊 Dados obtidos via HTTP - analisando velocidade...');
    console.log('Timing: Fetch sucedido em <100ms');

    return analyzeKeywords(result.data, 'fast_data');
  }

  if (result.source === 'browser_required') {
    console.log('⚠️  Precisa de navegador para esta análise');

    // Oferece instruções detalhadas
    console.log('\n' + '='.repeat(70));
    console.log('COMO PROCEDER:');
    console.log('='.repeat(70));

    result.nextSteps.forEach(step => {
      console.log(`\n${step.step}. ${step.action}`);
      console.log(`   Comando: ${step.command}`);
      console.log(`   Por quê: ${step.why}`);
    });

    return {
      status: 'browser_required',
      action: 'LoadBrowserTools',
      steps: result.nextSteps
    };
  }

  if (result.source === 'cache') {
    console.log('💾 Usando dados do cache - processamento rápido');
    return analyzeKeywords(result.data, 'cached_data');
  }

  throw new Error(`Falha ao adquirir dados: ${result.reason}`);
}

/**
 * EXEMPLO 3: Fluxo com retry automático em caso de falha temporária
 */
async function competitorsSkillExample(googlePlayUrl, maxRetries = 3) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`\n🔄 Tentativa ${attempt}/${maxRetries}...`);

      const orchestrator = new PlayStoreDataOrchestrator({
        language: 'pt-BR',
        country: 'BR',
        retries: 2,
        timeout: 15000
      });

      const result = await orchestrator.acquireData(googlePlayUrl);

      if (result.success) {
        console.log('✅ Sucesso!');
        return analyzeCompetitors(result.data);
      }

      if (result.isDynamic) {
        // Dinâmico não muda com retry, trata diferente
        return {
          status: 'browser_required',
          message: result.instruction
        };
      }

      lastError = result;

    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Aguardando ${delayMs}ms antes de tentar novamente...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  // Exauridas as tentativas
  throw new Error(`Falha após ${maxRetries} tentativas: ${lastError}`);
}

/**
 * EXEMPLO 4: Integração com validação de dados
 */
async function optimizeSkillExample(googlePlayUrl) {
  const orchestrator = new PlayStoreDataOrchestrator({
    language: 'pt-BR',
    country: 'BR'
  });

  const result = await orchestrator.acquireData(googlePlayUrl);

  if (!result.success) {
    return {
      status: 'error',
      message: 'Não foi possível adquirir os dados',
      nextSteps: result.isDynamic
        ? ['Use navegador (Claude in Chrome)']
        : ['Tente novamente ou forneça dados manualmente']
    };
  }

  // Valida os dados adquiridos
  const validation = orchestrator.validateData(result.data);

  if (!validation.valid) {
    return {
      status: 'incomplete_data',
      missing: validation.missing,
      message: validation.message,
      instruction: 'Forneça os campos faltantes ou use navegador para melhor cobertura'
    };
  }

  console.log(`✅ Dados completos (${validation.completeness}%)`);

  // Processa os dados validados
  return generateOptimization(result.data, result.url);
}

/**
 * EXEMPLO 5: Monitoramento e logging
 */
async function withMonitoring(googlePlayUrl, skillName) {
  const startTime = Date.now();
  const orchestrator = new PlayStoreDataOrchestrator({
    language: 'pt-BR',
    country: 'BR'
  });

  // Log inicial
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🚀 Iniciando ${skillName}`);
  console.log(`📱 URL: ${googlePlayUrl}`);
  console.log(`🕐 Hora: ${new Date().toLocaleString('pt-BR')}`);
  console.log('='.repeat(70));

  try {
    const result = await orchestrator.acquireData(googlePlayUrl);

    const duration = Date.now() - startTime;

    // Log de resultado
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`✅ SUCESSO`);
    console.log(`Fonte: ${result.source}`);
    console.log(`Duração: ${duration}ms`);
    console.log(`Dados obtidos: ${Object.keys(result.data || {}).length} campos`);

    if (result.data) {
      const completeness = orchestrator.calculateCompleteness(result.data);
      console.log(`Completude: ${completeness}%`);
    }

    console.log('─'.repeat(70));

    // Exibe status do cache
    const status = orchestrator.getStatus();
    console.log(`\n💾 Cache: ${status.cacheSize} itens`);

    return result;

  } catch (error) {
    const duration = Date.now() - startTime;

    console.log(`\n${'─'.repeat(70)}`);
    console.log(`❌ ERRO`);
    console.log(`Duração até erro: ${duration}ms`);
    console.log(`Mensagem: ${error.message}`);
    console.log('─'.repeat(70));

    throw error;
  }
}

/**
 * Funções stub para exemplo (substituir pela lógica real)
 */
function performAudit(data, url) {
  console.log('🔍 Realizando auditoria com dados:', Object.keys(data));
  return { status: 'audit_complete', data };
}

function analyzeKeywords(data, source) {
  console.log(`📊 Analisando keywords (fonte: ${source})`);
  return { status: 'analysis_complete', data };
}

function analyzeCompetitors(data) {
  console.log('🏆 Analisando competidores');
  return { status: 'competitor_analysis_complete', data };
}

function generateOptimization(data, url) {
  console.log('✏️  Gerando otimizações');
  return { status: 'optimization_proposed', data };
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Para usar em produção, substitua a chamada assim:
 *
 * Em skills/audit/index.js:
 * ```javascript
 * const result = await auditSkillExample(url, {
 *   language: process.env.LANGUAGE || 'pt-BR',
 *   country: process.env.COUNTRY || 'BR'
 * });
 * ```
 *
 * Em skills/keywords/index.js:
 * ```javascript
 * const result = await keywordsSkillExample(url);
 * ```
 *
 * Com monitoramento:
 * ```javascript
 * const result = await withMonitoring(url, 'audit');
 * ```
 */

module.exports = {
  auditSkillExample,
  keywordsSkillExample,
  competitorsSkillExample,
  optimizeSkillExample,
  withMonitoring
};
