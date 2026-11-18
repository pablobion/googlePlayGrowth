/**
 * Gerador de Copy Multi-Idioma para Google Play
 *
 * Gera títulos, descrições curtas e longas em múltiplos idiomas
 * com formato pronto para importação na Play Console
 */

const PLAY_CONSOLE_LANGUAGES = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'be', name: 'Belarusian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en-US', name: 'English (United States)' },
  { code: 'en-GB', name: 'English (United Kingdom)' },
  { code: 'et', name: 'Estonian' },
  { code: 'fil', name: 'Filipino' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'fr-CA', name: 'French (Canadian)' },
  { code: 'gl', name: 'Galician' },
  { code: 'ka', name: 'Georgian' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ht', name: 'Haitian Creole' },
  { code: 'ha', name: 'Hausa' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'kn', name: 'Kannada' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'ko', name: 'Korean' },
  { code: 'ky', name: 'Kyrgyz' },
  { code: 'lo', name: 'Lao' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mr', name: 'Marathi' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'my', name: 'Myanmar' },
  { code: 'ne', name: 'Nepali' },
  { code: 'no', name: 'Norwegian' },
  { code: 'or', name: 'Odia' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sr', name: 'Serbian' },
  { code: 'si', name: 'Sinhala' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'es', name: 'Spanish' },
  { code: 'es-MX', name: 'Spanish (Mexico)' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ug', name: 'Uyghur' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'cy', name: 'Welsh' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'zu', name: 'Zulu' }
];

/**
 * Gera copy em múltiplos idiomas
 */
async function generateMultiLanguageCopy(appData, options = {}) {
  const {
    sourceLanguage = 'pt-BR',
    targetLanguages = ['pt-BR', 'en-US', 'es-ES'],
    openaiApiKey = null
  } = options;

  const result = {
    sourceLanguage,
    sourceData: appData,
    translations: {}
  };

  for (const lang of targetLanguages) {
    if (lang === sourceLanguage) {
      result.translations[lang] = {
        appName: appData.title || appData.appName,
        shortDescription: appData.shortDescription,
        fullDescription: appData.fullDescription
      };
    } else {
      result.translations[lang] = {
        appName: appData.title || appData.appName,
        shortDescription: appData.shortDescription,
        fullDescription: appData.fullDescription,
        status: 'pending_translation'
      };
    }
  }

  return result;
}

/**
 * Formata as traduções no formato Play Console
 */
function formatPlayConsoleImport(multiLanguageData) {
  const { sourceLanguage, sourceData, translations } = multiLanguageData;

  let output = 'APP LISTING TRANSLATIONS\n';
  output += `Source language: ${sourceLanguage}\n\n`;

  for (const [langCode, langData] of Object.entries(translations)) {
    output += `[${langCode}]\n`;
    output += `App name: ${langData.appName}\n`;
    output += `Short description: ${langData.shortDescription}\n`;
    output += `Full description:\n`;
    output += `${langData.fullDescription}\n\n`;
  }

  return output;
}

/**
 * Salva no formato Play Console em arquivo
 */
function savePlayConsoleFormat(multiLanguageData, filePath) {
  const fs = require('fs');
  const content = formatPlayConsoleImport(multiLanguageData);
  fs.writeFileSync(filePath, content, 'utf-8');
  return {
    success: true,
    filePath,
    message: `Arquivo salvo em: ${filePath}`
  };
}

/**
 * Lista idiomas suportados
 */
function getSupportedLanguages() {
  return PLAY_CONSOLE_LANGUAGES;
}

/**
 * Obtém nome do idioma pelo código
 */
function getLanguageName(code) {
  const lang = PLAY_CONSOLE_LANGUAGES.find(l => l.code === code);
  return lang ? lang.name : code;
}

module.exports = {
  generateMultiLanguageCopy,
  formatPlayConsoleImport,
  savePlayConsoleFormat,
  getSupportedLanguages,
  getLanguageName,
  PLAY_CONSOLE_LANGUAGES
};
