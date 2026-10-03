import React from 'react';
import { Sparkles, Flame, Target, Search } from 'lucide-react';
import { NavTab } from './Sidebar';
import { UserStats } from '../types/vocabulary';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  stats: UserStats;
  totalWords: number;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  stats,
  totalWords,
  onOpenSearch,
}) => {
  const goalPercent = Math.min(100, Math.round((stats.todayReviewedCount / stats.dailyGoal) * 100));

  return (
    <header className="sticky top-0 z-20 bg-[#080c14]/85 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Brand & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2" onClick={() => onSelectTab('home')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md text-sm cursor-pointer">
            V
          </div>
          <span className="text-base font-bold text-white tracking-tight cursor-pointer">
            Vocab<span className="text-amber-400">AI</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-sm">
          <span className="text-slate-400 font-medium">VocabAI</span>
          <span className="text-slate-600">/</span>
          <span className="text-amber-300 font-semibold">
            {currentTab === 'home' && 'Dashboard (Bosh sahifa)'}
            {currentTab === 'my-words' && 'Vocabulary (Lug\'at kutubxonasi)'}
            {currentTab === 'flashcards' && 'Flashcards (3D Kartochkalar)'}
            {currentTab === 'irregular-verbs' && 'Irregular Verbs (Noto\'g\'ri fe\'llar)'}
            {currentTab === 'speaking' && 'Speaking (Ovozli talaffuz)'}
            {currentTab === 'grammar' && 'Grammar (Grammatika darslari)'}
            {currentTab === 'practice' && 'Practice (Mashqlar & Testlar)'}
            {currentTab === 'progress' && 'Progress (Natijalar & Statistika)'}
            {currentTab === 'import' && 'Import Vocabulary (AI Photo Scanner)'}
          </span>
        </div>
      </div>

      {/* Right: Quick Search, Quick Stats & Primary Action */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Trigger */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-400/40 text-slate-400 hover:text-white transition-all text-xs"
            title="Qidiruv (Ctrl/Cmd + K)"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Qidirish...</span>
            <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5 font-mono">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Streak Pill */}
        <div
          onClick={() => onSelectTab('progress')}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 hover:border-orange-500/30 transition-colors cursor-pointer text-xs"
          title="Daily Streak"
        >
          <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
          <span className="font-bold text-white">{stats.streakDays}</span>
          <span className="hidden sm:inline text-slate-400">kun</span>
        </div>

        {/* Goal Progress Pill */}
        <div
          onClick={() => onSelectTab('progress')}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 hover:border-amber-400/30 transition-colors cursor-pointer text-xs"
          title="Today's Goal"
        >
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-300 font-medium">
            <strong className="text-white">{stats.todayReviewedCount}</strong>
            <span className="text-slate-500">/{stats.dailyGoal}</span>
          </span>
          <div className="w-10 hidden sm:block h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>

        {/* Primary CTA */}
        {currentTab !== 'import' && (
          <button
            onClick={() => onSelectTab('import')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-400/20"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
            <span className="hidden sm:inline">Import</span>
          </button>
        )}
      </div>
    </header>
  );
};
