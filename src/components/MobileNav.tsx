import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Dumbbell,
  BookOpen,
  LineChart,
  Zap,
  Mic,
  GraduationCap,
  Film,
  Bot,
  MessageSquare,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const items = [
    { id: 'home' as NavTab, label: 'Asosiy', icon: LayoutDashboard },
    { id: 'ai-speaking' as NavTab, label: 'Speaking', icon: Mic },
    { id: 'ai-chat' as NavTab, label: 'AI Chat', icon: MessageSquare },
    { id: 'my-words' as NavTab, label: "Lug'at", icon: BookOpen },
    { id: 'speaking-videos' as NavTab, label: 'Videolar', icon: Film },
    { id: 'flashcards' as NavTab, label: 'Kartalar', icon: Layers },
    { id: 'irregular-verbs' as NavTab, label: "Fe'llar", icon: Zap },
    { id: 'grammar' as NavTab, label: 'Grammar', icon: GraduationCap },
    { id: 'practice' as NavTab, label: 'Mashq', icon: Dumbbell },
    { id: 'progress' as NavTab, label: 'Natija', icon: LineChart },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-white/10 px-1 py-1 flex items-center overflow-x-auto no-scrollbar justify-between">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all shrink-0 min-w-[54px] ${
              isActive
                ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] whitespace-nowrap">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

