import React, { useState, useEffect } from 'react';
import { Sparkles, CreditCard, Radio, ExternalLink } from 'lucide-react';
import { getStoredAnnouncement, AnnouncementBanner } from '../data/storageManager';

interface AnnouncementCardProps {
  announcement?: AnnouncementBanner;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement: propAnnouncement }) => {
  const [data, setData] = useState<AnnouncementBanner>(() => propAnnouncement || getStoredAnnouncement());

  useEffect(() => {
    if (propAnnouncement) {
      setData(propAnnouncement);
    } else {
      setData(getStoredAnnouncement());
    }
  }, [propAnnouncement]);

  if (!data || !data.enabled) return null;

  return (
    <div className="relative mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-neutral-900 via-amber-950/40 to-neutral-900 border border-amber-500/25 shadow-2xl overflow-hidden transition-all duration-500 group font-['Cairo',sans-serif]">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Content Box */}
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
          
          {/* Image Thumbnail */}
          <div className="relative shrink-0">
            {data.imageUrl ? (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-amber-500/40 shadow-lg relative bg-neutral-950">
                <img 
                  src={data.imageUrl} 
                  alt={data.badgeText} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-neutral-950/20" />
              </div>
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
            )}
            
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-neutral-950 flex items-center justify-center text-[9px] font-black text-neutral-950">
              ✓
            </div>
          </div>

          {/* Text Info */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-300">
                {data.badgeText || 'تنويه عام'}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                <Radio className="w-3 h-3 animate-ping text-amber-500" />
                تحديث مباشر
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-black text-white font-['Tajawal'] tracking-wide">
              {data.title}
            </h3>

            <p className="text-xs text-neutral-300 font-medium leading-relaxed max-w-2xl">
              {data.subtitle}
            </p>
          </div>
        </div>

        {/* Action Button & Network Badge */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
          
          {data.networkNumber && (
            <div className="px-3 py-1.5 bg-neutral-800 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 flex items-center gap-1.5 shrink-0">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>رقم الشبكة: {data.networkNumber}</span>
            </div>
          )}

          {data.buttonText && (
            <a
              href={data.linkUrl || 'https://wa.me/967778215553'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 shrink-0 hover:scale-105 transition-transform cursor-pointer"
            >
              <span>{data.buttonText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

        </div>

      </div>
    </div>
  );
};

