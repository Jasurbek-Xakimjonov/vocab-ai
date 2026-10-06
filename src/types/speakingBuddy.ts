export type SpeakingBuddyLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface BuddyLevelInfo {
  level: SpeakingBuddyLevel;
  name: string;
  nameUz: string;
  badge: string;
  description: string;
  descriptionUz: string;
}

export interface BuddySuggestion {
  english: string;
  uzbek: string;
}

export interface BuddyCorrection {
  original: string;
  corrected: string;
  explanationUz: string;
}

export interface BuddyVocabItem {
  word: string;
  translation: string;
  partOfSpeech?: string;
  definition?: string;
  example?: string;
  pronunciation?: string;
}

export interface BuddyMessage {
  id: string;
  sender: 'ai' | 'user';
  englishText: string;
  uzbekText: string;
  timestamp: string;
  gentleCorrection?: BuddyCorrection;
  suggestions?: BuddySuggestion[];
  keyVocabulary?: BuddyVocabItem[];
  isExplanation?: boolean;
}

export interface BuddyTopic {
  id: string;
  level: SpeakingBuddyLevel;
  title: string;
  titleUz: string;
  icon: string;
  description: string;
  descriptionUz: string;
  initialMessage: {
    english: string;
    uzbek: string;
  };
  sampleSuggestions: BuddySuggestion[];
}

export interface SpeakingSessionRecord {
  id: string;
  topicId: string;
  topicTitle: string;
  level: SpeakingBuddyLevel;
  date: string;
  durationSeconds: number;
  questionsAnswered: number;
  wordsPracticed: number;
  score: number;
  messagesCount: number;
}

export interface SpeakingBuddyUserState {
  currentLevel: SpeakingBuddyLevel;
  currentStreak: number;
  bestStreak: number;
  lastPracticeDate: string | null;
  totalConversationsCompleted: number;
  totalWordsPracticed: number;
  totalSpeakingTimeSeconds: number;
  sessions: SpeakingSessionRecord[];
}
