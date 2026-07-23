import { MediaItem, Season, Episode, VideoServer } from '../types';
import { MEDIA_ITEMS } from './mediaData';
import { LIVE_CHANNELS, LiveChannel } from './liveChannelsData';

const MEDIA_STORAGE_KEY = 'alameer_media_items_v2';
const CHANNELS_STORAGE_KEY = 'alameer_live_channels_v2';
const CATEGORIES_STORAGE_KEY = 'alameer_categories_v2';

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
  'انمي وكارتون',
  'مصارعة حرة'
];

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
