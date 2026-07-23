import React from 'react';
import { MediaItem } from '../../types';
import { LiveChannel } from '../../data/liveChannelsData';
import { Film, Tv, Eye, Flame, Crown, FolderKanban, TrendingUp, Sparkles, Plus, Layers, PlayCircle } from 'lucide-react';

interface AdminOverviewProps {
  mediaItems: MediaItem[];
  liveChannels: LiveChannel[];
  categories: string[];
  onNavigateTab: (tab: 'media' | 'channels' | 'categories' | 'packages') => void;
  onAddNewMedia: () => void;
  onAddNewChannel: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  mediaItems,
  liveChannels,
  categories,
  onNavigateTab,
  onAddNewMedia,
  onAddNewChannel
}) => {
  const totalMovies = mediaItems.filter((i) => i.type === 'movie').length;
  const totalSeries = mediaItems.filter((i) => i.type === 'series' || i.type === 'ramadan').length;
  const totalViews = mediaItems.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalChannels = liveChannels.length;

  // Top 5 viewed media
  const topViewedMedia = [...mediaItems].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="space-y-8 font-['Cairo',sans-serif] animate-fadeIn">
      
      {/* Top Banner Alert / Greeting */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-neutral-900 to-amber-950 border border-amber-500/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 text-center md:text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>نظام الإدارة الشاملة - الأمير نت</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Tajawal']">
            أهلاً بك في لوحة تحكم المسؤول 👑
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
            يمكنك التحكم الكامل بإضافة ونشر الأفلام والمسلسلات، ترتيب المواسم والحلقات، إدارة بث القنوات المباشر والتصنيفات بسهولة فائقة مع حفظ تلقائي ومستمر للبيانات.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            onClick={onAddNewMedia}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فيلم / مسلسل جديد</span>
          </button>
          
          <button
            onClick={onAddNewChannel}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Tv className="w-4 h-4 text-red-400" />
            <span>إضافة قناة مباشرة</span>
          </button>
        </div>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Total Media */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 transition-all shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-neutral-400">إجمالي المحتوى الأرشيفي</span>
            <div className="text-3xl font-black text-white font-['Tajawal']">{mediaItems.length}</div>
            <p className="text-[10px] text-amber-400 font-semibold">{totalMovies} فيلم | {totalSeries} مسلسل</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Film className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Views */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 transition-all shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-neutral-400">مجموع المشاهدات والزيارات</span>
            <div className="text-3xl font-black text-amber-400 font-['Tajawal']">
              {totalViews.toLocaleString('ar-EG')}
            </div>
            <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>نسبة إقبال متزايدة</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Live Channels */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 transition-all shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-neutral-400">قنوات البث المباشر</span>
            <div className="text-3xl font-black text-red-500 font-['Tajawal']">{totalChannels}</div>
            <p className="text-[10px] text-red-400 font-semibold">بث مباشر 24/7 بدون تقطيع</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <Tv className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Card 4: Categories */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 transition-all shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-neutral-400">الأقسام والتصنيفات</span>
            <div className="text-3xl font-black text-indigo-400 font-['Tajawal']">{categories.length}</div>
            <p className="text-[10px] text-neutral-400">رمضان، تركية، أجنبية، عربية...</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Top Media & Quick Actions Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top 5 viewed media list */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-extrabold text-white font-['Tajawal']">الأكثر مشاهدة على شبكة الأمير نت</h3>
            </div>
            <button
              onClick={() => onNavigateTab('media')}
              className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
            >
              عرض وإدارة كافة المحتوى ➔
            </button>
          </div>

          <div className="space-y-3">
            {topViewedMedia.map((media, idx) => (
              <div key={media.id} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-black text-amber-400 text-sm">#{idx + 1}</span>
                  <div className="w-10 h-12 rounded-lg overflow-hidden border border-neutral-700 shrink-0">
                    <img src={media.poster} alt={media.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{media.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                      <span className="text-amber-400">{media.category}</span>
                      <span>•</span>
                      <span>{media.year}</span>
                      <span>•</span>
                      <span>{media.translation || 'مترجم'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{media.views.toLocaleString('ar-EG')}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">مشاهدة</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Management Short-Cuts */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-800 mb-4">
              <Crown className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-extrabold text-white font-['Tajawal']">روابط التحكم السريع</h3>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => onNavigateTab('media')}
                className="w-full p-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-right flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Film className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">إدارة الأفلام والمسلسلات</h4>
                    <p className="text-[10px] text-neutral-400">تعديل المواسم والحلقات والروابط</p>
                  </div>
                </div>
                <span className="text-amber-400 text-xs">➔</span>
              </button>

              <button
                onClick={() => onNavigateTab('channels')}
                className="w-full p-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500/40 text-right flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Tv className="w-5 h-5 text-red-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">إدارة القنوات والبث المباشر</h4>
                    <p className="text-[10px] text-neutral-400">تحديث روابط البث وجداول العرض</p>
                  </div>
                </div>
                <span className="text-red-400 text-xs">➔</span>
              </button>

              <button
                onClick={() => onNavigateTab('categories')}
                className="w-full p-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-indigo-500/40 text-right flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">إدارة أقسام الأرشيف</h4>
                    <p className="text-[10px] text-neutral-400">إضافة وتعديل التصنيفات والتصفية</p>
                  </div>
                </div>
                <span className="text-indigo-400 text-xs">➔</span>
              </button>

              <button
                onClick={() => onNavigateTab('packages')}
                className="w-full p-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 text-right flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">إدارة باقات الشبكة الكروت</h4>
                    <p className="text-[10px] text-neutral-400">تطبيق جوالي ورقم الشبكة (512)</p>
                  </div>
                </div>
                <span className="text-emerald-400 text-xs">➔</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-neutral-950 rounded-2xl border border-amber-500/20 text-center text-[10px] text-amber-400 font-bold">
            ⚡ يتم تطبيق جميع التغييرات وحفظها فوراً بقاعدة البيانات المحلية.
          </div>
        </div>

      </div>

    </div>
  );
};
