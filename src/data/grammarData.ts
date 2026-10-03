import { GrammarTopic } from '../types/grammar';

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'present-simple',
    title: 'Present Simple',
    category: 'Tenses',
    level: 'Beginner (A1)',
    summaryUz: 'Oddiy hozirgi zamon: doimiy odatlar, kundalik ishlar va umumiy haqiqatlar uchun ishlatiladi.',
    formula: 'Positive: S + V1 (he/she/it + s/es) | Negative: S + don\'t / doesn\'t + V1 | Question: Do / Does + S + V1?',
    rules: [
      {
        title: 'Kundalik odatlar (Habits & Routines)',
        explanation: 'Used for actions that happen regularly or repeatedly.',
        explanationUz: 'Doimiy ravishda, har kuni yoki odat tusiga kirgan takrorlanuvchi ish-harakatlar uchun ishlatiladi.',
        examples: [
          { en: 'I drink coffee every morning.', uz: 'Men har tong kofe ichaman.' },
          { en: 'He plays tennis on Saturdays.', uz: 'U shanba kunlari tennis o\'ynaydi.' },
        ],
      },
      {
        title: 'Umumiy haqiqatlar va tabiat qonunlari (General Truths)',
        explanation: 'Facts that are always true.',
        explanationUz: 'O\'zgarmas ilmiy faktlar va tabiat qonunlari uchun.',
        examples: [
          { en: 'The sun rises in the east.', uz: 'Quyosh sharqdan chiqadi.' },
          { en: 'Water boils at 100 degrees Celsius.', uz: 'Suv 100 darajada qaynaydi.' },
        ],
      },
      {
        title: 'Uchinchi shaxs qoidasi (He / She / It)',
        explanation: 'Add -s or -es to the verb in affirmative sentences for he/she/it.',
        explanationUz: 'Darak gaplarda he, she, it olmoshlari bilan fe\'lga -s yoki -es qo\'shimchasi qo\'shiladi.',
        examples: [
          { en: 'She works at an international school.', uz: 'U xalqaro maktabda ishlaydi.' },
          { en: 'He watches educational videos.', uz: 'U ta\'limiy videolarni tomosha qiladi.' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'He like apples.',
        correction: 'He likes apples.',
        note: '3-shaxs birlikda (he/she/it) fe\'lga -s qo\'shiladi.',
      },
      {
        mistake: 'She doesn\'t likes tea.',
        correction: 'She doesn\'t like tea.',
        note: 'doesn\'t yordamchi fe\'lidan keyin asosiy fe\'lga -s qo\'shilmaydi.',
      },
    ],
    quiz: [
      {
        id: 'ps-1',
        prompt: 'Farxod ___ English every single day.',
        options: ['study', 'studies', 'studying', 'studied'],
        correctAnswer: 'studies',
        explanation: 'With singular third-person subjects (Farxod = he), we add -ies to verbs ending in consonant + y.',
        explanationUz: 'Farxod (he) bo\'lgani uchun fe\'lga -ies qo\'shiladi (study -> studies).',
      },
      {
        id: 'ps-2',
        prompt: 'They ___ in a big apartment in the city center.',
        options: ['live', 'lives', 'living', 'are live'],
        correctAnswer: 'live',
        explanation: 'With plural subject "they", use the base form of the verb "live".',
        explanationUz: '"They" olmoshi bilan fe\'l o\'zining asosiy shaklida (live) keladi.',
      },
      {
        id: 'ps-3',
        prompt: '___ your sister work on weekends?',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Does',
        explanation: 'With third-person singular "your sister" (she), questions in Present Simple use "Does".',
        explanationUz: '"Your sister" (she) uchun savol "Does" bilan boshlanadi.',
      },
    ],
  },
  {
    id: 'present-continuous',
    title: 'Present Continuous',
    category: 'Tenses',
    level: 'Beginner (A1)',
    summaryUz: 'Hozirgi davomli zamon: aynan ayni daqiqada (nutq paytida) sodir bo\'layotgan ish-harakatlar.',
    formula: 'Positive: S + am / is / are + V-ing | Negative: S + am / is / are + not + V-ing | Question: Am / Is / Are + S + V-ing?',
    rules: [
      {
        title: 'Nutq paytida sodir bo\'layotgan harakat (Action Now)',
        explanation: 'Actions happening right now at the moment of speaking.',
        explanationUz: 'Aynan ayni paytda davom etayotgan ish-harakatlar (now, right now, at the moment).',
        examples: [
          { en: 'I am reading a very interesting article now.', uz: 'Men hozir juda qiziq maqola o\'qiyapman.' },
          { en: 'They are preparing dinner in the kitchen.', uz: 'Ular oshxonada kechki ovqat tayyorlashmoqda.' },
        ],
      },
      {
        title: 'Vaqtinchalik holatlar (Temporary Situations)',
        explanation: 'Actions that are temporary around the present time.',
        explanationUz: 'Hozirgi davrda vaqtinchalik sodir bo\'layotgan holatlar (these days, this week).',
        examples: [
          { en: 'He is staying with his friend this week.', uz: 'U bu hafta do\'stinikida yashab turibdi.' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'I am knowing the answer.',
        correction: 'I know the answer.',
        note: 'Stative fe\'llar (know, like, want, understand) Continuous zamonda ishlatilmaydi.',
      },
      {
        mistake: 'She cooking lunch right now.',
        correction: 'She is cooking lunch right now.',
        note: 'To be (am/is/are) fe\'lini tushirib qoldirmang.',
      },
    ],
    quiz: [
      {
        id: 'pc-1',
        prompt: 'Look! The children ___ in the playground.',
        options: ['play', 'are playing', 'is playing', 'plays'],
        correctAnswer: 'are playing',
        explanation: '"Look!" indicates action happening right now with plural "children", so use "are playing".',
        explanationUz: '"Look!" ayni damdagi harakatni bildiradi, "children" (ko\'plik) bo\'lgani uchun "are playing".',
      },
      {
        id: 'pc-2',
        prompt: 'She ___ listening to music, she is doing her homework.',
        options: ['isn\'t', 'doesn\'t', 'not', 'aren\'t'],
        correctAnswer: 'isn\'t',
        explanation: 'Negative Present Continuous for "she" uses "is not" (isn\'t).',
        explanationUz: 'Present Continuous da inkor shakl "she isn\'t" orqali yasaladi.',
      },
      {
        id: 'pc-3',
        prompt: '___ you writing an email right now?',
        options: ['Do', 'Are', 'Is', 'Have'],
        correctAnswer: 'Are',
        explanation: 'Questions for "you" in Present Continuous start with "Are".',
        explanationUz: '"You" uchun savol "Are you + V-ing?" shaklida bo\'ladi.',
      },
    ],
  },
  {
    id: 'past-simple',
    title: 'Past Simple',
    category: 'Tenses',
    level: 'Beginner (A1)',
    summaryUz: 'O\'tgan zamon: o\'tmishda aniq vaqtda sodir bo\'lib tugallangan ish-harakatlar.',
    formula: 'Positive: S + V2 / V-ed | Negative: S + didn\'t + V1 | Question: Did + S + V1?',
    rules: [
      {
        title: 'Tugallangan o\'tmish harakatlari (Completed Past Actions)',
        explanation: 'Actions that started and finished in the past at a specific time.',
        explanationUz: 'O\'tmishda aniq vaqtda (yesterday, last night, two days ago, in 2020) sodir bo\'lib tugagan harakatlar.',
        examples: [
          { en: 'We visited the historic Registan square in Samarkand yesterday.', uz: 'Biz kecha Samarqanddagi tarixiy Registon maydonini ziyorat qildik.' },
          { en: 'He bought a new laptop last Friday.', uz: 'U o\'tgan juma yangi noutbuk sotib oldi.' },
        ],
      },
      {
        title: 'To\'g\'ri va Noto\'g\'ri fe\'llar (Regular & Irregular Verbs)',
        explanation: 'Regular verbs add -ed (walk -> walked). Irregular verbs change completely (go -> went, write -> wrote).',
        explanationUz: 'To\'g\'ri fe\'llarga -ed qo\'shiladi (work -> worked), noto\'g\'ri fe\'llarning esa V2 shakli ishlatiladi (see -> saw).',
        examples: [
          { en: 'She walked to school.', uz: 'U maktabga piyoda bordi.' },
          { en: 'I saw my favorite teacher.', uz: 'Men sevimli o\'qituvchimni ko\'rdim.' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'I didn\'t went to the market.',
        correction: 'I didn\'t go to the market.',
        note: 'didn\'t yordamchi fe\'lidan keyin fe\'lning 1-shakli (V1) qo\'yiladi.',
      },
      {
        mistake: 'Did you saw him?',
        correction: 'Did you see him?',
        note: '"Did" bo\'lgani uchun fe\'l V1 shakliga qaytadi: see.',
      },
    ],
    quiz: [
      {
        id: 'pst-1',
        prompt: 'Yesterday, Jasur ___ a long email to his university professor.',
        options: ['write', 'wrote', 'written', 'writing'],
        correctAnswer: 'wrote',
        explanation: 'Past Simple of the irregular verb "write" is "wrote".',
        explanationUz: '"Write" fe\'lining o\'tgan zamon (V2) shakli "wrote" bo\'ladi.',
      },
      {
        id: 'pst-2',
        prompt: 'We ___ enjoy the noisy movie at the cinema.',
        options: ['didn\'t', 'don\'t', 'wasn\'t', 'weren\'t'],
        correctAnswer: 'didn\'t',
        explanation: 'Negative Past Simple with regular and irregular verbs uses "didn\'t + V1".',
        explanationUz: 'Past Simple da inkor shakl "didn\'t + V1" orqali yasaladi.',
      },
      {
        id: 'pst-3',
        prompt: 'Where ___ you go on your summer holiday?',
        options: ['did', 'do', 'were', 'have'],
        correctAnswer: 'did',
        explanation: 'Questions in Past Simple use "did + subject + V1".',
        explanationUz: 'O\'tgan zamon savolida "did" yordamchi fe\'li ishlatiladi.',
      },
    ],
  },
  {
    id: 'past-continuous',
    title: 'Past Continuous',
    category: 'Tenses',
    level: 'Elementary (A2)',
    summaryUz: 'O\'tgan davomli zamon: o\'tmishdagi ma\'lum bir vaqtda davom etayotgan bo\'lgan ish-harakatlar.',
    formula: 'Positive: S + was / were + V-ing | Negative: S + was / were + not + V-ing | Question: Was / Were + S + V-ing?',
    rules: [
      {
        title: 'O\'tmishdagi aniq vaqtdagi davom etayotgan harakat',
        explanation: 'Action in progress at a specific moment in the past.',
        explanationUz: 'O\'tmishda ma\'lum bir soatda (masalan, kecha soat 8 da) davom etayotgan harakat.',
        examples: [
          { en: 'At 8 PM yesterday, I was studying for the grammar exam.', uz: 'Kecha kechki soat 8 da men grammatika imtihoniga tayyorlanayotgan edim.' },
        ],
      },
      {
        title: 'Boshqa qisqa harakat tomonidan to\'xtatilgan harakat (When / While)',
        explanation: 'A longer ongoing action interrupted by a shorter action in Past Simple.',
        explanationUz: 'Uzoq davom etayotgan harakat (Past Continuous) paytida to\'satdan qisqa harakat (Past Simple) sodir bo\'lishi.',
        examples: [
          { en: 'I was sleeping when the phone suddenly rang.', uz: 'Telefon to\'satdan jiringlaganda men uxlayotgan edim.' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'They was walking in the park.',
        correction: 'They were walking in the park.',
        note: '"They", "we", "you" bilan "were" ishlatiladi.',
      },
    ],
    quiz: [
      {
        id: 'pcont-1',
        prompt: 'While my mother was cooking, I ___ my room.',
        options: ['was cleaning', 'cleaned', 'clean', 'am cleaning'],
        correctAnswer: 'was cleaning',
        explanation: 'Two parallel continuous actions in the past both use Past Continuous.',
        explanationUz: '"While" bilan ikki parallel o\'tgan davomli harakatda "was cleaning" ishlatiladi.',
      },
      {
        id: 'pcont-2',
        prompt: 'What ___ you doing at 10 PM last night?',
        options: ['were', 'was', 'did', 'are'],
        correctAnswer: 'were',
        explanation: 'Subject "you" requires "were" in Past Continuous.',
        explanationUz: '"You" olmoshi bilan "were" ishlatiladi: What were you doing?',
      },
    ],
  },
  {
    id: 'present-perfect',
    title: 'Present Perfect',
    category: 'Tenses',
    level: 'Elementary (A2)',
    summaryUz: 'Hozirgi tugallangan zamon: natijasi hozirgi kunda ko\'rinib turgan yoki tajribani ifodalovchi zamon.',
    formula: 'Positive: S + have / has + V3 | Negative: S + have / has + not + V3 | Question: Have / Has + S + V3?',
    rules: [
      {
        title: 'Hayotiy tajriba (Life Experience: Ever, Never)',
        explanation: 'Talking about experiences up to now without mentioning specific past time.',
        explanationUz: 'Hayotingiz davomida biror ishni qilgan yoki qilmaganligingizni ifodalashda.',
        examples: [
          { en: 'Have you ever been to London?', uz: 'Siz hech Londonda bo\'lganmisiz?' },
          { en: 'I have never tried skydiving.', uz: 'Men hech qachon parashyutdan sakrashni sinab ko\'rmaganman.' },
        ],
      },
      {
        title: 'Hozirgi paytga bog\'liq natija (Result in the Present: Just, Already, Yet)',
        explanation: 'An action completed recently that has a clear consequence right now.',
        explanationUz: 'Yaqinda yakunlangan va natijasi ayni damda muhim bo\'lgan harakatlar.',
        examples: [
          { en: 'I have lost my passport (so I cannot travel now).', uz: 'Men pasportimni yo\'qotib qo\'ydim (hozir sayohat qilolmayman).' },
          { en: 'She has already finished the project.', uz: 'U loyihani allaqachon tugatdi.' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'I have seen him yesterday.',
        correction: 'I saw him yesterday.',
        note: '"Yesterday", "ago", "in 2018" kabi aniq o\'tgan vaqt bilan Present Perfect emas, Past Simple ishlatiladi.',
      },
    ],
    quiz: [
      {
        id: 'pp-1',
        prompt: 'She ___ already learned fifty new irregular verbs this week.',
        options: ['has', 'have', 'is', 'did'],
        correctAnswer: 'has',
        explanation: 'Third-person singular "she" takes "has + V3".',
        explanationUz: '"She" bilan "has" ishlatiladi.',
      },
      {
        id: 'pp-2',
        prompt: 'Have you ___ eaten traditional Uzbek samsa?',
        options: ['ever', 'never', 'already', 'yet'],
        correctAnswer: 'ever',
        explanation: 'Questions about life experience typically use "ever".',
        explanationUz: 'Hayotiy tajriba haqidagi savollarda "ever" ishlatiladi.',
      },
    ],
  },
  {
    id: 'future-forms',
    title: 'Future (Will vs Going to)',
    category: 'Tenses',
    level: 'Beginner (A1)',
    summaryUz: 'Kelasi zamon: kutilmagan qarorlar va bashoratlarda "will", oldindan rejalashtirilgan ishlarda "be going to".',
    formula: 'Will: S + will + V1 | Going to: S + am/is/are + going to + V1',
    rules: [
      {
        title: 'Spontaneous Decision (Shu lahzada qabul qilingan qaror) — Will',
        explanation: 'Deciding to do something at the moment of speaking.',
        explanationUz: 'Nutq paytida to\'satdan qabul qilingan qarorlar.',
        examples: [
          { en: 'The phone is ringing. I will answer it!', uz: 'Telefon jiringlayapti. Men javob beraman!' },
        ],
      },
      {
        title: 'Prior Plan & Intention (Oldindan rejalashtirilgan maqsad) — Be Going To',
        explanation: 'A plan or decision made before the moment of speaking.',
        explanationUz: 'Oldindan o\'ylangan, rejalashtirilgan niyat va maqsadlar.',
        examples: [
          { en: 'We are going to visit Bukhara next month.', uz: 'Biz keyingi oyda Buxoroga sayohat qilmoqchimiz (rejalashtirganmiz).' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'I will going to study.',
        correction: 'I am going to study. OR I will study.',
        note: '"will" va "going to" birga qo\'shib ishlatilmaydi.',
      },
    ],
    quiz: [
      {
        id: 'fut-1',
        prompt: 'Look at those dark clouds! It ___ rain.',
        options: ['is going to', 'will', 'goes to', 'shall'],
        correctAnswer: 'is going to',
        explanation: 'Predictions based on present evidence (dark clouds) use "be going to".',
        explanationUz: 'Hozirgi ko\'rinib turgan dalilga (qora bulutlar) asoslangan bashoratda "is going to" ishlatiladi.',
      },
      {
        id: 'fut-2',
        prompt: 'Don\'t worry about the heavy bags, I ___ carry them for you.',
        options: ['will', 'am going to', 'am', 'do'],
        correctAnswer: 'will',
        explanation: 'Spontaneous offer made at the moment of speaking uses "will".',
        explanationUz: 'Shu daqiqadagi yordam taklifi uchun "will" ishlatiladi.',
      },
    ],
  },
  {
    id: 'modals-can-could',
    title: 'Can / Could',
    category: 'Modals',
    level: 'Beginner (A1)',
    summaryUz: 'Qobiliyat (ability), iltimos (request) va ruxsat (permission) bildirish uchun modal fe\'llar.',
    formula: 'Positive: S + can/could + V1 | Negative: S + cannot / couldn\'t + V1 | Question: Can / Could + S + V1?',
    rules: [
      {
        title: 'Qobiliyat va ko\'nikma (Ability)',
        explanation: 'can = present ability; could = past ability.',
        explanationUz: 'Hozirgi qobiliyat uchun can, o\'tmishdagi qobiliyat uchun could.',
        examples: [
          { en: 'He can speak three foreign languages fluently.', uz: 'U uchta xorijiy tilda ravon gapira oladi.' },
          { en: 'When she was six, she could swim like a fish.', uz: 'U olti yoshligida baliqdek suza olardi.' },
        ],
      },
      {
        title: 'Xushmuomala iltimos (Polite Request)',
        explanation: 'Could is more formal and polite than Can.',
        explanationUz: 'Could Can ga qaraganda ancha muloyim va rasmiy iltimos hisoblanadi.',
        examples: [
          { en: 'Could you please pass me the dictionary?', uz: 'Iltimos, menga lug\'atni uzatib yubora olasizmi?' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'He can to swim.',
        correction: 'He can swim.',
        note: 'Modal fe\'llardan (can, could, must) keyin "to" zarrachasi qo\'yilmaydi.',
      },
    ],
    quiz: [
      {
        id: 'cc-1',
        prompt: 'My brother ___ play the piano when he was only five years old.',
        options: ['could', 'can', 'was able', 'could to'],
        correctAnswer: 'could',
        explanation: 'Past general ability uses "could".',
        explanationUz: 'O\'tmishdagi qobiliyat uchun "could" ishlatiladi.',
      },
    ],
  },
  {
    id: 'modals-must-have-to',
    title: 'Must / Have to',
    category: 'Modals',
    level: 'Elementary (A2)',
    summaryUz: 'Majburiyat va zaruriyat (obligation & necessity).',
    formula: 'Must: S + must + V1 | Have to: S + have / has to + V1',
    rules: [
      {
        title: 'Ichki va kuchli majburiyat (Must)',
        explanation: 'Speaker feels something is necessary; rules or laws.',
        explanationUz: 'Gapiruvchining o\'z xohish-irodasi yoki qat\'iy qonun-qoidalar.',
        examples: [
          { en: 'You must fasten your seatbelt in the car.', uz: 'Mashinada xavfsizlik kamarini taqishingiz shart.' },
        ],
      },
      {
        title: 'Tashqi majburiyat (Have to)',
        explanation: 'External rule, company policy, or timetable.',
        explanationUz: 'Tashqi vaziyat, maktab yoki ishxona qoidalari taqozosi.',
        examples: [
          { en: 'Doctors have to wear white coats at the hospital.', uz: 'Shifokorlar shifoxonada oq xalat kiyishlari shart.' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'You mustn\'t come if you are tired.',
        correction: 'You don\'t have to come if you are tired.',
        note: 'mustn\'t = taqiqlangan (prohibited); don\'t have to = shart emas, ixtiyoriy.',
      },
    ],
    quiz: [
      {
        id: 'mh-1',
        prompt: 'Tomorrow is Sunday, so I ___ wake up early.',
        options: ['don\'t have to', 'mustn\'t', 'haven\'t to', 'must not'],
        correctAnswer: 'don\'t have to',
        explanation: '"Don\'t have to" expresses absence of obligation (it is not necessary).',
        explanationUz: '"Don\'t have to" zaruriyat yo\'qligini bildiradi (erta turishim shart emas).',
      },
    ],
  },
  {
    id: 'modals-should',
    title: 'Should',
    category: 'Modals',
    level: 'Beginner (A1)',
    summaryUz: 'Maslahat va tavsiya berish uchun (Advice & Recommendations).',
    formula: 'Positive: S + should + V1 | Negative: S + shouldn\'t + V1 | Question: Should + S + V1?',
    rules: [
      {
        title: 'Foydali maslahat berish (Giving Advice)',
        explanation: 'Used to say what is the right or best thing to do.',
        explanationUz: 'Biror kishiga nima qilish to\'g\'ri yoki yaxshi ekanligini maslahat berganda.',
        examples: [
          { en: 'You should review irregular verbs for 10 minutes every day.', uz: 'Siz har kuni 10 daqiqa noto\'g\'ri fe\'llarni takrorlashingiz kerak.' },
          { en: 'You shouldn\'t drink iced water when you have a sore throat.', uz: 'Tog\'og\'ingiz og\'riganda muzdek suv ichmasligingiz kerak.' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'You should to eat vegetables.',
        correction: 'You should eat vegetables.',
        note: '"Should" dan keyin "to" qo\'yilmaydi.',
      },
    ],
    quiz: [
      {
        id: 'sh-1',
        prompt: 'If you want to remember words, you ___ practice flashcards consistently.',
        options: ['should', 'should to', 'ought', 'must to'],
        correctAnswer: 'should',
        explanation: 'Use "should + bare infinitive" to give advice.',
        explanationUz: 'Maslahat berishda "should + fe\'l" qo\'llaniladi.',
      },
    ],
  },
  {
    id: 'there-is-there-are',
    title: 'There is / There are',
    category: 'Structures',
    level: 'Beginner (A1)',
    summaryUz: 'Biror joyda biror narsa yoki shaxs mavjudligini bildirish uchun (mavjud, bor).',
    formula: 'Birlik / Sanalmas: There is (There\'s) | Ko\'plik: There are',
    rules: [
      {
        title: 'Birlik va Sanalmas otlar bilan (There is)',
        explanation: 'Use "There is" with singular countable nouns and uncountable nouns.',
        explanationUz: 'Birlikdagi otlar va sanalmaydigan otlar (suv, vaqt, non) bilan "There is" ishlatiladi.',
        examples: [
          { en: 'There is a modern dictionary on the desk.', uz: 'Stol ustida zamonaviy lug\'at bor.' },
          { en: 'There is fresh milk in the fridge.', uz: 'Muzlatgichda yangi sut bor.' },
        ],
      },
      {
        title: 'Ko\'plikdagi otlar bilan (There are)',
        explanation: 'Use "There are" with plural nouns.',
        explanationUz: 'Ko\'plikdagi otlar bilan "There are" ishlatiladi.',
        examples: [
          { en: 'There are sixty irregular verbs in our essential list.', uz: 'Asosiy ro\'yxatimizda oltmish dona noto\'g\'ri fe\'l bor.' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'There are a book on the table.',
        correction: 'There is a book on the table.',
        note: '"a book" birlikda bo\'lgani uchun "There is" bo\'ladi.',
      },
    ],
    quiz: [
      {
        id: 'tita-1',
        prompt: '___ three apples and an orange in the fruit basket.',
        options: ['There are', 'There is', 'It is', 'They are'],
        correctAnswer: 'There are',
        explanation: 'Plural nouns "three apples" require "There are".',
        explanationUz: '"Three apples" ko\'plikda bo\'lgani uchun "There are" ishlatiladi.',
      },
    ],
  },
  {
    id: 'comparatives',
    title: 'Comparatives',
    category: 'Adjectives',
    level: 'Beginner (A1)',
    summaryUz: 'Sifatlarning qiyosiy darajasi: ikki narsa yoki shaxsni bir-biri bilan solishtirish.',
    formula: 'Qisqa sifatlar: Adj + -er + than | Uzun sifatlar: more + Adj + than',
    rules: [
      {
        title: 'Bir bo\'g\'inli qisqa sifatlar (-er than)',
        explanation: 'Add -er to one-syllable adjectives.',
        explanationUz: 'Qisqa sifatlarga -er qo\'shimchasi qo\'shiladi (fast -> faster, small -> smaller).',
        examples: [
          { en: 'An airplane is faster than a train.', uz: 'Samolyot poyezddan tezroq.' },
          { en: 'Samarkand is older than many modern cities.', uz: 'Samarqand ko\'plab zamonaviy shaharlardan qadimiyroq.' },
        ],
      },
      {
        title: 'Ko\'p bo\'g\'inli uzun sifatlar (more ... than)',
        explanation: 'Use "more" before adjectives of two or more syllables.',
        explanationUz: 'Ikki va undan ortiq bo\'g\'inli sifatlar oldidan "more" qo\'yiladi.',
        examples: [
          { en: 'Vocabulary flashcards are more effective than passive reading.', uz: 'So\'z kartochkalari passiv o\'qishdan ko\'ra samaraliroq.' },
        ],
      },
      {
        title: 'Istisno sifatlar (Irregular Comparatives)',
        explanation: 'good -> better, bad -> worse, far -> further/farther.',
        explanationUz: 'Tubdan o\'zgaradigan sifatlar: good -> better, bad -> worse.',
        examples: [
          { en: 'Daily practice leads to better results.', uz: 'Kundalik mashq yaxshiroq natijalarga olib keladi.' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'He is more taller than me.',
        correction: 'He is taller than me.',
        note: '"taller" bilan birga "more" ishlatilmaydi.',
      },
    ],
    quiz: [
      {
        id: 'comp-1',
        prompt: 'This grammar exercise is ___ than the previous one.',
        options: ['easier', 'more easy', 'easyer', 'easiest'],
        correctAnswer: 'easier',
        explanation: 'Two-syllable adjectives ending in -y change y to i and add -er (easy -> easier).',
        explanationUz: 'Oxiri -y bilan tugagan sifatlar "easier" bo\'ladi.',
      },
    ],
  },
  {
    id: 'superlatives',
    title: 'Superlatives',
    category: 'Adjectives',
    level: 'Beginner (A1)',
    summaryUz: 'Sifatlarning orttirma darajasi: bir guruhdagi eng ajralib turuvchi xususiyatni ifodalash (eng ...).',
    formula: 'Qisqa sifatlar: the + Adj + -est | Uzun sifatlar: the most + Adj',
    rules: [
      {
        title: 'Qisqa sifatlar (the ... -est)',
        explanation: 'Add "the" before and "-est" to short adjectives.',
        explanationUz: 'Qisqa sifatlarga "the" artikli va "-est" qo\'shimchasi qo\'shiladi.',
        examples: [
          { en: 'Mount Everest is the highest mountain on Earth.', uz: 'Everest tog\'i yer yuzidagi eng baland tog\'dir.' },
        ],
      },
      {
        title: 'Uzun sifatlar (the most ...)',
        explanation: 'Use "the most" before multi-syllable adjectives.',
        explanationUz: 'Uzun sifatlar oldidan "the most" ishlatiladi.',
        examples: [
          { en: 'Consistency is the most important secret to learning English.', uz: 'Muntazamlik ingliz tilini o\'rganishning eng muhim siridir.' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'He is tallest boy in class.',
        correction: 'He is the tallest boy in class.',
        note: 'Superlative sifatlar oldidan har doim "the" artikli qo\'yilishi shart.',
      },
    ],
    quiz: [
      {
        id: 'sup-1',
        prompt: 'Which is ___ ocean in the world?',
        options: ['the deepest', 'deepest', 'the most deep', 'more deep'],
        correctAnswer: 'the deepest',
        explanation: 'Short adjective "deep" becomes "the deepest".',
        explanationUz: '"Deep" qisqa sifat bo\'lgani uchun "the deepest" bo\'ladi.',
      },
    ],
  },
  {
    id: 'articles-a-an-the',
    title: 'Articles (a, an, the)',
    category: 'Nouns & Articles',
    level: 'Beginner (A1)',
    summaryUz: 'Artikllar: noaniq (a, an) va aniq (the) artikllarning ishlatilishi.',
    formula: 'Undosh tovush oldidan: a | Unli tovush oldidan: an | Aniq narsa/shaxs oldidan: the',
    rules: [
      {
        title: 'Noaniq artikl (a / an)',
        explanation: 'Use "a" before consonant sounds, "an" before vowel sounds for singular countable nouns mentioned for the first time.',
        explanationUz: 'Birinchi marta eslatilayotgan noaniq narsalar uchun: undosh tovushdan oldin "a", unli tovushdan oldin "an".',
        examples: [
          { en: 'I saw an eagle in the mountains.', uz: 'Men tog\'da bitta burgutni ko\'rdim.' },
          { en: 'She bought a new digital camera.', uz: 'U yangi raqamli kamera sotib oldi.' },
        ],
      },
      {
        title: 'Aniq artikl (the)',
        explanation: 'Used when both the speaker and listener know specifically which thing is being referred to.',
        explanationUz: 'Suhbatdoshlarga ma\'lum bo\'lgan aniq buyum yoki narsa haqida gap ketganda.',
        examples: [
          { en: 'Could you please shut the window?', uz: 'Iltimos, derazani yopib yubora olasizmi (aynan shu xonadagi derazani)?' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'He is an university student.',
        correction: 'He is a university student.',
        note: '"university" so\'zi [juː] undosh tovushi bilan boshlanadi, shuning uchun "a" qo\'yiladi.',
      },
    ],
    quiz: [
      {
        id: 'art-1',
        prompt: 'It takes half ___ hour to finish this vocabulary test.',
        options: ['an', 'a', 'the', '-'],
        correctAnswer: 'an',
        explanation: '"Hour" starts with a silent "h", so the first sound is a vowel [aʊə], taking "an".',
        explanationUz: '"Hour" so\'zida "h" o\'qilmaydi va unli tovush bilan boshlanadi, shuning uchun "an" bo\'ladi.',
      },
    ],
  },
  {
    id: 'countable-uncountable-nouns',
    title: 'Countable / Uncountable Nouns',
    category: 'Nouns & Articles',
    level: 'Beginner (A1)',
    summaryUz: 'Sanaladigan va sanalmaydigan otlar: many/much, few/little farqlari.',
    formula: 'Countable: many, few, several | Uncountable: much, little, a lot of',
    rules: [
      {
        title: 'Sanaladigan otlar (Countable Nouns)',
        explanation: 'Things you can count in numbers (one apple, two books, three cars). Have singular and plural forms.',
        explanationUz: 'Donalab sanash mumkin bo\'lgan otlar. Birlik va ko\'plik shakliga ega (an apple, two apples).',
        examples: [
          { en: 'How many flashcards did you review today?', uz: 'Bugun nechta kartochka takrorladingiz?' },
        ],
      },
      {
        title: 'Sanalmaydigan otlar (Uncountable Nouns)',
        explanation: 'Substances, liquids, concepts that cannot be divided into separate elements (water, information, advice, time, money).',
        explanationUz: 'Suyuqliklar, moddalar va tushunchalar (suv, sut, axborot, bilim). Faqat birlikda keladi.',
        examples: [
          { en: 'How much water do you drink per day?', uz: 'Kuniga qancha suv ichasiz?' },
          { en: 'He gave me great advice.', uz: 'U menga ajoyib maslahat berdi (advices deb ko\'plik qilinmaydi).' },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake: 'She gave me many informations.',
        correction: 'She gave me a lot of information.',
        note: '"information" sanalmaydi, unga -s qo\'shilmaydi.',
      },
    ],
    quiz: [
      {
        id: 'cunc-1',
        prompt: 'We don\'t have ___ time before the lesson begins.',
        options: ['much', 'many', 'few', 'a few'],
        correctAnswer: 'much',
        explanation: '"Time" as an abstract concept is uncountable, taking "much".',
        explanationUz: '"Time" sanalmaydigan ot bo\'lgani uchun inkor gapda "much" ishlatiladi.',
      },
    ],
  },
];
