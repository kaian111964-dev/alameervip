import React, { useState } from 'react';
import { Crown, CreditCard, Sparkles, CheckCircle2, ShieldCheck, Flame, Save } from 'lucide-react';

export const AdminPackagesManager: React.FC = () => {
  const [networkCode, setNetworkCode] = useState('512');
  const [monthlyPrice, setMonthlyPrice] = useState('5');
  const [annualPrice, setAnnualPrice] = useState('40');
  const [familyPrice, setFamilyPrice] = useState('65');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 font-['Cairo',sans-serif] animate-fadeIn">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-2">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-amber-400" />
          <h2 className="text-lg font-black text-white font-['Tajawal']">
            إدارة الباقات والاشتراكات الذهبية VIP
          </h2>
        </div>
        <p className="text-xs text-neutral-400 max-w-2xl">
          التحكم بأسعار باقات الاشتراك، رقم شبكة الكروت بتطبيق جوالي، والاشتراكات المباشرة بدون إعلانات.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>تم حفظ إعدادات الباقات وأرقام الشبكة بنجاح!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Network Card Code Settings */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">إعدادات كروت الشبكة المباشرة (تطبيق جوالي)</h3>
          </div>

          <div className="space-y-2 text-xs">
            <label className="font-bold text-neutral-300">رقم الشبكة في تطبيق جوالي</label>
            <input
              type="text"
              value={networkCode}
              onChange={(e) => setNetworkCode(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-3 font-bold text-amber-400 text-sm"
            />
            <p className="text-[10px] text-neutral-500">هذا الرقم يظهر في كافة بطاقات الإعلان وبوبات الدفع السريعة.</p>
          </div>
        </div>

        {/* Package Prices */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
            <Crown className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">أسعار الباقات الذهبية ($ USD)</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-neutral-400">الباقة الشهرية</label>
              <input
                type="text"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white text-center font-black"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-amber-400">الباقة السنوية</label>
              <input
                type="text"
                value={annualPrice}
                onChange={(e) => setAnnualPrice(e.target.value)}
                className="w-full bg-neutral-950 border border-amber-500/50 focus:border-amber-500 rounded-xl p-2.5 text-amber-300 text-center font-black"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-400">الباقة العائلية</label>
              <input
                type="text"
                value={familyPrice}
                onChange={(e) => setFamilyPrice(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-2.5 text-white text-center font-black"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 text-left">
          <button
            type="submit"
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>حفظ إعدادات الباقات والتحديث</span>
          </button>
        </div>

      </form>

    </div>
  );
};
