import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  Award,
} from 'lucide-react';
import { SpeakingCategory, SpeakingSentence, WordComparison, SpeakingResult } from '../types/speaking';
import { SPEAKING_SENTENCES } from '../data/speakingData';
import { speakWord } from '../utils/speech';
import { Storage } from '../utils/storage';
import { useToast } from '../components/Toast';

export const Speaking: React.FC = () => {
  const toast = useToast();

  const [activeCategory, setActiveCategory] = useState<SpeakingCategory>('Irregular verbs');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [manualInputMode, setManualInputMode] = useState<boolean>(false);
  const [manualText, setManualText] = useState('');

  const recognitionRef = useRef<any>(null);

  // Filter sentences by category
  const categorySentences = SPEAKING_SENTENCES.filter((s) => s.category === activeCategory);
  const currentSentence = categorySentences[currentIndex] || categorySentences[0];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = 'en-US';

      recognizer.onstart = () => {
        setIsRecording(true);
      };

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenText(transcript);
        evaluateSpeech(transcript, currentSentence.text);
      };

      recognizer.onerror = (event: any) => {
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          toast.error("Mikrofonga ruxsat berilmadi. Iltimos brauzerda mikrofonni yoqing.");
        } else if (event.error === 'no-speech') {
          toast.info("Ovoz eshitilmadi. Qaytadan urinib ko'ring.");
        } else {
          toast.error(`Ovoz tanishda xatolik: ${event.error}`);
        }
      };

      recognizer.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognizer;
    } catch (e) {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentSentence]);

  // Clean words for comparison
  const normalize = (w: string) => w.toLowerCase().replace(/[.,!?;:'"()]/g, '').trim();

  // Evaluate and compare words
  const evaluateSpeech = (spoken: string, target: string) => {
    const targetWords = target.split(/\s+/);
    const spokenWords = spoken.split(/\s+/).map(normalize);

    let matchCount = 0;
    const comparisons: WordComparison[] = targetWords.map((origWord, idx) => {
      const cleanTarget = normalize(origWord);
      // Check if spoken word at same or adjacent index matches
      const isMatch =
        spokenWords[idx] === cleanTarget ||
        spokenWords.includes(cleanTarget);

      if (isMatch) matchCount++;

      return {
        expected: origWord,
        spoken: spokenWords[idx] || undefined,
        isMatch,
      };
    });

    const score = Math.round((matchCount / targetWords.length) * 100);

    let feedbackUz = "Ajoyib talaffuz! 100% mos keldi.";
    if (score < 50) {
      feedbackUz = "Biroz noaniq eshitildi. Iltimos audio talaffuzni qayta tinglab, yana bir bor urinib ko'ring.";
    } else if (score < 80) {
      feedbackUz = "Yaxshi urinish! Qizil bilan belgilangan so'zlarni qaytadan aniqroq talaffuz qiling.";
    } else if (score < 100) {
      feedbackUz = "Juda yaxshi natija! Talaffuzingiz deyarli mukammal.";
    }

    const newResult: SpeakingResult = {
      sentenceId: currentSentence.id,
      targetSentence: target,
      spokenText: spoken,
      words: comparisons,
      score,
      feedbackUz,
      practicedAt: new Date().toISOString(),
    };

    setResult(newResult);
    Storage.saveSpeakingResult(newResult);
  };

  const handleStartRecording = () => {
    setResult(null);
    setSpokenText('');

    if (!speechSupported || !recognitionRef.current) {
      toast.info("Speech Recognition brauzeringizda mavjud emas, matn kiritish orqali sinab ko'rishingiz mumkin.");
      setManualInputMode(true);
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (e) {
      recognitionRef.current.stop();
      setTimeout(() => recognitionRef.current.start(), 200);
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    setSpokenText(manualText);
    evaluateSpeech(manualText, currentSentence.text);
  };

  const handleNext = () => {
    if (currentIndex < categorySentences.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(0);
    }
    setResult(null);
    setSpokenText('');
    setManualText('');
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
    setResult(null);
    setSpokenText('');
    setManualText('');
  };

  const categories: SpeakingCategory[] = [
    'Irregular verbs',
    'Vocabulary',
    'Daily English',
    'Beginner English',
    'School English',
  ];

  return (
    <div className="space-y-7 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <Mic className="w-3.5 h-3.5" />
          <span>Interactive Speech & Pronunciation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Speaking & Talaffuz mashqi
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Jumlalarni tinglang, mikrofon orqali inglizcha talaffuz qiling va AI orqali so'zma-so'z aniqlik darajasini tekshiring.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentIndex(0);
              setResult(null);
              setSpokenText('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Speech API fallback notification */}
      {!speechSupported && (
        <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-200 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <strong>Eslatma:</strong> Brauzeringizda avtomatik ovoz tanish (Speech Recognition API) faol emas yoki qo'llab-quvvatlanmaydi (Chrome va Edge brauzerlarida to'liq ishlaydi).
            Siz talaffuz audiosini tinglab, mustaqil mashq qilishingiz yoki yozib tekshirishingiz mumkin.
          </div>
        </div>
      )}

      {/* Main Sentence Card */}
      <div className="rounded-3xl bg-[#0d1322] border border-white/10 p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Navigation Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-4">
          <span className="font-semibold text-amber-400">
            {activeCategory} ({currentIndex + 1} / {categorySentences.length})
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px]">
            {currentSentence.difficulty}
          </span>
        </div>

        {/* Target Sentence Display */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => speakWord(currentSentence.text)}
              className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/20 hover:scale-105 active:scale-95 transition-all"
              title="Tinglash (Listen)"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-relaxed">
            "{currentSentence.text}"
          </h2>

          <p className="text-slate-400 text-sm sm:text-base font-medium">
            🇺🇿 {currentSentence.translationUz}
          </p>

          {currentSentence.phonetic && (
            <p className="font-mono text-slate-500 text-xs sm:text-sm">
              {currentSentence.phonetic}
            </p>
          )}
        </div>

        {/* Microphone / Record Button */}
        <div className="flex flex-col items-center justify-center space-y-4 pt-4 border-t border-white/5">
          {isRecording ? (
            <button
              onClick={handleStopRecording}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-black text-sm shadow-xl shadow-rose-500/30 animate-pulse transition-all"
            >
              <MicOff className="w-5 h-5" />
              <span>Yozishni to'xtatish...</span>
            </button>
          ) : (
            <button
              onClick={handleStartRecording}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-400/25 active:scale-95 transition-all"
            >
              <Mic className="w-5 h-5" />
              <span>Gapirish uchun bosing</span>
            </button>
          )}

          <span className="text-xs text-slate-500">
            {isRecording ? "Mikrofonga inglizcha gapiring..." : "Tugmani bosing va jumlani ovoz chiqarib o'qing"}
          </span>
        </div>

        {/* Manual Input Fallback */}
        {manualInputMode && (
          <form onSubmit={handleManualSubmit} className="max-w-md mx-auto space-y-3 pt-2">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Ovoz chiqarib aytgan jumlani yozing..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs"
            >
              Matnni solishtirish
            </button>
          </form>
        )}

        {/* Result & Word-by-Word Matching Feedback */}
        {result && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-white/10 space-y-5 animate-in fade-in">
            {/* Score & Banner */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Talaffuz aniqligi</span>
                <span className={`text-2xl font-black ${
                  result.score >= 80 ? 'text-emerald-400' : result.score >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {result.score}%
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block mb-0.5">Baholash</span>
                <span className="text-xs font-semibold text-slate-200">
                  {result.score === 100 ? 'Mukammal! 🏆' : result.score >= 70 ? 'Yaxshi! ⭐' : 'Mashq kerak 💪'}
                </span>
              </div>
            </div>

            {/* Word by Word Tokenized Display */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                So'zma-so'z tekshiruv:
              </span>
              <div className="flex flex-wrap gap-2">
                {result.words.map((item, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold border transition-all ${
                      item.isMatch
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {item.isMatch ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span>{item.expected}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* AI Pronunciation Feedback */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/5 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Maslahat (Feedback):</span>
              </div>
              <p>{result.feedbackUz}</p>
            </div>
          </div>
        )}

        {/* Prev / Next Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Oldingisi</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <span>Keyingisi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
