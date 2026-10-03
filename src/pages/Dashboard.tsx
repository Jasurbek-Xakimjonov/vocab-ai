import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Target,
  ArrowRight,
  Layers,
  Dumbbell,
  BookOpen,
  CheckCircle2,
  Clock,
  Volume2,
  Zap,
  Mic,
  GraduationCap,
  Play,
  RotateCcw,
} from 'lucide-react';
import { VocabularyWord, UserStats } from '../types/vocabulary';
import { IrregularVerb } from '../types/irregularVerbs';
import { NavTab } from '../components/Sidebar';
import { Storage } from '../utils/storage';
import { speakWord } from '../utils/speech';
import { GRAMMAR_TOPICS } from '../data/grammarData';

interface DashboardProps {
  words: VocabularyWord[];
  stats: UserStats;
  onNavigate: (tab: NavTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  words,
  stats,
  onNavigate,
}) => {
  const [irregularVerbs, setIrregularVerbs] = useState<IrregularVerb[]>(() =>
    Storage.getIrregularVerbs()
  );
  const [grammarProgress, setGrammarProgress] = useState(() =>
    Storage.getGrammarProgress()
  );
  const [speakingHistory, setSpeakingHistory] = useState(() =>
    Storage.getSpeakingHistory()
  );

  useEffect(() => {
    const handleVerbs = () => setIrregularVerbs(Storage.getIrregularVerbs());
    const handleGrammar = () => setGrammarProgress(Storage.getGrammarProgress());
    const handleSpeaking = () => setSpeakingHistory(Storage.getSpeakingHistory());

    window.addEventListener('vocabai_irregular_verbs_updated', handleVerbs);
    window.addEventListener('vocabai_grammar_updated', handleGrammar);
    window.addEventListener('vocabai_speaking_updated', handleSpeaking);

    return () => {
      window.removeEventListener('vocabai_irregular_verbs_updated', handleVerbs);
      window.removeEventListener('vocabai_grammar_updated', handleGrammar);
      window.removeEventListener('vocabai_speaking_updated', handleSpeaking);
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Xayrli tong';
    if (hour < 18) return 'Xayrli kun';
    return 'Xayrli kech';
  };

  // Vocabulary stats
  const vocabLearnedCount = words.filter((w) => w.status === 'learned').length;
  const vocabPercent = words.length > 0 ? Math.round((vocabLearnedCount / words.length) * 100) : 0;

  // Irregular Verbs stats
  const verbsLearnedCount = irregularVerbs.filter((v) => v.status === 'learned').length;
  const verbsPercent = irregularVerbs.length > 0 ? Math.round((verbsLearnedCount / irregularVerbs.length) * 100) : 0;

  // Grammar stats
  const grammarCompletedCount = Object.values(grammarProgress).filter((g) => g.completed).length;
  const grammarPercent = Math.round((grammarCompletedCount / GRAMMAR_TOPICS.length) * 100);

  // Speaking stats
  const speakingCount = speakingHistory.length;
  const avgSpeakingScore =
    speakingCount > 0
      ? Math.round(speakingHistory.reduce((acc, curr) => acc + curr.score, 0) / speakingCount)
      : 0;
  const speakingPercent = Math.min(100, Math.max(avgSpeakingScore, Math.min(100, speakingCount * 10)));

  const goalPercent = Math.min(100, Math.round((stats.todayReviewedCount / stats.dailyGoal) * 100));

  const handleGoalChange = (newGoal: number) => {
    Storage.updateDailyGoal(newGoal);
  };

  // Recent practice history
  const practiceHistory = Storage.getPracticeHistory().slice(0, 4);
  const recentWords = words.slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0e1626] to-[#121c33] border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-20 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VocabAI • Complete English Learning Platform</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {getGreeting()} 👋
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              Bugun qaysi bo'limdan boshlaymiz? So'z boyligini oshirish, noto'g'ri fe'llarni yodlash, ovozli talaffuz yoki grammatika qoidalarini mustahkamlash.
            </p>

            {/* Core Achievement Highlights requested in brief */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold">
                <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
                <span>{stats.streakDays} day streak</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
                <span>⭐</span>
                <span>{vocabLearnedCount} words learned</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <span>📚</span>
                <span>{verbsLearnedCount} irregular verbs learned</span>
              </div>
            </div>
          </div>

          {/* Quick Daily Goal & Streak Card */}
          <div className="shrink-0 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 min-w-[260px] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Kundalik maqsad
              </span>
              <div className="flex items-center gap-1 text-orange-400">
                <Flame className="w-4 h-4 fill-orange-400" />
                <span className="text-xs font-bold">{stats.streakDays} kun ketma-ket</span>
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Bugun takrorlangan:</span>
                <span className="font-semibold text-white">
                  {stats.todayReviewedCount} / {stats.dailyGoal} ta
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>

              {/* Goal Selector */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Maqsadni o'zgartirish:</span>
                <div className="flex gap-1">
                  {[10, 20, 30].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => handleGoalChange(goal)}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                        stats.dailyGoal === goal
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 CORE LEARNING PROGRESS METRICS (As requested in brief) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vocabulary Progress */}
        <div
          onClick={() => onNavigate('my-words')}
          className="p-5 rounded-3xl bg-[#0d1322] border border-white/5 hover:border-sky-500/40 cursor-pointer transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Vocabulary
              </span>
              <BookOpen className="w-5 h-5 text-sky-400/80" />
            </div>
            <div className="text-3xl font-black text-white mb-1">{vocabPercent}%</div>
            <p className="text-xs text-slate-400">
              {vocabLearnedCount} / {words.length} ta so'z o'rganildi
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-sky-400 font-semibold">
            <span>Lug'atga o'tish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Irregular Verbs Progress */}
        <div
          onClick={() => onNavigate('irregular-verbs')}
          className="p-5 rounded-3xl bg-[#0d1322] border border-white/5 hover:border-amber-400/40 cursor-pointer transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Irregular Verbs
              </span>
              <Zap className="w-5 h-5 text-amber-400/80" />
            </div>
            <div className="text-3xl font-black text-white mb-1">{verbsPercent}%</div>
            <p className="text-xs text-slate-400">
              {verbsLearnedCount} / {irregularVerbs.length} ta fe'l o'zlashtirildi
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Fe'llarni mashq qilish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Speaking Progress */}
        <div
          onClick={() => onNavigate('speaking')}
          className="p-5 rounded-3xl bg-[#0d1322] border border-white/5 hover:border-emerald-500/40 cursor-pointer transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Speaking
              </span>
              <Mic className="w-5 h-5 text-emerald-400/80" />
            </div>
            <div className="text-3xl font-black text-white mb-1">{speakingPercent}%</div>
            <p className="text-xs text-slate-400">
              {speakingCount} ta jumla mashq qilindi
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Mikrofon orqali gapirish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Grammar Progress */}
        <div
          onClick={() => onNavigate('grammar')}
          className="p-5 rounded-3xl bg-[#0d1322] border border-white/5 hover:border-purple-400/40 cursor-pointer transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Grammar
              </span>
              <GraduationCap className="w-5 h-5 text-purple-400/80" />
            </div>
            <div className="text-3xl font-black text-white mb-1">{grammarPercent}%</div>
            <p className="text-xs text-slate-400">
              {grammarCompletedCount} / {GRAMMAR_TOPICS.length} ta mavzu yakunlandi
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-purple-400 font-semibold">
            <span>Grammatika darslari</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* QUICK LEARNING MODULES GRID */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Ta'lim bo'limlari (Learning Modules)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Flashcards */}
          <div
            onClick={() => onNavigate('flashcards')}
            className="group p-6 rounded-3xl bg-[#0d1322] border border-white/5 hover:border-amber-400/40 cursor-pointer transition-all hover:-translate-y-1 shadow-xl space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-300 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              3D Flashcard Kartochkalar
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spaced repetition (Again, Hard, Good, Easy) tizimi orqali so'zlarni xotirada mustahkamlang.
            </p>
          </div>

          {/* Card 2: Irregular Verbs */}
          <div
            onClick={() => onNavigate('irregular-verbs')}
            className="group p-6 rounded-3xl bg-[#0d1322] border border-white/5 hover:border-amber-400/40 cursor-pointer transition-all hover:-translate-y-1 shadow-xl space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-300 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Irregular Verbs (3 Forms)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              60+ muhim fe'llarning Base, Past Simple va Past Participle shakllari va 5 xil viktorina rejimi.
            </p>
          </div>

          {/* Card 3: Speaking */}
          <div
            onClick={() => onNavigate('speaking')}
            className="group p-6 rounded-3xl bg-[#0d1322] border border-white/5 hover:border-emerald-500/40 cursor-pointer transition-all hover:-translate-y-1 shadow-xl space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Speaking & Ovozli Mashq
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jumlalarni mikrofonga inglizcha talaffuz qiling va AI so'zma-so'z aniqlik foizini baholasin.
            </p>
          </div>

          {/* Card 4: Grammar */}
          <div
            onClick={() => onNavigate('grammar')}
            className="group p-6 rounded-3xl bg-[#0d1322] border border-white/5 hover:border-purple-400/40 cursor-pointer transition-all hover:-translate-y-1 shadow-xl space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              Grammatika darslari
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Present Simple dan Superlatives gacha bo'lgan 14 ta asosiy mavzu va har biri uchun mini-testlar.
            </p>
          </div>

          {/* Card 5: Practice Quizzes */}
          <div
            onClick={() => onNavigate('practice')}
            className="group p-6 rounded-3xl bg-[#0d1322] border border-white/5 hover:border-amber-400/40 cursor-pointer transition-all hover:-translate-y-1 shadow-xl space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-300 flex items-center justify-center font-bold">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Vocabulary Quiz & Spelling
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Klassik test, o'zbekcha-inglizcha, to'g'ri yozish (spelling), True/False va Listening rejimlari.
            </p>
          </div>

          {/* Card 6: AI Photo Scanner Import */}
          <div
            onClick={() => onNavigate('import')}
            className="group p-6 rounded-3xl bg-gradient-to-br from-[#0d1322] to-[#121c33] border border-amber-400/20 hover:border-amber-400/50 cursor-pointer transition-all hover:-translate-y-1 shadow-xl space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-amber-300">
              AI Photo Scanner Import
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Darslik yoki lug'at sahifasini rasmga olib yuklang, Gemini AI darhol kartochkalar yaratadi.
            </p>
          </div>
        </div>
      </div>

      {/* RECENT VOCABULARY & RECENT PRACTICE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Words */}
        <div className="rounded-3xl bg-[#0d1322] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Kutubxonadagi so'nggi so'zlar</span>
            </h3>
            <button
              onClick={() => onNavigate('my-words')}
              className="text-xs font-semibold text-amber-400 hover:underline"
            >
              Barchasi ({words.length}) &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {recentWords.map((word) => (
              <div
                key={word.id}
                className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => speakWord(word.word)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-300"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <span className="font-bold text-white text-sm block">{word.word}</span>
                    <span className="text-xs text-slate-400">{word.translation}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    word.status === 'learned'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-400/10 text-amber-300 border-amber-400/20'
                  }`}
                >
                  {word.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Practice History */}
        <div className="rounded-3xl bg-[#0d1322] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-amber-400" />
              <span>Oxirgi mashq natijalari</span>
            </h3>
            <button
              onClick={() => onNavigate('practice')}
              className="text-xs font-semibold text-amber-400 hover:underline"
            >
              Mashq qilish &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {practiceHistory.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                Hozircha mashq tarixi mavjud emas. Boshlash uchun "Mashq qilish" tugmasini bosing!
              </div>
            ) : (
              practiceHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white text-xs block capitalize">
                      {item.mode.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-amber-300 block">
                      {item.accuracy}%
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.correctAnswers} / {item.totalQuestions} to'g'ri
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
