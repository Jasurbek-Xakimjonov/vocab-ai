import React, { useState, useEffect } from 'react';
import { X, Volume2, Sparkles, Check } from 'lucide-react';
import { VocabularyWord } from '../types/vocabulary';
import { speakWord } from '../utils/speech';

interface WordModalProps {
  isOpen: boolean;
  wordToEdit?: VocabularyWord | null;
  onClose: () => void;
  onSave: (wordData: Partial<VocabularyWord>) => void;
}

export const WordModal: React.FC<WordModalProps> = ({
  isOpen,
  wordToEdit,
  onClose,
  onSave,
}) => {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('noun');
  const [isFavorite, setIsFavorite] = useState(false);
  const [status, setStatus] = useState<'learning' | 'learned' | 'difficult'>('learning');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (wordToEdit) {
      setWord(wordToEdit.word || '');
      setTranslation(wordToEdit.translation || '');
      setDefinition(wordToEdit.definition || '');
      setExample(wordToEdit.example || '');
      setPronunciation(wordToEdit.pronunciation || '');
      setPartOfSpeech(wordToEdit.partOfSpeech || 'noun');
      setIsFavorite(Boolean(wordToEdit.isFavorite));
      setStatus(wordToEdit.status || 'learning');
    } else {
      setWord('');
      setTranslation('');
      setDefinition('');
      setExample('');
      setPronunciation('');
      setPartOfSpeech('noun');
      setIsFavorite(false);
      setStatus('learning');
    }
    setErrorMsg('');
  }, [wordToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) {
      setErrorMsg('Inglizcha so\'zni kiriting.');
      return;
    }
    if (!translation.trim()) {
      setErrorMsg('O\'zbekcha tarjimasini kiriting.');
      return;
    }

    onSave({
      word: word.trim(),
      translation: translation.trim(),
      definition: definition.trim(),
      example: example.trim(),
      pronunciation: pronunciation.trim(),
      partOfSpeech,
      isFavorite,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0d1322] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {wordToEdit ? 'So\'zni tahrirlash' : 'Yangi so\'z qo\'shish'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                English Word *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="e.g. abroad"
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-sm"
                  autoFocus
                />
                {word.trim() && (
                  <button
                    type="button"
                    onClick={() => speakWord(word)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-300 transition-colors p-1"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                O'zbekcha tarjima *
              </label>
              <input
                type="text"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                placeholder="masalan: chet elda"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                Pronunciation (IPA)
              </label>
              <input
                type="text"
                value={pronunciation}
                onChange={(e) => setPronunciation(e.target.value)}
                placeholder="/əˈbrɔːd/"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-slate-300 font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                Part of Speech
              </label>
              <select
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-sm"
              >
                <option value="noun">noun (ot)</option>
                <option value="verb">verb (fe'l)</option>
                <option value="adjective">adjective (sifat)</option>
                <option value="adverb">adverb (ravish)</option>
                <option value="phrase">phrase (ibora)</option>
                <option value="phrasal verb">phrasal verb</option>
                <option value="idiom">idiom</option>
                <option value="preposition">preposition (bog'lovchi/predlog)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              Simple English Definition
            </label>
            <input
              type="text"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="e.g. In or to a foreign country or countries"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              Example Sentence
            </label>
            <textarea
              rows={2}
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="e.g. She decided to study abroad for a year."
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-amber-400 focus:ring-amber-400/40 bg-slate-900"
              />
              <span>Sevimlilarga qo'shish (⭐ Favorite)</span>
            </label>

            {wordToEdit && (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none"
              >
                <option value="learning">O'rganilmoqda (Learning)</option>
                <option value="learned">O'rganilgan (Learned)</option>
                <option value="difficult">Qiyin so'z (Difficult)</option>
              </select>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold text-sm rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-400/20"
            >
              <Check className="w-4 h-4" />
              <span>Saqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
