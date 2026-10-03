export interface GrammarExample {
  en: string;
  uz: string;
}

export interface GrammarRule {
  title: string;
  explanation: string;
  explanationUz: string;
  examples: GrammarExample[];
}

export interface GrammarQuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  explanationUz: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  category: 'Tenses' | 'Modals' | 'Nouns & Articles' | 'Adjectives' | 'Structures';
  level: 'Beginner (A1)' | 'Elementary (A2)' | 'Intermediate (B1)';
  summaryUz: string;
  formula: string;
  rules: GrammarRule[];
  commonMistakes: { mistake: string; correction: string; note: string }[];
  quiz: GrammarQuizQuestion[];
}

export interface GrammarProgressRecord {
  topicId: string;
  completed: boolean;
  score: number;
  totalQuestions: number;
  lastPracticedAt: string;
}
