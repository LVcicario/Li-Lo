import { NextRequest, NextResponse } from 'next/server';

const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '3b757bca-a645-42b3-b5e3-5039a9e1f713';
// Try Pro endpoint first, fallback to free if it fails
const DEEPL_API_URL = 'https://api.deepl.com/v2';

// In-memory cache to reduce API calls
const translationCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

export async function POST(request: NextRequest) {
  try {
    const { texts, targetLang = 'EN', sourceLang = 'FR' } = await request.json();

    if (!texts) {
      return NextResponse.json({ error: 'No texts provided' }, { status: 400 });
    }

    // Create cache key
    const cacheKey = `${JSON.stringify(texts)}_${targetLang}_${sourceLang}`;
    const cached = translationCache.get(cacheKey);

    // Return cached if valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ translations: cached.data, cached: true });
    }

    // Translate the texts
    const translations = await translateBatch(texts, targetLang, sourceLang);

    // Cache the result
    translationCache.set(cacheKey, {
      data: translations,
      timestamp: Date.now()
    });

    // Clean old cache entries periodically
    cleanCache();

    return NextResponse.json({ translations, cached: false });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function translateBatch(texts: any, targetLang: string, sourceLang: string): Promise<any> {
  // Handle string
  if (typeof texts === 'string') {
    return await translateSingleText(texts, targetLang, sourceLang);
  }

  // Handle array
  if (Array.isArray(texts)) {
    const promises = texts.map(text => translateBatch(text, targetLang, sourceLang));
    return await Promise.all(promises);
  }

  // Handle object
  if (typeof texts === 'object' && texts !== null) {
    const result: any = {};
    for (const [key, value] of Object.entries(texts)) {
      result[key] = await translateBatch(value, targetLang, sourceLang);
    }
    return result;
  }

  return texts;
}

async function translateSingleText(text: string, targetLang: string, sourceLang: string): Promise<string> {
  // Skip empty or non-translatable text
  if (!text || typeof text !== 'string' || text.trim() === '') return text;

  // Skip numbers, punctuation only, URLs, emails
  if (/^[\d\s\.,!?;:€$£¥%]+$/.test(text)) return text;
  if (/^https?:\/\//.test(text) || /^[^\s]+@[^\s]+\.[^\s]+$/.test(text)) return text;

  try {
    const response = await fetch(`${DEEPL_API_URL}/translate`, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang === 'EN' ? 'EN-GB' : targetLang.toUpperCase(),
        source_lang: sourceLang ? sourceLang.toUpperCase() : undefined,
        preserve_formatting: true,
        formality: 'default'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepL API error:', response.status, errorText);
      return text; // Fallback to original
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original
  }
}

function cleanCache() {
  const now = Date.now();
  const entries = Array.from(translationCache.entries());

  // Clean entries older than TTL
  entries.forEach(([key, value]) => {
    if (now - value.timestamp > CACHE_TTL) {
      translationCache.delete(key);
    }
  });

  // Limit cache size
  if (translationCache.size > 500) {
    const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    sortedEntries.slice(0, 250).forEach(([key]) => translationCache.delete(key));
  }
}