import React, { useState, useEffect } from 'react';
import { MediaItem } from '../types';
import { Play, Star, ChevronLeft, ChevronRight, Bookmark, ShieldCheck, Flame } from 'lucide-react';

interface HeroSliderProps {
  items: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
  onToggleBookmark: (item: MediaItem) => void;
  isBookmarked: (id: string) => boolean;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  items,
  onSelectMedia,
  onToggleBookmark,
  isBookmarked,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 7 seconds
  useEffect(() => {
    if (!items || items.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [items]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="relative w-full h-[480px] sm:h-[520px] lg:h-[580px] bg-neutral-950 overflow-hidden mb-10 border-b border-neutral-800/80">
      {/* Background Image with Gradient Mask */}
      <div className="absolute inset-0">
        <img
          src={currentItem.backdrop || currentItem.poster}
          alt={currentItem.title}
          className="w-full h-full object-cover object-center filter brightness-[0.4] scale-105 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
      </div>

      {/* Slide Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl space-y-4 pt-12 sm:pt-0">
          
          {/* Tags & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>حصرياً على الأمير نت</span>
            </span>

            <span className="bg-neutral-900/90 text-neutral-200 border border-neutral-700 px-3 py-1 rounded-full text-xs font-semibold">
              {currentItem.quality}
            </span>

            <span className="bg-neutral-900/90 text-neutral-300 border border-neutral-700 px-3 py-1 rounded-full text-xs font-medium">
              {currentItem.category}
            </span>

            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{currentItem.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-['Tajawal'] tracking-tight drop-shadow-xl">
            {currentItem.title}
          </h2>

          {/* Synopsis */}
          <p className="text-neutral-300 text-xs sm:text-sm line-clamp-3 leading-relaxed max-w-xl">
            {currentItem.synopsis}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectMedia(currentItem)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-neutral-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-neutral-950" />
              <span>شاهد الآن بدون إعلانات</span>
            </button>

            <button
              onClick={() => onToggleBookmark(currentItem)}
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                isBookmarked(currentItem.id)
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked(currentItem.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">
                {isBookmarked(currentItem.id) ? 'في المفضلة' : 'إضافة للمفضلة'}
              </span>
            </button>
          </div>

          {/* Pop-up Ad Free Guarantee Tag */}
          <div className="pt-1 flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>مشاهدة حرة وسريعة بدون نوافذ منبثقة أو إعلانات مزعجة</span>
          </div>

        </div>
      </div>

      {/* Slider Indicators & Arrows */}
      <div className="absolute bottom-6 left-6 right-6 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
        
        {/* Indicators */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-amber-500' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-full bg-neutral-900/80 border border-neutral-700 hover:border-amber-500 text-white hover:text-amber-400 transition-all"
            title="السابق"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-full bg-neutral-900/80 border border-neutral-700 hover:border-amber-500 text-white hover:text-amber-400 transition-all"
            title="التالي"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
