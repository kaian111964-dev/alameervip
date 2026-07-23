export interface LiveChannel {
  id: string;
  name: string;
  category: string;
  logo: string;
  streamUrl: string;
  currentProgram: string;
  isPopular?: boolean;
  quality: string;
}

export const LIVE_CHANNEL_CATEGORIES = [
  'الكل',
  'قنوات الأخبار',
  'الأفلام والمسلسلات',
  'القنوات الرياضية',
  'الموسوعة الدينية',
  'المصارعة والترفيه',
  'الأطفال والأنمي'
];

export const LIVE_CHANNELS: LiveChannel[] = [
  // 1. قنوات الأخبار
  {
    id: 'aljazeera-news',
    name: 'قناة الجزيرة الإخبارية',
    category: 'قنوات الأخبار',
    logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    currentProgram: 'موجز الأخبار والنشرة الرئيسية - بث مباشر',
    isPopular: true,
    quality: '1080p HD'
  },
  {
    id: 'alarabiya-news',
    name: 'قناة العربية الأخبارية',
    category: 'قنوات الأخبار',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    currentProgram: 'الأخبار السريعة وتغطية الأحداث العالمية',
    isPopular: true,
    quality: '1080p HD'
  },
  {
    id: 'bbc-arabic-news',
    name: 'BBC عربي HD',
    category: 'قنوات الأخبار',
    logo: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    currentProgram: 'العالم هذا المساء - تغطيات وثائقية',
    quality: '720p HD'
  },

  // 2. الأفلام والمسلسلات
  {
    id: 'mbc1-hd',
    name: 'قناة MBC 1 HD',
    category: 'الأفلام والمسلسلات',
    logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    currentProgram: 'عرض درامي حصري - مسلسلات العرب',
    isPopular: true,
    quality: '1080p Full HD'
  },
  {
    id: 'mbc-drama',
    name: 'قناة MBC دراما',
    category: 'الأفلام والمسلسلات',
    logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    currentProgram: 'مسلسل الحشاشين - الحلقة الأخيرة',
    isPopular: true,
    quality: '1080p HD'
  },
  {
    id: 'rotana-cinema',
    name: 'روتانا سينما HD',
    category: 'الأفلام والمسلسلات',
    logo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2012.mp4',
    currentProgram: 'فيلم السهرة العربي الحصري',
    quality: '1080p HD'
  },

  // 3. القنوات الرياضية
  {
    id: 'bein-sports-1',
    name: 'beIN SPORTS Premium 1 HD',
    category: 'القنوات الرياضية',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    currentProgram: 'استوديو تحليلي - دوري أبطال أوروبا',
    isPopular: true,
    quality: '1080p 60fps'
  },
  {
    id: 'ssc-sports-1',
    name: 'SSC Sports 1 HD',
    category: 'القنوات الرياضية',
    logo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    currentProgram: 'مباراة قمة الدوري - بث مباشر',
    isPopular: true,
    quality: '1080p 60fps'
  },

  // 4. الموسوعة الدينية
  {
    id: 'quran-tv-hd',
    name: 'قناة القرآن الكريم بث مباشر',
    category: 'الموسوعة الدينية',
    logo: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    currentProgram: 'بث مباشر من المسجد الحرام بمكة المكرمة',
    isPopular: true,
    quality: '1080p HD'
  },
  {
    id: 'sunnah-tv-hd',
    name: 'قناة السنة النبوية بث مباشر',
    category: 'الموسوعة الدينية',
    logo: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    currentProgram: 'بث مباشر من المسجد النبوي الشريف بالمدينة',
    quality: '1080p HD'
  },

  // 5. المصارعة والترفيه
  {
    id: 'wwe-action-tv',
    name: 'قناة المصارعة والترفيه WWE 24/7',
    category: 'المصارعة والترفيه',
    logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    currentProgram: 'عروض الرويال رامبل ومواجهات الحلبة الحصرية',
    isPopular: true,
    quality: '1080p HD'
  },

  // 6. الأطفال والأنمي
  {
    id: 'spacetoon-hd',
    name: 'قناة سبيستون HD',
    category: 'الأطفال والأنمي',
    logo: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    currentProgram: 'كوكب رياضة - مغامرات أنمي جديدة',
    isPopular: true,
    quality: '720p HD'
  }
];
