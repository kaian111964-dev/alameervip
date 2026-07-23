import React from 'react';
import { Crown, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs mt-20">
      
      {/* Top Value Banner */}
      <div className="bg-neutral-900/60 border-b border-neutral-800/80 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-['Tajawal']">منصة الأمير نت الآمنة</h4>
              <p className="text-neutral-400 text-xs">خالية 100% من الإعلانات المنبثقة المزعجة والروابط الضارة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-neutral-950 font-black text-[11px] px-3 py-1 rounded-full">
              بث مباشر HD 1080p
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-black text-white font-['Tajawal'] gold-gradient-text">
              الأمير نت
            </h3>
          </div>
          <p className="text-neutral-400 leading-relaxed text-xs">
            منصتكم الرقمية الأولى لمشاهدة أحدث الأفلام والمسلسلات العربية والأجنبية والآسيوية فور نزولها بجودة عالية وبدون إعلانات منبثقة.
          </p>
        </div>

        {/* Quick Movies Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white font-['Tajawal'] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>أفلام الأمير نت</span>
          </h4>
          <ul className="space-y-2 text-neutral-400">
            <li><button onClick={() => onSelectCategory('افلام اجنبي')} className="hover:text-amber-300 transition-colors">أفلام أجنبية مترجمة</button></li>
            <li><button onClick={() => onSelectCategory('افلام عربي')} className="hover:text-amber-300 transition-colors">أفلام عربية حصرياً</button></li>
            <li><button onClick={() => onSelectCategory('افلام اسيوية')} className="hover:text-amber-300 transition-colors">أفلام كورية وآسيوية</button></li>
            <li><button onClick={() => onSelectCategory('افلام انمي')} className="hover:text-amber-300 transition-colors">أفلام أنمي مترجمة</button></li>
          </ul>
        </div>

        {/* Quick Series Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white font-['Tajawal'] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>مسلسلات الأمير نت</span>
          </h4>
          <ul className="space-y-2 text-neutral-400">
            <li><button onClick={() => onSelectCategory('مسلسلات رمضان 2026')} className="hover:text-amber-300 transition-colors">مسلسلات رمضان 2026</button></li>
            <li><button onClick={() => onSelectCategory('مسلسلات اجنبي')} className="hover:text-amber-300 transition-colors">مسلسلات أجنبية مترجمة</button></li>
            <li><button onClick={() => onSelectCategory('مسلسلات تركية')} className="hover:text-amber-300 transition-colors">مسلسلات تركية مترجمة</button></li>
            <li><button onClick={() => onSelectCategory('مسلسلات مدبلجة')} className="hover:text-amber-300 transition-colors">مسلسلات مدبلجة</button></li>
          </ul>
        </div>

        {/* Info Column & Developer Rights */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white font-['Tajawal']">مميزات المنصة وحقوق النظام</h4>
          <p className="text-neutral-400 text-xs">
            تتميز منصة <strong>الأمير نت</strong> بتحديث مستمر على مدار الساعة مع سيرفرات فائقة السرعة تراعي كافة سرعات الإنترنت.
          </p>

          <div className="p-3 rounded-xl bg-neutral-900 border border-amber-500/30 space-y-2">
            <p className="text-[11px] font-bold text-amber-300">
              حقوق البرمجة والتصميم والإدارة الكاملة للنظام:
            </p>
            <p className="text-xs font-black text-white font-['Tajawal']">
              المهندس والمبرمج عبدالحميد داوؤد
            </p>

            {/* Quick Contact Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://wa.me/967778215553?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%8A%D9%83%D9%85%20%D9%85%D9%87%D9%86%D8%AF%D8%B3%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%AD%D9%85%D9%8A%D8%AF%20%D8%AF%D8%A7%D9%88%D8%A3%D8%AF"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 transition-transform hover:scale-105"
              >
                <span>واتساب: 778215553</span>
              </a>

              <a
                href="tel:778215553"
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-[10px] flex items-center gap-1 transition-transform hover:scale-105"
              >
                <span>اتصال هاتف</span>
              </a>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-amber-400/80">
            جميع الحقوق محفوظة © {new Date().getFullYear()} - الأمير نت ALAMEER NET
          </div>
        </div>

      </div>

    </footer>
  );
};
