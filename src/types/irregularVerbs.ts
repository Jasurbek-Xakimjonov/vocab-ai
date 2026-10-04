export interface IrregularVerb {
  id: string;
  v1: string; // Base Form
  v2: string; // Past Simple
  v3: string; // Past Participle
  translation: string; // Uzbek translation
  pronunciation: string;
  example: string;
  exampleTranslation?: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
  status: 'learning' | 'learned' | 'difficult';
  isFavorite: boolean;
  reviewCount: number;
  correct_count?: number;
  wrong_count?: number;
  lastRating?: 'again' | 'hard' | 'good' | 'easy';
  lastReviewedAt?: string;
  last_reviewed_at?: string;
  intervalDays?: number;
}

export type IrregularPracticeMode =
  | 'past_simple_mc'
  | 'past_simple_type'
  | 'past_simple_sentences'
  | 'past_simple_negative_question'
  | 'multiple_choice'
  | 'type_answer'
  | 'complete_forms'
  | 'uzbek_to_english'
  | 'mixed';
