import React, { useState } from 'react';
import { LiveChannel, LIVE_CHANNEL_CATEGORIES } from '../../data/liveChannelsData';
import { Tv, Plus, Search, Edit3, Trash2, Radio, Play, Sparkles, X } from 'lucide-react';

interface AdminChannelsManagerProps {
  channels: LiveChannel[];
  onSaveChannels: (channels: LiveChannel[]) => void;
  openCreateOnLoad?: boolean;
}

export const AdminChannelsManager: React.FC<AdminChannelsManagerProps> = ({
  channels,
  onSaveChannels,
  openCreateOnLoad = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  const [isModalOpen, setIsModalOpen] = useState(openCreateOnLoad);
  const [editingChannel, setEditingChannel] = useState<Partial<LiveChannel> | null>(
    openCreateOnLoad ? {
      category: 'قنوات الأخبار',
      quality: '1080p HD',
      isPopular: true
    } : null
  );

  const filteredChannels = channels.filter((ch) => {
    const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ch.currentProgram.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'الكل' || ch.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSaveChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChannel || !editingChannel.name) return;

    let updated: LiveChannel[];

    if (editingChannel.id) {
      updated = channels.map((c) => (c.id === editingChannel.id ? { ...c, ...editingChannel } as LiveChannel : c));
    } else {
      const newChan: LiveChannel = {
        id: `channel-${Date.now()}`,
        name: editingChannel.name || 'قناة جديدة',
        category: editingChannel.category || 'قنوات الأخبار',
        logo: editingChannel.logo || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80',
        streamUrl: editingChannel.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        currentProgram: editingChannel.currentProgram || 'بث مباشر على مدار الساعة 24/7',
        isPopular: Boolean(editingChannel.isPopular),
        quality: editingChannel.quality || '1080p HD'
      };
      updated = [newChan, ...channels];
    }

    onSaveChannels(updated);
    setIsModalOpen(false);
    setEditingChannel(null);
  };

  const handleDeleteChannel = (id: string) => {
    if (window.confirm('هل أنت تأكد من حذف هذه القناة نهائياً من البث المباشر؟')) {
      const updated = channels.filter((c) => c.id !== id);
      onSaveChannels(updated);
    }
  };

  return (
    <div className="space-y-6 font-['Cairo',sans-serif] animate-fadeIn">
      
      {/* Header Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Tv className="w-6 h-6 text-red-500 animate-pulse" />
            <h2 className="text-lg font-black text-white font-['Tajawal']">
              إدارة قنوات البث المباشر ({filteredChannels.length})
            </h2>
          </div>

          <button
            onClick={() => {
              setEditingChannel({
                category: 'قنوات الأخبار',
                quality: '1080p HD',
                isPopular: true
              });
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قناة جديدة</span>
          </button>
        </div>

        {/* Filter Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-800">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن قناة أو برنامج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none cursor-pointer"
          >
            {LIVE_CHANNEL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Grid Cards of Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChannels.map((channel) => (
          <div
            key={channel.id}
            className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-red-500/40 transition-all shadow-xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-neutral-700 shrink-0 relative bg-neutral-950">
                <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-xs line-clamp-1">{channel.name}</h3>
                </div>

                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-semibold inline-block">
                  {channel.category}
                </span>

                <p className="text-[10px] text-neutral-400 line-clamp-1">{channel.currentProgram}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => {
                  setEditingChannel(channel);
                  setIsModalOpen(true);
                }}
                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-xl transition-colors cursor-pointer"
                title="تعديل القناة"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDeleteChannel(channel.id)}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer"
                title="حذف القناة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Channel Modal */}
      {isModalOpen && editingChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-red-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-black text-white font-['Tajawal']">
                  {editingChannel.id ? 'تعديل بيانات القناة' : 'إضافة قناة بث مباشر جديدة'}
                </h3>
              </div>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingChannel(null);
                }}
                className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChannel} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-neutral-300">اسم القناة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: beIN SPORTS 1 HD"
                  value={editingChannel.name || ''}
                  onChange={(e) => setEditingChannel({ ...editingChannel, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-300">التصنيف والقسم</label>
                <select
                  value={editingChannel.category || 'قنوات الأخبار'}
                  onChange={(e) => setEditingChannel({ ...editingChannel, category: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl p-2.5 text-white cursor-pointer"
                >
                  {LIVE_CHANNEL_CATEGORIES.filter(c => c !== 'الكل').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-red-400">رابط البث المباشر (HLS / MP4 Stream URL) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://commondatastorage.googleapis.com/.../video.mp4"
                  value={editingChannel.streamUrl || ''}
                  onChange={(e) => setEditingChannel({ ...editingChannel, streamUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-red-500/50 focus:border-red-500 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-300">اسم البرنامج أو العرض الحالي</label>
                <input
                  type="text"
                  placeholder="موجز الأخبار والنشرة الرئيسية - بث مباشر"
                  value={editingChannel.currentProgram || ''}
                  onChange={(e) => setEditingChannel({ ...editingChannel, currentProgram: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-300">رابط اللوجو / الشعار</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editingChannel.logo || ''}
                  onChange={(e) => setEditingChannel({ ...editingChannel, logo: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingChannel(null);
                  }}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl font-bold"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  حفظ القناة
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
