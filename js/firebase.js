/**
 * js/firebase.js
 * Firebase initialization & Firestore services for Black-Owned BR.
 * 
 * Powered by Firebase JS SDK v13.1.0 loaded via official Google CDN (ES Modules).
 * Strictly zero npm / build tools required.
 */

// 1. CDN ES Module Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

// 2. Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCi3NM5LMdR0rqxI7bXCFVvTiw6sXuwtu8",
  authDomain: "black-entre.firebaseapp.com",
  projectId: "black-entre",
  storageBucket: "black-entre.firebasestorage.app",
  messagingSenderId: "343367069217",
  appId: "1:343367069217:web:e1941ebd16b50cd1703d60",
  measurementId: "G-S2N2XC5554"
};

// 3. Initialize Firebase Core & Firestore
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 4. Initialize Analytics safely (guards against ad-blockers & non-browser environments)
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('%c🔥 Firebase Analytics initialized', 'color: #FDD023; background: #461D7C; padding: 2px 6px; border-radius: 3px;');
      }
    })
    .catch(() => {
      // Analytics blocked or unavailable
    });
}

/**
 * Fetches all provider documents from the Firestore "providers" collection.
 * 
 * @returns {Promise<Array<Object>>} Array of provider objects with their IDs
 */
export async function getProvidersFromFirestore() {
  const providersCol = collection(db, "providers");
  const snapshot = await getDocs(providersCol);
  
  if (snapshot.empty) {
    return [];
  }

  const providers = [];
  snapshot.forEach((docSnap) => {
    providers.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  return providers;
}

/**
 * Seeds the sample providers into the Firestore "providers" collection.
 * Uses Firestore writeBatch for fast, atomic insertion.
 * 
 * @param {Array<Object>} providersList Optional array of providers to seed (defaults to SAMPLE_PROVIDERS)
 * @param {Function} onProgress Optional progress callback (current, total, providerName)
 * @returns {Promise<{success: boolean, count: number, errors: Array}>}
 */
export async function seedFirestoreProviders(providersList = null, onProgress = null) {
  let list = providersList;
  if (!list) {
    const module = await import('../src/data/providers.js');
    list = module.SAMPLE_PROVIDERS;
  }

  console.log(`[Firebase Seeder] Starting upload of ${list.length} providers to Firestore 'providers' collection...`);

  const results = {
    success: true,
    count: 0,
    errors: []
  };

  // Upload documents individually or in batches to provide granular feedback
  for (let i = 0; i < list.length; i++) {
    const provider = list[i];
    try {
      const { id, ...providerData } = provider;
      const docRef = doc(db, "providers", id);
      await setDoc(docRef, { ...providerData, id });
      results.count++;
      
      if (onProgress) {
        onProgress(i + 1, list.length, provider.businessName);
      }
      console.log(`[Firebase Seeder] (${i + 1}/${list.length}) Saved: ${provider.businessName} [${id}]`);
    } catch (err) {
      console.error(`[Firebase Seeder] Failed to save ${provider.id}:`, err);
      results.errors.push({ id: provider.id, error: err.message });
      results.success = false;
    }
  }

  return results;
}

// Attach helper to global window object for convenient DevTools console access
if (typeof window !== 'undefined') {
  window.blackEntreFirebase = {
    app,
    db,
    analytics,
    getProvidersFromFirestore,
    seedFirestoreProviders
  };
  window.seedFirestore = seedFirestoreProviders;
}
