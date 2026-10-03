import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  XCircle,
  Star,
  BookOpen,
  Check,
  Plus,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Info,
  Tv,
  ListOrdered,
  Eye,
  EyeOff,
  Flame,
  Award,
} from 'lucide-react';
import {
  SpeakingVideo,
  VideoTranscriptSentence,
  VideoVocabularyWord,
} from '../types/speakingVideos';
import { speakWord } from '../utils/speech';
import { Storage } from '../utils/storage';
import { useToast } from '../components/Toast';

interface SpeakingVideoModalProps {
  video: SpeakingVideo;
  isOpen: boolean;
  onClose: () => void;
  onRefreshWords: () => void;
  isSaved: boolean;
  isWatched: boolean;
  onToggleSave: () => void;
  onToggleWatched: () => void;
}

type ModalTab = 'transcript' | 'speaking' | 'vocabulary';

interface WordEvaluation {
  expected: string;
  spoken?: string;
  isMatch: boolean;
}

export const SpeakingVideoModal: React.FC<SpeakingVideoModalProps> = ({
  video,
  isOpen,
  onClose,
  onRefreshWords,
  isSaved,
  isWatched,
  onToggleSave,
  onToggleWatched,
}) => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<ModalTab>('speaking');
  const [showTranscript, setShowTranscript] = useState(true);

  // Active sentence for speaking practice
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [evaluatedWords, setEvaluatedWords] = useState<WordEvaluation[] | null>(null);
  const [speakingScore, setSpeakingScore] = useState<number | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Words added state (to track in-session adds)
  const [addedWordMap, setAddedWordMap] = useState<Record<string, boolean>>({});

  const recognitionRef = useRef<any>(null);

  const sentences = video.speakingSentences || video.transcript || [];
  const activeSentence: VideoTranscriptSentence | undefined = sentences[selectedSentenceIndex];

  // Initialize SpeechRecognition on mount or sentence change
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
      recognizer.lang = video.accent === 'UK English' ? 'en-GB' : 'en-US';

      recognizer.onstart = () => {
        setIsRecording(true);
      };

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenText(transcript);
        if (activeSentence) {
          evaluateSpeech(transcript, activeSentence.text);
        }
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
  }, [activeSentence, video.accent]);

  // Reset speech test when changing sentence
  useEffect(() => {
    setSpokenText('');
    setEvaluatedWords(null);
    setSpeakingScore(null);
    setIsRecording(false);
  }, [selectedSentenceIndex]);

  // Clean words for comparison
  const normalize = (w: string) =>
    w.toLowerCase().replace(/[.,!?;:'"()]/g, '').trim();

  // Evaluate speech against target sentence
  const evaluateSpeech = (spoken: string, target: string) => {
    const targetWords = target.split(/\s+/);
    const spokenWords = spoken.split(/\s+/).map(normalize);

    let matchCount = 0;
    const comparisons: WordEvaluation[] = targetWords.map((origWord, idx) => {
      const cleanTarget = normalize(origWord);
      const isMatch =
        spokenWords[idx] === cleanTarget || spokenWords.includes(cleanTarget);

      if (isMatch) matchCount++;

      return {
        expected: origWord,
        spoken: spokenWords[idx] || undefined,
        isMatch,
      };
    });

    const score = Math.round((matchCount / targetWords.length) * 100);
    setEvaluatedWords(comparisons);
    setSpeakingScore(score);

    if (activeSentence) {
      Storage.saveVideoSpeakingScore(video.id, activeSentence.id, score);
    }

    if (score >= 80) {
      toast.success(`Ajoyib! Talaffuz aniqligi: ${score}% 🎉`);
    } else {
      toast.info(`Talaffuz aniqligi: ${score}%. Qaytadan tinglab ko'ring.`);
    }
  };

  const handleStartRecording = () => {
    if (!speechSupported) {
      toast.error("Brauzeringizda ovoz tanish (Speech Recognition) qo'llab-quvvatlanmaydi.");
      return;
    }
    if (!recognitionRef.current) return;
    try {
      setSpokenText('');
      setEvaluatedWords(null);
      setSpeakingScore(null);
      recognitionRef.current.start();
    } catch (e) {
      // If already started, stop first
      recognitionRef.current.stop();
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Add video vocabulary word to user's main vocabulary
  const handleAddWordToVocabulary = (vocabWord: VideoVocabularyWord) => {
    const alreadyIn = Storage.isWordInVocabulary(vocabWord.word);
    if (alreadyIn) {
      toast.info(`"${vocabWord.word}" allaqachon lug'atingizda mavjud.`);
      setAddedWordMap((prev) => ({ ...prev, [vocabWord.word]: true }));
      return;
    }

    Storage.addCustomWord({
      word: vocabWord.word,
      translation: vocabWord.translation,
      pronunciation: vocabWord.pronunciation,
      partOfSpeech: vocabWord.partOfSpeech,
      definition: vocabWord.definition,
      example: vocabWord.example,
      status: 'learning',
    });

    setAddedWordMap((prev) => ({ ...prev, [vocabWord.word]: true }));
    onRefreshWords();
    toast.success(`"${vocabWord.word}" so'z boyligingizga qo'shildi! ✅`);
  };

  // Check if sentence has completed score
  const videoProgress = Storage.getVideoProgress();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto rounded-3xl bg-[#0b101d] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/25 flex items-center justify-center text-amber-300 text-sm shrink-0">
              🎬
            </span>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {video.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{video.accent === 'US English' ? '🇺🇸 US English' : '🇬🇧 UK English'}</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">{video.level}</span>
                <span>•</span>
                <span>{video.source}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Save / Bookmark Button */}
            <button
              onClick={onToggleSave}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                  : 'bg-slate-800/80 text-slate-400 border-white/5 hover:text-white'
              }`}
              title={isSaved ? "Saqlanganlardan o'chirish" : "Videoni saqlash"}
            >
              <Star className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Watched Toggle Button */}
            <button
              onClick={onToggleWatched}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isWatched
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-white/5 hover:text-white'
              }`}
              title={isWatched ? "Ko'rilmagan deb belgilash" : "Ko'rildi deb belgilash"}
            >
              <Check className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isWatched ? "Ko'rildi" : "Ko'rilgan"}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 16:9 YouTube Video Embed Player */}
          <div className="space-y-3">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Secondary fallback notice & YouTube link */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px]">
                  ⏱ {video.duration}
                </span>
                <span className="text-slate-400 truncate max-w-xs sm:max-w-md">
                  {video.description}
                </span>
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold hover:underline"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            {[
              { id: 'speaking', label: '🎤 Speaking Practice', count: sentences.length },
              { id: 'transcript', label: '📖 Transcript', count: video.transcript?.length || 0 },
              { id: 'vocabulary', label: '📝 Vocabulary', count: video.vocabulary.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ModalTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === tab.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* TAB 1: SPEAKING PRACTICE */}
          {activeTab === 'speaking' && (
            <div className="space-y-6 animate-in fade-in">
              {sentences.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-white/5 text-slate-400 text-sm">
                  Speaking practice sentences unavailable for this video.
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Sentence Selector Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {sentences.map((sent, idx) => {
                      const scoreData = videoProgress.speakingScores[sent.id];
                      return (
                        <button
                          key={sent.id}
                          onClick={() => setSelectedSentenceIndex(idx)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            selectedSentenceIndex === idx
                              ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                              : 'bg-slate-900 border border-white/5 text-slate-300 hover:text-white'
                          }`}
                        >
                          <span>{idx + 1}-gap</span>
                          {scoreData && (
                            <span className="text-[10px] px-1.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                              {scoreData.bestScore}%
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Sentence Practice Card */}
                  {activeSentence && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0d1424] to-[#121c33] border border-white/10 space-y-6 shadow-xl">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="uppercase font-bold tracking-wider text-amber-400/90">
                          {selectedSentenceIndex + 1}-gap ({sentences.length} tadan)
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => speakWord(activeSentence.text)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-white/10 text-xs font-semibold transition-all"
                            title="Tinglash"
                          >
                            <Volume2 className="w-4 h-4" />
                            <span>🔊 Tinglash</span>
                          </button>
                        </div>
                      </div>

                      {/* Target Sentence Display */}
                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                          "{activeSentence.text}"
                        </h3>
                        {activeSentence.translationUz && (
                          <p className="text-sm text-slate-400 font-medium">
                            🇺🇿 {activeSentence.translationUz}
                          </p>
                        )}
                      </div>

                      {/* Microphone Action Area */}
                      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/60 border border-white/5 space-y-4">
                        <div className="relative">
                          {isRecording && (
                            <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
                          )}
                          <button
                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 ${
                              isRecording
                                ? 'bg-rose-500 text-white animate-pulse'
                                : 'bg-amber-400 text-slate-950 hover:bg-amber-300 hover:scale-105'
                            }`}
                            title={isRecording ? "Yozishni to'xtatish" : "Ovoz chiqarib gapiring"}
                          >
                            {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                          </button>
                        </div>

                        <div className="text-center space-y-1">
                          <p className="text-xs font-semibold text-slate-300">
                            {isRecording ? (
                              <span className="text-rose-400 font-bold">
                                🔴 Eshitilmoqda... Gapni ovoz chiqarib ayting
                              </span>
                            ) : (
                              <span>Mikrofon tugmasini bosing va gapni o'qing</span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Pronunciation assessment is for practice and learning purposes.
                          </p>
                        </div>
                      </div>

                      {/* Speech Recognition Results & Word-by-Word Diff */}
                      {spokenText && (
                        <div className="space-y-4 animate-in fade-in p-5 rounded-2xl bg-slate-900/80 border border-white/10">
                          <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs">
                            <span className="text-slate-400">Siz aytgan matn:</span>
                            {speakingScore !== null && (
                              <div className="flex items-center gap-1.5 font-bold">
                                <Award className="w-4 h-4 text-amber-400" />
                                <span
                                  className={
                                    speakingScore >= 80
                                      ? 'text-emerald-400'
                                      : speakingScore >= 50
                                      ? 'text-amber-400'
                                      : 'text-rose-400'
                                  }
                                >
                                  Aniqlik: {speakingScore}%
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="text-sm font-medium text-slate-300 italic">
                            "{spokenText}"
                          </p>

                          {/* Word-by-word comparison badges */}
                          {evaluatedWords && (
                            <div className="space-y-2 pt-2">
                              <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                                So'zma-so'z tekshiruv:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {evaluatedWords.map((item, wIdx) => (
                                  <span
                                    key={wIdx}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                                      item.isMatch
                                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                    }`}
                                  >
                                    {item.expected}
                                    {item.isMatch ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2">
                <p className="text-xs text-slate-400">
                  Videoning to'liq matnli transkripti. Har bir gapni tinglashingiz yoki mashq qilishingiz mumkin.
                </p>

                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showTranscript ? "Yashirish" : "Ko'rsatish"}</span>
                </button>
              </div>

              {!video.transcript || video.transcript.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-white/5 text-slate-400 text-sm">
                  Transcript unavailable
                </div>
              ) : showTranscript ? (
                <div className="space-y-3">
                  {video.transcript.map((sentence, idx) => (
                    <div
                      key={sentence.id}
                      className="group p-4 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-amber-400/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                            {sentence.text}
                          </p>
                        </div>
                        {sentence.translationUz && (
                          <p className="text-xs text-slate-400 pl-7">
                            🇺🇿 {sentence.translationUz}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pl-7 sm:pl-0">
                        <button
                          onClick={() => speakWord(sentence.text)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors"
                          title="Tinglash"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('speaking');
                            setSelectedSentenceIndex(idx);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/25 text-amber-300 text-xs font-semibold transition-all"
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span>Mashq qilish</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 italic">
                  Transkript yashirilgan. Ko'rish uchun "Ko'rsatish" tugmasini bosing.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VOCABULARY */}
          {activeTab === 'vocabulary' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-1">
                <p className="text-xs text-slate-400">
                  Ushbu videodan saralangan muhim so'zlar. Har bir so'zni asosiy kutubxonangizga bir marta bosish orqali qo'shishingiz mumkin.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {video.vocabulary.map((vocabItem, idx) => {
                  const alreadySaved =
                    Boolean(addedWordMap[vocabItem.word]) ||
                    Storage.isWordInVocabulary(vocabItem.word);

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-amber-400/30 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/20">
                            {vocabItem.partOfSpeech}
                          </span>

                          <button
                            onClick={() => speakWord(vocabItem.word)}
                            className="p-1 text-slate-400 hover:text-amber-300 transition-colors"
                            title="Talaffuzni tinglash"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white">{vocabItem.word}</h4>
                          <p className="text-sm font-semibold text-amber-300">
                            {vocabItem.translation}
                          </p>
                          {vocabItem.pronunciation && (
                            <span className="text-xs text-slate-400 font-mono">
                              {vocabItem.pronunciation}
                            </span>
                          )}
                        </div>

                        {vocabItem.example && (
                          <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2 rounded-xl border border-white/5">
                            "{vocabItem.example}"
                          </p>
                        )}
                      </div>

                      {/* Add to Vocabulary Button */}
                      <div className="pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleAddWordToVocabulary(vocabItem)}
                          disabled={alreadySaved}
                          className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                            alreadySaved
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-md shadow-amber-400/15 active:scale-98'
                          }`}
                        >
                          {alreadySaved ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Lug'atga qo'shilgan ✓</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add to My Vocabulary</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
