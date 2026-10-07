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
  {
    level: 4,
    name: 'Level 4 — Intermediate (B1)',
    nameUz: '4-daraja — O\'rta daraja (B1)',
    badge: '⚡',
    description: 'Express feelings, abstract opinions, work topics, and complex questions.',
    descriptionUz: 'O\'z fikringizni erkin bayon qilish, ish va hayotiy mavzular.',
  },
  {
    level: 5,
    name: 'Level 5 — Upper-Intermediate (B2)',
    nameUz: '5-daraja — Yuqori o\'rta (B2)',
    badge: '💎',
    description: 'Fluent natural dialogue, roleplays, professional debates, and advanced idioms.',
    descriptionUz: 'Ravon ingliz tili, kasbiy muloqot va murakkab rol ijrolari.',
  },
];

export const BUDDY_TOPICS: BuddyTopic[] = [
  // ================= Level 0 Beginner Topics (FREE) =================
  {
    id: 'greetings',
    level: 0,
    category: 'basic',
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
    category: 'basic',
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
    category: 'basic',
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
    category: 'basic',
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
    category: 'basic',
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
    category: 'basic',
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
    category: 'basic',
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
    category: 'basic',
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

  // ================= 14 REALISTIC PRO ROLEPLAY SITUATIONS =================
  {
    id: 'roleplay-friend',
    level: 1,
    isPro: true,
    category: 'roleplay',
    characterRole: 'New International Friend',
    title: 'Meeting a new friend',
    titleUz: 'Tanishuv va do\'stlashish',
    icon: '👋',
    description: 'Practice meeting someone for the first time at an international youth club.',
    descriptionUz: 'Yangi do\'st orttirish va o\'zingiz haqingizda erkin gapirib berish.',
    initialMessage: {
      english: "Hey there! I just moved to this neighborhood. Mind if I sit here?",
      uzbek: "Salom! Men bu mahallaga endigina ko'chib keldim. Bu yerga o'tirsam maylimi?",
    },
    sampleSuggestions: [
      { english: "Sure, please have a seat!", uzbek: "Albatta, marhamat o'tiring!" },
      { english: "Yes, nice to meet you! My name is...", uzbek: "Ha, tanishganimdan xursandman! Mening ismim..." },
      { english: "Welcome to our city! Where are you from?", uzbek: "Shahrimizga xush kelibsiz! Qayerdansiz?" },
    ],
  },
  {
    id: 'roleplay-school',
    level: 1,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Classmate at Language Academy',
    title: 'School & Classroom',
    titleUz: 'Maktab va o\'qish',
    icon: '🏫',
    description: 'Discuss homework, teachers, and favorite subjects with a classmate.',
    descriptionUz: 'Sinfdosh bilan uy vazifasi va darslar haqida suhbat.',
    initialMessage: {
      english: "Hi! Did you finish our English homework for today's lesson?",
      uzbek: "Salom! Bugungi dars uchun ingliz tili uy vazifasini qilib bo'ldingizmi?",
    },
    sampleSuggestions: [
      { english: "Yes, I finished it yesterday.", uzbek: "Ha, kecha tugatib qo'ygandim." },
      { english: "Almost! Exercise 3 was a bit tricky.", uzbek: "Deyarli! 3-mashq biroz qiyinroq ekan." },
      { english: "Can you help me check my answers?", uzbek: "Javoblarimni tekshirishga yordam bera olasizmi?" },
    ],
  },
  {
    id: 'roleplay-shopping',
    level: 1,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Store Assistant',
    title: 'Shopping',
    titleUz: 'Xarid qilish va do\'kon',
    icon: '🛒',
    description: 'Ask for prices, sizes, and colors in a department store.',
    descriptionUz: 'Do\'konda narx, o\'lcham va kiyim tanlash bo\'yicha muloqot.',
    initialMessage: {
      english: "Hello! Welcome to our store. Are you looking for anything specific today?",
      uzbek: "Assalomu alaykum! Do'konimizga xush kelibsiz. Bugun biron aniq narsa qidiryapsizmi?",
    },
    sampleSuggestions: [
      { english: "Hi, I'm looking for a warm jacket.", uzbek: "Salom, men issiq kurtka qidirayotgan edim." },
      { english: "Do you have this in a medium size?", uzbek: "Buning 'Medium' o'lchami bormi?" },
      { english: "How much does this cost?", uzbek: "Bu qancha turadi?" },
    ],
  },
  {
    id: 'roleplay-restaurant',
    level: 1,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Friendly Waiter',
    title: 'Restaurant',
    titleUz: 'Restoran va taom buyurtma qilish',
    icon: '🍔',
    description: 'Order food, ask about the menu, and request the check.',
    descriptionUz: 'Taom buyurtma qilish, menyu so\'rash va hisob-kitob qilish.',
    initialMessage: {
      english: "Good evening! Welcome. Are you ready to order, or do you need a few more minutes?",
      uzbek: "Xayrli kech! Xush kelibsiz. Buyurtma berishga tayyormisiz yoki yana bir necha daqiqa kerakmi?",
    },
    sampleSuggestions: [
      { english: "I am ready to order, thank you.", uzbek: "Men buyurtma berishga tayyorman, rahmat." },
      { english: "What do you recommend as the house special?", uzbek: "Ushbu restoranning eng mashhur taomi nima?" },
      { english: "Could I have a bottle of water, please?", uzbek: "Bitta suv bera olasizmi, iltimos?" },
    ],
  },
  {
    id: 'roleplay-airport',
    level: 2,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Airport Check-in Agent',
    title: 'Airport',
    titleUz: 'Aeroport va parvoz',
    icon: '✈️',
    description: 'Check in for your flight, handle boarding passes, and passport control.',
    descriptionUz: 'Ro\'yxatdan o\'tish, pasport nazorati va samolyotga chiqish.',
    initialMessage: {
      english: "Good day! May I see your passport and flight booking confirmation, please?",
      uzbek: "Xayrli kun! Pasportingiz va chipta broningizni ko'rsata olasizmi, iltimos?",
    },
    sampleSuggestions: [
      { english: "Here is my passport and boarding confirmation.", uzbek: "Mana mening pasportim va chipta tasdig'im." },
      { english: "Could I please get a window seat?", uzbek: "Iltimos, deraza oldidagi o'rindiqni bera olasizmi?" },
      { english: "Which gate does this flight depart from?", uzbek: "Ushbu reys qaysi chiqish (gate) darvozasidan jo'naydi?" },
    ],
  },
  {
    id: 'roleplay-hotel',
    level: 2,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Hotel Receptionist',
    title: 'Hotel',
    titleUz: 'Mehmonxona va xona band qilish',
    icon: '🏨',
    description: 'Check into a hotel, ask about Wi-Fi, breakfast hours, and amenities.',
    descriptionUz: 'Mehmonxonaga joylashish, nonushta vaqti va xizmatlar haqida so\'rash.',
    initialMessage: {
      english: "Welcome to Grand Central Hotel! Do you have a reservation with us?",
      uzbek: "Grand Central mehmonxonasiga xush kelibsiz! Bizda oldindan band qilingan xonangiz bormi?",
    },
    sampleSuggestions: [
      { english: "Yes, I have a reservation under my name.", uzbek: "Ha, mening nomimga oldindan band qilingan." },
      { english: "What time is breakfast served in the morning?", uzbek: "Ertalab nonushta qaysi vaqtda beriladi?" },
      { english: "Could you tell me the Wi-Fi password?", uzbek: "Wi-Fi parolini aytib yubora olasizmi?" },
    ],
  },
  {
    id: 'roleplay-doctor',
    level: 2,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Caring Physician',
    title: 'Doctor',
    titleUz: 'Shifokor qabulida va salomatlik',
    icon: '🏥',
    description: 'Describe physical symptoms, allergies, and understand medicine prescriptions.',
    descriptionUz: 'Shikoyatlarni tushuntirish va dori-darmon tavsiyalarini tushunish.',
    initialMessage: {
      english: "Hello! Come in and take a seat. What symptoms have been troubling you recently?",
      uzbek: "Salom! Kiring va o'tiring. Yaqinda qanday alomatlar yoki bezovtaliklar sizni bezovta qildi?",
    },
    sampleSuggestions: [
      { english: "I have had a bad headache and a sore throat.", uzbek: "Menda qattiq bosh og'rig'i va tomoq og'rig'i bor." },
      { english: "I've been feeling dizzy since yesterday morning.", uzbek: "Kecha ertalabdan beri boshim aylanmoqda." },
      { english: "How often should I take this medication?", uzbek: "Bu dorini kuniga necha marta ichishim kerak?" },
    ],
  },
  {
    id: 'roleplay-job-interview',
    level: 3,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Hiring Manager',
    title: 'Job interview',
    titleUz: 'Ish suhbati va kasb',
    icon: '💼',
    description: 'Present your strengths, experience, education, and career motivations.',
    descriptionUz: 'O\'z tajribangiz, kuchli tomonlaringiz va maqsadlaringizni ifodalash.',
    initialMessage: {
      english: "Welcome to our interview! To begin, could you tell me a little about yourself and your background?",
      uzbek: "Suhbatimizga xush kelibsiz! Boshlash uchun, o'zingiz va tajribangiz haqida qisqacha aytib bera olasizmi?",
    },
    sampleSuggestions: [
      { english: "I am a dedicated professional with a passion for learning new skills.", uzbek: "Men yangi ko'nikmalarni o'rganishga ishtiyoqli va mas'uliyatli mutaxassisman." },
      { english: "I have experience working in team projects and problem solving.", uzbek: "Menda jamoaviy loyihalarda ishlash va muammolarni hal qilish tajribasi bor." },
      { english: "I am excited about this opportunity because...", uzbek: "Men ushbu imkoniyatdan juda xursandman, chunki..." },
    ],
  },
  {
    id: 'roleplay-gaming',
    level: 2,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Online Co-op Gamer',
    title: 'Gaming',
    titleUz: 'Video o\'yinlar va kompyuter',
    icon: '🎮',
    description: 'Coordinate game strategies, talk about favorite multiplayer and mobile games.',
    descriptionUz: 'Sevimli video o\'yinlar, strategiyalar va do\'stlar bilan o\'ynash.',
    initialMessage: {
      english: "Yo! Ready for the next round? What role or character do you want to play?",
      uzbek: "Salom! Keyingi raundga tayyormisan? Qaysi rolni yoki qahramonni tanlamoqchisan?",
    },
    sampleSuggestions: [
      { english: "I'll play defense this round, cover my back!", uzbek: "Bu safar men himoyada o'ynayman, orqamdan qarab tur!" },
      { english: "What games do you usually play on PC or mobile?", uzbek: "Odatda kompyuterda yoki telefonda qaysi o'yinlarni o'ynaysan?" },
      { english: "That was an epic match, good game!", uzbek: "Bu ajoyib o'yin bo'ldi, zo'r o'ynadik!" },
    ],
  },
  {
    id: 'roleplay-tech',
    level: 3,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Tech Enthusiast & Developer',
    title: 'Technology',
    titleUz: 'Zamonaviy texnologiyalar va IT',
    icon: '💻',
    description: 'Discuss artificial intelligence, smartphones, programming, and future gadgets.',
    descriptionUz: 'Sun\'iy intellekt, smartfonlar va zamonaviy IT yangiliklari haqida.',
    initialMessage: {
      english: "Technology is moving so fast! What do you think is the most exciting tech advancement right now?",
      uzbek: "Texnologiya juda tez rivojlanmoqda! Hozirgi paytda eng hayratlanarli texnologik yangilik nima deb o'ylaysan?",
    },
    sampleSuggestions: [
      { english: "I think artificial intelligence is completely changing education.", uzbek: "Menimcha, sun'iy intellekt ta'limni tubdan o'zgartirmoqda." },
      { english: "Smartphones and fast internet make everyday life so convenient.", uzbek: "Smartfonlar va tezkor internet kundalik hayotni juda qulay qildi." },
      { english: "I am interested in learning coding and web development.", uzbek: "Men dasturlash va veb-sayt yaratishni o'rganishga qiziqaman." },
    ],
  },
  {
    id: 'roleplay-travel',
    level: 2,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Local City Tour Guide',
    title: 'Travel',
    titleUz: 'Sayohat va yangi shaharlar',
    icon: '🌍',
    description: 'Explore famous monuments, ask for local directions, and discover local culture.',
    descriptionUz: 'Tarixiy joylar, yo\'l so\'rash va turizm haqida muloqot.',
    initialMessage: {
      english: "Hello traveler! Welcome to our historic city square. Have you visited our main museum yet?",
      uzbek: "Salom sayohatchi! Qadimiy shahar maydonimizga xush kelibsiz. Asosiy muzeyimizga borib ko'rdingizmi?",
    },
    sampleSuggestions: [
      { english: "Not yet! Could you show me the best way to get there?", uzbek: "Hali yo'q! U yerga borishning eng yaxshi yo'lini ko'rsata olasizmi?" },
      { english: "What traditional landmarks should I not miss?", uzbek: "Qaysi milliy obidalarni albatta ko'rishim kerak?" },
      { english: "I love exploring local architecture and food.", uzbek: "Men mahalliy me'morchilik va taomlarni o'rganishni yaxshi ko'raman." },
    ],
  },
  {
    id: 'roleplay-cafe',
    level: 1,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Artisan Barista',
    title: 'Cafe',
    titleUz: 'Qahvaxonada buyurtma berish',
    icon: '☕',
    description: 'Order your morning coffee, tea, pastries, and request milk preferences.',
    descriptionUz: 'Qahva, choy va shirinliklar buyurtma qilish.',
    initialMessage: {
      english: "Morning! What kind of coffee or warm drink can I get started for you today?",
      uzbek: "Xayrli tong! Bugun siz uchun qanday qahva yoki issiq ichimlik tayyorlab beray?",
    },
    sampleSuggestions: [
      { english: "Can I get an iced caramel latte with oat milk?", uzbek: "Muzli karamel latte bera olasizmi, suli suti bilan?" },
      { english: "A hot green tea and a chocolate croissant, please.", uzbek: "Bitta issiq ko'k choy va shokoladli kruassan, iltimos." },
      { english: "Can I take this to go, please?", uzbek: "Buni o'zim bilan olib ketishim mumkinmi?" },
    ],
  },
  {
    id: 'roleplay-transport',
    level: 1,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Transit Station Agent',
    title: 'Transport',
    titleUz: 'Jamoat transporti va yo\'nalish',
    icon: '🚌',
    description: 'Buy bus and metro tickets, ask for schedules, and navigate bus stops.',
    descriptionUz: 'Avtobus, metro chiptasi olish va bekatlarni so\'rash.',
    initialMessage: {
      english: "Ticket desk here. Where are you heading today, and do you need a single or return ticket?",
      uzbek: "Chipta kassasi. Bugun qayerga bormoqchisiz, bir martalik yoki borib-kelish chiptasi kerakmi?",
    },
    sampleSuggestions: [
      { english: "One ticket to the city center, please.", uzbek: "Shahar markaziga bitta chipta, iltimos." },
      { english: "Which bus goes directly to the train station?", uzbek: "Qaysi avtobus to'g'ri temir yo'l vokzaliga boradi?" },
      { english: "How often do the trains run on this line?", uzbek: "Bu yo'nalishda poyezdlar har qancha vaqtda yuradi?" },
    ],
  },
  {
    id: 'roleplay-daily-life',
    level: 1,
    isPro: true,
    category: 'roleplay',
    characterRole: 'Roommate / Close Friend',
    title: 'Daily life',
    titleUz: 'Kundalik hayot va uy yumushlari',
    icon: '🏠',
    description: 'Chat about daily routines, morning habits, cooking, and chores.',
    descriptionUz: 'Kun tartibi, ertalabki odatlar va kundalik vazifalar.',
    initialMessage: {
      english: "Hey! What's your plan for the rest of today? Any chores or cooking to do?",
      uzbek: "Salom! Bugungi kunning qolgan qismiga qanday rejalaring bor? Biron yumush yoki ovqat pishirish bormi?",
    },
    sampleSuggestions: [
      { english: "I need to clean my room and finish my study tasks.", uzbek: "Xonamni tozalab, dars vazifalarimni tugatishim kerak." },
      { english: "I'm going to cook dinner in an hour. Want to join?", uzbek: "Bir soatdan keyin kechki ovqat pishirmoqchiman. Qo'shilasanmi?" },
      { english: "Just relaxing and watching a movie tonight.", uzbek: "Bugun kechqurun shunchaki dam olib kino ko'rmoqchiman." },
    ],
  },
];

// Helper: check for common beginner mistakes and return gentle correction
export function checkGentleCorrection(userInput: string): BuddyCorrection | null {
  const clean = userInput.trim().toLowerCase();

  // "i go to school yesterday" -> "I went to school yesterday" (Past tense with yesterday/last...)
  if (/\b(?:i|we|they|he|she)\s+go\b.*?\b(?:yesterday|last\s+\w+|ago)\b/i.test(clean) ||
      /\b(?:yesterday|last\s+\w+|ago)\b.*?\b(?:i|we|they|he|she)\s+go\b/i.test(clean)) {
    const corrected = userInput
      .replace(/\bi go\b/gi, 'I went')
      .replace(/\bhe go\b/gi, 'He went')
      .replace(/\bshe go\b/gi, 'She went')
      .replace(/\bwe go\b/gi, 'We went')
      .replace(/\bthey go\b/gi, 'They went');
    return {
      original: userInput,
      corrected: corrected.charAt(0).toUpperCase() + corrected.slice(1),
      correctedUz: "Men kecha maktabga bordim.",
      motivation: "Good try! There is one small mistake.",
      explanationUz: '"Yesterday" o\'tgan vaqtni bildiradi, shuning uchun "go" o\'rniga "went" ishlatamiz.',
      repeatPrompt: "Can you say it again?",
    };
  }

  // "i see him yesterday"
  if (/\bi\s+see\b.*?\b(?:yesterday|last\s+\w+)\b/i.test(clean)) {
    const corrected = userInput.replace(/\bi see\b/gi, 'I saw');
    return {
      original: userInput,
      corrected: corrected.charAt(0).toUpperCase() + corrected.slice(1),
      correctedUz: "Men uni kecha ko'rdim.",
      motivation: "Good try! 🌟 Almost there.",
      explanationUz: 'O\'tgan zamonda "see" fe\'li "saw" shakliga o\'zgaradi.',
      repeatPrompt: "Try saying it again!",
    };
  }

  // "i am agree" -> "I agree"
  if (/\bi am agree\b/i.test(clean)) {
    return {
      original: userInput,
      corrected: "I agree.",
      correctedUz: "Men qo'shilaman.",
      motivation: "Nice effort! 👍",
      explanationUz: '"Agree" o\'zi fe\'l hisoblanadi, shuning uchun "am" qo\'yilmaydi ("I agree").',
      repeatPrompt: "Can you say it again?",
    };
  }

  // "i good" or "i fine" -> "I am good"
  if (/^i\s+(good|fine|happy|tired|sad|ok|okay)$/i.test(clean)) {
    const adj = clean.replace('i ', '');
    return {
      original: userInput,
      corrected: `I am ${adj}.`,
      correctedUz: `Men ${adj === 'good' || adj === 'fine' ? 'yaxshiman' : adj}.`,
      motivation: "Good try! 🌟",
      explanationUz: '"I" dan keyin "am" yordamchi fe\'li ishlatiladi (Masalan: "I am good").',
      repeatPrompt: "Can you say it again?",
    };
  }

  // "my name jasur" -> "My name is Jasur"
  if (/^my name\s+[a-z]+/i.test(clean) && !clean.includes(' is ') && !clean.includes("'s")) {
    const parts = userInput.trim().split(/\s+/);
    const name = parts.slice(2).join(' ');
    return {
      original: userInput,
      corrected: `My name is ${name}.`,
      correctedUz: `Mening ismim ${name}.`,
      motivation: "Nice attempt! 👏",
      explanationUz: '"My name" dan keyin "is" so\'zi qo\'yiladi (Masalan: "My name is...").',
      repeatPrompt: "Try saying it again!",
    };
  }

  // "i live tashkent" -> "I live in Tashkent"
  if (/^i live\s+[a-z]+/i.test(clean) && !clean.includes(' in ')) {
    const city = userInput.trim().replace(/^i live\s+/i, '');
    return {
      original: userInput,
      corrected: `I live in ${city}.`,
      correctedUz: `Men ${city}da yashayman.`,
      motivation: "Good try! 😊",
      explanationUz: 'Shahar yoki davlat oldidan "in" qo\'shimchasi qo\'yiladi ("I live in...").',
      repeatPrompt: "Can you say it again?",
    };
  }

  // "i 15 years old" -> "I am 15 years old"
  if (/^i\s+\d+\s*(years old)?$/i.test(clean)) {
    const num = clean.replace(/[^0-9]/g, '');
    return {
      original: userInput,
      corrected: `I am ${num} years old.`,
      correctedUz: `Men ${num} yoshdaman.`,
      motivation: "Almost correct! 🌟",
      explanationUz: 'Yoshni aytganda "I am..." deb aytiladi ("I am 15 years old").',
      repeatPrompt: "Try saying it again!",
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
