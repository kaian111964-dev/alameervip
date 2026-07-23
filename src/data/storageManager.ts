import { MediaItem, Season, Episode, VideoServer } from '../types';
import { MEDIA_ITEMS } from './mediaData';
import { LIVE_CHANNELS, LiveChannel } from './liveChannelsData';

const MEDIA_STORAGE_KEY = 'alameer_media_items_v2';
const CHANNELS_STORAGE_KEY = 'alameer_live_channels_v2';
const CATEGORIES_STORAGE_KEY = 'alameer_categories_v2';
const CATEGORY_ITEMS_STORAGE_KEY = 'alameer_category_items_v2';
const ANNOUNCEMENT_STORAGE_KEY = 'alameer_announcement_banner_v2';

export type CategoryType = 'movie' | 'series' | 'sports' | 'tvshow';

export interface CategoryItem {
  id: string;
  name: string;
  type: CategoryType;
  order: number;
}

export interface AnnouncementBanner {
  enabled: boolean;
  title: string;
  subtitle: string;
  badgeText: string;
  imageUrl: string;
  buttonText: string;
  linkUrl: string;
  networkNumber: string;
}

export const DEFAULT_ANNOUNCEMENT: AnnouncementBanner = {
  enabled: true,
  title: 'مرحباً بكم في شبكة وإستراحة الأمير نت الذهبية .. 👑',
  subtitle: 'أسرع سيرفرات مشاهدة بدون تقطيع وبدون إعلانات منبثقة إطلاقاً.',
  badgeText: 'الشبكة الذهبية',
  imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
  buttonText: 'شراء كروت الشبكة',
  linkUrl: 'https://wa.me/967778215553',
  networkNumber: '512'
};

export const DEFAULT_CATEGORIES = [
  'الكل',
  'مسلسلات رمضان 2026',
  'افلام اجنبي',
  'افلام عربي',
  'افلام هندي',
  'مسلسلات اجنبية',
  'مسلسلات تركية',
  'مسلسلات عربية',
  'مسلسلات اسيوية',
  'برامج تلفزيونية',
  'انمي وكارتون',
  'مصارعة حرة ومباريات'
];

export const DEFAULT_CATEGORY_ITEMS: CategoryItem[] = DEFAULT_CATEGORIES.map((cat, idx) => {
  let type: CategoryType = 'movie';
  if (cat.includes('مسلسلات') || cat.includes('انمي')) type = 'series';
  else if (cat.includes('مصارعة') || cat.includes('مباريات') || cat.includes('رياضة')) type = 'sports';
  else if (cat.includes('برامج')) type = 'tvshow';
  return {
    id: `cat-${idx}-${Date.now()}`,
    name: cat,
    type,
    order: idx
  };
});

// Helper for Announcement Banner
export function getStoredAnnouncement(): AnnouncementBanner {
  try {
    const data = localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_ANNOUNCEMENT, ...parsed };
      }
    }
  } catch (e) {
    console.error('Failed to read announcement banner from storage', e);
  }
  saveStoredAnnouncement(DEFAULT_ANNOUNCEMENT);
  return DEFAULT_ANNOUNCEMENT;
}

export function saveStoredAnnouncement(banner: AnnouncementBanner): void {
  try {
    localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(banner));
  } catch (e) {
    console.error('Failed to save announcement banner to storage', e);
  }
}

// Helper for Structured Category Items
export function getStoredCategoryItems(): CategoryItem[] {
  try {
    const data = localStorage.getItem(CATEGORY_ITEMS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => a.order - b.order);
      }
    }
  } catch (e) {
    console.error('Failed to read category items from storage', e);
  }
  saveStoredCategoryItems(DEFAULT_CATEGORY_ITEMS);
  return DEFAULT_CATEGORY_ITEMS;
}

export function saveStoredCategoryItems(items: CategoryItem[]): void {
  try {
    localStorage.setItem(CATEGORY_ITEMS_STORAGE_KEY, JSON.stringify(items));
    // Also sync standard category string list
    const stringList = items.map(i => i.name);
    saveStoredCategories(stringList);
  } catch (e) {
    console.error('Failed to save category items to storage', e);
  }
}

// Helper to initialize and retrieve stored Media Items
export function getStoredMediaItems(): MediaItem[] {
  try {
    const data = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read media items from storage', e);
  }
  // Initialize with default dataset if empty
  saveStoredMediaItems(MEDIA_ITEMS);
  return MEDIA_ITEMS;
}

export function saveStoredMediaItems(items: MediaItem[]): void {
  try {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save media items to storage', e);
  }
}

// Helper for Live Channels
export function getStoredLiveChannels(): LiveChannel[] {
  try {
    const data = localStorage.getItem(CHANNELS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read live channels from storage', e);
  }
  saveStoredLiveChannels(LIVE_CHANNELS);
  return LIVE_CHANNELS;
}

export function saveStoredLiveChannels(channels: LiveChannel[]): void {
  try {
    localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(channels));
  } catch (e) {
    console.error('Failed to save live channels to storage', e);
  }
}

// Helper for Categories
export function getStoredCategories(): string[] {
  try {
    const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read categories from storage', e);
  }
  saveStoredCategories(DEFAULT_CATEGORIES);
  return DEFAULT_CATEGORIES;
}

export function saveStoredCategories(categories: string[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories to storage', e);
  }
}
