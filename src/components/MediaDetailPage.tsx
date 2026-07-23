import React, { useState, useEffect } from 'react';
import { MediaItem, Episode, VideoServer } from '../types';
import { ProfessionalVideoPlayer } from './ProfessionalVideoPlayer';
import { MediaCard } from './MediaCard';
import { 
  ArrowRight, 
  Star, 
  Bookmark, 
  Bell, 
  BellRing, 
  Share2, 
  Download, 
  Tv, 
  Film, 
  Calendar, 
  Globe, 
  HardDrive, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Layers,
  Check,
  Eye,
  Play
} from 'lucide-react';

interface MediaDetailPageProps {
  item: MediaItem;
  allItems: MediaItem[];
  onBackToHome: () => void;
  onSelectMedia: (item: MediaItem) => void;
  onToggleBookmark: (item: MediaItem) => void;
  isBookmarked: boolean;
  onToggleAlert: (item: MediaItem) => void;
  isAlerted: boolean;
}

export const MediaDetailPage: React.FC<MediaDetailPageProps> = ({
  item,
  allItems,
  onBackToHome,
  onSelectMedia,
  onToggleBookmark,
  isBookmarked,
  onToggleAlert,
  isAlerted,
}) => {
  const isSeries = item.type === 'series' || item.type === 'ramadan' || (item.episodes && item.episodes.length > 0);

  // Default to the first episode or last added episode
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(
    item.episodes && item.episodes.length > 0 ? item.episodes[0] : null
  );

  const [activeServer, setActiveServer] = useState<VideoServer | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Scroll to top on mount or when item changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (item.episodes && item.episodes.length > 0) {
      setCurrentEpisode(item.episodes[0]);
    } else {
      setCurrentEpisode(null);
    }
  }, [item]);

  // Determine current active video URL
  const activeVideoUrl = currentEpisode 
    ? (activeServer?.url || currentEpisode.videoUrl)
    : (activeServer?.url || item.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  // Combined servers for item/episode
  const availableServers: VideoServer[] = currentEpisode?.servers || item.servers || [
    { id: 'srv-default-1', name: 'سيرفر الأمير VIP 1080p', url: currentEpisode?.videoUrl || item.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', quality: '1080p Full HD' },
    { id: 'srv-default-2', name: 'سيرفر السريع HD 720p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', quality: '720p HD' },
    { id: 'srv-default-yt', name: 'سيرفر يوتيوب Bث مباشر', url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', quality: '1080p', isYoutube: true }
  ];

  // Related items filter
  const relatedItems = allItems.filter(
    (m) => m.id !== item.id && (m.category === item.category || m.type === item.type)
  ).slice(0, 5);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-20 animate-fadeIn font-['Cairo',sans-serif]">
      
      {/* Top Navigation & Breadcrumbs Bar */}
      <div className="sticky top-20 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 overflow-x-auto">
            <button 
              onClick={onBackToHome}
              className="hover:text-amber-400 font-bold flex items-center gap-1 transition-colors shrink-0"
            >
              <span>الرئيسية</span>
            </button>
            <span>/</span>
            <span className="text-neutral-300 font-medium shrink-0">{item.category}</span>
            <span>/</span>
            <span className="text-amber-400 font-bold line-clamp-1">{item.title}</span>
          </div>

          <button
            onClick={onBackToHome}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-neutral-200 hover:text-amber-300 text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>الرجوع للرئيسية</span>
          </button>

        </div>
      </div>

      {/* Hero Backdrop Showcase */}
      <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] bg-neutral-950 overflow-hidden">
        <img
          src={item.backdrop || item.poster}
          alt={item.title}
          className="w-full h-full object-cover object-center filter brightness-[0.35] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      {/* Main Details Showcase Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-52 sm:-mt-64 relative z-10 space-y-10">
        
        {/* Top Header Grid: Poster + Titles & Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 items-start">
          
          {/* Poster Card Display */}
          <div className="md:col-span-1 mx-auto md:mx-0 w-56 sm:w-64 md:w-full space-y-3">
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-amber-500/10 group">
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 right-3 bg-neutral-950/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-lg border border-amber-500/40 shadow-lg">
                {item.quality}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2">
              {isSeries && (
                <button
                  onClick={() => onToggleAlert(item)}
                  className={`w-full py-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                    isAlerted
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 font-black animate-pulse'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {isAlerted ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  <span>{isAlerted ? 'تنبيهات الحلقات مفعّلة' : 'تنبيه عند نزول حلقات جديدة'}</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onToggleBookmark(item)}
                  className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{isBookmarked ? 'في المفضلة' : 'حفظ'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
                  <span>{copiedLink ? 'تم النسخ' : 'مشاركة'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Details & Information Metadata Column */}
          <div className="md:col-span-3 space-y-6 pt-2">
            
            {/* Category & Types Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500 text-neutral-950 font-black text-xs px-3 py-1 rounded-lg shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>حصرياً على الأمير نت</span>
              </span>

              <span className="bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-bold px-3 py-1 rounded-lg">
                {item.category}
              </span>

              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-lg text-xs font-bold border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>تقييم IMDb: {item.rating} / 10</span>
              </div>

              <div className="flex items-center gap-1 text-neutral-400 text-xs bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-lg">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>{item.views.toLocaleString('ar-EG')} مشاهدة</span>
              </div>
            </div>

            {/* Main Title & English Title */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-['Tajawal'] tracking-tight leading-snug drop-shadow-lg">
                {item.title}
              </h1>
              {item.englishTitle && (
                <p className="text-neutral-400 text-sm font-semibold tracking-wider font-mono">
                  {item.englishTitle}
                </p>
              )}
            </div>

            {/* Synopsis Story */}
            <div className="space-y-2 bg-neutral-900/80 p-4 sm:p-5 rounded-2xl border border-neutral-800/80">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Film className="w-4 h-4" />
                <span>قصة العمل الأحداث والملخص</span>
              </h3>
              <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed font-normal">
                {item.synopsis}
              </p>
            </div>

            {/* Quick Metadata Info Bar (Year, Size, Duration, Country, Seasons...) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>سنة العرض</span>
                </span>
                <p className="text-xs font-bold text-white">{item.year}</p>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-amber-400" />
                  <span>حجم الملف</span>
                </span>
                <p className="text-xs font-bold text-white">{item.fileSize || '1.45 جيجابايت'}</p>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>مدة العرض</span>
                </span>
                <p className="text-xs font-bold text-white">{item.duration || '120 دقيقة'}</p>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                  <Globe className="w-3 h-3 text-amber-400" />
                  <span>دولة الإنتاج واللغة</span>
                </span>
                <p className="text-xs font-bold text-white">{item.country || 'أجنبي (مترجم)'}</p>
              </div>

            </div>

            {/* Genres Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-neutral-400 font-semibold">التصنيفات:</span>
              {item.genre.map((g) => (
                <span key={g} className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 px-3 py-1 rounded-full text-xs font-semibold">
                  {g}
                </span>
              ))}
            </div>

          </div>

        </div>

        {/* Video Player Section */}
        <div id="player-section" className="pt-6 border-t border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-7 bg-amber-500 rounded-full" />
              <h2 className="text-lg sm:text-2xl font-black text-white font-['Tajawal']">
                مشغل الأمير نت - مشاهدة أونلاين HD
              </h2>
            </div>

            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>بدون إعلانات منبثقة</span>
            </div>
          </div>

          {/* Render Professional Video Player */}
          <ProfessionalVideoPlayer
            title={item.title}
            subtitle={currentEpisode ? currentEpisode.title : undefined}
            activeUrl={activeVideoUrl}
            servers={availableServers}
            onSelectServer={(srv) => setActiveServer(srv)}
            quality={item.quality}
          />
        </div>

        {/* Seasons & Episode Picker (If Series) */}
        {isSeries && item.episodes && item.episodes.length > 0 && (
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold font-['Tajawal']">
                <Tv className="w-5 h-5 text-amber-400" />
                <span>حلقات المسلسل المتاحة ({item.episodes.length} حلقة)</span>
              </div>

              {item.seasonsCount && (
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-xl text-xs font-bold border border-amber-500/30">
                  <Layers className="w-4 h-4" />
                  <span>الموسم الأول ({item.seasonsCount} مواسم متوفرة)</span>
                </div>
              )}
            </div>

            {/* Episode Grid Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
              {item.episodes.map((ep) => {
                const isSelected = currentEpisode?.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setCurrentEpisode(ep);
                      setActiveServer(null);
                      document.getElementById('player-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all font-bold cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/30 scale-105'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-amber-500/50 hover:text-white'
                    }`}
                  >
                    <span className="text-xs">الحلقة</span>
                    <span className="text-base font-black font-mono">{ep.number}</span>
                    {isSelected && <Play className="w-3 h-3 fill-neutral-950" />}
                  </button>
                );
              })}
            </div>

          </div>
        )}

        {/* Direct Download Links Section */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base font-['Tajawal'] border-b border-neutral-800 pb-3">
            <Download className="w-5 h-5" />
            <span>سيرفرات التحميل المباشر والسريع</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(item.downloadLinks || [
              { label: 'سيرفر الأمير - 1080p Full HD', quality: '1080p', size: item.fileSize || '1.45 GB', url: activeVideoUrl },
              { label: 'سيرفر الأمير - 720p HD', quality: '720p', size: '850 MB', url: activeVideoUrl },
              { label: 'سيرفر الأمير - 480p SD', quality: '480p', size: '420 MB', url: activeVideoUrl }
            ]).map((dl, idx) => (
              <a
                key={idx}
                href={dl.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500 text-neutral-200 hover:text-white flex items-center justify-between gap-3 transition-all hover:scale-[1.02] shadow-lg group cursor-pointer"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors block">
                    {dl.label}
                  </span>
                  <p className="text-[11px] text-neutral-400">الحجم: {dl.size || 'متغير'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-500 text-neutral-950 font-bold group-hover:bg-amber-400 transition-colors shrink-0">
                  <Download className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Related Titles Recommendations */}
        {relatedItems.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-7 bg-amber-500 rounded-full" />
                <h2 className="text-lg sm:text-xl font-bold text-white font-['Tajawal']">
                  أعمال مشابهة قد تعجبك على الأمير نت
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
              {relatedItems.map((rel) => (
                <MediaCard
                  key={rel.id}
                  item={rel}
                  onSelect={(selected) => onSelectMedia(selected)}
                  onToggleBookmark={onToggleBookmark}
                  isBookmarked={isBookmarked}
                  onToggleAlert={onToggleAlert}
                  isAlerted={isAlerted}
                />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
