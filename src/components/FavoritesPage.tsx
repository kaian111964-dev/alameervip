import React from 'react';
import { MediaItem } from '../types';
import { MediaCard } from './MediaCard';
import { 
  ArrowRight, Bookmark, Film, Trash2, Heart, Sparkles, Tv, Bell 
} from 'lucide-react';

interface FavoritesPageProps {
  favorites: MediaItem[];
  seriesAlerts: string[];
  allItems: MediaItem[];
  onBackToHome: () => void;
  onSelectMedia: (item: MediaItem) => void;
  onToggleBookmark: (item: MediaItem) => void;
  onToggleAlert: (item: MediaItem) => void;
  onClearAllFavorites: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  seriesAlerts,
  allItems,
  onBackToHome,
  onSelectMedia,
  onToggleBookmark,
  onToggleAlert,
  onClearAllFavorites
}) => {
  const alertItems = allItems.filter(item => seriesAlerts.includes(item.id));

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-['Cairo',sans-serif] flex flex-col justify-between">
      
      {/* Top Header Bar */}
      <div className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-amber-500/20 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs sm:text-sm border border-neutral-700 transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bookmark className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-lg sm:text-xl font-black text-white font-['Tajawal'] gold-gradient-text">
              قائمة المفضلات والتنبيهات
            </span>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-amber-500/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
                مكتبتك الشخصية
              </span>
              <span className="text-xs text-neutral-400">
                ({favorites.length} عمل مفضل | {alertItems.length} تنبيه مسلسلات)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Tajawal']">
              الأعمال المحفوظة والتنبيهات 👑
            </h1>
            <p className="text-xs text-neutral-400">
              يمكنك متابعة المسلسلات والأفلام التي قمت بحفظها للرجوع إليها في أي وقت.
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('هل أنت تأكد من تفريغ كافة الأعمال من المفضلات؟')) {
                  onClearAllFavorites();
                }
              }}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span>تفريغ المفضلات</span>
            </button>
          )}
        </div>

        {/* SECTION 1: Favorites Media Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="text-lg font-black text-white font-['Tajawal']">
              المفضلة ({favorites.length})
            </h2>
          </div>

          {favorites.length === 0 ? (
            <div className="p-12 text-center bg-neutral-900/50 rounded-3xl border border-neutral-800 space-y-3">
              <Bookmark className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-sm font-bold text-neutral-300">لم تقم بإضافة أي أعمال للمفضلة بعد</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                تصفح قائمة الأفلام والمسلسلات وانقر على رمز العلامة أو القلب لإضافتها هنا لسهولة الوصول.
              </p>
              <button
                onClick={onBackToHome}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-black shadow-lg shadow-amber-500/20 cursor-pointer hover:scale-105 transition-transform"
              >
                تصفح المكتبة الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {favorites.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onSelect={onSelectMedia}
                  onToggleBookmark={onToggleBookmark}
                  isBookmarked={true}
                  onToggleAlert={onToggleAlert}
                  isAlerted={seriesAlerts.includes(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: Series Alerts List */}
        {alertItems.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-neutral-800">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
              <Bell className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black text-white font-['Tajawal']">
                المسلسلات المفعّل بها إشعارات الحلقات الجديدة ({alertItems.length})
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {alertItems.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onSelect={onSelectMedia}
                  onToggleBookmark={onToggleBookmark}
                  isBookmarked={favorites.some(f => f.id === item.id)}
                  onToggleAlert={onToggleAlert}
                  isAlerted={true}
                />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
