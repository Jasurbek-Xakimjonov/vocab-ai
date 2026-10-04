import { SpeakingVideo } from '../types/speakingVideos';

export const SPEAKING_VIDEOS: SpeakingVideo[] = [
  // ========================================================
  // 🇺🇸 US ENGLISH FABLES & STORIES (@TheFableCottage)
  // ========================================================
  {
    id: 'oak-tree',
    title: 'The Oak Tree',
    youtubeId: '_6mlmRJHxNo',
    accent: 'US English',
    level: 'Beginner',
    category: 'Beginner Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '6:14',
    description:
      'Two hikers get stuck in bad weather and discover that sometimes the things we need are different from the things we want.',
    transcript: [
      {
        id: 'oak-1',
        text: 'Two hikers are walking through the hills.',
        translationUz: 'Ikki sayyoh tepaliklar bo‘ylab piyoda yurib ketmoqdalar.',
      },
      {
        id: 'oak-2',
        text: 'The sky gets dark and it suddenly starts to rain.',
        translationUz: 'Osmon qorayib, to‘satdan yomg‘ir yog‘a boshlaydi.',
      },
      {
        id: 'oak-3',
        text: 'They look for a place to stay dry and warm.',
        translationUz: 'Ular quruq va issiq boshpana qidirishadi.',
      },
      {
        id: 'oak-4',
        text: 'Ahead of them, they see a giant oak tree standing in a field.',
        translationUz: 'Ularning oldida keng dalada turgan bahaybat eman daraxti ko‘rinadi.',
      },
      {
        id: 'oak-5',
        text: 'They run quickly toward the tree and stand under its wide branches.',
        translationUz: 'Ular tezda daraxt tomon yugurib, uning keng shoxlari ostiga panalashadi.',
      },
      {
        id: 'oak-6',
        text: 'The thick leaves protect them completely from the heavy storm.',
        translationUz: 'Qalin barglar ularni qattiq bo‘rondan butunlay himoya qiladi.',
      },
      {
        id: 'oak-7',
        text: 'One hiker says, "This tree is completely useless because it has no sweet fruit!"',
        translationUz: 'Sayyohlardan biri aytadi: "Bu daraxt shirin mevasi bo‘lmagani uchun butunlay foydasiz!"',
      },
      {
        id: 'oak-8',
        text: 'The oak tree sighs and whispers softly in the wind.',
        translationUz: 'Eman daraxti chuqur nafas olib, shamolda sekin shivirlaydi.',
      },
      {
        id: 'oak-9',
        text: '"You stand here protected from the storm, yet you call me useless."',
        translationUz: '"Siz bu yerda bo‘rondan panalanib turibsiz, ammo meni foydasiz deb atayapsiz."',
      },
      {
        id: 'oak-10',
        text: 'Sometimes the things we need are different from the things we want.',
        translationUz: 'Ba‘zida bizga kerak bo‘lgan narsalar biz xohlagan narsalardan butunlay farq qiladi.',
      },
    ],
    speakingSentences: [
      {
        id: 'oak-sp-1',
        text: 'Two hikers are walking through the hills.',
        translationUz: 'Ikki sayyoh tepaliklar bo‘ylab piyoda yurib ketmoqdalar.',
      },
      {
        id: 'oak-sp-2',
        text: 'The sky gets dark and it starts to rain.',
        translationUz: 'Osmon qorayib, yomg‘ir yog‘a boshlaydi.',
      },
      {
        id: 'oak-sp-3',
        text: 'They need a safe place to stay dry.',
        translationUz: 'Ularga quruq qolish uchun xavfsiz joy kerak.',
      },
      {
        id: 'oak-sp-4',
        text: 'Ahead of them, they see a giant oak tree.',
        translationUz: 'Ularning oldida ulkan eman daraxti ko‘rinadi.',
      },
      {
        id: 'oak-sp-5',
        text: 'The big branches protect them from the storm.',
        translationUz: 'Katta shoxlar ularni bo‘rondan himoya qiladi.',
      },
      {
        id: 'oak-sp-6',
        text: 'Sometimes the things we need are different from what we want.',
        translationUz: 'Ba‘zida bizga kerakli narsalar biz xohlagan narsalardan farq qiladi.',
      },
    ],
    vocabulary: [
      {
        word: 'hiker',
        translation: 'sayyoh, piyoda sayr qiluvchi',
        pronunciation: '/ˈhaɪkər/',
        partOfSpeech: 'noun',
        definition: 'A person who goes for long walks in the countryside or hills.',
        example: 'Two hikers are walking through the hills.',
      },
      {
        word: 'weather',
        translation: 'ob-havo',
        pronunciation: '/ˈweðər/',
        partOfSpeech: 'noun',
        definition: 'The state of the atmosphere at a place and time (heat, dryness, rain, etc.).',
        example: 'The bad weather made it difficult to travel.',
      },
      {
        word: 'hill',
        translation: 'tepalik, adir',
        pronunciation: '/hɪl/',
        partOfSpeech: 'noun',
        definition: 'A naturally raised area of land, not as high as a mountain.',
        example: 'They walked over the green hill.',
      },
      {
        word: 'tired',
        translation: 'charchagan, holdan toygan',
        pronunciation: '/ˈtaɪərd/',
        partOfSpeech: 'adjective',
        definition: 'In need of sleep or rest; weary.',
        example: 'After walking for five hours, both travelers were tired.',
      },
      {
        word: 'hungry',
        translation: 'och, och qolgan',
        pronunciation: '/ˈhʌŋɡri/',
        partOfSpeech: 'adjective',
        definition: 'Feeling or showing the need for food.',
        example: 'The hikers were cold, wet, and hungry.',
      },
      {
        word: 'shelter',
        translation: 'boshpana, pana joy',
        pronunciation: '/ˈʃeltər/',
        partOfSpeech: 'noun',
        definition: 'A place giving temporary protection from bad weather or danger.',
        example: 'The giant oak tree gave them a dry shelter from the storm.',
      },
      {
        word: 'oak tree',
        translation: 'eman daraxti',
        pronunciation: '/oʊk triː/',
        partOfSpeech: 'noun',
        definition: 'A large forest tree that produces acorns and hard wood.',
        example: 'The giant oak tree stood alone in the wide meadow.',
      },
      {
        word: 'storm',
        translation: 'bo‘ron, kuchli yomg‘ir',
        pronunciation: '/stɔːrm/',
        partOfSpeech: 'noun',
        definition: 'A violent disturbance of the atmosphere with strong winds and rain.',
        example: 'The rainstorm grew stronger as night approached.',
      },
    ],
  },

  {
    id: 'little-red-hen-us',
    title: 'The Little Red Hen (US English)',
    youtubeId: 'G5mUeh901V8',
    accent: 'US English',
    level: 'Beginner',
    category: 'Beginner Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '6:45',
    description:
      'A hardworking hen finds wild berries and decides to bake a cake, but her lazy friends refuse to help until the cake is ready to eat.',
    transcript: [
      {
        id: 'hen-1',
        text: 'The little red hen lives on a farm with a dog, a cat, and a horse.',
        translationUz: 'Kichkina qizil tovuq fermada it, mushuk va ot bilan birga yashaydi.',
      },
      {
        id: 'hen-2',
        text: 'One sunny morning, she finds delicious wild raspberries in the field.',
        translationUz: 'Bir quyoshli tongda u dalada mazali yovvoyi malinalarni topib oladi.',
      },
      {
        id: 'hen-3',
        text: '"Who will help me pick the berries?" asks the little red hen.',
        translationUz: '"Menga malinalarni terishda kim yordam beradi?" deb so‘raydi kichkina qizil tovuq.',
      },
      {
        id: 'hen-4',
        text: '"Not I," says the dog. "Not I," says the cat. "Not I," says the horse.',
        translationUz: '"Men emas," deydi it. "Men emas," deydi mushuk. "Men emas," deydi ot.',
      },
      {
        id: 'hen-5',
        text: '"Then I will do it myself," says the little red hen, and she picks the berries.',
        translationUz: '"U holda buni o‘zim bajaraman," deydi tovuq va malinalarni teradi.',
      },
      {
        id: 'hen-6',
        text: 'She bakes a wonderful raspberry cake with flour, sugar, and milk.',
        translationUz: 'U un, shakar va sut bilan ajoyib malinali pirog pishiradi.',
      },
      {
        id: 'hen-7',
        text: 'When the sweet smell fills the air, all three animals run into the kitchen.',
        translationUz: 'Shirin hid havoga tarqalganda, uchala hayvon ham oshxonaga yugurib keladi.',
      },
      {
        id: 'hen-8',
        text: '"Who will help me eat this cake?" asks the hen.',
        translationUz: '"Bu pirogni yeyishda menga kim yordam beradi?" deb so‘raydi tovuq.',
      },
      {
        id: 'hen-9',
        text: '"I will!" barked the dog. "I will!" purred the cat. "I will!" neighed the horse.',
        translationUz: '"Men!" deb vovilladi it. "Men!" dedi mushuk. "Men!" deb kishnadi ot.',
      },
      {
        id: 'hen-10',
        text: '"No," says the little red hen. "I did all the work, so I will eat it myself!"',
        translationUz: '"Yo‘q," deydi kichik qizil tovuq. "Hamma mehnatni o‘zim qildim, shuning uchun o‘zim yeyman!"',
      },
    ],
    speakingSentences: [
      {
        id: 'hen-sp-1',
        text: 'The little red hen lives on a beautiful farm.',
        translationUz: 'Kichkina qizil tovuq chiroyli fermada yashaydi.',
      },
      {
        id: 'hen-sp-2',
        text: 'Who will help me pick the fresh raspberries?',
        translationUz: 'Menga yangi malinalarni terishda kim yordam beradi?',
      },
      {
        id: 'hen-sp-3',
        text: 'Her lazy friends do not want to help her work.',
        translationUz: 'Uning dangasa do‘stlari unga ishlashda yordam berishni xohlamaydilar.',
      },
      {
        id: 'hen-sp-4',
        text: 'She bakes a delicious raspberry cake in the kitchen.',
        translationUz: 'U oshxonada juda mazali malinali pirog pishiradi.',
      },
      {
        id: 'hen-sp-5',
        text: 'If you want to enjoy the reward, you must help with the work.',
        translationUz: 'Agar mukofotdan bahramand bo‘lishni istasangiz, mehnatda ham yordam berishingiz kerak.',
      },
    ],
    vocabulary: [
      {
        word: 'hen',
        translation: 'tovuq',
        pronunciation: '/hen/',
        partOfSpeech: 'noun',
        definition: 'A female bird, especially of a domestic fowl.',
        example: 'The little red hen lived happily on the farm.',
      },
      {
        word: 'raspberry',
        translation: 'malina',
        pronunciation: '/ˈræz.ber.i/',
        partOfSpeech: 'noun',
        definition: 'An edible soft fruit related to the blackberry, consisting of a cluster of reddish-pink drupelets.',
        example: 'She picked fresh wild raspberries for the cake.',
      },
      {
        word: 'lazy',
        translation: 'dangasa, erinchoq',
        pronunciation: '/ˈleɪ.zi/',
        partOfSpeech: 'adjective',
        definition: 'Unwilling to work or use energy.',
        example: 'The lazy cat slept on the sunny porch all afternoon.',
      },
      {
        word: 'bake',
        translation: 'pishirmoq (pechda)',
        pronunciation: '/beɪk/',
        partOfSpeech: 'verb',
        definition: 'Cook food by dry heat without direct exposure to a flame, typically in an oven.',
        example: 'She decided to bake a warm cake for breakfast.',
      },
      {
        word: 'reward',
        translation: 'mukofot, natija',
        pronunciation: '/rɪˈwɔːrd/',
        partOfSpeech: 'noun',
        definition: 'A thing given in recognition of service, effort, or achievement.',
        example: 'Eating the delicious cake was her well-deserved reward.',
      },
    ],
  },

  {
    id: 'bear-bee-us',
    title: 'The Bear and the Bee (US English)',
    youtubeId: 'jKi2SvWOCXc',
    accent: 'US English',
    level: 'Beginner',
    category: 'Beginner Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '4:30',
    description:
      'A hungry bear tries to steal sweet honey from a beehive and learns a valuable lesson about patience and controlling his temper.',
    transcript: [
      {
        id: 'bear-1',
        text: 'Mr. Bear is walking through the sunny woods looking for a snack.',
        translationUz: 'Janob Ayiq yegulik izlab quyoshli o‘rmon bo‘ylab yurmoqda.',
      },
      {
        id: 'bear-2',
        text: 'He smells sweet golden honey in the warm summer air.',
        translationUz: 'U iliq yozgi havoda shirin tilla rang asal hidini sezadi.',
      },
      {
        id: 'bear-3',
        text: 'Up in a tall tree, he spots a busy beehive full of bees.',
        translationUz: 'Baland daraxt tepasida u arilarga to‘la gavjum ari uyasini ko‘radi.',
      },
      {
        id: 'bear-4',
        text: 'A little bee buzzes down and says, "Please leave our honey alone!"',
        translationUz: 'Kichik ari uchib tushib: "Iltimos, asalimizga tegmang!" deydi.',
      },
      {
        id: 'bear-5',
        text: 'Mr. Bear gets angry and tries to smash the hive with his big paws.',
        translationUz: 'Janob Ayiq g‘azablanib, katta panjalari bilan uyani urib buzishga urinadi.',
      },
      {
        id: 'bear-6',
        text: 'The angry swarm chases him all the way to the cold lake.',
        translationUz: 'G‘azablangan ari to‘dasi uni sovuq ko‘lgacha quvib boradi.',
      },
      {
        id: 'bear-7',
        text: 'He jumps into the deep water to escape their sharp stings.',
        translationUz: 'U ularning o‘tkir nishlaridan qochish uchun chuqur suvga sakraydi.',
      },
      {
        id: 'bear-8',
        text: 'It is always wiser to stay calm than to lose your temper.',
        translationUz: 'G‘azabga erk bergandan ko‘ra, doimo xotirjam bo‘lish ancha oqilonadir.',
      },
    ],
    speakingSentences: [
      {
        id: 'bear-sp-1',
        text: 'Mr. Bear is walking through the sunny woods.',
        translationUz: 'Janob Ayiq quyoshli o‘rmon bo‘ylab ketmoqda.',
      },
      {
        id: 'bear-sp-2',
        text: 'He smells sweet honey in the warm summer air.',
        translationUz: 'U iliq yozgi havoda shirin asal hidini sezadi.',
      },
      {
        id: 'bear-sp-3',
        text: 'The little bee buzzes around the tall green tree.',
        translationUz: 'Kichkina ari baland yashil daraxt atrofida g‘o‘ng‘illaydi.',
      },
      {
        id: 'bear-sp-4',
        text: 'He jumps into the cold lake to escape the bees.',
        translationUz: 'U arilardan qochish uchun sovuq ko‘lga sakraydi.',
      },
      {
        id: 'bear-sp-5',
        text: 'Patience and kindness always bring better results.',
        translationUz: 'Sabr va muloyimlik doimo yaxshiroq natija keltiradi.',
      },
    ],
    vocabulary: [
      {
        word: 'beehive',
        translation: 'ari uyasi',
        pronunciation: '/ˈbiː.haɪv/',
        partOfSpeech: 'noun',
        definition: 'A structure in which bees are kept, typically in the form of a dome or box.',
        example: 'Honey bees work tirelessly inside the beehive.',
      },
      {
        word: 'honey',
        translation: 'asal',
        pronunciation: '/ˈhʌn.i/',
        partOfSpeech: 'noun',
        definition: 'A sweet, sticky yellowish-brown fluid made by bees and other insects from nectar.',
        example: 'Bears love eating natural sweet honey.',
      },
      {
        word: 'sting',
        translation: 'chaqmoq, nish urmoq',
        pronunciation: '/stɪŋ/',
        partOfSpeech: 'verb',
        definition: 'Wound or pierce with a sting (by an insect or plant).',
        example: 'The bees threatened to sting the careless bear.',
      },
      {
        word: 'temper',
        translation: 'jahli, fe‘li',
        pronunciation: '/ˈtem.pər/',
        partOfSpeech: 'noun',
        definition: 'A person or animal\'s state of mind seen in terms of their being angry or calm.',
        example: 'Losing your temper often makes problems worse.',
      },
      {
        word: 'woods',
        translation: 'o‘rmon, to‘qayzor',
        pronunciation: '/wʊdz/',
        partOfSpeech: 'noun',
        definition: 'An area of land, smaller than a forest, that is covered with growing trees.',
        example: 'They strolled quietly through the pine woods.',
      },
    ],
  },

  {
    id: 'wind-sun-us',
    title: 'The Wind and the Sun (US English)',
    youtubeId: 'l0Z8A4u3CtI',
    accent: 'US English',
    level: 'Elementary',
    category: 'Elementary Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '4:50',
    description:
      'The North Wind and the warm Sun have an argument about who is stronger, and decide to test their powers on a traveler with a coat.',
    transcript: [
      {
        id: 'ws-1',
        text: 'One afternoon, the Wind and the Sun argue over who is the most powerful.',
        translationUz: 'Bir kuni tushdan keyin Shamol va Quyosh kim kuchliroq ekanligi ustida bahslashadilar.',
      },
      {
        id: 'ws-2',
        text: '"I am stronger! I can blow down giant trees!" boasts the North Wind.',
        translationUz: '"Men kuchliroqman! Men ulkan daraxtlarni ag‘dara olaman!" deb maqtanadi Shimol Shamoli.',
      },
      {
        id: 'ws-3',
        text: 'The Sun smiles and points to a man walking along the road wearing a thick coat.',
        translationUz: 'Quyosh jilmayib, yo‘lda qalin palto kiyib ketayotgan odamga ishora qiladi.',
      },
      {
        id: 'ws-4',
        text: '"Whoever can make that traveler take off his coat is the winner," says the Sun.',
        translationUz: '"Qaysi birimiz o‘sha yo‘lovchining paltosini yechishga majbur qilsak, o‘sha g‘olib bo‘ladi," deydi Quyosh.',
      },
      {
        id: 'ws-5',
        text: 'The Wind blows with all his might, freezing cold and violent.',
        translationUz: 'Shamol bor kuchi bilan muzdek sovuq va shiddatli esadi.',
      },
      {
        id: 'ws-6',
        text: 'The harder the Wind blows, the tighter the traveler wraps his coat.',
        translationUz: 'Shamol qanchalik qattiq essa, yo‘lovchi paltosiga shunchalik mahkam o‘ranadi.',
      },
      {
        id: 'ws-7',
        text: 'Then the Sun begins to shine gently with warm, bright golden light.',
        translationUz: 'So‘ngra Quyosh iliq, yorqin tilla nur bilan mayin charaqlay boshlaydi.',
      },
      {
        id: 'ws-8',
        text: 'The air turns pleasant and warm, and the traveler unbuttons his coat.',
        translationUz: 'Havo yoqimli va iliq bo‘lib, yo‘lovchi paltosining tugmalarini yechadi.',
      },
      {
        id: 'ws-9',
        text: 'Soon, feeling hot, the man happily takes off his coat and carries it.',
        translationUz: 'Tez orada issiq his qilib, odam mamnun holda paltosini yechib, qo‘liga oladi.',
      },
      {
        id: 'ws-10',
        text: 'Gentleness and warmth can accomplish what force and fury never can.',
        translationUz: 'Muloyimlik va mehr-oqibat kuch va g‘azab hech qachon yetolmaydigan maqsadlarga erisha oladi.',
      },
    ],
    speakingSentences: [
      {
        id: 'ws-sp-1',
        text: 'The Wind and the Sun argue over who is stronger.',
        translationUz: 'Shamol va Quyosh kim kuchliroq deb bahslashadilar.',
      },
      {
        id: 'ws-sp-2',
        text: 'The North Wind blows with all his fierce power.',
        translationUz: 'Shimol shamoli bor shiddatli kuchi bilan esadi.',
      },
      {
        id: 'ws-sp-3',
        text: 'The man wraps his warm coat tightly around himself.',
        translationUz: 'Kishi issiq paltosini o‘ziga mahkam o‘rab oladi.',
      },
      {
        id: 'ws-sp-4',
        text: 'The Sun shines gently with pleasant golden light.',
        translationUz: 'Quyosh yoqimli tilla nur bilan mayin charaqlaydi.',
      },
      {
        id: 'ws-sp-5',
        text: 'Gentleness and kindness are stronger than harsh fury.',
        translationUz: 'Muloyimlik va mehr qattiqqo‘l g‘azabdan kuchliroqdir.',
      },
    ],
    vocabulary: [
      {
        word: 'argue',
        translation: 'bahslashmoq, tortishmoq',
        pronunciation: '/ˈɑːrɡ.juː/',
        partOfSpeech: 'verb',
        definition: 'Give reasons or cite evidence in support of an idea or dispute.',
        example: 'They often argue about who is right.',
      },
      {
        word: 'gentle',
        translation: 'mayin, muloyim',
        pronunciation: '/ˈdʒen.təl/',
        partOfSpeech: 'adjective',
        definition: 'Having or showing a mild, kind, or tender temperament or character.',
        example: 'A gentle summer breeze cooled the afternoon.',
      },
      {
        word: 'traveler',
        translation: 'yo‘lovchi, sayyoh',
        pronunciation: '/ˈtræv.əl.ər/',
        partOfSpeech: 'noun',
        definition: 'A person who is traveling or often travels.',
        example: 'The weary traveler stopped to drink cool water.',
      },
      {
        word: 'accomplish',
        translation: 'erishmoq, uddalamoq',
        pronunciation: '/əˈkɑːm.plɪʃ/',
        partOfSpeech: 'verb',
        definition: 'Achieve or complete successfully.',
        example: 'Kind words can accomplish miracles.',
      },
      {
        word: 'fury',
        translation: 'shiddat, qahr-g‘azab',
        pronunciation: '/ˈfjʊr.i/',
        partOfSpeech: 'noun',
        definition: 'Wild or violent anger or extreme force.',
        example: 'The storm released all its fury on the coast.',
      },
    ],
  },

  {
    id: 'ice-cream-truck-us',
    title: 'The Girl and the Ice Cream Truck (US English)',
    youtubeId: '1DeQVnSxcLk',
    accent: 'US English',
    level: 'Beginner',
    category: 'Daily English',
    source: 'TheFableCottage.com / YouTube',
    duration: '5:20',
    description:
      'A cheerful story about summer days, waiting for the neighborhood ice cream truck, and learning to make choices with happiness.',
    transcript: [
      {
        id: 'ice-1',
        text: 'On hot summer afternoons, the ice cream truck drives through the street.',
        translationUz: 'Issiq yoz kunlarida muzqaymoq mashinasi ko‘cha bo‘ylab o‘tadi.',
      },
      {
        id: 'ice-2',
        text: 'Children hear the cheerful music playing from far away.',
        translationUz: 'Bolalar uzoqdan yangrab kelayotgan quvnoq musiqani eshitishadi.',
      },
      {
        id: 'ice-3',
        text: 'Emma runs out into the front yard with her shiny coins.',
        translationUz: 'Emma yaltiroq tangalarini ushlab hovliga yugurib chiqadi.',
      },
      {
        id: 'ice-4',
        text: 'There are so many wonderful flavors: chocolate, strawberry, and vanilla!',
        translationUz: 'U yerda juda ko‘p ajoyib ta‘mlar bor: shokolad, qulupnay va vanil!',
      },
      {
        id: 'ice-5',
        text: 'She orders a big double cone with colorful rainbow sprinkles.',
        translationUz: 'U rang-barang kamalak sepilgan katta ikkitalik quymoqli muzqaymoq buyurtma qiladi.',
      },
      {
        id: 'ice-6',
        text: 'Sharing a cold treat with friends makes a sunny day unforgettable.',
        translationUz: 'Muzdek shirinlikni do‘stlar bilan baham ko‘rish quyoshli kunni unutilmas qiladi.',
      },
    ],
    speakingSentences: [
      {
        id: 'ice-sp-1',
        text: 'The ice cream truck plays cheerful music down our street.',
        translationUz: 'Muzqaymoq mashinasi bizning ko‘chada quvnoq musiqa chaladi.',
      },
      {
        id: 'ice-sp-2',
        text: 'I would like two scoops of strawberry ice cream, please.',
        translationUz: 'Menga ikki qoshiq qulupnayli muzqaymoq berib yuboring, iltimos.',
      },
      {
        id: 'ice-sp-3',
        text: 'Rainbow sprinkles make everything look festive and fun.',
        translationUz: 'Rang-barang sepilgan bezaklar hamma narsani bayramona qiladi.',
      },
      {
        id: 'ice-sp-4',
        text: 'We love sharing sweet cold treats on sunny days.',
        translationUz: 'Biz quyoshli kunlarda shirin muzdek taomlarni baham ko‘rishni yaxshi ko‘ramiz.',
      },
    ],
    vocabulary: [
      {
        word: 'flavor',
        translation: 'ta‘m, maza',
        pronunciation: '/ˈfleɪ.vər/',
        partOfSpeech: 'noun',
        definition: 'The distinctive taste of a food or drink.',
        example: 'Vanilla is her absolute favorite ice cream flavor.',
      },
      {
        word: 'sprinkles',
        translation: 'rangli sepiladigan bezak (shakar)',
        pronunciation: '/ˈsprɪŋ.kəlz/',
        partOfSpeech: 'noun',
        definition: 'Tiny sugar candies used to decorate cakes and ice cream.',
        example: 'Chocolate sprinkles topped the dessert.',
      },
      {
        word: 'cone',
        translation: 'vafli konusi (muzqaymoq uchun)',
        pronunciation: '/koʊn/',
        partOfSpeech: 'noun',
        definition: 'A crisp, cone-shaped wafer used to hold ice cream.',
        example: 'He bought a crunchy waffle cone.',
      },
      {
        word: 'cheerful',
        translation: 'quvnoq, xushchaqchaq',
        pronunciation: '/ˈtʃɪr.fəl/',
        partOfSpeech: 'adjective',
        definition: 'Noticeably happy and optimistic.',
        example: 'The music from the truck was cheerful and upbeat.',
      },
    ],
  },

  // ========================================================
  // 🇬🇧 UK ENGLISH FABLES & STORIES (@TheFableCottage)
  // ========================================================
  {
    id: 'jack-beanstalk-uk',
    title: 'Jack and the Beanstalk (UK English)',
    youtubeId: '9a9qNLUpkV8',
    accent: 'UK English',
    level: 'Elementary',
    category: 'Elementary Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '13:44',
    description:
      'Jack trades his beloved cow for magic beans. Overnight, a giant beanstalk reaches the clouds, leading him to a towering castle and unexpected riches.',
    transcript: [
      {
        id: 'jack-1',
        text: 'Jack and his mother live on a small cottage farm with their old dairy cow.',
        translationUz: 'Jek va uning onasi kichik qishloq uyida keksa sog‘in sigirlari bilan yashaydilar.',
      },
      {
        id: 'jack-2',
        text: 'When times grow hard, Jack takes the cow to the village market to sell her.',
        translationUz: 'Qiyin kunlar kelganda, Jek sigirni sotish uchun qishloq bozoriga olib boradi.',
      },
      {
        id: 'jack-3',
        text: 'Along the path, an old man offers five magic beans in exchange for the cow.',
        translationUz: 'Yo‘l bo‘yida bir chol sigir evaziga beshta sehrli loviyani taklif qiladi.',
      },
      {
        id: 'jack-4',
        text: 'His mother is furious and tosses the beans out of the window into the garden.',
        translationUz: 'Uning onasi juda g‘azablanib, loviyalarni derazadan bog‘ga uloqtirib yuboradi.',
      },
      {
        id: 'jack-5',
        text: 'By the next morning, a colossal beanstalk has grown high above the clouds.',
        translationUz: 'Ertasi kuni ertalab bahaybat loviya poyasi bulutlardan ham baland o‘sib ketadi.',
      },
      {
        id: 'jack-6',
        text: 'Jack climbs higher and higher until he discovers a breathtaking stone castle.',
        translationUz: 'Jek hayratlanarli tosh qasrni ko‘rmaguncha yuqoriga va yuqoriga tirmashib chiqadi.',
      },
      {
        id: 'jack-7',
        text: 'Inside dwells a greedy giant with a magical hen that lays pure golden eggs.',
        translationUz: 'Ichkarida sof oltin tuxum qo‘yadigan sehrli tovuqli ochko‘z dev yashaydi.',
      },
      {
        id: 'jack-8',
        text: 'Jack bravely outsmarts the sleeping giant and chops down the beanstalk.',
        translationUz: 'Jek uxlab yotgan devni donolik bilan chalg‘itadi va loviya poyasini chopib tashlaydi.',
      },
      {
        id: 'jack-9',
        text: 'With the golden hen, Jack and his mother never go hungry again.',
        translationUz: 'Oltin tovuq tufayli Jek va uning onasi boshqa hech qachon och qolmaydilar.',
      },
    ],
    speakingSentences: [
      {
        id: 'jack-sp-1',
        text: 'Jack traded his cow for five magical beans.',
        translationUz: 'Jek sigirini beshta sehrli loviyaga almashtirdi.',
      },
      {
        id: 'jack-sp-2',
        text: 'A colossal beanstalk grew right up to the white clouds.',
        translationUz: 'Bahaybat loviya poyasi oq bulutlargacha o‘sib chiqdi.',
      },
      {
        id: 'jack-sp-3',
        text: 'He climbed up the giant green vine with great courage.',
        translationUz: 'U ulkan yashil poyaga katta jasorat bilan ko‘tarildi.',
      },
      {
        id: 'jack-sp-4',
        text: 'The magical hen lays gleaming golden eggs every morning.',
        translationUz: 'Sehrli tovuq har tongda yaltiragan oltin tuxum qo‘yadi.',
      },
      {
        id: 'jack-sp-5',
        text: 'Quick thinking and bravery helped Jack save his family.',
        translationUz: 'Tezkor fikrlash va mardlik Jekka o‘z oilasini qutqarishga yordam berdi.',
      },
    ],
    vocabulary: [
      {
        word: 'beanstalk',
        translation: 'loviya poyasi',
        pronunciation: '/ˈbiːn.stɔːk/',
        partOfSpeech: 'noun',
        definition: 'The stem of a bean plant, especially a climbing one.',
        example: 'The beanstalk stretched high above the clouds.',
      },
      {
        word: 'giant',
        translation: 'dev, bahaybat maxluq',
        pronunciation: '/ˈdʒaɪ.ənt/',
        partOfSpeech: 'noun',
        definition: 'An imaginary or mythical being of human form but superhuman size and strength.',
        example: 'A thunderous giant lived inside the cloud fortress.',
      },
      {
        word: 'colossal',
        translation: 'ulkan, bahaybat',
        pronunciation: '/kəˈlɑː.səl/',
        partOfSpeech: 'adjective',
        definition: 'Extremely large or great in size.',
        example: 'A colossal green plant grew overnight in their yard.',
      },
      {
        word: 'castle',
        translation: 'qasr, qal‘a',
        pronunciation: '/ˈkɑː.səl/',
        partOfSpeech: 'noun',
        definition: 'A large building, typically of the medieval period, fortified against attack.',
        example: 'The stone castle stood perched above the mountain mist.',
      },
      {
        word: 'outsmart',
        translation: 'ayyorlik bilan yengmoq, donolik qilmoq',
        pronunciation: '/ˌaʊtˈsmɑːrt/',
        partOfSpeech: 'verb',
        definition: 'Defeat or get the better of someone by being cleverer than they are.',
        example: 'Jack managed to outsmart the grumpy giant.',
      },
    ],
  },

  {
    id: 'bear-bee-uk',
    title: 'The Bear and the Bee (UK English)',
    youtubeId: '9Q2t6o5TlwI',
    accent: 'UK English',
    level: 'Beginner',
    category: 'Beginner Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '4:28',
    description:
      'Told in a refined British accent, the classic fable of Mr. Bear who loses his calm over a little bee and finds himself in rather sticky trouble.',
    transcript: [
      {
        id: 'bb-uk-1',
        text: 'In an ancient British woodland, Mr. Bear is searching for something delicious.',
        translationUz: 'Qadimiy ingliz o‘rmonida Janob Ayiq mazali narsa izlamoqda.',
      },
      {
        id: 'bb-uk-2',
        text: 'He catches the sweet aroma of honey drifting on the gentle breeze.',
        translationUz: 'U mayin shabada uchib kelayotgan asalning yoqimli iforini sezadi.',
      },
      {
        id: 'bb-uk-3',
        text: 'A solitary bee warns him politely to keep away from the hive.',
        translationUz: 'Yolg‘iz ari undan uyadan uzoqroq turishni xushmuomalalik bilan so‘raydi.',
      },
      {
        id: 'bb-uk-4',
        text: 'Becoming furious, the bear strikes the tree trunk with his powerful claws.',
        translationUz: 'G‘azablangan ayiq o‘zining baquvvat tirnoqlari bilan daraxt tanasiga zarba beradi.',
      },
      {
        id: 'bb-uk-5',
        text: 'Instantly, hundreds of buzzing bees pour out to protect their home.',
        translationUz: 'Bir lahzada yuzlab g‘o‘ng‘illagan arilar o‘z uylarini himoya qilish uchun yopirilib chiqadi.',
      },
      {
        id: 'bb-uk-6',
        text: 'The bear dashes through the briars and dives straight into the pond.',
        translationUz: 'Ayiq tikanzorlar orasidan yugurib o‘tib, to‘g‘ri ko‘lmakka sho‘ng‘iydi.',
      },
    ],
    speakingSentences: [
      {
        id: 'bb-uk-sp-1',
        text: 'Mr. Bear was wandering through the tranquil woodland.',
        translationUz: 'Janob Ayiq osoyishta o‘rmonzor bo‘ylab sayr qilib yurgan edi.',
      },
      {
        id: 'bb-uk-sp-2',
        text: 'A polite little bee warned him to stay away.',
        translationUz: 'Odobli mitti ari uni uzoqroq turishdan ogohlantirdi.',
      },
      {
        id: 'bb-uk-sp-3',
        text: 'He dashed through the forest and plunged into the river.',
        translationUz: 'U o‘rmondan chopib o‘tib, daryoga sho‘ng‘idi.',
      },
      {
        id: 'bb-uk-sp-4',
        text: 'A calm mind prevents unnecessary trouble.',
        translationUz: 'Vazmin aql ortiqcha tashvishlarning oldini oladi.',
      },
    ],
    vocabulary: [
      {
        word: 'woodland',
        translation: 'o‘rmonzor, daraxtzor',
        pronunciation: '/ˈwʊd.lənd/',
        partOfSpeech: 'noun',
        definition: 'Land covered with trees; a wood or forest.',
        example: 'Deer grazed quietly in the shaded woodland.',
      },
      {
        word: 'tranquil',
        translation: 'osoyishta, sokin',
        pronunciation: '/ˈtræŋ.kwɪl/',
        partOfSpeech: 'adjective',
        definition: 'Free from disturbance; calm and peaceful.',
        example: 'The tranquil lake mirrored the blue morning sky.',
      },
      {
        word: 'polite',
        translation: 'odobli, xushmuomala',
        pronunciation: '/pəˈlaɪt/',
        partOfSpeech: 'adjective',
        definition: 'Having or showing behaviour that is respectful and considerate of other people.',
        example: 'Always be polite when asking someone for assistance.',
      },
      {
        word: 'plunge',
        translation: 'sho‘ng‘imoq, sakramoq',
        pronunciation: '/plʌndʒ/',
        partOfSpeech: 'verb',
        definition: 'Jump or dive quickly and energetically.',
        example: 'The swimmers plunged into the refreshing cool water.',
      },
    ],
  },

  {
    id: 'wind-sun-uk',
    title: 'The Wind and the Sun (UK English)',
    youtubeId: '_z6ZIwKu1bY',
    accent: 'UK English',
    level: 'Elementary',
    category: 'Elementary Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '4:45',
    description:
      'Narrated with British pronunciation. Aesop’s eternal wisdom showing that warmth and diplomacy triumph where brute strength utterly fails.',
    transcript: [
      {
        id: 'ws-uk-1',
        text: 'The Wind and the Sun were having a heated dispute in the heavens.',
        translationUz: 'Shamol va Quyosh osmonda qizg‘in bahs olib borishayotgan edi.',
      },
      {
        id: 'ws-uk-2',
        text: '"Look at that gentleman in the woollen cloak," remarked the Sun.',
        translationUz: '"Anavi jun plash kiygan janobga qara," dedi Quyosh.',
      },
      {
        id: 'ws-uk-3',
        text: 'The Wind roared with icy gales, shaking the trees and fields.',
        translationUz: 'Shamol muzdek bo‘ronlar bilan guvillab, daraxtlar va dalalarni larzaga keltirdi.',
      },
      {
        id: 'ws-uk-4',
        text: 'Yet the traveler only buttoned his heavy garment tighter.',
        translationUz: 'Biroq yo‘lovchi og‘ir kiyimini yanada mahkamroq tugmalab oldi.',
      },
      {
        id: 'ws-uk-5',
        text: 'When the Sun dispersed the clouds and beamed warm golden rays, the man smiled.',
        translationUz: 'Quyosh bulutlarni tarqatib, iliq tilla nurlar sochganda, kishi jilmaydi.',
      },
      {
        id: 'ws-uk-6',
        text: 'He willingly slipped off his coat, yielding to the gentle warmth.',
        translationUz: 'U mayin iliqlikdan mamnun bo‘lib, o‘z ixtiyori bilan paltosini yechdi.',
      },
    ],
    speakingSentences: [
      {
        id: 'ws-uk-sp-1',
        text: 'The Wind and the Sun were having a gentle debate.',
        translationUz: 'Shamol va Quyosh mayin bahs olib borishmoqda edi.',
      },
      {
        id: 'ws-uk-sp-2',
        text: 'The gentleman buttoned his thick woollen cloak.',
        translationUz: 'Janob o‘zining qalin jun plashini tugmalab oldi.',
      },
      {
        id: 'ws-uk-sp-3',
        text: 'The sun beamed down warm and comforting rays.',
        translationUz: 'Quyosh iliq va tasalli beruvchi nurlarini sochdi.',
      },
      {
        id: 'ws-uk-sp-4',
        text: 'Warmth and courtesy achieve more than harsh force.',
        translationUz: 'Iliqlik va xushmuomalalik qo‘pol kuchdan ko‘ra ko‘proq narsaga erishadi.',
      },
    ],
    vocabulary: [
      {
        word: 'cloak',
        translation: 'plash, plash-chopon',
        pronunciation: '/kloʊk/',
        partOfSpeech: 'noun',
        definition: 'An outdoor overgarment, typically sleeveless, that hangs loosely from the shoulders.',
        example: 'He wrapped his velvet cloak around his shoulders.',
      },
      {
        word: 'dispute',
        translation: 'bahs, ixtilof',
        pronunciation: '/dɪˈspjuːt/',
        partOfSpeech: 'noun',
        definition: 'A disagreement, argument, or debate.',
        example: 'The dispute was settled through peaceful conversation.',
      },
      {
        word: 'courtesy',
        translation: 'odob, muloyimlik',
        pronunciation: '/ˈkɜː.tə.si/',
        partOfSpeech: 'noun',
        definition: 'The showing of politeness in one\'s attitude and behaviour towards others.',
        example: 'A little courtesy goes a remarkably long way.',
      },
      {
        word: 'beam',
        translation: 'nur sochmoq, charaqlamoq',
        pronunciation: '/biːm/',
        partOfSpeech: 'verb',
        definition: 'Shine brightly or smile radiantly.',
        example: 'The morning sun beamed across the valley.',
      },
    ],
  },

  {
    id: 'snow-white-uk',
    title: 'Snow White (UK English)',
    youtubeId: 'wtMUy_3NGl4',
    accent: 'UK English',
    level: 'Intermediate',
    category: 'Elementary Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '11:15',
    description:
      'The classic fairy tale of Snow White, a vain queen with a magic mirror, and seven friendly dwarfs living in an enchanted forest cottage.',
    transcript: [
      {
        id: 'sw-1',
        text: 'Once upon a time, a beautiful princess named Snow White lived in a grand castle.',
        translationUz: 'Qadim zamonda Oqoy (Snow White) ismli go‘zal malika muhtasham qasrda yashagan edi.',
      },
      {
        id: 'sw-2',
        text: 'Her stepmother, the Queen, had a magical mirror that answered any question truthfully.',
        translationUz: 'Uning o‘gay onasi qirolichada har qanday savolga rost javob beradigan sehrli ko‘zgu bor edi.',
      },
      {
        id: 'sw-3',
        text: '"Mirror, mirror on the wall, who is the fairest of them all?" she asked.',
        translationUz: '"Ko‘zgujonim, ayt menga, dunyoda kim eng go‘zal?" deb so‘radi u.',
      },
      {
        id: 'sw-4',
        text: 'Fleeing into the deep woods, Snow White discovers a cozy cottage belonging to seven miners.',
        translationUz: 'Qalin o‘rmonga qochib borgan Oqoy yetti konchiga tegishli shinam uychani topadi.',
      },
      {
        id: 'sw-5',
        text: 'With kindness, loyalty, and courage, true friendship overcomes all wickedness.',
        translationUz: 'Mehribonlik, sadoqat va jasorat bilan haqiqiy do‘stlik barcha yovuzlikni yengadi.',
      },
    ],
    speakingSentences: [
      {
        id: 'sw-sp-1',
        text: 'Mirror, mirror on the wall, who is the fairest of them all?',
        translationUz: 'Ko‘zgujonim, ayt menga, dunyoda kim eng go‘zal?',
      },
      {
        id: 'sw-sp-2',
        text: 'Snow White discovered a cozy cottage deep in the forest.',
        translationUz: 'Oqoy o‘rmon bag‘rida shinam uychani topib oldi.',
      },
      {
        id: 'sw-sp-3',
        text: 'The seven dwarfs welcomed her with great warmth and joy.',
        translationUz: 'Yetti gnom uni katta iliqlik va quvonch bilan kutib oldilar.',
      },
      {
        id: 'sw-sp-4',
        text: 'True inner beauty and kindness shine brighter than vanity.',
        translationUz: 'Haqiqiy ichki go‘zallik va mehribonlik kalondimog‘likdan yorqinroq nur taratadi.',
      },
    ],
    vocabulary: [
      {
        word: 'fair',
        translation: 'go‘zal, maftunkor (shuningdek odil)',
        pronunciation: '/feər/',
        partOfSpeech: 'adjective',
        definition: 'Beautiful; pleasant to look at.',
        example: 'She was known as the fairest maiden in all the realm.',
      },
      {
        word: 'cottage',
        translation: 'dala hovli, shinam uycha',
        pronunciation: '/ˈkɒt.ɪdʒ/',
        partOfSpeech: 'noun',
        definition: 'A small simple house, typically one in the country.',
        example: 'They spent the holiday in a secluded country cottage.',
      },
      {
        word: 'dwarf',
        translation: 'gnom, pakana odam',
        pronunciation: '/dwɔːf/',
        partOfSpeech: 'noun',
        definition: 'In fairy tales, a member of a mythical race of short, stout humanoid beings skilled in mining.',
        example: 'The friendly dwarfs mined glittering jewels in the mountains.',
      },
      {
        word: 'vanity',
        translation: 'kibr, o‘ziga bino qo‘yish',
        pronunciation: '/ˈvæn.ə.ti/',
        partOfSpeech: 'noun',
        definition: 'Excessive pride in or admiration of one\'s own appearance or achievements.',
        example: 'The Queen\'s foolish vanity led to her own downfall.',
      },
    ],
  },

  {
    id: 'chicken-little-uk',
    title: 'Chicken Little (UK English)',
    youtubeId: 'ZCBIAmtaKuA',
    accent: 'UK English',
    level: 'Beginner',
    category: 'Beginner Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '6:10',
    description:
      'Chicken Little reads a sensational headline on the internet and hysterically warns the whole barnyard that the sky is falling down!',
    transcript: [
      {
        id: 'cl-1',
        text: 'Chicken Little is browsing on his tablet beneath a shady apple tree.',
        translationUz: 'Kichkina Jo‘ja soyali olma daraxti ostida planshetini ko‘rib o‘tiradi.',
      },
      {
        id: 'cl-2',
        text: 'Suddenly, a ripe red apple drops right on his feathers.',
        translationUz: 'To‘satdan pishgan qizil olma to‘g‘ri uning patlari ustiga tushadi.',
      },
      {
        id: 'cl-3',
        text: 'He glances at the screen and misreads a scary internet rumor.',
        translationUz: 'U ekranga qaraydi va dahshatli internet mish-mishini noto‘g‘ri o‘qiydi.',
      },
      {
        id: 'cl-4',
        text: '"Help! The sky is collapsing! We must tell the King at once!" he shrieks.',
        translationUz: '"Yordam bering! Osmon qulamoqda! Darhol Qirolga xabar berishimiz kerak!" deb qichqiradi.',
      },
      {
        id: 'cl-5',
        text: 'Along the way, he panics Henny Penny, Ducky Lucky, and Goosey Loosey.',
        translationUz: 'Yo‘l-yo‘lakay u barcha hayvonlarni sarosimaga solib, vahima ko‘taradi.',
      },
      {
        id: 'cl-6',
        text: 'Always check the facts carefully before spreading frightening rumors.',
        translationUz: 'Qo‘rqinchli mish-mishlarni tarqatishdan oldin doimo faktlarni yaxshilab tekshiring.',
      },
    ],
    speakingSentences: [
      {
        id: 'cl-sp-1',
        text: 'An apple dropped directly on his little head.',
        translationUz: 'Olma to‘g‘ri uning kichkina boshiga tushdi.',
      },
      {
        id: 'cl-sp-2',
        text: 'We must verify the facts before believing headlines.',
        translationUz: 'Sarlavhalarga ishonishdan oldin faktlarni tasdiqlashimiz shart.',
      },
      {
        id: 'cl-sp-3',
        text: 'Do not spread panic when there is no real danger.',
        translationUz: 'Haqiqiy xavf bo‘lmaganda sarosima tarqatmang.',
      },
      {
        id: 'cl-sp-4',
        text: 'Wisdom means thinking clearly in every situation.',
        translationUz: 'Donolik — har qanday vaziyatda tiniq fikrlash demakdir.',
      },
    ],
    vocabulary: [
      {
        word: 'headline',
        translation: 'sarlavha, yangilik sarlavhasi',
        pronunciation: '/ˈhed.laɪn/',
        partOfSpeech: 'noun',
        definition: 'A heading at the top of an article or page in a newspaper or news website.',
        example: 'Clickbait headlines often exaggerate ordinary events.',
      },
      {
        word: 'rumor',
        translation: 'mish-mish, ovoza',
        pronunciation: '/ˈruː.mər/',
        partOfSpeech: 'noun',
        definition: 'A currently circulating story or report of uncertain or doubtful truth.',
        example: 'Never believe an unconfirmed rumor without reliable proof.',
      },
      {
        word: 'panic',
        translation: 'sarosima, vahima',
        pronunciation: '/ˈpæn.ɪk/',
        partOfSpeech: 'noun',
        definition: 'Sudden uncontrollable fear or anxiety, often causing wildly unthinking behaviour.',
        example: 'Take a deep breath and stay calm to avoid panic.',
      },
      {
        word: 'collapse',
        translation: 'qulamoq, qulab tushmoq',
        pronunciation: '/kəˈlæps/',
        partOfSpeech: 'verb',
        definition: 'Fall down or give way suddenly.',
        example: 'The old wooden bridge collapsed during the storm.',
      },
    ],
  },

  {
    id: 'frightened-lion-uk',
    title: 'The Frightened Lion (UK English)',
    youtubeId: 'rF8GM3NItq0',
    accent: 'UK English',
    level: 'Beginner',
    category: 'Beginner Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '4:55',
    description:
      'The king of the jungle is ashamed because he is secretly terrified of a rooster’s crow, until he learns an enlightening secret from an elephant.',
    transcript: [
      {
        id: 'fl-1',
        text: 'The lion had mighty claws, sharp teeth, and a majestic golden mane.',
        translationUz: 'Sherning qudratli tirnoqlari, o‘tkir tishlari va mahobatli tilla yoli bor edi.',
      },
      {
        id: 'fl-2',
        text: 'Yet every dawn, when the rooster crowed, the lion trembled with fear.',
        translationUz: 'Biroq har tongda xo‘roz qichqirganda, sher qo‘rquvdan qaltirardi.',
      },
      {
        id: 'fl-3',
        text: 'He felt deeply ashamed that a creature so big was frightened by something so small.',
        translationUz: 'U shunday katta maxluq bo‘la turib, shunday kichik narsadan qo‘rqqanidan qattiq uyalardi.',
      },
      {
        id: 'fl-4',
        text: 'He meets a massive elephant who shivers in panic whenever a mosquito buzzes.',
        translationUz: 'U chivin g‘o‘ng‘illaganda sarosimaga tushib titraydigan ulkan filni uchratadi.',
      },
      {
        id: 'fl-5',
        text: 'The lion smiles and realizes that every creature in the world carries some fear.',
        translationUz: 'Sher jilmayadi va dunyodagi har bir jonzot nimadandir qo‘rqishini tushunib yetadi.',
      },
    ],
    speakingSentences: [
      {
        id: 'fl-sp-1',
        text: 'The mighty lion had great power and a loud roar.',
        translationUz: 'Qudratli sher ulkan kuchga va baland na‘raga ega edi.',
      },
      {
        id: 'fl-sp-2',
        text: 'He was secretly terrified by the rooster crowing at sunrise.',
        translationUz: 'U tongda xo‘roz qichqirishidan yashirincha dahshatga tushardi.',
      },
      {
        id: 'fl-sp-3',
        text: 'Even the strongest giants have their own private vulnerabilities.',
        translationUz: 'Hatto eng kuchli bahodirlarning ham o‘zlariga xos zaif tomonlari bo‘ladi.',
      },
      {
        id: 'fl-sp-4',
        text: 'Accepting your fears gives you the courage to conquer them.',
        translationUz: 'Qo‘rquvlaringizni tan olish ularni yengish uchun sizga jasorat beradi.',
      },
    ],
    vocabulary: [
      {
        word: 'frightened',
        translation: 'qo‘rqqan, cho‘chigan',
        pronunciation: '/ˈfraɪ.tənd/',
        partOfSpeech: 'adjective',
        definition: 'Afraid or anxious.',
        example: 'The little puppy was frightened by the loud thunder.',
      },
      {
        word: 'rooster',
        translation: 'xo‘roz',
        pronunciation: '/ˈruː.stər/',
        partOfSpeech: 'noun',
        definition: 'A male domestic fowl; a cock.',
        example: 'The farmer woke up as soon as the rooster crowed.',
      },
      {
        word: 'tremble',
        translation: 'titramoq, qaltiramoq',
        pronunciation: '/ˈtrem.bəl/',
        partOfSpeech: 'verb',
        definition: 'Shake involuntarily, typically as a result of anxiety, excitement, or frailty.',
        example: 'Her hands trembled as she opened the mysterious letter.',
      },
      {
        word: 'courage',
        translation: 'jasorat, mardlik',
        pronunciation: '/ˈkʌr.ɪdʒ/',
        partOfSpeech: 'noun',
        definition: 'The ability to do something that frightens one; bravery.',
        example: 'True courage is doing what is right despite feeling afraid.',
      },
    ],
  },

  {
    id: 'dog-bone-uk',
    title: 'The Dog and his Bone (UK English)',
    youtubeId: 'TgnjPudDyLk',
    accent: 'UK English',
    level: 'Beginner',
    category: 'Beginner Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '3:50',
    description:
      'A dog carries a juicy bone across a bridge. Looking down into the water, he sees another dog with a bigger bone and learns a lesson about greed.',
    transcript: [
      {
        id: 'db-1',
        text: 'A cheerful dog receives a delicious meaty bone from the village butcher.',
        translationUz: 'Quvnoq it qishloq qassobidan mazali go‘shtli suyak oladi.',
      },
      {
        id: 'db-2',
        text: 'Holding it firmly in his jaws, he trots happily toward the forest.',
        translationUz: 'Uni jag‘ida mahkam tishlab, o‘rmon tomon quvnoq yo‘rg‘alab ketadi.',
      },
      {
        id: 'db-3',
        text: 'He crosses a narrow wooden footbridge over a crystal-clear brook.',
        translationUz: 'U musaffo daryocha ustidagi tor yog‘och ko‘prikdan o‘tadi.',
      },
      {
        id: 'db-4',
        text: 'Peering down, he sees his own reflection in the calm surface below.',
        translationUz: 'Pastga qarab, u sokin suv yuzida o‘zining aksini ko‘radi.',
      },
      {
        id: 'db-5',
        text: 'Thinking it is another dog with a larger bone, he snaps greedily at the water.',
        translationUz: 'U yerda kattaroq suyakli boshqa it turibdi deb o‘ylab, ochko‘zlik bilan suvga tashlanadi.',
      },
      {
        id: 'db-6',
        text: 'His own bone drops into the river and sinks to the bottom with a splash.',
        translationUz: 'Uning o‘z suyagi daryoga tushib, shaloplab tubiga cho‘kib ketadi.',
      },
      {
        id: 'db-7',
        text: 'Greed often causes us to lose the good things we already possess.',
        translationUz: 'Ochko‘zlik ko‘pincha bizda allaqachon mavjud bo‘lgan yaxshiliklarni ham boy berishimizga sabab bo‘ladi.',
      },
    ],
    speakingSentences: [
      {
        id: 'db-sp-1',
        text: 'The dog walked across a wooden bridge over the stream.',
        translationUz: 'It daryo ustidagi yog‘och ko‘prikdan o‘tib ketayotgan edi.',
      },
      {
        id: 'db-sp-2',
        text: 'He saw his own reflection in the crystal-clear water.',
        translationUz: 'U musaffo tiniq suvda o‘zining aksini ko‘rdi.',
      },
      {
        id: 'db-sp-3',
        text: 'He opened his mouth and dropped his delicious bone.',
        translationUz: 'U og‘zini ochdi va o‘zining mazali suyagini tushirib yubordi.',
      },
      {
        id: 'db-sp-4',
        text: 'Be grateful for what you have instead of envying others.',
        translationUz: 'Boshqalarga hasad qilgandan ko‘ra, o‘zingizda boriga shukr qiling.',
      },
    ],
    vocabulary: [
      {
        word: 'reflection',
        translation: 'aks, ko‘zgudagi aks',
        pronunciation: '/rɪˈflek.ʃən/',
        partOfSpeech: 'noun',
        definition: 'The throwing back by a body or surface of light, heat, or sound without absorbing it; an image.',
        example: 'He admired his own reflection in the still pond.',
      },
      {
        word: 'greedy',
        translation: 'ochko‘z, ochofat',
        pronunciation: '/ˈɡriː.di/',
        partOfSpeech: 'adjective',
        definition: 'Having an excessive desire or appetite for food or wealth.',
        example: 'The greedy dragon hoarded piles of gold in his cave.',
      },
      {
        word: 'brook',
        translation: 'jilg‘a, daryocha',
        pronunciation: '/brʊk/',
        partOfSpeech: 'noun',
        definition: 'A small natural stream of water.',
        example: 'They listened to the peaceful babble of the forest brook.',
      },
      {
        word: 'possess',
        translation: 'ega bo‘lmoq, saqlamoq',
        pronunciation: '/pəˈzes/',
        partOfSpeech: 'verb',
        definition: 'Have as belonging to one; own.',
        example: 'Cherish the genuine friendships you possess.',
      },
    ],
  },

  {
    id: 'rapunzel-uk',
    title: 'Rapunzel (UK English)',
    youtubeId: 'ki_DGMh2r0c',
    accent: 'UK English',
    level: 'Intermediate',
    category: 'Elementary Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '12:30',
    description:
      'Locked in a secluded stone tower without doors or stairs, Rapunzel lets down her long golden hair and longs to experience true freedom.',
    transcript: [
      {
        id: 'rp-1',
        text: 'Deep in an untamed forest stood an ancient stone tower without doors.',
        translationUz: 'Yovvoyi o‘rmon bag‘rida eshiklari bo‘lmagan qadimiy tosh minora qad ko‘targan edi.',
      },
      {
        id: 'rp-2',
        text: 'At the very top lived Rapunzel, a girl with marvelous, glowing golden braids.',
        translationUz: 'Uning eng tepasida ajoyib, porloq tilla o‘rimli sochlari bor Rapuntsel ismli qiz yashardi.',
      },
      {
        id: 'rp-3',
        text: 'Whenever the sorceress wanted to visit, she called, "Rapunzel, let down your hair!"',
        translationUz: 'Sehrgar jodugar mehmonga kelmoqchi bo‘lganda: "Rapuntsel, sochlaringni pastga tashla!" deb chaqirardi.',
      },
      {
        id: 'rp-4',
        text: 'A wandering young prince hears her enchanting voice singing in the evening breeze.',
        translationUz: 'Sayr qilib yurgan yosh shahzoda kechki shabadada uning maftunkor qo‘shiq kuylayotgan ovozini eshitadi.',
      },
      {
        id: 'rp-5',
        text: 'Through devotion and patience, hope finds a way out of the highest walls.',
        translationUz: 'Sadoqat va sabr-toqat orqali umid eng baland devorlardan ham chiqish yo‘lini topadi.',
      },
    ],
    speakingSentences: [
      {
        id: 'rp-sp-1',
        text: 'Rapunzel, Rapunzel, let down your golden hair!',
        translationUz: 'Rapuntsel, Rapuntsel, tilla sochlaringni pastga tashla!',
      },
      {
        id: 'rp-sp-2',
        text: 'Her enchanting singing echoed across the silent forest.',
        translationUz: 'Uning maftunkor qo‘shig‘i sokin o‘rmon bo‘ylab aks-sado berdi.',
      },
      {
        id: 'rp-sp-3',
        text: 'She dreamed of walking across the green meadows outside.',
        translationUz: 'U tashqaridagi yam-yashil o‘tloqlar bo‘ylab sayr qilishni orzu qilardi.',
      },
      {
        id: 'rp-sp-4',
        text: 'Hope and love can unlock the strongest prison towers.',
        translationUz: 'Umid va muhabbat eng mustahkam zindon minoralarini ham ocha oladi.',
      },
    ],
    vocabulary: [
      {
        word: 'tower',
        translation: 'minora, baland bino',
        pronunciation: '/ˈtaʊ.ər/',
        partOfSpeech: 'noun',
        definition: 'A tall, narrow building, either free-standing or forming part of a building such as a church or castle.',
        example: 'The ancient stone tower loomed above the mist.',
      },
      {
        word: 'braid',
        translation: 'o‘rim, sochni o‘rish',
        pronunciation: '/breɪd/',
        partOfSpeech: 'noun',
        definition: 'A length of hair divided into three or more parts that are plaited together.',
        example: 'She tied her long hair into an elegant braid.',
      },
      {
        word: 'enchanting',
        translation: 'maftunkor, sehrlovchi',
        pronunciation: '/ɪnˈtʃɑːn.tɪŋ/',
        partOfSpeech: 'adjective',
        definition: 'Delightfully charming or attractive.',
        example: 'Her singing voice was pure and enchanting.',
      },
      {
        word: 'devotion',
        translation: 'sadoqat, fidoyilik',
        pronunciation: '/dɪˈvoʊ.ʃən/',
        partOfSpeech: 'noun',
        definition: 'Love, loyalty, or enthusiasm for a person, activity, or cause.',
        example: 'True devotion withstands any test of distance.',
      },
    ],
  },

  {
    id: 'fox-crow-us',
    title: 'The Fox and the Crow (US English)',
    youtubeId: 'w6199XN1Gyk',
    accent: 'US English',
    level: 'Beginner',
    category: 'Beginner Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '4:10',
    description:
      'A sly fox spots a crow holding a delicious piece of cheese in a tree. Through cunning flattery, the fox plots to steal the prize.',
    transcript: [
      {
        id: 'fc-us-1',
        text: 'A black crow is sitting on a high tree branch with a slice of yellow cheese.',
        translationUz: 'Qora qarg‘a baland daraxt shoxida bir bo‘lak sariq pishloq bilan o‘tiribdi.',
      },
      {
        id: 'fc-us-2',
        text: 'A hungry fox walks by and catches the delicious smell of the cheese.',
        translationUz: 'Och tulki yonidan o‘tib ketayotib, pishloqning mazali hidini sezib qoladi.',
      },
      {
        id: 'fc-us-3',
        text: '"What beautiful glossy feathers you have, Queen of Birds!" praises the sly fox.',
        translationUz: '"Patlaringiz qanchalar jilvakor va go‘zal, ey Qushlar Qirolichasi!" deb maqtaydi ayyor tulki.',
      },
      {
        id: 'fc-us-4',
        text: '"Surely a bird with such noble beauty must have an enchanting singing voice!"',
        translationUz: '"Shunday olijanob go‘zallikka ega qushning ovozi ham maftunkor bo‘lishi shubhasiz!"',
      },
      {
        id: 'fc-us-5',
        text: 'Flattered by the compliments, the proud crow opens her beak wide to sing.',
        translationUz: 'Maqtovlardan mag‘rurlanib ketgan qarg‘a kuylash uchun tumshug‘ini katta ochadi.',
      },
      {
        id: 'fc-us-6',
        text: 'The cheese falls straight into the waiting mouth of the clever fox.',
        translationUz: 'Pishloq to‘g‘ri ayyor tulkining kutib turgan og‘ziga tushadi.',
      },
      {
        id: 'fc-us-7',
        text: 'Never trust those who offer false flattery just to gain an advantage.',
        translationUz: 'Foyda ko‘rish uchun quruq xushomad qiladiganlarga hech qachon ishonmang.',
      },
    ],
    speakingSentences: [
      {
        id: 'fc-us-sp-1',
        text: 'The crow sat on the high branch with a piece of cheese.',
        translationUz: 'Qarg‘a bir bo‘lak pishloq bilan baland shoxda o‘tirgan edi.',
      },
      {
        id: 'fc-us-sp-2',
        text: 'The sly fox praised her glossy black feathers.',
        translationUz: 'Ayyor tulki uning jilvador qora patlarini maqtab ketdi.',
      },
      {
        id: 'fc-us-sp-3',
        text: 'She opened her beak to sing and dropped the food.',
        translationUz: 'U kuylash uchun tumshug‘ini ochdi va yegulikni tushirib yubordi.',
      },
      {
        id: 'fc-us-sp-4',
        text: 'Do not be blinded by sweet but deceitful compliments.',
        translationUz: 'Shirin, ammo aldamchi maqtovlarga aldanib qolmang.',
      },
    ],
    vocabulary: [
      {
        word: 'flattery',
        translation: 'xushomadgo‘ylik, quruq maqtov',
        pronunciation: '/ˈflæt.ər.i/',
        partOfSpeech: 'noun',
        definition: 'Excessive and insincere praise, especially that given to further one\'s own interests.',
        example: 'Do not fall victim to insincere flattery.',
      },
      {
        word: 'sly',
        translation: 'ayyor, makkor',
        pronunciation: '/slaɪ/',
        partOfSpeech: 'adjective',
        definition: 'Having or showing a cunning and deceitful nature.',
        example: 'The sly fox always thought of clever tricks.',
      },
      {
        word: 'beak',
        translation: 'tumshuq (qush tumshug‘i)',
        pronunciation: '/biːk/',
        partOfSpeech: 'noun',
        definition: 'A bird\'s horny projecting jaws; a bill.',
        example: 'The crow held the cheese tightly in her beak.',
      },
      {
        word: 'glossy',
        translation: 'jilvali, yaltiroq',
        pronunciation: '/ˈɡlɑː.si/',
        partOfSpeech: 'adjective',
        definition: 'Shiny and smooth.',
        example: 'The raven had sleek and glossy feathers.',
      },
    ],
  },

  {
    id: 'fox-crow-uk',
    title: 'The Fox and the Crow (UK English)',
    youtubeId: 'BF3bXji-J7I',
    accent: 'UK English',
    level: 'Beginner',
    category: 'Beginner Stories',
    source: 'TheFableCottage.com / YouTube',
    duration: '4:08',
    description:
      'Narrated with British pronunciation. Master Fox uses sweet deceit to trick Mistress Crow into singing, teaching a timeless lesson on flattery.',
    transcript: [
      {
        id: 'fc-uk-1',
        text: 'Mistress Crow was perched comfortably upon an oak bough with a delicious morsel of cheese.',
        translationUz: 'Qarg‘axon eman shoxida mazali pishloq luqmasi bilan bemalol o‘tirgan edi.',
      },
      {
        id: 'fc-uk-2',
        text: 'Master Fox strolled beneath the tree, his keen nose drawn by the rich scent.',
        translationUz: 'Janob Tulki daraxt ostida sayr qilib, uning o‘tkir burni boy ifordan o‘ziga tortildi.',
      },
      {
        id: 'fc-uk-3',
        text: '"Good day, noble lady! Your plumage is finer than the velvet of kings," he declared.',
        translationUz: '"Xayrli kun, muhtaram xonim! Patlaringiz shohlar baxmalidan ham a‘lodir," dedi u.',
      },
      {
        id: 'fc-uk-4',
        text: 'The foolish crow puffed her feathers in delight and opened her beak to caw.',
        translationUz: 'Ahmoq qarg‘a xursandchilikdan patlarini bo‘rttirib, qag‘illash uchun tumshug‘ini ochdi.',
      },
      {
        id: 'fc-uk-5',
        text: 'Down tumbled the cheese directly into the jaws of the cunning fox.',
        translationUz: 'Pishloq to‘g‘ri makkor tulkining jag‘iga qulab tushdi.',
      },
      {
        id: 'fc-uk-6',
        text: '"Thank you for the treat," smiled the fox. "Flattery is the food of fools."',
        translationUz: '"Shirinlik uchun tashakkur," deb jilmaydi tulki. "Xushomad — nodonlarning ozuqasidir."',
      },
    ],
    speakingSentences: [
      {
        id: 'fc-uk-sp-1',
        text: 'Mistress Crow perched gracefully upon the tree branch.',
        translationUz: 'Qarg‘axon daraxt shoxiga viqor bilan qo‘ngan edi.',
      },
      {
        id: 'fc-uk-sp-2',
        text: 'The cunning fox offered generous words of false praise.',
        translationUz: 'Makkor tulki soxta maqtovlarga to‘la saxiy so‘zlarni aytdi.',
      },
      {
        id: 'fc-uk-sp-3',
        text: 'The morsel of cheese tumbled down from the high oak.',
        translationUz: 'Pishloq luqmasi baland emandan pastga qulab tushdi.',
      },
      {
        id: 'fc-uk-sp-4',
        text: 'Beware of those who flatter you for their own gain.',
        translationUz: 'O‘z manfaati uchun sizga xushomad qiladiganlardan ehtiyot bo‘ling.',
      },
    ],
    vocabulary: [
      {
        word: 'plumage',
        translation: 'qush patlari, qanot-patlar',
        pronunciation: '/ˈpluː.mɪdʒ/',
        partOfSpeech: 'noun',
        definition: 'A bird\'s feathers collectively.',
        example: 'The peacock displayed his spectacular colourful plumage.',
      },
      {
        word: 'cunning',
        translation: 'makkor, ayyorlik bilan',
        pronunciation: '/ˈkʌn.ɪŋ/',
        partOfSpeech: 'adjective',
        definition: 'Having or showing skill in achieving one\'s ends by deceit or evasion.',
        example: 'A cunning plan helped the fox succeed.',
      },
      {
        word: 'morsel',
        translation: 'luqma, kichik bo‘lakcha',
        pronunciation: '/ˈmɔː.səl/',
        partOfSpeech: 'noun',
        definition: 'A small piece or amount of food; a mouthful.',
        example: 'There was not a single morsel left on the plate.',
      },
      {
        word: 'perch',
        translation: 'qo‘nmoq (shoxga)',
        pronunciation: '/pɜːtʃ/',
        partOfSpeech: 'verb',
        definition: 'Alight or rest on something (of a bird).',
        example: 'The songbird perched upon the blooming apple branch.',
      },
    ],
  },
];
