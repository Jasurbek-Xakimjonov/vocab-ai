import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { VocabularyWord, RatingLevel } from '../types/vocabulary';
import { SpeakingResult } from '../types/speaking';

export const DatabaseService = {
  // Sync vocabulary from Supabase for a given user
  async fetchUserVocabulary(userId: string): Promise<VocabularyWord[] | null> {
    if (!isSupabaseConfigured() || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchUserVocabulary error:', error.message);
        return null;
      }

      if (!data) return [];

      return data.map((row: any) => ({
        id: row.id,
        word: row.word,
        translation: row.translation,
        definition: row.definition || '',
        example: row.example || '',
        pronunciation: row.pronunciation || '',
        partOfSpeech: row.part_of_speech || 'noun',
        status: row.status || 'learning',
        isFavorite: Boolean(row.is_favorite),
        reviewCount: row.review_count || 0,
        correctCount: row.correct_count || 0,
        incorrectCount: row.incorrect_count || 0,
        intervalDays: row.interval_days || 1,
        lastReviewedAt: row.last_reviewed_at || undefined,
        nextReviewAt: row.next_review_at || undefined,
        createdAt: row.created_at || new Date().toISOString(),
      }));
    } catch (e) {
      console.warn('Database fetch exception:', e);
      return null;
    }
  },

  // Save single word to Supabase
  async saveWord(userId: string, word: VocabularyWord): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;
    try {
      const record = {
        id: word.id,
        user_id: userId,
        word: word.word,
        translation: word.translation,
        definition: word.definition || '',
        example: word.example,
        pronunciation: word.pronunciation,
        part_of_speech: word.partOfSpeech,
        status: word.status,
        is_favorite: word.isFavorite,
        review_count: word.reviewCount,
        correct_count: word.correctCount,
        incorrect_count: word.incorrectCount,
        interval_days: word.intervalDays,
        last_reviewed_at: word.lastReviewedAt,
        next_review_at: word.nextReviewAt,
        created_at: word.createdAt,
      };

      await supabase.from('vocabulary').upsert(record, { onConflict: 'id' });
    } catch (e) {
      console.warn('Database saveWord exception:', e);
    }
  },

  // Batch seed words to Supabase
  async seedWords(userId: string, words: VocabularyWord[]): Promise<void> {
    if (!isSupabaseConfigured() || !userId || words.length === 0) return;
    try {
      const records = words.map((w) => ({
        id: w.id,
        user_id: userId,
        word: w.word,
        translation: w.translation,
        definition: w.definition || '',
        example: w.example,
        pronunciation: w.pronunciation,
        part_of_speech: w.partOfSpeech,
        status: w.status,
        is_favorite: w.isFavorite,
        review_count: w.reviewCount,
        correct_count: w.correctCount,
        incorrect_count: w.incorrectCount,
        interval_days: w.intervalDays,
        last_reviewed_at: w.lastReviewedAt,
        next_review_at: w.nextReviewAt,
        created_at: w.createdAt,
      }));

      await supabase.from('vocabulary').upsert(records, { onConflict: 'id' });
    } catch (e) {
      console.warn('Database seedWords exception:', e);
    }
  },

  // Delete word from Supabase
  async deleteWord(userId: string, wordId: string): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;
    try {
      await supabase
        .from('vocabulary')
        .delete()
        .eq('id', wordId)
        .eq('user_id', userId);
    } catch (e) {
      console.warn('Database deleteWord exception:', e);
    }
  },

  // Save word progress (Good / Hard / Spaced repetition)
  async saveWordProgress(
    userId: string,
    wordId: string,
    rating: RatingLevel,
    correctCount: number,
    wrongCount: number,
    status: string,
    intervalDays: number,
    nextReviewAt?: string
  ): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;
    try {
      const now = new Date();
      let nextDateStr = nextReviewAt;
      if (!nextDateStr) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + intervalDays);
        nextDateStr = nextDate.toISOString();
      }

      const record = {
        user_id: userId,
        word_id: wordId,
        rating,
        correct_count: correctCount,
        wrong_count: wrongCount,
        status,
        interval_days: intervalDays,
        last_reviewed_at: now.toISOString(),
        next_review_at: nextDateStr,
      };

      await supabase.from('word_progress').upsert(record, {
        onConflict: 'user_id,word_id',
      });
    } catch (e) {
      console.warn('Database saveWordProgress exception:', e);
    }
  },

  // Save irregular verbs progress
  async saveIrregularVerbProgress(
    userId: string,
    verbId: string,
    correctCount: number,
    wrongCount: number,
    lastReviewedAt: string
  ): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;
    try {
      const record = {
        user_id: userId,
        verb_id: verbId,
        correct_count: correctCount,
        wrong_count: wrongCount,
        last_reviewed_at: lastReviewedAt,
      };

      await supabase.from('irregular_verbs_progress').upsert(record, {
        onConflict: 'user_id,verb_id',
      });
    } catch (e) {
      console.warn('Database saveIrregularVerbProgress exception:', e);
    }
  },

  // Save speaking result
  async saveSpeakingResult(userId: string, result: SpeakingResult): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;
    try {
      await supabase.from('speaking_results').insert({
        user_id: userId,
        sentence_id: result.sentenceId,
        score: result.score,
        spoken_text: result.spokenText,
        created_at: result.practicedAt,
      });
    } catch (e) {
      console.warn('Database saveSpeakingResult exception:', e);
    }
  },

  // Save spelling result
  async saveSpellingResult(
    userId: string,
    wordId: string,
    isCorrect: boolean,
    attempt: string
  ): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;
    try {
      await supabase.from('spelling_results').insert({
        user_id: userId,
        word_id: wordId,
        is_correct: isCorrect,
        attempt,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Database saveSpellingResult exception:', e);
    }
  },

  // Save quiz result
  async saveQuizResult(
    userId: string,
    mode: string,
    score: number,
    totalQuestions: number
  ): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;
    try {
      await supabase.from('quiz_results').insert({
        user_id: userId,
        mode,
        score,
        total_questions: totalQuestions,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Database saveQuizResult exception:', e);
    }
  },
};
