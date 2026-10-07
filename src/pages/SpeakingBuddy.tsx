import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Flame,
  Award,
  RotateCcw,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Clock,
  Bot,
  User,
  Star,
  Lock,
  ShieldCheck,
  MessageSquare,
  VolumeX,
  AlertCircle,
} from 'lucide-react';
import {
  SpeakingBuddyLevel,
  BuddyMessage,
  BuddyTopic,
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
import { speakWord, speakWithCallbacks, stopSpeaking } from '../utils/speech';
import { Storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { UpgradeProModal } from '../components/UpgradeProModal';
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
  const { user, profile, isPro, speakingUsage, updateSpeakingUsageState } = useAuth();

  // PRO upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeHighlight, setUpgradeHighlight] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'roleplay'>('all');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | 'all'>('all');

  // User state & streak from Storage
  const [buddyState, setBuddyState] = useState<SpeakingBuddyUserState>(() =>
    Storage.getSpeakingBuddyState()
  );

  const [activeTopic, setActiveTopic] = useState<BuddyTopic>(BUDDY_TOPICS[0]);
  const [messages, setMessages] = useState<BuddyMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Continuous Hands-Free Conversation States:
  // idle -> listening -> thinking (processing) -> speaking -> listening ...
  const [isContinuousActive, setIsContinuousActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [lastUserTranscript, setLastUserTranscript] = useState('');

  // Stable references for event listeners without stale closures
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<any>(null);
  const autoRestartTimeoutRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const isContinuousActiveRef = useRef(false);
  const isAiSpeakingRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isRecordingRef = useRef(false);

  // Sync state refs
  const messagesRef = useRef<BuddyMessage[]>([]);
  const contextRef = useRef<EngineContext>({
    topicId: BUDDY_TOPICS[0].id,
    turnCount: 0,
    userName: profile?.name || (user as any)?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : ''),
  });
  const buddyStateRef = useRef<SpeakingBuddyUserState>(Storage.getSpeakingBuddyState());
  const activeTopicRef = useRef<BuddyTopic>(BUDDY_TOPICS[0]);

  // Session stats tracking
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [discoveredWords, setDiscoveredWords] = useState<BuddyVocabItem[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [finalSessionScore, setFinalSessionScore] = useState(85);

  // Context for continuous conversation
  const [context, setContext] = useState<EngineContext>({
    topicId: BUDDY_TOPICS[0].id,
    turnCount: 0,
    userName: profile?.name || (user as any)?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : ''),
  });

  // Keep refs in sync with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  useEffect(() => {
    activeTopicRef.current = activeTopic;
  }, [activeTopic]);

  useEffect(() => {
    buddyStateRef.current = buddyState;
  }, [buddyState]);

  // Sync state on updates
  useEffect(() => {
    const handleUpdate = () => {
      const updated = Storage.getSpeakingBuddyState();
      setBuddyState(updated);
      buddyStateRef.current = updated;
    };
    window.addEventListener('vocabai_speaking_buddy_updated', handleUpdate);
    return () => {
      window.removeEventListener('vocabai_speaking_buddy_updated', handleUpdate);
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isAiSpeaking]);

  // Safely stop listening
  const stopListening = (abort = false) => {
    if (autoRestartTimeoutRef.current) {
      clearTimeout(autoRestartTimeoutRef.current);
      autoRestartTimeoutRef.current = null;
    }
    setIsRecording(false);
    isRecordingRef.current = false;
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    try {
      if (abort) {
        recognitionRef.current?.abort();
      } else {
        recognitionRef.current?.stop();
      }
    } catch {}
  };

  // Safely start listening
  const startListening = () => {
    if (isAiSpeakingRef.current || isLoadingRef.current) return;
    if (!speechSupported) return;

    if (autoRestartTimeoutRef.current) {
      clearTimeout(autoRestartTimeoutRef.current);
      autoRestartTimeoutRef.current = null;
    }

    try {
      if (isRecordingRef.current) {
        return; // Already listening
      }
      recognitionRef.current?.start();
    } catch (e) {
      try {
        recognitionRef.current?.abort();
        setTimeout(() => {
          if (isContinuousActiveRef.current && !isAiSpeakingRef.current && !isLoadingRef.current) {
            try {
              recognitionRef.current?.start();
            } catch {}
          }
        }, 150);
      } catch {}
    }
  };

  // Stop continuous session completely
  const stopContinuousSession = () => {
    setIsContinuousActive(false);
    isContinuousActiveRef.current = false;
    stopSpeaking();
    setIsAiSpeaking(false);
    isAiSpeakingRef.current = false;
    stopListening(true);
  };

  // Speak AI text out loud with echo prevention and auto-resume loop
  const playAiVoice = (text: string, onDone?: () => void) => {
    // Prevent mic from recording speaker sound
    stopListening(true);
    stopSpeaking();
    setIsAiSpeaking(true);
    isAiSpeakingRef.current = true;

    speakWithCallbacks(text, {
      rate: 0.9,
      onStart: () => {
        setIsAiSpeaking(true);
        isAiSpeakingRef.current = true;
      },
      onEnd: () => {
        setIsAiSpeaking(false);
        isAiSpeakingRef.current = false;
        if (onDone) onDone();

        // AUTOMATIC CYCLE: when AI finishes speaking, immediately resume listening!
        if (isContinuousActiveRef.current && !isLoadingRef.current) {
          autoRestartTimeoutRef.current = setTimeout(() => {
            if (isContinuousActiveRef.current && !isAiSpeakingRef.current && !isLoadingRef.current) {
              startListening();
            }
          }, 350);
        }
      },
      onError: () => {
        setIsAiSpeaking(false);
        isAiSpeakingRef.current = false;
        if (onDone) onDone();

        if (isContinuousActiveRef.current && !isLoadingRef.current) {
          autoRestartTimeoutRef.current = setTimeout(() => {
            if (isContinuousActiveRef.current && !isAiSpeakingRef.current && !isLoadingRef.current) {
              startListening();
            }
          }, 350);
        }
      },
    });
  };

  // Process user voice input
  const handleVoiceInput = async (spokenText: string) => {
    const clean = spokenText.trim();
    if (!clean || isLoadingRef.current) return;

    // Check if free user is out of speaking limit
    if (!isPro && speakingUsage && !speakingUsage.canSpeak) {
      stopContinuousSession();
      toast.error(`Kunlik bepul ${speakingUsage.limitMinutes} daqiqalik suhbat limitingiz tugadi.`);
      setUpgradeHighlight("Kunlik 10 daqiqalik cheklov tugadi");
      setShowUpgradeModal(true);
      return;
    }

    // Switch to Thinking state
    setIsLoading(true);
    isLoadingRef.current = true;

    const userMsg: BuddyMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      englishText: clean,
      uzbekText: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messagesRef.current, userMsg];
    setMessages(newMessages);
    messagesRef.current = newMessages;
    setQuestionsAnswered((prev) => prev + 1);

    // Call server endpoint with full session history (up to last 20 messages)
    let aiResponseMsg: BuddyMessage | null = null;
    let nextCtx = { ...contextRef.current, turnCount: contextRef.current.turnCount + 1 };

    try {
      const res = await fetch('/api/speaking-buddy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          message: clean,
          history: newMessages.slice(-20),
          level: buddyStateRef.current.currentLevel,
          userName: contextRef.current.userName,
          category: activeTopicRef.current.category || 'basic',
          characterRole: activeTopicRef.current.characterRole || '',
          topicTitle: activeTopicRef.current.title,
        }),
      });

      if (res.status === 403) {
        const errJson = await res.json();
        setIsLoading(false);
        isLoadingRef.current = false;
        stopContinuousSession();
        if (errJson.limitReached) {
          toast.error(errJson.error);
          setUpgradeHighlight("Kunlik 10 daqiqalik cheklov tugadi");
          setShowUpgradeModal(true);
          return;
        }
        toast.error(errJson.error || "Muloqot cheklangan.");
        return;
      }

      if (res.ok) {
        const json = await res.json();
        if (json.usage) {
          updateSpeakingUsageState(json.usage);
        }
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
      console.warn('Server voice analysis note, using smart local engine:', e);
    }

    // Fallback to local intelligent conversation engine if needed
    if (!aiResponseMsg) {
      const result = generateBuddyResponse(clean, newMessages, contextRef.current);
      aiResponseMsg = result.message;
      nextCtx = result.updatedContext;
    }

    setContext(nextCtx);
    contextRef.current = nextCtx;
    setIsLoading(false);
    isLoadingRef.current = false;

    const updatedWithAi = [...newMessages, aiResponseMsg];
    setMessages(updatedWithAi);
    messagesRef.current = updatedWithAi;

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

    // Voice response composition:
    let spokenOutput = aiResponseMsg.englishText;
    const corr = aiResponseMsg.gentleCorrection;
    if (corr && corr.corrected && corr.corrected.toLowerCase().trim() !== clean.toLowerCase()) {
      spokenOutput = `${corr.motivation || 'Almost correct!'} You should say: ${corr.corrected}. Now please repeat: ${corr.corrected}`;
    }

    // AI speaks, and upon completion automatically resumes listening!
    playAiVoice(spokenOutput);
  };

  // Speech Recognition Setup (stable on mount)
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
        isRecordingRef.current = true;
        setMicPermissionDenied(false);
        setRecordingSeconds(0);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      };

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          setLastUserTranscript(transcript.trim());
          stopListening(false);
          handleVoiceInput(transcript.trim());
        }
      };

      recognizer.onerror = (event: any) => {
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          stopContinuousSession();
          setMicPermissionDenied(true);
          toast.error("Microphone permission is required for AI Speaking.");
          return;
        }

        if (event.error === 'no-speech') {
          // Handled gently, onend will trigger auto-restart if continuous is active
          return;
        }

        if (event.error === 'aborted') {
          // Intentional stop
          return;
        }

        console.warn('Speech recognition notice:', event.error);
      };

      recognizer.onend = () => {
        setIsRecording(false);
        isRecordingRef.current = false;
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        // If continuous session is active and not thinking or AI speaking, auto-resume listening!
        if (isContinuousActiveRef.current && !isAiSpeakingRef.current && !isLoadingRef.current) {
          autoRestartTimeoutRef.current = setTimeout(() => {
            if (isContinuousActiveRef.current && !isAiSpeakingRef.current && !isLoadingRef.current) {
              startListening();
            }
          }, 250);
        }
      };

      recognitionRef.current = recognizer;
    } catch {
      setSpeechSupported(false);
    }

    return () => {
      stopContinuousSession();
    };
  }, []);

  // Start continuous conversation session
  const startContinuousSession = () => {
    if (!speechSupported) {
      toast.error("Ushbu brauzerda ovoz tanish qo'llab-quvvatlanmaydi. Chrome yoki Edge brauzeridan foydalaning.");
      return;
    }

    setIsContinuousActive(true);
    isContinuousActiveRef.current = true;
    setIsSessionActive(true);

    // If session hasn't been initialized with greetings, start topic session
    if (messages.length === 0) {
      handleStartSession(activeTopic);
      return;
    }

    // If AI is currently speaking, do not interrupt; it will auto-listen on end
    if (isAiSpeakingRef.current) return;
    if (isLoadingRef.current) return;

    startListening();
  };

  // Toggle continuous conversation on big microphone button
  const handleToggleContinuousVoice = () => {
    if (isContinuousActive) {
      // Second click = END conversation
      stopContinuousSession();
    } else {
      // First click = START continuous conversation
      startContinuousSession();
    }
  };

  // Start / Restart Session
  const handleStartSession = (topic?: BuddyTopic) => {
    stopSpeaking();
    stopListening(true);
    const chosenTopic = topic || activeTopic;
    setActiveTopic(chosenTopic);
    activeTopicRef.current = chosenTopic;
    setIsSessionActive(true);
    setSessionStartTime(Date.now());
    setQuestionsAnswered(0);
    setDiscoveredWords([]);
    setLastUserTranscript('');

    const initialMsg: BuddyMessage = {
      id: `msg_init_${Date.now()}`,
      sender: 'ai',
      englishText: chosenTopic.initialMessage.english,
      uzbekText: chosenTopic.initialMessage.uzbek,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: chosenTopic.sampleSuggestions,
    };

    setMessages([initialMsg]);
    messagesRef.current = [initialMsg];

    const newCtx: EngineContext = {
      topicId: chosenTopic.id,
      turnCount: 0,
      userName: profile?.name || (user as any)?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : ''),
    };
    setContext(newCtx);
    contextRef.current = newCtx;

    // Enable continuous conversation loop
    setIsContinuousActive(true);
    isContinuousActiveRef.current = true;

    // Voice speaking starts automatically, and upon completion automatically starts listening!
    playAiVoice(chosenTopic.initialMessage.english);
  };

  // Safe topic selector with PRO permission gate
  const handleSelectTopic = (topic: BuddyTopic) => {
    if ((topic.isPro || topic.category === 'roleplay') && !isPro) {
      setUpgradeHighlight(`🎭 ${topic.title} (PRO Rolli suhbat)`);
      setShowUpgradeModal(true);
      return;
    }
    if (topic.level > 0 && !isPro) {
      setUpgradeHighlight(`🌱 Level ${topic.level} suhbatlari`);
      setShowUpgradeModal(true);
      return;
    }
    handleStartSession(topic);
  };

  // Safety net: Explain simply with AI voice
  const handleExplainSimply = () => {
    const lastAiMsg = [...messages].reverse().find((m) => m.sender === 'ai');
    if (!lastAiMsg) return;

    const expMsg = generateSimpleExplanation(lastAiMsg);
    setMessages((prev) => [...prev, expMsg]);
    playAiVoice(expMsg.englishText);
    toast.info("Oddiy tushuntirish berildi.");
  };

  // Finish session and store results
  const handleFinishSession = () => {
    stopContinuousSession();
    const duration = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
    const score = Math.min(100, Math.max(65, 70 + questionsAnswered * 4));
    setFinalSessionScore(score);

    // Save session in Storage with user id
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

  const currentLevelObj =
    BUDDY_LEVELS.find((l) => l.level === buddyState.currentLevel) || BUDDY_LEVELS[0];

  // Latest AI message
  const lastAiMessage = [...messages].reverse().find((m) => m.sender === 'ai');

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* ======================================================== */}
      {/* 1. HERO HEADER: MINIMAL & PROFESSIONAL */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0c1427] via-[#101b33] to-[#16274a] border border-white/10 p-6 sm:p-7 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-xs border border-amber-400/30 flex items-center gap-1.5 shadow-sm">
              <span>{currentLevelObj.badge}</span>
              <span>{currentLevelObj.name}</span>
            </span>

            {isPro ? (
              <span className="px-3 py-1 rounded-full bg-amber-400/25 text-amber-300 font-extrabold text-xs border border-amber-400/40 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                <span>💎 PRO — Cheksiz muloqot</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-extrabold text-xs border border-white/10 flex items-center gap-1 shadow-sm">
                <span>🌱 FREE — {speakingUsage ? `${speakingUsage.remainingMinutes} daqiqa` : '10 min'}</span>
              </span>
            )}

            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-extrabold text-xs border border-orange-500/30 flex items-center gap-1 shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              <span>{buddyState.currentStreak} day streak</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>🗣️ AI Speaking Buddy</span>
          </h1>

          <p className="text-sm text-slate-300 font-medium">
            "Let's practice English together with real voice."
          </p>
          <p className="text-xs text-slate-400">
            Faqat ovozli muloqot: siz gapirasiz, AI eshitadi va ovoz bilan javob beradi.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          {onNavigate && (
            <button
              onClick={() => onNavigate('ai-chat')}
              className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Matnli AI Chat 💬</span>
            </button>
          )}

          <button
            onClick={() => handleStartSession(activeTopic)}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 transition-colors"
            title="Qaytadan boshlash"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isSessionActive && (
            <button
              onClick={handleFinishSession}
              className="px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
            >
              Yakunlash & Natija
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TOPICS CHIPS BAR (LEVEL 0 TO ADVANCED ROLEPLAY) */}
      {/* ======================================================== */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500">Mavzular:</span>
          <span className="text-amber-300 font-medium">Mavzu: {activeTopic.title}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {BUDDY_TOPICS.map((topic) => {
            const isSelected = activeTopic.id === topic.id;
            const isLocked = (topic.isPro || topic.level > 0) && !isPro;

            return (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 border relative ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20'
                    : 'bg-slate-900/80 text-slate-300 border-white/5 hover:border-white/20 hover:bg-slate-800'
                }`}
              >
                <span>{topic.icon}</span>
                <span className="font-semibold">{topic.title}</span>
                {topic.category === 'roleplay' && (
                  <span className="text-[9px] uppercase px-1 rounded bg-amber-400/20 text-amber-300">
                    Roleplay
                  </span>
                )}
                {isLocked && <Lock className="w-3 h-3 text-amber-400 ml-0.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MAIN PURE-VOICE STAGE (NO TEXT INPUT, NO SEND BUTTON) */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-[#090d16] border border-white/10 shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        {/* Microphone Permission Notice if denied */}
        {micPermissionDenied && (
          <div className="w-full p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center justify-center gap-2 animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Microphone permission is required for AI Speaking. Iltimos brauzer sozlamalarida mikrofonni yoqing.</span>
          </div>
        )}

        {/* Voice Stage Header */}
        <div className="space-y-1 relative z-10">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            AI Speaking Buddy
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            "Let's practice English together."
          </p>
        </div>

        {/* BIG CENTRAL MICROPHONE BUTTON (VOICE STATES) */}
        <div className="relative flex items-center justify-center my-3">
          {/* Animated Glow Aura */}
          <div
            className={`absolute rounded-full transition-all duration-700 pointer-events-none ${
              isRecording
                ? 'w-48 h-48 bg-red-500/30 blur-2xl animate-ping'
                : isAiSpeaking
                ? 'w-48 h-48 bg-emerald-400/30 blur-2xl animate-pulse'
                : isLoading
                ? 'w-44 h-44 bg-amber-400/25 blur-2xl animate-pulse'
                : 'w-40 h-40 bg-amber-400/10 blur-xl'
            }`}
          />

          {/* Interactive Microphone Orb */}
          <button
            type="button"
            onClick={handleToggleContinuousVoice}
            className={`relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 select-none ${
              isRecording
                ? 'bg-gradient-to-tr from-red-600 to-rose-500 text-white ring-8 ring-red-500/30 shadow-red-500/50 scale-105 animate-pulse'
                : isAiSpeaking
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 ring-8 ring-emerald-500/30 shadow-emerald-500/50 scale-105'
                : isLoading
                ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 ring-8 ring-amber-400/20 shadow-amber-400/40'
                : 'bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 text-slate-950 ring-8 ring-amber-400/20 hover:scale-105 shadow-amber-400/30 hover:brightness-110'
            }`}
            title={
              isRecording
                ? "Listening... Tap to stop"
                : isAiSpeaking
                ? "AI is speaking... Tap to pause"
                : isContinuousActive
                ? "Continuous voice active. Tap to stop"
                : "Tap to Speak (Start Continuous Conversation)"
            }
          >
            {isRecording ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full bg-white animate-ping mb-1" />
                <span className="text-xs font-black uppercase tracking-wider">Listening</span>
                <span className="font-mono text-xs font-bold mt-0.5">
                  00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                </span>
                <span className="text-[10px] text-white/80 font-medium">Tap to stop</span>
              </>
            ) : isAiSpeaking ? (
              <>
                <Volume2 className="w-9 h-9 animate-bounce mb-1" />
                <span className="text-xs font-black uppercase tracking-wider">AI Speaking</span>
                <span className="text-[10px] text-slate-900/80 font-medium">Tap to stop</span>
              </>
            ) : isLoading ? (
              <>
                <Sparkles className="w-9 h-9 animate-spin mb-1" />
                <span className="text-xs font-black uppercase tracking-wider">Thinking</span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 mb-1" />
                <span className="text-xs font-black uppercase tracking-wider">Tap to Speak</span>
              </>
            )}
          </button>
        </div>

        {/* DYNAMIC STATUS BADGE */}
        <div className="relative z-10 space-y-1">
          {isRecording ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>🔴 Listening...</span>
            </div>
          ) : isAiSpeaking ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
              <Volume2 className="w-3.5 h-3.5" />
              <span>🔊 AI is speaking...</span>
            </div>
          ) : isLoading ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>⏳ Thinking...</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-300 text-xs font-semibold">
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              <span>Ready to listen</span>
            </div>
          )}
        </div>

        {/* Continuous Session Action Controls */}
        <div className="flex items-center gap-2.5 relative z-10 pt-1">
          {isContinuousActive ? (
            <button
              type="button"
              onClick={stopContinuousSession}
              className="px-4 py-2 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <MicOff className="w-4 h-4 text-rose-400" />
              <span>Suhbatni to'xtatish (Stop)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startContinuousSession}
              className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Mic className="w-4 h-4 text-slate-950" />
              <span>Suhbatni boshlash (Start)</span>
            </button>
          )}
        </div>

        {/* QUICK VOICE ACTIONS */}
        <div className="flex items-center gap-2 relative z-10 pt-1">
          {lastAiMessage && (
            <button
              onClick={() => playAiVoice(lastAiMessage.englishText)}
              disabled={isAiSpeaking || isRecording}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Ovozni qayta eshitish</span>
            </button>
          )}

          <button
            onClick={handleExplainSimply}
            disabled={isAiSpeaking || isRecording}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-white/5 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Oddiy tushuntir</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. READ-ONLY AUXILIARY TRANSCRIPT CARD (NO EDITING, NO INPUT) */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              📝 Yordamchi Transcript:
            </span>
          </div>

          <span className="text-xs text-slate-500">
            Faqat ma'lumot uchun (Asosiy muloqot ovozda)
          </span>
        </div>

        {/* Live Conversation Transcript Stream */}
        <div className="space-y-4 max-h-72 overflow-y-auto no-scrollbar pr-1">
          {messages.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-4">
              Suhbat hali boshlanmadi. Yuqoridagi mikrofonni bosing va gapiring.
            </p>
          ) : (
            messages.map((m) => {
              const isAi = m.sender === 'ai';

              return (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl border space-y-1.5 text-left ${
                    isAi
                      ? 'bg-slate-950/70 border-white/10 text-white'
                      : 'bg-emerald-950/30 border-emerald-500/20 text-emerald-100 ml-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold flex items-center gap-1">
                      {isAi ? (
                        <>
                          <Bot className="w-3 h-3 text-amber-400" />
                          <span>AI Speaking Buddy:</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 text-emerald-400" />
                          <span>You (Siz):</span>
                        </>
                      )}
                    </span>
                    <span>{m.timestamp}</span>
                  </div>

                  {/* Spoken Text */}
                  <p className="text-sm font-semibold leading-relaxed">
                    "{m.englishText}"
                  </p>

                  {/* Uzbek translation */}
                  {isAi && m.uzbekText && (
                    <p className="text-xs text-amber-300/90 italic font-medium">
                      {m.uzbekText}
                    </p>
                  )}

                  {/* Pedagogical Correction Box */}
                  {m.gentleCorrection && m.gentleCorrection.corrected && (
                    <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>{m.gentleCorrection.motivation || "Almost correct! You should say:"}</span>
                      </div>
                      <p className="font-bold text-white">
                        "{m.gentleCorrection.corrected}"
                      </p>
                      {m.gentleCorrection.explanationUz && (
                        <p className="text-slate-400 italic">
                          {m.gentleCorrection.explanationUz}
                        </p>
                      )}
                      <p className="text-emerald-300 font-semibold pt-0.5">
                        Now please repeat with voice: "{m.gentleCorrection.corrected}" 🎙️
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={transcriptEndRef} />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. RECENT SESSIONS HISTORY */}
      {/* ======================================================== */}
      {buddyState.sessions && buddyState.sessions.length > 0 && (
        <div className="rounded-3xl bg-slate-900/60 border border-white/5 p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-bold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Ovozli muloqotlar tarixi (History)</span>
            </h3>
            <span className="text-slate-400">{buddyState.sessions.length} ta mashq</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {buddyState.sessions.slice(0, 3).map((sess) => (
              <div
                key={sess.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1 text-xs"
              >
                <div className="font-bold text-white truncate">{sess.topicTitle}</div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>{Math.round(sess.durationSeconds / 60)} min</span>
                  <span className="text-amber-400 font-bold">{sess.score}%</span>
                  <span>{new Date(sess.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SESSION RESULTS MODAL */}
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
                Ovozli suhbat yakunlandi! Siz ingliz tilida erkin gapirdingiz.
              </p>
            </div>

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

            <button
              onClick={() => {
                setShowResultModal(false);
                handleStartSession();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-400/20"
            >
              Yana suhbatlashish 🎙️
            </button>
          </div>
        </div>
      )}

      {/* PRO Upgrade Modal */}
      <UpgradeProModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        highlightFeature={upgradeHighlight}
      />
    </div>
  );
};
