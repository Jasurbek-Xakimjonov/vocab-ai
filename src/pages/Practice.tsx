import React, { useState, useEffect, useMemo } from 'react';
import {
  Dumbbell,
  CheckCircle2,
  XCircle,
  Volume2,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  HelpCircle,
  Check,
  X,
  Zap,
  BookOpen,
  VolumeX,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';
import { VocabularyWord, PracticeMode } from '../types/vocabulary';
import { IrregularVerb } from '../types/irregularVerbs';
import { speakWord } from '../utils/speech';
import { Storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { NavTab } from '../components/Sidebar';
import {
  PAST_SIMPLE_SENTENCE_TEMPLATES,
  PAST_SIMPLE_NEGATIVE_QUESTIONS,
} from '../utils/pastSimpleExercises';

interface PracticeProps {
  words: VocabularyWord[];
  onRefreshWords: () => void;
  onNavigate: (tab: NavTab) => void;
}

interface Question {
  targetWord?: VocabularyWord;
  promptTitle?: string;
  promptText?: string;
  subPrompt?: string;
  options?: string[]; // for multiple choice
  correctOption?: string;
  acceptedAnswers?: string[]; // for typing (supports multiple forms like was/were)
  isTrueStatement?: boolean; // for true/false
  statementTranslation?: string; // for true/false
  verbDetails?: {
    v1: string;
    v2: string;
    v3: string;
    translation: string;
    pronunciation?: string;
  };
  grammarTip?: string;
  modeType?: 'mc' | 'typing' | 'tf' | 'audio';
  audioWord?: string;
}

export const Practice: React.FC<PracticeProps> = ({
  words,
  onRefreshWords,
  onNavigate,
}) => {
  const toast = useToast();

  const [selectedMode, setSelectedMode] = useState<PracticeMode>('past_simple_verbs');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'past_simple' | 'vocab'>('past_simple');
  const [questionCountChoice, setQuestionCountChoice] = useState<number>(10);

  // Session state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userSelectedAnswer, setUserSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Score state
  const [score, setScore] = useState(0);
  const [streakInSession, setStreakInSession] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Generate question deck based on mode
  const generateQuestions = (mode: PracticeMode, countLimit: number = questionCountChoice) => {
    const irregularVerbs = Storage.getIrregularVerbs();
    const allV2s = irregularVerbs.map((v) => v.v2);
    const allV3s = irregularVerbs.map((v) => v.v3);

    let generated: Question[] = [];

    if (mode === 'past_simple_verbs') {
      if (irregularVerbs.length < 4) {
        toast.error("Mashq uchun kamida 4 ta fe'l kerak.");
        return;
      }
      const shuffled = [...irregularVerbs].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, countLimit);
      generated = selected.map((target) => {
        const others = irregularVerbs
          .filter((v) => v.id !== target.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const options = [target.v2, ...others.map((o) => o.v2)].sort(() => 0.5 - Math.random());
        return {
          promptTitle: 'Past Simple (V2) shaklini tanlang',
          promptText: target.v1,
          subPrompt: target.translation,
          options,
          correctOption: target.v2,
          modeType: 'mc',
          verbDetails: {
            v1: target.v1,
            v2: target.v2,
            v3: target.v3,
            translation: target.translation,
            pronunciation: target.pronunciation,
          },
          grammarTip: `"${target.v1}" fe'lining Past Simple (o'tgan zamon) shakli: "${target.v2}".`,
        };
      });
    } else if (mode === 'past_simple_sentences') {
      const templates = [...PAST_SIMPLE_SENTENCE_TEMPLATES].sort(() => 0.5 - Math.random()).slice(0, countLimit);
      generated = templates.map((tmpl) => {
        const matchingVerb = irregularVerbs.find((v) => v.id === tmpl.verbId);
        const distractors = allV2s
          .filter((v) => v.toLowerCase() !== tmpl.correct.toLowerCase())
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const options = [tmpl.correct, ...distractors].sort(() => 0.5 - Math.random());
        return {
          promptTitle: "Gapdagi bo'sh joyni Past Simple (V2) shakli bilan to'ldiring",
          promptText: tmpl.sentence.replace('{gap}', '______'),
          subPrompt: tmpl.translationUz,
          options,
          correctOption: tmpl.correct,
          modeType: 'mc',
          verbDetails: matchingVerb
            ? {
                v1: matchingVerb.v1,
                v2: matchingVerb.v2,
                v3: matchingVerb.v3,
                translation: matchingVerb.translation,
                pronunciation: matchingVerb.pronunciation,
              }
            : undefined,
          grammarTip: `O'tgan zamon darak gapida fe'lning 2-shakli (V2: "${tmpl.correct}") ishlatiladi.`,
        };
      });
    } else if (mode === 'past_simple_typing') {
      // MODE: Type the V2 without multiple choice hints
      const shuffled = [...irregularVerbs].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, countLimit);
      generated = selected.map((target) => {
        // Build accepted list (e.g. was, were, was / were)
        const accepted = [target.v2.toLowerCase().trim()];
        if (target.v2.includes('/')) {
          target.v2.split('/').forEach((part) => accepted.push(part.trim().toLowerCase()));
        }
        return {
          promptTitle: 'Past Simple (V2) shaklini yozing (Spelling)',
          promptText: target.v1,
          subPrompt: `🇺🇿 ${target.translation}`,
          correctOption: target.v2,
          acceptedAnswers: accepted,
          modeType: 'typing',
          verbDetails: {
            v1: target.v1,
            v2: target.v2,
            v3: target.v3,
            translation: target.translation,
            pronunciation: target.pronunciation,
          },
          grammarTip: `"${target.v1}" fe'lining Past Simple shakli: "${target.v2}".`,
        };
      });
    } else if (mode === 'past_simple_negative_questions') {
      // MODE: didn't + V1 or Did + subject + V1
      const pool = [...PAST_SIMPLE_NEGATIVE_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, countLimit);
      generated = pool.map((item) => {
        // Generate believable distractors based on the question
        let distractors: string[] = [];
        if (item.correctAnswer.startsWith("didn't ")) {
          const verbBase = item.correctAnswer.replace("didn't ", '');
          const match = irregularVerbs.find((v) => v.v1.toLowerCase() === verbBase.toLowerCase());
          const pastV2 = match ? match.v2 : verbBase + 'ed';
          distractors = [`didn't ${pastV2}`, `not ${pastV2}`, `wasn't ${verbBase}`];
        } else if (item.correctAnswer.startsWith('Did ')) {
          const verbBase = item.correctAnswer.replace('Did ', '');
          const match = irregularVerbs.find((v) => v.v1.toLowerCase() === verbBase.toLowerCase());
          const pastV2 = match ? match.v2 : verbBase + 'ed';
          distractors = [`Did ${pastV2}`, `Were ${verbBase}`, `Have ${pastV2}`];
        } else {
          distractors = ['was not', 'did went', 'had been'];
        }

        const options = [item.correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

        return {
          promptTitle: "Past Simple: Inkor va So'roq qoidasi",
          promptText: item.prompt,
          subPrompt: "Diqqat: didn't yoki Did bo'lsa, asosiy fe'l qaysi shaklda keladi?",
          options,
          correctOption: item.correctAnswer,
          modeType: 'mc',
          grammarTip: item.ruleExplanationUz,
        };
      });
    } else if (mode === 'complete_three_forms') {
      // MODE: Complete 3 forms (V1 → V2 → V3)
      const shuffled = [...irregularVerbs].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, countLimit);
      generated = selected.map((target, idx) => {
        // Alternating missing slot: V3 missing or V2 missing
        const isV3Missing = idx % 2 === 0;
        let prompt = '';
        let correct = '';
        let options: string[] = [];

        if (isV3Missing) {
          prompt = `${target.v1}  →  ${target.v2}  →  ______`;
          correct = target.v3;
          const distractors = allV3s
            .filter((v) => v.toLowerCase() !== correct.toLowerCase())
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          options = [correct, ...distractors].sort(() => 0.5 - Math.random());
        } else {
          prompt = `${target.v1}  →  ______  →  ${target.v3}`;
          correct = target.v2;
          const distractors = allV2s
            .filter((v) => v.toLowerCase() !== correct.toLowerCase())
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          options = [correct, ...distractors].sort(() => 0.5 - Math.random());
        }

        return {
          promptTitle: "Noto'g'ri fe'lning 3 ta shaklini to'ldiring",
          promptText: prompt,
          subPrompt: `Ma'nosi: ${target.translation}`,
          options,
          correctOption: correct,
          modeType: 'mc',
          verbDetails: {
            v1: target.v1,
            v2: target.v2,
            v3: target.v3,
            translation: target.translation,
            pronunciation: target.pronunciation,
          },
          grammarTip: `To'liq shakllar: V1: ${target.v1} | V2: ${target.v2} | V3: ${target.v3}`,
        };
      });
    } else if (mode === 'past_simple_audio') {
      // MODE: Listen to V2 pronunciation and pick correct verb & meaning
      const shuffled = [...irregularVerbs].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, countLimit);
      generated = selected.map((target) => {
        const others = irregularVerbs
          .filter((v) => v.id !== target.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const correctText = `${target.v2} (${target.v1} — ${target.translation})`;
        const options = [
          correctText,
          ...others.map((o) => `${o.v2} (${o.v1} — ${o.translation})`),
        ].sort(() => 0.5 - Math.random());

        return {
          promptTitle: "Ovozni eshiting va to'g'ri Past Simple fe'lini toping",
          promptText: '🔊 Talaffuzni eshiting',
          subPrompt: "Past Simple shakli quloqqa qanday eshitilyapti?",
          options,
          correctOption: correctText,
          audioWord: target.v2,
          modeType: 'audio',
          verbDetails: {
            v1: target.v1,
            v2: target.v2,
            v3: target.v3,
            translation: target.translation,
            pronunciation: target.pronunciation,
          },
          grammarTip: `Tinglangan so'z: "${target.v2}" (V1: ${target.v1} — ${target.translation}).`,
        };
      });
    } else if (mode === 'past_simple_super_mix') {
      // MODE: Mega mix of all Past Simple exercise formats!
      const subModes: PracticeMode[] = [
        'past_simple_verbs',
        'past_simple_sentences',
        'past_simple_typing',
        'past_simple_negative_questions',
        'complete_three_forms',
        'past_simple_audio',
      ];
      const mixDeck: Question[] = [];
      const perModeCount = Math.max(2, Math.ceil(countLimit / subModes.length));

      subModes.forEach((sm) => {
        // generate a few questions for each
        const subList = generateSingleModeQuestions(sm, perModeCount, irregularVerbs);
        mixDeck.push(...subList);
      });

      const shuffledMix = mixDeck.sort(() => 0.5 - Math.random()).slice(0, countLimit);
      generated = shuffledMix;
    } else {
      // Standard vocabulary modes
      if (words.length < 4) {
        toast.error("Lug'at rejimlari uchun kamida 4 ta so'z kerak. Quyidagi Past Simple rejimlaridan foydalanishingiz mumkin!");
        return;
      }

      const shuffledWords = [...words].sort(() => 0.5 - Math.random());
      const count = Math.min(countLimit, words.length);
      const sessionItems = shuffledWords.slice(0, count);

      generated = sessionItems.map((target) => {
        const otherWords = words.filter((w) => w.id !== target.id);
        const distractors = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);

        if (mode === 'multiple_choice') {
          const options = [target.translation, ...distractors.map((d) => d.translation)].sort(
            () => 0.5 - Math.random()
          );
          return {
            targetWord: target,
            promptTitle: "To'g'ri tarjimani tanlang",
            promptText: target.word,
            subPrompt: "Inglizcha so'zning to'g'ri o'zbekcha ma'nosini tanlang",
            options,
            correctOption: target.translation,
            modeType: 'mc',
          };
        } else if (mode === 'uzbek_to_english') {
          const options = [target.word, ...distractors.map((d) => d.word)].sort(
            () => 0.5 - Math.random()
          );
          return {
            targetWord: target,
            promptTitle: "Inglizcha so'zni toping",
            promptText: target.translation,
            subPrompt: "O'zbekcha so'zning to'g'ri inglizcha tarjimasini tanlang",
            options,
            correctOption: target.word,
            modeType: 'mc',
          };
        } else if (mode === 'true_false') {
          const isTrue = Math.random() > 0.5;
          const shownTranslation = isTrue ? target.translation : distractors[0].translation;
          return {
            targetWord: target,
            promptTitle: 'Bu tarjima to‘g‘rimi?',
            promptText: target.word,
            subPrompt: `O'zbekcha tarjimasi: "${shownTranslation}"`,
            isTrueStatement: isTrue,
            statementTranslation: shownTranslation,
            modeType: 'tf',
          };
        } else if (mode === 'listening') {
          const options = [target.word, ...distractors.map((d) => d.word)].sort(
            () => 0.5 - Math.random()
          );
          return {
            targetWord: target,
            promptTitle: "Eshiting va to'g'ri so'zni tanlang",
            options,
            correctOption: target.word,
            audioWord: target.word,
            modeType: 'audio',
          };
        } else {
          // type_answer
          return {
            targetWord: target,
            promptTitle: "Inglizcha so'zni yozing (Spelling)",
            promptText: target.translation,
            subPrompt: "O'zbekcha so'zning to'g'ri inglizcha yozilishini kiriting",
            correctOption: target.word,
            acceptedAnswers: [target.word.toLowerCase().trim()],
            modeType: 'typing',
          };
        }
      });
    }

    if (generated.length === 0) {
      toast.error('Savollar yaratishda xatolik yuz berdi.');
      return;
    }

    setQuestions(generated);
    setCurrentIndex(0);
    setUserSelectedAnswer(null);
    setTypedAnswer('');
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setScore(0);
    setStreakInSession(0);
    setIsSessionFinished(false);
    setIsPlaying(true);

    // Auto-pronounce if first question is audio
    if (generated[0]?.audioWord) {
      setTimeout(() => {
        speakWord(generated[0].audioWord!);
      }, 350);
    }
  };

  // Helper for super mix
  const generateSingleModeQuestions = (
    mode: PracticeMode,
    limit: number,
    irregularVerbs: IrregularVerb[]
  ): Question[] => {
    const allV2s = irregularVerbs.map((v) => v.v2);
    const allV3s = irregularVerbs.map((v) => v.v3);

    if (mode === 'past_simple_verbs') {
      const selected = [...irregularVerbs].sort(() => 0.5 - Math.random()).slice(0, limit);
      return selected.map((target) => {
        const others = irregularVerbs
          .filter((v) => v.id !== target.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const options = [target.v2, ...others.map((o) => o.v2)].sort(() => 0.5 - Math.random());
        return {
          promptTitle: 'Past Simple (V2) shaklini tanlang',
          promptText: target.v1,
          subPrompt: target.translation,
          options,
          correctOption: target.v2,
          modeType: 'mc',
          verbDetails: {
            v1: target.v1,
            v2: target.v2,
            v3: target.v3,
            translation: target.translation,
            pronunciation: target.pronunciation,
          },
          grammarTip: `"${target.v1}" fe'lining Past Simple shakli: "${target.v2}".`,
        };
      });
    } else if (mode === 'past_simple_sentences') {
      const templates = [...PAST_SIMPLE_SENTENCE_TEMPLATES].sort(() => 0.5 - Math.random()).slice(0, limit);
      return templates.map((tmpl) => {
        const matchingVerb = irregularVerbs.find((v) => v.id === tmpl.verbId);
        const distractors = allV2s
          .filter((v) => v.toLowerCase() !== tmpl.correct.toLowerCase())
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const options = [tmpl.correct, ...distractors].sort(() => 0.5 - Math.random());
        return {
          promptTitle: "Gapdagi bo'sh joyni Past Simple (V2) shakli bilan to'ldiring",
          promptText: tmpl.sentence.replace('{gap}', '______'),
          subPrompt: tmpl.translationUz,
          options,
          correctOption: tmpl.correct,
          modeType: 'mc',
          verbDetails: matchingVerb
            ? {
                v1: matchingVerb.v1,
                v2: matchingVerb.v2,
                v3: matchingVerb.v3,
                translation: matchingVerb.translation,
                pronunciation: matchingVerb.pronunciation,
              }
            : undefined,
          grammarTip: `Gapda o'tgan zamon uchun: "${tmpl.correct}" (V2).`,
        };
      });
    } else if (mode === 'past_simple_typing') {
      const selected = [...irregularVerbs].sort(() => 0.5 - Math.random()).slice(0, limit);
      return selected.map((target) => {
        const accepted = [target.v2.toLowerCase().trim()];
        if (target.v2.includes('/')) {
          target.v2.split('/').forEach((part) => accepted.push(part.trim().toLowerCase()));
        }
        return {
          promptTitle: 'Past Simple (V2) shaklini yozing',
          promptText: target.v1,
          subPrompt: `🇺🇿 ${target.translation}`,
          correctOption: target.v2,
          acceptedAnswers: accepted,
          modeType: 'typing',
          verbDetails: {
            v1: target.v1,
            v2: target.v2,
            v3: target.v3,
            translation: target.translation,
            pronunciation: target.pronunciation,
          },
        };
      });
    } else if (mode === 'past_simple_negative_questions') {
      const pool = [...PAST_SIMPLE_NEGATIVE_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, limit);
      return pool.map((item) => {
        let distractors: string[] = [];
        if (item.correctAnswer.startsWith("didn't ")) {
          const verbBase = item.correctAnswer.replace("didn't ", '');
          const match = irregularVerbs.find((v) => v.v1.toLowerCase() === verbBase.toLowerCase());
          const pastV2 = match ? match.v2 : verbBase + 'ed';
          distractors = [`didn't ${pastV2}`, `not ${pastV2}`, `wasn't ${verbBase}`];
        } else {
          const verbBase = item.correctAnswer.replace('Did ', '');
          const match = irregularVerbs.find((v) => v.v1.toLowerCase() === verbBase.toLowerCase());
          const pastV2 = match ? match.v2 : verbBase + 'ed';
          distractors = [`Did ${pastV2}`, `Were ${verbBase}`, `Have ${pastV2}`];
        }
        const options = [item.correctAnswer, ...distractors].sort(() => 0.5 - Math.random());
        return {
          promptTitle: "Past Simple: Inkor va So'roq qoidasi",
          promptText: item.prompt,
          subPrompt: "Qoida: didn't yoki Did bilan asosiy fe'l V1 shaklda bo'ladi",
          options,
          correctOption: item.correctAnswer,
          modeType: 'mc',
          grammarTip: item.ruleExplanationUz,
        };
      });
    } else if (mode === 'complete_three_forms') {
      const selected = [...irregularVerbs].sort(() => 0.5 - Math.random()).slice(0, limit);
      return selected.map((target) => {
        const prompt = `${target.v1}  →  ${target.v2}  →  ______`;
        const correct = target.v3;
        const distractors = allV3s
          .filter((v) => v.toLowerCase() !== correct.toLowerCase())
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const options = [correct, ...distractors].sort(() => 0.5 - Math.random());
        return {
          promptTitle: "3-shakl (Past Participle V3)ni to'ldiring",
          promptText: prompt,
          subPrompt: `Ma'nosi: ${target.translation}`,
          options,
          correctOption: correct,
          modeType: 'mc',
          verbDetails: {
            v1: target.v1,
            v2: target.v2,
            v3: target.v3,
            translation: target.translation,
            pronunciation: target.pronunciation,
          },
        };
      });
    } else {
      // past_simple_audio
      const selected = [...irregularVerbs].sort(() => 0.5 - Math.random()).slice(0, limit);
      return selected.map((target) => {
        const others = irregularVerbs
          .filter((v) => v.id !== target.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const correctText = `${target.v2} (${target.v1} — ${target.translation})`;
        const options = [
          correctText,
          ...others.map((o) => `${o.v2} (${o.v1} — ${o.translation})`),
        ].sort(() => 0.5 - Math.random());
        return {
          promptTitle: "Ovozni eshiting va mos Past Simple fe'lini toping",
          promptText: '🔊 Talaffuzni eshiting',
          options,
          correctOption: correctText,
          audioWord: target.v2,
          modeType: 'audio',
          verbDetails: {
            v1: target.v1,
            v2: target.v2,
            v3: target.v3,
            translation: target.translation,
            pronunciation: target.pronunciation,
          },
        };
      });
    }
  };

  const currentQ = questions[currentIndex];

  // Auto pronounce in audio modes on step change
  useEffect(() => {
    if (isPlaying && currentQ?.audioWord) {
      speakWord(currentQ.audioWord);
    }
  }, [currentIndex, isPlaying]);

  // Handle Option Selection
  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted) return;

    setUserSelectedAnswer(option);
    setIsAnswerSubmitted(true);

    let correct = false;
    if (currentQ.modeType === 'tf') {
      const chosenBool = option === 'true';
      correct = chosenBool === currentQ.isTrueStatement;
    } else {
      correct = option.toLowerCase().trim() === currentQ.correctOption?.toLowerCase().trim();
    }

    setIsCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
      setStreakInSession((s) => s + 1);
      const wordToSpeak =
        currentQ.verbDetails?.v2 || currentQ.targetWord?.word || currentQ.correctOption;
      if (wordToSpeak) speakWord(wordToSpeak);
    } else {
      setStreakInSession(0);
    }
  };

  // Handle Typed Answer Submission
  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswerSubmitted || !typedAnswer.trim()) return;

    setIsAnswerSubmitted(true);
    const cleanTyped = typedAnswer.toLowerCase().trim();

    let correct = false;
    if (currentQ.acceptedAnswers && currentQ.acceptedAnswers.length > 0) {
      correct = currentQ.acceptedAnswers.some(
        (ans) => ans.toLowerCase().trim() === cleanTyped
      );
    } else {
      const cleanTarget = (currentQ.targetWord?.word || currentQ.correctOption || '')
        .toLowerCase()
        .trim();
      correct = cleanTyped === cleanTarget;
    }

    setIsCorrect(correct);

    if (currentQ.targetWord?.id) {
      Storage.saveSpellingResult(currentQ.targetWord.id, correct, cleanTyped);
    }

    if (correct) {
      setScore((s) => s + 1);
      setStreakInSession((s) => s + 1);
      const toSpeak = currentQ.verbDetails?.v2 || currentQ.correctOption || cleanTyped;
      speakWord(toSpeak);
    } else {
      setStreakInSession(0);
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setUserSelectedAnswer(null);
      setTypedAnswer('');
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
    } else {
      // Finish Session
      setIsSessionFinished(true);
      const total = questions.length;
      const finalScore = isCorrect ? score : score;
      const accuracy = Math.round((finalScore / total) * 100);

      Storage.savePracticeSession({
        mode: selectedMode,
        totalQuestions: total,
        correctAnswers: finalScore,
        accuracy,
      });
      onRefreshWords();
    }
  };

  // Keyboard shortcut listener for Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isAnswerSubmitted && !isSessionFinished) {
        handleNextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswerSubmitted, currentIndex, questions.length, isSessionFinished]);

  // Mode catalog with badges and categories
  const practiceModesCatalog = [
    // Past Simple & Irregular Verbs
    {
      id: 'past_simple_verbs' as PracticeMode,
      title: 'Past Simple: V1 → V2 Test',
      desc: 'Noto‘g‘ri fe‘llarning o‘tgan zamon (V2) shaklini variantlardan topish.',
      badge: 'V1 → V2',
      isPast: true,
      tag: 'Ommabop',
      color: 'from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-300',
    },
    {
      id: 'past_simple_sentences' as PracticeMode,
      title: 'Past Simple: Gaplarda ishlatish',
      desc: 'Haqiqiy kontekstli gaplarda bo‘sh o‘ringa to‘g‘ri Past Simple shaklini qo‘yish.',
      badge: 'Gaplar',
      isPast: true,
      tag: 'Kontekst',
      color: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-300',
    },
    {
      id: 'past_simple_typing' as PracticeMode,
      title: 'Past Simple: V2 ni Yozish (Spelling)',
      desc: 'Hech qanday variantlarsiz V2 shaklini klaviaturada to‘g‘ri yozing.',
      badge: 'Yozish',
      isPast: true,
      tag: 'Faol xotira',
      color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-300',
    },
    {
      id: 'past_simple_negative_questions' as PracticeMode,
      title: "Past Simple: Inkor va Savol (didn't / Did)",
      desc: "didn't + V1 va Did you + V1 qoidasini mustahkamlovchi maxsus grammatik test.",
      badge: "didn't / Did",
      isPast: true,
      tag: 'Grammatika',
      color: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-300',
    },
    {
      id: 'complete_three_forms' as PracticeMode,
      title: '3 ta shaklni to‘ldirish (V1 → V2 → V3)',
      desc: 'begin → began → ______ zanjiridagi yetishmayotgan shaklni to‘ldirish.',
      badge: '3 Shakl',
      isPast: true,
      tag: 'Zanjir',
      color: 'from-orange-500/20 to-orange-600/5 border-orange-500/30 text-orange-300',
    },
    {
      id: 'past_simple_audio' as PracticeMode,
      title: 'Past Simple: Audio Challenge',
      desc: 'O‘tgan zamon fe‘lining talaffuzini eshiting va to‘g‘ri fe‘lni aniqlang.',
      badge: 'Audio',
      isPast: true,
      tag: 'Eshitish',
      color: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30 text-cyan-300',
    },
    {
      id: 'past_simple_super_mix' as PracticeMode,
      title: 'Past Simple: Super Mega Mix',
      desc: 'Barcha Past Simple rejimlarini (gaplar, yozish, inkor, 3-shakl, audio) aralash tarzda sinash.',
      badge: 'Mega Mix',
      isPast: true,
      tag: 'Barchasi',
      color: 'from-rose-500/20 to-rose-600/5 border-rose-500/30 text-rose-300',
    },

    // Vocabulary Modes
    {
      id: 'multiple_choice' as PracticeMode,
      title: 'Lug‘at: Multiple Choice',
      desc: 'Inglizcha so‘z beriladi, 4 ta o‘zbekcha variantdan to‘g‘risini tanlang.',
      badge: 'Klassik',
      isPast: false,
      tag: 'Lug‘at',
      color: 'from-slate-800 to-slate-900 border-white/10 text-slate-300',
    },
    {
      id: 'uzbek_to_english' as PracticeMode,
      title: 'Lug‘at: Uzbek → English',
      desc: 'O‘zbekcha ma‘nosi beriladi, to‘g‘ri inglizcha so‘zni toping.',
      badge: 'Tarjima',
      isPast: false,
      tag: 'Lug‘at',
      color: 'from-slate-800 to-slate-900 border-white/10 text-slate-300',
    },
    {
      id: 'type_answer' as PracticeMode,
      title: 'Lug‘at: Type the Answer',
      desc: 'So‘zni klaviaturada yozing. To‘g‘ri yozilish (spelling) mashqi.',
      badge: 'Spelling',
      isPast: false,
      tag: 'Lug‘at',
      color: 'from-slate-800 to-slate-900 border-white/10 text-slate-300',
    },
    {
      id: 'true_false' as PracticeMode,
      title: 'Lug‘at: True / False',
      desc: 'So‘z va tarjima juftligi to‘g‘rimi yoki noto‘g‘ri? Tezkor test.',
      badge: 'Tezkor',
      isPast: false,
      tag: 'Lug‘at',
      color: 'from-slate-800 to-slate-900 border-white/10 text-slate-300',
    },
    {
      id: 'listening' as PracticeMode,
      title: 'Lug‘at: Listening Audio',
      desc: 'Talaffuzni eshiting va mos so‘zni toping.',
      badge: 'Audio',
      isPast: false,
      tag: 'Lug‘at',
      color: 'from-slate-800 to-slate-900 border-white/10 text-slate-300',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      {!isPlaying && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive English Practice Hub</span>
            </div>

            {/* Question count selector */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-white/10 p-1 rounded-xl text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-2" />
              <span className="text-slate-400 font-medium">Savollar soni:</span>
              {[10, 15, 20, 25].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCountChoice(cnt)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    questionCountChoice === cnt
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Past Simple & Lug‘at Mashqlari
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1.5 leading-relaxed">
              Noto‘g‘ri fe‘llar, Past Simple zamoni (darak, inkor, so‘roq gaplar) va so‘z boyligini
              interaktiv usulda mustahkamlang.
            </p>
          </div>
        </div>
      )}

      {/* Category filter tabs */}
      {!isPlaying && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {[
            { id: 'past_simple', label: '⚡ Past Simple & Fe‘llar (7 ta rejim)' },
            { id: 'all', label: 'Barcha rejimlar (12 ta)' },
            { id: 'vocab', label: '📚 Lug‘at rejimlari (5 ta)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Mode Selection Cards */}
      {!isPlaying ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {practiceModesCatalog
            .filter((m) => {
              if (activeCategory === 'past_simple') return m.isPast;
              if (activeCategory === 'vocab') return !m.isPast;
              return true;
            })
            .map((mode) => (
              <div
                key={mode.id}
                onClick={() => {
                  setSelectedMode(mode.id);
                  generateQuestions(mode.id, questionCountChoice);
                }}
                className={`group p-6 rounded-2xl bg-gradient-to-br ${mode.color} border hover:border-amber-400/50 cursor-pointer transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-white/10 text-white">
                      {mode.badge}
                    </span>
                    <span className="text-[10px] text-amber-400/90 font-medium">
                      {mode.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                    {mode.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{mode.desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>Boshlash &rarr;</span>
                  <span className="text-slate-500 font-normal">{questionCountChoice} ta savol</span>
                </div>
              </div>
            ))}
        </div>
      ) : isSessionFinished ? (
        // SESSION SUMMARY RESULTS
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-[#101a2e] border border-white/10 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white">Ajoyib Natija!</h3>
            <p className="text-slate-300 text-sm">
              Siz <strong>{questions.length}</strong> ta savoldan{' '}
              <strong className="text-emerald-400 font-bold">{score}</strong> tasiga to‘g‘ri javob
              berdingiz.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5">
              <span className="text-xs text-slate-400 block mb-1">To‘g‘rilik (Accuracy)</span>
              <span className="text-2xl font-black text-amber-300">
                {Math.round((score / questions.length) * 100)}%
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5">
              <span className="text-xs text-slate-400 block mb-1">To‘plangan ball</span>
              <span className="text-2xl font-black text-emerald-400">
                {score} / {questions.length}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => generateQuestions(selectedMode, questionCountChoice)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qaytadan urinish</span>
            </button>

            <button
              onClick={() => setIsPlaying(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-white/10 transition-colors"
            >
              Boshqa rejimni tanlash
            </button>
          </div>
        </div>
      ) : (
        // ACTIVE QUIZ INTERFACE
        currentQ && (
          <div className="space-y-6">
            {/* Quiz Top Status */}
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <button
                onClick={() => setIsPlaying(false)}
                className="hover:text-white transition-colors flex items-center gap-1 font-semibold"
              >
                &larr; Boshqa rejim tanlash
              </button>

              <div className="flex items-center gap-4">
                <span>
                  Savol: <strong className="text-white">{currentIndex + 1}</strong> /{' '}
                  {questions.length}
                </span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Ball: {score}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="rounded-3xl bg-[#0d1322] border border-white/10 p-6 sm:p-10 shadow-2xl space-y-7">
              {/* Question Header & Prompt */}
              <div className="text-center space-y-3">
                <span className="inline-block text-xs uppercase font-bold text-amber-400/90 tracking-wider px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                  {currentQ.promptTitle || 'Past Simple Mashqi'}
                </span>

                {/* Prompt Display based on mode */}
                {currentQ.modeType === 'audio' ? (
                  <div className="flex flex-col items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => currentQ.audioWord && speakWord(currentQ.audioWord)}
                      className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-400/25 hover:scale-105 active:scale-95 transition-all"
                      title="Qayta eshitish"
                    >
                      <Volume2 className="w-8 h-8" />
                    </button>
                    <span className="text-xs text-slate-400">
                      Talaffuzni qayta eshitish uchun tugmani bosing
                    </span>
                    {currentQ.subPrompt && (
                      <p className="text-xs text-amber-300/80 font-medium">
                        {currentQ.subPrompt}
                      </p>
                    )}
                  </div>
                ) : currentQ.promptText ? (
                  <div className="space-y-2.5 pt-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-relaxed">
                      {currentQ.promptText}
                    </h2>
                    {currentQ.subPrompt && (
                      <p className="text-sm text-amber-300 font-medium">
                        {currentQ.subPrompt}
                      </p>
                    )}
                  </div>
                ) : currentQ.targetWord ? (
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-5xl font-black text-white">
                      {currentQ.targetWord.word}
                    </h2>
                    {currentQ.targetWord.pronunciation && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => speakWord(currentQ.targetWord!.word)}
                          className="text-slate-500 hover:text-amber-300 p-1"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <span className="font-mono text-slate-400 text-sm">
                          {currentQ.targetWord.pronunciation}
                        </span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* ANSWER OPTIONS / INPUT SECTION */}
              {currentQ.modeType === 'typing' ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!isAnswerSubmitted) {
                      handleTypeSubmit(e);
                    } else {
                      handleNextQuestion();
                    }
                  }}
                  className="max-w-md mx-auto space-y-4"
                >
                  <input
                    type="text"
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    disabled={isAnswerSubmitted}
                    placeholder="V2 (Past Simple) shaklini yozing..."
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className={`w-full px-5 py-3.5 rounded-2xl bg-slate-900 border text-white text-center font-bold text-lg placeholder-slate-600 focus:outline-none transition-all ${
                      isAnswerSubmitted
                        ? isCorrect
                          ? 'border-emerald-500/80 bg-emerald-500/10 text-emerald-200'
                          : 'border-rose-500/80 bg-rose-500/10 text-rose-200'
                        : 'border-white/10 focus:border-amber-400/80'
                    }`}
                    autoFocus
                  />

                  {!isAnswerSubmitted ? (
                    <button
                      type="submit"
                      disabled={!typedAnswer.trim()}
                      className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all disabled:opacity-50 active:scale-98 shadow-lg shadow-amber-400/20"
                    >
                      Tekshirish
                    </button>
                  ) : null}
                </form>
              ) : currentQ.modeType === 'tf' ? (
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <button
                    onClick={() => handleSelectOption('true')}
                    disabled={isAnswerSubmitted}
                    className={`py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border transition-all ${
                      isAnswerSubmitted
                        ? currentQ.isTrueStatement
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : userSelectedAnswer === 'true'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-white/5 text-slate-600'
                        : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-white hover:border-emerald-500/40 active:scale-95'
                    }`}
                  >
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>To‘g‘ri (True)</span>
                  </button>

                  <button
                    onClick={() => handleSelectOption('false')}
                    disabled={isAnswerSubmitted}
                    className={`py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border transition-all ${
                      isAnswerSubmitted
                        ? !currentQ.isTrueStatement
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : userSelectedAnswer === 'false'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-white/5 text-slate-600'
                        : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-white hover:border-rose-500/40 active:scale-95'
                    }`}
                  >
                    <X className="w-5 h-5 text-rose-400" />
                    <span>Noto‘g‘ri (False)</span>
                  </button>
                </div>
              ) : (
                // Multiple Choice Options
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {currentQ.options?.map((option, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = userSelectedAnswer === option;
                    const isTheCorrectOne =
                      option.toLowerCase().trim() === currentQ.correctOption?.toLowerCase().trim();

                    let btnStyle =
                      'bg-slate-900/80 border-white/10 text-slate-200 hover:bg-slate-800 hover:border-amber-400/30';

                    if (isAnswerSubmitted) {
                      if (isTheCorrectOne) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                      } else {
                        btnStyle = 'bg-slate-900/40 border-white/5 text-slate-600';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(option)}
                        disabled={isAnswerSubmitted}
                        className={`group p-4 rounded-2xl border text-left font-semibold text-sm flex items-center gap-3 transition-all ${btnStyle} ${
                          !isAnswerSubmitted ? 'active:scale-98' : ''
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isAnswerSubmitted && isTheCorrectOne
                              ? 'bg-emerald-500 text-slate-950'
                              : isAnswerSubmitted && isSelected
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-800 text-slate-400 group-hover:text-amber-300'
                          }`}
                        >
                          {letters[idx]}
                        </span>
                        <span className="flex-1 truncate">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Feedback and Grammar Explanations after answer submission */}
              {isAnswerSubmitted && (
                <div className="space-y-3 animate-in fade-in">
                  <div
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-sm">
                          {isCorrect ? '✅ To‘g‘ri javob!' : '❌ Noto‘g‘ri'}
                        </div>
                        {!isCorrect && (
                          <div className="text-xs text-slate-300 mt-0.5">
                            To‘g‘ri javob:{' '}
                            <strong className="text-amber-300 font-semibold">
                              {currentQ.correctOption || currentQ.targetWord?.word}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Pronounce the correct answer */}
                      <button
                        type="button"
                        onClick={() => {
                          const toSpeak =
                            currentQ.verbDetails?.v2 ||
                            currentQ.correctOption ||
                            currentQ.targetWord?.word;
                          if (toSpeak) speakWord(toSpeak);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 transition-colors"
                        title="Talaffuzni eshitish"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-all shrink-0 active:scale-95 shadow-md flex items-center gap-1.5"
                      >
                        <span>
                          {currentIndex < questions.length - 1
                            ? 'Keyingisi'
                            : 'Natijani ko‘rish'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Verb 3 Forms Details Card */}
                  {currentQ.verbDetails && (
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            V1 (Base)
                          </span>
                          <span className="font-bold text-white text-sm">
                            {currentQ.verbDetails.v1}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                        <div>
                          <span className="text-[10px] text-amber-400 uppercase font-bold block">
                            V2 (Past Simple)
                          </span>
                          <span className="font-bold text-amber-300 text-sm">
                            {currentQ.verbDetails.v2}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            V3 (Participle)
                          </span>
                          <span className="font-bold text-white text-sm">
                            {currentQ.verbDetails.v3}
                          </span>
                        </div>
                      </div>

                      <div className="text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl">
                        🇺🇿 {currentQ.verbDetails.translation}
                      </div>
                    </div>
                  )}

                  {/* Grammar Rule Tip */}
                  {currentQ.grammarTip && (
                    <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs text-amber-200/90 flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{currentQ.grammarTip}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};
