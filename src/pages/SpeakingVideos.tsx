import React, { useState, useMemo } from 'react';
import {
  Play,
  Search,
  Star,
  CheckCircle2,
  Mic,
  Volume2,
  Filter,
  Sparkles,
  Tv,
  Film,
  Flame,
  Check,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import {
  SpeakingVideo,
  VideoCategory,
  VideoDifficulty,
  VideoAccent,
} from '../types/speakingVideos';
import { SPEAKING_VIDEOS } from '../data/speakingVideosData';
import { Storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { SpeakingVideoModal } from '../components/SpeakingVideoModal';
import { VideoThumbnail } from '../components/VideoThumbnail';
import { NavTab } from '../components/Sidebar';

interface SpeakingVideosProps {
  onRefreshWords: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const SpeakingVideos: React.FC<SpeakingVideosProps> = ({
  onRefreshWords,
  onNavigate,
}) => {
  const toast = useToast();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedAccent, setSelectedAccent] = useState<string>('All');
  const [onlySaved, setOnlySaved] = useState(false);

  // Active video in modal
  const [activeVideo, setActiveVideo] = useState<SpeakingVideo | null>(null);

  // Video progress state from local storage
  const [videoProgress, setVideoProgress] = useState(() =>
    Storage.getVideoProgress()
  );

  const refreshProgress = () => {
    setVideoProgress(Storage.getVideoProgress());
  };

  // Toggle Save (Bookmark)
  const handleToggleSave = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isSaved = Storage.toggleSaveVideo(videoId);
    refreshProgress();
    toast.info(
      isSaved
        ? "Video saqlanganlarga qo'shildi ⭐"
        : "Video saqlanganlardan olib tashlandi"
    );
  };

  // Toggle Watched
  const handleToggleWatched = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlyWatched = videoProgress.watchedVideoIds.includes(videoId);
    Storage.markVideoWatched(videoId, !isCurrentlyWatched);
    refreshProgress();
    toast.info(
      !isCurrentlyWatched
        ? "Video ko'rildi deb belgilandi ✓"
        : "Video ko'rilmagan deb belgilandi"
    );
  };

  // Filtered video list
  const filteredVideos = useMemo(() => {
    return SPEAKING_VIDEOS.filter((video) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = video.title.toLowerCase().includes(q);
        const matchesDesc = video.description.toLowerCase().includes(q);
        const matchesSource = video.source.toLowerCase().includes(q);
        const matchesVocab = video.vocabulary.some(
          (v) =>
            v.word.toLowerCase().includes(q) ||
            v.translation.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesDesc && !matchesSource && !matchesVocab) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'US English' && video.accent !== 'US English') {
          return false;
        } else if (
          selectedCategory === 'UK English' &&
          video.accent !== 'UK English'
        ) {
          return false;
        } else if (
          selectedCategory !== 'US English' &&
          selectedCategory !== 'UK English' &&
          video.category !== selectedCategory
        ) {
          return false;
        }
      }

      // Difficulty filter
      if (
        selectedDifficulty !== 'All' &&
        video.level !== selectedDifficulty
      ) {
        return false;
      }

      // Accent filter
      if (selectedAccent !== 'All' && video.accent !== selectedAccent) {
        return false;
      }

      // Saved only
      if (onlySaved && !videoProgress.savedVideoIds.includes(video.id)) {
        return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedAccent,
    onlySaved,
    videoProgress,
  ]);

  // Categories list
  const categories = [
    'All',
    'Beginner Stories',
    'Elementary Stories',
    'Daily English',
    'School English',
    'Listening Practice',
    'Speaking Practice',
    'US English',
    'UK English',
  ];

  const difficulties = ['All', 'Beginner', 'Elementary', 'Intermediate'];
  const accents = ['All', 'US English', 'UK English'];

  // Calculate statistics
  const totalVideos = SPEAKING_VIDEOS.length;
  const watchedCount = videoProgress.watchedVideoIds.length;
  const savedCount = videoProgress.savedVideoIds.length;
  const completedSpeakingCount = Object.keys(
    videoProgress.speakingScores
  ).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0e1628] to-[#121c33] border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-20 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Video Learning</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              SPEAKING VIDEOS
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              "Improve your English by watching, listening and speaking."
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-bold text-slate-300">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>{totalVideos} ta video</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{watchedCount} ko'rildi</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-xs font-bold text-amber-300">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{savedCount} saqlangan</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-xs font-bold text-sky-300">
                <Mic className="w-3.5 h-3.5 text-sky-400" />
                <span>{completedSpeakingCount} nutq mashqi bajarildi</span>
              </div>
            </div>
          </div>

          {/* Quick First Video Hero Card */}
          {SPEAKING_VIDEOS[0] && (
            <div
              onClick={() => setActiveVideo(SPEAKING_VIDEOS[0])}
              className="shrink-0 bg-slate-900/90 hover:bg-slate-900 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 max-w-sm shadow-xl cursor-pointer transition-all hover:scale-[1.02] group"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-950">
                <VideoThumbnail
                  youtubeId={SPEAKING_VIDEOS[0].youtubeId}
                  title={SPEAKING_VIDEOS[0].title}
                  accent={SPEAKING_VIDEOS[0].accent}
                  showPlayButton={true}
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/90 text-white font-mono text-[10px] font-bold z-10 shadow-md">
                  {SPEAKING_VIDEOS[0].duration}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">
                  Tavsiya etilgan ertak
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  {SPEAKING_VIDEOS[0].title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {SPEAKING_VIDEOS[0].description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QUICK ACCENT SEPARATION BAR (@TheFableCottage US vs UK) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedAccent('All')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedAccent === 'All'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Barcha ertaklar ({totalVideos})
          </button>
          <button
            onClick={() => setSelectedAccent('US English')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedAccent === 'US English'
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-400/20'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <span className="text-sm">🇺🇸</span>
            <span>US English (Amerika)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                selectedAccent === 'US English'
                  ? 'bg-slate-950/30 text-slate-950'
                  : 'bg-slate-800 text-amber-300'
              }`}
            >
              {SPEAKING_VIDEOS.filter((v) => v.accent === 'US English').length} ta
            </span>
          </button>
          <button
            onClick={() => setSelectedAccent('UK English')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedAccent === 'UK English'
                ? 'bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-slate-950 shadow-lg shadow-sky-400/20'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <span className="text-sm">🇬🇧</span>
            <span>UK English (Britaniya)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                selectedAccent === 'UK English'
                  ? 'bg-slate-950/30 text-slate-950'
                  : 'bg-slate-800 text-sky-300'
              }`}
            >
              {SPEAKING_VIDEOS.filter((v) => v.accent === 'UK English').length} ta
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium px-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Manba:</span>
          <span className="text-amber-400 font-bold">@TheFableCottage</span>
        </div>
      </div>

      {/* SEARCH AND FILTERS SECTION */}
      <div className="space-y-4">
        {/* Search Bar + Saved Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Videolar, so'zlar yoki mavzular bo'yicha qidirish..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400/60 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlySaved(!onlySaved)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all ${
                onlySaved
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlySaved ? 'fill-slate-950' : ''}`} />
              <span>Saqlanganlar ({savedCount})</span>
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/15'
                  : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Difficulty & Accent */}
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Qiyinlik:</span>
            <div className="flex items-center gap-1">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    selectedDifficulty === diff
                      ? 'bg-slate-800 text-amber-300 font-bold border border-amber-400/30'
                      : 'hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <span className="text-slate-700 hidden sm:inline">•</span>

          {/* Accent Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Talaffuz (Accent):</span>
            <div className="flex items-center gap-1">
              {accents.map((acc) => (
                <button
                  key={acc}
                  onClick={() => setSelectedAccent(acc)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    selectedAccent === acc
                      ? 'bg-slate-800 text-amber-300 font-bold border border-amber-400/30'
                      : 'hover:text-white'
                  }`}
                >
                  {acc === 'US English'
                    ? '🇺🇸 US'
                    : acc === 'UK English'
                    ? '🇬🇧 UK'
                    : 'Barchasi'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* VIDEOS GRID */}
      {filteredVideos.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/5 space-y-3">
          <p className="text-slate-400 text-sm">
            Tanlangan filtrlarga mos videolar topilmadi.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSelectedAccent('All');
              setOnlySaved(false);
            }}
            className="text-amber-400 hover:underline text-xs font-semibold"
          >
            Barcha filtrlarni tozalash
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const isSaved = videoProgress.savedVideoIds.includes(video.id);
            const isWatched = videoProgress.watchedVideoIds.includes(video.id);
            const hasSpeakingProgress = video.speakingSentences.some(
              (s) => videoProgress.speakingScores[s.id] !== undefined
            );

            return (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group rounded-3xl bg-[#0d1322] border border-white/5 hover:border-amber-400/40 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* YouTube Thumbnail */}
                  <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                    <VideoThumbnail
                      youtubeId={video.youtubeId}
                      title={video.title}
                      accent={video.accent}
                      showPlayButton={true}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

                    {/* Duration Badge */}
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-slate-950/90 text-white font-mono text-[11px] font-bold shadow-md z-10">
                      ⏱ {video.duration}
                    </span>

                    {/* Accent Badge */}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/10 text-white text-[10px] font-bold shadow-md flex items-center gap-1 z-10">
                      <span>{video.accent === 'US English' ? '🇺🇸' : '🇬🇧'}</span>
                      <span>{video.accent}</span>
                    </span>

                    {/* Bookmark Star Button */}
                    <button
                      onClick={(e) => handleToggleSave(video.id, e)}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-20 ${
                        isSaved
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-950/60 text-white/70 hover:text-white hover:bg-slate-900'
                      }`}
                      title={isSaved ? "Saqlangan" : "Saqlash"}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${isSaved ? 'fill-slate-950' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    {/* Category & Level Badges */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-400">
                        {video.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] border ${
                          video.level === 'Beginner'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : video.level === 'Elementary'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}
                      >
                        {video.level}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {video.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Footer & Progress indicators */}
                <div className="px-5 pb-5 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {isWatched && (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold"
                        title="Ushbu video ko'rilgan"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Ko'rilgan</span>
                      </span>
                    )}

                    {hasSpeakingProgress && (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] text-sky-400 font-bold"
                        title="Speaking mashqlari bajarilgan"
                      >
                        <Mic className="w-3 h-3" />
                        <span>Nutq ✓</span>
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>▶ Watch</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideo && (
        <SpeakingVideoModal
          video={activeVideo}
          isOpen={Boolean(activeVideo)}
          onClose={() => {
            setActiveVideo(null);
            refreshProgress();
          }}
          onRefreshWords={onRefreshWords}
          isSaved={videoProgress.savedVideoIds.includes(activeVideo.id)}
          isWatched={videoProgress.watchedVideoIds.includes(activeVideo.id)}
          onToggleSave={() => handleToggleSave(activeVideo.id)}
          onToggleWatched={() => handleToggleWatched(activeVideo.id)}
        />
      )}
    </div>
  );
};
