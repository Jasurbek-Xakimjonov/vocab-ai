import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  Dumbbell,
  BookOpen,
  LineChart,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const items = [
    { id: 'home' as NavTab, label: 'Asosiy', icon: LayoutDashboard },
    { id: 'flashcards' as NavTab, label: 'Kartalar', icon: Layers },
    { id: 'import' as NavTab, label: 'AI Scan', icon: Sparkles, highlight: true },
    { id: 'practice' as NavTab, label: 'Mashq', icon: Dumbbell },
    { id: 'my-words' as NavTab, label: 'Lug\'at', icon: BookOpen },
    { id: 'progress' as NavTab, label: 'Natija', icon: LineChart },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        if (item.highlight) {
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className="flex flex-col items-center justify-center -mt-4 group relative"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20'
                    : 'bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold mt-1 text-amber-300">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
              isActive ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
