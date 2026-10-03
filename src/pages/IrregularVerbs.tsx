import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Volume2,
  Search,
  Star,
  CheckCircle2,
  BookOpen,
  Zap,
  Play,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Check,
  X,
  HelpCircle,
  Clock,
  Dumbbell,
} from 'lucide-react';
import { IrregularVerb, IrregularPracticeMode } from '../types/irregularVerbs';
import { Storage } from '../utils/storage';
import { speakWord } from '../utils/speech';
import { useToast } from '../components/Toast';
import { NavTab } from '../components/Sidebar';
import {
  PAST_SIMPLE_SENTENCE_TEMPLATES,
  PAST_SIMPLE_NEGATIVE_QUESTIONS,
} from '../utils/pastSimpleExercises';

interface IrregularVerbsProps {
  onNavigate: (tab: NavTab) => void;
  selectedVerbFromSearch?: IrregularVerb | null;
}

interface QuizQuestion {
  verb: IrregularVerb;
  type:
    | 'past_simple_mc'
    | 'past_simple_type'
    | 'past_simple_sentences'
    | 'past_simple_negative_question'
    | 'past_participle_mc'
    | 'type_past'
    | 'complete_three'
    | 'uzbek_to_english';
  promptTitle: string;
  promptWord: string;
  subPrompt?: string;
  correctAnswer: string;
  options?: string[];
  hint?: string;
}

export const IrregularVerbs: React.FC<IrregularVerbsProps> = ({
  onNavigate,
  selectedVerbFromSearch,
}) => {
  const toast = useToast();

  const [verbs, setVerbs] = useState<IrregularVerb[]>(() => Storage.getIrregularVerbs());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLetter, setFilterLetter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'learning' | 'learned' | 'difficult' | 'favorites'>('all');
  const [selectedVerb, setSelectedVerb] = useState<IrregularVerb | null>(null);

  // Practice state
  const [isPracticing, setIsPracticing] = useState(false);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [questionCountChoice, setQuestionCountChoice] = useState<number>(10);
  const [practiceMode, setPracticeMode] = useState<IrregularPracticeMode>('mixed');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedInput, setTypedInput] = useState('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Sync when event dispatched
  useEffect(() => {
    const handleUpdate = () => {
      setVerbs(Storage.getIrregularVerbs());
    };
    window.addEventListener('vocabai_irregular_verbs_updated', handleUpdate);
    return () => window.removeEventListener('vocabai_irregular_verbs_updated', handleUpdate);
  }, []);

  // Open detail if navigated from search
  useEffect(() => {
    if (selectedVerbFromSearch) {
      setSelectedVerb(selectedVerbFromSearch);
    }
  }, [selectedVerbFromSearch]);

  // Alphabet letters present in verbs
  const letters = useMemo(() => {
    const set = new Set<string>();
    verbs.forEach((v) => set.add(v.v1.charAt(0).toUpperCase()));
    return Array.from(set).sort();
  }, [verbs]);

  // Filtered verbs list
  const filteredVerbs = useMemo(() => {
    let result = [...verbs].sort((a, b) => a.v1.localeCompare(b.v1));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (v) =>
          v.v1.toLowerCase().includes(q) ||
          v.v2.toLowerCase().includes(q) ||
          v.v3.toLowerCase().includes(q) ||
          v.translation.toLowerCase().includes(q)
      );
    }

    if (filterLetter !== 'all') {
      result = result.filter((v) => v.v1.charAt(0).toUpperCase() === filterLetter);
    }

    if (statusFilter === 'learning') {
      result = result.filter((v) => v.status === 'learning');
    } else if (statusFilter === 'learned') {
      result = result.filter((v) => v.status === 'learned');
    } else if (statusFilter === 'difficult') {
      result = result.filter((v) => v.status === 'difficult');
    } else if (statusFilter === 'favorites') {
      result = result.filter((v) => v.isFavorite);
    }

    return result;
  }, [verbs, searchQuery, filterLetter, statusFilter]);

  // Handlers
  const handleToggleFavorite = (e: React.MouseEvent, verbId: string) => {
    e.stopPropagation();
    const isFav = Storage.toggleFavoriteIrregularVerb(verbId);
    toast.info(isFav ? "Sevimlilarga qo'shildi" : "Sevimlilardan olib tashlandi");
  };

  const handleRateVerb = (verbId: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
    Storage.rateIrregularVerb(verbId, rating);
    if (rating === 'again') {
      toast.info("Qiyin fe'llarga kiritildi");
    } else if (rating === 'good' || rating === 'easy') {
      toast.success("O'zlashtirildi deb saqlandi! ✅");
    }
    // Update local selected verb object
    const updated = Storage.getIrregularVerbs().find((v) => v.id === verbId);
    if (updated) setSelectedVerb(updated);
  };

  const handleToggleLearned = (verbId: string, currentStatus: string) => {
    const newStatus = currentStatus !== 'learned';
    Storage.markIrregularVerbLearned(verbId, newStatus);
    toast.success(newStatus ? "Yodlanganlarga qo'shildi! ✅" : "O'rganilmoqda holatiga o'tkazildi");
    const updated = Storage.getIrregularVerbs().find((v) => v.id === verbId);
    if (updated) setSelectedVerb(updated);
  };

  // Generate Questions for Practice
  const startPractice = (
    mode: IrregularPracticeMode,
    targetVerb?: IrregularVerb,
    customCount?: number
  ) => {
    const pool = targetVerb ? [targetVerb, ...verbs.filter((v) => v.id !== targetVerb.id)] : [...verbs];
    if (pool.length < 4) {
      toast.error("Mashq uchun kamida 4 ta fe'l kerak.");
      return;
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const count = customCount || (targetVerb ? 5 : Math.min(questionCountChoice, pool.length));
    const selectedList = targetVerb
      ? Array(5).fill(targetVerb)
      : shuffled.slice(0, Math.min(count, pool.length));

    let generated: QuizQuestion[] = [];

    if (mode === 'past_simple_sentences') {
      const templates = [...PAST_SIMPLE_SENTENCE_TEMPLATES].sort(() => 0.5 - Math.random());
      const selectedTemplates = templates.slice(0, Math.min(count, templates.length));
      const allV2s = verbs.map((v) => v.v2);

      generated = selectedTemplates.map((tmpl) => {
        const matchingVerb = verbs.find((v) => v.id === tmpl.verbId) || verbs[0];
        const others = allV2s
          .filter((v) => v.toLowerCase() !== tmpl.correct.toLowerCase())
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const options = [tmpl.correct, ...others].sort(() => 0.5 - Math.random());

        return {
          verb: matchingVerb,
          type: 'past_simple_sentences',
          promptTitle: 'Gapdagi bo\'sh joyga to\'g\'ri Past Simple (V2) fe\'lini qo\'ying',
          promptWord: tmpl.sentence.replace('{gap}', '______'),
          subPrompt: tmpl.translationUz,
          correctAnswer: tmpl.correct,
          options,
        };
      });
    } else if (mode === 'past_simple_negative_question') {
      const items = [...PAST_SIMPLE_NEGATIVE_QUESTIONS].sort(() => 0.5 - Math.random());
      const selectedItems = items.slice(0, Math.min(count, items.length));

      generated = selectedItems.map((q) => {
        const dummyVerb = verbs[0];
        // Distractors
        let distractors = [
          q.correctAnswer.replace("didn't", 'don\'t'),
          q.correctAnswer.replace("didn't", 'wasn\'t'),
          q.correctAnswer.replace('Did', 'Do'),
        ];
        if (q.correctAnswer.includes("didn't")) {
          distractors = [
            q.correctAnswer.replace("didn't", "doesn't"),
            q.correctAnswer + 'ed',
            "not " + q.correctAnswer.split(' ')[1],
          ];
        }
        const options = [q.correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

        return {
          verb: dummyVerb,
          type: 'past_simple_negative_question',
          promptTitle: 'Inkor yoki so\'roq gapda Past Simple qoidasini qo\'llang',
          promptWord: q.prompt,
          subPrompt: q.ruleExplanationUz,
          correctAnswer: q.correctAnswer,
          options,
        };
      });
    } else {
      generated = selectedList.map((target, idx) => {
        const others = verbs.filter((v) => v.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 3);

        let questionType: QuizQuestion['type'] = 'past_simple_mc';
        if (mode === 'past_simple_mc') {
          questionType = 'past_simple_mc';
        } else if (mode === 'past_simple_type') {
          questionType = 'past_simple_type';
        } else if (mode === 'multiple_choice') {
          questionType = idx % 2 === 0 ? 'past_simple_mc' : 'past_participle_mc';
        } else if (mode === 'type_answer') {
          questionType = 'type_past';
        } else if (mode === 'complete_forms') {
          questionType = 'complete_three';
        } else if (mode === 'uzbek_to_english') {
          questionType = 'uzbek_to_english';
        } else {
          // Mixed mode: distribute across varied types
          const types: QuizQuestion['type'][] = [
            'past_simple_mc',
            'past_simple_type',
            'past_participle_mc',
            'complete_three',
            'uzbek_to_english',
          ];
          questionType = types[idx % types.length];
        }

        if (questionType === 'past_simple_mc') {
          const options = [target.v2, ...others.map((o) => o.v2)].sort(() => 0.5 - Math.random());
          return {
            verb: target,
            type: questionType,
            promptTitle: 'Past Simple (V2) shaklini toping',
            promptWord: target.v1,
            subPrompt: `O'zbekcha: ${target.translation}`,
            correctAnswer: target.v2,
            options,
          };
        } else if (questionType === 'past_simple_type' || questionType === 'type_past') {
          return {
            verb: target,
            type: questionType,
            promptTitle: 'Past Simple (V2) shaklini klaviaturada yozing',
            promptWord: `${target.v1}`,
            subPrompt: `O'zbekcha ma'nosi: "${target.translation}"`,
            correctAnswer: target.v2.toLowerCase().trim(),
          };
        } else if (questionType === 'past_participle_mc') {
          const options = [target.v3, ...others.map((o) => o.v3)].sort(() => 0.5 - Math.random());
          return {
            verb: target,
            type: questionType,
            promptTitle: 'Past Participle (V3) shaklini toping',
            promptWord: target.v1,
            subPrompt: `V1: ${target.v1} → V2: ${target.v2} → V3: ?`,
            correctAnswer: target.v3,
            options,
          };
        } else if (questionType === 'complete_three') {
          return {
            verb: target,
            type: questionType,
            promptTitle: '3-shakl (Past Participle) ni to\'ldiring',
            promptWord: `${target.v1} → ${target.v2} → [ ? ]`,
            subPrompt: `O'zbekcha: ${target.translation}`,
            correctAnswer: target.v3.toLowerCase().trim(),
          };
        } else {
          // uzbek_to_english
          return {
            verb: target,
            type: questionType,
            promptTitle: 'O\'zbekcha ma\'noga mos asosiy fe\'l (V1) ni yozing',
            promptWord: target.translation,
            correctAnswer: target.v1.toLowerCase().trim(),
          };
        }
      });
    }

    setQuestions(generated);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setTypedInput('');
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setQuizScore(0);
    setQuizFinished(false);
    setPracticeMode(mode);
    setIsPracticing(true);
    setIsPracticeModalOpen(false);
    setSelectedVerb(null);
  };

  const currentQ = questions[currentQIndex];

  // Submit Answer
  const handleSubmitOption = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
    setIsAnswerSubmitted(true);

    const match = option.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase().trim();
    setIsCorrect(match);
    if (match) {
      setQuizScore((s) => s + 1);
      speakWord(currentQ.verb.v1);
    }
  };

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswerSubmitted || !typedInput.trim()) return;

    setIsAnswerSubmitted(true);
    const cleanUser = typedInput.toLowerCase().trim();
    // Support slash options like "was / were" or "learned / learnt"
    const allowed = currentQ.correctAnswer
      .toLowerCase()
      .split(/[\/,]/)
      .map((s) => s.trim());
    const match = allowed.includes(cleanUser) || cleanUser === currentQ.correctAnswer.toLowerCase().trim();

    setIsCorrect(match);
    if (match) {
      setQuizScore((s) => s + 1);
      speakWord(currentQ.verb.v1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((i) => i + 1);
      setSelectedOption(null);
      setTypedInput('');
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
    } else {
      setQuizFinished(true);
    }
  };

  const learnedCount = verbs.filter((v) => v.status === 'learned').length;
  const learningCount = verbs.filter((v) => v.status === 'learning').length;
  const difficultCount = verbs.filter((v) => v.status === 'difficult').length;

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header Banner */}
      {!isPracticing && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Essential Irregular Verbs • 3 Forms</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Irregular Verbs (Noto'g'ri fe'llar)
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Ingliz tilidagi barcha muhim noto'g'ri fe'llarning 3 xil shaklini (Base &rarr; Past Simple &rarr; Past Participle) o'rganing va 5 xil rejimda mashq qiling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsPracticeModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-400/20 active:scale-95 transition-all"
            >
              <Dumbbell className="w-4 h-4 fill-slate-950" />
              <span>Mashq rejimini tanlash</span>
            </button>

            <button
              onClick={() => startPractice('past_simple_sentences')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs sm:text-sm border border-amber-400/30 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Gaplarda Past Simple</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE PRACTICE QUIZ INTERFACE */}
      {isPracticing ? (
        quizFinished ? (
          // Practice Finished Summary
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-[#101a2e] border border-white/10 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
              <Sparkles className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-white">Natijangiz</h3>
              <p className="text-slate-300 text-sm">
                Siz <strong>{questions.length}</strong> ta savoldan <strong>{quizScore}</strong> tasiga to'g'ri javob berdingiz.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-xs text-slate-400 block mb-1">To'g'rilik (Accuracy)</span>
                <span className="text-2xl font-black text-amber-300">
                  {Math.round((quizScore / questions.length) * 100)}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-xs text-slate-400 block mb-1">To'plangan ball</span>
                <span className="text-2xl font-black text-emerald-400">
                  {quizScore} / {questions.length}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => startPractice(practiceMode)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qaytadan urinish</span>
              </button>

              <button
                onClick={() => setIsPracticing(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-white/10 transition-colors"
              >
                Ro'yxatga qaytish
              </button>
            </div>
          </div>
        ) : (
          // Active Practice Card
          currentQ && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Top Navigation */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => setIsPracticing(false)}
                  className="hover:text-white transition-colors"
                >
                  &larr; Mashqdan chiqish
                </button>
                <div className="flex items-center gap-4">
                  <span>
                    Savol: <strong className="text-white">{currentQIndex + 1}</strong> / {questions.length}
                  </span>
                  <span className="text-amber-400 font-bold">
                    Ball: {quizScore}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Card Container */}
              <div className="rounded-3xl bg-[#0d1322] border border-white/10 p-6 sm:p-10 shadow-2xl space-y-8">
                <div className="text-center space-y-3">
                  <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
                    {currentQ.promptTitle}
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-relaxed max-w-xl mx-auto">
                    {currentQ.promptWord}
                  </h2>

                  {currentQ.subPrompt && (
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                      🇺🇿 {currentQ.subPrompt}
                    </p>
                  )}
                </div>

                {/* Multiple Choice Options */}
                {currentQ.options ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mx-auto">
                    {currentQ.options.map((opt, idx) => {
                      const letters = ['A', 'B', 'C', 'D'];
                      const isSelected = selectedOption === opt;
                      const isTheRightOne =
                        opt.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase().trim();

                      let btnStyle =
                        'bg-slate-900 border-white/10 text-white hover:bg-slate-800 hover:border-amber-400/30';

                      if (isAnswerSubmitted) {
                        if (isTheRightOne) {
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
                          onClick={() => handleSubmitOption(opt)}
                          disabled={isAnswerSubmitted}
                          className={`p-4 rounded-2xl border text-left font-bold text-base flex items-center gap-3.5 transition-all ${btnStyle}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isAnswerSubmitted && isTheRightOne
                                ? 'bg-emerald-500 text-slate-950'
                                : isAnswerSubmitted && isSelected
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {letters[idx]}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  // Type the Answer Form
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!isAnswerSubmitted) {
                        handleTypeSubmit(e);
                      } else {
                        handleNextQuestion();
                      }
                    }}
                    className="max-w-md mx-auto space-y-4"
                  >
                    <input
                      type="text"
                      value={typedInput}
                      onChange={(e) => setTypedInput(e.target.value)}
                      disabled={isAnswerSubmitted}
                      placeholder="Javobni yozing..."
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      className={`w-full px-5 py-3.5 rounded-2xl bg-slate-900 border text-white text-center font-bold text-lg placeholder-slate-600 focus:outline-none transition-all ${
                        isAnswerSubmitted
                          ? isCorrect
                            ? 'border-emerald-500/80 bg-emerald-500/10 text-emerald-200'
                            : 'border-rose-500/80 bg-rose-500/10 text-rose-200'
                          : 'border-white/10 focus:border-amber-400/80'
                      }`}
                      autoFocus
                    />

                    {!isAnswerSubmitted ? (
                      <button
                        type="submit"
                        disabled={!typedInput.trim()}
                        className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all disabled:opacity-50 active:scale-98 shadow-lg shadow-amber-400/20"
                      >
                        Tekshirish
                      </button>
                    ) : null}
                  </form>
                )}

                {/* Feedback Bar */}
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
                        <X className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-sm">
                          {isCorrect ? '✅ To‘g‘ri!' : '❌ Noto‘g‘ri'}
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5">
                          To‘g‘ri javob: <strong className="text-amber-300 font-semibold">{currentQ.correctAnswer}</strong>
                          {' '}({currentQ.verb.v1} &rarr; {currentQ.verb.v2} &rarr; {currentQ.verb.v3})
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-all shrink-0 active:scale-95 shadow-md"
                    >
                      {currentQIndex < questions.length - 1 ? 'Keyingisi \u2192' : 'Natijani ko\'rish'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        )
      ) : (
        // VERBS LIST & DETAILS VIEW
        <>
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Jami fe'llar</span>
                <span className="text-xl font-black text-white">{verbs.length} ta</span>
              </div>
              <BookOpen className="w-6 h-6 text-amber-400/60" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Yodlanganlar</span>
                <span className="text-xl font-black text-emerald-400">{learnedCount} ta</span>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-400/60" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">O'rganilmoqda</span>
                <span className="text-xl font-black text-amber-400">{learningCount} ta</span>
              </div>
              <Sparkles className="w-6 h-6 text-amber-400/60" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Qiyin fe'llar</span>
                <span className="text-xl font-black text-rose-400">{difficultCount} ta</span>
              </div>
              <HelpCircle className="w-6 h-6 text-rose-400/60" />
            </div>
          </div>

          {/* Search & Letter Filter */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Fe'l yoki tarjimani qidirish..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400/60"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-white/5 overflow-x-auto w-full sm:w-auto">
                {[
                  { id: 'all', label: 'Barchasi' },
                  { id: 'learning', label: "O'rganilmoqda" },
                  { id: 'learned', label: 'Yodlangan' },
                  { id: 'difficult', label: 'Qiyin' },
                  { id: 'favorites', label: '⭐ Sevimlilar' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      statusFilter === tab.id
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* A-Z Letter Filter */}
            <div className="flex items-center gap-1 overflow-x-auto py-1 text-xs">
              <button
                onClick={() => setFilterLetter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  filterLetter === 'all'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                All
              </button>
              {letters.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setFilterLetter(letter)}
                  className={`w-7 h-7 rounded-lg font-bold transition-all flex items-center justify-center shrink-0 ${
                    filterLetter === letter
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Verbs Table / Cards */}
          <div className="rounded-3xl bg-[#0d1322] border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-900/60 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-5">Base Form (V1)</th>
                    <th className="py-4 px-5">Past Simple (V2)</th>
                    <th className="py-4 px-5">Past Participle (V3)</th>
                    <th className="py-4 px-5">O'zbekcha tarjima</th>
                    <th className="py-4 px-5 text-center">Status</th>
                    <th className="py-4 px-5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredVerbs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                        Hech qanday noto'g'ri fe'l topilmadi.
                      </td>
                    </tr>
                  ) : (
                    filteredVerbs.map((verb) => (
                      <tr
                        key={verb.id}
                        onClick={() => setSelectedVerb(verb)}
                        className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                      >
                        {/* V1 */}
                        <td className="py-3.5 px-5 font-bold text-white group-hover:text-amber-300 transition-colors">
                          <div className="flex items-center gap-2">
                            <span>{verb.v1}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speakWord(verb.v1);
                              }}
                              className="text-slate-500 hover:text-amber-400 p-1"
                              title="Pronounce"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* V2 */}
                        <td className="py-3.5 px-5 text-amber-200/90 font-medium">
                          {verb.v2}
                        </td>

                        {/* V3 */}
                        <td className="py-3.5 px-5 text-emerald-300/90 font-medium">
                          {verb.v3}
                        </td>

                        {/* Translation */}
                        <td className="py-3.5 px-5 text-slate-300">
                          {verb.translation}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-5 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              verb.status === 'learned'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : verb.status === 'difficult'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-amber-400/10 text-amber-300 border-amber-400/20'
                            }`}
                          >
                            {verb.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => handleToggleFavorite(e, verb.id)}
                              className="p-1.5 text-slate-500 hover:text-amber-400 transition-colors"
                              title="Favorite"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  verb.isFavorite
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-500'
                                }`}
                              />
                            </button>
                            <span className="text-xs text-amber-400 hover:underline font-semibold">
                              Ko'rish &rarr;
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* DETAILED VERB CARD MODAL */}
      {selectedVerb && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedVerb(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-gradient-to-br from-[#0e1628] via-[#0d1322] to-[#121c33] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  Irregular Verb
                </span>
                <span className="text-xs text-slate-400">{selectedVerb.difficulty}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleToggleFavorite(e, selectedVerb.id)}
                  className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                >
                  <Star
                    className={`w-5 h-5 ${
                      selectedVerb.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={() => setSelectedVerb(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Verb Heading & Pronunciation */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                {selectedVerb.v1}
              </h2>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => speakWord(selectedVerb.v1)}
                  className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                  title="Pronounce"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span className="font-mono text-slate-400 text-sm">
                  {selectedVerb.pronunciation}
                </span>
              </div>

              <div className="text-lg font-bold text-amber-300 pt-1">
                🇺🇿 {selectedVerb.translation}
              </div>
            </div>

            {/* 3 Forms Display Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-white/5 text-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Base Form (V1)
                </span>
                <span className="text-base sm:text-lg font-black text-white">
                  {selectedVerb.v1}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 block mb-1">
                  Past Simple (V2)
                </span>
                <span className="text-base sm:text-lg font-black text-amber-300">
                  {selectedVerb.v2}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 block mb-1">
                  Past Part. (V3)
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-400">
                  {selectedVerb.v3}
                </span>
              </div>
            </div>

            {/* Example sentence */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  Misol (Example)
                </span>
                <button
                  onClick={() => speakWord(selectedVerb.example)}
                  className="text-slate-400 hover:text-amber-300"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-slate-200 font-medium italic">
                "{selectedVerb.example}"
              </p>
              {selectedVerb.exampleTranslation && (
                <p className="text-xs text-slate-400">
                  {selectedVerb.exampleTranslation}
                </p>
              )}
            </div>

            {/* Spaced Repetition Rating Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                Eslab qolish darajangizni belgilang
              </span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRateVerb(selectedVerb.id, 'again')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all text-center"
                >
                  Again
                  <span className="block text-[9px] text-rose-400 font-normal">1 kun</span>
                </button>
                <button
                  onClick={() => handleRateVerb(selectedVerb.id, 'hard')}
                  className="p-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold transition-all text-center"
                >
                  Hard
                  <span className="block text-[9px] text-orange-400 font-normal">2 kun</span>
                </button>
                <button
                  onClick={() => handleRateVerb(selectedVerb.id, 'good')}
                  className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all text-center"
                >
                  Good
                  <span className="block text-[9px] text-emerald-400 font-normal">4 kun</span>
                </button>
                <button
                  onClick={() => handleRateVerb(selectedVerb.id, 'easy')}
                  className="p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold transition-all text-center"
                >
                  Easy
                  <span className="block text-[9px] text-sky-400 font-normal">7 kun</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleToggleLearned(selectedVerb.id, selectedVerb.status)}
                className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
                  selectedVerb.status === 'learned'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-white/10'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{selectedVerb.status === 'learned' ? 'Yodlangan ✅' : 'Yodlangan deb belgilash'}</span>
              </button>

              <button
                onClick={() => startPractice('mixed', selectedVerb)}
                className="py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                Mashq qilish &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
