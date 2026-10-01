export interface ExtractedWordItem {
  word: string;
  translation: string;
  definition: string;
  example: string;
  pronunciation: string;
  partOfSpeech: string;
}

export interface AnalyzeResult {
  success: boolean;
  count: number;
  words: ExtractedWordItem[];
  error?: string;
}

// Sample presets for "Try example"
export const EXAMPLE_PRESETS = [
  {
    id: 'travel-unit',
    title: 'Textbook: Travel & Tourism',
    subtitle: 'English File B1 - Unit 6 Vocabulary List',
    previewUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    wordsCount: 10,
    words: [
      {
        word: 'abroad',
        translation: 'chet elda, xorijda',
        definition: 'In or to a foreign country',
        example: 'He plans to work abroad after graduating from university.',
        pronunciation: '/əˈbrɔːd/',
        partOfSpeech: 'adverb',
      },
      {
        word: 'check in',
        translation: "ro'yxatdan o'tmoq",
        definition: 'To arrive and register at a hotel or airport',
        example: 'Please check in at least two hours before departure.',
        pronunciation: '/tʃek ɪn/',
        partOfSpeech: 'phrasal verb',
      },
      {
        word: 'cruise',
        translation: 'kruiz, sayohat kemasi',
        definition: 'A voyage on a ship or boat taken for pleasure',
        example: 'They booked a seven-day luxury cruise in the Mediterranean.',
        pronunciation: '/kruːz/',
        partOfSpeech: 'noun',
      },
      {
        word: 'destination',
        translation: 'manzil, boradigan joy',
        definition: 'The place to which someone or something is going',
        example: 'Samarkand is a popular travel destination along the Silk Road.',
        pronunciation: '/ˌdes.tɪˈneɪ.ʃən/',
        partOfSpeech: 'noun',
      },
      {
        word: 'luggage',
        translation: 'yuk, chamadonlar',
        definition: 'Suitcases or bags containing personal belongings',
        example: 'You can leave your heavy luggage at the hotel reception.',
        pronunciation: '/ˈlʌɡ.ɪdʒ/',
        partOfSpeech: 'noun',
      },
      {
        word: 'reservation',
        translation: 'band qilish, bron',
        definition: 'An arrangement to have something held for your use',
        example: 'We made a dinner reservation for eight o\'clock.',
        pronunciation: '/ˌrez.əˈveɪ.ʃən/',
        partOfSpeech: 'noun',
      },
      {
        word: 'souvenir',
        translation: 'esdalik sovg\'a',
        definition: 'Something kept as a reminder of a place you have visited',
        example: 'She bought a handmade ceramic souvenir in Bukhara.',
        pronunciation: '/ˌsuː.vənˈɪər/',
        partOfSpeech: 'noun',
      },
      {
        word: 'itinerary',
        translation: 'sayohat rejasi / marshruti',
        definition: 'A planned route or schedule of travel',
        example: 'Our weekend itinerary includes museum visits and hiking.',
        pronunciation: '/aɪˈtɪn.ər.ər.i/',
        partOfSpeech: 'noun',
      },
      {
        word: 'boarding pass',
        translation: 'samolyotga chiqish taloni',
        definition: 'A card or electronic pass giving permission to board an aircraft',
        example: 'Have your boarding pass and passport ready at the gate.',
        pronunciation: '/ˈbɔː.dɪŋ pɑːs/',
        partOfSpeech: 'noun',
      },
      {
        word: 'delayed',
        translation: 'kechiktirilgan',
        definition: 'Occurring or arriving later than planned or expected',
        example: 'The evening train was delayed due to heavy snowfall.',
        pronunciation: '/dɪˈleɪd/',
        partOfSpeech: 'adjective',
      },
    ],
  },
  {
    id: 'academic-ielts',
    title: 'Worksheet: Academic IELTS Core',
    subtitle: 'Band 7+ Essay Vocabulary Worksheet',
    previewUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    wordsCount: 8,
    words: [
      {
        word: 'significant',
        translation: 'muhim, salmoqli, sezilarli',
        definition: 'Sufficiently great or important to be worthy of attention',
        example: 'There was a significant increase in online education this decade.',
        pronunciation: '/sɪɡˈnɪf.ɪ.kənt/',
        partOfSpeech: 'adjective',
      },
      {
        word: 'demonstrate',
        translation: "ko'rsatmoq, isbotlamoq",
        definition: 'To clearly show the existence or truth of something with proof',
        example: 'Recent scientific trials demonstrate the effectiveness of this method.',
        pronunciation: '/ˈdem.ən.streɪt/',
        partOfSpeech: 'verb',
      },
      {
        word: 'consequence',
        translation: 'oqibat, natija',
        definition: 'A result or effect of an action or condition',
        example: 'Pollution has serious long-term consequences for global health.',
        pronunciation: '/ˈkɒn.sɪ.kwəns/',
        partOfSpeech: 'noun',
      },
      {
        word: 'fundamental',
        translation: 'asosiy, tub, muhim',
        definition: 'Forming a necessary base or core; of central importance',
        example: 'Reading comprehension is a fundamental life skill.',
        pronunciation: '/ˌfʌn.dəˈmen.təl/',
        partOfSpeech: 'adjective',
      },
      {
        word: 'perspective',
        translation: 'qarash, nuqtai nazar',
        definition: 'A particular attitude toward or way of regarding something',
        example: 'Traveling helps people understand life from a broader perspective.',
        pronunciation: '/pəˈspek.tɪv/',
        partOfSpeech: 'noun',
      },
      {
        word: 'facilitate',
        translation: 'osonlashtirmoq, yengillashtirmoq',
        definition: 'To make an action or process easy or easier',
        example: 'Modern interactive software facilitates self-paced language learning.',
        pronunciation: '/fəˈsɪl.ɪ.teɪt/',
        partOfSpeech: 'verb',
      },
      {
        word: 'comprehensive',
        translation: 'har tomonlama, to\'liq, keng qamrovli',
        definition: 'Including or dealing with all or nearly all elements of something',
        example: 'The university course offers a comprehensive overview of linguistics.',
        pronunciation: '/ˌkɒm.prɪˈhen.sɪv/',
        partOfSpeech: 'adjective',
      },
      {
        word: 'sustainable',
        translation: 'barqaror, uzoq muddatli saqlanadigan',
        definition: 'Able to be maintained at a certain rate or level without depletion',
        example: 'Developing countries strive to create sustainable green energy.',
        pronunciation: '/səˈsteɪ.nə.bəl/',
        partOfSpeech: 'adjective',
      },
    ],
  },
];

const SYSTEM_PROMPT_VISION = `You are an expert English lexicographer, linguistic annotator, and English-to-Uzbek language teacher.
Read the image and extract ALL English vocabulary items accurately.
For each word, return:
- word: clean English word
- translation: accurate Uzbek translation (Latin alphabet)
- definition: clear, simple English learner definition
- example: natural example sentence
- pronunciation: IPA phonetic transcription (e.g. /əˈbrɔːd/)
- partOfSpeech: noun, verb, adjective, adverb, phrase, etc.
Output strictly JSON conforming to: {"words": [{"word":"", "translation":"", "definition":"", "example":"", "pronunciation":"", "partOfSpeech":""}]}`;

const SYSTEM_PROMPT_TEXT = `You are an expert English-to-Uzbek language teacher.
Parse the input text and produce a list of English words with Uzbek translations, simple definitions, examples, IPA pronunciations, and parts of speech.
Output strictly JSON conforming to: {"words": [{"word":"", "translation":"", "definition":"", "example":"", "pronunciation":"", "partOfSpeech":""}]}`;

// Direct client-side Gemini fallback for Vercel static deployments
async function directGeminiVision(imageBase64: string, mimeType: string, apiKey: string): Promise<AnalyzeResult> {
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: cleanBase64,
                },
              },
              {
                text: SYSTEM_PROMPT_VISION,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Gemini API xatosi.');
      }

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const parsed = JSON.parse(rawText);
      return {
        success: true,
        count: parsed.words?.length || 0,
        words: parsed.words || [],
      };
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError || new Error('Direct Gemini API call failed.');
}

async function directGeminiText(text: string, apiKey: string): Promise<AnalyzeResult> {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT_TEXT}\n\nInput text:\n"""\n${text}\n"""`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Gemini API xatosi.');
      }

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const parsed = JSON.parse(rawText);
      return {
        success: true,
        count: parsed.words?.length || 0,
        words: parsed.words || [],
      };
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError || new Error('Direct Gemini text parsing failed.');
}

export async function analyzeVocabularyImage(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<AnalyzeResult> {
  // 1. Try server endpoint /api/analyze-image (Vercel Serverless or Express server)
  try {
    const res = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        mimeType,
      }),
    });

    // If 404, it might be a static host without /api routes
    if (res.status !== 404 && res.ok) {
      const data = await res.json();
      return {
        success: true,
        count: data.words?.length || 0,
        words: data.words || [],
      };
    }
  } catch (serverErr) {
    console.warn('/api/analyze-image unreachable, checking client fallback...', serverErr);
  }

  // 2. Client-side fallback using VITE_GEMINI_API_KEY
  const clientApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (clientApiKey) {
    try {
      return await directGeminiVision(imageBase64, mimeType, clientApiKey);
    } catch (clientErr: any) {
      console.error('Direct Gemini Vision failed:', clientErr);
    }
  }

  return {
    success: false,
    count: 0,
    words: [],
    error: 'AI tahlilida xatolik yuz berdi. Iltimos VITE_GEMINI_API_KEY sozlanganligini tekshiring yoki qayta urinib ko\'ring.',
  };
}

export async function enrichVocabularyText(text: string): Promise<AnalyzeResult> {
  // 1. Try server endpoint /api/enrich-text
  try {
    const res = await fetch('/api/enrich-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (res.status !== 404 && res.ok) {
      const data = await res.json();
      return {
        success: true,
        count: data.words?.length || 0,
        words: data.words || [],
      };
    }
  } catch (serverErr) {
    console.warn('/api/enrich-text unreachable, checking client fallback...', serverErr);
  }

  // 2. Client-side fallback using VITE_GEMINI_API_KEY
  const clientApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (clientApiKey) {
    try {
      return await directGeminiText(text, clientApiKey);
    } catch (clientErr: any) {
      console.error('Direct Gemini Text failed:', clientErr);
    }
  }

  return {
    success: false,
    count: 0,
    words: [],
    error: 'Matnni tahlil qilishda xatolik yuz berdi.',
  };
}
