import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { FilterBar } from './components/FilterBar';
import { MediaCard } from './components/MediaCard';
import { CategorySections } from './components/CategorySections';
import { MediaDetailPage } from './components/MediaDetailPage';
import { Footer } from './components/Footer';
import { AnnouncementCard } from './components/AnnouncementCard';
import { LiveTvSection } from './components/LiveTvSection';
import { LiveTvPage } from './components/LiveTvPage';
import { AuthPage } from './components/AuthPage';
import { PackagesPage } from './components/PackagesPage';
import { FavoritesPage } from './components/FavoritesPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { 
  getStoredMediaItems, 
  saveStoredMediaItems, 
  getStoredLiveChannels, 
  saveStoredLiveChannels, 
  getStoredCategories, 
  saveStoredCategories,
  getStoredCategoryItems,
  getStoredAnnouncement,
  DEFAULT_ANNOUNCEMENT
} from './data/storageManager';
import { db, COLLECTIONS, seedFirestoreIfEmpty } from './lib/firebase';
import { collection, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
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

  // Firestore Initial Seed and Realtime Snapshot Listeners
  useEffect(() => {
    // 1. Initial Seed to Firestore if collections are empty
    seedFirestoreIfEmpty(
      getStoredMediaItems(),
      getStoredLiveChannels(),
      getStoredCategoryItems(),
      getStoredAnnouncement()
    );

    // 2. Realtime listener for Media Items
    const unsubMedia = onSnapshot(collection(db, COLLECTIONS.MEDIA_ITEMS), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data() as MediaItem);
        setMediaItems(items);
        localStorage.setItem('alameer_media_items_v2', JSON.stringify(items));
      }
    }, (err) => {
      console.warn('Firestore media subscription error:', err);
    });

    // 3. Realtime listener for Live Channels
    const unsubChannels = onSnapshot(collection(db, COLLECTIONS.LIVE_CHANNELS), (snapshot) => {
      if (!snapshot.empty) {
        const channels = snapshot.docs.map((d) => d.data() as LiveChannel);
        setLiveChannels(channels);
        localStorage.setItem('alameer_live_channels_v2', JSON.stringify(channels));
      }
    }, (err) => {
      console.warn('Firestore channels subscription error:', err);
    });

    // 4. Realtime listener for Categories
    const unsubCategories = onSnapshot(collection(db, COLLECTIONS.CATEGORY_ITEMS), (snapshot) => {
      if (!snapshot.empty) {
        const catItems = snapshot.docs.map((d) => d.data() as any);
        const catNames = catItems.map((c) => c.name);
        if (catNames.length > 0) {
          setCategories(catNames);
          localStorage.setItem('alameer_categories_v2', JSON.stringify(catNames));
        }
      }
    }, (err) => {
      console.warn('Firestore categories subscription error:', err);
    });

    return () => {
      unsubMedia();
      unsubChannels();
      unsubCategories();
    };
  }, []);

  // Dedicated Full-Page View States (No Popups/Modals)
  const [selectedMediaDetail, setSelectedMediaDetail] = useState<MediaItem | null>(null);
  const [isFavoritesPageOpen, setIsFavoritesPageOpen] = useState(false);
  const [isLiveTvPageOpen, setIsLiveTvPageOpen] = useState(false);
  const [isAuthPageOpen, setIsAuthPageOpen] = useState(false);
  const [isPackagesPageOpen, setIsPackagesPageOpen] = useState(false);
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
    const isUserAdmin = name === 'admin@alameer.com' || name === 'abdualhamid100@gmail.com' || name.toLowerCase().includes('admin');
    if (isUserAdmin) {
      setIsAdminDashboardOpen(true);
      setIsAuthPageOpen(false);
    } else {
      setIsAuthPageOpen(false);
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

  const closeAllPages = () => {
    setIsAdminDashboardOpen(false);
    setIsLiveTvPageOpen(false);
    setIsAuthPageOpen(false);
    setIsPackagesPageOpen(false);
    setIsFavoritesPageOpen(false);
    setSelectedMediaDetail(null);
  };

  const handleSelectMedia = (item: MediaItem) => {
    closeAllPages();
    setSelectedMediaDetail(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Realtime sync: Increment view count directly in Firestore
    try {
      const itemRef = doc(db, COLLECTIONS.MEDIA_ITEMS, String(item.id));
      updateDoc(itemRef, { views: increment(1) }).catch((err) => {
        console.warn('Firestore view increment notice:', err);
      });
    } catch (e) {
      console.warn('Could not update views in Firestore:', e);
    }
  };

  const handleCategorySelect = (category: string) => {
    closeAllPages();
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-['Cairo',sans-serif]">
      
      {/* Primary Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          closeAllPages();
        }}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          handleCategorySelect(cat);
        }}
        savedCount={favorites.length}
        onOpenFavorites={() => {
          closeAllPages();
          setIsFavoritesPageOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={() => {
          closeAllPages();
          setIsAuthPageOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLiveTv={() => {
          closeAllPages();
          setIsLiveTvPageOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPackages={() => {
          closeAllPages();
          setIsPackagesPageOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          closeAllPages();
          setIsAdminDashboardOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userName={userName}
      />

      {/* Render Dedicated Full-Page View States (No Popups/Modals) */}
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
      ) : isAuthPageOpen ? (
        <AuthPage
          onBackToHome={() => setIsAuthPageOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onOpenPackages={() => {
            setIsAuthPageOpen(false);
            setIsPackagesPageOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentUserName={userName}
          onLogout={handleLogout}
        />
      ) : isPackagesPageOpen ? (
        <PackagesPage
          onBackToHome={() => setIsPackagesPageOpen(false)}
        />
      ) : isFavoritesPageOpen ? (
        <FavoritesPage
          favorites={favorites}
          seriesAlerts={seriesAlerts}
          allItems={mediaItems}
          onBackToHome={() => setIsFavoritesPageOpen(false)}
          onSelectMedia={handleSelectMedia}
          onToggleBookmark={toggleBookmark}
          onToggleAlert={toggleSeriesAlert}
          onClearAllFavorites={() => setFavorites([])}
        />
      ) : isLiveTvPageOpen ? (
        /* Full-Page Live TV Channels View */
        <LiveTvPage
          liveChannels={liveChannels}
          initialChannel={activeLiveChannel}
          onBackToHome={() => setIsLiveTvPageOpen(false)}
          onOpenPackages={() => {
            setIsLiveTvPageOpen(false);
            setIsPackagesPageOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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
          <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full py-6">
            
            {/* New Rotating Promotional Announcement Banner Card */}
            <AnnouncementCard />

            {/* Live Streaming Channels Section (Above Latest Additions) */}
            {!searchQuery && selectedCategory === 'الكل' && (
              <LiveTvSection
                liveChannels={liveChannels}
                onOpenLiveTvPage={() => {
                  closeAllPages();
                  setIsLiveTvPageOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectChannel={(channel) => {
                  setActiveLiveChannel(channel);
                  closeAllPages();
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
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

      {/* Platform Footer */}
      <Footer onSelectCategory={handleCategorySelect} />

    </div>
  );
}

export default App;

