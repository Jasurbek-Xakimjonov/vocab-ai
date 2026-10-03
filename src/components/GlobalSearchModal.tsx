import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  BookOpen,
  Zap,
  GraduationCap,
  ArrowRight,
  Volume2,
} from 'lucide-react';
import { VocabularyWord } from '../types/vocabulary';
import { IrregularVerb } from '../types/irregularVerbs';
import { GrammarTopic } from '../types/grammar';
import { GRAMMAR_TOPICS } from '../data/grammarData';
import { Storage } from '../utils/storage';
import { speakWord } from '../utils/speech';
import { NavTab } from './Sidebar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  words: VocabularyWord[];
  onOpenVerbDetail?: (verb: IrregularVerb) => void;
  onOpenGrammarTopic?: (topic: GrammarTopic) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  words,
  onOpenVerbDetail,
  onOpenGrammarTopic,
}) => {
  const [query, setQuery] = useState('');
  const [irregularVerbs, setIrregularVerbs] = useState<IrregularVerb[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIrregularVerbs(Storage.getIrregularVerbs());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const cleanQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!cleanQuery) {
      return { words: [], verbs: [], grammar: [] };
    }

    const matchedWords = words
      .filter(
        (w) =>
          w.word.toLowerCase().includes(cleanQuery) ||
          w.translation.toLowerCase().includes(cleanQuery) ||
          (w.definition && w.definition.toLowerCase().includes(cleanQuery))
      )
      .slice(0, 5);

    const matchedVerbs = irregularVerbs
      .filter(
        (v) =>
          v.v1.toLowerCase().includes(cleanQuery) ||
          v.v2.toLowerCase().includes(cleanQuery) ||
          v.v3.toLowerCase().includes(cleanQuery) ||
          v.translation.toLowerCase().includes(cleanQuery)
      )
      .slice(0, 5);

    const matchedGrammar = GRAMMAR_TOPICS.filter(
      (g) =>
        g.title.toLowerCase().includes(cleanQuery) ||
        g.summaryUz.toLowerCase().includes(cleanQuery) ||
        g.formula.toLowerCase().includes(cleanQuery) ||
        g.category.toLowerCase().includes(cleanQuery)
    ).slice(0, 4);

    return {
      words: matchedWords,
      verbs: matchedVerbs,
      grammar: matchedGrammar,
    };
  }, [cleanQuery, words, irregularVerbs]);

  const totalResultsCount =
    results.words.length + results.verbs.length + results.grammar.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-3xl bg-[#090d16] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-[#0d1322]">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Lug'at, noto'g'ri fe'llar yoki grammatikani qidirish..."
            className="flex-1 bg-transparent text-white text-base sm:text-lg placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg border border-white/10 bg-slate-800/80"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!cleanQuery ? (
            <div className="py-12 text-center space-y-2">
              <Search className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">
                Masalan: <span className="text-amber-400 font-semibold">begin</span>,{' '}
                <span className="text-amber-400 font-semibold">present simple</span> yoki{' '}
                <span className="text-amber-400 font-semibold">kitob</span> deb yozing.
              </p>
            </div>
          ) : totalResultsCount === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              "{query}" bo'yicha hech qanday natija topilmadi.
            </div>
          ) : (
            <>
              {/* Irregular Verbs Results */}
              {results.verbs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider px-2">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Irregular Verbs ({results.verbs.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.verbs.map((verb) => (
                      <div
                        key={verb.id}
                        onClick={() => {
                          onClose();
                          onNavigate('irregular-verbs');
                          if (onOpenVerbDetail) onOpenVerbDetail(verb);
                        }}
                        className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-amber-400/30 flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20 flex items-center justify-center font-black text-xs">
                            V
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white group-hover:text-amber-300 transition-colors">
                                {verb.v1}
                              </span>
                              <span className="text-slate-400 text-xs">
                                &rarr; {verb.v2} &rarr; {verb.v3}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400">
                              {verb.translation}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(verb.v1);
                            }}
                            className="p-1.5 text-slate-500 hover:text-amber-300"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary Words Results */}
              {results.words.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider px-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Vocabulary ({results.words.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.words.map((w) => (
                      <div
                        key={w.id}
                        onClick={() => {
                          onClose();
                          onNavigate('my-words');
                        }}
                        className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-sky-400/30 flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-sky-400/10 text-sky-300 border border-sky-400/20 flex items-center justify-center font-bold text-xs uppercase">
                            {w.word.charAt(0)}
                          </span>
                          <div>
                            <div className="font-bold text-white group-hover:text-sky-300 transition-colors">
                              {w.word}
                            </div>
                            <span className="text-xs text-slate-400">
                              {w.translation}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(w.word);
                            }}
                            className="p-1.5 text-slate-500 hover:text-sky-300"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grammar Topics Results */}
              {results.grammar.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider px-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Grammar Lessons ({results.grammar.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.grammar.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => {
                          onClose();
                          onNavigate('grammar');
                          if (onOpenGrammarTopic) onOpenGrammarTopic(g);
                        }}
                        className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-emerald-400/30 flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 flex items-center justify-center font-black text-xs">
                            G
                          </span>
                          <div>
                            <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                              {g.title}
                            </div>
                            <span className="text-xs text-slate-400 line-clamp-1">
                              {g.summaryUz}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
                            {g.category}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
