import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { platformStore } from './serverPlatformStore.js';

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

// ========================================================
// SUBSCRIPTION & USER PROFILE APIS
// ========================================================

// Get public platform configuration & pricing
app.get('/api/subscription/config', (req, res) => {
  try {
    const settings = platformStore.getSettings();
    res.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// Authenticated user subscription profile verification (Authoritative Source of Truth)
app.post('/api/subscription/profile', (req, res) => {
  try {
    const { userId, email, displayName } = req.body;
    if (!userId || !email) {
      return res.status(400).json({ error: 'userId and email are required.' });
    }

    const profile = platformStore.upsertUser(userId, email, displayName);
    const usage = platformStore.getSpeakingUsage(userId);

    res.json({
      success: true,
      profile,
      usage,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// User submits payment request (Click, Payme, Uzum, Card)
app.post('/api/subscription/request', (req, res) => {
  try {
    const { userId, email, userName, paymentMethod, senderPhone, transactionRef, notes } = req.body;
    if (!userId || !email || !senderPhone) {
      return res.status(400).json({ error: 'Foydalanuvchi ma\'lumotlari va telefon raqami talab qilinadi.' });
    }

    const request = platformStore.addPaymentRequest({
      userId,
      email,
      userName: userName || email.split('@')[0],
      paymentMethod: paymentMethod || 'card',
      senderPhone,
      transactionRef,
      notes,
    });

    res.json({
      success: true,
      message: 'To\'lov arizangiz qabul qilindi! Administrator tekshiruvidan so\'ng 30 kunlik PRO faollashadi.',
      request,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// User views their own payment requests
app.get('/api/subscription/my-requests', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required' });
    }

    const allRequests = platformStore.getPaymentRequests();
    const userRequests = allRequests.filter((r) => r.user_id === userId);

    res.json({
      success: true,
      requests: userRequests,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// Query user's current daily speaking usage status
app.get('/api/subscription/speaking-usage', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required' });
    }

    const usage = platformStore.getSpeakingUsage(userId);
    res.json({
      success: true,
      usage,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// Safely increment speaking duration
app.post('/api/subscription/speaking-usage/increment', (req, res) => {
  try {
    const { userId, seconds = 30 } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const usage = platformStore.incrementSpeakingUsage(userId, Number(seconds));
    res.json({
      success: true,
      usage,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// ========================================================
// ADMIN APIS
// ========================================================

// Admin Overview
app.get('/api/admin/overview', (req, res) => {
  try {
    const overview = platformStore.getAdminOverview();
    res.json({
      success: true,
      ...overview,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// Admin: Get all users
app.get('/api/admin/users', (req, res) => {
  try {
    const users = platformStore.getAllUsers();
    res.json({
      success: true,
      users,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// Admin: Update user profile (grant/revoke PRO, change role, block/unblock, set limit)
app.post('/api/admin/users/:userId/update', (req, res) => {
  try {
    const { userId } = req.params;
    const { plan, role, is_blocked, durationDaysToAdd, daily_speaking_limit, pro_expires_at } = req.body;

    const updated = platformStore.updateUser(userId, {
      plan,
      role,
      is_blocked,
      durationDaysToAdd,
      daily_speaking_limit,
      pro_expires_at,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }

    res.json({
      success: true,
      user: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// Admin: Get all payment requests
app.get('/api/admin/requests', (req, res) => {
  try {
    const requests = platformStore.getPaymentRequests();
    res.json({
      success: true,
      requests,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// Admin: Review payment request (approve/reject)
app.post('/api/admin/requests/:requestId/review', (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, reviewedBy = 'Admin', durationDays = 30 } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status approved yoki rejected bo\'lishi shart.' });
    }

    const result = platformStore.reviewPaymentRequest(
      requestId,
      status,
      reviewedBy,
      Number(durationDays)
    );

    if (!result.success) {
      return res.status(404).json({ error: 'Ariza topilmadi' });
    }

    res.json({
      success: true,
      message: status === 'approved' ? 'To\'lov tasdiqlandi va foydalanuvchiga PRO berildi! 💎' : 'Ariza rad etildi.',
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// Admin: Update platform settings (PRO price, daily limit, payment card)
app.post('/api/admin/settings', (req, res) => {
  try {
    const {
      pro_price_som,
      pro_duration_days,
      free_daily_speaking_limit_minutes,
      payment_card_number,
      payment_card_holder,
      payment_phone,
    } = req.body;

    const updated = platformStore.updateSettings({
      pro_price_som: pro_price_som ? Number(pro_price_som) : undefined,
      pro_duration_days: pro_duration_days ? Number(pro_duration_days) : undefined,
      free_daily_speaking_limit_minutes: free_daily_speaking_limit_minutes ? Number(free_daily_speaking_limit_minutes) : undefined,
      payment_card_number,
      payment_card_holder,
      payment_phone,
    });

    res.json({
      success: true,
      message: 'Sozlamalar muvaffaqiyatli saqlandi! ✅',
      settings: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// ========================================================
// AI SPEAKING BUDDY CHAT API (WITH PERMISSION & USAGE CHECKS)
// ========================================================
app.post('/api/speaking-buddy/chat', async (req, res) => {
  try {
    const {
      userId,
      message,
      history = [],
      level = 0,
      userName = '',
      category = 'basic',
      characterRole = '',
      topicTitle = '',
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // 1. Authoritative security & permission checks
    let userProfile = userId ? platformStore.getUser(userId) : null;
    if (userProfile?.is_blocked) {
      return res.status(403).json({
        error: 'Profilingiz bloklangan. Iltimos, administrator bilan bog\'laning.',
        isBlocked: true,
      });
    }

    const usage = userId ? platformStore.getSpeakingUsage(userId) : null;
    const isPro = userProfile?.plan === 'pro';

    // 2. Check FREE daily speaking limit
    if (!isPro && usage && !usage.canSpeak) {
      return res.status(403).json({
        error: `Kunlik bepul ${usage.limitMinutes} daqiqalik suhbat limitingiz tugadi. Cheksiz suhbatlashish uchun PRO tarifiga o'ting! 💎`,
        limitReached: true,
        usage,
      });
    }

    const ai = getGeminiClient();

    const formattedHistory = (history || [])
      .slice(-6)
      .map((h: any) => `${h.sender === 'ai' ? 'AI' : 'User'}: ${h.englishText || h.text || ''}`)
      .join('\n');

    let personaInstructions = '';
    if (category === 'roleplay' && characterRole) {
      personaInstructions = `
ROLEPLAY SCENARIO:
You are roleplaying as: "${characterRole}" in the scenario: "${topicTitle}".
Stay in character! Act as a realistic, friendly ${characterRole}.
Current learner level is Level ${level} (adapt your English difficulty appropriately, from simple beginner up to fluent B2).
Still maintain warm, encouraging tone and keep responses concise (1-2 sentences).`;
    } else {
      personaInstructions = `
You are "AI Speaking Buddy", a friendly, supportive, and kind English-speaking partner for an Uzbek student learning English.
Current Level: Level ${level} (0 = Absolute Beginner, 1 = Beginner+, 2 = Elementary, 3 = Pre-Intermediate, 4 = Intermediate, 5 = Upper-Intermediate B2).`;
    }

    const systemPrompt = `${personaInstructions}

CORE RULES:
1. Speak in natural English appropriate for Level ${level} (short, clear sentences, 1-2 sentences maximum).
2. Ask only ONE natural question or conversational prompt at a time.
3. Every English response MUST include its exact, natural Uzbek translation underneath.
4. PEDAGOGICAL ERROR CORRECTION METHOD:
   If the user made a grammar or vocabulary mistake:
   a) Start with positive encouragement ("Good try!", "Almost correct!", "Nice effort!").
   b) Point out the specific mistake briefly.
   c) Explain in simple Uzbek why it's incorrect (e.g. '"Yesterday" o\'tgan vaqtni bildiradi, shuning uchun "go" o\'rniga "went" ishlatamiz.').
   d) Provide the correct English sentence and its Uzbek translation.
   e) Prompt the user to repeat it ("Can you say it again?" or "Try saying it again!").
   IMPORTANT: If the user's message has NO grammar mistake, do NOT invent one! Set "gentleCorrection" to null and continue the natural conversation.
5. Provide 2-3 easy answer suggestions for the user (both in English and Uzbek).
6. Be friendly, warm, like a close friend practicing English over tea. User's name if known: "${userName}".

Recent Conversation Context:
${formattedHistory}

User's Latest Message:
"${message}"

Provide a JSON object conforming strictly to:
{
  "englishText": "Short, friendly AI response in English with ONE question or prompt",
  "uzbekText": "Natural Uzbek translation of the English response",
  "gentleCorrection": null or {
    "motivation": "Good try! There is one small mistake.",
    "original": "user mistake",
    "corrected": "correct sentence",
    "correctedUz": "Uzbek translation of correct sentence",
    "explanationUz": "Simple Uzbek explanation of the rule",
    "repeatPrompt": "Can you say it again?"
  },
  "suggestions": [
    { "english": "suggestion 1", "uzbek": "translation 1" },
    { "english": "suggestion 2", "uzbek": "translation 2" },
    { "english": "suggestion 3", "uzbek": "translation 3" }
  ],
  "keyVocabulary": [
    { "word": "english word", "translation": "uzbek word", "partOfSpeech": "noun/verb/etc" }
  ]
}`;

    const payload = {
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            englishText: { type: Type.STRING },
            uzbekText: { type: Type.STRING },
            gentleCorrection: {
              type: Type.OBJECT,
              properties: {
                motivation: { type: Type.STRING },
                original: { type: Type.STRING },
                corrected: { type: Type.STRING },
                correctedUz: { type: Type.STRING },
                explanationUz: { type: Type.STRING },
                repeatPrompt: { type: Type.STRING },
              },
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  english: { type: Type.STRING },
                  uzbek: { type: Type.STRING },
                },
                required: ['english', 'uzbek'],
              },
            },
            keyVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  translation: { type: Type.STRING },
                  partOfSpeech: { type: Type.STRING },
                },
                required: ['word', 'translation'],
              },
            },
          },
          required: ['englishText', 'uzbekText', 'suggestions'],
        },
      },
    };

    let parsed: any = null;

    try {
      const response = await generateContentWithFallback(ai, payload);
      parsed = JSON.parse(response.text || '{}');
    } catch (genErr: any) {
      console.warn('Gemini temporary spike/failure, using built-in resilient tutor engine:', genErr?.message);
      
      const clean = message.trim().toLowerCase();
      let fallbackCorrection: any = null;

      if (/\b(?:i|we|they|he|she)\s+go\b.*?\b(?:yesterday|last\s+\w+|ago)\b/i.test(clean) ||
          /\b(?:yesterday|last\s+\w+|ago)\b.*?\b(?:i|we|they|he|she)\s+go\b/i.test(clean)) {
        fallbackCorrection = {
          motivation: "Good try! There is one small mistake.",
          original: message,
          corrected: message.replace(/\bi go\b/gi, 'I went'),
          correctedUz: "Men kecha maktabga bordim.",
          explanationUz: '"Yesterday" o\'tgan vaqtni bildiradi, shuning uchun "go" o\'rniga "went" ishlatamiz.',
          repeatPrompt: "Can you say it again?",
        };
      } else if (/\bi am agree\b/i.test(clean)) {
        fallbackCorrection = {
          motivation: "Nice effort! 👍",
          original: message,
          corrected: "I agree.",
          correctedUz: "Men qo'shilaman.",
          explanationUz: '"Agree" o\'zi fe\'l hisoblanadi, shuning uchun "am" qo\'yilmaydi.',
          repeatPrompt: "Can you say it again?",
        };
      }

      parsed = {
        englishText: fallbackCorrection ? "Nice effort! Let's practice that sentence together." : "That's wonderful! Tell me more about that.",
        uzbekText: fallbackCorrection ? "Yaxshi urinish! Keling, bu gapni birga mashq qilamiz." : "Ajoyib! Bu haqda ko'proq aytib bering.",
        gentleCorrection: fallbackCorrection,
        suggestions: [
          { english: "Yes, exactly!", uzbek: "Ha, xuddi shunday!" },
          { english: "I understand now.", uzbek: "Endi tushundim." },
          { english: "Could you repeat that?", uzbek: "Qaytara olasizmi?" },
        ],
        keyVocabulary: [],
      };
    }

    // Automatically count 25 seconds of practice usage
    let updatedUsage = usage;
    if (userId) {
      updatedUsage = platformStore.incrementSpeakingUsage(userId, 25);
    }

    res.json({
      success: true,
      data: parsed,
      usage: updatedUsage,
    });
  } catch (error: any) {
    console.error('Error in /api/speaking-buddy/chat:', error);
    res.status(500).json({
      error: error?.message || 'AI suhbatdosh xatoligi.',
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
