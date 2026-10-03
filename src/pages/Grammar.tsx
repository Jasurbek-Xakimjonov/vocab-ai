import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Volume2,
  HelpCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import { GrammarTopic, GrammarProgressRecord } from '../types/grammar';
import { GRAMMAR_TOPICS } from '../data/grammarData';
import { Storage } from '../utils/storage';
import { speakWord } from '../utils/speech';
import { useToast } from '../components/Toast';

interface GrammarProps {
  selectedTopicFromSearch?: GrammarTopic | null;
}

export const Grammar: React.FC<GrammarProps> = ({ selectedTopicFromSearch }) => {
  const toast = useToast();

  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [grammarProgress, setGrammarProgress] = useState<Record<string, GrammarProgressRecord>>(
    () => Storage.getGrammarProgress()
  );

  // Mini-quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: string }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  useEffect(() => {
    const handleUpdate = () => setGrammarProgress(Storage.getGrammarProgress());
    window.addEventListener('vocabai_grammar_updated', handleUpdate);
    return () => window.removeEventListener('vocabai_grammar_updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (selectedTopicFromSearch) {
      setSelectedTopic(selectedTopicFromSearch);
      setQuizAnswers({});
      setSubmittedQuiz(false);
    }
  }, [selectedTopicFromSearch]);

  const categories = ['All', 'Tenses', 'Modals', 'Nouns & Articles', 'Adjectives', 'Structures'];

  const filteredTopics = GRAMMAR_TOPICS.filter((t) => {
    if (activeCategory === 'All') return true;
    return t.category === activeCategory;
  });

  const completedCount = Object.values(grammarProgress).filter((p) => p.completed).length;
  const progressPercent = Math.round((completedCount / GRAMMAR_TOPICS.length) * 100);

  const handleSelectTopic = (topic: GrammarTopic) => {
    setSelectedTopic(topic);
    setQuizAnswers({});
    setSubmittedQuiz(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerChange = (qId: string, answer: string) => {
    if (submittedQuiz) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic) return;

    let score = 0;
    selectedTopic.quiz.forEach((q) => {
      if (quizAnswers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        score++;
      }
    });

    setQuizScore(score);
    setSubmittedQuiz(true);

    Storage.markGrammarCompleted(selectedTopic.id, score, selectedTopic.quiz.length);
    toast.success(`Test yakunlandi! Natija: ${score} / ${selectedTopic.quiz.length}`);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setSubmittedQuiz(false);
    setQuizScore(0);
  };

  return (
    <div className="space-y-7 max-w-6xl mx-auto">
      {/* Header */}
      {!selectedTopic && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Structured English Grammar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ingliz tili grammatikasi
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Oddiy, tushunarli qoidalar, o'zbekcha sharhlar, real misollar va har bir mavzu bo'yicha amaliy mini-testlar.
            </p>
          </div>

          {/* Progress Card */}
          <div className="shrink-0 p-4 rounded-2xl bg-slate-900 border border-white/5 min-w-[200px]">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Mavzular:</span>
              <strong className="text-white">{completedCount} / {GRAMMAR_TOPICS.length}</strong>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-emerald-400 font-bold text-right">
              {progressPercent}% o'rganildi
            </div>
          </div>
        </div>
      )}

      {/* TOPIC DETAIL VIEW */}
      {selectedTopic ? (
        <div className="space-y-7 animate-in fade-in duration-200">
          {/* Back button */}
          <button
            onClick={() => setSelectedTopic(null)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Grammatika mavzulariga qaytish</span>
          </button>

          {/* Topic Title & Formula Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#0e1628] to-[#121c33] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold">
                {selectedTopic.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                {selectedTopic.level}
              </span>
              {grammarProgress[selectedTopic.id]?.completed && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>O'zlashtirildi</span>
                </span>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {selectedTopic.title}
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              {selectedTopic.summaryUz}
            </p>

            {/* Formula Code Block */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 font-mono text-xs sm:text-sm text-amber-300">
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-1">
                Qoida formulasi:
              </span>
              {selectedTopic.formula}
            </div>
          </div>

          {/* Rules and Explanations */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Qoidalar va misollar</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTopic.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0d1322] border border-white/5 space-y-3 shadow-lg"
                >
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-400/10 text-amber-300 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span>{rule.title}</span>
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rule.explanationUz}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    {rule.examples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="font-semibold text-white">"{ex.en}"</p>
                          <p className="text-slate-400">🇺🇿 {ex.uz}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakWord(ex.en)}
                          className="p-1 text-slate-500 hover:text-amber-300 shrink-0"
                          title="Tinglash"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          {selectedTopic.commonMistakes.length > 0 && (
            <div className="p-6 rounded-3xl bg-[#14121d] border border-rose-500/20 space-y-4">
              <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Keng tarqalgan xatolar (Common Mistakes)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedTopic.commonMistakes.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-rose-400 font-semibold line-through">
                      <X className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.mistake}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.correction}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] pt-1">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Mini-Test */}
          <div className="rounded-3xl bg-[#0d1322] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Amaliy mini-test ({selectedTopic.quiz.length} ta savol)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Mavzuni qanchalik tushunganingizni sinab ko'ring.
                </p>
              </div>

              {submittedQuiz && (
                <button
                  onClick={handleResetQuiz}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Qaytadan</span>
                </button>
              )}
            </div>

            <form onSubmit={handleQuizSubmit} className="space-y-6">
              {selectedTopic.quiz.map((q, idx) => {
                const userAnswer = quizAnswers[q.id];
                const isItemCorrect = userAnswer?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      submittedQuiz
                        ? isItemCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-rose-500/10 border-rose-500/30'
                        : 'bg-slate-900 border-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-sm sm:text-base font-bold text-white">
                        {q.prompt}
                      </p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userAnswer === opt;
                        const isRightOpt = opt.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();

                        let optClass = 'bg-slate-800/80 border-white/5 text-slate-200 hover:bg-slate-700';
                        if (submittedQuiz) {
                          if (isRightOpt) {
                            optClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                          } else if (isChosen) {
                            optClass = 'bg-rose-500/20 border-rose-500 text-rose-200';
                          } else {
                            optClass = 'bg-slate-900/40 border-white/5 text-slate-600';
                          }
                        } else if (isChosen) {
                          optClass = 'bg-amber-400 text-slate-950 font-bold border-amber-400';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={submittedQuiz}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all ${optClass}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submit */}
                    {submittedQuiz && (
                      <div className="mt-3 ml-9 p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300">
                        <strong>Sharh:</strong> {q.explanationUz}
                      </div>
                    )}
                  </div>
                );
              })}

              {!submittedQuiz ? (
                <button
                  type="submit"
                  disabled={Object.keys(quizAnswers).length < selectedTopic.quiz.length}
                  className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all disabled:opacity-50 shadow-xl shadow-amber-400/20"
                >
                  Testni tekshirish
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                  <div className="text-lg font-black text-emerald-300">
                    Natija: {quizScore} / {selectedTopic.quiz.length} ball!
                  </div>
                  <p className="text-xs text-slate-300">
                    Ushbu mavzu bo'yicha natijangiz muvaffaqiyatli saqlandi.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      ) : (
        // TOPICS LIST VIEW
        <>
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic) => {
              const record = grammarProgress[topic.id];
              const isCompleted = record?.completed;

              return (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className="group p-6 rounded-3xl bg-[#0d1322] border border-white/5 hover:border-amber-400/40 cursor-pointer transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
                        {topic.category}
                      </span>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tugallangan</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {topic.level}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                      {topic.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                      {topic.summaryUz}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-amber-400 font-semibold">
                    <span>Darsni boshlash</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
