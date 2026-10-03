import { IrregularVerb } from '../types/irregularVerbs';

export interface PastSimpleExercise {
  id: string;
  type: 'v1_to_v2_mc' | 'v1_to_v2_type' | 'sentence_gap' | 'negative_question' | 'complete_forms';
  category: 'Past Simple';
  verb: IrregularVerb;
  title: string;
  sentencePrompt: string; // The sentence or word prompt
  hint?: string;
  correctAnswer: string;
  options?: string[]; // for MC
  explanationUz: string;
}

export const PAST_SIMPLE_SENTENCE_TEMPLATES: {
  verbId: string;
  sentence: string; // contains {gap}
  correct: string;
  translationUz: string;
}[] = [
  {
    verbId: 'iv-be',
    sentence: 'Yesterday, the weather {gap} (be) sunny and very warm in the mountains.',
    correct: 'was',
    translationUz: 'Kecha tog\'da ob-havo quyoshli va juda iliq edi.',
  },
  {
    verbId: 'iv-become',
    sentence: 'He {gap} (become) a world-famous software developer after years of dedication.',
    correct: 'became',
    translationUz: 'U yillar davomidagi fidoyilikdan so\'ng dunyoga mashhur dasturchi bo\'ldi.',
  },
  {
    verbId: 'iv-begin',
    sentence: 'The English lesson {gap} (begin) at nine o\'clock sharp this morning.',
    correct: 'began',
    translationUz: 'Ingliz tili darsi bugun ertalab roppa-rosa soat to\'qqizda boshlandi.',
  },
  {
    verbId: 'iv-break',
    sentence: 'He accidentally {gap} (break) the ceramic cup while washing the dishes.',
    correct: 'broke',
    translationUz: 'U idishlarni yuvayotganda tasodifan sopol finjonni sindirib qo\'ydi.',
  },
  {
    verbId: 'iv-bring',
    sentence: 'My grandmother {gap} (bring) fresh homemade cookies when she visited us.',
    correct: 'brought',
    translationUz: 'Buvim biznikiga kelganida yangi pishirilgan uy pechenyelarini olib keldi.',
  },
  {
    verbId: 'iv-build',
    sentence: 'They {gap} (build) a spacious new hospital in our district last year.',
    correct: 'built',
    translationUz: 'Ular o\'tgan yili tumanimizda keng yangi shifoxona qurdilar.',
  },
  {
    verbId: 'iv-buy',
    sentence: 'She {gap} (buy) an English grammar book and several notebooks.',
    correct: 'bought',
    translationUz: 'U bitta ingliz tili grammatikasi kitobi va bir nechta daftar sotib oldi.',
  },
  {
    verbId: 'iv-can',
    sentence: 'When he was six, he {gap} (can) already read fluent English.',
    correct: 'could',
    translationUz: 'U olti yoshligida allaqachon ingliz tilida ravon o\'qiy olardi.',
  },
  {
    verbId: 'iv-catch',
    sentence: 'We ran quickly and {gap} (catch) the express bus just in time.',
    correct: 'caught',
    translationUz: 'Biz tez yugurdik va tezyurar avtobusga o\'z vaqtida ulgurdik.',
  },
  {
    verbId: 'iv-choose',
    sentence: 'The committee {gap} (choose) the most qualified candidate for the project.',
    correct: 'chose',
    translationUz: 'Qo\'mita loyiha uchun eng munosib nomzodni tanladi.',
  },
  {
    verbId: 'iv-come',
    sentence: 'Many distinguished guests {gap} (come) to the opening ceremony.',
    correct: 'came',
    translationUz: 'Ochilish marosimiga ko\'plab nufuzli mehmonlar keldilar.',
  },
  {
    verbId: 'iv-do',
    sentence: 'I {gap} (do) all my university homework before going to bed.',
    correct: 'did',
    translationUz: 'Men uxlashga yotishdan oldin barcha universitet uy vazifalarini bajardim.',
  },
  {
    verbId: 'iv-draw',
    sentence: 'The young artist {gap} (draw) a picturesque pencil sketch of the sunset.',
    correct: 'drew',
    translationUz: 'Yosh rassom quyosh botishining go\'zal qalam eskizini chizdi.',
  },
  {
    verbId: 'iv-drink',
    sentence: 'He {gap} (drink) a tall glass of fresh orange juice after his run.',
    correct: 'drank',
    translationUz: 'Yugurishdan keyin u bir stakan yangi apelsin sharbatini ichdi.',
  },
  {
    verbId: 'iv-drive',
    sentence: 'My uncle {gap} (drive) across three cities during his vacation trip.',
    correct: 'drove',
    translationUz: 'Tog\'am ta\'til safari davomida uchta shahar bo\'ylab mashina haydab o\'tdi.',
  },
  {
    verbId: 'iv-eat',
    sentence: 'Yesterday, we {gap} (eat) delicious hot plov at a traditional teahouse.',
    correct: 'ate',
    translationUz: 'Kecha biz an\'anaviy choyxonada mazali issiq palov yedik.',
  },
  {
    verbId: 'iv-fall',
    sentence: 'Golden yellow leaves {gap} (fall) softly from the trees in October.',
    correct: 'fell',
    translationUz: 'Oktabr oyida daraxtlardan tilla rang sariq barglar mayin to\'kildi.',
  },
  {
    verbId: 'iv-feel',
    sentence: 'I {gap} (feel) thoroughly rested and energetic after the weekend.',
    correct: 'felt',
    translationUz: 'Dam olish kunidan so\'ng o\'zimni to\'liq dam olgan va g\'ayratli his qildim.',
  },
  {
    verbId: 'iv-find',
    sentence: 'She {gap} (find) her missing wallet behind the office desk.',
    correct: 'found',
    translationUz: 'U yo\'qolgan hamyonini ofis stoli ortidan topdi.',
  },
  {
    verbId: 'iv-fly',
    sentence: 'Our airline plane {gap} (fly) directly from Tashkent to London.',
    correct: 'flew',
    translationUz: 'Bizning samolyotimiz Toshkentdan to\'g\'ridan-to\'g\'ri Londonga uchdi.',
  },
  {
    verbId: 'iv-forget',
    sentence: 'He completely {gap} (forget) to set his alarm clock last night.',
    correct: 'forgot',
    translationUz: 'U kecha uyg\'otgich soatini qo\'yishni butunlay unutib qo\'ydi.',
  },
  {
    verbId: 'iv-get',
    sentence: 'She {gap} (get) an outstanding grade on her final English exam.',
    correct: 'got',
    translationUz: 'U yakuniy ingliz tili imtihonida a\'lo baho oldi.',
  },
  {
    verbId: 'iv-give',
    sentence: 'The mentor {gap} (give) insightful advice about international scholarships.',
    correct: 'gave',
    translationUz: 'Ustoz xalqaro stipendiyalar haqida mazmunli maslahatlar berdi.',
  },
  {
    verbId: 'iv-go',
    sentence: 'We {gap} (go) to the historic Registan square in Samarkand last month.',
    correct: 'went',
    translationUz: 'Biz o\'tgan oy Samarqanddagi tarixiy Registon maydoniga bordik.',
  },
  {
    verbId: 'iv-have',
    sentence: 'They {gap} (have) a productive team meeting on Monday morning.',
    correct: 'had',
    translationUz: 'Dushanba tongida ularning samarali jamoaviy uchrashuvi bo\'ldi.',
  },
  {
    verbId: 'iv-hear',
    sentence: 'I {gap} (hear) the delightful birds chirping outside my bedroom window.',
    correct: 'heard',
    translationUz: 'Yotoqxona derazam ortida qushlarning yoqimli sayrashini eshitdim.',
  },
  {
    verbId: 'iv-know',
    sentence: 'She already {gap} (know) the solution before the teacher finished speaking.',
    correct: 'knew',
    translationUz: 'O\'qituvchi gapirib bo\'lmasidanoq u yechimni allaqachon bilardi.',
  },
  {
    verbId: 'iv-leave',
    sentence: 'The passengers {gap} (leave) the airport terminal right on schedule.',
    correct: 'left',
    translationUz: 'Yo\'lovchilar aeroport terminalini aynan jadval bo\'yicha tark etdilar.',
  },
  {
    verbId: 'iv-make',
    sentence: 'Mother {gap} (make) a delicious apple pie for afternoon tea.',
    correct: 'made',
    translationUz: 'Ona tushdan keyingi choy uchun mazali olmali pirog pishirdi.',
  },
  {
    verbId: 'iv-meet',
    sentence: 'I {gap} (meet) my childhood best friend after ten long years.',
    correct: 'met',
    translationUz: 'Men o\'n yillik ayriliqdan so\'ng bolalikdagi eng yaqin do\'stimni uchratdim.',
  },
  {
    verbId: 'iv-read',
    sentence: 'He {gap} (read) fifty pages of the English historical novel yesterday.',
    correct: 'read',
    translationUz: 'U kecha inglizcha tarixiy romanning ellik sahifasini o\'qidi.',
  },
  {
    verbId: 'iv-run',
    sentence: 'The athletes {gap} (run) twelve laps around the modern stadium track.',
    correct: 'ran',
    translationUz: 'Sportchilar zamonaviy stadion yo\'lagi bo\'ylab o\'n ikki aylanani yugurib o\'tdilar.',
  },
  {
    verbId: 'iv-see',
    sentence: 'We {gap} (see) an ancient astronomical observatory in Bukhara.',
    correct: 'saw',
    translationUz: 'Biz Buxoroda qadimiy astronomik rasadxonani ko\'rdik.',
  },
  {
    verbId: 'iv-sleep',
    sentence: 'The exhausted traveler {gap} (sleep) peacefully for nine solid hours.',
    correct: 'slept',
    translationUz: 'Charchagan sayohatchi to\'qqiz soat davomida tinchgina uxladi.',
  },
  {
    verbId: 'iv-speak',
    sentence: 'She {gap} (speak) fluently and persuasively at the international conference.',
    correct: 'spoke',
    translationUz: 'U xalqaro konferensiyada ravon va ishontirarli tarzda so\'zladi.',
  },
  {
    verbId: 'iv-take',
    sentence: 'He {gap} (take) stunning high-resolution photos of the mountain ridge.',
    correct: 'took',
    translationUz: 'U tog\' tizmasining ajoyib yuqori sifatli fotosuratlarini oldi.',
  },
  {
    verbId: 'iv-understand',
    sentence: 'All students {gap} (understand) the difficult math theorem after the explanation.',
    correct: 'understood',
    translationUz: 'Tushuntirishdan so\'ng barcha talabalar qiyin matematika teoremasini tushundilar.',
  },
  {
    verbId: 'iv-write',
    sentence: 'She {gap} (write) a polite thank-you letter to her English professor.',
    correct: 'wrote',
    translationUz: 'U o\'zining ingliz tili professoriga xushmuomala minnatdorchilik xati yozdi.',
  },
  {
    verbId: 'iv-sing',
    sentence: 'The talented musician {gap} (sing) a traditional national song at the concert.',
    correct: 'sang',
    translationUz: 'Iqtidorli sozanda konsertda an\'anaviy milliy qo\'shiqni kuyladi.',
  },
  {
    verbId: 'iv-swim',
    sentence: 'The boys {gap} (swim) across the calm blue lake on a hot July afternoon.',
    correct: 'swam',
    translationUz: 'Bolalar issiq iyul tushdan keyin tinch ko\'m-ko\'k ko\'l bo\'ylab suzib o\'tdilar.',
  },
  {
    verbId: 'iv-win',
    sentence: 'Our national chess team {gap} (win) the grand tournament trophy.',
    correct: 'won',
    translationUz: 'Milliy shaxmat jamoamiz katta turnir kubogini qo\'lga kiritdi (yutdi).',
  },
  {
    verbId: 'iv-wear',
    sentence: 'She {gap} (wear) a charming navy blue dress for the graduation ceremony.',
    correct: 'wore',
    translationUz: 'U bitiruv marosimi uchun jozibali to\'q ko\'k ko\'ylak kiygan edi.',
  },
  {
    verbId: 'iv-lose',
    sentence: 'He unfortunately {gap} (lose) his room keys during the morning jog.',
    correct: 'lost',
    translationUz: 'U afsuski ertalabki yugurish paytida xona kalitlarini yo\'qotib qo\'ydi.',
  },
  {
    verbId: 'iv-pay',
    sentence: 'We {gap} (pay) for our delicious restaurant dinner using mobile banking.',
    correct: 'paid',
    translationUz: 'Biz mazali restorandagi kechki ovqat uchun mobil bank orqali to\'ladik.',
  },
  {
    verbId: 'iv-spend',
    sentence: 'They {gap} (spend) the whole weekend hiking in the scenic Chimgan mountains.',
    correct: 'spent',
    translationUz: 'Ular butun dam olish kunini go\'zal Chimyon tog\'larida sayr qilib o\'tkazdilar.',
  },
  {
    verbId: 'iv-stand',
    sentence: 'The spectators {gap} (stand) up and applauded enthusiastically at the end of the show.',
    correct: 'stood',
    translationUz: 'Tomoshabinlar tomosha oxirida o\'rinlaridan turib qizg\'in qarsak chalishdi.',
  },
  {
    verbId: 'iv-teach',
    sentence: 'Our professor {gap} (teach) us practical academic writing skills last semester.',
    correct: 'taught',
    translationUz: 'Professorimiz o\'tgan semestrda bizga amaliy akademik yozish ko\'nikmalarini o\'rgatdi.',
  },
  {
    verbId: 'iv-tell',
    sentence: 'Grandfather {gap} (tell) fascinating historic legends around the evening fire.',
    correct: 'told',
    translationUz: 'Bobom kechki gulxan atrofida ajoyib tarixiy afsonalarni aytib berdi.',
  },
  {
    verbId: 'iv-think',
    sentence: 'I {gap} (think) deeply before making such a crucial life decision.',
    correct: 'thought',
    translationUz: 'Bunday muhim hayotiy qarorni qabul qilishdan oldin chuqur o\'ylab ko\'rdim.',
  },
  {
    verbId: 'iv-wake',
    sentence: 'He {gap} (wake) up early at dawn to watch the sunrise over the hills.',
    correct: 'woke',
    translationUz: 'U adirlar uzra quyosh chiqishini tomosha qilish uchun saharlab erta uyg\'ondi.',
  },
  {
    verbId: 'iv-cost',
    sentence: 'The latest laptop model {gap} (cost) much less during the seasonal sale.',
    correct: 'cost',
    translationUz: 'Eng so\'nggi noutbuk modeli mavsumiy chegirma paytida ancha arzon turdi.',
  },
  {
    verbId: 'iv-cut',
    sentence: 'The chef carefully {gap} (cut) the fresh vegetables for the salad.',
    correct: 'cut',
    translationUz: 'Oshpaz salat uchun yangi sabzavotlarni ehtiyotkorlik bilan to\'g\'radi (kesdi).',
  },
  {
    verbId: 'iv-grow',
    sentence: 'The young green trees {gap} (grow) rapidly after the spring rains.',
    correct: 'grew',
    translationUz: 'Bahorgi yomg\'irlardan keyin yosh yashil daraxtlar jadal o\'sdi.',
  },
  {
    verbId: 'iv-ride',
    sentence: 'The children joyfully {gap} (ride) their bicycles through the quiet park.',
    correct: 'rode',
    translationUz: 'Bolalar sokin xiyobon bo\'ylab velosipedlarini quvnoq haydadilar.',
  },
  {
    verbId: 'iv-sit',
    sentence: 'We {gap} (sit) near the warm fireplace and read interesting books all evening.',
    correct: 'sat',
    translationUz: 'Biz butun oqshom issiq kamin yonida o\'tirdik va qiziqarli kitoblar o\'qidik.',
  },
  {
    verbId: 'iv-sell',
    sentence: 'The friendly merchant {gap} (sell) fresh organic fruits and sweet honey.',
    correct: 'sold',
    translationUz: 'Xushmuomala savdogar yangi tabiiy mevalar va shirin asal sotdi.',
  },
  {
    verbId: 'iv-send',
    sentence: 'I {gap} (send) the final project report to my supervisor yesterday afternoon.',
    correct: 'sent',
    translationUz: 'Men kecha tushdan keyin ilmiy rahbarimga yakuniy loyiha hisobotini yubordim.',
  },
  {
    verbId: 'iv-keep',
    sentence: 'She always {gap} (keep) her promises and supported her colleagues.',
    correct: 'kept',
    translationUz: 'U doimo o\'z va\'dalarini bajardi (saqladi) va hamkasblarini qo\'llab-quvvatladi.',
  },
  {
    verbId: 'iv-say',
    sentence: 'The teacher {gap} (say) that daily practice is the key to English fluency.',
    correct: 'said',
    translationUz: 'O\'qituvchi har kungi mashg\'ulot ingliz tilida ravon gapirishning kaliti ekanini aytdi.',
  },
];

export const PAST_SIMPLE_NEGATIVE_QUESTIONS: {
  prompt: string;
  correctAnswer: string;
  ruleExplanationUz: string;
}[] = [
  {
    prompt: 'She ______ (not / go) to the university yesterday because she was ill.',
    correctAnswer: "didn't go",
    ruleExplanationUz: "Past Simple da inkor gaplarda: didn't + fe'lning 1-shakli (didn't go).",
  },
  {
    prompt: 'I ______ (not / see) anyone at the library on Sunday morning.',
    correctAnswer: "didn't see",
    ruleExplanationUz: "didn't yordamchi fe'lidan keyin asosiy fe'l V1 bo'ladi (didn't see).",
  },
  {
    prompt: '______ you ______ (buy) the tickets for the train to Samarkand?',
    correctAnswer: 'Did buy',
    ruleExplanationUz: "Past Simple savolida: Did + ega + V1 (Did you buy?).",
  },
  {
    prompt: 'They ______ (not / break) the laboratory equipment.',
    correctAnswer: "didn't break",
    ruleExplanationUz: "Inkor gapda: didn't + break (fe'l 1-shaklida qoladi).",
  },
  {
    prompt: '______ she ______ (write) the project summary yesterday?',
    correctAnswer: 'Did write',
    ruleExplanationUz: "Savolda: Did + she + write (Did borligi uchun fe'l V1 bo'ladi).",
  },
  {
    prompt: 'He ______ (not / eat) dinner because he was not hungry.',
    correctAnswer: "didn't eat",
    ruleExplanationUz: "didn't dan keyin fe'l ate emas, eat (V1) bo'ladi.",
  },
  {
    prompt: '______ you ______ (speak) to the hotel manager about your room?',
    correctAnswer: 'Did speak',
    ruleExplanationUz: "Savol: Did you speak? (Did + V1).",
  },
  {
    prompt: 'We ______ (not / have) enough time to visit the national museum.',
    correctAnswer: "didn't have",
    ruleExplanationUz: "Inkor: didn't + have (had emas, V1 shakli).",
  },
  {
    prompt: '______ they ______ (win) the championship match on Saturday?',
    correctAnswer: 'Did win',
    ruleExplanationUz: "Savol: Did they win? (won emas, win bo'ladi).",
  },
  {
    prompt: 'She ______ (not / tell) anyone her private password.',
    correctAnswer: "didn't tell",
    ruleExplanationUz: "didn't + tell (told emas, fe'l 1-shaklida).",
  },
  {
    prompt: '______ you ______ (find) your lost passport in the room?',
    correctAnswer: 'Did find',
    ruleExplanationUz: "Savol: Did you find? (found emas).",
  },
  {
    prompt: 'He ______ (not / drink) any soda; he only drank fresh water.',
    correctAnswer: "didn't drink",
    ruleExplanationUz: "Inkor: didn't drink (drank emas).",
  },
  {
    prompt: '______ the professor ______ (give) you homework yesterday?',
    correctAnswer: 'Did give',
    ruleExplanationUz: "Savol: Did ... give? (gave emas, give).",
  },
  {
    prompt: 'I ______ (not / sleep) well last night because of the loud thunderstorm.',
    correctAnswer: "didn't sleep",
    ruleExplanationUz: "Inkor: didn't sleep (slept emas).",
  },
  {
    prompt: '______ they ______ (leave) the city at 7 o\'clock in the morning?',
    correctAnswer: 'Did leave',
    ruleExplanationUz: "Savol: Did they leave? (left emas, leave).",
  },
  {
    prompt: 'She ______ (not / know) the answer to the difficult question.',
    correctAnswer: "didn't know",
    ruleExplanationUz: "Inkor: didn't know (knew emas).",
  },
  {
    prompt: '______ you ______ (hear) the strange sound outside the window?',
    correctAnswer: 'Did hear',
    ruleExplanationUz: "Savol: Did you hear? (heard emas, hear).",
  },
  {
    prompt: 'We ______ (not / pay) by cash; we paid by debit card.',
    correctAnswer: "didn't pay",
    ruleExplanationUz: "Inkor: didn't pay (paid emas).",
  },
  {
    prompt: '______ he ______ (drive) carefully on the icy winter road?',
    correctAnswer: 'Did drive',
    ruleExplanationUz: "Savol: Did he drive? (drove emas, drive).",
  },
  {
    prompt: 'The students ______ (not / understand) the grammar rule at first.',
    correctAnswer: "didn't understand",
    ruleExplanationUz: "Inkor: didn't understand (understood emas).",
  },
  {
    prompt: '______ you ______ (take) these stunning photos in the mountains?',
    correctAnswer: 'Did take',
    ruleExplanationUz: "Savol: Did you take? (took emas, take).",
  },
  {
    prompt: 'He ______ (not / spend) any money on unnecessary shopping.',
    correctAnswer: "didn't spend",
    ruleExplanationUz: "Inkor: didn't spend (spent emas).",
  },
  {
    prompt: '______ she ______ (bring) the important documents to the office?',
    correctAnswer: 'Did bring',
    ruleExplanationUz: "Savol: Did she bring? (brought emas, bring).",
  },
  {
    prompt: 'I ______ (not / forget) our scheduled appointment.',
    correctAnswer: "didn't forget",
    ruleExplanationUz: "Inkor: didn't forget (forgot emas).",
  },
  {
    prompt: '______ you ______ (swim) in the swimming pool last weekend?',
    correctAnswer: 'Did swim',
    ruleExplanationUz: "Savol: Did you swim? (swam emas, swim).",
  },
];
