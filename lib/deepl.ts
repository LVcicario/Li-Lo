// DeepL Translation Service
const DEEPL_API_KEY = '3b757bca-a645-42b3-b5e3-5039a9e1f713';
const DEEPL_API_URL = 'https://api.deepl.com/v2';

export interface TranslationResult {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

export async function translateText(
  text: string | string[],
  targetLang: string = 'FR',
  sourceLang?: string
): Promise<string | string[]> {
  try {
    const texts = Array.isArray(text) ? text : [text];

    const response = await fetch(`${DEEPL_API_URL}/translate`, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texts,
        target_lang: targetLang.toUpperCase(),
        source_lang: sourceLang?.toUpperCase(),
        preserve_formatting: true,
        formality: 'default'
      })
    });

    if (!response.ok) {
      console.error('DeepL API error:', response.status, response.statusText);
      return text; // Return original text if translation fails
    }

    const data: TranslationResult = await response.json();
    const translations = data.translations.map(t => t.text);

    return Array.isArray(text) ? translations : translations[0];
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

export async function translateJSON(
  json: Record<string, any>,
  targetLang: string = 'FR',
  sourceLang: string = 'EN'
): Promise<Record<string, any>> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(json)) {
    if (typeof value === 'string') {
      result[key] = await translateText(value, targetLang, sourceLang);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = await translateJSON(value, targetLang, sourceLang);
    } else {
      result[key] = value;
    }
  }

  return result;
}

// Cache translations to avoid repeated API calls
const translationCache = new Map<string, string>();

export async function cachedTranslate(
  text: string,
  targetLang: string = 'FR',
  sourceLang?: string
): Promise<string> {
  const cacheKey = `${text}_${targetLang}_${sourceLang || 'auto'}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  const translation = await translateText(text, targetLang, sourceLang) as string;
  translationCache.set(cacheKey, translation);

  return translation;
}