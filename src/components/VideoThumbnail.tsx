import React, { useState } from 'react';
import { Play, Film, Sparkles } from 'lucide-react';

interface VideoThumbnailProps {
  youtubeId: string;
  title: string;
  accent?: 'US English' | 'UK English';
  className?: string;
  imgClassName?: string;
  showPlayButton?: boolean;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  youtubeId,
  title,
  accent,
  className = '',
  imgClassName = '',
  showPlayButton = false,
}) => {
  // Candidate thumbnail URLs in order of preference
  const sources = [
    `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/0.jpg`,
  ];

  const [srcIndex, setSrcIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const isUs = accent === 'US English';

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-900 via-[#0e1628] to-[#121c33] select-none ${className}`}
    >
      {!hasError ? (
        <>
          <img
            key={`${youtubeId}-${srcIndex}`}
            src={sources[srcIndex]}
            alt={title}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={handleError}
            className={`w-full h-full object-cover transition-all duration-300 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } ${imgClassName}`}
          />

          {/* Subtle loading placeholder shimmer before image loads */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
              <Film className="w-8 h-8 text-slate-700 animate-pulse" />
            </div>
          )}
        </>
      ) : (
        /* Fallback Visual Cover Card if external images are blocked or offline */
        <div className="absolute inset-0 p-5 flex flex-col justify-between bg-gradient-to-br from-[#121a2d] via-[#0d1424] to-[#1a2744] border border-white/5">
          {/* Ambient blur circle */}
          <div
            className={`absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full blur-2xl pointer-events-none opacity-40 ${
              isUs ? 'bg-amber-500' : 'bg-sky-500'
            }`}
          />

          {/* Top Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 text-[10px] font-bold text-amber-300 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>The Fable Cottage</span>
            </span>

            {accent && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900/90 text-white font-bold border border-white/10">
                {isUs ? '🇺🇸 US' : '🇬🇧 UK'}
              </span>
            )}
          </div>

          {/* Center Title & Play */}
          <div className="relative z-10 text-center my-auto space-y-2 px-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto shadow-lg">
              <Play className="w-5 h-5 fill-amber-400 text-amber-400 ml-0.5" />
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-white line-clamp-2 drop-shadow-md">
              {title}
            </h4>
          </div>

          {/* Bottom Watermark */}
          <div className="relative z-10 text-[10px] text-slate-400 font-medium text-center">
            🎬 YouTube Animated Story
          </div>
        </div>
      )}

      {/* Optional Play Button Overlay */}
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-105 transition-all">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950 ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
};
