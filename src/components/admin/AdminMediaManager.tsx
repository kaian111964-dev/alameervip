import React, { useState } from 'react';
import { MediaItem, Season, Episode, VideoServer, MediaType } from '../../types';
import { 
  Plus, Search, Edit3, Trash2, Layers, Film, Tv, Video, Play, 
  CheckCircle2, X, Sparkles, ChevronDown, ChevronRight, Save, Eye, Star, Link, ExternalLink
} from 'lucide-react';

interface AdminMediaManagerProps {
  mediaItems: MediaItem[];
  categories: string[];
  onSaveMediaItems: (items: MediaItem[]) => void;
  openCreateOnLoad?: boolean;
}

export const AdminMediaManager: React.FC<AdminMediaManagerProps> = ({
  mediaItems,
  categories,
  onSaveMediaItems,
  openCreateOnLoad = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(openCreateOnLoad);
  const [editingItem, setEditingItem] = useState<Partial<MediaItem> | null>(
    openCreateOnLoad ? {
      type: 'movie',
      category: categories[1] || 'افلام اجنبي',
      year: 2026,
      rating: 8.5,
      views: 1200,
      quality: '1080p WEB-DL',
      translation: 'مترجم',
      genre: ['دراما', 'إثارة'],
      servers: [],
      downloadLinks: []
    } : null
  );

  // Seasons & Episodes Modal for Series
  const [hierarchyItem, setHierarchyItem] = useState<MediaItem | null>(null);
  const [activeSeasonIndex, setActiveSeasonIndex] = useState<number>(0);

  // New Season Input State inside Hierarchy Modal
  const [newSeasonTitle, setNewSeasonTitle] = useState('');

  // New Episode Input State inside Hierarchy Modal
  const [newEpNumber, setNewEpNumber] = useState<number>(1);
  const [newEpTitle, setNewEpTitle] = useState('');
  const [newEpDuration, setNewEpDuration] = useState('45 دقيقة');
  const [newEpUrl, setNewEpUrl] = useState('');

  // Filter logic
  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.englishTitle && item.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesType && matchesCat;
  });

  // Handle Save (Add or Update) Media Item
  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title) return;

    let updatedList: MediaItem[];

    if (editingItem.id) {
      // Update existing
      updatedList = mediaItems.map((item) => 
        item.id === editingItem.id ? { ...item, ...editingItem } as MediaItem : item
      );
    } else {
      // Create new
      const newItem: MediaItem = {
        id: `media-${Date.now()}`,
        title: editingItem.title || 'عنوان جديد',
        englishTitle: editingItem.englishTitle || '',
        type: (editingItem.type as MediaType) || 'movie',
        category: editingItem.category || categories[1] || 'افلام اجنبي',
        genre: editingItem.genre || ['دراما'],
        year: Number(editingItem.year) || 2026,
        quality: editingItem.quality || '1080p WEB-DL',
        rating: Number(editingItem.rating) || 8.0,
        views: Number(editingItem.views) || 500,
        isPinned: Boolean(editingItem.isPinned),
        poster: editingItem.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
        backdrop: editingItem.backdrop || editingItem.poster,
        synopsis: editingItem.synopsis || 'لا يوجد وصف للمادة حالياً.',
        duration: editingItem.duration || '120 دقيقة',
        translation: editingItem.translation || 'مترجم',
        videoUrl: editingItem.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        servers: editingItem.servers || [
          { id: 'srv-1', name: 'سيرفر الأمير HD', url: editingItem.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', quality: '1080p' }
        ],
        seasons: editingItem.type === 'series' || editingItem.type === 'ramadan' ? [
          {
            id: 1,
            seasonNumber: 1,
            title: 'الموسم الأول',
            episodes: [
              { id: 1, number: 1, title: 'الحلقة الأولى', duration: '45 دقيقة', videoUrl: editingItem.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }
            ]
          }
        ] : undefined
      };
      updatedList = [newItem, ...mediaItems];
    }

    onSaveMediaItems(updatedList);
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  // Handle Delete Media
  const handleDeleteMedia = (id: string) => {
    if (window.confirm('هل أنت تأكد من إزالة هذا العنصر نهائياً من قاعدة البيانات؟')) {
      const updatedList = mediaItems.filter((item) => item.id !== id);
      onSaveMediaItems(updatedList);
    }
  };

  // Hierarchy Season Management
  const handleAddSeason = () => {
    if (!hierarchyItem) return;

    const currentSeasons = hierarchyItem.seasons || [];
    const nextSeasonNum = currentSeasons.length + 1;
    const newSeasonObj: Season = {
      id: Date.now(),
      seasonNumber: nextSeasonNum,
      title: newSeasonTitle.trim() || `الموسم ${nextSeasonNum}`,
      episodes: [
        {
          id: Date.now() + 1,
          number: 1,
          title: 'الحلقة الأولى',
          duration: '45 دقيقة',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        }
      ]
    };

    const updatedSeasons = [...currentSeasons, newSeasonObj];
    const updatedMedia: MediaItem = {
      ...hierarchyItem,
      seasonsCount: updatedSeasons.length,
      seasons: updatedSeasons
    };

    // Update state & persistence
    setHierarchyItem(updatedMedia);
    setActiveSeasonIndex(updatedSeasons.length - 1);
    setNewSeasonTitle('');

    const updatedList = mediaItems.map((m) => (m.id === updatedMedia.id ? updatedMedia : m));
    onSaveMediaItems(updatedList);
  };

  const handleDeleteSeason = (sIndex: number) => {
    if (!hierarchyItem || !hierarchyItem.seasons) return;
    if (window.confirm('هل تريد حذف هذا الموسم وجميع حلقاته؟')) {
      const updatedSeasons = hierarchyItem.seasons.filter((_, idx) => idx !== sIndex);
      const updatedMedia: MediaItem = {
        ...hierarchyItem,
        seasonsCount: updatedSeasons.length,
        seasons: updatedSeasons
      };

      setHierarchyItem(updatedMedia);
      setActiveSeasonIndex(Math.max(0, sIndex - 1));

      const updatedList = mediaItems.map((m) => (m.id === updatedMedia.id ? updatedMedia : m));
      onSaveMediaItems(updatedList);
    }
  };

  // Hierarchy Episode Management
  const handleAddEpisode = () => {
    if (!hierarchyItem || !hierarchyItem.seasons || hierarchyItem.seasons.length === 0) return;

    const currentSeason = hierarchyItem.seasons[activeSeasonIndex];
    if (!currentSeason) return;

    const nextEpNum = newEpNumber || (currentSeason.episodes.length + 1);
    const newEp: Episode = {
      id: Date.now(),
      number: nextEpNum,
      title: newEpTitle.trim() || `الحلقة ${nextEpNum}`,
      duration: newEpDuration || '45 دقيقة',
      videoUrl: newEpUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      servers: [
        {
          id: `srv-ep-${Date.now()}`,
          name: 'سيرفر الأمير السريع',
          url: newEpUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          quality: '1080p'
        }
      ]
    };

    const updatedEpisodes = [...currentSeason.episodes, newEp];
    const updatedSeasons = hierarchyItem.seasons.map((s, idx) => 
      idx === activeSeasonIndex ? { ...s, episodes: updatedEpisodes } : s
    );

    const updatedMedia: MediaItem = {
      ...hierarchyItem,
      episodes: updatedEpisodes, // sync flat
      seasons: updatedSeasons
    };

    setHierarchyItem(updatedMedia);
    setNewEpTitle('');
    setNewEpUrl('');
    setNewEpNumber(nextEpNum + 1);

    const updatedList = mediaItems.map((m) => (m.id === updatedMedia.id ? updatedMedia : m));
    onSaveMediaItems(updatedList);
  };

  const handleDeleteEpisode = (epId: number) => {
    if (!hierarchyItem || !hierarchyItem.seasons) return;

    const currentSeason = hierarchyItem.seasons[activeSeasonIndex];
    if (!currentSeason) return;

    const updatedEpisodes = currentSeason.episodes.filter((ep) => ep.id !== epId);
    const updatedSeasons = hierarchyItem.seasons.map((s, idx) => 
      idx === activeSeasonIndex ? { ...s, episodes: updatedEpisodes } : s
    );

    const updatedMedia: MediaItem = {
      ...hierarchyItem,
      seasons: updatedSeasons
    };

    setHierarchyItem(updatedMedia);

    const updatedList = mediaItems.map((m) => (m.id === updatedMedia.id ? updatedMedia : m));
    onSaveMediaItems(updatedList);
  };

  return (
    <div className="space-y-6 font-['Cairo',sans-serif] animate-fadeIn">
      
      {/* Search & Filter Header Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-amber-400" />
            <h2 className="text-lg font-black text-white font-['Tajawal']">
              إدارة الأفلام والمسلسلات ({filteredItems.length})
            </h2>
          </div>

          <button
            onClick={() => {
              setEditingItem({
                type: 'movie',
                category: categories[1] || 'افلام اجنبي',
                year: 2026,
                rating: 8.5,
                views: 1200,
                quality: '1080p WEB-DL',
                translation: 'مترجم',
                genre: ['دراما', 'إثارة'],
                servers: [
                  { id: 'srv-1', name: 'سيرفر الأمير Full HD', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', quality: '1080p' }
                ],
                downloadLinks: []
              });
              setIsEditModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فيلم / مسلسل جديد</span>
          </button>

        </div>

        {/* Filter Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-800">
          
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث بالاسم العربي أو الإنجليزي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Type Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none cursor-pointer"
          >
            <option value="all">جميع الأنواع (أفلام ومسلسلات وبرامج)</option>
            <option value="movie">أفلام فقط</option>
            <option value="series">مسلسلات فقط</option>
            <option value="ramadan">مسلسلات رمضان 2026</option>
            <option value="tvshow">برامج تلفزيونية</option>
            <option value="wrestling">مصارعة حرة ومباريات</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none cursor-pointer"
          >
            <option value="all">جميع الأقسام والتصنيفات</option>
            {categories.filter(c => c !== 'الكل').map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

        </div>

      </div>

      {/* Media Items Grid Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl shadow-xl overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-neutral-950 text-neutral-400 font-bold border-b border-neutral-800">
              <tr>
                <th className="p-4">البوستر والعمل</th>
                <th className="p-4">النوع والترجمة</th>
                <th className="p-4">القسم</th>
                <th className="p-4">السنة والتقييم</th>
                <th className="p-4">المشاهدات</th>
                <th className="p-4 text-center">التحكم والإجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-950/60 transition-colors">
                  
                  {/* Poster & Title */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 rounded-xl overflow-hidden border border-neutral-700 shrink-0 relative bg-neutral-950">
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                        {item.isPinned && (
                          <span className="absolute top-1 right-1 bg-amber-500 text-neutral-950 text-[8px] font-black px-1 rounded">مثبت</span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-extrabold text-white text-xs line-clamp-1">{item.title}</h3>
                        {item.englishTitle && (
                          <p className="text-[10px] text-neutral-400 line-clamp-1">{item.englishTitle}</p>
                        )}
                        <span className="inline-block text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {item.quality}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Type & Translation */}
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border inline-block ${
                        item.type === 'movie' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}>
                        {item.type === 'movie' ? '🎬 فيلم' : '📺 مسلسل'}
                      </span>
                      <div className="text-[10px] text-neutral-400 font-semibold">
                        الترجمة: <strong className="text-amber-400">{item.translation || 'مترجم'}</strong>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4 font-bold text-neutral-300">
                    {item.category}
                  </td>

                  {/* Rating & Year */}
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{item.rating} / 10</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">{item.year}</span>
                    </div>
                  </td>

                  {/* Views */}
                  <td className="p-4 font-bold text-emerald-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{item.views.toLocaleString('ar-EG')}</span>
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      
                      {/* Nested Season/Episode Manager for Series */}
                      {(item.type === 'series' || item.type === 'ramadan') && (
                        <button
                          onClick={() => {
                            setHierarchyItem(item);
                            setActiveSeasonIndex(0);
                          }}
                          className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title="إدارة المواسم والحلقات"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>المواسم والحلقات</span>
                        </button>
                      )}

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-xl transition-colors cursor-pointer"
                        title="تعديل البيانات"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteMedia(item.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* 1. ADD / EDIT MEDIA ITEM MODAL */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-neutral-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white font-['Tajawal']">
                  {editingItem.id ? 'تعديل بيانات المحتوى' : 'إضافة فيلم / مسلسل جديد'}
                </h3>
              </div>

              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">العنوان بالعربي *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: فيلم Oppenheimer 2023 مترجم"
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white"
                  />
                </div>

                {/* English Title */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">العنوان الإنجليزي</label>
                  <input
                    type="text"
                    placeholder="Oppenheimer"
                    value={editingItem.englishTitle || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, englishTitle: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white"
                  />
                </div>

                {/* Type */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">نوع المحتوى</label>
                  <select
                    value={editingItem.type || 'movie'}
                    onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as MediaType })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white cursor-pointer"
                  >
                    <option value="movie">🎬 فيلم سينمائي</option>
                    <option value="series">📺 مسلسل درامي</option>
                    <option value="ramadan">🌙 مسلسلات رمضان 2026</option>
                    <option value="tvshow">🎙️ برامج تلفزيونية وإعلامية</option>
                    <option value="wrestling">⚽ مصارعة حرة ومباريات</option>
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">القسم الرئيسي</label>
                  <select
                    value={editingItem.category || categories[1]}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white cursor-pointer"
                  >
                    {categories.filter(c => c !== 'الكل').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Translation status */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">حالة الترجمة والدوبلاج</label>
                  <select
                    value={editingItem.translation || 'مترجم'}
                    onChange={(e) => setEditingItem({ ...editingItem, translation: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white cursor-pointer"
                  >
                    <option value="مترجم">مترجم (عربي)</option>
                    <option value="مدبلج">مدبلج (صوت عربي)</option>
                    <option value="عربي">عربي أصلي</option>
                  </select>
                </div>

                {/* Quality */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">الجودة</label>
                  <input
                    type="text"
                    placeholder="1080p WEB-DL / 4K UHD"
                    value={editingItem.quality || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, quality: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white"
                  />
                </div>

                {/* Poster Image URL */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">رابط صورة البوستر</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingItem.poster || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, poster: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white"
                  />
                </div>

                {/* Year */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">سنة الإنتاج</label>
                  <input
                    type="number"
                    value={editingItem.year || 2026}
                    onChange={(e) => setEditingItem({ ...editingItem, year: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white"
                  />
                </div>

                {/* Video Stream URL */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-amber-400">رابط سيرفر المشاهدة المباشر (MP4 / HLS Video URL)</label>
                  <input
                    type="url"
                    placeholder="https://commondatastorage.googleapis.com/.../video.mp4"
                    value={editingItem.videoUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-amber-500/50 focus:border-amber-500 rounded-xl p-2.5 text-white"
                  />
                </div>

                {/* Synopsis */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-neutral-300">قصة وملخص العمل</label>
                  <textarea
                    rows={3}
                    placeholder="أدخل ملخص قصة الفيلم أو المسلسل..."
                    value={editingItem.synopsis || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, synopsis: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white"
                  />
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-5 py-2.5 bg-neutral-800 text-neutral-300 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  حفظ البيانات فوراً
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 2. SERIES SEASONS & EPISODES HIERARCHY MODAL */}
      {hierarchyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-neutral-900 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden my-8 p-6 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-12 rounded-xl overflow-hidden border border-amber-500/40 shrink-0">
                  <img src={hierarchyItem.poster} alt={hierarchyItem.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Tajawal']">
                    إدارة هيكل المواسم والحلقات: {hierarchyItem.title}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    يمكنك إضافة مواسم متعددة وتفصيل الحلقات ورابط الفيديو لكل حلقة بشكل كامل.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setHierarchyItem(null)}
                className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Season Tabs Header */}
            <div className="space-y-4">
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="text-xs font-bold text-amber-400">المواسم المتاحة:</h4>
                
                {/* Add New Season Form */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="عنوان الموسم (مثال: الموسم الثاني)"
                    value={newSeasonTitle}
                    onChange={(e) => setNewSeasonTitle(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500"
                  />
                  <button
                    onClick={handleAddSeason}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة موسم</span>
                  </button>
                </div>
              </div>

              {/* Seasons Tab List */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800 scrollbar-none">
                {(hierarchyItem.seasons || []).map((season, idx) => (
                  <div key={season.id || idx} className="flex items-center">
                    <button
                      onClick={() => setActiveSeasonIndex(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        activeSeasonIndex === idx
                          ? 'bg-amber-500 text-neutral-950 shadow-md'
                          : 'bg-neutral-950 text-neutral-300 border border-neutral-800 hover:border-amber-500/40'
                      }`}
                    >
                      <span>{season.title || `الموسم ${season.seasonNumber || idx + 1}`}</span>
                      <span className="text-[10px] bg-neutral-900/40 px-1.5 py-0.5 rounded">
                        ({season.episodes.length} حلقة)
                      </span>
                    </button>

                    {hierarchyItem.seasons && hierarchyItem.seasons.length > 1 && (
                      <button
                        onClick={() => handleDeleteSeason(idx)}
                        className="p-1 text-neutral-500 hover:text-red-400 mr-1"
                        title="حذف هذا الموسم"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

            </div>

            {/* Active Season Episodes Management */}
            {hierarchyItem.seasons && hierarchyItem.seasons[activeSeasonIndex] && (
              <div className="space-y-6 pt-2">
                
                {/* Form to Add New Episode inside Season */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>إضافة حلقة جديدة إلى ({hierarchyItem.seasons[activeSeasonIndex].title}):</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-neutral-400">رقم الحلقة</label>
                      <input
                        type="number"
                        value={newEpNumber}
                        onChange={(e) => setNewEpNumber(Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-xl p-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400">عنوان الحلقة</label>
                      <input
                        type="text"
                        placeholder="مثال: الحلقة الأخيرة"
                        value={newEpTitle}
                        onChange={(e) => setNewEpTitle(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-xl p-2 text-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-neutral-400">رابط تشغيل الفيديو MP4</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newEpUrl}
                        onChange={(e) => setNewEpUrl(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-xl p-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="text-left">
                    <button
                      onClick={handleAddEpisode}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow cursor-pointer"
                    >
                      تأكيد إضافة الحلقة
                    </button>
                  </div>
                </div>

                {/* Episodes List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-neutral-300">
                    قائمة الحلقات الحالية ({hierarchyItem.seasons[activeSeasonIndex].episodes.length}):
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {hierarchyItem.seasons[activeSeasonIndex].episodes.map((ep) => (
                      <div
                        key={ep.id}
                        className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold flex items-center justify-center shrink-0">
                            {ep.number}
                          </div>
                          <div>
                            <h5 className="font-bold text-white">{ep.title || `الحلقة ${ep.number}`}</h5>
                            <p className="text-[10px] text-neutral-500 truncate max-w-[180px]">{ep.videoUrl}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteEpisode(ep.id)}
                          className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                          title="حذف الحلقة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            <div className="pt-4 border-t border-neutral-800 text-left">
              <button
                onClick={() => setHierarchyItem(null)}
                className="px-6 py-2.5 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                إغلاق وحفظ التغييرات
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
