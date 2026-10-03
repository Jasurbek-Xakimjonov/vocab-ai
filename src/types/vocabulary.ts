export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'phrasal verb'
  | 'idiom'
  | 'preposition'
  | string;

export type WordStatus = 'learning' | 'learned' | 'difficult';

export type RatingLevel = 'again' | 'hard' | 'good' | 'easy';

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  definition: string;
  example: string;
  pronunciation: string;
  partOfSpeech: PartOfSpeech;
  status: WordStatus;
  isFavorite: boolean;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  lastRating?: RatingLevel;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  intervalDays?: number;
  easeFactor?: number;
  createdAt: string;
}

export type PracticeMode =
  | 'multiple_choice'
  | 'uzbek_to_english'
  | 'type_answer'
  | 'true_false'
  | 'listening'
  | 'past_simple_verbs'
  | 'past_simple_sentences'
  | 'past_simple_typing'
  | 'past_simple_negative_questions'
  | 'complete_three_forms'
  | 'past_simple_audio'
  | 'past_simple_super_mix';

export interface PracticeSessionRecord {
  id: string;
  date: string;
  mode: PracticeMode;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export interface UserStats {
  streakDays: number;
  lastActiveDate: string;
  dailyGoal: number; // e.g. 10, 20, 30
  todayReviewedCount: number;
  totalPracticeSessions: number;
  weeklyActivity: { [dateKey: string]: number }; // YYYY-MM-DD -> count
}

export type WordFilter = 'all' | 'learning' | 'learned' | 'difficult' | 'favorites';
