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

    const { imageBase64, mimeType = 'image/jpeg' } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ error: 'Rasm ma\'lumoti topilmadi (Image data missing).' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemPrompt = `You are an expert English lexicographer, linguistic annotator, and English-to-Uzbek language teacher.
Your job is to read images of vocabulary lists, textbook pages, worksheets, whiteboard photos, screenshots, or flashcards, and extract ALL English vocabulary items accurately.

INSTRUCTIONS:
1. Scan the image carefully for English words, phrases, idioms, and collocations that are intended as vocabulary to learn.
2. If there are vocabulary tables, word boxes, highlighted terms, or numbered word lists, extract every single vocabulary item.
3. For each word, generate:
   - "word": The clean English word/phrase in normal casing (e.g. "abroad", "check in", "significant").
   - "translation": The accurate Uzbek translation in modern Latin alphabet (e.g. "chet elda", "ro'yxatdan o'tmoq", "muhim"). If the image already includes Uzbek (or Russian) translations alongside the words, preserve and refine them into high quality Uzbek.
   - "definition": A clear, simple English learner definition (concise and easy to comprehend).
   - "example": A natural, everyday example sentence illustrating how the word is used in English.
   - "pronunciation": Standard IPA phonetic transcription (e.g. "/əˈbrɔːd/", "/ˈbjuːtɪfəl/").
   - "partOfSpeech": The grammatical part of speech in lowercase (noun, verb, adjective, adverb, phrase, phrasal verb, preposition, idiom).

CRITICAL CONSTRAINTS:
- STRICT FIDELITY: Only extract words that are actually printed or written in the image. Do NOT invent or hallucinate random words that do not appear in the image.
- IGNORE clutter: Discard textbook titles, page numbers, publisher copyrights, general instructions.
- DEDUPLICATE: Do not include the same word multiple times.
- Return faithful JSON conforming to schema.`;

    const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: any = null;
    let response: any = null;

    for (const model of models) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType || 'image/jpeg',
                    data: cleanBase64,
                  },
                },
                { text: systemPrompt },
              ],
            },
          ],
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

    const parsedData = JSON.parse(response.text || '{}');
    return res.status(200).json({
      success: true,
      count: parsedData.words?.length || 0,
      words: parsedData.words || [],
    });
  } catch (error: any) {
    console.error('Error in Vercel analyze-image handler:', error);
    let msg = error?.message || 'Gemini tahlilida kutilmagan xatolik yuz berdi.';
    if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
      msg = 'AI modelida ayni paytda yuqori yuklama kuzatilmoqda. Qayta urinib ko\'ring.';
    }
    return res.status(500).json({ error: msg });
  }
}
