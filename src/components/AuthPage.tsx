import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Crown, User, Lock, Mail, Phone, LogIn, UserPlus, 
  Sparkles, ShieldCheck, CheckCircle2, Star, Home, ArrowLeft,
  Calendar, Award, CreditCard, Heart, LogOut, Edit3, Save, X, Key, AlertTriangle, Shield
} from 'lucide-react';
import { db, auth, COLLECTIONS } from '../lib/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updatePassword
} from 'firebase/auth';
import { UserProfile } from '../types';

interface AuthPageProps {
  onBackToHome: () => void;
  onLoginSuccess: (userName: string) => void;
  onOpenPackages: () => void;
  currentUserName: string | null;
  onLogout: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onBackToHome,
  onLoginSuccess,
  onOpenPackages,
  currentUserName,
  onLogout
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // User Profile State when logged in
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Fetch or sync user profile from Firestore if logged in
  useEffect(() => {
    if (currentUserName) {
      const fetchProfile = async () => {
        try {
          const docId = currentUserName === 'admin@alameer.com' ? 'admin-001' : currentUserName.replace(/[^a-zA-Z0-9]/g, '_');
          const userRef = doc(db, COLLECTIONS.USERS, docId);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUserProfile(data);
            setEditName(data.displayName);
            setEditPhone(data.phone || '');
          } else {
            // Default profile structure if document doesn't exist yet
            const defaultProf: UserProfile = {
              id: docId,
              displayName: currentUserName,
              email: currentUserName.includes('@') ? currentUserName : `${currentUserName}@alameer.com`,
              phone: '',
              role: currentUserName === 'admin@alameer.com' ? 'admin' : 'user',
              subscriptionPlan: 'VIP شهري',
              subscriptionStatus: 'نشط',
              subscriptionExpiry: '2026-12-31',
              createdAt: new Date().toISOString().split('T')[0]
            };
            setUserProfile(defaultProf);
            setEditName(defaultProf.displayName);
            // Save to Firestore
            setDoc(userRef, defaultProf).catch(e => console.warn('User profile create error:', e));
          }
        } catch (e) {
          console.warn('Error loading user profile:', e);
        }
      };
      fetchProfile();
    }
  }, [currentUserName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Admin Hardcoded Override
    if (cleanEmail === 'admin@alameer.com' && password.trim() === 'alameer') {
      const adminDocId = 'admin-001';
      const adminProf: UserProfile = {
        id: adminDocId,
        email: 'admin@alameer.com',
        displayName: 'مدير النظام (الأمير)',
        phone: '778215553',
        role: 'admin',
        subscriptionPlan: 'VIP سنوي',
        subscriptionStatus: 'نشط',
        subscriptionExpiry: '2030-12-31',
        createdAt: '2025-01-01',
        lastLogin: new Date().toISOString().split('T')[0]
      };
      await setDoc(doc(db, COLLECTIONS.USERS, adminDocId), adminProf).catch(() => {});
      
      onLoginSuccess('admin@alameer.com');
      setSuccessMessage('أهلاً وسهلاً بك في لوحة تحكم شبكة الأمير نت الذهبية 👑');
      setLoading(false);
      setTimeout(() => onBackToHome(), 1000);
      return;
    }

    try {
      if (mode === 'register') {
        // 1. Check if email already exists in Firestore or belongs to admin
        const isAdminEmail = cleanEmail === 'admin@alameer.com' || cleanEmail === 'abdualhamid100@gmail.com';

        const existingQuery = query(collection(db, COLLECTIONS.USERS), where('email', '==', cleanEmail));
        const existingSnap = await getDocs(existingQuery);
        if (!existingSnap.empty && !isAdminEmail) {
          throw new Error('عذراً، هذا البريد الإلكتروني مسجل بالفعل في منصة الأمير نت! لا يمكنك إنشاء أكثر من حساب بنفس البريد. يرجى تسجيل الدخول.');
        }

        let firebaseUid = '';
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          firebaseUid = userCredential.user.uid;
        } catch (authErr: any) {
          console.error('Firebase Auth register error:', authErr);
          const code = authErr.code || '';
          if (code === 'auth/email-already-in-use') {
            // Attempt login if email exists
            try {
              const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
              firebaseUid = userCred.user.uid;
            } catch {
              throw new Error('عذراً، هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بكتابة كلمة المرور الصحيحة.');
            }
          } else if (code === 'auth/weak-password') {
            throw new Error('كلمة المرور ضعيفة جداً. يجب أن تتكون من 6 أحرف على الأقل.');
          } else if (code === 'auth/invalid-email') {
            throw new Error('صيغة البريد الإلكتروني غير صحيحة.');
          } else {
            // Fallback for admin or general creation
            firebaseUid = 'user_' + Date.now();
          }
        }

        const displayName = name.trim() || (isAdminEmail ? 'المسؤول عبدالحميد' : cleanEmail.split('@')[0]) || 'مشترك جديد';
        const userDocId = firebaseUid || cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');

        const newUser: UserProfile = {
          id: userDocId,
          uid: firebaseUid,
          email: cleanEmail,
          displayName: displayName,
          phone: phone.trim(),
          role: isAdminEmail ? 'admin' : 'user',
          subscriptionPlan: isAdminEmail ? 'VIP سنوي' : 'VIP شهري',
          subscriptionStatus: 'نشط',
          subscriptionExpiry: '2030-12-31',
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: new Date().toISOString().split('T')[0]
        };

        // Save new user directly to Firestore
        await setDoc(doc(db, COLLECTIONS.USERS, userDocId), newUser);

        onLoginSuccess(cleanEmail);
        setSuccessMessage(`مرحباً بك ${displayName}! تم تسجيل وتأكيد حسابك بنجاح في الفايربيس.`);
      } else {
        // Mode === 'login'
        const isAdminEmail = cleanEmail === 'admin@alameer.com' || cleanEmail === 'abdualhamid100@gmail.com';
        let displayName = isAdminEmail ? 'المسؤول عبدالحميد' : cleanEmail.split('@')[0];
        let firebaseUid = '';

        // Allow Admin predefined credentials or Firebase Auth
        if (cleanEmail === 'abdualhamid100@gmail.com' && password === 'alameer') {
          // Guaranteed admin login
          try {
            const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
            firebaseUid = userCred.user.uid;
          } catch {
            // Auto register admin if not in Firebase Auth
            try {
              const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
              firebaseUid = newCred.user.uid;
            } catch {
              firebaseUid = 'admin_abdualhamid100';
            }
          }
        } else if (cleanEmail === 'admin@alameer.com' && (password === 'admin123' || password === 'alameer')) {
          try {
            const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
            firebaseUid = userCred.user.uid;
          } catch {
            firebaseUid = 'admin_alameer';
          }
        } else {
          try {
            const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
            firebaseUid = userCred.user.uid;
            if (userCred.user.displayName) displayName = userCred.user.displayName;
          } catch (authErr: any) {
            console.error('Firebase Auth login error:', authErr);
            const code = authErr.code || '';
            if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
              throw new Error('كلمة المرور غير صحيحة! يرجى التأكد من كلمة المرور وإعادة المحاولة.');
            } else if (code === 'auth/user-not-found') {
              throw new Error('البريد الإلكتروني غير مسجل بالمنصة. يمكنك إنشاء حساب جديد أولاً.');
            } else if (code === 'auth/invalid-email') {
              throw new Error('صيغة البريد الإلكتروني غير صحيحة.');
            } else if (code === 'auth/too-many-requests') {
              throw new Error('تم حظر المحاولات الفاشلة مؤقتاً للحماية. حاول بعد بضع دقائق.');
            } else {
              throw new Error('فشل تسجيل الدخول: كلمة المرور أو البريد الإلكتروني غير صحيح.');
            }
          }
        }

        // Fetch user record from Firestore to check subscription status and profile details
        const userDocId = firebaseUid || cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
        let snap = await getDoc(doc(db, COLLECTIONS.USERS, userDocId));

        if (!snap.exists()) {
          const altDocId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
          snap = await getDoc(doc(db, COLLECTIONS.USERS, altDocId));
        }

        if (snap.exists()) {
          const data = snap.data() as UserProfile;
          if (data.subscriptionStatus === 'محظور') {
            await signOut(auth).catch(() => {});
            throw new Error('عذراً، هذا الحساب محظور حالياً من قبل إدارة منصة الأمير نت.');
          }
          displayName = data.displayName || displayName;
          updateDoc(snap.ref, { lastLogin: new Date().toISOString().split('T')[0] }).catch(() => {});
        } else {
          // If Firestore doc missing for existing Auth user, create default
          const newProf: UserProfile = {
            id: userDocId,
            uid: firebaseUid,
            email: cleanEmail,
            displayName: displayName,
            role: isAdminEmail ? 'admin' : 'user',
            subscriptionPlan: isAdminEmail ? 'VIP سنوي' : 'VIP شهري',
            subscriptionStatus: 'نشط',
            subscriptionExpiry: '2030-12-31',
            createdAt: new Date().toISOString().split('T')[0]
          };
          await setDoc(doc(db, COLLECTIONS.USERS, userDocId), newProf).catch(() => {});
        }

        onLoginSuccess(cleanEmail);
        setSuccessMessage(`تم تسجيل الدخول والتحقق بنجاح! أهلاً بك يا ${displayName}.`);
      }

      setLoading(false);
      setTimeout(() => onBackToHome(), 1200);
    } catch (err: any) {
      console.error('Authentication Error:', err);
      setLoading(false);
      setErrorMessage(err.message || 'حدث خطأ أثناء الاتصال بالخادم. حاول مجدداً.');
    }
  };

  // Handle Save Profile Edits
  const handleSaveProfile = async () => {
    if (!userProfile) return;
    try {
      setLoading(true);
      const updated: UserProfile = {
        ...userProfile,
        displayName: editName,
        phone: editPhone
      };
      await setDoc(doc(db, COLLECTIONS.USERS, userProfile.id), updated);
      setUserProfile(updated);
      setIsEditingProfile(false);
      setLoading(false);
      setSuccessMessage('تم تحديث بيانات الملف الشخصي بنجاح');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setLoading(false);
      setErrorMessage('فشل تحديث البيانات في الفايربيس');
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    try {
      setLoading(true);
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
      }
      setSuccessMessage('تم تغيير كلمة المرور بنجاح');
      setShowPasswordChange(false);
      setNewPassword('');
      setLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'فشل تغيير كلمة المرور. يرجى إعادة تسجيل الدخول أولاً.');
    }
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
              الأمير نت
            </span>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        
        {currentUserName ? (
          /* User is logged in: Display Full Profile Dashboard */
          <div className="p-6 sm:p-10 rounded-3xl bg-neutral-900 border border-amber-500/30 shadow-2xl space-y-8 animate-fadeIn">
            
            {/* Header Title / Avatar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-neutral-800">
              <div className="flex items-center gap-4 text-center sm:text-right">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-1 shadow-xl">
                    <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-amber-400 font-black text-2xl">
                      {currentUserName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-500 text-neutral-950 p-1 rounded-lg shadow">
                    <Crown className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white font-['Tajawal']">
                      {userProfile?.displayName || currentUserName}
                    </h2>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {userProfile?.subscriptionPlan || 'VIP ذهبي'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">{userProfile?.email || currentUserName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-xs border border-neutral-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditingProfile ? 'إلغاء التعديل' : 'تعديل البيانات'}</span>
                </button>

                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>

            {/* Notification messages */}
            {successMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Editing Profile Form */}
            {isEditingProfile ? (
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold text-amber-400">تحديث معلومات الحساب</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 block">الاسم الكريم</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 block">رقم الهاتف (واتساب)</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-neutral-950 text-xs font-black shadow"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            ) : (
              /* Profile Details Grid */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Crown className="w-4 h-4" />
                    <span className="text-xs font-bold">نوع الباقة النشطة</span>
                  </div>
                  <p className="text-lg font-black text-white font-['Tajawal']">{userProfile?.subscriptionPlan || 'VIP شهري'}</p>
                  <p className="text-[10px] text-neutral-400">مشاهدة بجودة 4K وبدون إعلانات</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold">صلاحية الاشتراك</span>
                  </div>
                  <p className="text-lg font-black text-white font-['Tajawal'] font-mono">{userProfile?.subscriptionExpiry || '2026-12-31'}</p>
                  <p className="text-[10px] text-emerald-400 font-bold">الحساب فعال ونشط</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-bold">رقم التواصل المسجل</span>
                  </div>
                  <p className="text-lg font-black text-white font-['Tajawal'] font-mono">{userProfile?.phone || 'غير محدد'}</p>
                  <p className="text-[10px] text-neutral-400">مفعل لاستلام إشعارات الواتساب</p>
                </div>

              </div>
            )}

            {/* Quick Actions & Navigation */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={onBackToHome}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>العودة لتصفح الأعمال</span>
              </button>

              <button
                onClick={onOpenPackages}
                className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-xs sm:text-sm border border-neutral-700 flex items-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>ترقية / تجديد الاشتراك</span>
              </button>

              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs sm:text-sm border border-neutral-700 flex items-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4 text-neutral-400" />
                <span>تغيير كلمة المرور</span>
              </button>
            </div>

            {/* Password Change Subform */}
            {showPasswordChange && (
              <form onSubmit={handleChangePassword} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-400">تغيير كلمة المرور الخاصة بحسابك</h4>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="password"
                    placeholder="كلمة المرور الجديدة (6 أحرف فأكثر)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 text-neutral-950 font-black text-xs rounded-xl shrink-0"
                  >
                    تحديث كلمة المرور
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          /* Login or Register Form */
          <div className="p-6 sm:p-10 rounded-3xl bg-neutral-900 border border-amber-500/30 shadow-2xl space-y-8 animate-fadeIn">
            
            {/* Header Title */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>حسابك الشخصي في الأمير نت</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black text-white font-['Tajawal'] gold-gradient-text">
                {mode === 'login' ? 'تسجيل الدخول إلى حسابك 👑' : 'إنشاء حساب جديد في الأمير نت 🚀'}
              </h1>
              
              <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
                استمتع بحفظ قائمة المفضلات، وإشعارات الحلقات والأفلام أولاً بأول وبدون إعلانات.
              </p>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex border border-neutral-800 bg-neutral-950 p-1.5 rounded-2xl max-w-md mx-auto">
              <button
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </button>

              <button
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>حساب جديد</span>
              </button>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn max-w-md mx-auto">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn max-w-md mx-auto">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 block">الاسم الكامل / الاسم المستعار *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="أدخل اسمك الكريم"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pr-10 pl-4 py-3 text-xs sm:text-sm text-white focus:outline-none"
                    />
                    <User className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 block">البريد الإلكتروني / اسم المستخدم *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="example@alameer.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pr-10 pl-4 py-3 text-xs sm:text-sm text-white focus:outline-none font-mono"
                  />
                  <Mail className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 block">رقم الهاتف (واتساب)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="778215553"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pr-10 pl-4 py-3 text-xs sm:text-sm text-white focus:outline-none font-mono"
                    />
                    <Phone className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 block">كلمة المرور *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pr-10 pl-4 py-3 text-xs sm:text-sm text-white focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102 disabled:opacity-50"
              >
                <span>{loading ? 'جاري الاتصال والتحقق...' : mode === 'login' ? 'تأكيد دخول الحساب' : 'إتمام إنشاء الحساب'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

            </form>

            {/* Quick Helper Note for Admin */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-1 max-w-md mx-auto">
              <p className="text-[11px] text-amber-400 font-bold">دخول الإدارة المباشر (للمشرفين):</p>
              <p className="text-[10px] text-neutral-400 font-mono">
                البريد: <span className="text-white">admin@alameer.com</span> | كلمة المرور: <span className="text-white">alameer</span>
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
