import React, { useState, useEffect } from 'react';
import { Sparkles, CreditCard, ChevronRight, ChevronLeft, ShieldCheck, Smartphone, Wifi, Radio } from 'lucide-react';

export const AnnouncementCard: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: 'الشبكة الذهبية',
      title: 'مرحباً بكم في شبكة وإستراحة الأمير نت الذهبية .. 👑',
      subtitle: 'أسرع سيرفرات مشاهدة بدون تقطيع وبدون إعلانات منبثقة إطلاقاً.',
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      tagColor: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-300',
      actionText: 'استكشف الباقات',
      thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 2,
      badge: 'ميزة جديدة وحصرية',
      title: 'ميزة جديدة الان على شبكة الأمير نت .. 🚀',
      subtitle: 'يمكنك شراء كرت الشبكة من مكانك مباشرة بكل سهولة عبر التطبيقات المعتمدة.',
      icon: <Wifi className="w-6 h-6 text-emerald-400" />,
      tagColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
      actionText: 'شراء كروت الشبكة',
      thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 3,
      badge: 'تطبيقات الدفع المباشر',
      title: 'تطبيق جوالي - رقم الشبكة ( 512 ) 📱',
      subtitle: 'قم بفتح تطبيق جوالي وحدد كروت الأمير نت واكتب رقم الشبكة 512 للحصول على الكرت فوراً.',
      icon: <Smartphone className="w-6 h-6 text-indigo-400" />,
      tagColor: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-300',
      actionText: 'رقم الشبكة: 512',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0a670f4a45a1?auto=format&fit=crop&w=200&q=80'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // rotates every 5 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  const currentSlide = slides[activeSlide];

  return (
    <div className="relative mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-neutral-900 via-amber-950/40 to-neutral-900 border border-amber-500/25 shadow-2xl overflow-hidden transition-all duration-500 group">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Slide Content with Transition */}
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
          
          {/* Slide Thumbnail / Icon Box */}
          <div className="relative shrink-0">
            {currentSlide.thumbnail ? (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-amber-500/40 shadow-lg relative">
                <img 
                  src={currentSlide.thumbnail} 
                  alt={currentSlide.badge} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-neutral-950/20" />
              </div>
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                {currentSlide.icon}
              </div>
            )}
            
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-neutral-950 flex items-center justify-center text-[9px] font-black text-neutral-950">
              ✓
            </div>
          </div>

          {/* Animated Text Box */}
          <div className="flex-1 space-y-1 transition-all duration-500 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-gradient-to-r ${currentSlide.tagColor}`}>
                {currentSlide.badge}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                <Radio className="w-3 h-3 animate-ping text-amber-500" />
                تحديث مباشر
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-black text-white font-['Tajawal'] tracking-wide">
              {currentSlide.title}
            </h3>

            <p className="text-xs text-neutral-300 font-medium leading-relaxed max-w-2xl">
              {currentSlide.subtitle}
            </p>
          </div>
        </div>

        {/* Right Actions & Slide Bullets */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
          
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeSlide === idx 
                    ? 'w-6 h-2 bg-amber-400 shadow-md shadow-amber-500/50' 
                    : 'w-2 h-2 bg-neutral-700 hover:bg-neutral-500'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Highlight Badge Button */}
          <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 shrink-0 hover:scale-105 transition-transform cursor-default">
            <CreditCard className="w-4 h-4" />
            <span>رقم الشبكة: 512</span>
          </div>

        </div>

      </div>
    </div>
  );
};
