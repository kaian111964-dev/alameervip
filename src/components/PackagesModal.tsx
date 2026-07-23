import React, { useState } from 'react';
import { Crown, CheckCircle2, Zap, Shield, Sparkles, X, CreditCard, Flame, Gift, ArrowRight } from 'lucide-react';

interface PackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage?: (packageName: string) => void;
}

export const PackagesModal: React.FC<PackagesModalProps> = ({
  isOpen,
  onClose,
  onSelectPackage
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'family'>('annual');
  const [purchasedSuccess, setPurchasedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (planTitle: string) => {
    setPurchasedSuccess(true);
    if (onSelectPackage) onSelectPackage(planTitle);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-8 font-['Cairo',sans-serif]">
        
        {/* Top Glow & Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-neutral-950 via-amber-950/60 to-neutral-950 border-b border-neutral-800 text-center">
          
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>باقات شبكة وإستراحة الأمير نت الذهبية</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Tajawal'] gold-gradient-text">
            أشترك الآن واستمتع بتجربة مشاهدة سينمائية بلا حدود 👑
          </h2>
          
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto mt-2">
            بدون إعلانات إطلاقاً، وبأعلى جودة 4K مع سيرفرات فائقة السرعة وشبكة كروت المباشرة عبر تطبيق جوالي (رقم الشبكة 512).
          </p>

        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">

          {purchasedSuccess ? (
            <div className="text-center py-10 space-y-4 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white font-['Tajawal']">
                تم تفعيل باقتك المميزة بنجاح! 🎉
              </h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto">
                مرحباً بك في عالم الأمير نت الذهبي. تم إلغاء جميع الإعلانات وتفعيل سيرفرات البث المباشر و4K لحسابك فوراً.
              </p>
              <div className="p-4 bg-neutral-950 rounded-2xl border border-amber-500/30 inline-block text-right text-xs space-y-1">
                <p className="text-amber-400 font-bold">معلومات الاشتراك:</p>
                <p className="text-neutral-300">رقم الشبكة كرت: <strong className="text-white">512</strong></p>
                <p className="text-neutral-300">الحالة: <span className="text-emerald-400 font-bold">نشط VIP</span></p>
              </div>
              <div>
                <button
                  onClick={() => {
                    setPurchasedSuccess(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  العودة للمشاهدة الآن
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Monthly Plan */}
                <div 
                  onClick={() => setSelectedPlan('monthly')}
                  className={`relative p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPlan === 'monthly'
                      ? 'bg-neutral-800/90 border-amber-500 shadow-xl shadow-amber-500/10 scale-102'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-neutral-400">الباقة الشهرية</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">$5</span>
                      <span className="text-xs text-neutral-400">/ شهرياً</span>
                    </div>

                    <p className="text-xs text-neutral-400">مثالية لتجربة المنصة بدون التزامات طويلة.</p>

                    <ul className="space-y-2.5 text-xs text-neutral-300 pt-2 border-t border-neutral-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>مشاهدة بدون إعلانات</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>جودة 1080p High HD</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>جهازين في وقت واحد</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe('الباقة الشهرية VIP');
                    }}
                    className="w-full mt-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-amber-400 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer"
                  >
                    اشترك الآن
                  </button>
                </div>

                {/* 2. Annual Plan (POPULAR) */}
                <div 
                  onClick={() => setSelectedPlan('annual')}
                  className={`relative p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPlan === 'annual'
                      ? 'bg-gradient-to-b from-neutral-800 via-amber-950/40 to-neutral-900 border-amber-500 shadow-2xl shadow-amber-500/20 scale-105 z-10'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="absolute -top-3 right-1/2 translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 text-[10px] font-black uppercase shadow-lg flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>الأكثر طلباً - توفير 35%</span>
                  </div>

                  <div className="space-y-4 pt-2">
                    <span className="text-xs font-bold text-amber-400">الباقة السنوية الذهبية</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-amber-300">$40</span>
                      <span className="text-xs text-neutral-400">/ سنوياً</span>
                    </div>

                    <p className="text-xs text-neutral-300">أفضل قيمة شاملة لجميع الأفلام والمسلسلات والبث المباشر.</p>

                    <ul className="space-y-2.5 text-xs text-neutral-200 pt-2 border-t border-amber-500/20">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>مشاهدة بدون إعلانات نهائياً</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>سيرفرات 4K Ultra HD المباشرة</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>قنوات البث المباشر VIP والمباريات</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>تنزيل أوفلاين بلا حدود</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe('الباقة السنوية الذهبية');
                    }}
                    className="w-full mt-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-lg transition-all cursor-pointer"
                  >
                    اشترك الآن بـ $40
                  </button>
                </div>

                {/* 3. Family Plan */}
                <div 
                  onClick={() => setSelectedPlan('family')}
                  className={`relative p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPlan === 'family'
                      ? 'bg-neutral-800/90 border-amber-500 shadow-xl shadow-amber-500/10 scale-102'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-neutral-400">الباقة العائلية الشاملة</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">$65</span>
                      <span className="text-xs text-neutral-400">/ سنوياً</span>
                    </div>

                    <p className="text-xs text-neutral-400">تغطي حتى 5 أجهزة مع ملفات شخصية مستقلة.</p>

                    <ul className="space-y-2.5 text-xs text-neutral-300 pt-2 border-t border-neutral-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>5 أجهزة بوقت واحد</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>ملفات حماية للأطفال</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>دعم فني مباشر 24/7</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe('الباقة العائلية الشاملة');
                    }}
                    className="w-full mt-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-amber-400 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer"
                  >
                    اشترك الآن
                  </button>
                </div>

              </div>

              {/* Payment Methods Info Box */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">طريقة الدفع المباشرة عبر الكروت:</h4>
                    <p className="text-neutral-400">تطبيق جوالي - ادخل رقم شبكة الأمير نت <strong className="text-amber-400">512</strong> للحصول على كرت الاشتراك فوراً.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-[11px]">تطبيق جوالي</span>
                  <span className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-[11px]">كروت الشبكة</span>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
