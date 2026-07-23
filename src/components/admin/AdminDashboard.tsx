import React, { useState } from 'react';
import { MediaItem } from '../../types';
import { LiveChannel } from '../../data/liveChannelsData';
import { AdminOverview } from './AdminOverview';
import { AdminMediaManager } from './AdminMediaManager';
import { AdminChannelsManager } from './AdminChannelsManager';
import { AdminCategoriesManager } from './AdminCategoriesManager';
import { AdminPackagesManager } from './AdminPackagesManager';

import { 
  LayoutDashboard, Film, Tv, FolderKanban, Crown, ArrowRight, LogOut, 
  ShieldCheck, Sparkles, Menu, X, Plus
} from 'lucide-react';

interface AdminDashboardProps {
  mediaItems: MediaItem[];
  liveChannels: LiveChannel[];
  categories: string[];
  onSaveMediaItems: (items: MediaItem[]) => void;
  onSaveLiveChannels: (channels: LiveChannel[]) => void;
  onSaveCategories: (categories: string[]) => void;
  onExitAdmin: () => void;
  onLogoutAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  mediaItems,
  liveChannels,
  categories,
  onSaveMediaItems,
  onSaveLiveChannels,
  onSaveCategories,
  onExitAdmin,
  onLogoutAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'media' | 'channels' | 'categories' | 'packages'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [triggerCreateMedia, setTriggerCreateMedia] = useState(false);
  const [triggerCreateChannel, setTriggerCreateChannel] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-['Cairo',sans-serif]">
      
      {/* Top Navbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-neutral-900 border border-amber-500/30 shadow-2xl">
        
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-neutral-950 font-black flex items-center justify-center shadow-lg shrink-0">
              <Crown className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-black text-white font-['Tajawal']">
                  لوحة تحكم شبكة الأمير نت
                </h1>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  المسؤول (ADMIN)
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                لوحة إدارية متكاملة للتحكم الفوري بالأفلام، المسلسلات والمواسم والبث المباشر
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-neutral-800 text-neutral-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          
          <button
            onClick={onExitAdmin}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>عرض الواجهة الرئيسية</span>
          </button>

          <button
            onClick={onLogoutAdmin}
            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="تسجيل الخروج من لوحة التحكم"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">خروج المسؤول</span>
          </button>

        </div>

      </div>

      {/* Main Tab Navigation Buttons */}
      <div className={`flex flex-col md:flex-row items-center gap-2 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-x-auto ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
        
        <button
          onClick={() => {
            setActiveTab('overview');
            setMobileMenuOpen(false);
          }}
          className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>الإحصائيات العامة</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('media');
            setMobileMenuOpen(false);
            setTriggerCreateMedia(false);
          }}
          className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'media'
              ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>إدارة الأفلام والمسلسلات</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('channels');
            setMobileMenuOpen(false);
            setTriggerCreateChannel(false);
          }}
          className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'channels'
              ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>إدارة البث المباشر والقنوات</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('categories');
            setMobileMenuOpen(false);
          }}
          className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>إدارة الأقسام والتصنيفات</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('packages');
            setMobileMenuOpen(false);
          }}
          className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'packages'
              ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>إدارة الباقات والكروت</span>
        </button>

      </div>

      {/* Render Active Tab View */}
      {activeTab === 'overview' && (
        <AdminOverview
          mediaItems={mediaItems}
          liveChannels={liveChannels}
          categories={categories}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onAddNewMedia={() => {
            setTriggerCreateMedia(true);
            setActiveTab('media');
          }}
          onAddNewChannel={() => {
            setTriggerCreateChannel(true);
            setActiveTab('channels');
          }}
        />
      )}

      {activeTab === 'media' && (
        <AdminMediaManager
          mediaItems={mediaItems}
          categories={categories}
          onSaveMediaItems={onSaveMediaItems}
          openCreateOnLoad={triggerCreateMedia}
        />
      )}

      {activeTab === 'channels' && (
        <AdminChannelsManager
          channels={liveChannels}
          onSaveChannels={onSaveLiveChannels}
          openCreateOnLoad={triggerCreateChannel}
        />
      )}

      {activeTab === 'categories' && (
        <AdminCategoriesManager
          categories={categories}
          mediaItems={mediaItems}
          onSaveCategories={onSaveCategories}
        />
      )}

      {activeTab === 'packages' && (
        <AdminPackagesManager />
      )}

    </div>
  );
};
