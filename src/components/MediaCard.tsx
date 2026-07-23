import React from 'react';
import { MediaItem } from '../types';
import { Play, Star, Bookmark, Tv, Film, Bell, BellRing } from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  onSelect: (item: MediaItem) => void;
  onToggleBookmark: (item: MediaItem) => void;
  isBookmarked: boolean;
  onToggleAlert?: (item: MediaItem) => void;
  isAlerted?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onSelect,
  onToggleBookmark,
  isBookmarked,
  onToggleAlert,
  isAlerted = false,
}) => {
  const isSeriesType = item.type === 'series' || item.type === 'ramadan' || (item.episodes && item.episodes.length > 0);

  const latestEpisodeNumber = item.episodes && item.episodes.length > 0
    ? item.episodes[item.episodes.length - 1].number
    : null;

  return (
    <div className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800/80 hover:border-amber-500/50 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col cursor-pointer">
      
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950" onClick={() => onSelect(item)}>
        <img
          src={item.poster}
          alt={item.title}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between gap-1 pointer-events-none">
          
          {/* Quality Ribbon & Translation status */}
          <div className="flex items-center gap-1">
            {item.quality && (
              <span className="bg-neutral-950/90 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-md border border-amber-500/30 shadow-md">
                {item.quality}
              </span>
            )}
            {(item.translation || item.badgeTag) && (
              <span className={`font-black text-[10px] px-2 py-0.5 rounded-md shadow-md ${
                (item.translation === 'مدبلج' || item.badgeTag === 'مدبلج')
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'bg-indigo-600 text-white'
              }`}>
                {item.translation || item.badgeTag}
              </span>
            )}
          </div>

          {/* Episode Counter Badge if Series */}
          {latestEpisodeNumber && (
            <span className="bg-amber-500 text-neutral-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
              <Tv className="w-3 h-3" />
              <span>الحلقة {latestEpisodeNumber}</span>
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-neutral-950/85 backdrop-blur-md text-amber-400 font-bold text-[11px] px-2 py-0.5 rounded-md border border-amber-500/20 flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{item.rating}</span>
        </div>

        {/* Hover Overlay with Play Button */}
        <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-neutral-950 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-7 h-7 fill-neutral-950 ml-0.5" />
          </div>
        </div>

        {/* Action Controls at bottom-left */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-10">
          
          {/* Series Alert Button ("تنبيه") */}
          {isSeriesType && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleAlert) {
                  onToggleAlert(item);
                }
              }}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all shadow-lg ${
                isAlerted
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 animate-pulse'
                  : 'bg-neutral-950/80 text-amber-400 border-amber-500/30 hover:bg-neutral-900 hover:border-amber-500'
              }`}
              title={isAlerted ? 'تنبيهات الحلقات مفعّلة (انقر للإلغاء)' : 'تنبيه عند إضافة حلقات جديدة'}
            >
              {isAlerted ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-extrabold hidden sm:inline">
                {isAlerted ? 'مُتنبّه' : 'تنبيه'}
              </span>
            </button>
          )}

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(item);
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              isBookmarked
                ? 'bg-amber-500 text-neutral-950 border-amber-400'
                : 'bg-neutral-950/80 text-neutral-400 border-neutral-700 hover:text-amber-400'
            }`}
            title={isBookmarked ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-neutral-950' : ''}`} />
          </button>
        </div>

      </div>

      {/* Card Metadata Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2" onClick={() => onSelect(item)}>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400/90 font-medium bg-amber-500/10 px-2 py-0.5 rounded-md inline-block">
              {item.category}
            </span>
            {isAlerted && (
              <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                <BellRing className="w-2.5 h-2.5" />
                تنبيه مفعل
              </span>
            )}
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-neutral-100 font-['Tajawal'] line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
            {item.title}
          </h3>
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/60">
          <span>{item.year}</span>
          <span className="flex items-center gap-1">
            {item.type === 'movie' ? <Film className="w-3 h-3 text-amber-400" /> : <Tv className="w-3 h-3 text-amber-400" />}
            <span>{item.type === 'movie' ? 'فيلم' : 'مسلسل'}</span>
          </span>
        </div>
      </div>

    </div>
  );
};

