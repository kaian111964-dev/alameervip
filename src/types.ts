export type MediaType = 'movie' | 'series' | 'ramadan' | 'show' | 'wrestling';

export interface VideoServer {
  id: string;
  name: string;
  url: string;
  quality: string;
  isYoutube?: boolean;
}

export interface Episode {
  id: number;
  number: number;
  title: string;
  duration?: string;
  videoUrl: string;
  servers?: VideoServer[];
}

export interface Season {
  id: number;
  seasonNumber: number;
  title: string;
  poster?: string;
  episodes: Episode[];
}

export interface MediaItem {
  id: string;
  title: string;
  englishTitle?: string;
  type: MediaType;
  category: string;
  genre: string[];
  year: number;
  quality: string;
  rating: number;
  views: number;
  isPinned?: boolean;
  poster: string;
  backdrop?: string;
  synopsis: string;
  duration?: string;
  fileSize?: string;
  country?: string;
  language?: string;
  seasonsCount?: number;
  seasons?: Season[];
  trailerUrl?: string;
  badgeTag?: string;
  translation?: 'مترجم' | 'مدبلج' | 'عربي' | string;
  episodes?: Episode[];
  videoUrl?: string;
  servers?: VideoServer[];
  downloadLinks?: { label: string; url: string; quality: string; size?: string }[];
}

export type FilterSortOption = 'latest' | 'imdbRating' | 'views' | 'pinned' | 'newMovies' | 'newEpisodes';

export type SubscriptionPlan = 'مجاني' | 'VIP شهري' | 'VIP سنوي' | 'باقة عائلية';
export type SubscriptionStatus = 'نشط' | 'منتهي' | 'معلق' | 'محظور';

export interface UserProfile {
  id: string;
  uid?: string;
  email: string;
  displayName: string;
  phone?: string;
  role: 'user' | 'admin';
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiry?: string;
  createdAt: string;
  lastLogin?: string;
  notes?: string;
  avatarUrl?: string;
}

