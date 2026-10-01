import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  Volume2,
  FileText,
  RefreshCw,
  ArrowRight,
  Check,
  Edit2,
  X,
  BookOpen,
} from 'lucide-react';
import {
  analyzeVocabularyImage,
  enrichVocabularyText,
  EXAMPLE_PRESETS,
  ExtractedWordItem,
} from '../services/gemini';
import { Storage } from '../utils/storage';
import { speakWord } from '../utils/speech';
import { useToast } from '../components/Toast';
import { NavTab } from '../components/Sidebar';

interface ImportVocabularyProps {
  onNavigate: (tab: NavTab) => void;
  onRefreshWords: () => void;
}

export const ImportVocabulary: React.FC<ImportVocabularyProps> = ({
  onNavigate,
  onRefreshWords,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mode: 'image' or 'text'
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');

  // Image state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  // Text state
  const [rawText, setRawText] = useState('');

  // AI Loading & Steps
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Results state
  const [extractedWords, setExtractedWords] = useState<
    (ExtractedWordItem & { id: string; selected: boolean })[]
  >([]);
  const [hasExtracted, setHasExtracted] = useState(false);

  // New row inputs for manual additions
  const [showAddRow, setShowAddRow] = useState(false);
  const [newRowWord, setNewRowWord] = useState('');
  const [newRowTranslation, setNewRowTranslation] = useState('');

  const loadingSteps = [
    { title: 'Rasmni skanerlash', desc: 'Scanning image and identifying text layout' },
    { title: 'So\'zlarni ajratish', desc: 'Finding English vocabulary words and phrases' },
    { title: 'Lug\'atni tarjima qilish', desc: 'Translating vocabulary to Uzbek and preparing definitions' },
    { title: 'Kartochkalarni tayyorlash', desc: 'Synthesizing IPA pronunciations and examples' },
  ];

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    // Validate format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Faqat JPG, JPEG, PNG yoki WEBP formatidagi rasmlar qabul qilinadi.');
      return;
    }

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      toast.error('Rasm hajmi 15MB dan oshmasligi kerak.');
      return;
    }

    setImageFileName(file.name);
    setImageMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setHasExtracted(false);
      setExtractedWords([]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Run AI analysis
  const runAnalysis = async (imgData?: string, mime?: string) => {
    const targetImage = imgData || selectedImage;
    const targetMime = mime || imageMimeType;

    if (!targetImage) {
      toast.error('Iltimos avval rasm yuklang yoki "Try example"ni tanlang.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setCurrentStepIndex(0);

    // Simulate animated step transitions
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const result = await analyzeVocabularyImage(targetImage, targetMime);
      clearInterval(stepInterval);
      setCurrentStepIndex(3);

      if (result.success && result.words.length > 0) {
        const mapped = result.words.map((w, index) => ({
          ...w,
          id: 'ext_' + Date.now() + '_' + index,
          selected: true,
        }));
        setExtractedWords(mapped);
        setHasExtracted(true);
        setAnalysisError(null);
        toast.success(`${result.words.length} ta so'z muvaffaqiyatli ajratib olindi!`);
      } else {
        const err = result.error || 'Rasmda so\'zlar aniqlanmadi. Boshqa rasm sinab ko\'ring.';
        setAnalysisError(err);
        toast.error(err);
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      const msg = err?.message || 'Gemini tahlil jarayonida xatolik yuz berdi.';
      setAnalysisError(msg);
      toast.error(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run Text Enrichment
  const runTextAnalysis = async () => {
    if (!rawText.trim()) {
      toast.error('Iltimos matn yoki so\'zlar ro\'yxatini kiriting.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const result = await enrichVocabularyText(rawText);
      clearInterval(stepInterval);

      if (result.success && result.words.length > 0) {
        const mapped = result.words.map((w, index) => ({
          ...w,
          id: 'text_' + Date.now() + '_' + index,
          selected: true,
        }));
        setExtractedWords(mapped);
        setHasExtracted(true);
        toast.success(`${result.words.length} ta so'z aniqlandi!`);
      } else {
        toast.error(result.error || 'Matndan so\'zlar ajratib olinmadi.');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      toast.error('Matnni tahlil qilishda xatolik yuz berdi.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // "Try example" preset loader
  const handleTryExample = (presetId: string) => {
    const preset = EXAMPLE_PRESETS.find((p) => p.id === presetId) || EXAMPLE_PRESETS[0];
    setSelectedImage(preset.previewUrl);
    setImageFileName(preset.title);
    setImageMimeType('image/jpeg');

    // Instantly simulate full AI loading pipeline with rich educational data
    setIsAnalyzing(true);
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 800);

    setTimeout(() => {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      const mapped = preset.words.map((w, i) => ({
        ...w,
        id: 'example_' + Date.now() + '_' + i,
        selected: true,
      }));
      setExtractedWords(mapped);
      setHasExtracted(true);
      toast.success(`"${preset.title}" dan ${preset.words.length} ta so'z ajratildi!`);
    }, 2800);
  };

  // Row operations
  const toggleSelectAll = (checked: boolean) => {
    setExtractedWords((prev) => prev.map((item) => ({ ...item, selected: checked })));
  };

  const toggleSelectRow = (id: string) => {
    setExtractedWords((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const updateWordField = (id: string, field: keyof ExtractedWordItem, value: string) => {
    setExtractedWords((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const deleteRow = (id: string) => {
    setExtractedWords((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddNewRow = () => {
    if (!newRowWord.trim() || !newRowTranslation.trim()) {
      toast.error('Inglizcha so\'z va o\'zbekcha tarjimasini kiriting.');
      return;
    }
    const newWord: ExtractedWordItem & { id: string; selected: boolean } = {
      id: 'manual_' + Date.now(),
      word: newRowWord.trim(),
      translation: newRowTranslation.trim(),
      definition: 'Custom word definition',
      example: `I practice using the word "${newRowWord.trim()}" every day.`,
      pronunciation: `/${newRowWord.trim().toLowerCase()}/`,
      partOfSpeech: 'noun',
      selected: true,
    };
    setExtractedWords((prev) => [newWord, ...prev]);
    setNewRowWord('');
    setNewRowTranslation('');
    setShowAddRow(false);
    toast.success('Yangi so\'z ro\'yxatga qo\'shildi.');
  };

  // Create flashcards from selected words
  const handleCreateFlashcards = () => {
    const selected = extractedWords.filter((w) => w.selected);
    if (selected.length === 0) {
      toast.error('Kamida bitta so\'zni tanlang.');
      return;
    }

    const payload = selected.map((item) => ({
      word: item.word,
      translation: item.translation,
      definition: item.definition,
      example: item.example,
      pronunciation: item.pronunciation,
      partOfSpeech: item.partOfSpeech,
    }));

    const created = Storage.addWords(payload);
    onRefreshWords();

    toast.success(`${created.length} ta yangi so'z flashcardga aylantirildi!`);
    onNavigate('flashcards');
  };

  const allSelected =
    extractedWords.length > 0 && extractedWords.every((item) => item.selected);
  const selectedCount = extractedWords.filter((item) => item.selected).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Vision & Language Parser</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Turn a photo into flashcards
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
          Upload a vocabulary list, textbook page, screenshot, or worksheet. Gemini extracts the words, generates Uzbek translations, simple English definitions, examples, and phonetic pronunciations automatically.
        </p>
      </div>

      {/* Tabs: Image Upload vs Text Paste */}
      <div className="flex border-b border-white/10 gap-6">
        <button
          onClick={() => setActiveTab('image')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'image'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Rasm yuklash (Photo to Cards)</span>
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'text'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Matn / Lug'at kiritish</span>
        </button>
      </div>

      {/* Error Alert Banner */}
      {analysisError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold block sm:inline mr-1">Xatolik:</span>
              <span>{analysisError}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {selectedImage && (
              <button
                type="button"
                onClick={() => runAnalysis()}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold border border-rose-500/30 transition-colors"
              >
                Qayta urinish
              </button>
            )}
            <button
              type="button"
              onClick={() => handleTryExample('travel-unit')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-semibold hover:bg-amber-300 transition-colors"
            >
              Namunani yuklash
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: Image Upload Area */}
      {activeTab === 'image' && (
        <div className="space-y-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => {
              if (!selectedImage && fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            className={`relative rounded-3xl border-2 border-dashed transition-all p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden ${
              isDragging
                ? 'border-amber-400 bg-amber-400/5 scale-[1.01]'
                : selectedImage
                ? 'border-white/20 bg-slate-900/60 cursor-default'
                : 'border-white/10 hover:border-amber-400/40 bg-slate-900/40 hover:bg-slate-900/70'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
            />

            {!selectedImage ? (
              <div className="space-y-4 max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/10">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Rasmni bu yerga tashlang yoki tanlang
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    JPG, JPEG, PNG yoki WEBP (maksimal 15MB)
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    Choose image
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center space-y-5">
                <div className="relative group max-h-72 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black">
                  <img
                    src={selectedImage}
                    alt="Vocabulary Upload Preview"
                    className="max-h-72 object-contain rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Almashtirish</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                        setHasExtracted(false);
                        setExtractedWords([]);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-semibold flex items-center gap-1.5 border border-rose-500/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>O'chirish</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <span className="text-xs text-slate-400 truncate max-w-xs">
                    {imageFileName || 'Yuklangan rasm'}
                  </span>

                  <button
                    type="button"
                    onClick={() => runAnalysis()}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-400/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI orqali tahlil qilish</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* "Try example" Presets Section */}
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Tayyor namuna bilan sinab ko'ring (Try Example)</span>
              </span>
              <span className="text-[11px] text-slate-500">Bir marta bosishda ishlaydi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {EXAMPLE_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleTryExample(preset.id)}
                  className="group p-3.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-amber-400/40 cursor-pointer transition-all flex items-center gap-3.5 hover:bg-slate-900"
                >
                  <img
                    src={preset.previewUrl}
                    alt={preset.title}
                    className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {preset.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">{preset.subtitle}</p>
                    <span className="text-[10px] text-amber-400 font-semibold">
                      {preset.wordsCount} ta so'z namunasi
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Text Paste Area */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Lug'at matnini kiriting yoki nusxalab qo'ying
              </label>
              <span className="text-xs text-slate-500">
                Format: <code>word - tarjimasi</code> yoki erkin matn
              </span>
            </div>

            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Masalan:
chet elda-abroad
bo'ylab-across
banana-banan
biology-biologiya
cruise-sayohat kemasi`}
              className="w-full p-4 rounded-2xl bg-[#090d16] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 font-mono text-sm leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setRawText(`chet elda-abroad
bo'ylab,kesib-across
butun yil davomida-all year round
banan-banana
boshlamoq-begin
biologiya-biology
qayiq-boat
ko'prik-bridge
kampus,unvesitet shaxarchasi-campus
ehtiyotkorlik bilan-carefully
ro'yxatdan o'tmoq-check in
kimyo-chemistry
sayohat kemasi-cruise
chex-czech
rivojlanayotgan davlat-developing countries
ajrashgan-divorced
iqtisodiyot-economics
yevropa-Europe
hodisa voqea-event
tushuntirmoq-explain`)
                }
                className="text-xs text-amber-400 hover:underline"
              >
                Eski lug'at namunasini qo'yish (20 ta so'z)
              </button>

              <button
                type="button"
                onClick={runTextAnalysis}
                disabled={isAnalyzing || !rawText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI orqali kartochkalarga aylantirish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI LOADING OVERLAY / SCREEN (Prompt Requirement #6) */}
      {isAnalyzing && (
        <div className="rounded-3xl p-8 bg-[#0b101c] border border-amber-400/20 shadow-2xl space-y-6 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 animate-pulse">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Analyzing your vocabulary...</h3>
              <p className="text-xs text-slate-400">
                Gemini Vision sun'iy intellekti matnni o'qimoqda va lug'atni shakllantirmoqda
              </p>
            </div>
          </div>

          {/* Animated 4-step progress */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {loadingSteps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-amber-400/10 border-amber-400/40 text-amber-300 shadow-lg shadow-amber-400/5'
                      : isPast
                      ? 'bg-slate-900/80 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900/40 border-white/5 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold">0{idx + 1}</span>
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                  <div className="text-sm font-semibold mb-0.5 text-white">{step.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">{step.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RESULTS TABLE (Prompt Requirement #7) */}
      {hasExtracted && extractedWords.length > 0 && (
        <div className="space-y-5 rounded-3xl bg-[#090d16] border border-white/10 p-6 sm:p-8 shadow-2xl animate-in fade-in">
          {/* Table Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-white">
                  {extractedWords.length} words found
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  {selectedCount} tanlandi
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Har bir qatorni tahrirlashingiz, o'chirishingiz yoki yangi so'z qo'shishingiz mumkin.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAddRow(!showAddRow)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Yangi so'z qo'shish</span>
              </button>

              <button
                type="button"
                onClick={handleCreateFlashcards}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-400/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Flashcards ({selectedCount})</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Quick Add Row */}
          {showAddRow && (
            <div className="p-4 rounded-xl bg-slate-900 border border-amber-400/30 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in">
              <input
                type="text"
                value={newRowWord}
                onChange={(e) => setNewRowWord(e.target.value)}
                placeholder="English word (masalan: diligent)"
                className="w-full sm:w-1/3 px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <input
                type="text"
                value={newRowTranslation}
                onChange={(e) => setNewRowTranslation(e.target.value)}
                placeholder="O'zbekcha tarjima (masalan: tirishqoq)"
                className="w-full sm:w-1/3 px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddNewRow}
                  className="px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
                >
                  Qo'shish
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRow(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white text-xs"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          )}

          {/* Responsive Table Container */}
          <div className="overflow-x-auto border border-white/10 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-white/10 select-none">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 text-amber-400 focus:ring-amber-400/40 bg-slate-900"
                    />
                  </th>
                  <th className="py-3 px-3 min-w-[140px]">English</th>
                  <th className="py-3 px-3 min-w-[150px]">Uzbek</th>
                  <th className="py-3 px-3 min-w-[180px]">Definition</th>
                  <th className="py-3 px-3 min-w-[200px]">Example</th>
                  <th className="py-3 px-3 min-w-[110px]">Pronunciation</th>
                  <th className="py-3 px-3 w-14 text-center">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {extractedWords.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-900/50 transition-colors ${
                      !row.selected ? 'opacity-40' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={row.selected}
                        onChange={() => toggleSelectRow(row.id)}
                        className="w-4 h-4 rounded border-slate-700 text-amber-400 focus:ring-amber-400/40 bg-slate-900"
                      />
                    </td>

                    {/* English Word + Speaker */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={row.word}
                          onChange={(e) => updateWordField(row.id, 'word', e.target.value)}
                          className="bg-transparent font-bold text-white focus:bg-slate-900 focus:ring-1 focus:ring-amber-400/50 rounded px-1.5 py-1 w-full text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => speakWord(row.word)}
                          className="text-slate-500 hover:text-amber-300 p-1 transition-colors"
                          title="Eshitish"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Uzbek translation */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={row.translation}
                        onChange={(e) => updateWordField(row.id, 'translation', e.target.value)}
                        className="bg-transparent text-amber-300/90 font-medium focus:bg-slate-900 focus:ring-1 focus:ring-amber-400/50 rounded px-1.5 py-1 w-full text-xs"
                      />
                    </td>

                    {/* Definition */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={row.definition}
                        onChange={(e) => updateWordField(row.id, 'definition', e.target.value)}
                        className="bg-transparent text-slate-400 focus:bg-slate-900 focus:ring-1 focus:ring-amber-400/50 rounded px-1.5 py-1 w-full text-xs"
                      />
                    </td>

                    {/* Example */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={row.example}
                        onChange={(e) => updateWordField(row.id, 'example', e.target.value)}
                        className="bg-transparent text-slate-400 italic focus:bg-slate-900 focus:ring-1 focus:ring-amber-400/50 rounded px-1.5 py-1 w-full text-xs"
                      />
                    </td>

                    {/* Pronunciation */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={row.pronunciation}
                        onChange={(e) => updateWordField(row.id, 'pronunciation', e.target.value)}
                        className="bg-transparent font-mono text-slate-400 focus:bg-slate-900 focus:ring-1 focus:ring-amber-400/50 rounded px-1.5 py-1 w-full text-xs"
                      />
                    </td>

                    {/* Delete Action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => deleteRow(row.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Tanlangan so'zlar sizning shaxsiy kutubxonangizga saqlanadi.
            </span>
            <button
              type="button"
              onClick={handleCreateFlashcards}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-xl shadow-amber-400/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Create Flashcards ({selectedCount})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
