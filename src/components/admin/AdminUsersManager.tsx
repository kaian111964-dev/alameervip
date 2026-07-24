import React, { useState, useEffect } from 'react';
import { UserProfile, SubscriptionPlan, SubscriptionStatus } from '../../types';
import { db, COLLECTIONS } from '../../lib/firebase';
import { 
  collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, writeBatch 
} from 'firebase/firestore';
import { 
  Users, UserPlus, Search, ShieldCheck, CheckCircle2, XCircle, 
  Clock, Trash2, Edit3, Crown, Lock, Mail, Phone, User, Filter, 
  Sparkles, RefreshCw, AlertTriangle, Shield, Check, Calendar, FileText, Ban
} from 'lucide-react';

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'admin-001',
    email: 'admin@alameer.com',
    displayName: 'مدير النظام (الأمير)',
    phone: '778215553',
    role: 'admin',
    subscriptionPlan: 'VIP سنوي',
    subscriptionStatus: 'نشط',
    subscriptionExpiry: '2030-12-31',
    createdAt: '2025-01-01',
    lastLogin: new Date().toISOString().split('T')[0],
    notes: 'حساب مشرف النظام الرئيسي'
  },
  {
    id: 'user-002',
    email: 'ahmed.vip@gmail.com',
    displayName: 'أحمد علي اليماني',
    phone: '771234567',
    role: 'user',
    subscriptionPlan: 'VIP شهري',
    subscriptionStatus: 'نشط',
    subscriptionExpiry: '2026-08-25',
    createdAt: '2025-06-15',
    lastLogin: new Date().toISOString().split('T')[0],
    notes: 'تم الدفع عبر العمقي للصرافة'
  },
  {
    id: 'user-003',
    email: 'khaled.family@yahoo.com',
    displayName: 'خالد الكبسي',
    phone: '733987654',
    role: 'user',
    subscriptionPlan: 'باقة عائلية',
    subscriptionStatus: 'نشط',
    subscriptionExpiry: '2027-01-10',
    createdAt: '2025-07-01',
    lastLogin: '2026-07-20',
    notes: 'باقة عائلية 5 أجهزة'
  },
  {
    id: 'user-004',
    email: 'sara.free@outlook.com',
    displayName: 'سارة الشامي',
    phone: '775112233',
    role: 'user',
    subscriptionPlan: 'مجاني',
    subscriptionStatus: 'نشط',
    subscriptionExpiry: '-',
    createdAt: '2025-07-10',
    lastLogin: '2026-07-22'
  },
  {
    id: 'user-005',
    email: 'blocked.test@alameer.com',
    displayName: 'مستخدم محظور تجريبي',
    phone: '770000000',
    role: 'user',
    subscriptionPlan: 'مجاني',
    subscriptionStatus: 'محظور',
    subscriptionExpiry: '2025-05-01',
    createdAt: '2025-02-10',
    notes: 'تم الحظر بسبب مخالفة شروط الاستخدام'
  }
];

export const AdminUsersManager: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    displayName: '',
    email: '',
    phone: '',
    role: 'user',
    subscriptionPlan: 'VIP شهري',
    subscriptionStatus: 'نشط',
    subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Subscribe to Firestore users collection
  useEffect(() => {
    setLoading(true);
    const usersRef = collection(db, COLLECTIONS.USERS);

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      if (snapshot.empty) {
        // Seed initial users if Firestore collection is empty
        const batch = writeBatch(db);
        INITIAL_USERS.forEach((u) => {
          batch.set(doc(db, COLLECTIONS.USERS, u.id), u);
        });
        batch.commit().catch(err => console.warn('Firestore user seed failed:', err));
        setUsers(INITIAL_USERS);
      } else {
        const userList = snapshot.docs.map(docSnap => docSnap.data() as UserProfile);
        setUsers(userList);
      }
      setLoading(false);
    }, (error) => {
      console.warn('Firestore users subscription warning:', error);
      setUsers(INITIAL_USERS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Filter Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone || '').includes(searchQuery);

    const matchesPlan = planFilter === 'all' || u.subscriptionPlan === planFilter;
    const matchesStatus = statusFilter === 'all' || u.subscriptionStatus === statusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Calculate Statistics
  const totalCount = users.length;
  const vipCount = users.filter(u => u.subscriptionPlan !== 'مجاني').length;
  const activeCount = users.filter(u => u.subscriptionStatus === 'نشط').length;
  const blockedCount = users.filter(u => u.subscriptionStatus === 'محظور').length;

  // Handle Save (Add or Edit User)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.displayName) {
      showToast('يرجى ملء جميع الحقول الأساسية', 'error');
      return;
    }

    try {
      if (editingUser) {
        // Update user
        const updatedUser: UserProfile = {
          ...editingUser,
          displayName: formData.displayName || editingUser.displayName,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone || '',
          role: formData.role || 'user',
          subscriptionPlan: (formData.subscriptionPlan as SubscriptionPlan) || 'VIP شهري',
          subscriptionStatus: (formData.subscriptionStatus as SubscriptionStatus) || 'نشط',
          subscriptionExpiry: formData.subscriptionExpiry || '',
          notes: formData.notes || ''
        };

        await setDoc(doc(db, COLLECTIONS.USERS, editingUser.id), updatedUser);
        showToast(`تم تحديث بيانات المشترك (${updatedUser.displayName}) بنجاح`);
        setEditingUser(null);
      } else {
        // Add new user
        const newId = `user-${Date.now()}`;
        const newUser: UserProfile = {
          id: newId,
          uid: newId,
          displayName: formData.displayName,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone || '',
          role: formData.role || 'user',
          subscriptionPlan: (formData.subscriptionPlan as SubscriptionPlan) || 'VIP شهري',
          subscriptionStatus: (formData.subscriptionStatus as SubscriptionStatus) || 'نشط',
          subscriptionExpiry: formData.subscriptionExpiry || '',
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: new Date().toISOString().split('T')[0],
          notes: formData.notes || ''
        };

        await setDoc(doc(db, COLLECTIONS.USERS, newId), newUser);
        showToast(`تمت إضافة المستخدم الجديد (${newUser.displayName}) بنجاح في الفايربيس`);
        setIsAddModalOpen(false);
      }

      // Reset Form State
      setFormData({
        displayName: '',
        email: '',
        phone: '',
        role: 'user',
        subscriptionPlan: 'VIP شهري',
        subscriptionStatus: 'نشط',
        subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: ''
      });
    } catch (err) {
      console.error('Error saving user:', err);
      showToast('حدث خطأ أثناء حفظ بيانات المستخدم', 'error');
    }
  };

  // Toggle Quick Block Status
  const handleToggleBlock = async (user: UserProfile) => {
    try {
      const newStatus: SubscriptionStatus = user.subscriptionStatus === 'محظور' ? 'نشط' : 'محظور';
      const updated = { ...user, subscriptionStatus: newStatus };
      await setDoc(doc(db, COLLECTIONS.USERS, user.id), updated);
      showToast(newStatus === 'محظور' ? `تم حظر المستخدم (${user.displayName})` : `تم إلغاء حظر المستخدم (${user.displayName})`);
    } catch (err) {
      showToast('فشل تغيير حالة الحظر', 'error');
    }
  };

  // Delete User
  const handleDeleteConfirm = async () => {
    if (!deletingUserId) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.USERS, deletingUserId));
      showToast('تم حذف حساب المستخدم بنجاح');
      setDeletingUserId(null);
    } catch (err) {
      showToast('فشل حذف حساب المستخدم', 'error');
    }
  };

  // Helper for Plan Badge Style
  const getPlanBadge = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'VIP سنوي':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-black';
      case 'VIP شهري':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 font-bold';
      case 'باقة عائلية':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700 font-medium';
    }
  };

  // Helper for Status Badge Style
  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case 'نشط':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'منتهي':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'محظور':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  return (
    <div className="space-y-6 font-['Cairo',sans-serif]">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 left-6 z-50 px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 animate-slideUp text-xs sm:text-sm font-bold ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50' 
            : 'bg-red-950/90 text-red-300 border-red-500/50'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Users className="w-4 h-4" />
            <span>إدارة حسابات المشتركين والمشرفين</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Tajawal'] gold-gradient-text">
            سجل المستخدمين والاشتراكات الفاخرة
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl">
            مزامنة فورية مع قاعدة بيانات الفايربيس (Firestore). يمكنك إضافة وتعديل باقات المشتركين، تحديد تاريخ الانتهاء، وتأكيد الصلاحيات.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              displayName: '',
              email: '',
              phone: '',
              role: 'user',
              subscriptionPlan: 'VIP شهري',
              subscriptionStatus: 'نشط',
              subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              notes: ''
            });
            setIsAddModalOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-transform hover:scale-102 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة مشترك جديد يدوياً</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-neutral-400 font-bold">إجمالي المستخدمين</p>
            <p className="text-2xl font-black text-white font-['Tajawal'] mt-1">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-amber-500/20 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-amber-400 font-bold">المشتركين الـ VIP</p>
            <p className="text-2xl font-black text-amber-300 font-['Tajawal'] mt-1">{vipCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-emerald-400 font-bold">الحسابات النشطة</p>
            <p className="text-2xl font-black text-emerald-400 font-['Tajawal'] mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-red-500/20 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-red-400 font-bold">الحسابات المحظورة</p>
            <p className="text-2xl font-black text-red-400 font-['Tajawal'] mt-1">{blockedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
            <Ban className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search Field */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="بحث بالاسم، البريد أو الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          
          <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-300">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-neutral-400">الباقة:</span>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none text-xs cursor-pointer"
            >
              <option value="all" className="bg-neutral-900 text-white">الكل</option>
              <option value="VIP شهري" className="bg-neutral-900 text-white">VIP شهري</option>
              <option value="VIP سنوي" className="bg-neutral-900 text-white">VIP سنوي</option>
              <option value="باقة عائلية" className="bg-neutral-900 text-white">باقة عائلية</option>
              <option value="مجاني" className="bg-neutral-900 text-white">مجاني</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-300">
            <span className="text-[11px] font-bold text-neutral-400">الحالة:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none text-xs cursor-pointer"
            >
              <option value="all" className="bg-neutral-900 text-white">الكل</option>
              <option value="نشط" className="bg-neutral-900 text-white">نشط</option>
              <option value="منتهي" className="bg-neutral-900 text-white">منتهي</option>
              <option value="محظور" className="bg-neutral-900 text-white">محظور</option>
            </select>
          </div>

        </div>

      </div>

      {/* Users Table List */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-neutral-400 space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-xs font-bold">جاري تحميل بيانات المستخدمين من الفايربيس...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 space-y-3">
            <Users className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-sm font-bold text-white">لا توجد نتائج مطابقة للبحث</p>
            <p className="text-xs text-neutral-500">تأكد من عبارة البحث أو الفلاتر المحددة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/80 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="p-4">المشترك</th>
                  <th className="p-4">النوع / الصلاحية</th>
                  <th className="p-4">نوع الباقة</th>
                  <th className="p-4">تاريخ الانتهاء</th>
                  <th className="p-4">حالة الحساب</th>
                  <th className="p-4 text-center">الإجراءات والتحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-800/40 transition-colors">
                    
                    {/* User Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-neutral-700 flex items-center justify-center font-black text-amber-400 text-sm shrink-0">
                          {u.displayName ? u.displayName.charAt(0) : 'U'}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs">{u.displayName}</span>
                            {u.role === 'admin' && (
                              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black rounded-md">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 font-mono">{u.email}</p>
                          {u.phone && <p className="text-[10px] text-neutral-500 font-mono">📱 {u.phone}</p>}
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
                        u.role === 'admin' 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                      }`}>
                        {u.role === 'admin' ? <Shield className="w-3 h-3 text-amber-400" /> : <User className="w-3 h-3" />}
                        <span>{u.role === 'admin' ? 'مشرف رئيسي' : 'مشترك عام'}</span>
                      </span>
                    </td>

                    {/* Subscription Plan */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[11px] ${getPlanBadge(u.subscriptionPlan)}`}>
                        {u.subscriptionPlan !== 'مجاني' && <Crown className="w-3.5 h-3.5" />}
                        <span>{u.subscriptionPlan}</span>
                      </span>
                    </td>

                    {/* Expiry Date */}
                    <td className="p-4 font-mono text-neutral-300 text-[11px]">
                      <div className="flex items-center gap-1 text-neutral-300">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{u.subscriptionExpiry || '-'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${getStatusBadge(u.subscriptionStatus)}`}>
                        {u.subscriptionStatus === 'نشط' && <CheckCircle2 className="w-3 h-3" />}
                        {u.subscriptionStatus === 'محظور' && <Ban className="w-3 h-3" />}
                        {u.subscriptionStatus === 'منتهي' && <Clock className="w-3 h-3" />}
                        <span>{u.subscriptionStatus}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setFormData({
                              displayName: u.displayName,
                              email: u.email,
                              phone: u.phone || '',
                              role: u.role,
                              subscriptionPlan: u.subscriptionPlan,
                              subscriptionStatus: u.subscriptionStatus,
                              subscriptionExpiry: u.subscriptionExpiry || '',
                              notes: u.notes || ''
                            });
                          }}
                          className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all cursor-pointer"
                          title="تعديل الحساب والاشتراك"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Block Button */}
                        <button
                          onClick={() => handleToggleBlock(u)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            u.subscriptionStatus === 'محظور'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                          }`}
                          title={u.subscriptionStatus === 'محظور' ? 'إلغاء حظر الحساب' : 'حظر الحساب'}
                        >
                          {u.subscriptionStatus === 'محظور' ? <Check className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeletingUserId(u.id)}
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-400 border border-neutral-700 transition-all cursor-pointer"
                          title="حذف المستخدم نهائياً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit User Modal */}
      {(isAddModalOpen || editingUser) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-amber-500/30 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  {editingUser ? <Edit3 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <h3 className="text-lg font-black text-white font-['Tajawal']">
                  {editingUser ? `تعديل مشترك: ${editingUser.displayName}` : 'إضافة مشترك جديد يدوياً'}
                </h3>
              </div>

              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingUser(null);
                }}
                className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold block">الاسم الكامل للمشترك *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: محمد العمري"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold block">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    placeholder="user@alameer.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold block">رقم الهاتف (واتساب)</label>
                  <input
                    type="tel"
                    placeholder="771234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold block">نوع الباقة والميزة</label>
                  <select
                    value={formData.subscriptionPlan}
                    onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value as SubscriptionPlan })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-amber-300 font-bold focus:outline-none"
                  >
                    <option value="VIP شهري">VIP شهري (شهر واحد)</option>
                    <option value="VIP سنوي">VIP سنوي (سنة كاملة)</option>
                    <option value="باقة عائلية">باقة عائلية (متعددة)</option>
                    <option value="مجاني">مجاني</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold block">حالة الحساب</label>
                  <select
                    value={formData.subscriptionStatus}
                    onChange={(e) => setFormData({ ...formData, subscriptionStatus: e.target.value as SubscriptionStatus })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-amber-300 font-bold focus:outline-none"
                  >
                    <option value="نشط">نشط (فعّال)</option>
                    <option value="منتهي">منتهي الاشتراك</option>
                    <option value="محظور">محظور من الخدمة</option>
                    <option value="معلق">معلق مؤقتاً</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold block">تاريخ انتهاء الاشتراك</label>
                  <input
                    type="date"
                    value={formData.subscriptionExpiry}
                    onChange={(e) => setFormData({ ...formData, subscriptionExpiry: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold block">الصلاحية للنظام</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  >
                    <option value="user">مشترك عادي (User)</option>
                    <option value="admin">مشرف إداري (Admin)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold block">ملاحظات الإدارة (اختياري)</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات دفع، كود كرت الاشتراك، أو سبب الحظر..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black shadow-lg shadow-amber-500/20"
                >
                  {editingUser ? 'حفظ التعديلات' : 'تأكيد وحفظ المستخدِم'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUserId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-500/40 w-full max-w-md rounded-3xl p-6 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white font-['Tajawal']">تأكيد حذف حساب المستخدم؟</h3>
              <p className="text-xs text-neutral-400">
                سيتم حذف هذا الحساب نهائياً من قاعدة بيانات الفايربيس وستفقد جميع بيانات الاشتراك المتعلقة به.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingUserId(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold"
              >
                إلغاء
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-600/30"
              >
                تأكيد الحذف النهائي
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
