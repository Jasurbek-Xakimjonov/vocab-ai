import React from 'react';
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
  Award,
  Zap,
} from 'lucide-react';
import { VocabularyWord, UserStats } from '../types/vocabulary';
import { NavTab } from '../components/Sidebar';
import { Storage } from '../utils/storage';
import { speakWord } from '../utils/speech';

interface DashboardProps {
  words: VocabularyWord[];
  stats: UserStats;
  onNavigate: (tab: NavTab) => void;
  onSelectWordToReview?: (wordId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  words,
  stats,
  onNavigate,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Xayrli tong';
    if (hour < 18) return 'Xayrli kun';
    return 'Xayrli kech';
  };

  const learnedCount = words.filter((w) => w.status === 'learned').length;
  const learningCount = words.filter((w) => w.status === 'learning').length;
  const difficultCount = words.filter((w) => w.status === 'difficult').length;
  const favoritesCount = words.filter((w) => w.isFavorite).length;

  const goalPercent = Math.min(100, Math.round((stats.todayReviewedCount / stats.dailyGoal) * 100));

  const handleGoalChange = (newGoal: number) => {
    Storage.updateDailyGoal(newGoal);
  };

  // Recent words for quick study
  const recentWords = words.slice(0, 6);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0e1626] to-[#121c33] border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-20 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VocabAI • AI-Powered Vocabulary</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {getGreeting()} 👋
            </h1>

            <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
              Bugun yangi so'zlarni o'rganishga tayyormisiz? Lug'at ro'yxatingiz yoki darslik rasmini yuklang, AI bir zumda kartochkalar yaratadi.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('import')}
                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-400/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Rasm orqali so'z yuklash</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onNavigate('flashcards')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 text-white font-medium text-sm transition-all"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Kartochkalarni ko'rish</span>
              </button>
            </div>
          </div>

          {/* Quick Streak Card */}
          <div className="shrink-0 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 min-w-[240px] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                O'rganish tezligi
              </span>
              <div className="flex items-center gap-1 text-orange-400">
                <Flame className="w-4 h-4 fill-orange-400" />
                <span className="text-sm font-bold">{stats.streakDays} kun</span>
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Bugungi maqsad:</span>
                <span className="font-semibold text-white">
                  {stats.todayReviewedCount} / {stats.dailyGoal} so'z
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
                <span>Maqsadni tanlang:</span>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Jami so'zlar
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{words.length}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>Kutubxonadagi so'zlar</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              O'rganilgan
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {learnedCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {words.length > 0 ? Math.round((learnedCount / words.length) * 100) : 0}% o'zlashtirildi
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              O'rganilmoqda
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
            {learningCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">Takrorlash kutilmoqda</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Qiyin so'zlar
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">
            {difficultCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">Qayta mashq qiling</div>
        </div>
      </div>

      {/* Main Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Vocabulary & Quick Practice */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Oxirgi kartochkalar</span>
            </h2>
            <button
              onClick={() => onNavigate('my-words')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>Barchasini ko'rish ({words.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {recentWords.map((item) => (
              <div
                key={item.id}
                className="group p-4 rounded-2xl bg-[#0d1322] border border-white/5 hover:border-amber-400/30 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                        {item.word}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWord(item.word);
                        }}
                        className="text-slate-500 hover:text-amber-300 p-1 rounded-md transition-colors"
                        title="Pronunciation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                        item.status === 'learned'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : item.status === 'difficult'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-400/10 text-amber-300 border-amber-400/20'
                      }`}
                    >
                      {item.partOfSpeech || 'word'}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-amber-400/90 mb-1">
                    {item.translation}
                  </p>

                  {item.definition && (
                    <p className="text-xs text-slate-400 line-clamp-1 italic">
                      "{item.definition}"
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Takrorlangan: {item.reviewCount || 0} marta</span>
                  {item.pronunciation && (
                    <span className="font-mono text-slate-400">{item.pronunciation}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Practice Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#101a2e] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Dumbbell className="w-4 h-4 text-amber-400" />
                <span>Interaktiv mashq qilish</span>
              </div>
              <p className="text-xs text-slate-400">
                Multiple Choice, Uzbek → English, Type the answer, Listening va True/False testlari
              </p>
            </div>
            <button
              onClick={() => onNavigate('practice')}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shrink-0 shadow-lg shadow-amber-400/10 active:scale-95"
            >
              Mashqni boshlash
            </button>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & How It Works */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0d1322] border border-white/5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Qanday ishlaydi?</span>
            </h3>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-400/10 text-amber-400 font-bold flex items-center justify-center shrink-0 border border-amber-400/20">
                  1
                </div>
                <div>
                  <strong className="text-white block font-medium">Rasm yuklang:</strong>
                  Darslik sahifasi, lug'at ro'yxati, screenshot yoki daftaringiz rasmi.
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-400/10 text-amber-400 font-bold flex items-center justify-center shrink-0 border border-amber-400/20">
                  2
                </div>
                <div>
                  <strong className="text-white block font-medium">Gemini tahlil qiladi:</strong>
                  So'zlarni ajratadi, o'zbekcha tarjima, ta'rif, misol va talaffuzini qo'shadi.
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-400/10 text-amber-400 font-bold flex items-center justify-center shrink-0 border border-amber-400/20">
                  3
                </div>
                <div>
                  <strong className="text-white block font-medium">Flashcard yarating:</strong>
                  3D kartochkalar, 🔊 audio va spaced repetition tizimida mustahkamlang.
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('import')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hozir sinab ko'ring</span>
            </button>
          </div>

          {/* Spaced Repetition Info Box */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Spaced Repetition (Interval Takrorlash)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Kartochkani o'rganayotganda <strong>Again, Hard, Good, Easy</strong> tugmalarini bosing. Tizim qiyin so'zlarni tez-tez, o'zlashtirilganlarini esa kamroq takrorlashga taqsimlaydi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
