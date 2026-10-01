import React, { useState, useEffect, useMemo } from 'react';
import {
  Dumbbell,
  CheckCircle2,
  XCircle,
  Volume2,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  HelpCircle,
  Check,
  X,
  VolumeX,
} from 'lucide-react';
import { VocabularyWord, PracticeMode } from '../types/vocabulary';
import { speakWord } from '../utils/speech';
import { Storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { NavTab } from '../components/Sidebar';

interface PracticeProps {
  words: VocabularyWord[];
  onRefreshWords: () => void;
  onNavigate: (tab: NavTab) => void;
}

interface Question {
  targetWord: VocabularyWord;
  options?: string[]; // for multiple choice
  correctOption?: string;
  isTrueStatement?: boolean; // for true/false
  statementTranslation?: string; // for true/false
}

export const Practice: React.FC<PracticeProps> = ({
  words,
  onRefreshWords,
  onNavigate,
}) => {
  const toast = useToast();

  const [selectedMode, setSelectedMode] = useState<PracticeMode>('multiple_choice');
  const [isPlaying, setIsPlaying] = useState(false);

  // Session state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userSelectedAnswer, setUserSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Score state
  const [score, setScore] = useState(0);
  const [streakInSession, setStreakInSession] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Generate question deck based on mode
  const generateQuestions = (mode: PracticeMode, pool: VocabularyWord[]) => {
    if (pool.length < 4) {
      toast.error('Mashq uchun kamida 4 ta so\'z kerak.');
      return;
    }

    const shuffledWords = [...pool].sort(() => 0.5 - Math.random());
    const count = Math.min(10, pool.length);
    const sessionItems = shuffledWords.slice(0, count);

    const generated: Question[] = sessionItems.map((target) => {
      // Pick 3 random distractor words
      const otherWords = pool.filter((w) => w.id !== target.id);
      const distractors = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);

      if (mode === 'multiple_choice') {
        const options = [target.translation, ...distractors.map((d) => d.translation)].sort(
          () => 0.5 - Math.random()
        );
        return {
          targetWord: target,
          options,
          correctOption: target.translation,
        };
      } else if (mode === 'uzbek_to_english') {
        const options = [target.word, ...distractors.map((d) => d.word)].sort(
          () => 0.5 - Math.random()
        );
        return {
          targetWord: target,
          options,
          correctOption: target.word,
        };
      } else if (mode === 'true_false') {
        const isTrue = Math.random() > 0.5;
        const shownTranslation = isTrue ? target.translation : distractors[0].translation;
        return {
          targetWord: target,
          isTrueStatement: isTrue,
          statementTranslation: shownTranslation,
        };
      } else if (mode === 'listening') {
        const options = [target.word, ...distractors.map((d) => d.word)].sort(
          () => 0.5 - Math.random()
        );
        return {
          targetWord: target,
          options,
          correctOption: target.word,
        };
      } else {
        // type_answer
        return {
          targetWord: target,
          correctOption: target.word.toLowerCase().trim(),
        };
      }
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setUserSelectedAnswer(null);
    setTypedAnswer('');
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setScore(0);
    setStreakInSession(0);
    setIsSessionFinished(false);
    setIsPlaying(true);

    // If listening mode, automatically pronounce the first word
    if (mode === 'listening' && generated[0]) {
      setTimeout(() => {
        speakWord(generated[0].targetWord.word);
      }, 300);
    }
  };

  const currentQ = questions[currentIndex];

  // Auto pronounce in listening mode on step change
  useEffect(() => {
    if (isPlaying && selectedMode === 'listening' && currentQ) {
      speakWord(currentQ.targetWord.word);
    }
  }, [currentIndex, isPlaying, selectedMode]);

  // Handle Option Selection
  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted) return;

    setUserSelectedAnswer(option);
    setIsAnswerSubmitted(true);

    let correct = false;
    if (selectedMode === 'true_false') {
      const chosenBool = option === 'true';
      correct = chosenBool === currentQ.isTrueStatement;
    } else {
      correct = option.toLowerCase().trim() === currentQ.correctOption?.toLowerCase().trim();
    }

    setIsCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
      setStreakInSession((s) => s + 1);
      // Give feedback sound/pronunciation
      speakWord(currentQ.targetWord.word);
    } else {
      setStreakInSession(0);
    }
  };

  // Handle Typed Answer Submission
  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswerSubmitted || !typedAnswer.trim()) return;

    setIsAnswerSubmitted(true);
    const cleanTyped = typedAnswer.toLowerCase().trim();
    const cleanTarget = currentQ.targetWord.word.toLowerCase().trim();

    const correct = cleanTyped === cleanTarget;
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 1);
      setStreakInSession((s) => s + 1);
      speakWord(currentQ.targetWord.word);
    } else {
      setStreakInSession(0);
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setUserSelectedAnswer(null);
      setTypedAnswer('');
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
    } else {
      // Finish Session
      setIsSessionFinished(true);
      const total = questions.length;
      const finalScore = isCorrect ? score : score; // already updated
      const accuracy = Math.round((finalScore / total) * 100);

      Storage.savePracticeSession({
        mode: selectedMode,
        totalQuestions: total,
        correctAnswers: finalScore,
        accuracy,
      });
      onRefreshWords();
    }
  };

  if (words.length < 4) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center mx-auto shadow-2xl">
          <Dumbbell className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">So'zlar yetarli emas</h2>
          <p className="text-slate-400 text-sm">
            Mashq qilish uchun kutubxonangizda kamida 4 ta so'z bo'lishi kerak.
          </p>
        </div>
        <button
          onClick={() => onNavigate('import')}
          className="px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 font-bold text-sm shadow-xl hover:bg-amber-300 transition-all"
        >
          Rasm orqali so'z yuklash
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      {!isPlaying && (
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Learning Modes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Vocabulary Practice & Quiz
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            O'rgangan so'zlaringizni 5 xil interaktiv rejimda sinovdan o'tkazing va xotirangizni mustahkamlang.
          </p>
        </div>
      )}

      {/* Mode Selection Cards */}
      {!isPlaying ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'multiple_choice' as PracticeMode,
              title: 'Mode 1: Multiple Choice',
              desc: 'Inglizcha so\'z beriladi, 4 ta o\'zbekcha variantdan to\'g\'risini tanlang.',
              badge: 'Klassik',
            },
            {
              id: 'uzbek_to_english' as PracticeMode,
              title: 'Mode 2: Uzbek → English',
              desc: 'O\'zbekcha ma\'nosi beriladi, to\'g\'ri inglizcha so\'zni toping.',
              badge: 'Tarjima',
            },
            {
              id: 'type_answer' as PracticeMode,
              title: 'Mode 3: Type the answer',
              desc: 'So\'zni klaviaturada yozing. To\'g\'ri yozilish (spelling) mashqi.',
              badge: 'Spelling',
            },
            {
              id: 'true_false' as PracticeMode,
              title: 'Mode 4: True / False',
              desc: 'So\'z va tarjima juftligi to\'g\'rimi yoki noto\'g\'ri? Tezkor qaror qabul qiling.',
              badge: 'Tezkor',
            },
            {
              id: 'listening' as PracticeMode,
              title: 'Mode 5: Listening Audio',
              desc: 'Pronunciation (talaffuz)ni eshiting va mos so\'zni toping.',
              badge: 'Audio',
            },
          ].map((mode) => (
            <div
              key={mode.id}
              onClick={() => {
                setSelectedMode(mode.id);
                generateQuestions(mode.id, words);
              }}
              className="group p-6 rounded-2xl bg-[#0d1322] border border-white/5 hover:border-amber-400/40 cursor-pointer transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    {mode.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                  {mode.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{mode.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>Boshlash &rarr;</span>
                <span className="text-slate-500 font-normal">10 ta savol</span>
              </div>
            </div>
          ))}
        </div>
      ) : isSessionFinished ? (
        // SESSION SUMMARY RESULTS
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-[#101a2e] border border-white/10 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white">Natijangiz</h3>
            <p className="text-slate-300 text-sm">
              Siz <strong>{questions.length}</strong> ta savoldan <strong>{score}</strong> tasiga to'g'ri javob berdingiz.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5">
              <span className="text-xs text-slate-400 block mb-1">To'g'rilik (Accuracy)</span>
              <span className="text-2xl font-black text-amber-300">
                {Math.round((score / questions.length) * 100)}%
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5">
              <span className="text-xs text-slate-400 block mb-1">To'plangan ball</span>
              <span className="text-2xl font-black text-emerald-400">
                {score} / {questions.length}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => generateQuestions(selectedMode, words)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qaytadan urinish</span>
            </button>

            <button
              onClick={() => setIsPlaying(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-white/10 transition-colors"
            >
              Boshqa rejimni tanlash
            </button>
          </div>
        </div>
      ) : (
        // ACTIVE QUIZ INTERFACE
        currentQ && (
          <div className="space-y-6">
            {/* Quiz Top Status */}
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
              <button
                onClick={() => setIsPlaying(false)}
                className="hover:text-white transition-colors"
              >
                &larr; Rejimni o'zgartirish
              </button>

              <div className="flex items-center gap-4">
                <span>
                  Savol: <strong className="text-white">{currentIndex + 1}</strong> / {questions.length}
                </span>
                <span className="text-amber-400 font-bold">
                  Ball: {score}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="rounded-3xl bg-[#0d1322] border border-white/10 p-6 sm:p-10 shadow-2xl space-y-8">
              {/* Question Prompt */}
              <div className="text-center space-y-3">
                <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  {selectedMode === 'multiple_choice' && 'To\'g\'ri tarjimani tanlang'}
                  {selectedMode === 'uzbek_to_english' && 'Inglizcha so\'zni toping'}
                  {selectedMode === 'type_answer' && 'Inglizcha so\'zni yozing'}
                  {selectedMode === 'true_false' && 'Bu tarjima to\'g\'rimi?'}
                  {selectedMode === 'listening' && 'Eshiting va to\'g\'ri so\'zni tanlang'}
                </span>

                {/* Prompt Display */}
                {selectedMode === 'listening' ? (
                  <div className="flex flex-col items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => speakWord(currentQ.targetWord.word)}
                      className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-400/25 hover:scale-105 active:scale-95 transition-all"
                      title="Qayta eshitish"
                    >
                      <Volume2 className="w-8 h-8" />
                    </button>
                    <span className="text-xs text-slate-400">
                      Ovozni qayta eshitish uchun bosing
                    </span>
                  </div>
                ) : selectedMode === 'uzbek_to_english' ? (
                  <h2 className="text-2xl sm:text-4xl font-black text-amber-300">
                    {currentQ.targetWord.translation}
                  </h2>
                ) : selectedMode === 'true_false' ? (
                  <div className="space-y-3 pt-2">
                    <h2 className="text-3xl sm:text-4xl font-black text-white">
                      {currentQ.targetWord.word}
                    </h2>
                    <div className="text-lg text-slate-300">
                      = <strong className="text-amber-300">"{currentQ.statementTranslation}"</strong>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-5xl font-black text-white">
                      {currentQ.targetWord.word}
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => speakWord(currentQ.targetWord.word)}
                        className="text-slate-500 hover:text-amber-300 p-1"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-slate-400 text-sm">
                        {currentQ.targetWord.pronunciation}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ANSWER OPTIONS / INPUT SECTION */}
              {selectedMode === 'type_answer' ? (
                <form onSubmit={handleTypeSubmit} className="max-w-md mx-auto space-y-4">
                  <div className="text-center text-sm text-slate-300 font-medium">
                    Tarjimasi: <strong className="text-amber-300">{currentQ.targetWord.translation}</strong>
                  </div>

                  <input
                    type="text"
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    disabled={isAnswerSubmitted}
                    placeholder="So'zni kiriting..."
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-900 border border-white/10 text-white text-center font-bold text-lg placeholder-slate-600 focus:outline-none focus:border-amber-400/80"
                    autoFocus
                  />

                  {!isAnswerSubmitted ? (
                    <button
                      type="submit"
                      disabled={!typedAnswer.trim()}
                      className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all disabled:opacity-50"
                    >
                      Tekshirish
                    </button>
                  ) : null}
                </form>
              ) : selectedMode === 'true_false' ? (
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <button
                    onClick={() => handleSelectOption('true')}
                    disabled={isAnswerSubmitted}
                    className={`py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border transition-all ${
                      isAnswerSubmitted
                        ? currentQ.isTrueStatement
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : userSelectedAnswer === 'true'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-white/5 text-slate-600'
                        : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-white hover:border-emerald-500/40 active:scale-95'
                    }`}
                  >
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>To'g'ri (True)</span>
                  </button>

                  <button
                    onClick={() => handleSelectOption('false')}
                    disabled={isAnswerSubmitted}
                    className={`py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border transition-all ${
                      isAnswerSubmitted
                        ? !currentQ.isTrueStatement
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : userSelectedAnswer === 'false'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-white/5 text-slate-600'
                        : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-white hover:border-rose-500/40 active:scale-95'
                    }`}
                  >
                    <X className="w-5 h-5 text-rose-400" />
                    <span>Noto'g'ri (False)</span>
                  </button>
                </div>
              ) : (
                // Multiple Choice / Uzbek -> English / Listening Options
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto">
                  {currentQ.options?.map((option, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = userSelectedAnswer === option;
                    const isTheCorrectOne =
                      option.toLowerCase().trim() === currentQ.correctOption?.toLowerCase().trim();

                    let btnStyle =
                      'bg-slate-900/80 border-white/10 text-slate-200 hover:bg-slate-800 hover:border-amber-400/30';

                    if (isAnswerSubmitted) {
                      if (isTheCorrectOne) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                      } else {
                        btnStyle = 'bg-slate-900/40 border-white/5 text-slate-600';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(option)}
                        disabled={isAnswerSubmitted}
                        className={`group p-4 rounded-2xl border text-left font-semibold text-sm flex items-center gap-3.5 transition-all ${btnStyle} ${
                          !isAnswerSubmitted ? 'active:scale-98' : ''
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isAnswerSubmitted && isTheCorrectOne
                              ? 'bg-emerald-500 text-slate-950'
                              : isAnswerSubmitted && isSelected
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-800 text-slate-400 group-hover:text-amber-300'
                          }`}
                        >
                          {letters[idx]}
                        </span>
                        <span className="flex-1 truncate">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Feedback Alert Bar after answering */}
              {isAnswerSubmitted && (
                <div
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in ${
                    isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-sm">
                        {isCorrect ? 'Correct! To\'g\'ri javob ✓' : 'Wrong! Noto\'g\'ri ×'}
                      </div>
                      <div className="text-xs text-slate-300">
                        To'g'ri javob: <strong>{currentQ.targetWord.word}</strong> — {currentQ.targetWord.translation}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-all shrink-0 active:scale-95 shadow-md"
                  >
                    {currentIndex < questions.length - 1 ? 'Keyingisi &rarr;' : 'Natijani ko\'rish'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};
