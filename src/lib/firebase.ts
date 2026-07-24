import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore,
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  writeBatch 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with auto long-polling detection to prevent gRPC/WebSocket streaming errors in container environments
const customDbId = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
  ? config.firestoreDatabaseId
  : undefined;

export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    }, customDbId);
  } catch (e) {
    return customDbId ? getFirestore(app, customDbId) : getFirestore(app);
  }
})();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Firestore Collections Constants
export const COLLECTIONS = {
  MEDIA_ITEMS: 'media_items',
  LIVE_CHANNELS: 'live_channels',
  CATEGORY_ITEMS: 'category_items',
  ANNOUNCEMENT: 'announcements',
  USERS: 'users'
} as const;

// Helper to seed initial media items if collection is empty
export async function seedFirestoreIfEmpty(initialMedia: any[], initialChannels: any[], initialCategories: any[], initialAnnouncement: any) {
  try {
    const mediaSnap = await getDocs(collection(db, COLLECTIONS.MEDIA_ITEMS));
    if (mediaSnap.empty && initialMedia.length > 0) {
      console.log('Seeding initial media items to Firestore...');
      const batch = writeBatch(db);
      initialMedia.forEach((item) => {
        const ref = doc(db, COLLECTIONS.MEDIA_ITEMS, String(item.id));
        batch.set(ref, item);
      });
      await batch.commit();
    }

    const channelSnap = await getDocs(collection(db, COLLECTIONS.LIVE_CHANNELS));
    if (channelSnap.empty && initialChannels.length > 0) {
      console.log('Seeding initial live channels to Firestore...');
      const batch = writeBatch(db);
      initialChannels.forEach((ch) => {
        const ref = doc(db, COLLECTIONS.LIVE_CHANNELS, String(ch.id));
        batch.set(ref, ch);
      });
      await batch.commit();
    }

    const catSnap = await getDocs(collection(db, COLLECTIONS.CATEGORY_ITEMS));
    if (catSnap.empty && initialCategories.length > 0) {
      console.log('Seeding initial categories to Firestore...');
      const batch = writeBatch(db);
      initialCategories.forEach((cat) => {
        const ref = doc(db, COLLECTIONS.CATEGORY_ITEMS, String(cat.id));
        batch.set(ref, cat);
      });
      await batch.commit();
    }

    const annRef = doc(db, COLLECTIONS.ANNOUNCEMENT, 'main');
    const annSnap = await getDoc(annRef);
    if (!annSnap.exists()) {
      await setDoc(annRef, initialAnnouncement);
    }

    // Seed Admin Users in Firestore
    const adminUserRef = doc(db, COLLECTIONS.USERS, 'admin_abdualhamid100');
    const adminSnap = await getDoc(adminUserRef);
    if (!adminSnap.exists()) {
      await setDoc(adminUserRef, {
        id: 'admin_abdualhamid100',
        uid: 'admin_abdualhamid100',
        email: 'abdualhamid100@gmail.com',
        displayName: 'المسؤول عبدالحميد',
        role: 'admin',
        subscriptionPlan: 'VIP سنوي',
        subscriptionStatus: 'نشط',
        subscriptionExpiry: '2030-12-31',
        createdAt: '2026-01-01',
        lastLogin: new Date().toISOString().split('T')[0]
      });
    }

  } catch (err) {
    console.warn('Firestore seeding skipped or error occurred:', err);
  }
}
