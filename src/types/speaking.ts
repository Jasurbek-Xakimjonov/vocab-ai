export type SpeakingCategory =
  | 'Vocabulary'
  | 'Irregular verbs'
  | 'Daily English'
  | 'Beginner English'
  | 'School English';

export interface SpeakingSentence {
  id: string;
  category: SpeakingCategory;
  text: string;
  translationUz: string;
  phonetic?: string;
  difficulty: 'A1' | 'A2' | 'B1';
}

export interface WordComparison {
  expected: string;
  spoken?: string;
  isMatch: boolean;
}

export interface SpeakingResult {
  sentenceId: string;
  targetSentence: string;
  spokenText: string;
  words: WordComparison[];
  score: number; // percentage 0 - 100
  feedbackUz: string;
  practicedAt: string;
}
