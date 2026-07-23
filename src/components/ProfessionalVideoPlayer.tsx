import React, { useState, useEffect, useRef } from 'react';
import { VideoServer } from '../types';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Server, 
  ShieldCheck, 
  Tv, 
  Sparkles,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface ProfessionalVideoPlayerProps {
  title: string;
  subtitle?: string;
  activeUrl: string;
  servers?: VideoServer[];
  onSelectServer?: (server: VideoServer) => void;
  quality?: string;
}

// Helper to extract YouTube embed URL if it's a YouTube link
function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
  }
  return null;
}

export const ProfessionalVideoPlayer: React.FC<ProfessionalVideoPlayerProps> = ({
  title,
  subtitle,
  activeUrl,
  servers,
  onSelectServer,
  quality = '1080p WEB-DL'
}) => {
  const [selectedServerUrl, setSelectedServerUrl] = useState(activeUrl);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedServerUrl(activeUrl);
    setHasError(false);
    setIsLoading(true);
  }, [activeUrl]);

  const youtubeEmbedUrl = getYoutubeEmbedUrl(selectedServerUrl);

  const handleVideoPlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div 
      ref={playerContainerRef}
      className={`relative w-full bg-neutral-950 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl transition-all duration-300 ${
        isTheaterMode ? 'max-w-none my-0 rounded-none' : 'max-w-6xl mx-auto my-6'
      }`}
    >
      {/* Player Top Bar Info */}
      <div className="bg-neutral-950/95 px-4 py-3 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <h3 className="text-xs sm:text-sm font-bold text-white font-['Tajawal'] line-clamp-1">
            {title} {subtitle ? `<span className="text-amber-400">(${subtitle})</span>` : ''}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Ad-Free Assurance Tag */}
          <span className="hidden sm:flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>مشغل الأمير VIP الخالي تماماً من الإعلانات</span>
          </span>

          {/* Theater Mode Toggle */}
          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-amber-300 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium"
          >
            <Tv className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTheaterMode ? 'تضييق المشغل' : 'وضع السينما'}</span>
          </button>

          {/* Quality Badge */}
          <span className="bg-amber-500 text-neutral-950 font-black px-2.5 py-1 rounded-lg text-[11px]">
            {quality}
          </span>
        </div>
      </div>

      {/* Main Video Frame Canvas */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
        
        {/* If YouTube Embed Link */}
        {youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          /* Direct HTML5 Video Player */
          <video
            ref={videoRef}
            src={selectedServerUrl}
            className="w-full h-full object-contain"
            autoPlay
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedData={() => {
              setIsLoading(false);
              setHasError(false);
            }}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        )}

        {/* Video Loading Indicator */}
        {isLoading && !youtubeEmbedUrl && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-amber-400 z-10">
            <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-xs font-bold font-['Tajawal']">جاري تحميل البث من سيرفرات الأمير نت...</p>
          </div>
        )}

        {/* Error Fallback Banner */}
        {hasError && (
          <div className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center gap-4 text-white z-20">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold font-['Tajawal'] text-red-300">عذراً، حدث خطأ أثناء تشغيل الفيديو من هذا السيرفر</h4>
              <p className="text-xs text-neutral-400 max-w-md">يرجى اختيار سيرفر آخر من قائمة السيرفرات بالأسفل أو الضغط على زر إعادة المحاولة.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Servers Selection Row */}
      {servers && servers.length > 0 && (
        <div className="p-3 bg-neutral-950/90 border-t border-neutral-800 space-y-2">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
            <Server className="w-4 h-4" />
            <span>سيرفرات المشاهدة المتاحة:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {servers.map((srv) => {
              const isSelected = selectedServerUrl === srv.url;
              return (
                <button
                  key={srv.id}
                  onClick={() => {
                    setSelectedServerUrl(srv.url);
                    if (onSelectServer) onSelectServer(srv);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isSelected ? 'text-neutral-950' : 'text-amber-400'}`} />
                  <span>{srv.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-neutral-950/20 text-neutral-950 font-mono' : 'bg-neutral-950 text-amber-400'}`}>
                    {srv.quality}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
