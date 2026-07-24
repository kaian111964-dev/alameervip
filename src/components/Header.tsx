import React, { useState } from 'react';
import { 
  Crown, 
  Search, 
  Film, 
  Tv, 
  Bookmark, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  Flame,
  Radio,
  User,
  LogIn
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  savedCount: number;
  onOpenFavorites: () => void;
  onOpenAuth: () => void;
  onOpenLiveTv: () => void;
  onOpenPackages: () => void;
  onOpenAdmin?: () => void;
  userName: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  savedCount,
  onOpenFavorites,
  onOpenAuth,
  onOpenLiveTv,
  onOpenPackages,
  onOpenAdmin,
  userName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const moviesCategories = [
    { name: 'افلام اجنبي', label: 'أفلام أجنبية' },
    { name: 'افلام عربي', label: 'أفلام عربية' },
    { name: 'افلام اسيوية', label: 'أفلام آسيوية' },
    { name: 'افلام تركية', label: 'أفلام تركية' },
    { name: 'افلام انمي', label: 'أفلام أنمي' },
    { name: 'افلام هندي', label: 'أفلام هندية' },
  ];

  const seriesCategories = [
    { name: 'مسلسلات اجنبي', label: 'مسلسلات أجنبية' },
    { name: 'مسلسلات عربي', label: 'مسلسلات عربية' },
    { name: 'مسلسلات اسيوية', label: 'مسلسلات آسيوية' },
    { name: 'مسلسلات تركية', label: 'مسلسلات تركية' },
    { name: 'مسلسلات مدبلجة', label: 'مسلسلات مدبلجة' },
    { name: 'مسلسلات هندية', label: 'مسلسلات هندية' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-header border-b border-amber-500/15 shadow-2xl transition-all duration-300">
      {/* Top Security & Ad-Free Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-neutral-900 to-amber-950/80 text-amber-300 text-[10px] sm:text-xs py-1 px-2 sm:px-4 text-center border-b border-amber-500/10 flex items-center justify-center gap-1.5 sm:gap-2">
        <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse shrink-0" />
        <span className="font-semibold tracking-wide truncate">
          منصة <strong className="text-white font-bold">الأمير نت</strong> المحدثة - مشاهدة سريعة وبدون إعلانات منبثقة إطلاقاً 🛡️
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Main Brand Logo - الأمير نت */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0" onClick={() => setSelectedCategory('الكل')}>
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-300 animate-bounce" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight font-['Tajawal'] gold-gradient-text drop-shadow-md">
                  الأمير نت
                </h1>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ALAMEER NET
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 font-medium hidden sm:block">عالم الأفلام والمسلسلات بدون إعلانات</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            <button
              onClick={() => setSelectedCategory('الكل')}
              className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                selectedCategory === 'الكل'
                  ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
              }`}
            >
              الرئيسية
            </button>

            {/* Movies Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('movies')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                  selectedCategory.includes('افلام')
                    ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
                }`}
              >
                <Film className="w-4 h-4 text-amber-400" />
                <span>أفلام الأمير نت</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {activeDropdown === 'movies' && (
                <div className="absolute top-full right-0 w-48 pt-2 z-50">
                  <div className="bg-neutral-900/95 backdrop-blur-xl border border-amber-500/20 rounded-xl shadow-2xl p-2 space-y-1">
                    {moviesCategories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-right px-3 py-2 text-xs rounded-lg transition-colors ${
                          selectedCategory === cat.name
                            ? 'bg-amber-500/20 text-amber-300 font-bold'
                            : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Series Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('series')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                  selectedCategory.includes('مسلسلات') && !selectedCategory.includes('رمضان')
                    ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
                }`}
              >
                <Tv className="w-4 h-4 text-amber-400" />
                <span>مسلسلات الأمير نت</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {activeDropdown === 'series' && (
                <div className="absolute top-full right-0 w-48 pt-2 z-50">
                  <div className="bg-neutral-900/95 backdrop-blur-xl border border-amber-500/20 rounded-xl shadow-2xl p-2 space-y-1">
                    {seriesCategories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-right px-3 py-2 text-xs rounded-lg transition-colors ${
                          selectedCategory === cat.name
                            ? 'bg-amber-500/20 text-amber-300 font-bold'
                            : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live TV Section Link */}
            <button
              onClick={onOpenLiveTv}
              className="px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold border border-red-500/30"
            >
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span>البث المباشر</span>
            </button>

            {/* Ramadan Special */}
            <button
              onClick={() => setSelectedCategory('مسلسلات رمضان 2026')}
              className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                selectedCategory.includes('رمضان')
                  ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>مسلسلات رمضان</span>
            </button>

            {/* TV Shows */}
            <button
              onClick={() => setSelectedCategory('برامج تلفزيونية')}
              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedCategory === 'برامج تلفزيونية'
                  ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
              }`}
            >
              برامج تلفزيونية
            </button>

            {/* Wrestling */}
            <button
              onClick={() => setSelectedCategory('عروض مصارعة')}
              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedCategory === 'عروض مصارعة'
                  ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
              }`}
            >
              عروض مصارعة
            </button>
          </nav>

          {/* Right Action Controls: Auth, Search & Favorites */}
          <div className="flex items-center gap-2.5">
            
            {/* VIP Package Direct Button */}
            <button
              onClick={onOpenPackages}
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>اشترك الآن VIP</span>
            </button>

            {/* Search Input Box */}
            <div className="relative hidden sm:block w-40 md:w-56">
              <input
                type="text"
                placeholder="ابحث عن فيلم أو مسلسل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900/90 border border-neutral-700/80 focus:border-amber-500 rounded-xl pr-10 pl-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* ADMIN PANEL BUTTON - Appears when logged in as admin */}
            {(userName === 'admin@alameer.com' || userName === 'abdualhamid100@gmail.com' || (userName && userName.toLowerCase().includes('admin'))) && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-transform hover:scale-105 cursor-pointer animate-pulse"
                title="فتح لوحة التحكم الشاملة"
              >
                <Crown className="w-4 h-4" />
                <span>لوحة التحكم</span>
              </button>
            )}

            {/* Auth / Login Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-neutral-200 hover:text-amber-300 text-xs font-semibold transition-all cursor-pointer"
            >
              {userName ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-bold flex items-center justify-center text-[10px]">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate text-amber-300 font-bold">{userName}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">الدخول / تسجيل</span>
                </>
              )}
            </button>

            {/* Favorites Button */}
            <button
              onClick={onOpenFavorites}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-amber-400 hover:bg-neutral-800 transition-all cursor-pointer"
              title="مفضلاتي"
            >
              <Bookmark className="w-4 h-4 fill-amber-500/20 text-amber-400" />
              <span className="hidden md:inline text-xs font-semibold">مفضلاتي</span>
              {savedCount > 0 && (
                <span className="bg-amber-500 text-neutral-950 font-black text-[10px] rounded-full px-1.5 py-0.2 min-w-[18px] text-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950/95 border-b border-neutral-800 p-4 space-y-3 animate-fadeIn">
          {/* Mobile Search */}
          <div className="relative sm:hidden w-full mb-3">
            <input
              type="text"
              placeholder="ابحث عن فيلم أو مسلسل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setSelectedCategory('الكل');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-right font-semibold ${
                selectedCategory === 'الكل' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900 text-neutral-300'
              }`}
            >
              الرئيسية
            </button>

            <button
              onClick={() => {
                onOpenLiveTv();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-right font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-between"
            >
              <span>🔴 البث المباشر</span>
              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">الآن</span>
            </button>

            {userName === 'admin@alameer.com' && onOpenAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg text-right font-black bg-amber-500 text-neutral-950 flex items-center justify-between col-span-2 shadow-lg animate-pulse"
              >
                <span>👑 لوحة التحكم الإدارية (ADMIN)</span>
                <span className="text-[10px] bg-neutral-950 text-amber-400 px-2 py-0.5 rounded">فتح اللوحة</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenPackages();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-right font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-between col-span-2"
            >
              <span>👑 اشتراك الباقة المميزة VIP</span>
              <span className="text-[10px] bg-amber-500 text-neutral-950 font-black px-2 py-0.5 rounded">بدون إعلانات</span>
            </button>

            {moviesCategories.map((m) => (
              <button
                key={m.name}
                onClick={() => {
                  setSelectedCategory(m.name);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-right ${
                  selectedCategory === m.name ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-neutral-900/60 text-neutral-300'
                }`}
              >
                {m.label}
              </button>
            ))}

            {seriesCategories.map((s) => (
              <button
                key={s.name}
                onClick={() => {
                  setSelectedCategory(s.name);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-right ${
                  selectedCategory === s.name ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-neutral-900/60 text-neutral-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
