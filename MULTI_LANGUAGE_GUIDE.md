# 🌍 Guia de Geração Multi-Idioma

**Status**: ✅ Implementado  
**Data**: 18 de novembro de 2026

## O que é?

Sistema completo para gerar títulos, descrições curtas e longas em **77+ idiomas** suportados pela Google Play Console, com formato pronto para importação.

## Idiomas Suportados

A Google Play Console suporta estes idiomas:

| Código | Idioma | Código | Idioma |
|--------|--------|--------|--------|
| pt-BR | Português (Brasil) | es-ES | Espanhol |
| en-US | Inglês (EUA) | fr-FR | Francês |
| ja-JP | Japonês | zh-CN | Chinês (Simplificado) |
| ko-KR | Coreano | it-IT | Italiano |
| de-DE | Alemão | ru-RU | Russo |
| ... | (73 mais) | | |

[Lista completa em](lib/multi-language-generator.js)

## Como Usar

### 1️⃣ Uso Mínimo - Gerar em um idioma

```javascript
const { optimizePlayStoreListing } = require('./skills/optimize');

const result = await optimizePlayStoreListing(
  'https://play.google.com/store/apps/details?id=com.example.app'
);

// Resultado:
{
  status: 'success',
  appData: { title, shortDescription, fullDescription },
  currentMetadata: { ... },
  proposals: { title: [...], shortDescription: [...], fullDescription: {...} }
}
```

### 2️⃣ Gerar em Múltiplos Idiomas

```javascript
const { optimizePlayStoreListing } = require('./skills/optimize');

const result = await optimizePlayStoreListing(
  'https://play.google.com/store/apps/details?id=com.example.app',
  {
    language: 'pt-BR',
    exportFormat: true,  // ← Habilita exportação
    targetLanguages: [
      'pt-BR',  // Português (Brasil)
      'en-US',  // Inglês (EUA)
      'es-ES',  // Espanhol
      'fr-FR'   // Francês
    ],
    outputPath: './play-console-import.txt'
  }
);

// Resultado: Arquivo pronto para importar no Play Console
```

### 3️⃣ Via CLI do Plugin

```bash
# Auditoria simples
claude playgrowth:audit "https://play.google.com/..."

# Otimizar para 1 idioma
claude playgrowth:optimize "https://play.google.com/..."

# Otimizar para múltiplos idiomas
claude playgrowth:optimize "https://play.google.com/..." --export-format --languages pt-BR,en-US,es-ES
```

## Formato de Saída

O arquivo gerado tem este formato (compatível com Play Console):

```
APP LISTING TRANSLATIONS
Source language: pt-BR

[pt-BR]
App name: Meu Aplicativo
Short description: Descrição curta em português
Full description:
Descrição completa em português com até 4000 caracteres.
Pode ocupar múltiplas linhas.

[en-US]
App name: My App
Short description: English short description
Full description:
Full English description here.

[es-ES]
App name: Mi Aplicación
Short description: Descripción en español
Full description:
Descripción completa en español.
```

## Passo a Passo: Importar no Google Play Console

### 1. Preparar
✅ Gerar arquivo com múltiplas traduções  
✅ Revisar cada idioma  
✅ Ajustar traduções conforme necessário

### 2. Importar
```
Google Play Console
  → Sua App
    → Listing
      → 3 pontos (menu)
        → Importar/Exportar Listing
          → Selecionar arquivo .txt
            → Revisar mudanças
              → Publicar
```

### 3. Validação
- ✅ Títulos dentro de 30 chars
- ✅ Descrições curtas dentro de 80 chars
- ✅ Descrições completas dentro de 4000 chars
- ✅ Sem caracteres especiais perigosos
- ✅ Sem promessas falsas ou violações de policy

## Exemplos

### Exemplo 1: App de Coloring

```javascript
// Entrada
url: 'https://play.google.com/store/apps/details?id=com.colorsgoods.app'
languages: ['pt-BR', 'en-US', 'es-ES']

// Saída: Arquivo com 3 versões do listing
// - Português: "Livro de Colorir para Adultos"
// - English: "Adult Coloring Book"
// - Español: "Libro para Colorear para Adultos"
```

### Exemplo 2: App de Meditação

```javascript
// Entrada
url: 'https://play.google.com/store/apps/details?id=com.meditation.app'
languages: ['pt-BR', 'en-US', 'es-ES', 'fr-FR', 'ja-JP']

// Saída: Arquivo com 5 versões localizadas
```

## Workflow Recomendado

```
1. Auditoria inicial
   claude playgrowth:audit <URL>
   ↓
2. Análise de keywords
   claude playgrowth:keywords <URL>
   ↓
3. Análise de competidores
   claude playgrowth:competitors <URL>
   ↓
4. Otimizar listing
   claude playgrowth:optimize <URL>
   ↓
5. Gerar para múltiplos idiomas
   claude playgrowth:optimize <URL> --export-format --languages pt-BR,en-US,es-ES,fr-FR
   ↓
6. Revisar arquivo
   cat play-console-import.txt
   ↓
7. Importar no Play Console
   (Seguir passos acima)
   ↓
8. Monitorar impacto
   (Voltar ao passo 1 em 30 dias)
```

## Arquivos do Sistema

| Arquivo | Responsabilidade |
|---------|------------------|
| `lib/multi-language-generator.js` | Geração de copy multi-idioma |
| `lib/data-orchestrator.js` | Obtenção inteligente de dados |
| `skills/optimize/index.js` | Skill de otimização |
| `skills/audit/index.js` | Skill de auditoria |
| `skills/keywords/index.js` | Skill de keywords |
| `skills/competitors/index.js` | Skill de competidores |

## Validação Automática

O sistema valida automaticamente:

✅ **Títulos** (máx 30 caracteres)  
✅ **Descrições curtas** (máx 80 caracteres)  
✅ **Descrições completas** (máx 4000 caracteres)  
✅ **Policies do Play** (sem promo, rank claims, etc)  
✅ **Caracteres especiais** (emojis, pontuação)  

## Troubleshooting

### "Arquivo não gerou"
**Causa**: Conteúdo dinâmico  
**Solução**: Usar navegador automaticamente (Claude in Chrome)

### "Descrição excede limite"
**Causa**: Texto muito longo  
**Solução**: Sistema trunca automaticamente, revise antes de publicar

### "Tradução não fica boa"
**Causa**: IA pode não entender contexto  
**Solução**: Revisar e editar manualmente antes de publicar

## Próximos Passos

- [ ] Testar com 10 apps reais
- [ ] Medir impacto nas métricas
- [ ] Refinar propostas de copy
- [ ] Adicionar suporte a A/B testing
- [ ] Integrar feedback de reviews

## Resources

- [Google Play Console - Supported Languages](https://support.google.com/googleplay/android-developer/answer/9844778)
- [App Listing Guidelines](https://play.google.com/console/about/text-policies/)
- [ASO Best Practices](https://support.google.com/googleplay/android-developer/answer/112470)

---

**Sistema pronto para produção** ✅  
**Próximo**: Integrar com CI/CD e monitoramento
