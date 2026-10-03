import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Volume2,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Star,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  Maximize2,
  BookOpen,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { VocabularyWord, RatingLevel } from '../types/vocabulary';
import { speakWord } from '../utils/speech';
import { Storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { NavTab } from '../components/Sidebar';

interface FlashcardsProps {
  words: VocabularyWord[];
  onRefreshWords: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({
  words,
  onRefreshWords,
  onNavigate,
}) => {
  const toast = useToast();

  // Active filter for deck
  const [filterMode, setFilterMode] = useState<'all' | 'learning' | 'difficult' | 'favorites'>('all');
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');

  // Deck state
  const [deck, setDeck] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDeckCompleted, setIsDeckCompleted] = useState(false);

  // References to prevent resetting deck position during active review
  const prevFilterModeRef = useRef(filterMode);
  const deckInitializedRef = useRef(false);

  // Helper to get filtered word list based on filterMode
  const getFilteredWords = useCallback((sourceWords: VocabularyWord[], mode: typeof filterMode) => {
    let filtered = [...sourceWords];
    if (mode === 'learning') {
      filtered = filtered.filter((w) => w.status === 'learning');
    } else if (mode === 'difficult') {
      filtered = filtered.filter((w) => w.status === 'difficult');
    } else if (mode === 'favorites') {
      filtered = filtered.filter((w) => w.isFavorite);
    }
    return filtered;
  }, []);

  // Initialize or re-filter deck only when filter changes or initially loaded
  useEffect(() => {
    const filterChanged = prevFilterModeRef.current !== filterMode;
    prevFilterModeRef.current = filterMode;

    const filtered = getFilteredWords(words, filterMode);

    if (!deckInitializedRef.current || filterChanged) {
      deckInitializedRef.current = true;
      setDeck(filtered);
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsDeckCompleted(false);
    } else {
      // During active session when words update (e.g. from rating/favoriting),
      // update word data in place without resetting currentIndex or restarting deck
      setDeck((prevDeck) => {
        if (prevDeck.length === 0) return filtered;
        const wordMap = new Map(words.map((w) => [w.id, w]));
        return prevDeck.map((item) => wordMap.get(item.id) || item);
      });
    }
  }, [words, filterMode, getFilteredWords]);

  const currentCard = deck[currentIndex];

  // Flip card
  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  // Next card
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < deck.length - 1) {
        setIsFlipped(false);
        return prev + 1;
      } else {
        setIsDeckCompleted(true);
        setIsFlipped(false);
        return prev;
      }
    });
  }, [deck.length]);

  // Prev card
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev > 0) {
        setIsFlipped(false);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  // Shuffle deck
  const handleShuffle = () => {
    if (deck.length <= 1) return;
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsDeckCompleted(false);
    toast.info('Kartochkalar aralashtirildi!');
  };

  // Rate card (Again / Hard / Good / Easy) - None of them auto-advance
  const handleRate = (rating: RatingLevel) => {
    if (!currentCard) return;

    Storage.rateWord(currentCard.id, rating);

    if (rating === 'again') {
      toast.info(`"${currentCard.word}" takrorlash uchun qayta kiritildi.`);
    } else if (rating === 'hard') {
      toast.info(`"${currentCard.word}" o'rganilmoqda deb saqlandi.`);
    } else if (rating === 'good') {
      toast.success(`"${currentCard.word}" yodlanganlarga qo'shildi! ✅`);
    } else if (rating === 'easy') {
      toast.success(`"${currentCard.word}" oson (yodlangan) deb saqlandi! ✅`);
    }

    // Do NOT advance to next card - stay on current card for all ratings
    // Inform parent app to sync stats/database
    onRefreshWords();
  };

  // Toggle favorite
  const handleToggleFavorite = (e: React.MouseEvent, wordId: string) => {
    e.stopPropagation();
    const isFav = Storage.toggleFavorite(wordId);
    onRefreshWords();
    toast.info(isFav ? 'Sevimlilarga qo\'shildi' : 'Sevimlilardan olib tashlandi');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if focus is in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'Digit1') {
        handleRate('again');
      } else if (e.code === 'Digit2') {
        handleRate('hard');
      } else if (e.code === 'Digit3') {
        handleRate('good');
      } else if (e.code === 'Digit4') {
        handleRate('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, currentCard]);

  // Restart deck
  const handleRestart = () => {
    const filtered = getFilteredWords(words, filterMode);
    setDeck(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsDeckCompleted(false);
  };

  if (words.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center mx-auto shadow-2xl">
          <BookOpen className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Kartochkalar mavjud emas</h2>
          <p className="text-slate-400 text-sm">
            Hozircha sizda saqlangan so'zlar yo'q. Darslik yoki lug'at rasmini yuklang yoki standart so'zlarni faollashtiring.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onNavigate('import')}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-xl shadow-amber-400/20 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Rasm orqali so'z yuklash</span>
          </button>
          <button
            onClick={() => {
              Storage.resetToDefault();
              onRefreshWords();
            }}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all"
          >
            Standart lug'atni tiklash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-7">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-white/5 overflow-x-auto">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'learning', label: "O'rganilmoqda" },
            { id: 'difficult', label: 'Qiyin so\'zlar' },
            { id: 'favorites', label: '⭐ Sevimlilar' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterMode === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Buttons: Shuffle, View Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white text-xs font-semibold transition-colors"
            title="Lug'atni aralashtirish"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>Aralashtirish</span>
          </button>

          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10">
            <button
              onClick={() => setViewMode('single')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'single' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'
              }`}
              title="Katta kartochka rejimi"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'
              }`}
              title="Jadval / Galereya ko'rinishi"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {deck.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/5 space-y-3">
          <p className="text-slate-400 text-sm">
            Tanlangan filtr bo'yicha kartochkalar topilmadi.
          </p>
          <button
            onClick={() => setFilterMode('all')}
            className="text-amber-400 hover:underline text-xs font-semibold"
          >
            Barcha so'zlarni ko'rsatish
          </button>
        </div>
      ) : viewMode === 'single' ? (
        // SINGLE CARD 3D FLIP MODE
        <div className="space-y-6">
          {/* Deck Completed Screen */}
          {isDeckCompleted ? (
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-[#101a2e] border border-white/10 p-10 text-center max-w-xl mx-auto shadow-2xl space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Barakalla! 🎉</h3>
                <p className="text-slate-300 text-sm">
                  Siz ushbu guruhdagi barcha <strong>{deck.length} ta</strong> kartochkani o'rganib chiqdingiz!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Qaytadan o'rganish</span>
                </button>

                <button
                  onClick={() => onNavigate('practice')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-white/10 transition-colors"
                >
                  <span>Mashq va testlarga o'tish</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          ) : (
            currentCard && (
              <div className="flex flex-col items-center space-y-6">
                {/* Progress Counter & Card Status */}
                <div className="w-full max-w-2xl flex items-center justify-between text-xs text-slate-400 px-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {currentIndex + 1}
                    </span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-400">{deck.length}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                        currentCard.status === 'learned'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : currentCard.status === 'difficult'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-400/10 text-amber-300 border-amber-400/20'
                      }`}
                    >
                      {currentCard.status}
                    </span>
                    <button
                      onClick={(e) => handleToggleFavorite(e, currentCard.id)}
                      className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          currentCard.isFavorite
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-500'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 3D FLASHCARD CONTAINER */}
                <div
                  onClick={handleFlip}
                  className="relative w-full max-w-2xl h-[360px] sm:h-[400px] perspective-1000 cursor-pointer select-none group"
                >
                  <div
                    className={`relative w-full h-full duration-500 preserve-3d transition-transform ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* FRONT OF CARD */}
                    <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-[#0e1628] via-[#0d1322] to-[#131f38] border border-white/10 hover:border-amber-400/40 p-8 sm:p-10 flex flex-col justify-between shadow-2xl transition-colors">
                      {/* Top Header */}
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold uppercase tracking-widest text-slate-500">
                          English Vocabulary
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-amber-300 font-medium">
                          {currentCard.partOfSpeech || 'word'}
                        </span>
                      </div>

                      {/* Middle: Word & Pronunciation */}
                      <div className="text-center my-auto space-y-4">
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                          {currentCard.word}
                        </h2>

                        <div className="flex items-center justify-center gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(currentCard.word);
                            }}
                            className="w-10 h-10 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md"
                            title="Pronounce"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                          {currentCard.pronunciation && (
                            <span className="text-slate-400 font-mono text-sm sm:text-base">
                              {currentCard.pronunciation}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom: Flip Hint */}
                      <div className="text-center text-xs text-slate-500">
                        <span>Aylantirish uchun bosing yoki Space tugmasi</span>
                      </div>
                    </div>

                    {/* BACK OF CARD */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-[#121c33] via-[#0f172a] to-[#0a101f] border border-amber-400/30 p-8 sm:p-10 flex flex-col justify-between shadow-2xl">
                      {/* Top Header */}
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold uppercase tracking-widest text-amber-400/80">
                          Tarjimasi & Ta'rifi
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakWord(currentCard.word);
                          }}
                          className="text-amber-400 hover:text-white p-1 transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Middle: Uzbek Translation & English Definition */}
                      <div className="text-center my-auto space-y-4">
                        <h3 className="text-2xl sm:text-4xl font-extrabold text-amber-300 tracking-tight">
                          {currentCard.translation}
                        </h3>

                        {currentCard.definition && (
                          <p className="text-xs sm:text-sm text-slate-300 font-light max-w-lg mx-auto">
                            {currentCard.definition}
                          </p>
                        )}

                        {currentCard.example && (
                          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs sm:text-sm text-slate-400 italic max-w-md mx-auto">
                            "{currentCard.example}"
                          </div>
                        )}
                      </div>

                      {/* Bottom Hint */}
                      <div className="text-center text-xs text-slate-500">
                        <span>O'rganish darajangizni quyida baholang</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Bar (Spaced Repetition: Again / Hard / Good / Easy) */}
                <div className="w-full max-w-2xl space-y-3">
                  <div className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Qay darajada eslab qoldingiz?
                  </div>

                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    <button
                      onClick={() => handleRate('again')}
                      className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-all active:scale-95"
                    >
                      <span className="text-xs sm:text-sm font-bold">Again</span>
                      <span className="text-[10px] text-rose-400/80 mt-0.5">&lt; 1 kun</span>
                      <span className="text-[9px] text-slate-500 hidden sm:inline">[1]</span>
                    </button>

                    <button
                      onClick={() => handleRate('hard')}
                      className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 transition-all active:scale-95"
                    >
                      <span className="text-xs sm:text-sm font-bold">Hard</span>
                      <span className="text-[10px] text-orange-400/80 mt-0.5">2 kun</span>
                      <span className="text-[9px] text-slate-500 hidden sm:inline">[2]</span>
                    </button>

                    <button
                      onClick={() => handleRate('good')}
                      className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-all active:scale-95"
                    >
                      <span className="text-xs sm:text-sm font-bold">Good</span>
                      <span className="text-[10px] text-emerald-400/80 mt-0.5">4 kun</span>
                      <span className="text-[9px] text-slate-500 hidden sm:inline">[3]</span>
                    </button>

                    <button
                      onClick={() => handleRate('easy')}
                      className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 transition-all active:scale-95"
                    >
                      <span className="text-xs sm:text-sm font-bold">Easy</span>
                      <span className="text-[10px] text-sky-400/80 mt-0.5">7+ kun</span>
                      <span className="text-[9px] text-slate-500 hidden sm:inline">[4]</span>
                    </button>
                  </div>
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                    title="Oldingi (Arrow Left)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleFlip}
                    className="px-6 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-all"
                  >
                    Kartochkani aylantirish (Space)
                  </button>

                  <button
                    onClick={handleNext}
                    className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-white hover:bg-slate-800 transition-all active:scale-95"
                    title="Keyingi (Arrow Right)"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        // GRID GALLERY VIEW (All cards on screen)
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {deck.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => {
                setCurrentIndex(idx);
                setViewMode('single');
              }}
              className="p-5 rounded-2xl bg-[#0d1322] border border-white/5 hover:border-amber-400/40 cursor-pointer transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    {item.partOfSpeech || 'word'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(item.word);
                    }}
                    className="text-slate-500 hover:text-amber-300 transition-colors p-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="text-lg font-bold text-white mb-1">{item.word}</h4>
                <p className="text-sm font-semibold text-amber-300/90 mb-2">
                  {item.translation}
                </p>

                {item.definition && (
                  <p className="text-xs text-slate-400 line-clamp-2 italic">
                    "{item.definition}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                <span>{item.pronunciation || '/.../'}</span>
                <span className="text-amber-400 hover:underline">O'rganish &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
