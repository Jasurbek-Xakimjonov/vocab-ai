export type VideoDifficulty = 'Beginner' | 'Elementary' | 'Intermediate';
export type VideoAccent = 'US English' | 'UK English';

export type VideoCategory =
  | 'Beginner Stories'
  | 'Elementary Stories'
  | 'Daily English'
  | 'School English'
  | 'Listening Practice'
  | 'Speaking Practice';

export interface VideoTranscriptSentence {
  id: string;
  startTimeSec?: number;
  text: string;
  translationUz?: string;
}

export interface VideoVocabularyWord {
  word: string;
  translation: string;
  pronunciation?: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
  definition?: string;
  example: string;
}

export interface SpeakingVideo {
  id: string;
  title: string;
  youtubeId: string;
  accent: VideoAccent;
  level: VideoDifficulty;
  category: VideoCategory;
  description: string;
  duration: string;
  source: string;
  transcript?: VideoTranscriptSentence[];
  speakingSentences: VideoTranscriptSentence[];
  vocabulary: VideoVocabularyWord[];
}

export interface VideoSpeakingScoreRecord {
  bestScore: number;
  completedAt: string;
}

export interface VideoProgressState {
  watchedVideoIds: string[];
  savedVideoIds: string[];
  speakingScores: Record<string, VideoSpeakingScoreRecord>; // key: sentenceId
  lastWatchedVideoId?: string;
}
