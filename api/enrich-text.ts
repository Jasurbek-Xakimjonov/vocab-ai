import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY or VITE_GEMINI_API_KEY is not configured in Vercel Environment Variables.',
      });
    }

    const { text } = req.body || {};
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Matn bo\'sh bo\'lishi mumkin emas.' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: any = null;
    let response: any = null;

    for (const model of models) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: `You are an expert English-to-Uzbek language teacher and lexicographer.
Parse the following raw text or vocabulary input and produce a structured list of English words with Uzbek translations, definitions, examples, IPA pronunciations, and parts of speech.

Input text:
"""
${text}
"""

Format guidelines:
- If the text has pairs like "chet elda-abroad" or "apple - olma", recognize both the English word and the Uzbek translation.
- If it is just English words or a paragraph, identify the key vocabulary items.
- For each item, provide:
  - "word": English word/term
  - "translation": Natural Uzbek translation (Latin script)
  - "definition": Simple English definition
  - "example": Natural example sentence
  - "pronunciation": IPA transcription (e.g. "/əˈbrɔːd/")
  - "partOfSpeech": noun, verb, adjective, adverb, phrase, etc.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                words: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      word: { type: Type.STRING },
                      translation: { type: Type.STRING },
                      definition: { type: Type.STRING },
                      example: { type: Type.STRING },
                      pronunciation: { type: Type.STRING },
                      partOfSpeech: { type: Type.STRING },
                    },
                    required: ['word', 'translation', 'definition', 'example', 'pronunciation', 'partOfSpeech'],
                  },
                },
              },
              required: ['words'],
            },
          },
        });
        if (response) break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!response) {
      throw lastError || new Error('Barcha AI modellari band.');
    }

    const parsed = JSON.parse(response.text || '{}');
    return res.status(200).json({
      success: true,
      count: parsed.words?.length || 0,
      words: parsed.words || [],
    });
  } catch (error: any) {
    console.error('Error in Vercel enrich-text handler:', error);
    let msg = error?.message || 'Matnni tahlil qilishda xatolik yuz berdi.';
    if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
      msg = 'AI modelida ayni paytda yuqori yuklama kuzatilmoqda. Qayta urinib ko\'ring.';
    }
    return res.status(500).json({ error: msg });
  }
}
