import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { FilterBar } from './components/FilterBar';
import { MediaCard } from './components/MediaCard';
import { CategorySections } from './components/CategorySections';
import { MediaDetailPage } from './components/MediaDetailPage';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { Footer } from './components/Footer';
import { AnnouncementCard } from './components/AnnouncementCard';
import { LiveTvSection } from './components/LiveTvSection';
import { LiveTvPage } from './components/LiveTvPage';
import { AuthModal } from './components/AuthModal';
import { PackagesModal } from './components/PackagesModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { 
  getStoredMediaItems, 
  saveStoredMediaItems, 
  getStoredLiveChannels, 
  saveStoredLiveChannels, 
  getStoredCategories, 
  saveStoredCategories 
} from './data/storageManager';
import { MediaItem, FilterSortOption } from './types';
import { LiveChannel } from './data/liveChannelsData';
import { Sparkles, ShieldCheck, Film, X } from 'lucide-react';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedGenre, setSelectedGenre] = useState('الكل');
  const [selectedYear, setSelectedYear] = useState('الكل');
  const [selectedQuality, setSelectedQuality] = useState('الكل');
  const [activeSort, setActiveSort] = useState<FilterSortOption>('latest');

  // Dynamic Persistent State
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => getStoredMediaItems());
  const [liveChannels, setLiveChannels] = useState<LiveChannel[]>(() => getStoredLiveChannels());
  const [categories, setCategories] = useState<string[]>(() => getStoredCategories());

  // View States
  const [selectedMediaDetail, setSelectedMediaDetail] = useState<MediaItem | null>(null);
  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState(false);
  const [isLiveTvPageOpen, setIsLiveTvPageOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPackagesModalOpen, setIsPackagesModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [activeLiveChannel, setActiveLiveChannel] = useState<LiveChannel | null>(null);

  // Persistence Updaters
  const handleSaveMediaItems = (newItems: MediaItem[]) => {
    setMediaItems(newItems);
    saveStoredMediaItems(newItems);
  };

  const handleSaveLiveChannels = (newChannels: LiveChannel[]) => {
    setLiveChannels(newChannels);
    saveStoredLiveChannels(newChannels);
  };

  const handleSaveCategories = (newCategories: string[]) => {
    setCategories(newCategories);
    saveStoredCategories(newCategories);
  };

  // User auth state persisted in localStorage
  const [userName, setUserName] = useState<string | null>(() => {
    try {
      return localStorage.getItem('alameer_user_name');
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (name: string) => {
    setUserName(name);
    try {
      localStorage.setItem('alameer_user_name', name);
    } catch (e) {
      console.error('Failed to save user name', e);
    }
    // If admin logged in, open admin dashboard automatically
    if (name === 'admin@alameer.com') {
      setIsAdminDashboardOpen(true);
    }
  };

  const handleLogout = () => {
    setUserName(null);
    setIsAdminDashboardOpen(false);
    try {
      localStorage.removeItem('alameer_user_name');
    } catch (e) {
      console.error('Failed to logout', e);
    }
  };

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('alameer_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Series Alert notifications state persisted in localStorage
  const [seriesAlerts, setSeriesAlerts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('alameer_series_alerts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('alameer_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('alameer_series_alerts', JSON.stringify(seriesAlerts));
    } catch (e) {
      console.error('Failed to save series alerts', e);
    }
  }, [seriesAlerts]);

  const toggleBookmark = (item: MediaItem) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === item.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isBookmarked = (id: string) => favorites.some((fav) => fav.id === id);

  const toggleSeriesAlert = (item: MediaItem) => {
    setSeriesAlerts((prev) => {
      if (prev.includes(item.id)) {
        return prev.filter((id) => id !== item.id);
      } else {
        return [...prev, item.id];
      }
    });
  };

  const isAlerted = (id: string) => seriesAlerts.includes(id);

  // Featured Hero items
  const heroItems = useMemo(() => {
    return mediaItems.filter((item) => item.isPinned || item.rating >= 8.5);
  }, [mediaItems]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return mediaItems.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchEng = item.englishTitle?.toLowerCase().includes(query);
        const matchSyn = item.synopsis.toLowerCase().includes(query);
        if (!matchTitle && !matchEng && !matchSyn) return false;
      }

      // Category
      if (selectedCategory !== 'الكل') {
        if (selectedCategory === 'مسلسلات رمضان 2026') {
          if (item.type !== 'ramadan' && !item.category.includes('رمضان')) return false;
        } else if (!item.category.includes(selectedCategory)) {
          return false;
        }
      }

      // Genre
      if (selectedGenre !== 'الكل') {
        if (!item.genre.some((g) => g.includes(selectedGenre))) return false;
      }

      // Year
      if (selectedYear !== 'الكل') {
        if (item.year.toString() !== selectedYear) return false;
      }

      // Quality
      if (selectedQuality !== 'الكل') {
        if (!item.quality.includes(selectedQuality)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (activeSort === 'imdbRating') return b.rating - a.rating;
      if (activeSort === 'views') return b.views - a.views;
      if (activeSort === 'pinned') return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
      if (activeSort === 'newMovies') {
        if (a.type === 'movie' && b.type !== 'movie') return -1;
        if (a.type !== 'movie' && b.type === 'movie') return 1;
      }
      if (activeSort === 'newEpisodes') {
        if (a.type === 'series' && b.type !== 'series') return -1;
        if (a.type !== 'series' && b.type === 'series') return 1;
      }
      return 0; // default latest order
    });
  }, [
    mediaItems,
    searchQuery,
    selectedCategory,
    selectedGenre,
    selectedYear,
    selectedQuality,
    activeSort
  ]);

  const handleSelectMedia = (item: MediaItem) => {
    setSelectedMediaDetail(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedMediaDetail(null); // Return to home grid filtered by category
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-['Cairo',sans-serif]">
      
      {/* Primary Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (selectedMediaDetail) setSelectedMediaDetail(null);
          if (isLiveTvPageOpen) setIsLiveTvPageOpen(false);
        }}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          handleCategorySelect(cat);
          if (isLiveTvPageOpen) setIsLiveTvPageOpen(false);
        }}
        savedCount={favorites.length}
        onOpenFavorites={() => setFavoritesDrawerOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenLiveTv={() => {
          setIsLiveTvPageOpen(true);
          setSelectedMediaDetail(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPackages={() => setIsPackagesModalOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        userName={userName}
      />

      {/* Render Admin Dashboard View if Admin mode is Active */}
      {isAdminDashboardOpen ? (
        <AdminDashboard
          mediaItems={mediaItems}
          liveChannels={liveChannels}
          categories={categories}
          onSaveMediaItems={handleSaveMediaItems}
          onSaveLiveChannels={handleSaveLiveChannels}
          onSaveCategories={handleSaveCategories}
          onExitAdmin={() => setIsAdminDashboardOpen(false)}
          onLogoutAdmin={handleLogout}
        />
      ) : isLiveTvPageOpen ? (
        /* Full-Page Live TV Channels View */
        <LiveTvPage
          onBackToHome={() => setIsLiveTvPageOpen(false)}
          onOpenPackages={() => setIsPackagesModalOpen(true)}
        />
      ) : selectedMediaDetail ? (
        /* Full-Page Detailed View for Movie/Series */
        <MediaDetailPage
          item={selectedMediaDetail}
          allItems={mediaItems}
          onBackToHome={() => setSelectedMediaDetail(null)}
          onSelectMedia={handleSelectMedia}
          onToggleBookmark={toggleBookmark}
          isBookmarked={isBookmarked(selectedMediaDetail.id)}
          onToggleAlert={toggleSeriesAlert}
          isAlerted={isAlerted(selectedMediaDetail.id)}
        />
      ) : (
        /* Home Main View */
        <>
          {/* Hero Slider Banner */}
          {!searchQuery && selectedCategory === 'الكل' && (
            <HeroSlider
              items={heroItems}
              onSelectMedia={handleSelectMedia}
              onToggleBookmark={toggleBookmark}
              isBookmarked={isBookmarked}
            />
          )}

          {/* Main Container */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
            
            {/* New Rotating Promotional Announcement Banner Card */}
            <AnnouncementCard />

            {/* Live Streaming Channels Section (Above Latest Additions) */}
            {!searchQuery && selectedCategory === 'الكل' && (
              <LiveTvSection
                onOpenLiveTvPage={() => {
                  setIsLiveTvPageOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectChannel={(channel) => {
                  setActiveLiveChannel(channel);
                  setIsLiveTvPageOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Sorting & Taxonomy Filters */}
            <FilterBar
              activeSort={activeSort}
              setActiveSort={setActiveSort}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategorySelect}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedQuality={selectedQuality}
              setSelectedQuality={setSelectedQuality}
              totalResultsCount={filteredItems.length}
            />

            {/* Active Category Header Title */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-6 bg-amber-500 rounded-full" />
                <h2 className="text-lg sm:text-xl font-bold text-white font-['Tajawal']">
                  {selectedCategory === 'الكل' ? 'أحدث الإضافات على الأمير نت' : selectedCategory}
                </h2>
              </div>

              {searchQuery && (
                <span className="text-xs text-neutral-400">
                  نتائج البحث عن: <strong className="text-amber-400">"{searchQuery}"</strong>
                </span>
              )}
            </div>

            {/* Media Grid */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800 space-y-3">
                <Film className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="text-sm font-bold text-neutral-300">لم يتم العثور على أي نتائج تتطابق مع الخيارات المحددة</h3>
                <p className="text-xs text-neutral-500">جرب البحث بكلمة أخرى أو تغيير تصنيفات الفلترة.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('الكل');
                    setSelectedGenre('الكل');
                    setSelectedYear('الكل');
                    setSelectedQuality('الكل');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 hover:bg-amber-500/30 cursor-pointer"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {filteredItems.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onSelect={handleSelectMedia}
                    onToggleBookmark={toggleBookmark}
                    isBookmarked={isBookmarked(item.id)}
                    onToggleAlert={toggleSeriesAlert}
                    isAlerted={isAlerted(item.id)}
                  />
                ))}
              </div>
            )}

            {/* Categorized Dedicated Sections (Rendered on main home view) */}
            {!searchQuery && selectedCategory === 'الكل' && (
              <CategorySections
                items={mediaItems}
                onSelectMedia={handleSelectMedia}
                onToggleBookmark={toggleBookmark}
                isBookmarked={isBookmarked}
                onToggleAlert={toggleSeriesAlert}
                isAlerted={isAlerted}
                onSelectCategory={handleCategorySelect}
              />
            )}

          </main>
        </>
      )}

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={favoritesDrawerOpen}
        onClose={() => setFavoritesDrawerOpen(false)}
        favorites={favorites}
        onSelectMedia={(item) => {
          handleSelectMedia(item);
          setFavoritesDrawerOpen(false);
        }}
        onRemoveFavorite={toggleBookmark}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenPackages={() => setIsPackagesModalOpen(true)}
      />

      {/* VIP Subscription Packages Modal */}
      <PackagesModal
        isOpen={isPackagesModalOpen}
        onClose={() => setIsPackagesModalOpen(false)}
      />

      {/* Platform Footer */}
      <Footer onSelectCategory={handleCategorySelect} />

    </div>
  );
}

export default App;

