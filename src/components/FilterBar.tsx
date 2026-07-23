import React from 'react';
import { FilterSortOption } from '../types';
import { CATEGORIES, GENRES, YEARS, QUALITIES } from '../data/mediaData';
import { Sparkles, Star, Eye, Pin, Film, Tv, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  activeSort: FilterSortOption;
  setActiveSort: (sort: FilterSortOption) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedQuality: string;
  setSelectedQuality: (q: string) => void;
  totalResultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeSort,
  setActiveSort,
  selectedCategory,
  setSelectedCategory,
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  selectedQuality,
  setSelectedQuality,
  totalResultsCount
}) => {

  const sortTabs = [
    { id: 'latest' as FilterSortOption, label: 'الأحدث', icon: Sparkles },
    { id: 'imdbRating' as FilterSortOption, label: 'الأعلى تقييماً', icon: Star },
    { id: 'views' as FilterSortOption, label: 'الأكثر مشاهدة', icon: Eye },
    { id: 'pinned' as FilterSortOption, label: 'المثبت', icon: Pin },
    { id: 'newMovies' as FilterSortOption, label: 'جديد الأفلام', icon: Film },
    { id: 'newEpisodes' as FilterSortOption, label: 'جديد الحلقات', icon: Tv },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Primary Sort Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-800">
        {sortTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSort === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSort(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-amber-300 border border-neutral-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Taxonomy Filters Bar */}
      <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
            <SlidersHorizontal className="w-4 h-4" />
            <span>التصفية المتقدمة - الأمير نت</span>
          </div>

          <span className="text-xs text-neutral-400 font-medium">
            عرض <strong className="text-amber-400">{totalResultsCount}</strong> عمل سينمائي
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          
          {/* Category Selector */}
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1 font-semibold">قسم العرض</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Genre Selector */}
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1 font-semibold">نوع العمل</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1 font-semibold">سنة الإنتاج</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Quality Selector */}
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1 font-semibold">الجودة</label>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500"
            >
              {QUALITIES.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

        </div>
      </div>
    </div>
  );
};
