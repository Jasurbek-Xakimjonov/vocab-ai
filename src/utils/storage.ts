import { VocabularyWord, UserStats, PracticeSessionRecord, RatingLevel } from '../types/vocabulary';
import { IrregularVerb } from '../types/irregularVerbs';
import { INITIAL_IRREGULAR_VERBS } from '../data/irregularVerbsData';
import { GrammarProgressRecord } from '../types/grammar';
import { SpeakingResult } from '../types/speaking';
import { VideoProgressState } from '../types/speakingVideos';
import { SpeakingBuddyUserState, SpeakingSessionRecord, SpeakingBuddyLevel } from '../types/speakingBuddy';
import { DatabaseService } from '../services/databaseService';

const WORDS_STORAGE_KEY = 'vocabai_words_v1';
const STATS_STORAGE_KEY = 'vocabai_stats_v1';
const PRACTICE_STORAGE_KEY = 'vocabai_practice_v1';
const IRREGULAR_VERBS_KEY = 'vocabai_irregular_verbs_v1';
const GRAMMAR_PROGRESS_KEY = 'vocabai_grammar_progress_v1';
const SPEAKING_HISTORY_KEY = 'vocabai_speaking_history_v1';
const VIDEO_PROGRESS_KEY = 'vocabai_video_progress_v1';
const SPEAKING_BUDDY_KEY = 'vocabai_speaking_buddy_v1';

export const INITIAL_VOCABULARY: VocabularyWord[] = [
  // Preserving user's original 20 words with high-fidelity enrichments
  {
    id: 'orig-1',
    word: 'abroad',
    translation: 'chet elda, xorijda',
    definition: 'In or to a foreign country or countries',
    example: 'She decided to study abroad in England for a year.',
    pronunciation: '/əˈbrɔːd/',
    partOfSpeech: 'adverb',
    status: 'learning',
    isFavorite: true,
    reviewCount: 2,
    correctCount: 2,
    incorrectCount: 0,
    intervalDays: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-2',
    word: 'across',
    translation: "bo'ylab, kesib o'tib, narigi tomonida",
    definition: 'From one side to the other of something with clear boundaries',
    example: 'They walked across the street to the new library.',
    pronunciation: '/əˈkrɒs/',
    partOfSpeech: 'preposition',
    status: 'learning',
    isFavorite: false,
    reviewCount: 1,
    correctCount: 1,
    incorrectCount: 0,
    intervalDays: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-3',
    word: 'all year round',
    translation: 'butun yil davomida',
    definition: 'Happening or available throughout the entire year',
    example: 'The island enjoys warm and sunny weather all year round.',
    pronunciation: '/ɔːl jɪər raʊnd/',
    partOfSpeech: 'phrase',
    status: 'learning',
    isFavorite: true,
    reviewCount: 3,
    correctCount: 3,
    incorrectCount: 0,
    intervalDays: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-4',
    word: 'banana',
    translation: 'banan',
    definition: 'A long curved fruit with a yellow skin and soft sweet flesh',
    example: 'I like to add a ripe banana to my morning smoothie.',
    pronunciation: '/bəˈnɑː.nə/',
    partOfSpeech: 'noun',
    status: 'learned',
    isFavorite: false,
    reviewCount: 4,
    correctCount: 4,
    incorrectCount: 0,
    intervalDays: 7,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-5',
    word: 'begin',
    translation: 'boshlamoq',
    definition: 'To start doing something or to start happening',
    example: 'The English class will begin at nine o\'clock sharp.',
    pronunciation: '/bɪˈɡɪn/',
    partOfSpeech: 'verb',
    status: 'learned',
    isFavorite: false,
    reviewCount: 3,
    correctCount: 3,
    incorrectCount: 0,
    intervalDays: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-6',
    word: 'biology',
    translation: 'biologiya',
    definition: 'The scientific study of the life and structure of plants and animals',
    example: 'Biology was her favorite science subject in high school.',
    pronunciation: '/baɪˈɒl.ə.dʒi/',
    partOfSpeech: 'noun',
    status: 'learning',
    isFavorite: false,
    reviewCount: 2,
    correctCount: 1,
    incorrectCount: 1,
    intervalDays: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-7',
    word: 'boat',
    translation: 'qayiq',
    definition: 'A small vessel for traveling over water',
    example: 'We rented a small wooden boat on the mountain lake.',
    pronunciation: '/bəʊt/',
    partOfSpeech: 'noun',
    status: 'learned',
    isFavorite: false,
    reviewCount: 3,
    correctCount: 3,
    incorrectCount: 0,
    intervalDays: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-8',
    word: 'bridge',
    translation: "ko'prik",
    definition: 'A structure built over a river, road, or railway to allow crossing',
    example: 'The famous stone bridge connects both sides of the ancient city.',
    pronunciation: '/brɪdʒ/',
    partOfSpeech: 'noun',
    status: 'learning',
    isFavorite: true,
    reviewCount: 1,
    correctCount: 1,
    incorrectCount: 0,
    intervalDays: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-9',
    word: 'campus',
    translation: 'kampus, universitet shaharchasi',
    definition: 'The grounds and buildings of a university or college',
    example: 'Students gathered in the modern campus cafe after lectures.',
    pronunciation: '/ˈkæm.pəs/',
    partOfSpeech: 'noun',
    status: 'learning',
    isFavorite: true,
    reviewCount: 2,
    correctCount: 2,
    incorrectCount: 0,
    intervalDays: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-10',
    word: 'carefully',
    translation: 'ehtiyotkorlik bilan, diqqat bilan',
    definition: 'With great attention, detail, or caution',
    example: 'Please drive carefully when the mountain roads are icy.',
    pronunciation: '/ˈkeə.fəl.i/',
    partOfSpeech: 'adverb',
    status: 'learning',
    isFavorite: false,
    reviewCount: 1,
    correctCount: 1,
    incorrectCount: 0,
    intervalDays: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-11',
    word: 'check in',
    translation: "ro'yxatdan o'tmoq (mehmonxona, aeroport)",
    definition: 'To register upon arrival at an airport, hotel, or clinic',
    example: 'Passengers must check in at least two hours before the flight.',
    pronunciation: '/tʃek ɪn/',
    partOfSpeech: 'phrasal verb',
    status: 'learning',
    isFavorite: true,
    reviewCount: 2,
    correctCount: 2,
    incorrectCount: 0,
    intervalDays: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-12',
    word: 'chemistry',
    translation: 'kimyo',
    definition: 'The scientific study of substances and how they interact and combine',
    example: 'He conducted a fascinating chemical reaction experiment in chemistry.',
    pronunciation: '/ˈkem.ɪ.stri/',
    partOfSpeech: 'noun',
    status: 'difficult',
    isFavorite: false,
    reviewCount: 3,
    correctCount: 1,
    incorrectCount: 2,
    intervalDays: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-13',
    word: 'cruise',
    translation: 'kruiz, sayohat kemasi safari',
    definition: 'A voyage on a ship or boat taken for pleasure or vacation',
    example: 'They booked a seven-day luxury cruise in the Mediterranean Sea.',
    pronunciation: '/kruːz/',
    partOfSpeech: 'noun',
    status: 'learning',
    isFavorite: false,
    reviewCount: 2,
    correctCount: 2,
    incorrectCount: 0,
    intervalDays: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-14',
    word: 'czech',
    translation: 'chex (tili yoki millati)',
    definition: 'Relating to the Czech Republic, its people, or their language',
    example: 'Prague is famous for its breathtaking Czech architecture.',
    pronunciation: '/tʃek/',
    partOfSpeech: 'adjective',
    status: 'learning',
    isFavorite: false,
    reviewCount: 1,
    correctCount: 1,
    incorrectCount: 0,
    intervalDays: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-15',
    word: 'developing countries',
    translation: 'rivojlanayotgan davlatlar',
    definition: 'Nations with less industrial development and lower standard of living',
    example: 'International organizations support green energy in developing countries.',
    pronunciation: '/dɪˈvel.ə.pɪŋ ˈkʌn.triz/',
    partOfSpeech: 'phrase',
    status: 'learning',
    isFavorite: true,
    reviewCount: 2,
    correctCount: 2,
    incorrectCount: 0,
    intervalDays: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-16',
    word: 'divorced',
    translation: 'ajrashgan',
    definition: 'No longer married because the marriage has been legally dissolved',
    example: 'After being divorced, they maintained a respectful friendship.',
    pronunciation: '/dɪˈvɔːst/',
    partOfSpeech: 'adjective',
    status: 'learning',
    isFavorite: false,
    reviewCount: 1,
    correctCount: 1,
    incorrectCount: 0,
    intervalDays: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-17',
    word: 'economics',
    translation: 'iqtisodiyot',
    definition: 'The branch of knowledge concerned with the production and consumption of goods',
    example: 'Studying economics helps understand inflation and world trade.',
    pronunciation: '/ˌiː.kəˈnɒm.ɪks/',
    partOfSpeech: 'noun',
    status: 'learning',
    isFavorite: true,
    reviewCount: 2,
    correctCount: 2,
    incorrectCount: 0,
    intervalDays: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-18',
    word: 'Europe',
    translation: 'Yevropa',
    definition: 'A continent situated entirely in the Northern Hemisphere',
    example: 'Many travelers explore Europe by high-speed train.',
    pronunciation: '/ˈjʊə.rəp/',
    partOfSpeech: 'noun',
    status: 'learned',
    isFavorite: false,
    reviewCount: 3,
    correctCount: 3,
    incorrectCount: 0,
    intervalDays: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-19',
    word: 'event',
    translation: 'hodisa, voqea, tadbir',
    definition: 'A thing that happens, especially one of importance or planned public occasion',
    example: 'The international tech conference was the biggest event of the season.',
    pronunciation: '/ɪˈvent/',
    partOfSpeech: 'noun',
    status: 'learned',
    isFavorite: false,
    reviewCount: 3,
    correctCount: 3,
    incorrectCount: 0,
    intervalDays: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-20',
    word: 'explain',
    translation: 'tushuntirmoq, izohlamoq',
    definition: 'To make an idea or situation clear by describing it in more detail',
    example: 'Could you please explain this grammar rule one more time?',
    pronunciation: '/ɪkˈspleɪn/',
    partOfSpeech: 'verb',
    status: 'learned',
    isFavorite: true,
    reviewCount: 4,
    correctCount: 4,
    incorrectCount: 0,
    intervalDays: 7,
    createdAt: new Date().toISOString(),
  },

  // Additional essential vocabulary
  {
    id: 'orig-21',
    word: 'beautiful',
    translation: "chiroyli, go'zal",
    definition: 'Pleasing the senses or mind aesthetically',
    example: 'The sunset over the mountain valley was breathtakingly beautiful.',
    pronunciation: '/ˈbjuː.tɪ.fəl/',
    partOfSpeech: 'adjective',
    status: 'learned',
    isFavorite: true,
    reviewCount: 5,
    correctCount: 5,
    incorrectCount: 0,
    intervalDays: 10,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-22',
    word: 'expensive',
    translation: 'qimmat, qimmatbaho',
    definition: 'Costing a lot of money; not cheap',
    example: 'Designer watches can be exceptionally expensive.',
    pronunciation: '/ɪkˈspen.sɪv/',
    partOfSpeech: 'adjective',
    status: 'learning',
    isFavorite: false,
    reviewCount: 2,
    correctCount: 2,
    incorrectCount: 0,
    intervalDays: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-23',
    word: 'important',
    translation: 'muhim, ahamiyatli',
    definition: 'Of great significance, value, or consequence',
    example: 'Consistency is the most important factor in mastering a language.',
    pronunciation: '/ɪmˈpɔː.tənt/',
    partOfSpeech: 'adjective',
    status: 'learned',
    isFavorite: true,
    reviewCount: 4,
    correctCount: 4,
    incorrectCount: 0,
    intervalDays: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-24',
    word: 'remember',
    translation: 'eslamoq, yodda tutmoq',
    definition: 'To retain in memory or recall to mind',
    example: 'Always remember to review flashcards before going to sleep.',
    pronunciation: '/rɪˈmem.bər/',
    partOfSpeech: 'verb',
    status: 'learning',
    isFavorite: true,
    reviewCount: 2,
    correctCount: 2,
    incorrectCount: 0,
    intervalDays: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'orig-25',
    word: 'practice',
    translation: "mashq qilmoq, qo'llamoq",
    definition: 'To perform an activity or exercise regularly to improve a skill',
    example: 'If you practice speaking English every day, you will become fluent.',
    pronunciation: '/ˈpræk.tɪs/',
    partOfSpeech: 'verb',
    status: 'learned',
    isFavorite: true,
    reviewCount: 5,
    correctCount: 5,
    incorrectCount: 0,
    intervalDays: 12,
    createdAt: new Date().toISOString(),
  },
];

let currentUserId: string | null = null;

function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const Storage = {
  setCurrentUserId(userId: string | null): void {
    currentUserId = userId;
    if (userId) {
      this.syncUserVocabulary(userId);
    }
    window.dispatchEvent(new Event('vocabai_words_updated'));
    window.dispatchEvent(new Event('vocabai_stats_updated'));
  },

  getCurrentUserId(): string | null {
    return currentUserId;
  },

  getWordsKey(): string {
    return currentUserId ? `vocabai_${currentUserId}_words_v1` : WORDS_STORAGE_KEY;
  },

  getStatsKey(): string {
    return currentUserId ? `vocabai_${currentUserId}_stats_v1` : STATS_STORAGE_KEY;
  },

  getPracticeKey(): string {
    return currentUserId ? `vocabai_${currentUserId}_practice_v1` : PRACTICE_STORAGE_KEY;
  },

  getIrregularKey(): string {
    return currentUserId ? `vocabai_${currentUserId}_irregular_verbs_v1` : IRREGULAR_VERBS_KEY;
  },

  getGrammarKey(): string {
    return currentUserId ? `vocabai_${currentUserId}_grammar_progress_v1` : GRAMMAR_PROGRESS_KEY;
  },

  getSpeakingKey(): string {
    return currentUserId ? `vocabai_${currentUserId}_speaking_history_v1` : SPEAKING_HISTORY_KEY;
  },

  getVideoKey(): string {
    return currentUserId ? `vocabai_${currentUserId}_video_progress_v1` : VIDEO_PROGRESS_KEY;
  },

  getSpeakingBuddyKey(): string {
    return currentUserId ? `vocabai_${currentUserId}_speaking_buddy_v1` : SPEAKING_BUDDY_KEY;
  },

  async syncUserVocabulary(userId: string): Promise<void> {
    try {
      const remoteWords = await DatabaseService.fetchUserVocabulary(userId);
      const key = this.getWordsKey();
      if (remoteWords && remoteWords.length > 0) {
        localStorage.setItem(key, JSON.stringify(remoteWords));
        window.dispatchEvent(new Event('vocabai_words_updated'));
      } else if (remoteWords && remoteWords.length === 0) {
        // First-time registered user: seed isolated initial vocabulary for this user
        const userInitial = INITIAL_VOCABULARY.map((w, idx) => ({
          ...w,
          id: `w_${userId.substring(0, 6)}_${idx + 1}_${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toISOString(),
        }));
        localStorage.setItem(key, JSON.stringify(userInitial));
        await DatabaseService.seedWords(userId, userInitial);
        window.dispatchEvent(new Event('vocabai_words_updated'));
      }
    } catch (e) {
      console.warn('Sync user vocabulary error:', e);
    }
  },

  getWords(): VocabularyWord[] {
    try {
      const key = this.getWordsKey();
      const raw = localStorage.getItem(key);
      if (!raw) {
        // Seed initial vocabulary for active session
        localStorage.setItem(key, JSON.stringify(INITIAL_VOCABULARY));
        if (currentUserId) {
          DatabaseService.seedWords(currentUserId, INITIAL_VOCABULARY);
        }
        return INITIAL_VOCABULARY;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(key, JSON.stringify(INITIAL_VOCABULARY));
        return INITIAL_VOCABULARY;
      }
      return parsed;
    } catch (e) {
      console.error('Failed reading words from localStorage:', e);
      return INITIAL_VOCABULARY;
    }
  },

  saveWords(words: VocabularyWord[]): void {
    try {
      localStorage.setItem(this.getWordsKey(), JSON.stringify(words));
      window.dispatchEvent(new Event('vocabai_words_updated'));
    } catch (e) {
      console.error('Failed writing words to localStorage:', e);
    }
  },

  addWords(newWords: Omit<VocabularyWord, 'id' | 'createdAt' | 'status' | 'isFavorite' | 'reviewCount' | 'correctCount' | 'incorrectCount'>[]): VocabularyWord[] {
    const existing = this.getWords();
    const existingSet = new Set(existing.map((w) => w.word.toLowerCase().trim()));

    const created: VocabularyWord[] = [];
    const now = new Date().toISOString();

    for (const item of newWords) {
      const cleanWord = item.word.trim();
      if (!cleanWord) continue;

      // Avoid direct duplicates
      if (existingSet.has(cleanWord.toLowerCase())) {
        continue;
      }

      const newWordObj: VocabularyWord = {
        id: 'word_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        word: cleanWord,
        translation: item.translation.trim(),
        definition: item.definition?.trim() || '',
        example: item.example?.trim() || '',
        pronunciation: item.pronunciation?.trim() || '',
        partOfSpeech: item.partOfSpeech || 'noun',
        status: 'learning',
        isFavorite: false,
        reviewCount: 0,
        correctCount: 0,
        incorrectCount: 0,
        intervalDays: 1,
        createdAt: now,
      };

      existing.unshift(newWordObj);
      existingSet.add(cleanWord.toLowerCase());
      created.push(newWordObj);

      if (currentUserId) {
        DatabaseService.saveWord(currentUserId, newWordObj);
      }
    }

    this.saveWords(existing);
    return created;
  },

  addSingleWord(wordData: Partial<VocabularyWord>): VocabularyWord {
    const existing = this.getWords();
    const newWord: VocabularyWord = {
      id: 'word_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      word: wordData.word?.trim() || 'New Word',
      translation: wordData.translation?.trim() || '',
      definition: wordData.definition?.trim() || '',
      example: wordData.example?.trim() || '',
      pronunciation: wordData.pronunciation?.trim() || '',
      partOfSpeech: wordData.partOfSpeech || 'noun',
      status: wordData.status || 'learning',
      isFavorite: Boolean(wordData.isFavorite),
      reviewCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      intervalDays: 1,
      createdAt: new Date().toISOString(),
    };

    existing.unshift(newWord);
    this.saveWords(existing);

    if (currentUserId) {
      DatabaseService.saveWord(currentUserId, newWord);
    }

    return newWord;
  },

  addCustomWord(wordData: Partial<VocabularyWord>): VocabularyWord {
    return this.addSingleWord(wordData);
  },

  updateWord(id: string, updates: Partial<VocabularyWord>): void {
    const words = this.getWords();
    const index = words.findIndex((w) => w.id === id);
    if (index !== -1) {
      words[index] = { ...words[index], ...updates };
      this.saveWords(words);

      if (currentUserId) {
        DatabaseService.saveWord(currentUserId, words[index]);
      }
    }
  },

  deleteWord(id: string): void {
    const words = this.getWords().filter((w) => w.id !== id);
    this.saveWords(words);

    if (currentUserId) {
      DatabaseService.deleteWord(currentUserId, id);
    }
  },

  toggleFavorite(id: string): boolean {
    const words = this.getWords();
    const item = words.find((w) => w.id === id);
    if (item) {
      item.isFavorite = !item.isFavorite;
      this.saveWords(words);

      if (currentUserId) {
        DatabaseService.saveWord(currentUserId, item);
      }

      return item.isFavorite;
    }
    return false;
  },

  /**
   * Spaced repetition rating algorithm
   * Good:
   *   Interval expands: 1 day -> 3 days -> 7 days -> 14 days
   *   status = 'learned'
   * Hard:
   *   Interval contracts: 1 day (or short 10m/30m/1d)
   *   wrong_count increments, status = 'difficult'
   * Again:
   *   1 day interval, status = 'difficult'
   * Easy:
   *   Interval jumps: 7+ days, status = 'learned'
   */
  rateWord(id: string, rating: RatingLevel): VocabularyWord | null {
    const words = this.getWords();
    const item = words.find((w) => w.id === id);
    if (!item) return null;

    const now = new Date();
    let currentInterval = item.intervalDays || 1;
    let nextIntervalDays = 1;
    let newStatus = item.status;

    item.reviewCount = (item.reviewCount || 0) + 1;
    item.lastRating = rating;
    item.lastReviewedAt = now.toISOString();

    const nextDate = new Date();

    if (rating === 'again') {
      // Again: 10 minutes
      nextDate.setMinutes(nextDate.getMinutes() + 10);
      nextIntervalDays = 0.01;
      item.incorrectCount = (item.incorrectCount || 0) + 1;
      newStatus = 'difficult';
    } else if (rating === 'hard') {
      // Hard: 30 minutes
      nextDate.setMinutes(nextDate.getMinutes() + 30);
      nextIntervalDays = 0.02;
      item.incorrectCount = (item.incorrectCount || 0) + 1;
      newStatus = 'difficult';
    } else if (rating === 'good') {
      // Good: expand interval: 1 day -> 3 days -> 7 days -> 14 days
      if (currentInterval < 1) nextIntervalDays = 1;
      else if (currentInterval < 3) nextIntervalDays = 3;
      else if (currentInterval < 7) nextIntervalDays = 7;
      else nextIntervalDays = 14;

      nextDate.setDate(nextDate.getDate() + nextIntervalDays);
      item.correctCount = (item.correctCount || 0) + 1;
      newStatus = 'learned';
    } else if (rating === 'easy') {
      nextIntervalDays = Math.max(7, Math.round(currentInterval * 2));
      nextDate.setDate(nextDate.getDate() + nextIntervalDays);
      item.correctCount = (item.correctCount || 0) + 1;
      newStatus = 'learned';
    }

    item.intervalDays = nextIntervalDays;
    item.status = newStatus;
    item.nextReviewAt = nextDate.toISOString();

    this.saveWords(words);

    // Sync to Supabase
    if (currentUserId) {
      DatabaseService.saveWord(currentUserId, item);
      DatabaseService.saveWordProgress(
        currentUserId,
        item.id,
        rating,
        item.correctCount,
        item.incorrectCount,
        newStatus,
        nextIntervalDays,
        item.nextReviewAt
      );
    }

    // Update user daily stats
    this.incrementReviewedCount();

    return item;
  },

  getUserStats(): UserStats {
    try {
      const raw = localStorage.getItem(this.getStatsKey());
      const today = getTodayKey();

      const defaultStats: UserStats = {
        streakDays: 5,
        lastActiveDate: today,
        dailyGoal: 20,
        todayReviewedCount: 0,
        totalPracticeSessions: 3,
        weeklyActivity: {
          [today]: 0,
        },
      };

      if (!raw) {
        localStorage.setItem(this.getStatsKey(), JSON.stringify(defaultStats));
        return defaultStats;
      }

      const stats: UserStats = JSON.parse(raw);

      // Check if day changed
      if (stats.lastActiveDate !== today) {
        const lastDate = new Date(stats.lastActiveDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Continuous day streak!
        } else if (diffDays > 2) {
          // Missed more than 1 day
          stats.streakDays = 1;
        }

        stats.lastActiveDate = today;
        stats.todayReviewedCount = 0;
        if (!stats.weeklyActivity) stats.weeklyActivity = {};
        stats.weeklyActivity[today] = 0;

        localStorage.setItem(this.getStatsKey(), JSON.stringify(stats));
      }

      return stats;
    } catch (e) {
      console.error('Failed reading user stats:', e);
      return {
        streakDays: 1,
        lastActiveDate: getTodayKey(),
        dailyGoal: 20,
        todayReviewedCount: 0,
        totalPracticeSessions: 0,
        weeklyActivity: {},
      };
    }
  },

  saveUserStats(stats: UserStats): void {
    try {
      localStorage.setItem(this.getStatsKey(), JSON.stringify(stats));
      window.dispatchEvent(new Event('vocabai_stats_updated'));
    } catch (e) {
      console.error('Failed saving stats:', e);
    }
  },

  incrementReviewedCount(): void {
    const stats = this.getUserStats();
    const today = getTodayKey();
    stats.todayReviewedCount = (stats.todayReviewedCount || 0) + 1;
    if (!stats.weeklyActivity) stats.weeklyActivity = {};
    stats.weeklyActivity[today] = (stats.weeklyActivity[today] || 0) + 1;

    // Check if goal reached and streak should bump
    if (stats.todayReviewedCount === 1) {
      // User active today
      stats.streakDays = Math.max(stats.streakDays, 1);
    }

    this.saveUserStats(stats);
  },

  updateDailyGoal(target: number): void {
    const stats = this.getUserStats();
    stats.dailyGoal = target;
    this.saveUserStats(stats);
  },

  getPracticeHistory(): PracticeSessionRecord[] {
    try {
      const raw = localStorage.getItem(this.getPracticeKey());
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  savePracticeSession(record: Omit<PracticeSessionRecord, 'id' | 'date'>): PracticeSessionRecord {
    const history = this.getPracticeHistory();
    const newRecord: PracticeSessionRecord = {
      id: 'session_' + Date.now(),
      date: new Date().toISOString(),
      ...record,
    };
    history.unshift(newRecord);
    if (history.length > 50) history.pop();

    try {
      localStorage.setItem(this.getPracticeKey(), JSON.stringify(history));
    } catch (e) {}

    // Bump user stats
    const stats = this.getUserStats();
    stats.totalPracticeSessions = (stats.totalPracticeSessions || 0) + 1;
    this.saveUserStats(stats);

    // Sync to Supabase
    if (currentUserId) {
      DatabaseService.saveQuizResult(
        currentUserId,
        record.mode,
        record.correctAnswers,
        record.totalQuestions
      );
    }

    return newRecord;
  },

  saveSpellingResult(wordId: string, isCorrect: boolean, attempt: string): void {
    if (currentUserId) {
      DatabaseService.saveSpellingResult(currentUserId, wordId, isCorrect, attempt);
    }
  },

  resetToDefault(): void {
    localStorage.setItem(this.getWordsKey(), JSON.stringify(INITIAL_VOCABULARY));
    window.dispatchEvent(new Event('vocabai_words_updated'));
  },

  // ================= Irregular Verbs =================
  getIrregularVerbs(): IrregularVerb[] {
    try {
      const raw = localStorage.getItem(this.getIrregularKey());
      if (!raw) {
        localStorage.setItem(this.getIrregularKey(), JSON.stringify(INITIAL_IRREGULAR_VERBS));
        return INITIAL_IRREGULAR_VERBS;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(this.getIrregularKey(), JSON.stringify(INITIAL_IRREGULAR_VERBS));
        return INITIAL_IRREGULAR_VERBS;
      }
      return parsed;
    } catch (e) {
      return INITIAL_IRREGULAR_VERBS;
    }
  },

  saveIrregularVerbs(verbs: IrregularVerb[]): void {
    try {
      localStorage.setItem(this.getIrregularKey(), JSON.stringify(verbs));
      window.dispatchEvent(new Event('vocabai_irregular_verbs_updated'));
    } catch (e) {
      console.error('Failed saving irregular verbs:', e);
    }
  },

  rateIrregularVerb(id: string, rating: 'again' | 'hard' | 'good' | 'easy'): IrregularVerb | null {
    const verbs = this.getIrregularVerbs();
    const item = verbs.find((v) => v.id === id);
    if (!item) return null;

    const nowIso = new Date().toISOString();
    item.reviewCount = (item.reviewCount || 0) + 1;
    item.lastRating = rating;
    item.lastReviewedAt = nowIso;
    item.last_reviewed_at = nowIso;

    if (rating === 'again' || rating === 'hard') {
      item.wrong_count = (item.wrong_count || 0) + 1;
      item.status = rating === 'again' ? 'difficult' : 'learning';
      item.intervalDays = rating === 'again' ? 1 : 2;
    } else {
      item.correct_count = (item.correct_count || 0) + 1;
      item.status = 'learned';
      item.intervalDays = rating === 'easy' ? 7 : 4;
    }

    this.saveIrregularVerbs(verbs);
    this.incrementReviewedCount();

    if (currentUserId) {
      DatabaseService.saveIrregularVerbProgress(
        currentUserId,
        item.id,
        item.correct_count || 0,
        item.wrong_count || 0,
        nowIso
      );
    }

    return item;
  },

  toggleFavoriteIrregularVerb(id: string): boolean {
    const verbs = this.getIrregularVerbs();
    const item = verbs.find((v) => v.id === id);
    if (!item) return false;
    item.isFavorite = !item.isFavorite;
    this.saveIrregularVerbs(verbs);
    return item.isFavorite;
  },

  markIrregularVerbLearned(id: string, isLearned: boolean): void {
    const verbs = this.getIrregularVerbs();
    const item = verbs.find((v) => v.id === id);
    if (!item) return;
    item.status = isLearned ? 'learned' : 'learning';
    this.saveIrregularVerbs(verbs);
  },

  resetIrregularVerbsToDefault(): void {
    localStorage.setItem(this.getIrregularKey(), JSON.stringify(INITIAL_IRREGULAR_VERBS));
    window.dispatchEvent(new Event('vocabai_irregular_verbs_updated'));
  },

  // ================= Grammar Progress =================
  getGrammarProgress(): Record<string, GrammarProgressRecord> {
    try {
      const raw = localStorage.getItem(this.getGrammarKey());
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  },

  saveGrammarProgress(progress: Record<string, GrammarProgressRecord>): void {
    try {
      localStorage.setItem(this.getGrammarKey(), JSON.stringify(progress));
      window.dispatchEvent(new Event('vocabai_grammar_updated'));
    } catch (e) {
      console.error('Failed saving grammar progress:', e);
    }
  },

  markGrammarCompleted(topicId: string, score: number, totalQuestions: number): void {
    const progress = this.getGrammarProgress();
    progress[topicId] = {
      topicId,
      completed: true,
      score,
      totalQuestions,
      lastPracticedAt: new Date().toISOString(),
    };
    this.saveGrammarProgress(progress);
    this.incrementReviewedCount();
  },

  // ================= Speaking History =================
  getSpeakingHistory(): SpeakingResult[] {
    try {
      const raw = localStorage.getItem(this.getSpeakingKey());
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  saveSpeakingResult(result: SpeakingResult): void {
    const history = this.getSpeakingHistory();
    history.unshift(result);
    if (history.length > 50) history.pop();
    try {
      localStorage.setItem(this.getSpeakingKey(), JSON.stringify(history));
      window.dispatchEvent(new Event('vocabai_speaking_updated'));
    } catch (e) {
      console.error('Failed saving speaking history:', e);
    }

    if (currentUserId) {
      DatabaseService.saveSpeakingResult(currentUserId, result);
    }

    this.incrementReviewedCount();
  },

  // ================= Speaking Videos Progress =================
  getVideoProgress(): VideoProgressState {
    try {
      const raw = localStorage.getItem(this.getVideoKey());
      if (!raw) {
        return {
          watchedVideoIds: [],
          savedVideoIds: [],
          speakingScores: {},
        };
      }
      return JSON.parse(raw);
    } catch (e) {
      return {
        watchedVideoIds: [],
        savedVideoIds: [],
        speakingScores: {},
      };
    }
  },

  saveVideoProgress(state: VideoProgressState): void {
    try {
      localStorage.setItem(this.getVideoKey(), JSON.stringify(state));
      window.dispatchEvent(new Event('vocabai_video_progress_updated'));
    } catch (e) {
      console.error('Failed saving video progress:', e);
    }
  },

  markVideoWatched(videoId: string, watched: boolean = true): void {
    const prog = this.getVideoProgress();
    const set = new Set(prog.watchedVideoIds);
    if (watched) {
      set.add(videoId);
      prog.lastWatchedVideoId = videoId;
    } else {
      set.delete(videoId);
    }
    prog.watchedVideoIds = Array.from(set);
    this.saveVideoProgress(prog);
    this.incrementReviewedCount();
  },

  toggleSaveVideo(videoId: string): boolean {
    const prog = this.getVideoProgress();
    const set = new Set(prog.savedVideoIds);
    let isSaved = false;
    if (set.has(videoId)) {
      set.delete(videoId);
      isSaved = false;
    } else {
      set.add(videoId);
      isSaved = true;
    }
    prog.savedVideoIds = Array.from(set);
    this.saveVideoProgress(prog);
    return isSaved;
  },

  saveVideoSpeakingScore(videoId: string, sentenceId: string, score: number): void {
    const prog = this.getVideoProgress();
    const existing = prog.speakingScores[sentenceId];
    const prevBest = existing ? existing.bestScore : 0;
    prog.speakingScores[sentenceId] = {
      bestScore: Math.max(prevBest, score),
      completedAt: new Date().toISOString(),
    };
    if (!prog.watchedVideoIds.includes(videoId)) {
      prog.watchedVideoIds.push(videoId);
    }
    prog.lastWatchedVideoId = videoId;
    this.saveVideoProgress(prog);
    this.incrementReviewedCount();
  },

  isWordInVocabulary(word: string): boolean {
    const words = this.getWords();
    const clean = word.toLowerCase().trim();
    return words.some((w) => w.word.toLowerCase().trim() === clean);
  },

  // ================= AI Speaking Buddy Progress =================
  getSpeakingBuddyState(): SpeakingBuddyUserState {
    try {
      const raw = localStorage.getItem(this.getSpeakingBuddyKey());
      if (!raw) {
        return {
          currentLevel: 0,
          currentStreak: 1,
          bestStreak: 1,
          lastPracticeDate: new Date().toISOString(),
          totalConversationsCompleted: 0,
          totalWordsPracticed: 0,
          totalSpeakingTimeSeconds: 0,
          sessions: [],
        };
      }
      return JSON.parse(raw);
    } catch (e) {
      return {
        currentLevel: 0,
        currentStreak: 1,
        bestStreak: 1,
        lastPracticeDate: new Date().toISOString(),
        totalConversationsCompleted: 0,
        totalWordsPracticed: 0,
        totalSpeakingTimeSeconds: 0,
        sessions: [],
      };
    }
  },

  saveSpeakingBuddyState(state: SpeakingBuddyUserState): void {
    try {
      localStorage.setItem(this.getSpeakingBuddyKey(), JSON.stringify(state));
      window.dispatchEvent(new Event('vocabai_speaking_buddy_updated'));
    } catch (e) {
      console.error('Failed saving speaking buddy state:', e);
    }
  },

  recordSpeakingBuddySession(session: SpeakingSessionRecord): void {
    const state = this.getSpeakingBuddyState();
    state.sessions.unshift(session);
    state.totalConversationsCompleted += 1;
    state.totalWordsPracticed += session.wordsPracticed;
    state.totalSpeakingTimeSeconds += session.durationSeconds;

    // Check streak
    const today = new Date().toISOString().split('T')[0];
    const lastDate = state.lastPracticeDate ? state.lastPracticeDate.split('T')[0] : null;

    if (!lastDate) {
      state.currentStreak = 1;
    } else if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastDate === yesterday) {
        state.currentStreak += 1;
      } else {
        state.currentStreak = 1;
      }
    }

    state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
    state.lastPracticeDate = new Date().toISOString();

    // Level progression: If completed 3+ sessions with score >= 80%, suggest or unlock next level
    if (state.sessions.length >= 3 && state.currentLevel === 0) {
      const recentAvg =
        state.sessions.slice(0, 3).reduce((acc, s) => acc + s.score, 0) / 3;
      if (recentAvg >= 75) {
        state.currentLevel = 1;
      }
    }

    this.saveSpeakingBuddyState(state);
    this.incrementReviewedCount();
  },

  setSpeakingBuddyLevel(level: SpeakingBuddyLevel): void {
    const state = this.getSpeakingBuddyState();
    state.currentLevel = level;
    this.saveSpeakingBuddyState(state);
  },
};
