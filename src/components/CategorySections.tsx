import React from 'react';
import { MediaItem } from '../types';
import { MediaCard } from './MediaCard';
import { 
  Tv, 
  Film, 
  Sparkles, 
  ChevronLeft, 
  Flame, 
  Globe, 
  Trophy, 
  Compass, 
  BookOpen, 
  Video, 
  Dumbbell, 
  Clapperboard,
  Layers
} from 'lucide-react';

interface CategorySectionsProps {
  items: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
  onToggleBookmark: (item: MediaItem) => void;
  isBookmarked: (id: string) => boolean;
  onToggleAlert: (item: MediaItem) => void;
  isAlerted: (id: string) => boolean;
  onSelectCategory: (category: string) => void;
}

interface SectionConfig {
  id: string;
  title: string;
  categoryFilter: string;
  icon: React.ReactNode;
  translationFilter?: 'مترجم' | 'مدبلج' | 'عربي';
  description?: string;
  fallbackType?: string;
}

export const CategorySections: React.FC<CategorySectionsProps> = ({
  items,
  onSelectMedia,
  onToggleBookmark,
  isBookmarked,
  onToggleAlert,
  isAlerted,
  onSelectCategory,
}) => {

  // Define the 16 requested sections in exact order
  const sections: SectionConfig[] = [
    {
      id: 'arabic-series',
      title: 'المسلسلات العربية',
      categoryFilter: 'مسلسلات عربي',
      icon: <Tv className="w-5 h-5 text-amber-400" />,
      description: 'أحدث المسلسلات والدراما العربية بجودة عالية'
    },
    {
      id: 'turkish-series-sub',
      title: 'المسلسلات التركية مترجمة',
      categoryFilter: 'مسلسلات تركية',
      translationFilter: 'مترجم',
      icon: <Flame className="w-5 h-5 text-red-400" />,
      description: 'أقوى المسلسلات التركية التاريخية والدرامية مترجمة'
    },
    {
      id: 'turkish-series-dub',
      title: 'المسلسلات التركية مدبلجة',
      categoryFilter: 'مسلسلات تركية',
      translationFilter: 'مدبلج',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      description: 'أحدث الأعمال التركية مدبلجة باللغة العربية'
    },
    {
      id: 'indian-series',
      title: 'المسلسلات الهندية',
      categoryFilter: 'مسلسلات هندية',
      icon: <Globe className="w-5 h-5 text-orange-400" />,
      description: 'أجمل المسلسلات الهندية الرومانسية والدرامية'
    },
    {
      id: 'foreign-series',
      title: 'المسلسلات الأجنبية',
      categoryFilter: 'مسلسلات اجنبي',
      icon: <Clapperboard className="w-5 h-5 text-indigo-400" />,
      description: 'أفضل المسلسلات العالمية والأجنبية المترجمة'
    },
    {
      id: 'arabic-movies',
      title: 'الأفلام العربية',
      categoryFilter: 'افلام عربي',
      icon: <Film className="w-5 h-5 text-amber-400" />,
      description: 'أحدث الأفلام العربية والسينما المصرية والخليجية'
    },
    {
      id: 'turkish-movies',
      title: 'الأفلام التركية',
      categoryFilter: 'افلام تركية',
      icon: <Video className="w-5 h-5 text-red-400" />,
      description: 'أروع الأفلام التركية الدرامية والرومانسية'
    },
    {
      id: 'indian-movies',
      title: 'الأفلام الهندية',
      categoryFilter: 'افلام هندي',
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      description: 'أحدث أفلام بوليوود الأكشن والدراما المترجمة'
    },
    {
      id: 'foreign-movies',
      title: 'الأفلام الأجنبية',
      categoryFilter: 'افلام اجنبي',
      icon: <Film className="w-5 h-5 text-blue-400" />,
      description: 'أحدث هوليوود والأفلام الأجنبية الحصرية 1080p'
    },
    {
      id: 'wrestling-shows',
      title: 'المصارعة والعروض',
      categoryFilter: 'عروض مصارعة',
      icon: <Dumbbell className="w-5 h-5 text-yellow-400" />,
      description: 'عروض المصارعة الحرة WWE ومواجهات الحلبة المباشرة'
    },
    {
      id: 'documentary-movies',
      title: 'الأفلام الوثائقية',
      categoryFilter: 'افلام وثائقية',
      icon: <Compass className="w-5 h-5 text-teal-400" />,
      description: 'أقوى الأفلام الوثائقية واستكشاف الطبيعة والعلوم'
    },
    {
      id: 'sports-matches',
      title: 'المباريات والرياضة',
      categoryFilter: 'مباريات ورياضة',
      icon: <Trophy className="w-5 h-5 text-emerald-400" />,
      description: 'ملخصات المباريات الكبرى ودوري أبطال أوروبا والكلاسيكو'
    },
    {
      id: 'anime-movies',
      title: 'أفلام أنمي',
      categoryFilter: 'افلام انمي',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      description: 'أفلام الأنمي اليابانية المترجمة والمدبلجة'
    },
    {
      id: 'anime-series',
      title: 'مسلسلات أنمي',
      categoryFilter: 'مسلسلات انمي',
      icon: <Layers className="w-5 h-5 text-pink-400" />,
      description: 'أحدث مواسم مسلسلات الأنمي اليابانية مترجمة'
    },
    {
      id: 'religious-encyclopedia',
      title: 'الموسوعة الدينية',
      categoryFilter: 'الموسوعة الدينية',
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
      description: 'قصص الأنبياء والسيرة النبوية العطرة والدروس الدينية'
    },
    {
      id: 'tv-shows',
      title: 'البرامج التلفزيونية',
      categoryFilter: 'برامج تلفزيونية',
      icon: <Tv className="w-5 h-5 text-amber-400" />,
      description: 'أحدث البرامج التلفزيونية الاجتماعية والعلمية'
    }
  ];

  const getSectionItems = (config: SectionConfig): MediaItem[] => {
    let filtered = items.filter((item) => {
      // Category check
      const matchesCategory = item.category === config.categoryFilter || 
        (config.categoryFilter === 'مسلسلات تركية' && item.category === 'مسلسلات تركية') ||
        (config.categoryFilter === 'مسلسلات مدبلجة' && (item.category === 'مسلسلات مدبلجة' || item.translation === 'مدبلج'));

      // Translation check
      if (config.translationFilter) {
        return matchesCategory && (item.translation === config.translationFilter || item.language?.includes(config.translationFilter));
      }

      return matchesCategory;
    });

    // Fallback logic if filter returns fewer than 3 items to ensure a rich UI
    if (filtered.length < 3) {
      const extraItems = items.filter((item) => 
        !filtered.some((f) => f.id === item.id) &&
        (item.type === (config.categoryFilter.includes('افلام') ? 'movie' : 'series'))
      );
      filtered = [...filtered, ...extraItems];
    }

    return filtered.slice(0, 5); // Display top 5 items per row
  };

  return (
    <div className="space-y-12 my-10">
      {sections.map((section) => {
        const sectionItems = getSectionItems(section);

        if (sectionItems.length === 0) return null;

        return (
          <section key={section.id} className="space-y-4">
            
            {/* Section Header */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-neutral-800">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-lg shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-base sm:text-xl font-extrabold text-white font-['Tajawal'] tracking-tight flex items-center gap-2">
                    <span>{section.title}</span>
                  </h2>
                  {section.description && (
                    <p className="text-xs text-neutral-400 hidden sm:block">
                      {section.description}
                    </p>
                  )}
                </div>
              </div>

              {/* View All Button */}
              <button
                onClick={() => {
                  onSelectCategory(section.categoryFilter);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/50 text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <span>عرض الكل</span>
                <ChevronLeft className="w-4 h-4" />
              </button>

            </div>

            {/* Media Items Row / Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {sectionItems.map((item) => (
                <MediaCard
                  key={`${section.id}-${item.id}`}
                  item={item}
                  onSelect={onSelectMedia}
                  onToggleBookmark={onToggleBookmark}
                  isBookmarked={isBookmarked(item.id)}
                  onToggleAlert={onToggleAlert}
                  isAlerted={isAlerted(item.id)}
                />
              ))}
            </div>

          </section>
        );
      })}
    </div>
  );
};
