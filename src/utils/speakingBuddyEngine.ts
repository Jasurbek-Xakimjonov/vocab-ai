import {
  SpeakingBuddyLevel,
  BuddyLevelInfo,
  BuddyTopic,
  BuddySuggestion,
  BuddyMessage,
  BuddyVocabItem,
  BuddyCorrection,
} from '../types/speakingBuddy';

export const BUDDY_LEVELS: BuddyLevelInfo[] = [
  {
    level: 0,
    name: 'Level 0 — Beginner',
    nameUz: 'Nol daraja — Boshlang\'ich',
    badge: '🌱',
    description: 'Absolute beginner. Learn the most basic words, greetings, and introductions.',
    descriptionUz: 'Eng oddiy salomlashish, tanishuv va kundalik so\'zlar.',
  },
  {
    level: 1,
    name: 'Level 1 — Beginner+',
    nameUz: '1-daraja — Boshlang\'ich+',
    badge: '🌿',
    description: 'Build short sentences about your day, friends, food, and hobbies.',
    descriptionUz: 'Kun tartibi, do\'stlar, sevimli ovqatlar haqida qisqa jumlalar.',
  },
  {
    level: 2,
    name: 'Level 2 — Elementary',
    nameUz: '2-daraja — Boshlang\'ich/O\'rta',
    badge: '🌳',
    description: 'Talk about past experiences, plans for tomorrow, and simple opinions.',
    descriptionUz: 'O\'tgan voqealar, rejalar va oddiy fikr bildirish.',
  },
  {
    level: 3,
    name: 'Level 3 — Pre-Intermediate',
    nameUz: '3-daraja — O\'rtadan oldingi',
    badge: '🚀',
    description: 'Comfortable discussions, stories, travel, and personal experiences.',
    descriptionUz: 'Sayohat, qiziqarli voqealar va erkinroq suhbat.',
  },
];

export const BUDDY_TOPICS: BuddyTopic[] = [
  // Level 0 Topics
  {
    id: 'greetings',
    level: 0,
    title: 'Hello & Greetings',
    titleUz: 'Salomlashish',
    icon: '👋',
    description: 'Learn how to say hello, ask how someone is, and say goodbye.',
    descriptionUz: 'Salomlashish, hol-ahvol so\'rash va xayrlashishni o\'rganing.',
    initialMessage: {
      english: 'Hello! 👋 How are you today?',
      uzbek: 'Salom! 👋 Bugun qalaysan?',
    },
    sampleSuggestions: [
      { english: "I am good. 😊", uzbek: 'Men yaxshiman. 😊' },
      { english: "I'm fine, thank you! 👍", uzbek: 'Yaxshiman, rahmat! 👍' },
      { english: "I'm great!", uzbek: 'Ajoyibman!' },
    ],
  },
  {
    id: 'my-name',
    level: 0,
    title: 'My Name & Introduction',
    titleUz: 'Tanishuv va ism',
    icon: '🤝',
    description: 'Introduce yourself and ask for someone\'s name.',
    descriptionUz: 'O\'zingizni tanishtiring va ism so\'rang.',
    initialMessage: {
      english: 'Hi! What is your name?',
      uzbek: 'Salom! Isming nima?',
    },
    sampleSuggestions: [
      { english: 'My name is Jasur.', uzbek: 'Mening ismim Jasur.' },
      { english: 'I am Jasur.', uzbek: 'Men Jasurman.' },
      { english: 'Nice to meet you!', uzbek: 'Tanishganimdan xursandman!' },
    ],
  },
  {
    id: 'where-i-live',
    level: 0,
    title: 'Where I Live',
    titleUz: 'Yashash joyi',
    icon: '🏠',
    description: 'Talk about your city or country.',
    descriptionUz: 'Shahringiz yoki mamlakatingiz haqida gapiring.',
    initialMessage: {
      english: 'Where do you live?',
      uzbek: 'Qayerda yashaysan?',
    },
    sampleSuggestions: [
      { english: 'I live in Tashkent.', uzbek: 'Men Toshkentda yashayman.' },
      { english: 'I live in Uzbekistan.', uzbek: 'Men O\'zbekistonda yashayman.' },
      { english: 'I live in Samarkand.', uzbek: 'Men Samarqandda yashayman.' },
    ],
  },
  {
    id: 'my-age',
    level: 0,
    title: 'My Age',
    titleUz: 'Yosh haqida',
    icon: '🎂',
    description: 'Say how old you are in English.',
    descriptionUz: 'Yoshingizni ingliz tilida aytishni o\'rganing.',
    initialMessage: {
      english: 'How old are you?',
      uzbek: 'Yoshing nechida?',
    },
    sampleSuggestions: [
      { english: 'I am 15 years old.', uzbek: 'Men 15 yoshdaman.' },
      { english: 'I am 18 years old.', uzbek: 'Men 18 yoshdaman.' },
      { english: 'I am 20 years old.', uzbek: 'Men 20 yoshdaman.' },
    ],
  },
  {
    id: 'school',
    level: 0,
    title: 'School & Student',
    titleUz: 'Maktab va o\'qish',
    icon: '🎒',
    description: 'Talk about school, university, and studying.',
    descriptionUz: 'Maktab yoki o\'qish haqida oddiy gaplar.',
    initialMessage: {
      english: 'Are you a student?',
      uzbek: 'Siz o\'quvchimisiz?',
    },
    sampleSuggestions: [
      { english: 'Yes, I am a student.', uzbek: 'Ha, men o\'quvchiman.' },
      { english: 'Yes, I go to school.', uzbek: 'Ha, men maktabga boraman.' },
      { english: 'No, I work.', uzbek: 'Yo\'q, men ishlayman.' },
    ],
  },
  {
    id: 'my-family',
    level: 0,
    title: 'My Family',
    titleUz: 'Mening oilam',
    icon: '👨‍👩‍👧‍👦',
    description: 'Talk about mother, father, brothers, and sisters.',
    descriptionUz: 'Ota-ona, aka-uka va opa-singillar haqida.',
    initialMessage: {
      english: 'Do you have a big family?',
      uzbek: 'Katta oilang bormi?',
    },
    sampleSuggestions: [
      { english: 'Yes, I have a big family.', uzbek: 'Ha, oilam katta.' },
      { english: 'I have one brother and one sister.', uzbek: 'Bitta akam va bitta singlim bor.' },
      { english: 'I love my family.', uzbek: 'Men oilamni yaxshi ko\'raman.' },
    ],
  },
  {
    id: 'food',
    level: 0,
    title: 'Food & Eating',
    titleUz: 'Ovqatlar',
    icon: '🍕',
    description: 'Talk about your favorite foods and meals.',
    descriptionUz: 'Sevimli taomlar va ovqatlanish haqida.',
    initialMessage: {
      english: 'What is your favorite food?',
      uzbek: 'Sevimli taoming nima?',
    },
    sampleSuggestions: [
      { english: 'I like plov.', uzbek: 'Men oshni yaxshi ko\'raman.' },
      { english: 'My favorite food is pizza.', uzbek: 'Sevimli taomim pitsa.' },
      { english: 'I like fruits and vegetables.', uzbek: 'Meva va sabzavotlarni yoqtiraman.' },
    ],
  },
  {
    id: 'hobbies',
    level: 0,
    title: 'Hobbies & Free Time',
    titleUz: 'Qiziqishlar va bo\'sh vaqt',
    icon: '⚽',
    description: 'Share what you like doing for fun.',
    descriptionUz: 'Bo\'sh vaqtingizda nima qilishni yoqtirasiz.',
    initialMessage: {
      english: 'What do you like to do in your free time?',
      uzbek: 'Bo\'sh vaqtingda nima qilishni yoqtirasan?',
    },
    sampleSuggestions: [
      { english: 'I like playing football.', uzbek: 'Futbol o\'ynashni yoqtiraman.' },
      { english: 'I like reading books.', uzbek: 'Kitob o\'qishni yoqtiraman.' },
      { english: 'I like listening to music.', uzbek: 'Musiqa tinglashni yoqtiraman.' },
    ],
  },
];

// Helper: check for common beginner mistakes and return gentle correction
export function checkGentleCorrection(userInput: string): BuddyCorrection | null {
  const clean = userInput.trim().toLowerCase();

  // "i good" or "i fine" -> "I am good"
  if (/^i\s+(good|fine|happy|tired|sad|ok|okay)$/i.test(clean)) {
    return {
      original: userInput,
      corrected: `I am ${clean.replace('i ', '')}.`,
      explanationUz: '"I" dan keyin "am" yordamchi fe\'li ishlatiladi (Masalan: "I am good").',
    };
  }

  // "my name jasur" -> "My name is Jasur"
  if (/^my name\s+[a-z]+/i.test(clean) && !clean.includes(' is ') && !clean.includes("'s")) {
    const parts = userInput.trim().split(/\s+/);
    const name = parts.slice(2).join(' ');
    return {
      original: userInput,
      corrected: `My name is ${name}.`,
      explanationUz: '"My name" dan keyin "is" so\'zi qo\'yiladi (Masalan: "My name is...").',
    };
  }

  // "i live tashkent" -> "I live in Tashkent"
  if (/^i live\s+[a-z]+/i.test(clean) && !clean.includes(' in ')) {
    const city = userInput.trim().replace(/^i live\s+/i, '');
    return {
      original: userInput,
      corrected: `I live in ${city}.`,
      explanationUz: 'Shahar yoki davlat oldidan "in" qo\'shimchasi qo\'yiladi.',
    };
  }

  // "i 15 years old" -> "I am 15 years old"
  if (/^i\s+\d+\s*(years old)?$/i.test(clean)) {
    const num = clean.replace(/[^0-9]/g, '');
    return {
      original: userInput,
      corrected: `I am ${num} years old.`,
      explanationUz: 'Yoshni aytganda "I am..." deb aytiladi.',
    };
  }

  return null;
}

// Conversation turn generator
export interface EngineContext {
  topicId: string;
  userName?: string;
  userCity?: string;
  userAge?: string;
  turnCount: number;
}

export function generateBuddyResponse(
  userInput: string,
  history: BuddyMessage[],
  context: EngineContext
): {
  message: BuddyMessage;
  updatedContext: EngineContext;
} {
  const text = userInput.trim();
  const lower = text.toLowerCase();
  const newContext = { ...context, turnCount: context.turnCount + 1 };

  // Check gentle error correction
  const correction = checkGentleCorrection(text);

  let englishText = '';
  let uzbekText = '';
  let suggestions: BuddySuggestion[] = [];
  let keyVocabulary: BuddyVocabItem[] = [];

  // Detect user's name if provided
  const nameMatch = text.match(/my name (?:is|'s)\s+([A-Za-z]+)/i) || text.match(/^i am\s+([A-Za-z]+)$/i);
  if (nameMatch && nameMatch[1]) {
    newContext.userName = nameMatch[1];
  } else if (/^[A-Za-z]+$/.test(text) && !['good', 'fine', 'yes', 'no', 'hello', 'hi'].includes(lower)) {
    if (!newContext.userName && context.turnCount <= 3) {
      newContext.userName = text;
    }
  }

  // Detect city
  const cityMatch = text.match(/i live in\s+([A-Za-z]+)/i);
  if (cityMatch && cityMatch[1]) {
    newContext.userCity = cityMatch[1];
  }

  // Detect age
  const ageMatch = text.match(/(\d+)/);
  if (ageMatch && (lower.includes('year') || lower.includes('old') || context.turnCount >= 3)) {
    newContext.userAge = ageMatch[1];
  }

  const name = newContext.userName ? newContext.userName : '';

  // Step-by-step beginner friendly dialog states
  if (context.turnCount === 0 || lower.includes('hello') || lower.includes('hi')) {
    if (lower.includes('good') || lower.includes('fine') || lower.includes('great')) {
      englishText = `That's great! 😊 What is your name?`;
      uzbekText = `Bu juda yaxshi! 😊 Isming nima?`;
      suggestions = [
        { english: 'My name is Jasur.', uzbek: 'Mening ismim Jasur.' },
        { english: 'I am Jasur.', uzbek: 'Men Jasurman.' },
        { english: 'Call me Jasur.', uzbek: 'Meni Jasur deb chaqiring.' },
      ];
      keyVocabulary = [
        { word: 'name', translation: 'ism', pronunciation: '/neɪm/', partOfSpeech: 'noun' },
        { word: 'great', translation: 'juda yaxshi, ajoyib', pronunciation: '/ɡreɪt/', partOfSpeech: 'adjective' },
      ];
    } else {
      englishText = `Hi! 👋 How are you today?`;
      uzbekText = `Salom! 👋 Bugun qalaysan?`;
      suggestions = [
        { english: "I am good.", uzbek: 'Men yaxshiman.' },
        { english: "I'm fine, thanks!", uzbek: 'Yaxshiman, rahmat!' },
        { english: "Not bad.", uzbek: 'Yomon emas.' },
      ];
      keyVocabulary = [
        { word: 'today', translation: 'bugun', pronunciation: '/təˈdeɪ/', partOfSpeech: 'adverb' },
      ];
    }
  } else if (nameMatch || (newContext.userName && context.turnCount === 1)) {
    englishText = `Nice to meet you, ${name}! 😊 Where do you live?`;
    uzbekText = `${name}, tanishganimdan xursandman! 😊 Qayerda yashaysan?`;
    suggestions = [
      { english: 'I live in Tashkent.', uzbek: 'Men Toshkentda yashayman.' },
      { english: 'I live in Samarkand.', uzbek: 'Men Samarqandda yashayman.' },
      { english: 'I live in Uzbekistan.', uzbek: 'Men O\'zbekistonda yashayman.' },
    ];
    keyVocabulary = [
      { word: 'meet', translation: 'uchrashmoq, tanishmoq', pronunciation: '/miːt/', partOfSpeech: 'verb' },
      { word: 'live', translation: 'yashamoq', pronunciation: '/lɪv/', partOfSpeech: 'verb' },
    ];
  } else if (cityMatch || lower.includes('live in') || lower.includes('tashkent') || lower.includes('samarkand')) {
    const city = newContext.userCity || 'there';
    englishText = `Awesome! ${city} is a wonderful place. How old are you?`;
    uzbekText = `Ajoyib! ${city} juda ajoyib joy. Yoshing nechida?`;
    suggestions = [
      { english: 'I am 15 years old.', uzbek: 'Men 15 yoshdaman.' },
      { english: 'I am 18 years old.', uzbek: 'Men 18 yoshdaman.' },
      { english: 'I am 20 years old.', uzbek: 'Men 20 yoshdaman.' },
    ];
    keyVocabulary = [
      { word: 'wonderful', translation: 'ajoyib, a\'lo', pronunciation: '/ˈwʌn.dɚ.fəl/', partOfSpeech: 'adjective' },
      { word: 'old', translation: 'yoshda (yoshga nisbatan)', pronunciation: '/oʊld/', partOfSpeech: 'adjective' },
    ];
  } else if (ageMatch || lower.includes('years old')) {
    englishText = `Nice! Are you a student? 🎒`;
    uzbekText = `Yaxshi! Siz o'quvchimisiz? 🎒`;
    suggestions = [
      { english: 'Yes, I am a student.', uzbek: 'Ha, men o\'quvchiman.' },
      { english: 'Yes, I go to school.', uzbek: 'Ha, men maktabga boraman.' },
      { english: 'No, I work.', uzbek: 'Yo\'q, men ishlayman.' },
    ];
    keyVocabulary = [
      { word: 'student', translation: 'o\'quvchi, talaba', pronunciation: '/ˈstuː.dənt/', partOfSpeech: 'noun' },
      { word: 'school', translation: 'maktab', pronunciation: '/skuːl/', partOfSpeech: 'noun' },
    ];
  } else if (lower.includes('student') || lower.includes('school') || lower.includes('yes, i am') || lower.includes('work')) {
    englishText = `That's cool! What do you like to do for fun? ⚽`;
    uzbekText = `Zo'r! Bo'sh vaqtingda nima qilishni yoqtirasan? ⚽`;
    suggestions = [
      { english: 'I like playing football.', uzbek: 'Futbol o\'ynashni yoqtiraman.' },
      { english: 'I like reading books.', uzbek: 'Kitob o\'qishni yoqtiraman.' },
      { english: 'I like computer games.', uzbek: 'Kompyuter o\'yinlarini yoqtiraman.' },
    ];
    keyVocabulary = [
      { word: 'fun', translation: 'qiziqarli mashg\'ulot, xursandchilik', pronunciation: '/fʌn/', partOfSpeech: 'noun' },
      { word: 'like', translation: 'yoqtirmoq', pronunciation: '/laɪk/', partOfSpeech: 'verb' },
    ];
  } else if (lower.includes('football') || lower.includes('book') || lower.includes('game') || lower.includes('music')) {
    englishText = `I love that too! What is your favorite food? 🍕`;
    uzbekText = `Men ham buni yaxshi ko'raman! Sevimli taoming nima? 🍕`;
    suggestions = [
      { english: 'I love plov.', uzbek: 'Men oshni juda yaxshi ko\'raman.' },
      { english: 'My favorite food is pizza.', uzbek: 'Sevimli taomim pitsa.' },
      { english: 'I like somsa and lagman.', uzbek: 'Somsa va lag\'monni yoqtiraman.' },
    ];
    keyVocabulary = [
      { word: 'favorite', translation: 'sevimli, eng sevimli', pronunciation: '/ˈfeɪ.vər.ət/', partOfSpeech: 'adjective' },
      { word: 'food', translation: 'ovqat, taom', pronunciation: '/fuːd/', partOfSpeech: 'noun' },
    ];
  } else {
    // Default supportive conversational response
    englishText = `Good job! You are speaking English very well! 😊 What would you like to talk about next?`;
    uzbekText = `Barakalla! Siz ingliz tilida juda yaxshi gapiryapsiz! 😊 Keyin nima haqida gaplashamiz?`;
    suggestions = [
      { english: 'Tell me about your day.', uzbek: 'Kuning qanday o\'tganini aytib ber.' },
      { english: 'Let\'s practice more words.', uzbek: 'Keling, yana so\'zlarni mashq qilaylik.' },
      { english: 'I want to learn English!', uzbek: 'Men ingliz tilini o\'rganishni xohlayman!' },
    ];
  }

  const message: BuddyMessage = {
    id: `msg_ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    sender: 'ai',
    englishText,
    uzbekText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    gentleCorrection: correction || undefined,
    suggestions,
    keyVocabulary: keyVocabulary.length > 0 ? keyVocabulary : undefined,
  };

  return {
    message,
    updatedContext: newContext,
  };
}

// Generate simple explanation when user says "I don't understand"
export function generateSimpleExplanation(lastAiMessage: BuddyMessage): BuddyMessage {
  return {
    id: `msg_exp_${Date.now()}`,
    sender: 'ai',
    englishText: `Don't worry! Here is an easy explanation:`,
    uzbekText: `Xavotir olmang! Mana oddiy tushuntirish:`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isExplanation: true,
    suggestions: lastAiMessage.suggestions || [
      { english: 'I understand now! 👍', uzbek: 'Endi tushundim! 👍' },
      { english: 'Thank you!', uzbek: 'Rahmat!' },
    ],
  };
}
