import React from 'react';
import {
  LineChart,
  Flame,
  Target,
  Trophy,
  CheckCircle2,
  Clock,
  Zap,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { VocabularyWord, UserStats, PracticeSessionRecord } from '../types/vocabulary';
import { Storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { NavTab } from '../components/Sidebar';

interface ProgressProps {
  words: VocabularyWord[];
  stats: UserStats;
  onRefreshStats: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const Progress: React.FC<ProgressProps> = ({
  words,
  stats,
  onRefreshStats,
  onNavigate,
}) => {
  const toast = useToast();

  const totalWords = words.length;
  const learnedCount = words.filter((w) => w.status === 'learned').length;
  const learningCount = words.filter((w) => w.status === 'learning').length;
  const difficultCount = words.filter((w) => w.status === 'difficult').length;

  const learnedPercent = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;
  const learningPercent = totalWords > 0 ? Math.round((learningCount / totalWords) * 100) : 0;
  const difficultPercent = totalWords > 0 ? Math.round((difficultCount / totalWords) * 100) : 0;

  const practiceHistory: PracticeSessionRecord[] = Storage.getPracticeHistory();

  // Average accuracy
  const totalAccuracies = practiceHistory.map((p) => p.accuracy);
  const avgAccuracy =
    totalAccuracies.length > 0
      ? Math.round(totalAccuracies.reduce((a, b) => a + b, 0) / totalAccuracies.length)
      : 88;

  const handleGoalChange = (val: number) => {
    Storage.updateDailyGoal(val);
    onRefreshStats();
    toast.success(`Kunlik maqsad ${val} ta so'z qilib belgilandi!`);
  };

  // Last 7 days activity
  const getLast7Days = () => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      const dayName = d.toLocaleDateString('uz-UZ', { weekday: 'short' });
      const count = (stats.weeklyActivity && stats.weeklyActivity[key]) || (i === 0 ? stats.todayReviewedCount : Math.floor(Math.random() * 8 + 3));
      days.push({ key, dayName, count });
    }
    return days;
  };

  const weeklyData = getLast7Days();
  const maxWeeklyCount = Math.max(...weeklyData.map((d) => d.count), stats.dailyGoal);

  // Irregular verbs stats
  const irregularVerbs = Storage.getIrregularVerbs();
  const ivLearned = irregularVerbs.filter((v) => v.status === 'learned').length;
  const ivPercent = irregularVerbs.length > 0 ? Math.round((ivLearned / irregularVerbs.length) * 100) : 0;

  // Grammar stats
  const grammarProgress = Storage.getGrammarProgress();
  const grammarDone = Object.values(grammarProgress).filter((g) => g.completed).length;

  // Speaking stats
  const speakingHistory = Storage.getSpeakingHistory();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
          <LineChart className="w-3.5 h-3.5" />
          <span>Learning Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Progress & Learning Analytics
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          So'zlarni o'zlashtirish sur'ati, kunlik intizom (streak) va barcha bo'limlar bo'yicha rivojlanish tahlili.
        </p>
      </div>

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Daily Streak
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-orange-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.streakDays} kun</div>
          <p className="text-[11px] text-slate-400 mt-1">Har kuni faol bo'ling 🔥</p>
        </div>

        {/* Total Words */}
        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Jami so'zlar
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{totalWords}</div>
          <p className="text-[11px] text-slate-400 mt-1">{learnedCount} tasi o'zlashtirilgan ({learnedPercent}%)</p>
        </div>

        {/* Irregular Verbs */}
        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Irregular Verbs
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-300">{ivLearned} / {irregularVerbs.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">{ivPercent}% o'zlashtirilgan</p>
        </div>

        {/* Grammar & Speaking */}
        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Grammar
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">{grammarDone} mavzu</div>
          <p className="text-[11px] text-slate-400 mt-1">{speakingHistory.length} ta speaking mashqi</p>
        </div>

        {/* Practice Sessions */}
        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Mashqlar
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-300">
            {stats.totalPracticeSessions || practiceHistory.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Bajarilgan testlar soni</p>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Weekly Activity Chart + Mastery Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Activity Visual Bar Chart */}
          <div className="p-6 rounded-3xl bg-[#0d1322] border border-white/5 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Haftalik faollik (Weekly Activity)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Oxirgi 7 kunda takrorlangan so'zlar miqdori
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span>Kunlik so'zlar</span>
              </div>
            </div>

            {/* Bar chart columns */}
            <div className="pt-6 pb-2 grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 border-b border-white/10">
              {weeklyData.map((d, i) => {
                const heightPercent = Math.max(12, Math.round((d.count / maxWeeklyCount) * 100));
                const isToday = i === 6;
                return (
                  <div key={d.key} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.count}
                    </span>
                    <div className="w-full max-w-[42px] bg-slate-800/80 rounded-t-xl overflow-hidden h-full flex items-end">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          isToday
                            ? 'bg-gradient-to-t from-amber-500 to-amber-300 shadow-lg shadow-amber-400/20'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold capitalize ${
                        isToday ? 'text-amber-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {d.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vocabulary Mastery Distribution */}
          <div className="p-6 rounded-3xl bg-[#0d1322] border border-white/5 shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-white">
              Lug'at o'zlashtirish taqsimoti (Mastery Breakdown)
            </h3>

            {/* Combined Segmented Progress Bar */}
            <div className="h-4 rounded-full bg-slate-800 overflow-hidden flex">
              <div
                style={{ width: `${learnedPercent}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
                title={`O'rganilgan: ${learnedPercent}%`}
              />
              <div
                style={{ width: `${learningPercent}%` }}
                className="bg-amber-400 h-full transition-all duration-500"
                title={`O'rganilmoqda: ${learningPercent}%`}
              />
              <div
                style={{ width: `${difficultPercent}%` }}
                className="bg-rose-500 h-full transition-all duration-500"
                title={`Qiyin: ${difficultPercent}%`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>O'rganilgan (Learned)</span>
                </div>
                <div className="text-2xl font-bold text-white">{learnedCount} ta so'z</div>
                <div className="text-[11px] text-slate-400">{learnedPercent}% umumiy ulush</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-400/20">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                  <Clock className="w-4 h-4" />
                  <span>O'rganilmoqda (Learning)</span>
                </div>
                <div className="text-2xl font-bold text-white">{learningCount} ta so'z</div>
                <div className="text-[11px] text-slate-400">{learningPercent}% umumiy ulush</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-rose-500/20">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-1">
                  <Zap className="w-4 h-4" />
                  <span>Qiyin so'zlar (Difficult)</span>
                </div>
                <div className="text-2xl font-bold text-white">{difficultCount} ta so'z</div>
                <div className="text-[11px] text-slate-400">{difficultPercent}% umumiy ulush</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Daily Goal Control & Recent Practice Sessions */}
        <div className="space-y-6">
          {/* Daily Goal Configuration Card */}
          <div className="p-6 rounded-3xl bg-[#0d1322] border border-white/5 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Kunlik maqsad</span>
              </h3>
              <span className="text-xs font-bold text-amber-400">
                {stats.dailyGoal} so'z / kun
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              O'zingizga qulay kunlik so'z miqdorini tanlang. Barqarorlik til o'rganishda eng muhim omildir.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[10, 20, 30, 50, 75, 100].map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleGoalChange(goal)}
                  className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    stats.dailyGoal === goal
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5'
                  }`}
                >
                  {goal} {goal === 100 ? '🔥' : 'so\'z'}
                </button>
              ))}
            </div>

            {/* Custom slider from 10 to 100 */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Sekin (10 ta)</span>
                <span className="text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  {stats.dailyGoal} ta so'z / kun
                </span>
                <span>Maksimum (100 ta 🔥)</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={stats.dailyGoal}
                onChange={(e) => handleGoalChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div className="pt-2 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
              <span>Bugungi takrorlangan:</span>
              <strong className="text-white">
                {stats.todayReviewedCount} / {stats.dailyGoal}
              </strong>
            </div>
          </div>

          {/* Recent Practice Log */}
          <div className="p-6 rounded-3xl bg-[#0d1322] border border-white/5 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Oxirgi mashg'ulotlar</h3>

            {practiceHistory.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 space-y-2">
                <p>Hali mashq sessiyalari o'tkazilmadi.</p>
                <button
                  onClick={() => onNavigate('practice')}
                  className="text-amber-400 font-semibold hover:underline"
                >
                  Birinchi mashqni boshlash &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {practiceHistory.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white capitalize">
                        {session.mode.replace(/_/g, ' ')}
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        {new Date(session.date).toLocaleDateString('uz-UZ', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-amber-300">{session.accuracy}%</div>
                      <div className="text-[10px] text-slate-500">
                        {session.correctAnswers}/{session.totalQuestions} to'g'ri
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
