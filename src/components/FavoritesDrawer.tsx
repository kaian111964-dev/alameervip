import React from 'react';
import { MediaItem } from '../types';
import { X, Bookmark, Trash2, Play, Crown } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
  onRemoveFavorite: (item: MediaItem) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectMedia,
  onRemoveFavorite
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-neutral-900 h-full border-r border-neutral-800 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-base font-bold text-white font-['Tajawal']">مفضلاتي على الأمير نت</h2>
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
              {favorites.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Saved Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Crown className="w-12 h-12 text-neutral-600 mx-auto opacity-50" />
              <p className="text-neutral-400 text-xs font-medium">لم تقم بإضافة أي أعمال إلى المفضلة بعد.</p>
              <p className="text-neutral-500 text-[11px]">اضغط على أيقونة الإشارة المرجعية على أي فيلم أو مسلسل للحفظ هنا.</p>
            </div>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 hover:border-amber-500/30 transition-all group"
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-14 h-20 object-cover rounded-lg bg-neutral-900"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-1 font-['Tajawal']">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-neutral-400">{item.year} • {item.quality}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      onSelectMedia(item);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-amber-500 text-neutral-950 hover:bg-amber-400 font-bold transition-colors"
                    title="مشاهدة"
                  >
                    <Play className="w-3.5 h-3.5 fill-neutral-950" />
                  </button>

                  <button
                    onClick={() => onRemoveFavorite(item)}
                    className="p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
