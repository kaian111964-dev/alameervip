import React from 'react';
import { LIVE_CHANNELS, LiveChannel } from '../data/liveChannelsData';
import { Radio, ChevronLeft, Tv, Play, Sparkles, Flame } from 'lucide-react';

interface LiveTvSectionProps {
  onOpenLiveTvPage: () => void;
  onSelectChannel: (channel: LiveChannel) => void;
}

export const LiveTvSection: React.FC<LiveTvSectionProps> = ({
  onOpenLiveTvPage,
  onSelectChannel
}) => {
  // Show top popular live channels on home page section
  const popularChannels = LIVE_CHANNELS.filter((c) => c.isPopular).slice(0, 6);

  return (
    <section className="mb-10 p-5 rounded-3xl bg-gradient-to-r from-neutral-900 via-amber-950/30 to-neutral-900 border border-amber-500/30 shadow-2xl relative overflow-hidden font-['Cairo',sans-serif]">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-800 mb-5">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-red-500">
              <Tv className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-xl font-black text-white font-['Tajawal'] tracking-tight">
                قسم البث المباشر والقنوات
              </h2>
              <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Radio className="w-3 h-3 animate-ping" />
                مباشر 24/7
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 hidden sm:block">
              شاهد جميع القنوات الإخبارية، الرياضية، الدراما والدينية مباشرة بدون تقطيع
            </p>
          </div>
        </div>

        {/* View All Channels Button */}
        <button
          onClick={onOpenLiveTvPage}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>عرض جميع القنوات</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Popular Live Channels */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {popularChannels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => onSelectChannel(channel)}
            className="group relative bg-neutral-950/80 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-3 flex flex-col items-center text-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            {/* Live Indicator Badge */}
            <div className="absolute top-2 right-2 bg-neutral-900/90 text-red-400 font-bold text-[9px] px-1.5 py-0.5 rounded-md border border-red-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>مباشر</span>
            </div>

            {/* Quality Badge */}
            <div className="absolute top-2 left-2 bg-neutral-900/90 text-amber-300 font-bold text-[9px] px-1.5 py-0.5 rounded-md border border-amber-500/30">
              {channel.quality}
            </div>

            {/* Logo Image Box */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-neutral-700 group-hover:border-amber-500 shadow-md mt-4">
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-amber-500/20 transition-colors flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Play className="w-4 h-4 fill-current mr-0.5" />
                </div>
              </div>
            </div>

            {/* Name & Current Program */}
            <div className="w-full space-y-1">
              <h3 className="text-xs font-extrabold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                {channel.name}
              </h3>
              <p className="text-[10px] text-neutral-400 line-clamp-1">
                {channel.currentProgram}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
