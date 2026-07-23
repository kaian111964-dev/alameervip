import React, { useState } from 'react';
import { LIVE_CHANNELS, LIVE_CHANNEL_CATEGORIES, LiveChannel } from '../data/liveChannelsData';
import { Tv, Radio, Search, Home, ArrowRight, Play, X, ShieldCheck, Sparkles, Volume2, Maximize } from 'lucide-react';

interface LiveTvPageProps {
  onBackToHome: () => void;
  onOpenPackages: () => void;
}

export const LiveTvPage: React.FC<LiveTvPageProps> = ({ onBackToHome, onOpenPackages }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeChannel, setActiveChannel] = useState<LiveChannel | null>(null);

  const filteredChannels = LIVE_CHANNELS.filter((channel) => {
    const matchesCategory = selectedCategory === 'الكل' || channel.category === selectedCategory;
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          channel.currentProgram.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-['Cairo',sans-serif]">
      
      {/* Navigation Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الرجوع للرئيسية</span>
          </button>

          <div className="h-6 w-px bg-neutral-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-red-500 animate-pulse" />
            <h1 className="text-lg sm:text-xl font-extrabold text-white font-['Tajawal']">
              دليل القنوات والبث المباشر
            </h1>
          </div>
        </div>

        {/* Upgrade Banner Button */}
        <button
          onClick={onOpenPackages}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>اشتراك القنوات الذهبي VIP</span>
        </button>
      </div>

      {/* Categories & Search Bar */}
      <div className="space-y-4">
        
        {/* Search Input */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="ابحث عن قناة إخبارية، رياضية أو دينية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {LIVE_CHANNEL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-amber-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Channel Cards Grid */}
      {filteredChannels.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900/40 rounded-3xl border border-neutral-800 space-y-3">
          <Tv className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-300">لم يتم العثور على أي قناة مطابقة</h3>
          <p className="text-xs text-neutral-500">جرب البحث باسم آخر أو اختر تصنيفاً جديداً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => setActiveChannel(channel)}
              className="group relative bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-4 transition-all duration-300 hover:scale-102 hover:shadow-2xl flex flex-col justify-between gap-4 cursor-pointer"
            >
              {/* Top Badges */}
              <div className="flex items-center justify-between">
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>بث مباشر</span>
                </span>

                <span className="bg-neutral-800 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/20">
                  {channel.quality}
                </span>
              </div>

              {/* Logo & Play Icon */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-neutral-700 group-hover:border-amber-500 shadow-md shrink-0">
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-neutral-950/30 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white group-hover:scale-125 transition-transform drop-shadow" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {channel.name}
                  </h3>
                  <span className="text-[10px] text-amber-500 font-semibold px-2 py-0.5 rounded bg-amber-500/10 inline-block">
                    {channel.category}
                  </span>
                </div>
              </div>

              {/* Current Program info */}
              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                <span className="line-clamp-1 font-medium text-[11px]">
                  🔴 {channel.currentProgram}
                </span>
                <span className="text-amber-400 text-[11px] font-bold shrink-0">تشغيل الآن ➔</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Stream Video Player Modal */}
      {activeChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-neutral-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto space-y-4 p-4 sm:p-6">
            
            {/* Header Player */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 shrink-0">
                  <img src={activeChannel.logo} alt={activeChannel.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-extrabold text-white">
                      {activeChannel.name}
                    </h2>
                    <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                      🔴 مباشر
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{activeChannel.currentProgram}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveChannel(null)}
                className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl">
              <video
                src={activeChannel.streamUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            {/* Quick Channel Switcher Bar */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-neutral-400 mb-2">قنوات مشابهة للبث المباشر:</h4>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {LIVE_CHANNELS.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 border transition-all cursor-pointer ${
                      activeChannel.id === ch.id
                        ? 'bg-amber-500 text-neutral-950 border-amber-500'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-amber-500/40'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>{ch.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
