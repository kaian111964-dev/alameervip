import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, Crown, LogIn, UserPlus, Sparkles, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string) => void;
  onOpenPackages: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenPackages
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    
    // Check Admin Login
    if (cleanEmail === 'admin@alameer.com' && password.trim() === 'alameer') {
      onLoginSuccess('admin@alameer.com');
      onClose();
      return;
    }

    const displayName = mode === 'register' && name ? name : (cleanEmail.split('@')[0] || 'مشترك الأمير نت');
    onLoginSuccess(displayName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn font-['Cairo',sans-serif]">
      <div className="relative w-full max-w-md bg-neutral-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="relative p-6 bg-gradient-to-r from-neutral-950 via-amber-950/50 to-neutral-950 border-b border-neutral-800 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-2">
            <Crown className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-white font-['Tajawal']">
            {mode === 'login' ? 'تسجيل الدخول - الأمير نت' : 'إنشاء حساب جديد - الأمير نت'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            استمتع بحفظ المفضلات وإشعارات المسلسلات والأفلام بدقة عالية
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/60 p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login' 
                ? 'bg-amber-500 text-neutral-950 shadow-md' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>

          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register' 
                ? 'bg-amber-500 text-neutral-950 shadow-md' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>إنشاء حساب جديد</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Prominent VIP Subscription Banner Button */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/80 via-neutral-900 to-amber-950/80 border border-amber-500/40 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>تريد مشاهدة بدون إعلانات نهائياً؟</span>
            </div>
            
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPackages();
              }}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>أشترك الآن في الباقة المميزة</span>
            </button>
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">الاسم الكامل</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="أدخل اسمك الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
                <User className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300">البريد الإلكتروني أو اسم المستخدم</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="example@alameer.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">رقم الهاتف (اختياري)</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="05XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
                <Phone className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300">كلمة السر</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-lg mt-2 cursor-pointer"
          >
            {mode === 'login' ? 'تأكيد تسجيل الدخول' : 'تأكيد إنشاء الحساب'}
          </button>

        </form>

      </div>
    </div>
  );
};
