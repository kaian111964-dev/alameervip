import React, { useState } from 'react';
import { MediaItem } from '../../types';
import { 
  getStoredAnnouncement, 
  saveStoredAnnouncement, 
  AnnouncementBanner 
} from '../../data/storageManager';
import { 
  Flame, Sparkles, Pin, Edit3, Image, ToggleLeft, ToggleRight, 
  CheckCircle2, CreditCard, ExternalLink, SlidersHorizontal, Save 
} from 'lucide-react';

interface AdminBannerAndSliderManagerProps {
  mediaItems: MediaItem[];
  onSaveMediaItems: (items: MediaItem[]) => void;
}

export const AdminBannerAndSliderManager: React.FC<AdminBannerAndSliderManagerProps> = ({
  mediaItems,
  onSaveMediaItems
}) => {
  const [announcement, setAnnouncement] = useState<AnnouncementBanner>(() => getStoredAnnouncement());
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  const heroItems = mediaItems.filter((item) => item.isPinned || item.rating >= 8.5);

  const handleTogglePin = (id: string) => {
    const updated = mediaItems.map((item) =>
      item.id === id ? { ...item, isPinned: !item.isPinned } : item
    );
    onSaveMediaItems(updated);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredAnnouncement(announcement);
    setAnnouncementSaved(true);
    setTimeout(() => setAnnouncementSaved(false), 3000);
  };

  return (
    <div className="space-y-8 font-['Cairo',sans-serif] animate-fadeIn">
      
      {/* SECTION 1: Announcement Card Banner Controls */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-amber-500/30 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-['Tajawal']">
                التحكم الكامل بالبطاقة الإعلانية (الشريط العلوي)
              </h2>
              <p className="text-xs text-neutral-400">
                تعديل محتوى البطاقة الإعلانية، الصورة، رقم الشبكة، والزر المباشر.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const updated = { ...announcement, enabled: !announcement.enabled };
              setAnnouncement(updated);
              saveStoredAnnouncement(updated);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer ${
              announcement.enabled
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
            }`}
          >
            {announcement.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            <span>{announcement.enabled ? 'مفعل ومُعرض بالرئيسية' : 'معطل ومخفي'}</span>
          </button>
        </div>

        {/* Announcement Edit Form */}
        <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="font-bold text-neutral-300">عنوان البطاقة الرئيسية *</label>
              <input
                type="text"
                required
                value={announcement.title}
                onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-300">الوصف الفرعي والتفاصيل</label>
              <input
                type="text"
                value={announcement.subtitle}
                onChange={(e) => setAnnouncement({ ...announcement, subtitle: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-300">نص الشارة العلوية (Badge)</label>
              <input
                type="text"
                value={announcement.badgeText}
                onChange={(e) => setAnnouncement({ ...announcement, badgeText: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-amber-400">رقم الشبكة (مثال: 512)</label>
              <input
                type="text"
                value={announcement.networkNumber}
                onChange={(e) => setAnnouncement({ ...announcement, networkNumber: e.target.value })}
                className="w-full bg-neutral-950 border border-amber-500/40 focus:border-amber-500 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-300">نص زر التفاعل</label>
              <input
                type="text"
                value={announcement.buttonText}
                onChange={(e) => setAnnouncement({ ...announcement, buttonText: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-300">رابط زر التفاعل (واتساب أو موقع)</label>
              <input
                type="url"
                value={announcement.linkUrl}
                onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white"
              />
            </div>

          </div>

          <div className="space-y-1">
            <label className="font-bold text-neutral-300">رابط صورة/غلاف البطاقة الإعلانية</label>
            <input
              type="url"
              value={announcement.imageUrl}
              onChange={(e) => setAnnouncement({ ...announcement, imageUrl: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
            {announcementSaved && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم حفظ تعديلات البطاقة الإعلانية بنجاح!</span>
              </span>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform mr-auto"
            >
              <Save className="w-4 h-4" />
              <span>حفظ تغييرات البطاقة الإعلانية</span>
            </button>
          </div>

        </form>

      </div>

      {/* SECTION 2: Hero Slider Items Control */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-6">
        
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-['Tajawal']">
              إدارة السلايدر الرئيسي والهيرو ({heroItems.length} عمل معروض)
            </h2>
            <p className="text-xs text-neutral-400">
              قم بالتثبيت أو إلغاء التثبيت لإدراج الأعمال السينمائية في السلايدر المتحرك بأعلى الموقع.
            </p>
          </div>
        </div>

        {/* Media items pin toggle list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaItems.map((item) => {
            const isPinned = Boolean(item.isPinned);

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all shadow-xl flex items-center justify-between gap-3 ${
                  isPinned
                    ? 'bg-amber-950/20 border-amber-500/50'
                    : 'bg-neutral-950 border-neutral-800 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 rounded-xl overflow-hidden border border-neutral-700 shrink-0 relative bg-neutral-900">
                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                    {isPinned && (
                      <span className="absolute top-1 right-1 p-1 bg-amber-500 rounded-full text-neutral-950 shadow">
                        <Pin className="w-2.5 h-2.5 fill-neutral-950" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-white text-xs line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                      <span className="bg-neutral-800 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                        {item.category}
                      </span>
                      <span>⭐ {item.rating}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleTogglePin(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer shrink-0 ${
                    isPinned
                      ? 'bg-amber-500 text-neutral-950 border-amber-500'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-amber-500/40'
                  }`}
                >
                  {isPinned ? 'مثبت بالسلايدر ✓' : '+ تثبيت للهيرو'}
                </button>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
