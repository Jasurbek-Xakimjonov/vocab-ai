import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { NavTab } from '../components/Sidebar';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  translationUz?: string;
  timestamp: string;
  correction?: {
    original: string;
    corrected: string;
    explanationUz: string;
  };
  suggestions?: string[];
}

interface AIChatProps {
  onNavigate?: (tab: NavTab) => void;
}

const STARTER_PROMPTS = [
  {
    title: 'Daily Greeting',
    titleUz: 'Salomlashish',
    prompt: 'Hello! I want to practice basic English today.',
  },
  {
    title: 'Grammar Question',
    titleUz: 'Grammatika savoli',
    prompt: 'What is the difference between "went" and "have been"?',
  },
  {
    title: 'Travel English',
    titleUz: 'Sayohat iboralari',
    prompt: 'What are the 5 most important English phrases for traveling at an airport?',
  },
  {
    title: 'Beginner Practice',
    titleUz: "Boshlang'ich muloqot",
    prompt: 'Can you ask me 3 easy questions in English to practice?',
  },
];

export const AIChat: React.FC<AIChatProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('vocabai_ai_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'msg_welcome',
        sender: 'ai',
        text: "Hello! 👋 I am your VocabAI Text Assistant. You can ask me anything about English grammar, vocabulary, or chat with me in English! How can I help you today?",
        translationUz: "Salom! 👋 Men sizning VocabAI matnli AI yordamchingizman. Menga ingliz tili grammatikasi, so'zlar haqida savol berishingiz yoki inglizcha yozishib mashq qilishingiz mumkin!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'How are you today?',
          'Teach me 3 new words.',
          'Check my grammar in a sentence.',
        ],
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Persist chat history per user
  useEffect(() => {
    try {
      localStorage.setItem('vocabai_ai_chat_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const content = (textToSend || input).trim();
    if (!content || isLoading) return;

    setInput('');

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/speaking-buddy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          message: content,
          history: nextMessages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          userName: user?.email ? user.email.split('@')[0] : '',
          category: 'chat',
          topicTitle: 'General English AI Text Chat',
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const data = json.data;

        const aiMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: data?.englishText || "That's very interesting! Tell me more about that.",
          translationUz: data?.uzbekText || "Bu juda qiziq! Bu haqida ko'proq aytib bering.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          correction: data?.gentleCorrection
            ? {
                original: data.gentleCorrection.original,
                corrected: data.gentleCorrection.corrected,
                explanationUz: data.gentleCorrection.explanationUz,
              }
            : undefined,
          suggestions: data?.suggestions?.map((s: any) => s.english || s) || [],
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Fallback response if endpoint unavailable
        const aiFallback: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: `Thank you for your message! You wrote: "${content}". How would you like to continue our practice?`,
          translationUz: `Xabaringiz uchun rahmat! Mashg'ulotimizni qanday davom ettirmoqchisiz?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiFallback]);
      }
    } catch (err) {
      console.warn('AI Chat request note:', err);
      const aiFallback: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: `Got it! Let's continue practicing English together. What topic would you like to explore next?`,
        translationUz: `Tushundim! Keling, birga ingliz tilini mashq qilishni davom ettiramiz. Keyingi mavzu nima bo'lsin?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiFallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const welcome: ChatMessage = {
      id: `msg_welcome_${Date.now()}`,
      sender: 'ai',
      text: "Chat cleared! What English topic or question shall we work on now? ✍️",
      translationUz: "Suhbat tozalandi! Endi qaysi ingliz tili mavzusini birga ko'rib chiqamiz?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcome]);
    toast.info("Chat tarixi tozalandi.");
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
    toast.success("Matn nusxalandi! 📋");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-10">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0c1427] via-[#101b33] to-[#16274a] border border-white/10 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-extrabold text-xs">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Chat — Text Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>💬 AI English Chat Tutor</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Ingliz tilida yozing, savollaringizni bering va grammatika bo'yicha tushuntirishlar oling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('ai-speaking')}
              className="px-3.5 py-2 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>🎙️ Ovozli Speaking'ga o'tish</span>
            </button>
          )}

          <button
            onClick={handleClearHistory}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/5 transition-colors"
            title="Suhbatni tozalash"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Starter Prompts */}
      {messages.length <= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STARTER_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.prompt)}
              className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/5 hover:border-amber-400/30 text-left transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300">{p.title}</span>
                <span className="text-[11px] text-slate-500">{p.titleUz}</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1 group-hover:text-white">
                "{p.prompt}"
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Main Chat Box */}
      <div className="rounded-3xl bg-[#090d16] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[560px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-1.5 max-w-2xl ${
                  isAi ? 'mr-auto' : 'ml-auto'
                }`}
              >
                {/* Label */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1">
                  {isAi ? (
                    <>
                      <Bot className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-semibold text-slate-300">AI Tutor</span>
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

                {/* Bubble */}
                <div
                  className={`rounded-3xl p-4 sm:p-5 shadow-lg space-y-2 border ${
                    isAi
                      ? 'bg-slate-900/95 border-white/10 text-white rounded-tl-sm'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700 border-emerald-500/30 text-white rounded-tr-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm sm:text-base font-medium leading-relaxed">
                      {msg.text}
                    </p>

                    {isAi && (
                      <button
                        onClick={() => copyText(msg.text, msg.id)}
                        className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Nusxalash"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Uzbek Translation underneath for AI responses */}
                  {isAi && msg.translationUz && (
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-xs sm:text-sm text-amber-300/90 italic font-medium leading-relaxed">
                        {msg.translationUz}
                      </p>
                    </div>
                  )}

                  {/* Grammar Correction Notice if any */}
                  {msg.correction && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Kichik grammatik maslahat:</span>
                      </div>
                      <p className="text-xs text-white font-medium">
                        "{msg.correction.corrected}"
                      </p>
                      <p className="text-[11px] text-slate-400 italic">
                        {msg.correction.explanationUz}
                      </p>
                    </div>
                  )}

                  {/* Quick Suggestions */}
                  {isAi && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(sug)}
                          className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 text-xs font-semibold transition-all border border-white/5 active:scale-95"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/60 border border-white/5 w-fit">
              <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-200" />
              </div>
              <span className="text-xs text-slate-400 ml-1">AI javob yozmoqda...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Text Input Bar (TEXT ONLY) */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/90 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message in English... (Masalan: What does 'diligent' mean?)"
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/80 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shrink-0 flex items-center justify-center"
              title="Yuborish"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
