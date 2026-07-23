import React, { useState, useEffect } from 'react';
import { MediaItem } from '../../types';
import { 
  getStoredCategoryItems, 
  saveStoredCategoryItems, 
  CategoryItem, 
  CategoryType 
} from '../../data/storageManager';
import { 
  FolderKanban, Plus, Edit3, Trash2, ArrowUp, ArrowDown, 
  Film, Tv, Trophy, Radio, CheckCircle2, X 
} from 'lucide-react';

interface AdminCategoriesManagerProps {
  categories: string[];
  mediaItems: MediaItem[];
  onSaveCategories: (categories: string[]) => void;
}

export const AdminCategoriesManager: React.FC<AdminCategoriesManagerProps> = ({
  categories,
  mediaItems,
  onSaveCategories
}) => {
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>(() => getStoredCategoryItems());

  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<CategoryType>('movie');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<CategoryType>('movie');

  useEffect(() => {
    saveStoredCategoryItems(categoryItems);
    onSaveCategories(categoryItems.map(c => c.name));
  }, [categoryItems]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;

    if (categoryItems.some(c => c.name === trimmed)) {
      alert('هذا القسم موجود بالفعل!');
      return;
    }

    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      type: newCatType,
      order: categoryItems.length
    };

    const updated = [...categoryItems, newCat];
    setCategoryItems(updated);
    setNewCatName('');
  };

  const handleSaveEdit = (id: string) => {
    const trimmed = editName.trim();
    if (!trimmed) return;

    const updated = categoryItems.map(c => 
      c.id === id ? { ...c, name: trimmed, type: editType } : c
    );
    setCategoryItems(updated);
    setEditingId(null);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (name === 'الكل') {
      alert('لا يمكن حذف قسم الكل الرئيسي');
      return;
    }

    if (window.confirm(`هل أنت تأكد من حذف قسم "${name}"؟`)) {
      const updated = categoryItems.filter(c => c.id !== id);
      setCategoryItems(updated);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...categoryItems];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;

    // reindex order
    updated.forEach((item, idx) => {
      item.order = idx;
    });

    setCategoryItems(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === categoryItems.length - 1) return;
    const updated = [...categoryItems];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;

    updated.forEach((item, idx) => {
      item.order = idx;
    });

    setCategoryItems(updated);
  };

  const getTypeIcon = (type: CategoryType) => {
    switch (type) {
      case 'movie':
        return <Film className="w-4 h-4 text-amber-400" />;
      case 'series':
        return <Tv className="w-4 h-4 text-emerald-400" />;
      case 'sports':
        return <Trophy className="w-4 h-4 text-red-400" />;
      case 'tvshow':
        return <Radio className="w-4 h-4 text-purple-400" />;
    }
  };

  const getTypeName = (type: CategoryType) => {
    switch (type) {
      case 'movie': return 'أفلام سينمائية';
      case 'series': return 'مسلسلات درامية';
      case 'sports': return 'رياضة ومباريات';
      case 'tvshow': return 'برامج تلفزيونية';
    }
  };

  return (
    <div className="space-y-6 font-['Cairo',sans-serif] animate-fadeIn">
      
      {/* Top Banner & Add New Category Form */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-6 h-6 text-amber-400" />
          <div>
            <h2 className="text-lg font-black text-white font-['Tajawal']">
              إدارة وتنسيق وترتيب الأقسام ({categoryItems.length})
            </h2>
            <p className="text-xs text-neutral-400">
              يمكنك إضافة أسطر وأقسام جديدة مع تحديد نوع القسم (أفلام، مسلسلات، رياضة ومباريات، برامج تلفزيونية) وإعادة ترتيبها بالكامل.
            </p>
          </div>
        </div>

        {/* Form to create new category */}
        <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-neutral-800">
          <input
            type="text"
            required
            placeholder="اسم القسم الجديد (مثال: برامج رمضانية، مسلسلات تركية، مباريات اليوم...)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="md:col-span-6 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />

          <select
            value={newCatType}
            onChange={(e) => setNewCatType(e.target.value as CategoryType)}
            className="md:col-span-4 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-neutral-200 focus:outline-none cursor-pointer"
          >
            <option value="movie">🎬 نوع القسم: أفلام سينمائية</option>
            <option value="series">📺 نوع القسم: مسلسلات درامية</option>
            <option value="sports">⚽ نوع القسم: رياضة ومباريات ومصارعة</option>
            <option value="tvshow">🎙️ نوع القسم: برامج تلفزيونية</option>
          </select>

          <button
            type="submit"
            className="md:col-span-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة القسم</span>
          </button>
        </form>
      </div>

      {/* List of Categories */}
      <div className="space-y-3">
        {categoryItems.map((cat, idx) => {
          const itemCount = mediaItems.filter((m) => m.category === cat.name).length;
          const isEditing = editingId === cat.id;

          return (
            <div
              key={cat.id}
              className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 transition-all shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              {isEditing ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 w-full">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-amber-500 rounded-xl px-3 py-2 text-xs text-white w-full"
                  />

                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as CategoryType)}
                    className="bg-neutral-950 border border-amber-500 rounded-xl px-3 py-2 text-xs text-white w-full sm:w-auto"
                  >
                    <option value="movie">🎬 أفلام</option>
                    <option value="series">📺 مسلسلات</option>
                    <option value="sports">⚽ رياضة ومباريات</option>
                    <option value="tvshow">🎙️ برامج تلفزيونية</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveEdit(cat.id)}
                      className="px-3 py-2 bg-emerald-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>حفظ</span>
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-2 bg-neutral-800 text-neutral-300 font-bold rounded-xl text-xs"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  
                  {/* Order Index */}
                  <span className="w-7 h-7 rounded-lg bg-neutral-800 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  {/* Type Icon Badge */}
                  <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 shrink-0">
                    {getTypeIcon(cat.type)}
                  </div>

                  {/* Name and count */}
                  <div>
                    <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold">
                        {getTypeName(cat.type)}
                      </span>
                    </h3>
                    <p className="text-[10px] text-neutral-400">{itemCount} عمل مضاف في هذا القسم</p>
                  </div>

                </div>
              )}

              {/* Actions & Ordering Arrows */}
              {!isEditing && (
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  
                  {/* Up / Down Reorder */}
                  <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-1.5 hover:bg-neutral-800 text-amber-400 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === categoryItems.length - 1}
                      className="p-1.5 hover:bg-neutral-800 text-amber-400 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  {cat.name !== 'الكل' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditName(cat.name);
                          setEditType(cat.type);
                        }}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-xl transition-colors cursor-pointer"
                        title="تعديل القسم"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer"
                        title="حذف القسم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
