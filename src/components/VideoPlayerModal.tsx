import React, { useState } from 'react';
import { MediaItem, Episode } from '../types';
import { X, Play, Server, Download, Star, ShieldCheck, Tv, Bookmark, Share2 } from 'lucide-react';

interface VideoPlayerModalProps {
  item: MediaItem;
  onClose: () => void;
  onToggleBookmark: (item: MediaItem) => void;
  isBookmarked: boolean;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  item,
  onClose,
  onToggleBookmark,
  isBookmarked
}) => {
  const [selectedServer, setSelectedServer] = useState('server1');
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(
    item.episodes && item.episodes.length > 0 ? item.episodes[item.episodes.length - 1] : null
  );

  const activeVideoUrl = currentEpisode ? currentEpisode.videoUrl : item.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const servers = [
    { id: 'server1', name: 'سيرفر الأمير HD (الموصى به)' },
    { id: 'server2', name: 'سيرفر بلوراي السريع 2' },
    { id: 'server3', name: 'سيرفر الاحتياطي 3' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/90 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="bg-amber-500 text-neutral-950 text-xs font-black px-2.5 py-1 rounded-md">
              الأمير نت VIP
            </span>
            <h2 className="text-sm sm:text-lg font-bold text-white font-['Tajawal'] line-clamp-1">
              {item.title} {currentEpisode ? `- ${currentEpisode.title}` : ''}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(item)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isBookmarked ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'المفضلة' : 'حفظ'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center border-b border-neutral-800">
          <video
            src={activeVideoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
            controlsList="nodownload"
          >
            متصفحك لا يدعم مشغل الفيديو.
          </video>

          {/* Ad-Free Protection Overlay Badge */}
          <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md text-amber-400 text-[11px] font-bold px-3 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5 pointer-events-none shadow-lg">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>سيرفر آمن بدون إعلانات منبثقة</span>
          </div>
        </div>

        {/* Player Controls & Server Selector Bar */}
        <div className="p-4 bg-neutral-950/90 border-b border-neutral-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Server Buttons */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-neutral-400 font-medium flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-amber-400" />
                <span>السيرفر:</span>
              </span>
              {servers.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => setSelectedServer(srv.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedServer === srv.id
                      ? 'bg-amber-500 text-neutral-950'
                      : 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  {srv.name}
                </button>
              ))}
            </div>

            {/* Quality badge */}
            <div className="flex items-center gap-2">
              <span className="bg-neutral-800 text-neutral-300 text-xs px-2.5 py-1 rounded-md font-mono">
                {item.quality}
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.rating}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Content Body & Episodes */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[300px] overflow-y-auto">
          
          {/* If Series: Episodes Selection Grid */}
          {item.episodes && item.episodes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-400 font-['Tajawal'] flex items-center gap-2">
                  <Tv className="w-4 h-4" />
                  <span>قائمة الحلقات ({item.episodes.length} حلقة)</span>
                </h3>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 text-xs">
                {item.episodes.map((ep) => {
                  const isSelected = currentEpisode?.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => setCurrentEpisode(ep)}
                      className={`p-2 rounded-xl text-center font-bold transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/30 scale-105'
                          : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-amber-500/40 hover:text-white'
                      }`}
                    >
                      {ep.number}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Synopsis & Downloads */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-neutral-800">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-sm font-bold text-neutral-200">قصة العمل</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">{item.synopsis}</p>
            </div>

            {/* Direct Downloads */}
            <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Download className="w-4 h-4" />
                <span>روابط التحميل المباشر</span>
              </div>
              <div className="space-y-2 text-xs">
                <button 
                  onClick={() => window.open(activeVideoUrl, '_blank')}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>تحميل بجودة 1080p Full HD</span>
                </button>
                <button 
                  onClick={() => window.open(activeVideoUrl, '_blank')}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>تحميل بجودة 720p HD</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
