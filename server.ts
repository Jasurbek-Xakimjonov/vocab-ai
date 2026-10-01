import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Generous limit for high-res textbook and worksheet images
app.use(express.json({ limit: '25mb' }));

// Server-side Gemini Client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fast-failover helper for Gemini generation when high demand (503/429) occurs
async function generateContentWithFallback(ai: GoogleGenAI, payload: any) {
  // Ordered models: flagship flash, ultra-reliable flash-lite, then flash-latest alias
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`Analyzing vocabulary with model: ${model}...`);
      const response = await ai.models.generateContent({
        ...payload,
        model,
      });
      console.log(`Analysis succeeded with model: ${model}`);
      return response;
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || '';
      const isTransient =
        msg.includes('503') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('high demand') ||
        msg.includes('429') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('overloaded');

      if (isTransient) {
        console.log(`Model ${model} is experiencing high demand. Seamlessly failing over to next model...`);
        // Short pause before switching
        await new Promise((resolve) => setTimeout(resolve, 300));
      } else {
        // Non-transient error, try next model
        console.log(`Model ${model} returned error (${msg}). Trying fallback model...`);
      }
    }
  }

  throw lastError;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Endpoint: Analyze vocabulary image with Gemini Vision
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Rasm ma\'lumoti topilmadi (Image data missing).' });
    }

    // Clean base64 string if data URL prefix exists
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const ai = getGeminiClient();

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
- IGNORE clutter: Discard textbook titles, page numbers, publisher copyrights, general instructions ("Read the text and answer").
- DEDUPLICATE: Do not include the same word multiple times.
- If a word is partially unreadable or ambiguous, skip it or extract only what is genuinely identifiable.
- Provide faithful JSON output conforming strictly to the requested schema.`;

    const payload = {
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
            {
              text: systemPrompt,
            },
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
    };

    const response = await generateContentWithFallback(ai, payload);
    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    if (!parsedData.words || !Array.isArray(parsedData.words)) {
      return res.status(500).json({ error: 'AI javobida so\'zlar topilmadi. Qayta urinib ko\'ring.' });
    }

    res.json({
      success: true,
      count: parsedData.words.length,
      words: parsedData.words,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-image:', error);
    let userMsg = error?.message || 'Gemini tahlilida kutilmagan xatolik yuz berdi.';
    if (userMsg.includes('high demand') || userMsg.includes('503') || userMsg.includes('UNAVAILABLE')) {
      userMsg = 'AI modelida ayni paytda yuqori yuklama kuzatilmoqda. Iltimos 3-5 soniyadan so\'ng qayta urinib ko\'ring.';
    }
    res.status(500).json({
      error: userMsg,
      details: error?.toString(),
    });
  }
});

// Endpoint: Enrich text/raw vocabulary lists with AI
app.post('/api/enrich-text', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Matn bo\'sh bo\'lishi mumkin emas.' });
    }

    const ai = getGeminiClient();

    const payload = {
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
    };

    const response = await generateContentWithFallback(ai, payload);
    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      count: parsed.words?.length || 0,
      words: parsed.words || [],
    });
  } catch (error: any) {
    console.error('Error in /api/enrich-text:', error);
    let userMsg = error?.message || 'Matnni tahlil qilishda xatolik yuz berdi.';
    if (userMsg.includes('high demand') || userMsg.includes('503')) {
      userMsg = 'AI modelida ayni paytda yuqori yuklama kuzatilmoqda. Qayta urinib ko\'ring.';
    }
    res.status(500).json({
      error: userMsg,
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback handler to serve index.html with Vite transformations
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`VocabAI server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
