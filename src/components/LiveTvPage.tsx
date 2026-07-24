import React, { useState, useEffect, useRef } from 'react';
import { LIVE_CHANNELS, LIVE_CHANNEL_CATEGORIES, LiveChannel } from '../data/liveChannelsData';
import { Tv, Radio, Search, ArrowRight, Play, Sparkles, Volume2, ShieldCheck } from 'lucide-react';

interface LiveTvPageProps {
  liveChannels: LiveChannel[];
  initialChannel?: LiveChannel | null;
  onBackToHome: () => void;
  onOpenPackages: () => void;
}

export const LiveTvPage: React.FC<LiveTvPageProps> = ({ 
  liveChannels, 
  initialChannel, 
  onBackToHome, 
  onOpenPackages 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const channelsList = liveChannels && liveChannels.length > 0 ? liveChannels : LIVE_CHANNELS;

  // Active channel defaults to initialChannel or the first available channel in the list
  const [activeChannel, setActiveChannel] = useState<LiveChannel>(() => {
    return initialChannel || channelsList[0];
  });

  const playerRef = useRef<HTMLDivElement>(null);

  // Update activeChannel if initialChannel changes
  useEffect(() => {
    if (initialChannel) {
      setActiveChannel(initialChannel);
    }
  }, [initialChannel]);

  const filteredChannels = channelsList.filter((channel) => {
    const matchesCategory = selectedCategory === 'الكل' || channel.category === selectedCategory;
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          channel.currentProgram.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectChannel = (channel: LiveChannel) => {
    setActiveChannel(channel);
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-4 sm:py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 font-['Cairo',sans-serif] w-full max-w-full overflow-x-hidden">
      
      {/* Navigation & Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={onBackToHome}
            className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الرئيسية</span>
          </button>

          <div className="h-6 w-px bg-neutral-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-red-500 animate-pulse shrink-0" />
            <h1 className="text-base sm:text-lg lg:text-xl font-black text-white font-['Tajawal'] tracking-wide">
              البث المباشر وقنوات TV
            </h1>
          </div>
        </div>

        {/* Upgrade Banner Button */}
        <button
          onClick={onOpenPackages}
          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102 transition-transform shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>اشتراك القنوات الذهبي VIP</span>
        </button>
      </div>

      {/* TOP LUXURY EMBEDDED STREAMING PLAYER */}
      <div 
        ref={playerRef}
        className="relative bg-neutral-900/90 border border-amber-500/30 rounded-3xl p-3.5 sm:p-6 shadow-2xl space-y-4 overflow-hidden backdrop-blur-xl animate-fadeIn"
      >
        {/* Glow Background Elements */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Player Header Info */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-xl shrink-0 bg-neutral-950">
              <img 
                src={activeChannel.logo} 
                alt={activeChannel.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white font-['Tajawal'] gold-gradient-text">
                  {activeChannel.name}
                </h2>
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>بث مباشر</span>
                </span>
                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {activeChannel.quality}
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-medium mt-0.5 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>يعرض الآن: <strong>{activeChannel.currentProgram}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0 text-xs">
            <span className="text-[11px] bg-neutral-800 text-neutral-300 border border-neutral-700 px-3 py-1 rounded-xl flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>خادم {activeChannel.category} بدون إعلانات</span>
            </span>
          </div>
        </div>

        {/* VIDEO PLAYER DISPLAY CONTAINER */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl group">
          <video
            key={activeChannel.id}
            src={activeChannel.streamUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />

          {/* Watermark Logo */}
          <div className="absolute top-4 left-4 pointer-events-none opacity-80 flex items-center gap-1.5 bg-neutral-950/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px] font-black text-amber-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>الأمير نت TV</span>
          </div>
        </div>

        {/* Quick Channel Ticker Bar underneath Video */}
        <div className="pt-2 border-t border-neutral-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Tv className="w-4 h-4" />
              <span>مفتوح في المشغل العلوي - اختر قناة للتحويل المباشر:</span>
            </span>
            <span className="text-[10px] text-neutral-500 hidden sm:inline">إجمالي القنوات المتاحة ({channelsList.length})</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {channelsList.map((ch) => {
              const isCurrent = activeChannel.id === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChannel(ch)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/20 font-black scale-102'
                      : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-amber-500/40 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-neutral-950 animate-ping' : 'bg-red-500'}`} />
                  <span>{ch.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* FILTER & SEARCH BAR SECTION */}
      <div className="space-y-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="ابحث عن قناة إخبارية، رياضية أو دينية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Categories Pill List */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-none">
            {LIVE_CHANNEL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 font-black'
                    : 'bg-neutral-950 text-neutral-300 border border-neutral-800 hover:border-amber-500/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* FULL CHANNEL CARDS GRID */}
      {filteredChannels.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800 space-y-3">
          <Tv className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-300">لم يتم العثور على أي قناة مطابقة للبحث</h3>
          <p className="text-xs text-neutral-500">جرب البحث باسم آخر أو اختيار تصنيف مختلف.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredChannels.map((channel) => {
            const isPlaying = activeChannel.id === channel.id;
            return (
              <div
                key={channel.id}
                onClick={() => handleSelectChannel(channel)}
                className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 ${
                  isPlaying
                    ? 'bg-neutral-900 border-2 border-amber-500 shadow-xl shadow-amber-500/15 scale-102 ring-1 ring-amber-500/50'
                    : 'bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-900'
                }`}
              >
                {/* Top Status & Quality Badges */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    isPlaying 
                      ? 'bg-amber-500 text-neutral-950 font-black' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                    <span>{isPlaying ? 'شغّالة حالياً' : 'بث مباشر'}</span>
                  </span>

                  <span className="bg-neutral-800 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/20">
                    {channel.quality}
                  </span>
                </div>

                {/* Logo & Name Info */}
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-neutral-700 group-hover:border-amber-500 shadow-md shrink-0 bg-neutral-950">
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-neutral-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6 text-amber-400 drop-shadow" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className={`text-sm font-extrabold transition-colors line-clamp-1 ${
                      isPlaying ? 'text-amber-400 font-black' : 'text-white group-hover:text-amber-300'
                    }`}>
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
                  <span className="text-amber-400 text-[11px] font-bold shrink-0">
                    {isPlaying ? 'مشاهدة الآن ➔' : 'عرض في المشغل ➔'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

