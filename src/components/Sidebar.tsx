import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  Dumbbell,
  BookOpen,
  LineChart,
  Flame,
  Zap,
  Mic,
  GraduationCap,
  Film,
} from 'lucide-react';
import { UserStats } from '../types/vocabulary';

export type NavTab =
  | 'home'
  | 'my-words'
  | 'flashcards'
  | 'irregular-verbs'
  | 'speaking'
  | 'speaking-videos'
  | 'grammar'
  | 'practice'
  | 'progress'
  | 'import';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  stats: UserStats;
  totalWordsCount: number;
}

interface NavItem {
  id: NavTab;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  stats,
  totalWordsCount,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'home' as NavTab,
      label: 'Dashboard',
      sublabel: 'Bosh sahifa',
      icon: LayoutDashboard,
    },
    {
      id: 'my-words' as NavTab,
      label: 'Vocabulary',
      sublabel: `${totalWordsCount} ta so'z`,
      icon: BookOpen,
    },
    {
      id: 'flashcards' as NavTab,
      label: 'Flashcards',
      sublabel: '3D Kartochkalar',
      icon: Layers,
    },
    {
      id: 'irregular-verbs' as NavTab,
      label: 'Irregular Verbs',
      sublabel: '3 xil shakli (V1-V2-V3)',
      icon: Zap,
    },
    {
      id: 'speaking' as NavTab,
      label: 'Speaking',
      sublabel: 'Ovozli talaffuz',
      icon: Mic,
    },
    {
      id: 'speaking-videos' as NavTab,
      label: 'Speaking Videos',
      sublabel: '🎬 Video & Nutq',
      icon: Film,
      highlight: true,
    },
    {
      id: 'grammar' as NavTab,
      label: 'Grammar',
      sublabel: 'Qoidalar va testlar',
      icon: GraduationCap,
    },
    {
      id: 'practice' as NavTab,
      label: 'Practice',
      sublabel: 'Mashq va viktorina',
      icon: Dumbbell,
    },
    {
      id: 'progress' as NavTab,
      label: 'Progress',
      sublabel: 'Natijalar & statistika',
      icon: LineChart,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[#090d16] border-r border-white/5 h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand logo & tagline */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-400/20 text-lg">
            V
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">Vocab</span>
              <span className="text-xl font-extrabold text-amber-400">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight line-clamp-1">
              Turn your vocabulary into knowledge
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Asosiy bo'limlar
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full group flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all duration-200 relative ${
                isActive
                  ? 'bg-amber-400/10 text-amber-300 font-medium border border-amber-400/25 shadow-sm'
                  : item.highlight
                  ? 'text-white hover:bg-slate-800/60 border border-white/5 bg-gradient-to-r from-amber-400/5 to-transparent'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-300'
                    : item.highlight
                    ? 'bg-amber-400/10 text-amber-400 group-hover:scale-105 transition-transform'
                    : 'bg-slate-800/60 text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold flex items-center justify-between">
                  <span className="truncate">{item.label}</span>
                  {item.highlight && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      AI
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-normal truncate">
                  {item.sublabel}
                </div>
              </div>

              {isActive && (
                <div className="absolute right-2.5 w-1.5 h-6 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Streak & Today's Goal Quick Widget */}
      <div className="p-4 border-t border-white/5 bg-slate-950/40">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="w-4 h-4 fill-orange-400" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-400">Daily Streak</div>
              <div className="text-sm font-bold text-white">{stats.streakDays} kun ketma-ket</div>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20">
            Faol
          </span>
        </div>

        <button
          onClick={() => onSelectTab('import')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-semibold text-xs tracking-wide shadow-md shadow-amber-400/15 hover:brightness-110 active:scale-98 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rasm orqali qo'shish</span>
        </button>
      </div>
    </aside>
  );
};
