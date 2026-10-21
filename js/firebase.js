/**
 * js/firebase.js
 * Firebase initialization & Firestore/Storage services for Black-Owned BR.
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
  addDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-storage.js";

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

// 3. Initialize Firebase Core, Firestore, and Storage
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

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

// ============================================================================
// IMAGE COMPRESSION & FIREBASE STORAGE UPLOAD
// ============================================================================

/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * Validates maximum 5MB size constraint.
 * 
 * @param {File} file 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @param {number} quality 0.1 to 1.0
 * @returns {Promise<Blob>} Compressed image Blob
 */
export async function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
  const maxBytes = 5 * 1024 * 1024; // 5MB limit
  if (file.size > maxBytes) {
    throw new Error(`File "${file.name}" exceeds the 5MB maximum limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image for compression.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              // Convert to base64 data URL if toBlob is unavailable
              const dataUrl = canvas.toDataURL('image/jpeg', quality);
              resolve(dataUrl);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a compressed review photo to Firebase Storage.
 * Falls back to an optimized base64 data URL if Storage is not yet enabled in Firebase Console.
 * 
 * @param {File} file 
 * @param {string} providerId 
 * @param {number} index 
 * @returns {Promise<string>} Download URL or optimized base64 URL
 */
export async function uploadReviewPhoto(file, providerId, index = 0) {
  const compressed = await compressImage(file, 1200, 1200, 0.8);
  const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `reviews/${providerId}/${Date.now()}_${index}_${cleanName}`;

  try {
    const fileRef = storageRef(storage, path);
    if (compressed instanceof Blob) {
      await uploadBytes(fileRef, compressed, { contentType: 'image/jpeg' });
    } else {
      // It's a data URL string
      const response = await fetch(compressed);
      const blob = await response.blob();
      await uploadBytes(fileRef, blob, { contentType: 'image/jpeg' });
    }
    const downloadUrl = await getDownloadURL(fileRef);
    console.log(`[Firebase Storage] Photo uploaded: ${downloadUrl}`);
    return downloadUrl;
  } catch (storageError) {
    console.warn(`[Firebase Storage] Direct upload failed (${storageError.message}). Falling back to compressed base64 data URL.`);
    if (typeof compressed === 'string') {
      return compressed;
    }
    // Convert blob to base64 data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(compressed);
    });
  }
}

// ============================================================================
// REVIEWS MANAGEMENT (FIRESTORE SUBCOLLECTION & CALCULATIONS)
// ============================================================================

/**
 * Fetches all reviews for a specific provider from Firestore subcollection "providers/{providerId}/reviews".
 * 
 * @param {string} providerId 
 * @returns {Promise<Array<Object>>}
 */
export async function getReviewsForProvider(providerId) {
  try {
    const reviewsCol = collection(db, "providers", providerId, "reviews");
    const q = query(reviewsCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const reviews = [];
    snapshot.forEach((docSnap) => {
      reviews.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
    return reviews;
  } catch (error) {
    console.warn(`[Firestore Reviews] Could not query subcollection: ${error.message}`);
    // If ordered query fails due to missing index, attempt unordered query
    try {
      const reviewsCol = collection(db, "providers", providerId, "reviews");
      const snapshot = await getDocs(reviewsCol);
      const reviews = [];
      snapshot.forEach((docSnap) => {
        reviews.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      reviews.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return reviews;
    } catch (err2) {
      return [];
    }
  }
}

/**
 * Adds a new review to a provider's subcollection and recalculates averageRating & reviewCount.
 * 
 * @param {string} providerId 
 * @param {Object} reviewData 
 * @returns {Promise<{reviewId: string, updatedRating: number, updatedCount: number}>}
 */
export async function addReviewToProvider(providerId, reviewData) {
  const reviewsCol = collection(db, "providers", providerId, "reviews");

  const newReview = {
    ...reviewData,
    providerId,
    createdAt: new Date().toISOString()
  };

  const docRef = await addDoc(reviewsCol, newReview);
  console.log(`[Firestore Reviews] Added review ${docRef.id} for provider ${providerId}`);

  // Fetch all reviews to recalculate exact average
  const allReviews = await getReviewsForProvider(providerId);
  const updatedCount = allReviews.length;
  const ratingSum = allReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0);
  const updatedRating = updatedCount > 0 ? Number((ratingSum / updatedCount).toFixed(1)) : 5.0;

  // Update parent provider document in Firestore
  try {
    const providerDocRef = doc(db, "providers", providerId);
    await setDoc(providerDocRef, {
      averageRating: updatedRating,
      reviewCount: updatedCount
    }, { merge: true });
    console.log(`[Firestore Provider] Updated ${providerId} stats: ${updatedRating}★ (${updatedCount} reviews)`);
  } catch (updateErr) {
    console.warn(`[Firestore Provider] Could not update provider stats doc: ${updateErr.message}`);
  }

  return {
    reviewId: docRef.id,
    updatedRating,
    updatedCount
  };
}

/**
 * Deletes a review from a provider's subcollection and recalculates averageRating & reviewCount.
 * 
 * @param {string} providerId 
 * @param {string} reviewId 
 * @param {number} fallbackInitialRating 
 * @returns {Promise<{updatedRating: number, updatedCount: number}>}
 */
export async function deleteReviewFromProvider(providerId, reviewId, fallbackInitialRating = 5.0) {
  const reviewDocRef = doc(db, "providers", providerId, "reviews", reviewId);
  await deleteDoc(reviewDocRef);
  console.log(`[Firestore Reviews] Deleted review ${reviewId} from provider ${providerId}`);

  // Recalculate
  const remainingReviews = await getReviewsForProvider(providerId);
  const updatedCount = remainingReviews.length;
  let updatedRating = fallbackInitialRating;
  if (updatedCount > 0) {
    const ratingSum = remainingReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0);
    updatedRating = Number((ratingSum / updatedCount).toFixed(1));
  }

  try {
    const providerDocRef = doc(db, "providers", providerId);
    await setDoc(providerDocRef, {
      averageRating: updatedRating,
      reviewCount: updatedCount
    }, { merge: true });
  } catch (updateErr) {
    console.warn(`[Firestore Provider] Could not update provider stats after delete: ${updateErr.message}`);
  }

  return {
    updatedRating,
    updatedCount
  };
}

// Global window exposure for DevTools debugging
if (typeof window !== 'undefined') {
  window.blackEntreFirebase = {
    app,
    db,
    storage,
    analytics,
    getProvidersFromFirestore,
    seedFirestoreProviders,
    compressImage,
    uploadReviewPhoto,
    getReviewsForProvider,
    addReviewToProvider,
    deleteReviewFromProvider
  };
  window.seedFirestore = seedFirestoreProviders;
}
