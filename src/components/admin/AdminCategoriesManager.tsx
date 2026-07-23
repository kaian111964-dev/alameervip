import React, { useState } from 'react';
import { MediaItem } from '../../types';
import { FolderKanban, Plus, Edit3, Trash2, Layers, CheckCircle2, X } from 'lucide-react';

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
  const [newCatName, setNewCatName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed || categories.includes(trimmed)) return;

    const updated = [...categories, trimmed];
    onSaveCategories(updated);
    setNewCatName('');
  };

  const handleSaveEdit = (idx: number) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;

    const updated = categories.map((c, i) => (i === idx ? trimmed : c));
    onSaveCategories(updated);
    setEditingIndex(null);
    setEditValue('');
  };

  const handleDeleteCategory = (idx: number, catName: string) => {
    if (catName === 'الكل') {
      alert('لا يمكن حذف قسم الكل الرئيسي');
      return;
    }

    if (window.confirm(`هل أنت تأكد من حذف قسم "${catName}"؟`)) {
      const updated = categories.filter((_, i) => i !== idx);
      onSaveCategories(updated);
    }
  };

  return (
    <div className="space-y-6 font-['Cairo',sans-serif] animate-fadeIn">
      
      {/* Top Banner & Add New Category Form */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-6 h-6 text-indigo-400" />
          <div>
            <h2 className="text-lg font-black text-white font-['Tajawal']">
              إدارة الأقسام والتصنيفات ({categories.length})
            </h2>
            <p className="text-xs text-neutral-400">
              يمكنك إضافة أسطر وأقسام جديدة تظهر في الهيدر والقوائم المنسدلة بالموقع.
            </p>
          </div>
        </div>

        {/* Form to create new category */}
        <form onSubmit={handleAddCategory} className="flex items-center gap-3 pt-3 border-t border-neutral-800">
          <input
            type="text"
            required
            placeholder="أدخل اسم القسم الجديد (مثال: مسلسلات كورية، أفلام أنمي...)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة القسم</span>
          </button>
        </form>
      </div>

      {/* List of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat, idx) => {
          const itemCount = mediaItems.filter((m) => m.category === cat).length;
          const isEditing = editingIndex === idx;

          return (
            <div
              key={cat + idx}
              className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-indigo-500/40 transition-all shadow-xl flex items-center justify-between gap-3"
            >
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-indigo-500 rounded-lg px-2 py-1 text-xs text-white"
                  />
                  <button
                    onClick={() => handleSaveEdit(idx)}
                    className="p-1.5 bg-emerald-500 text-neutral-950 rounded-lg font-bold"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-xs">{cat}</h3>
                  <p className="text-[10px] text-neutral-400">{itemCount} عمل مرئي مضاف</p>
                </div>
              )}

              {cat !== 'الكل' && !isEditing && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingIndex(idx);
                      setEditValue(cat);
                    }}
                    className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-lg transition-colors cursor-pointer"
                    title="تعديل اسم القسم"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(idx, cat)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                    title="حذف القسم"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
