import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Star,
  Volume2,
  Edit2,
  Trash2,
  Filter,
  Download,
  Upload,
  BookOpen,
  Sparkles,
  Layers,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { VocabularyWord, WordFilter } from '../types/vocabulary';
import { speakWord } from '../utils/speech';
import { Storage } from '../utils/storage';
import { WordModal } from '../components/WordModal';
import { useToast } from '../components/Toast';
import { NavTab } from '../components/Sidebar';

interface MyWordsProps {
  words: VocabularyWord[];
  onRefreshWords: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const MyWords: React.FC<MyWordsProps> = ({
  words,
  onRefreshWords,
  onNavigate,
}) => {
  const toast = useToast();

  const [activeFilter, setActiveFilter] = useState<WordFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'alphabetical' | 'reviews'>('newest');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabularyWord | null>(null);

  // Filter & Search
  const filteredWords = useMemo(() => {
    let result = [...words];

    // Filter by tab
    if (activeFilter === 'learning') {
      result = result.filter((w) => w.status === 'learning');
    } else if (activeFilter === 'learned') {
      result = result.filter((w) => w.status === 'learned');
    } else if (activeFilter === 'difficult') {
      result = result.filter((w) => w.status === 'difficult');
    } else if (activeFilter === 'favorites') {
      result = result.filter((w) => w.isFavorite);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.translation.toLowerCase().includes(q) ||
          w.definition.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.word.localeCompare(b.word));
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else {
      // newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [words, activeFilter, searchQuery, sortBy]);

  const handleToggleFavorite = (id: string) => {
    const isFav = Storage.toggleFavorite(id);
    onRefreshWords();
    toast.info(isFav ? 'Sevimlilarga qo\'shildi' : 'Sevimlilardan chiqarildi');
  };

  const handleDelete = (id: string, word: string) => {
    Storage.deleteWord(id);
    onRefreshWords();
    toast.info(`"${word}" o'chirildi.`);
  };

  const handleSaveModal = (data: Partial<VocabularyWord>) => {
    if (editingWord) {
      Storage.updateWord(editingWord.id, data);
      toast.success('So\'z muvaffaqiyatli yangilandi.');
    } else {
      Storage.addSingleWord(data);
      toast.success('Yangi so\'z kutubxonaga qo\'shildi.');
    }
    onRefreshWords();
    setEditingWord(null);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(words, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `vocabai_words_${Date.now()}.json`);
    dlAnchorElem.click();
    toast.success('Lug\'at JSON fayli yuklab olindi.');
  };

  const handleResetDefaults = () => {
    Storage.resetToDefault();
    onRefreshWords();
    toast.success('Standart lug\'at (20 ta so\'z) qayta tiklandi!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-amber-400" />
            <span>My Words Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kutubxonangizda <strong>{words.length} ta</strong> so'z mavjud.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportJSON}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
            title="Eksport qilish (JSON)"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
            title="Standart lug'atni qayta tiklash"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={() => {
              setEditingWord(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-400/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi so'z qo'shish</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d1322] border border-white/5">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'all' as WordFilter, label: 'Barchasi', count: words.length },
            {
              id: 'learning' as WordFilter,
              label: "O'rganilmoqda",
              count: words.filter((w) => w.status === 'learning').length,
            },
            {
              id: 'learned' as WordFilter,
              label: "O'rganilgan",
              count: words.filter((w) => w.status === 'learned').length,
            },
            {
              id: 'difficult' as WordFilter,
              label: 'Qiyin so\'zlar',
              count: words.filter((w) => w.status === 'difficult').length,
            },
            {
              id: 'favorites' as WordFilter,
              label: '⭐ Sevimlilar',
              count: words.filter((w) => w.isFavorite).length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeFilter === tab.id
                    ? 'bg-slate-950/20 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidiruv (English / Uzbek)..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="newest">Yangi qo'shilgan</option>
            <option value="alphabetical">Alifbo bo'yicha</option>
            <option value="reviews">Eng ko'p takrorlangan</option>
          </select>
        </div>
      </div>

      {/* Word Cards Grid */}
      {filteredWords.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/5 space-y-4">
          <p className="text-slate-400 text-sm">
            Qidiruv yoki filtr bo'yicha so'zlar topilmadi.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="text-xs font-semibold text-amber-400 hover:underline"
          >
            Barcha so'zlarni ko'rish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((item) => (
            <div
              key={item.id}
              className="group p-5 rounded-2xl bg-[#0d1322] border border-white/5 hover:border-amber-400/30 transition-all duration-200 flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Header: Status, Favorite, Part of Speech */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        item.status === 'learned'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : item.status === 'difficult'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-400/10 text-amber-300 border-amber-400/20'
                      }`}
                    >
                      {item.status}
                    </span>

                    <span className="text-[10px] text-slate-500 font-medium">
                      {item.partOfSpeech || 'word'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(item.id)}
                    className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        item.isFavorite
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                </div>

                {/* English Word & Pronunciation */}
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                    {item.word}
                  </h3>
                  <button
                    onClick={() => speakWord(item.word)}
                    className="text-slate-500 hover:text-amber-300 p-0.5 rounded transition-colors"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {item.pronunciation && (
                    <span className="font-mono text-xs text-slate-500">
                      {item.pronunciation}
                    </span>
                  )}
                </div>

                {/* Uzbek translation */}
                <p className="text-sm font-semibold text-amber-300/90 mb-2">
                  {item.translation}
                </p>

                {/* Definition */}
                {item.definition && (
                  <p className="text-xs text-slate-400 line-clamp-2 mb-2 italic">
                    "{item.definition}"
                  </p>
                )}

                {/* Example sentence */}
                {item.example && (
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 line-clamp-2">
                    {item.example}
                  </div>
                )}
              </div>

              {/* Bottom Actions: Reviews Count, Edit, Delete */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                <span>{item.reviewCount || 0} marta takrorlangan</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingWord(item);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                    title="Tahrirlash"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.word)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      <WordModal
        isOpen={isModalOpen}
        wordToEdit={editingWord}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWord(null);
        }}
        onSave={handleSaveModal}
      />
    </div>
  );
};
