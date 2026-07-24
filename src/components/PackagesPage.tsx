import React, { useState } from 'react';
import { 
  Crown, CheckCircle2, Zap, Shield, Sparkles, CreditCard, Flame, Gift, 
  ArrowRight, Phone, MessageCircle, ExternalLink, Check, Star 
} from 'lucide-react';

interface PackagesPageProps {
  onBackToHome: () => void;
  onSelectPackage?: (packageName: string) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({
  onBackToHome,
  onSelectPackage
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'family'>('annual');
  const [purchasedSuccess, setPurchasedSuccess] = useState(false);

  const handleSubscribe = (planTitle: string) => {
    setPurchasedSuccess(true);
    if (onSelectPackage) onSelectPackage(planTitle);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-['Cairo',sans-serif] flex flex-col justify-between">
      
      {/* Top Header Bar */}
      <div className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-amber-500/20 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs sm:text-sm border border-neutral-700 transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <span className="text-lg sm:text-xl font-black text-white font-['Tajawal'] gold-gradient-text">
              باقات الأمير نت
            </span>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 space-y-10">
        
        {/* Banner Hero */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-neutral-950 via-amber-950/60 to-neutral-950 border border-amber-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>عالم الترفيه والسينما بدون إعلانات</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Tajawal'] gold-gradient-text leading-tight">
            باقات واشتراكات شبكة الأمير نت الذهبية 👑
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            مشاهدة فورية بدون أي إعلانات منبثقة، دقة خرافية 4K مع أسرع سيرفرات للبث المباشر والأفلام والمسلسلات.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-amber-400">
            <span className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <CreditCard className="w-4 h-4" />
              رقم الشبكة كروت: <strong>512</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <Zap className="w-4 h-4 text-emerald-400" />
              سيرفرات فائقة السرعة 10Gbps
            </span>
          </div>

        </div>

        {purchasedSuccess ? (
          <div className="p-10 rounded-3xl bg-neutral-900 border border-emerald-500/40 text-center space-y-6 animate-scaleUp max-w-xl mx-auto shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white font-['Tajawal']">
                تم تفعيل باقتك المميزة بنجاح! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                مرحباً بك في عالم الأمير نت الذهبي. تم إلغاء جميع الإعلانات وتفعيل سيرفرات البث المباشر و4K لحسابك فوراً.
              </p>
            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-amber-500/30 text-right text-xs space-y-2">
              <p className="text-amber-400 font-bold">معلومات الكرت والاشتراك:</p>
              <p className="text-neutral-300">رقم الشبكة كرت: <strong className="text-white font-mono">512</strong></p>
              <p className="text-neutral-300">الحالة: <span className="text-emerald-400 font-bold">نشط VIP</span></p>
            </div>

            <button
              onClick={onBackToHome}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              العودة للمشاهدة الآن
            </button>
          </div>
        ) : (
          /* Cards Tiers */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* 1. Monthly Plan */}
            <div 
              onClick={() => setSelectedPlan('monthly')}
              className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                selectedPlan === 'monthly'
                  ? 'bg-neutral-900 border-amber-500 shadow-2xl shadow-amber-500/10 scale-102'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="space-y-4">
                <span className="text-xs font-bold text-neutral-400 block">الباقة الشهرية</span>
                <h3 className="text-2xl font-black text-white font-['Tajawal']">اشتراك شهر واحد</h3>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400 font-mono">5,000</span>
                  <span className="text-xs text-neutral-400 font-bold">ر.ي / شهر</span>
                </div>

                <ul className="space-y-2.5 text-xs text-neutral-300 pt-4 border-t border-neutral-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>مشاهدة بدون إعلانات نهائياً</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>دقة Full HD 1080p</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>جهاز واحد في وقت واحد</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe('الباقة الشهرية');
                }}
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer"
              >
                تفعيل الباقة الشهرية
              </button>
            </div>

            {/* 2. Annual VIP Plan (POPULAR) */}
            <div 
              onClick={() => setSelectedPlan('annual')}
              className={`relative p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                selectedPlan === 'annual'
                  ? 'bg-gradient-to-b from-amber-950/40 via-neutral-900 to-neutral-900 border-amber-500 shadow-2xl shadow-amber-500/20 scale-105'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span className="absolute -top-3.5 right-6 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-black text-[11px] shadow-lg flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-neutral-950" />
                الأكثر طلباً وتوفيراً
              </span>

              <div className="space-y-4 pt-2">
                <span className="text-xs font-bold text-amber-400 block">باقة المحترفين السنوية</span>
                <h3 className="text-2xl font-black text-white font-['Tajawal']">اشتراك 12 شهر VIP 👑</h3>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-amber-400 font-mono">40,000</span>
                  <span className="text-xs text-neutral-400 font-bold">ر.ي / سنة</span>
                </div>

                <ul className="space-y-2.5 text-xs text-neutral-200 pt-4 border-t border-neutral-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-bold text-white">مشاهدة بأعلى دقة 4K Ultra HD</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>تنزيل وسحب الحلقات للمشاهدة بدون إنترنت</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>دعم 3 أجهزة بوقت واحد</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>سيرفرات البث المباشر الرياضي VIP</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe('الباقة السنوية VIP');
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-transform hover:scale-102 cursor-pointer"
              >
                اشترك الآن بـ 40,000 ر.ي
              </button>
            </div>

            {/* 3. Family Plan */}
            <div 
              onClick={() => setSelectedPlan('family')}
              className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                selectedPlan === 'family'
                  ? 'bg-neutral-900 border-amber-500 shadow-2xl shadow-amber-500/10 scale-102'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="space-y-4">
                <span className="text-xs font-bold text-neutral-400 block">الباقة العائلية</span>
                <h3 className="text-2xl font-black text-white font-['Tajawal']">باقة العائلة 5 أجهزة</h3>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400 font-mono">12,000</span>
                  <span className="text-xs text-neutral-400 font-bold">ر.ي / شهر</span>
                </div>

                <ul className="space-y-2.5 text-xs text-neutral-300 pt-4 border-t border-neutral-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>5 شاشات مستقلة تماماً</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>قسم خاص بأفلام ومسلسلات الأطفال</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>دقة 4K عالية الوضوح</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe('الباقة العائلية');
                }}
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer"
              >
                تفعيل الباقة العائلية
              </button>
            </div>

          </div>
        )}

        {/* Network Direct Purchase Instructions (Jowali 512) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-['Tajawal']">
                طريقة الشراء المباشرة عبر تطبيق (جوالي) - رقم الشبكة (512)
              </h3>
              <p className="text-xs text-neutral-400">
                يمكنك شراء وتعبئة كروت الأمير نت فوراً دون الحاجة لانتظار التفعيل.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
              <span className="font-bold text-amber-400 text-sm">1. افتح تطبيق جوالي</span>
              <p className="text-neutral-400">اختر قسم كروت الشبكات اللاسلكية والإنترنت.</p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
              <span className="font-bold text-amber-400 text-sm">2. اكتب رقم الشبكة (512)</span>
              <p className="text-neutral-400">حدد شبكة الأمير نت واكتب الرقم الموحد 512.</p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
              <span className="font-bold text-amber-400 text-sm">3. استلم الكرت واستمتع</span>
              <p className="text-neutral-400">سيظهر لك رمز الكرت المباشر للبدء فوراً.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800 text-xs">
            <span className="text-neutral-400">لأي استفسار أو مساعدة في تفعيل الباقة:</span>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/967778215553?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%8A%D9%83%D9%85%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%81%D9%8A%20%D8%A8%D8%A7%D9%82%D8%A7%D8%AA%20%D8%A7%D9%84%D8%A3%D9%85%D9%8A%D8%B1%20%D9%86%D8%AA"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>واتساب المباشر (778215553)</span>
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
