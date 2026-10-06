import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Plus,
  Check,
  RotateCcw,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Clock,
  MessageSquare,
  Bot,
  User,
  Star,
  ChevronRight,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';
import {
  SpeakingBuddyLevel,
  BuddyMessage,
  BuddyTopic,
  BuddySuggestion,
  BuddyVocabItem,
  SpeakingBuddyUserState,
} from '../types/speakingBuddy';
import {
  BUDDY_LEVELS,
  BUDDY_TOPICS,
  generateBuddyResponse,
  generateSimpleExplanation,
  EngineContext,
} from '../utils/speakingBuddyEngine';
import { speakWord } from '../utils/speech';
import { Storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { NavTab } from '../components/Sidebar';

interface SpeakingBuddyProps {
  onRefreshWords?: () => void;
  onNavigate?: (tab: NavTab) => void;
}

export const SpeakingBuddy: React.FC<SpeakingBuddyProps> = ({
  onRefreshWords,
  onNavigate,
}) => {
  const toast = useToast();
  const { user } = useAuth();

  // User state & streak from Storage
  const [buddyState, setBuddyState] = useState<SpeakingBuddyUserState>(() =>
    Storage.getSpeakingBuddyState()
  );

  const [activeTopic, setActiveTopic] = useState<BuddyTopic>(BUDDY_TOPICS[0]);
  const [messages, setMessages] = useState<BuddyMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Recording & Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<any>(null);

  // Session stats tracking
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [discoveredWords, setDiscoveredWords] = useState<BuddyVocabItem[]>([]);
  const [addedWordKeys, setAddedWordKeys] = useState<Set<string>>(new Set());
  const [showResultModal, setShowResultModal] = useState(false);
  const [finalSessionScore, setFinalSessionScore] = useState(85);

  // Conversation context for the engine
  const [context, setContext] = useState<EngineContext>({
    topicId: BUDDY_TOPICS[0].id,
    turnCount: 0,
    userName: user?.email ? user.email.split('@')[0] : '',
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync state on updates
  useEffect(() => {
    const handleUpdate = () => {
      setBuddyState(Storage.getSpeakingBuddyState());
    };
    window.addEventListener('vocabai_speaking_buddy_updated', handleUpdate);
    return () => {
      window.removeEventListener('vocabai_speaking_buddy_updated', handleUpdate);
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech Recognition Setup
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
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      };

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleUserSend(transcript, true);
        }
        stopRecording();
      };

      recognizer.onerror = (event: any) => {
        stopRecording();
        if (event.error === 'not-allowed') {
          toast.error("Mikrofonga ruxsat berilmadi. Brauzer sozlamalarida mikrofonni yoqing.");
        } else if (event.error === 'no-speech') {
          toast.info("Ovoz eshitilmadi. Iltimos qaytadan urinib ko'ring.");
        }
      };

      recognizer.onend = () => {
        stopRecording();
      };

      recognitionRef.current = recognizer;
    } catch {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [context, activeTopic, messages]);

  const startRecording = () => {
    if (!speechSupported) {
      toast.info("Ushbu brauzerda ovoz tanish qo'llab-quvvatlanmaydi. Matn orqali yozishingiz mumkin.");
      return;
    }
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
  };

  // Start / Restart Session
  const handleStartSession = (topic?: BuddyTopic) => {
    const chosenTopic = topic || activeTopic;
    setActiveTopic(chosenTopic);
    setIsSessionActive(true);
    setSessionStartTime(Date.now());
    setQuestionsAnswered(0);
    setDiscoveredWords([]);

    const initialMsg: BuddyMessage = {
      id: `msg_init_${Date.now()}`,
      sender: 'ai',
      englishText: chosenTopic.initialMessage.english,
      uzbekText: chosenTopic.initialMessage.uzbek,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: chosenTopic.sampleSuggestions,
    };

    setMessages([initialMsg]);
    setContext({
      topicId: chosenTopic.id,
      turnCount: 0,
      userName: user?.email ? user.email.split('@')[0] : '',
    });

    // Speak initial greeting automatically
    speakWord(chosenTopic.initialMessage.english);
  };

  // Send message
  const handleUserSend = async (userText: string, fromVoice = false) => {
    const clean = userText.trim();
    if (!clean || isLoading) return;

    setInputText('');

    const userMsg: BuddyMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      englishText: clean,
      uzbekText: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);
    setQuestionsAnswered((prev) => prev + 1);

    // Try Gemini server endpoint first with fallback to built-in smart engine
    let aiResponseMsg: BuddyMessage | null = null;
    let nextCtx = { ...context, turnCount: context.turnCount + 1 };

    try {
      const res = await fetch('/api/speaking-buddy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          history: newMessages.slice(-6),
          level: buddyState.currentLevel,
          userName: context.userName,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.englishText && json.data.uzbekText) {
          aiResponseMsg = {
            id: `msg_ai_${Date.now()}`,
            sender: 'ai',
            englishText: json.data.englishText,
            uzbekText: json.data.uzbekText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            gentleCorrection: json.data.gentleCorrection || undefined,
            suggestions: json.data.suggestions || [],
            keyVocabulary: json.data.keyVocabulary || [],
          };
        }
      }
    } catch (e) {
      console.warn('Backend chat failed, switching to smart local engine:', e);
    }

    // Fallback to local intelligent conversation engine
    if (!aiResponseMsg) {
      const result = generateBuddyResponse(clean, newMessages, context);
      aiResponseMsg = result.message;
      nextCtx = result.updatedContext;
    }

    setContext(nextCtx);
    setIsLoading(false);

    setMessages((prev) => [...prev, aiResponseMsg!]);

    // Track newly discovered words
    if (aiResponseMsg.keyVocabulary && aiResponseMsg.keyVocabulary.length > 0) {
      setDiscoveredWords((prev) => {
        const existingWords = new Set(prev.map((w) => w.word.toLowerCase()));
        const toAdd = aiResponseMsg!.keyVocabulary!.filter(
          (w) => !existingWords.has(w.word.toLowerCase())
        );
        return [...prev, ...toAdd];
      });
    }

    // Auto-play audio of the AI message
    if (aiResponseMsg.englishText) {
      speakWord(aiResponseMsg.englishText);
    }
  };

  // Safety net: Explain simply
  const handleExplainSimply = () => {
    const lastAiMsg = [...messages].reverse().find((m) => m.sender === 'ai');
    if (!lastAiMsg) return;

    const expMsg = generateSimpleExplanation(lastAiMsg);
    setMessages((prev) => [...prev, expMsg]);
    toast.info("Oddiy o'zbekcha tushuntirish berildi.");
  };

  // Safety net: Give me a hint
  const handleGiveHint = () => {
    const lastAiMsg = [...messages].reverse().find((m) => m.sender === 'ai');
    const hints = lastAiMsg?.suggestions || [
      { english: "I'm good.", uzbek: 'Men yaxshiman.' },
      { english: 'Yes, I am.', uzbek: 'Ha.' },
    ];

    const hintMsg: BuddyMessage = {
      id: `msg_hint_${Date.now()}`,
      sender: 'ai',
      englishText: 'Here are 3 ways you can answer:',
      uzbekText: 'Javob berishning 3 ta oson usuli:',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: hints,
    };

    setMessages((prev) => [...prev, hintMsg]);
    toast.info("Javob berish variantlari ko'rsatildi.");
  };

  // Finish session
  const handleFinishSession = () => {
    const duration = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
    const score = Math.min(100, Math.max(60, 70 + questionsAnswered * 4));
    setFinalSessionScore(score);

    // Save session in Storage
    Storage.recordSpeakingBuddySession({
      id: `sess_${Date.now()}`,
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      level: buddyState.currentLevel,
      date: new Date().toISOString(),
      durationSeconds: duration,
      questionsAnswered,
      wordsPracticed: discoveredWords.length,
      score,
      messagesCount: messages.length,
    });

    setShowResultModal(true);
    setIsSessionActive(false);
  };

  // Add word to user dictionary
  const handleAddWordToVocabulary = (vocab: BuddyVocabItem) => {
    try {
      Storage.addSingleWord({
        word: vocab.word,
        translation: vocab.translation,
        definition: vocab.definition || '',
        example: vocab.example || '',
        pronunciation: vocab.pronunciation || '',
        partOfSpeech: (vocab.partOfSpeech as any) || 'noun',
        status: 'learning',
        isFavorite: false,
      });

      setAddedWordKeys((prev) => new Set(prev).add(vocab.word.toLowerCase()));
      if (onRefreshWords) onRefreshWords();
      toast.success(`"${vocab.word}" shaxsiy lug'atingizga qo'shildi! 📚`);
    } catch {
      toast.error("So'zni saqlashda xatolik yuz berdi.");
    }
  };

  const currentLevelObj =
    BUDDY_LEVELS.find((l) => l.level === buddyState.currentLevel) || BUDDY_LEVELS[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ======================================================== */}
      {/* 1. HERO HEADER SECTION */}
      {/* ======================================================== */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1427] via-[#101b33] to-[#16274a] border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-xs border border-amber-400/30 flex items-center gap-1.5 shadow-sm">
                <span>{currentLevelObj.badge}</span>
                <span>{currentLevelObj.name}</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-extrabold text-xs border border-orange-500/30 flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                <span>{buddyState.currentStreak} day streak</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>🗣️ AI Speaking Buddy</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium">
              "Practice English every day with your AI friend."
            </p>
            <p className="text-xs text-slate-400">
              Har bir inglizcha jumla ostida o'zbekcha tarjimasi bilan. Noldan erkin nutqqa qadar qulay va do'stona muhit!
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleStartSession()}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-400/25 flex items-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Start Speaking</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {isSessionActive && (
                <button
                  onClick={handleFinishSession}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors border border-white/10"
                >
                  Yakunlash & Natija
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1 shadow-md text-center">
              <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 mx-auto flex items-center justify-center">
                <Flame className="w-4 h-4 fill-orange-400" />
              </div>
              <div className="text-xl font-black text-white">{buddyState.currentStreak}</div>
              <div className="text-[11px] text-slate-400">Daily Streak</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1 shadow-md text-center">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 mx-auto flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-xl font-black text-white">
                {buddyState.totalConversationsCompleted}
              </div>
              <div className="text-[11px] text-slate-400">Suhbatlar</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1 shadow-md text-center col-span-2 sm:col-span-1">
              <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 mx-auto flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-xl font-black text-white">
                {buddyState.totalWordsPracticed}
              </div>
              <div className="text-[11px] text-slate-400">So'zlar</div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TOPICS BAR */}
      {/* ======================================================== */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Mashq qilish mavzulari (Beginner Topics)</span>
          </h3>
          <span className="text-xs text-amber-300 font-semibold">
            {activeTopic.title}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {BUDDY_TOPICS.map((topic) => {
            const isSelected = activeTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => handleStartSession(topic)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20'
                    : 'bg-slate-900/80 text-slate-300 border-white/5 hover:border-white/20 hover:bg-slate-800'
                }`}
              >
                <span>{topic.icon}</span>
                <span>{topic.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE CHAT INTERFACE */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-[#090d16] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[620px]">
        {/* Chat Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">AI English Friend</h4>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {activeTopic.icon} {activeTopic.title} • {currentLevelObj.name}
              </p>
            </div>
          </div>

          {/* Chat Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGiveHint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/5"
              title="Give me a hint"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Maslahat</span>
            </button>

            <button
              onClick={handleExplainSimply}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/5"
              title="Explain simply"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tushuntirish</span>
            </button>

            <button
              onClick={() => handleStartSession(activeTopic)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-white/5"
              title="Qaytadan boshlash"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-400/15 text-amber-400 flex items-center justify-center text-3xl shadow-inner">
                👋
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-white">Suhbatni boshlashga tayyormisiz?</h3>
                <p className="text-xs text-slate-400">
                  AI do'stingiz siz bilan eng oddiy ingliz tilida suhbatlashadi. Har bir so'zning tarjimasi beriladi!
                </p>
              </div>
              <button
                onClick={() => handleStartSession()}
                className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md"
              >
                Salom deb yozish 👋
              </button>
            </div>
          ) : (
            messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-1.5 max-w-2xl ${
                    isAi ? 'mr-auto' : 'ml-auto'
                  }`}
                >
                  {/* Sender label */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1">
                    {isAi ? (
                      <>
                        <Bot className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-semibold text-slate-300">AI Friend</span>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-slate-300">Siz</span>
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                      </>
                    )}
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-3xl p-4 sm:p-5 shadow-lg space-y-2 border ${
                      isAi
                        ? 'bg-slate-900/90 border-white/10 text-white rounded-tl-sm'
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-700 border-emerald-500/30 text-white rounded-tr-sm'
                    }`}
                  >
                    {/* English sentence */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-base sm:text-lg font-bold leading-relaxed tracking-tight">
                        {msg.englishText}
                      </p>

                      {/* Listen audio button on AI message */}
                      {isAi && msg.englishText && (
                        <button
                          onClick={() => speakWord(msg.englishText)}
                          className="shrink-0 p-1.5 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-400 transition-colors shadow-sm"
                          title="Tinglash (Listen)"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* CORE REQUIREMENT: Uzbek Translation Underneath Every Sentence */}
                    {isAi && msg.uzbekText && (
                      <div className="pt-1.5 border-t border-white/10">
                        <p className="text-xs sm:text-sm text-amber-300/90 italic font-medium leading-relaxed">
                          {msg.uzbekText}
                        </p>
                      </div>
                    )}

                    {/* Gentle Correction Banner */}
                    {msg.gentleCorrection && (
                      <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Kichik tuzatish (Small tip):</span>
                        </div>
                        <p className="text-xs text-white font-medium">
                          "{msg.gentleCorrection.corrected}"
                        </p>
                        <p className="text-[11px] text-slate-400 italic">
                          {msg.gentleCorrection.explanationUz}
                        </p>
                      </div>
                    )}

                    {/* Key Vocabulary Discovery Cards */}
                    {msg.keyVocabulary && msg.keyVocabulary.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Yangi so'zlar (New Words):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.keyVocabulary.map((vocab) => {
                            const isSaved = addedWordKeys.has(vocab.word.toLowerCase());
                            return (
                              <div
                                key={vocab.word}
                                className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-white/5"
                              >
                                <div className="space-y-0.5 min-w-0 pr-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white truncate">
                                      {vocab.word}
                                    </span>
                                    {vocab.pronunciation && (
                                      <span className="text-[10px] font-mono text-slate-400">
                                        {vocab.pronunciation}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-amber-300 block truncate">
                                    {vocab.translation}
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleAddWordToVocabulary(vocab)}
                                  disabled={isSaved}
                                  className={`p-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                                    isSaved
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                                  }`}
                                  title={isSaved ? "Lug'atda bor" : "Lug'atga qo'shish"}
                                >
                                  {isSaved ? (
                                    <Check className="w-3.5 h-3.5" />
                                  ) : (
                                    <Plus className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Beginner Response Suggestions Pills */}
                  {isAi && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="pt-1.5 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleUserSend(sug.english)}
                          className="group text-left px-3 py-1.5 rounded-2xl bg-slate-800/90 hover:bg-amber-400 hover:text-slate-950 border border-white/5 transition-all text-xs space-y-0.5 shadow-sm active:scale-95"
                        >
                          <span className="font-bold block text-white group-hover:text-slate-950">
                            {sug.english}
                          </span>
                          <span className="text-[10px] block text-slate-400 group-hover:text-slate-800 italic">
                            {sug.uzbek}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* AI Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/60 border border-white/5 w-fit">
              <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-200" />
              </div>
              <span className="text-xs text-slate-400 ml-1">AI yozmoqda...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Controls Bar */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/90 shrink-0 space-y-2">
          {/* Live Recording Pulse Banner */}
          {isRecording && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold">Ovozingiz tinglanmoqda... (Gapiring)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-white">
                  00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                </span>
                <button
                  onClick={stopRecording}
                  className="px-2.5 py-1 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs"
                >
                  To'xtatish
                </button>
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserSend(inputText);
            }}
            className="flex items-center gap-2"
          >
            {/* Speak / Mic Button */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-2xl transition-all shadow-md shrink-0 ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 border border-white/10'
              }`}
              title={isRecording ? "To'xtatish" : "Ovoz bilan gapirish (Speak)"}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your answer in English... (Yoki mikrofondan foydalaning)"
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/80 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. PREVIOUS SESSIONS HISTORY */}
      {/* ======================================================== */}
      {buddyState.sessions && buddyState.sessions.length > 0 && (
        <div className="rounded-3xl bg-slate-900/60 border border-white/5 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Mening suhbatlar tarixim (My Speaking Practice)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Jami: {buddyState.sessions.length} ta suhbat
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {buddyState.sessions.slice(0, 6).map((sess) => (
              <div
                key={sess.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate mr-2">{sess.topicTitle}</span>
                  <span className="text-amber-400 font-extrabold flex items-center gap-0.5 shrink-0">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{sess.score}%</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{Math.round(sess.durationSeconds / 60)} min</span>
                  </span>
                  <span>{sess.questionsAnswered} ta savol</span>
                  <span>{new Date(sess.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. SESSION RESULTS MODAL */}
      {/* ======================================================== */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0e1628] border border-white/10 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto text-3xl shadow-lg">
              🎉
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Great job! 🎉
              </h3>
              <p className="text-sm text-amber-300/90 font-medium">
                Juda yaxshi natija! Bugungi suhbat yakunlandi.
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-slate-900/90 border border-white/5 text-center">
              <div>
                <div className="text-xs text-slate-400">Vaqt</div>
                <div className="text-base font-black text-white mt-0.5">
                  {Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000))} min
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Savollar</div>
                <div className="text-base font-black text-emerald-400 mt-0.5">
                  {questionsAnswered} ta
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Natija</div>
                <div className="text-base font-black text-amber-400 mt-0.5">
                  {finalSessionScore}%
                </div>
              </div>
            </div>

            {/* Discovered Words */}
            {discoveredWords.length > 0 && (
              <div className="space-y-2 text-left">
                <span className="text-xs font-bold text-slate-400 block">
                  O'rganilgan so'zlar:
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                  {discoveredWords.map((w) => {
                    const isSaved = addedWordKeys.has(w.word.toLowerCase());
                    return (
                      <div
                        key={w.word}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5 text-xs"
                      >
                        <div>
                          <span className="font-bold text-white mr-1.5">{w.word}</span>
                          <span className="text-slate-400 italic">→ {w.translation}</span>
                        </div>
                        <button
                          onClick={() => handleAddWordToVocabulary(w)}
                          disabled={isSaved}
                          className={`p-1.5 rounded-lg text-xs font-bold ${
                            isSaved
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                          }`}
                        >
                          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setShowResultModal(false);
                handleStartSession();
              }}
              className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-colors shadow-lg shadow-amber-400/20"
            >
              Yana suhbatlashish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
