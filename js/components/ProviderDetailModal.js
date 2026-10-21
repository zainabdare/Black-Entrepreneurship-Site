/**
 * js/components/ProviderDetailModal.js
 * 
 * Comprehensive Provider Detail View & Interactive Reviews Section.
 * 
 * Features:
 * - Provider Profile: Overview, portfolio images, pricing, experience, delivery, policies, booking & social links
 * - Overall Rating (1-5 stars) and review count
 * - Service-specific criteria ratings tailored by category:
 *     - Hair, Nails, Lashes: Longevity, Punctuality, Cleanliness
 *     - Food & Beverages: Taste, Portion, Punctuality
 *     - Fashion: Fit, Quality, Turnaround
 *     - Photography: Quality, Punctuality, Editing Turnaround
 * - Average criteria score breakdowns with visual progress bars
 * - "Leave a Review" form with star pickers, category criteria pickers, name, and comment
 * - Up to 4 photo uploads: client-side canvas compression (<5MB validation) and Firebase Storage upload
 * - Photo grid on reviews with click-to-expand full-size Lightbox
 * - Automatic update of provider's averageRating and reviewCount in Firestore & UI
 * - Basic Spam Protection: honeypot field, submission timing check, rate-limiting cooldown
 * - Admin Moderation Mode: Passkey-protected deletion of inappropriate reviews
 */

import {
  getReviewsForProvider,
  addReviewToProvider,
  deleteReviewFromProvider,
  uploadReviewPhoto,
  trackProfileView,
  trackLinkClick
} from '../firebase.js';

// ============================================================================
// 1. Category Criteria Definitions
// ============================================================================
export const CATEGORY_CRITERIA_MAP = {
  'Hair': [
    { key: 'longevity', label: 'Longevity / Durability', icon: '⏳' },
    { key: 'punctuality', label: 'Punctuality', icon: '⏰' },
    { key: 'cleanliness', label: 'Cleanliness & Comfort', icon: '✨' }
  ],
  'Nails': [
    { key: 'longevity', label: 'Longevity / Retention', icon: '⏳' },
    { key: 'punctuality', label: 'Punctuality', icon: '⏰' },
    { key: 'cleanliness', label: 'Cleanliness & Sanitization', icon: '✨' }
  ],
  'Lashes': [
    { key: 'longevity', label: 'Retention & Longevity', icon: '⏳' },
    { key: 'punctuality', label: 'Punctuality', icon: '⏰' },
    { key: 'cleanliness', label: 'Cleanliness & Eye Care', icon: '✨' }
  ],
  'Food & Beverages': [
    { key: 'taste', label: 'Taste & Flavor', icon: '😋' },
    { key: 'portion', label: 'Portion Size & Value', icon: '🍱' },
    { key: 'punctuality', label: 'Punctuality / Pickup Time', icon: '⏰' }
  ],
  'Fashion': [
    { key: 'fit', label: 'Fit & Tailoring', icon: '📏' },
    { key: 'quality', label: 'Fabric & Construction Quality', icon: '🪡' },
    { key: 'turnaround', label: 'Turnaround Time', icon: '⚡' }
  ],
  'Fashion (Custom Outfits)': [
    { key: 'fit', label: 'Fit & Tailoring', icon: '📏' },
    { key: 'quality', label: 'Fabric & Construction Quality', icon: '🪡' },
    { key: 'turnaround', label: 'Turnaround Time', icon: '⚡' }
  ],
  'Photography': [
    { key: 'quality', label: 'Photo Quality & Direction', icon: '📸' },
    { key: 'punctuality', label: 'Punctuality', icon: '⏰' },
    { key: 'editingTurnaround', label: 'Editing Turnaround', icon: '⚡' }
  ]
};

export function getCriteriaForCategory(category) {
  if (!category) return CATEGORY_CRITERIA_MAP['Hair'];
  if (category.includes('Fashion')) return CATEGORY_CRITERIA_MAP['Fashion'];
  if (category.includes('Food')) return CATEGORY_CRITERIA_MAP['Food & Beverages'];
  return CATEGORY_CRITERIA_MAP[category] || CATEGORY_CRITERIA_MAP['Hair'];
}

// Sample fallback reviews for instant display if Firestore collection is fresh
function getSampleReviewsForProvider(provider) {
  const criteriaList = getCriteriaForCategory(provider.category);
  const c1 = criteriaList[0]?.key || 'criterion1';
  const c2 = criteriaList[1]?.key || 'criterion2';
  const c3 = criteriaList[2]?.key || 'criterion3';

  return [
    {
      id: `sample-review-1-${provider.id}`,
      authorName: "Maya J. (LSU Senior)",
      rating: 5,
      criteria: { [c1]: 5, [c2]: 5, [c3]: 5 },
      comment: `Absolutely exceeded expectations! The attention to detail was unmatched, and booking through the site was seamless. Will definitely be a returning regular!`,
      photos: provider.portfolioImages && provider.portfolioImages.length > 0 
        ? [provider.portfolioImages[0]] 
        : [],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isSample: true
    },
    {
      id: `sample-review-2-${provider.id}`,
      authorName: "Jordan T. (Alumni '23)",
      rating: 5,
      criteria: { [c1]: 5, [c2]: 4, [c3]: 5 },
      comment: `Top-tier service in Baton Rouge. Friendly atmosphere and truly professional standards. LSU verified badge is well-deserved.`,
      photos: provider.portfolioImages && provider.portfolioImages.length > 1 
        ? [provider.portfolioImages[1]] 
        : [],
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      isSample: true
    }
  ];
}

// ============================================================================
// 2. Admin Moderation State
// ============================================================================
const ADMIN_PASSKEY = "lsu-admin-2026";
const ADMIN_STORAGE_KEY = "black_entre_admin_auth";

export function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_STORAGE_KEY) === "true";
}

export function setAdminAuthenticated(val) {
  if (val) {
    localStorage.setItem(ADMIN_STORAGE_KEY, "true");
  } else {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
}

// ============================================================================
// 3. Provider Detail Modal Injector
// ============================================================================
let activeModalProvider = null;
let activeModalReviews = [];
let modalOnStatsUpdatedCallback = null;

/**
 * Opens the full Provider Detail Modal and loads reviews.
 * 
 * @param {Object} provider 
 * @param {Function} onStatsUpdated Callback when reviews are added/deleted to update cards
 */
export async function openProviderDetailModal(provider, onStatsUpdated = null) {
  activeModalProvider = provider;
  modalOnStatsUpdatedCallback = onStatsUpdated;

  // Track profile view in Firestore analytics
  if (provider) {
    trackProfileView(provider.id, provider.businessName);
  }

  // Remove any existing modal
  closeProviderDetailModal();

  const criteria = getCriteriaForCategory(provider.category);

  const modalHtml = `
    <div id="provider-detail-modal" class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-opacity duration-300">
      
      <!-- Modal Card Container -->
      <div 
        id="provider-modal-content"
        class="relative w-full max-w-4xl bg-slate-900 border border-purple-900/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-provider-name"
      >
        <!-- Modal Sticky Top Bar -->
        <div class="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-purple-900/40 px-5 sm:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-lsu-purple/40 border border-lsu-gold/40 flex items-center justify-center font-heading font-black text-lsu-gold text-xs shadow">
              🐯
            </span>
            <div>
              <span class="text-xs uppercase font-heading font-bold text-lsu-gold tracking-wider block">
                ${provider.category} Directory Profile
              </span>
              <h2 id="modal-provider-name" class="text-base sm:text-xl font-heading font-extrabold text-white leading-tight">
                ${provider.businessName}
              </h2>
            </div>
          </div>

          <!-- Close Modal Button -->
          <button 
            id="close-provider-modal-btn"
            type="button"
            class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg class="w-5 h-5 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="overflow-y-auto flex-1 p-5 sm:p-8 space-y-8">
          
          <!-- 1. Provider Profile Header & Highlights -->
          <div class="space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-heading font-bold bg-lsu-purple/40 text-lsu-gold border border-lsu-gold/30">
                ${provider.category}
              </span>
              ${provider.lsuVerified ? `
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                  <span>🎓</span>
                  <span>LSU ${provider.lsuVerified === 'student' ? 'Student-Owned' : 'Alumni-Owned'}</span>
                </span>
              ` : ''}
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                ${provider.yearsExperience}+ Years Exp
              </span>
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                📍 ${provider.neighborhood || 'Baton Rouge'}
              </span>
            </div>

            <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
              ${provider.description}
            </p>

            <!-- Quick Info Strip -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <div>
                <span class="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Starting Price</span>
                <span class="font-bold text-white text-sm sm:text-base font-mono">
                  $${provider.startingPrice} <span class="text-lsu-gold text-xs">(${provider.priceTier})</span>
                </span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Service Delivery</span>
                <span class="font-bold text-white text-sm sm:text-base capitalize">
                  ${provider.serviceDelivery === 'both' ? 'Studio & Mobile' : provider.serviceDelivery}
                </span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Student Discount</span>
                <span class="font-bold text-emerald-400 text-sm sm:text-base">
                  ${provider.studentDiscount ? 'Yes (Valid ID)' : 'Standard Rates'}
                </span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Rating & Reviews</span>
                <span id="modal-header-rating" class="font-bold text-white text-sm sm:text-base flex items-center gap-1">
                  <span class="text-amber-400">★</span>
                  <span>${provider.averageRating.toFixed(1)}</span>
                  <span class="text-slate-400 text-xs font-normal">(${provider.reviewCount})</span>
                </span>
              </div>
            </div>

            <!-- Booking & Social Links CTA -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div class="flex items-center gap-2">
                ${provider.instagramUrl ? `
                  <a href="${provider.instagramUrl}" target="_blank" rel="noopener noreferrer" data-track-provider="${provider.id}" data-track-type="instagram" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-lsu-purple/40 border border-slate-700 hover:border-lsu-gold/40 text-xs font-semibold text-slate-200 hover:text-white transition-colors">
                    Instagram &rarr;
                  </a>
                ` : ''}
                ${provider.tiktokUrl ? `
                  <a href="${provider.tiktokUrl}" target="_blank" rel="noopener noreferrer" data-track-provider="${provider.id}" data-track-type="tiktok" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-lsu-purple/40 border border-slate-700 hover:border-lsu-gold/40 text-xs font-semibold text-slate-200 hover:text-white transition-colors">
                    TikTok &rarr;
                  </a>
                ` : ''}
                ${provider.websiteUrl ? `
                  <a href="${provider.websiteUrl}" target="_blank" rel="noopener noreferrer" data-track-provider="${provider.id}" data-track-type="website" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-lsu-purple/40 border border-slate-700 hover:border-lsu-gold/40 text-xs font-semibold text-slate-200 hover:text-white transition-colors">
                    Website &rarr;
                  </a>
                ` : ''}
              </div>

              <a 
                href="${provider.bookingUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                data-track-provider="${provider.id}"
                data-track-type="booking"
                class="px-5 py-2.5 rounded-xl bg-lsu-gold hover:bg-lsu-gold-hover text-lsu-purple-dark font-heading font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
              >
                <span>Book Appointment / Order</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>

          <!-- 2. Portfolio Gallery (if available) -->
          ${provider.portfolioImages && provider.portfolioImages.length > 0 ? `
            <div class="space-y-3 pt-4 border-t border-purple-900/30">
              <h3 class="text-xs font-heading font-bold text-slate-400 uppercase tracking-wider">
                Portfolio Showcase
              </h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                ${provider.portfolioImages.map((imgUrl, idx) => `
                  <div 
                    class="group relative h-28 sm:h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer shadow"
                    onclick="window.openPhotoLightbox('${imgUrl}', '${provider.businessName} Portfolio')"
                  >
                    <img src="${imgUrl}" alt="${provider.businessName} photo ${idx + 1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                    <div class="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                      🔍 Expand
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 3. REVIEWS & RATINGS SECTION -->
          <section id="reviews-section" class="pt-6 border-t border-purple-900/40 space-y-6">
            
            <!-- Section Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-2xl">⭐</span>
                  <h3 class="text-lg sm:text-2xl font-heading font-extrabold text-white">
                    Client Reviews &amp; Ratings
                  </h3>
                </div>
                <p class="text-xs text-slate-400 mt-1">
                  Verified feedback from LSU students and local Baton Rouge clients.
                </p>
              </div>

              <!-- Action buttons: Write Review & Admin Moderation Toggle -->
              <div class="flex items-center gap-2">
                <button 
                  id="toggle-write-review-btn"
                  type="button"
                  class="px-4 py-2 rounded-xl bg-lsu-gold hover:bg-lsu-gold-hover text-lsu-purple-dark font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <span>✍️</span>
                  <span>Write a Review</span>
                </button>

                <button 
                  id="admin-moderation-toggle-btn"
                  type="button"
                  class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="Toggle Admin Moderation Mode"
                >
                  <span id="admin-badge-icon">${isAdminAuthenticated() ? '👑 Admin Mode (ON)' : '🔒 Moderate'}</span>
                </button>
              </div>
            </div>

            <!-- Admin Status Banner (shown when Admin Mode is ON) -->
            <div id="admin-mode-banner" class="${isAdminAuthenticated() ? '' : 'hidden'} p-3 rounded-xl bg-purple-950/60 border border-purple-800/80 text-xs text-purple-200 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-amber-400 font-bold">👑 Admin Moderation Active:</span>
                <span>You can delete inappropriate reviews with instant average &amp; count recalculation.</span>
              </div>
              <button 
                id="exit-admin-btn" 
                type="button" 
                class="text-xs text-red-400 hover:text-red-300 underline font-semibold ml-2 cursor-pointer"
              >
                Log Out Admin
              </button>
            </div>

            <!-- Overall Breakdown Card -->
            <div id="reviews-summary-card" class="rounded-2xl bg-slate-950/70 border border-slate-800 p-5 sm:p-6 shadow-lg">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                <!-- Overall Score Box -->
                <div class="text-center md:border-r md:border-slate-800/80 md:pr-6 space-y-1">
                  <div id="summary-big-rating" class="text-4xl sm:text-5xl font-heading font-black text-lsu-gold">
                    ${provider.averageRating.toFixed(1)}
                  </div>
                  <div id="summary-stars" class="text-amber-400 text-lg sm:text-xl">
                    ★★★★★
                  </div>
                  <p id="summary-count-text" class="text-xs text-slate-400">
                    Based on <strong class="text-white">${provider.reviewCount}</strong> review${provider.reviewCount === 1 ? '' : 's'}
                  </p>
                </div>

                <!-- Category Criteria Breakdown Bars -->
                <div class="col-span-2 space-y-3">
                  <h4 class="text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                    ${provider.category} Service-Specific Criteria
                  </h4>
                  <div id="criteria-bars-container" class="space-y-2.5">
                    <!-- Criteria progress bars rendered dynamically -->
                  </div>
                </div>

              </div>
            </div>

            <!-- "LEAVE A REVIEW" FORM (Hidden by default, toggled via button) -->
            <div id="write-review-form-container" class="hidden rounded-2xl bg-slate-950/90 border border-lsu-gold/40 p-5 sm:p-7 space-y-5 shadow-2xl transition-all">
              <div class="flex items-center justify-between border-b border-purple-900/30 pb-3">
                <div>
                  <h4 class="font-heading font-bold text-base sm:text-lg text-white">
                    Leave a Review for <span class="text-lsu-gold">${provider.businessName}</span>
                  </h4>
                  <p class="text-xs text-slate-400 mt-0.5">
                    Share your experience to support Black-owned businesses in Baton Rouge.
                  </p>
                </div>
                <button 
                  id="cancel-write-review-btn" 
                  type="button" 
                  class="text-xs text-slate-400 hover:text-white font-semibold underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form id="provider-review-form" class="space-y-5" novalidate>
                
                <!-- Spam Protection: Hidden Honeypot Field -->
                <div class="hidden" aria-hidden="true">
                  <label for="review-bot-trap">Do not fill this field</label>
                  <input type="text" id="review-bot-trap" name="website_trap_input" tabindex="-1" autocomplete="off">
                </div>

                <!-- Form Open Timestamp (Bot submission timing check) -->
                <input type="hidden" id="review-form-timestamp" value="${Date.now()}">

                <!-- 1. Reviewer Name -->
                <div>
                  <label for="review-author-name" class="block text-xs font-heading font-semibold text-slate-200 mb-1.5">
                    Your Name or Handle <span class="text-lsu-gold">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="review-author-name" 
                    required 
                    placeholder="e.g. Maya J. or @mayaj_lsu" 
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-lsu-gold focus:ring-1 focus:ring-lsu-gold transition-colors"
                  >
                </div>

                <!-- 2. Overall Star Rating -->
                <div>
                  <label class="block text-xs font-heading font-semibold text-slate-200 mb-1.5">
                    Overall Rating <span class="text-lsu-gold">*</span>
                  </label>
                  <div class="flex items-center gap-2">
                    <div id="star-rating-picker" class="flex items-center gap-1.5 text-2xl text-slate-600 cursor-pointer">
                      <button type="button" class="star-btn hover:scale-110 transition-transform focus:outline-none" data-value="1" aria-label="1 star">★</button>
                      <button type="button" class="star-btn hover:scale-110 transition-transform focus:outline-none" data-value="2" aria-label="2 stars">★</button>
                      <button type="button" class="star-btn hover:scale-110 transition-transform focus:outline-none" data-value="3" aria-label="3 stars">★</button>
                      <button type="button" class="star-btn hover:scale-110 transition-transform focus:outline-none" data-value="4" aria-label="4 stars">★</button>
                      <button type="button" class="star-btn hover:scale-110 transition-transform focus:outline-none" data-value="5" aria-label="5 stars">★</button>
                    </div>
                    <span id="star-rating-label" class="text-xs font-semibold text-amber-400 font-mono ml-2">
                      5 - Excellent
                    </span>
                  </div>
                  <input type="hidden" id="review-overall-rating" value="5">
                </div>

                <!-- 3. Category-Specific Criteria Ratings -->
                <div class="space-y-3 pt-2 border-t border-slate-800">
                  <div class="flex items-center justify-between">
                    <label class="text-xs font-heading font-semibold text-slate-200">
                      Rate Specific Criteria (${provider.category}) <span class="text-lsu-gold">*</span>
                    </label>
                    <span class="text-[10px] text-slate-400">Scale of 1 (Lowest) to 5 (Highest)</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    ${criteria.map(crit => `
                      <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                        <div class="flex items-center justify-between text-xs">
                          <span class="font-medium text-slate-200 flex items-center gap-1">
                            <span>${crit.icon}</span>
                            <span>${crit.label}</span>
                          </span>
                          <span id="criteria-label-${crit.key}" class="font-bold text-lsu-gold font-mono">5/5</span>
                        </div>
                        <div class="flex items-center justify-between text-lg text-slate-600 criteria-picker" data-criteria-key="${crit.key}">
                          ${[1, 2, 3, 4, 5].map(v => `
                            <button type="button" class="criteria-star-btn hover:scale-110 transition-transform focus:outline-none text-amber-400" data-value="${v}" aria-label="${v} stars for ${crit.label}">★</button>
                          `).join('')}
                        </div>
                        <input type="hidden" class="criteria-input" id="criteria-input-${crit.key}" data-key="${crit.key}" value="5">
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- 4. Written Comment -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label for="review-comment" class="block text-xs font-heading font-semibold text-slate-200">
                      Your Written Review <span class="text-lsu-gold">*</span>
                    </label>
                    <span id="comment-char-count" class="text-[11px] text-slate-500 font-mono">0 / 600</span>
                  </div>
                  <textarea 
                    id="review-comment" 
                    required 
                    rows="3" 
                    maxlength="600"
                    placeholder="How was your experience? Mention your service, turnaround, atmosphere, or communication..." 
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-lsu-gold focus:ring-1 focus:ring-lsu-gold transition-colors leading-relaxed"
                  ></textarea>
                </div>

                <!-- 5. Photo Upload to Firebase Storage (Up to 4 Photos) -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label class="block text-xs font-heading font-semibold text-slate-200">
                      Upload Photos <span class="text-slate-400 font-normal">(Optional, up to 4 photos &bull; Max 5MB each)</span>
                    </label>
                    <span id="photo-count-badge" class="text-[10px] text-lsu-gold font-mono">0/4 photos</span>
                  </div>

                  <!-- Upload Drop Area -->
                  <div 
                    id="photo-drop-zone"
                    class="border-2 border-dashed border-slate-700/80 hover:border-lsu-gold/60 rounded-xl p-4 text-center bg-slate-900/50 hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    <input 
                      type="file" 
                      id="review-photo-input" 
                      accept="image/jpeg,image/png,image/webp,image/heic" 
                      multiple 
                      class="hidden"
                    >
                    <div class="space-y-1">
                      <span class="text-2xl block">📸</span>
                      <p class="text-xs text-slate-300 font-medium">
                        Click or drag &amp; drop photos here
                      </p>
                      <p class="text-[11px] text-slate-500">
                        Images are automatically compressed before uploading to Firebase Storage.
                      </p>
                    </div>
                  </div>

                  <!-- Photo Thumbnail Previews -->
                  <div id="photo-preview-grid" class="grid grid-cols-4 gap-2 pt-2 empty:hidden">
                    <!-- Preview thumbs inserted dynamically -->
                  </div>
                </div>

                <!-- Form Alert / Error Box -->
                <div id="review-form-error" class="hidden p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
                  <!-- Error message -->
                </div>

                <!-- Form Submit Action -->
                <div class="flex items-center justify-end gap-3 pt-2">
                  <button 
                    id="submit-review-btn" 
                    type="submit" 
                    class="px-6 py-2.5 rounded-xl bg-lsu-gold hover:bg-lsu-gold-hover text-lsu-purple-dark font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>Submit Review</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- 4. REVIEWS LIST -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-heading font-bold text-slate-300 uppercase tracking-wider">
                  Community Reviews
                </h4>
                <span id="reviews-list-count" class="text-xs text-slate-400">Loading reviews...</span>
              </div>

              <!-- Reviews Container -->
              <div id="reviews-list-container" class="space-y-4">
                <!-- Individual review cards rendered dynamically -->
              </div>
            </div>

          </section>

        </div>

      </div>

    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.classList.add('overflow-hidden');

  // Attach event handlers
  initModalInteractions(provider);

  // Fetch reviews from Firestore
  await loadAndRenderReviews(provider);
}

/**
 * Closes the Provider Detail Modal.
 */
export function closeProviderDetailModal() {
  const modal = document.getElementById('provider-detail-modal');
  if (modal) {
    modal.remove();
    document.body.classList.remove('overflow-hidden');
  }
}

// ============================================================================
// 4. Modal Interactions & Form Wiring
// ============================================================================
function initModalInteractions(provider) {
  const modal = document.getElementById('provider-detail-modal');
  const closeBtn = document.getElementById('close-provider-modal-btn');
  const toggleWriteBtn = document.getElementById('toggle-write-review-btn');
  const cancelWriteBtn = document.getElementById('cancel-write-review-btn');
  const writeContainer = document.getElementById('write-review-form-container');
  const reviewForm = document.getElementById('provider-review-form');
  const commentInput = document.getElementById('review-comment');
  const commentCount = document.getElementById('comment-char-count');
  const photoDropZone = document.getElementById('photo-drop-zone');
  const photoInput = document.getElementById('review-photo-input');
  const adminToggleBtn = document.getElementById('admin-moderation-toggle-btn');
  const exitAdminBtn = document.getElementById('exit-admin-btn');

  // Close handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', closeProviderDetailModal);
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProviderDetailModal();
    });
  }

  // Toggle "Write a Review" form
  if (toggleWriteBtn && writeContainer) {
    toggleWriteBtn.addEventListener('click', () => {
      writeContainer.classList.toggle('hidden');
      if (!writeContainer.classList.contains('hidden')) {
        writeContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
  if (cancelWriteBtn && writeContainer) {
    cancelWriteBtn.addEventListener('click', () => {
      writeContainer.classList.add('hidden');
    });
  }

  // Comment character count
  if (commentInput && commentCount) {
    commentInput.addEventListener('input', () => {
      commentCount.textContent = `${commentInput.value.length} / 600`;
    });
  }

  // Overall Star Picker
  const starBtns = document.querySelectorAll('#star-rating-picker .star-btn');
  const overallRatingInput = document.getElementById('review-overall-rating');
  const overallRatingLabel = document.getElementById('star-rating-label');

  const starLabels = {
    1: '1 - Poor',
    2: '2 - Fair',
    3: '3 - Good',
    4: '4 - Very Good',
    5: '5 - Excellent'
  };

  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.value, 10);
      overallRatingInput.value = val;
      overallRatingLabel.textContent = starLabels[val] || `${val} Stars`;

      starBtns.forEach(b => {
        const bVal = parseInt(b.dataset.value, 10);
        if (bVal <= val) {
          b.classList.remove('text-slate-600');
          b.classList.add('text-amber-400');
        } else {
          b.classList.remove('text-amber-400');
          b.classList.add('text-slate-600');
        }
      });
    });
  });
  // Trigger initial 5-star state
  starBtns.forEach(b => {
    b.classList.remove('text-slate-600');
    b.classList.add('text-amber-400');
  });

  // Criteria Star Pickers
  document.querySelectorAll('.criteria-picker').forEach(picker => {
    const key = picker.dataset.criteriaKey;
    const input = document.getElementById(`criteria-input-${key}`);
    const label = document.getElementById(`criteria-label-${key}`);
    const btns = picker.querySelectorAll('.criteria-star-btn');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.value, 10);
        if (input) input.value = val;
        if (label) label.textContent = `${val}/5`;

        btns.forEach(b => {
          const bVal = parseInt(b.dataset.value, 10);
          if (bVal <= val) {
            b.classList.remove('text-slate-600');
            b.classList.add('text-amber-400');
          } else {
            b.classList.remove('text-amber-400');
            b.classList.add('text-slate-600');
          }
        });
      });
    });
  });

  // Photo Selection & Previews
  let selectedFiles = [];
  const previewGrid = document.getElementById('photo-preview-grid');
  const countBadge = document.getElementById('photo-count-badge');

  function updatePhotoPreviews() {
    if (!previewGrid) return;
    previewGrid.innerHTML = '';
    countBadge.textContent = `${selectedFiles.length}/4 photos`;

    selectedFiles.forEach((file, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'relative h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow';
      
      const img = document.createElement('img');
      img.className = 'w-full h-full object-cover';
      img.src = URL.createObjectURL(file);
      thumb.appendChild(img);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-950/80 text-red-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer';
      removeBtn.innerHTML = '&times;';
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedFiles.splice(index, 1);
        updatePhotoPreviews();
      });
      thumb.appendChild(removeBtn);

      previewGrid.appendChild(thumb);
    });
  }

  if (photoDropZone && photoInput) {
    photoDropZone.addEventListener('click', () => photoInput.click());

    photoDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      photoDropZone.classList.add('border-lsu-gold', 'bg-slate-900');
    });

    photoDropZone.addEventListener('dragleave', () => {
      photoDropZone.classList.remove('border-lsu-gold', 'bg-slate-900');
    });

    photoDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      photoDropZone.classList.remove('border-lsu-gold', 'bg-slate-900');
      if (e.dataTransfer.files) {
        handleIncomingFiles(e.dataTransfer.files);
      }
    });

    photoInput.addEventListener('change', () => {
      if (photoInput.files) {
        handleIncomingFiles(photoInput.files);
        photoInput.value = ''; // Reset input
      }
    });
  }

  function handleIncomingFiles(fileList) {
    const errorBox = document.getElementById('review-form-error');
    if (errorBox) errorBox.classList.add('hidden');

    for (const file of Array.from(fileList)) {
      if (selectedFiles.length >= 4) {
        showFormError('You can upload a maximum of 4 photos per review.');
        break;
      }

      // Check max 5MB before compression
      if (file.size > 5 * 1024 * 1024) {
        showFormError(`"${file.name}" exceeds the 5MB maximum file limit.`);
        continue;
      }

      if (!file.type.startsWith('image/')) {
        showFormError(`"${file.name}" is not an image file.`);
        continue;
      }

      selectedFiles.push(file);
    }
    updatePhotoPreviews();
  }

  function showFormError(msg) {
    const errorBox = document.getElementById('review-form-error');
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.classList.remove('hidden');
    }
  }

  // Admin Moderation Toggle
  if (adminToggleBtn) {
    adminToggleBtn.addEventListener('click', () => {
      if (isAdminAuthenticated()) {
        setAdminAuthenticated(false);
        refreshAdminUi(false);
      } else {
        const pass = prompt('Enter Admin Passkey to enable review moderation (Default: lsu-admin-2026):');
        if (pass === ADMIN_PASSKEY) {
          setAdminAuthenticated(true);
          refreshAdminUi(true);
        } else if (pass !== null) {
          alert('Incorrect passkey.');
        }
      }
    });
  }

  if (exitAdminBtn) {
    exitAdminBtn.addEventListener('click', () => {
      setAdminAuthenticated(false);
      refreshAdminUi(false);
    });
  }

  function refreshAdminUi(isAdmin) {
    const banner = document.getElementById('admin-mode-banner');
    const badge = document.getElementById('admin-badge-icon');
    if (banner) {
      if (isAdmin) banner.classList.remove('hidden');
      else banner.classList.add('hidden');
    }
    if (badge) {
      badge.textContent = isAdmin ? '👑 Admin Mode (ON)' : '🔒 Moderate';
    }
    // Re-render review cards to toggle delete buttons
    renderReviewCards(activeModalReviews, provider);
  }

  // --------------------------------------------------------------------------
  // Form Submission with Spam Protection & Image Upload
  // --------------------------------------------------------------------------
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const authorName = document.getElementById('review-author-name').value.trim();
      const comment = document.getElementById('review-comment').value.trim();
      const rating = parseInt(document.getElementById('review-overall-rating').value, 10);
      const submitBtn = document.getElementById('submit-review-btn');
      const honeypot = document.getElementById('review-bot-trap').value;
      const formTime = parseInt(document.getElementById('review-form-timestamp').value, 10);

      // SPAM PROTECTION 1: Honeypot trap check
      if (honeypot) {
        console.warn('[Spam Protection] Bot detected via honeypot field.');
        showFormError('Submission failed verification.');
        return;
      }

      // SPAM PROTECTION 2: Form submission timing check (bots submit in < 2 seconds)
      const elapsedSec = (Date.now() - formTime) / 1000;
      if (elapsedSec < 2) {
        console.warn('[Spam Protection] Submission too fast (under 2 seconds).');
        showFormError('Please take a moment to review before submitting.');
        return;
      }

      // SPAM PROTECTION 3: Rate limiting cooldown (max 1 review per 45s per browser)
      const lastReviewTime = localStorage.getItem('last_review_submit_time');
      if (lastReviewTime && (Date.now() - parseInt(lastReviewTime, 10)) < 45000) {
        showFormError('Please wait 45 seconds before submitting another review.');
        return;
      }

      // Basic validations
      if (!authorName) {
        showFormError('Please enter your name or handle.');
        return;
      }
      if (!comment || comment.length < 10) {
        showFormError('Please write at least 10 characters in your review comment.');
        return;
      }

      // Collect criteria ratings
      const criteriaValues = {};
      document.querySelectorAll('.criteria-input').forEach(inp => {
        criteriaValues[inp.dataset.key] = parseInt(inp.value, 10) || 5;
      });

      // Upload photos (compressed)
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳ Uploading photos &amp; saving...</span>`;

      try {
        const uploadedPhotoUrls = [];
        for (let i = 0; i < selectedFiles.length; i++) {
          submitBtn.innerHTML = `<span>⏳ Uploading photo ${i + 1}/${selectedFiles.length}...</span>`;
          const url = await uploadReviewPhoto(selectedFiles[i], provider.id, i);
          uploadedPhotoUrls.push(url);
        }

        submitBtn.innerHTML = `<span>⏳ Publishing review to Firestore...</span>`;

        const reviewPayload = {
          authorName,
          rating,
          criteria: criteriaValues,
          comment,
          photos: uploadedPhotoUrls,
          createdAt: new Date().toISOString()
        };

        const result = await addReviewToProvider(provider.id, reviewPayload);

        // Update local provider stats
        provider.averageRating = result.updatedRating;
        provider.reviewCount = result.updatedCount;

        // Record cooldown
        localStorage.setItem('last_review_submit_time', Date.now().toString());

        // Update parent directory cards if callback provided
        if (modalOnStatsUpdatedCallback) {
          modalOnStatsUpdatedCallback(provider.id, result.updatedRating, result.updatedCount);
        }

        // Reset form & close
        reviewForm.reset();
        selectedFiles = [];
        updatePhotoPreviews();
        writeContainer.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Submit Review</span><span>&rarr;</span>`;

        // Refresh reviews display
        await loadAndRenderReviews(provider);

      } catch (err) {
        console.error('Failed to submit review:', err);
        showFormError(`Could not submit review: ${err.message}`);
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Submit Review</span><span>&rarr;</span>`;
      }
    });
  }
}

// ============================================================================
// 5. Load & Render Reviews
// ============================================================================
async function loadAndRenderReviews(provider) {
  const container = document.getElementById('reviews-list-container');
  const countDisplay = document.getElementById('reviews-list-count');
  if (!container) return;

  container.innerHTML = `
    <div class="py-8 text-center text-slate-400 animate-pulse text-xs">
      Loading verified reviews from Cloud Firestore...
    </div>
  `;

  let reviews = [];
  try {
    reviews = await getReviewsForProvider(provider.id);
  } catch (err) {
    console.warn('Could not load Firestore reviews:', err);
  }

  // If no reviews yet in Firestore, serve realistic sample reviews for demonstration
  if (!reviews || reviews.length === 0) {
    reviews = getSampleReviewsForProvider(provider);
  }

  activeModalReviews = reviews;

  // Update Summary Stats & Criteria Progress Bars
  renderSummaryStats(provider, reviews);

  // Render Individual Review Cards
  renderReviewCards(reviews, provider);

  if (countDisplay) {
    countDisplay.textContent = `Showing ${reviews.length} review${reviews.length === 1 ? '' : 's'}`;
  }
}

function renderSummaryStats(provider, reviews) {
  const bigRating = document.getElementById('summary-big-rating');
  const starsEl = document.getElementById('summary-stars');
  const countText = document.getElementById('summary-count-text');
  const headerRating = document.getElementById('modal-header-rating');
  const barsContainer = document.getElementById('criteria-bars-container');

  const totalReviews = reviews.length;
  const avgOverall = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / totalReviews)
    : provider.averageRating;

  if (bigRating) bigRating.textContent = avgOverall.toFixed(1);
  if (starsEl) starsEl.textContent = '★'.repeat(Math.round(avgOverall)) + '☆'.repeat(5 - Math.round(avgOverall));
  if (countText) {
    countText.innerHTML = `Based on <strong class="text-white">${totalReviews}</strong> review${totalReviews === 1 ? '' : 's'}`;
  }
  if (headerRating) {
    headerRating.innerHTML = `<span class="text-amber-400">★</span> <span>${avgOverall.toFixed(1)}</span> <span class="text-slate-400 text-xs font-normal">(${totalReviews})</span>`;
  }

  // Compute criteria breakdown averages
  const criteriaList = getCriteriaForCategory(provider.category);
  if (barsContainer) {
    barsContainer.innerHTML = criteriaList.map(crit => {
      let sum = 0;
      let count = 0;
      reviews.forEach(r => {
        if (r.criteria && r.criteria[crit.key] !== undefined) {
          sum += Number(r.criteria[crit.key]);
          count++;
        }
      });
      const avg = count > 0 ? (sum / count) : 5.0;
      const pct = Math.round((avg / 5) * 100);

      return `
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-300 font-medium flex items-center gap-1.5">
              <span>${crit.icon}</span>
              <span>${crit.label}</span>
            </span>
            <span class="font-mono font-bold text-lsu-gold">${avg.toFixed(1)} / 5</span>
          </div>
          <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
            <div class="h-full bg-gradient-to-r from-lsu-purple to-lsu-gold rounded-full transition-all duration-500" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function renderReviewCards(reviews, provider) {
  const container = document.getElementById('reviews-list-container');
  if (!container) return;

  if (reviews.length === 0) {
    container.innerHTML = `
      <div class="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
        <span class="text-3xl block">💬</span>
        <h5 class="text-sm font-heading font-bold text-white">No reviews yet</h5>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">
          Be the first to leave a review for ${provider.businessName}!
        </p>
      </div>
    `;
    return;
  }

  const isAdmin = isAdminAuthenticated();
  const criteriaList = getCriteriaForCategory(provider.category);

  container.innerHTML = reviews.map(rev => {
    const starStr = '★'.repeat(rev.rating || 5) + '☆'.repeat(5 - (rev.rating || 5));
    const dateFormatted = rev.createdAt 
      ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Recent';

    return `
      <article class="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-3 shadow-md hover:border-purple-900/50 transition-colors">
        
        <!-- Reviewer Info & Star Rating Strip -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-lsu-purple to-slate-800 border border-lsu-gold/40 flex items-center justify-center font-heading font-bold text-xs text-lsu-gold shadow">
              ${(rev.authorName || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h5 class="text-xs sm:text-sm font-heading font-bold text-white leading-tight">
                ${rev.authorName}
              </h5>
              <span class="text-[11px] text-slate-500">
                ${dateFormatted}
              </span>
            </div>
          </div>

          <div class="text-right">
            <div class="text-amber-400 text-sm leading-none font-bold" title="${rev.rating} out of 5 stars">
              ${starStr}
            </div>
          </div>
        </div>

        <!-- Category Criteria Badges Strip -->
        ${rev.criteria ? `
          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            ${criteriaList.map(crit => {
              const val = rev.criteria[crit.key];
              if (val === undefined) return '';
              return `
                <span class="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/80 text-slate-300">
                  <span>${crit.icon}</span>
                  <span>${crit.label.split('/')[0].trim()}:</span>
                  <span class="text-lsu-gold">${val}/5</span>
                </span>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- Written Review Comment -->
        <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">
          ${rev.comment}
        </p>

        <!-- Attached Photo Grid (Opens Full-Size Lightbox) -->
        ${rev.photos && rev.photos.length > 0 ? `
          <div class="pt-2">
            <span class="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block mb-1.5">
              Attached Photos (${rev.photos.length})
            </span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              ${rev.photos.map((photoUrl, pIdx) => `
                <div 
                  class="group relative h-20 sm:h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer shadow hover:border-lsu-gold/60 transition-colors"
                  onclick="window.openPhotoLightbox('${photoUrl}', 'Review photo by ${rev.authorName}')"
                >
                  <img src="${photoUrl}" alt="Review photo ${pIdx + 1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                  <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold">
                    🔍 View
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Admin Delete Button (Only visible when Admin Mode is ON) -->
        ${isAdmin ? `
          <div class="pt-2 border-t border-slate-800/60 flex justify-end">
            <button 
              type="button" 
              class="admin-delete-review-btn px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white border border-red-800 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              data-review-id="${rev.id}"
              data-is-sample="${rev.isSample ? 'true' : 'false'}"
            >
              <span>🗑️</span>
              <span>Delete Inappropriate Review</span>
            </button>
          </div>
        ` : ''}

      </article>
    `;
  }).join('');

  // Attach delete handlers for admin
  if (isAdmin) {
    container.querySelectorAll('.admin-delete-review-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const reviewId = btn.dataset.reviewId;
        const isSample = btn.dataset.isSample === 'true';

        if (!confirm('Are you sure you want to delete this review? The provider rating and review count will be updated.')) {
          return;
        }

        btn.disabled = true;
        btn.textContent = 'Deleting...';

        try {
          if (!isSample) {
            const stats = await deleteReviewFromProvider(provider.id, reviewId, provider.averageRating);
            provider.averageRating = stats.updatedRating;
            provider.reviewCount = stats.updatedCount;
          } else {
            // Remove from local list if sample
            activeModalReviews = activeModalReviews.filter(r => r.id !== reviewId);
            const total = activeModalReviews.length;
            const avg = total > 0 
              ? Number((activeModalReviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1))
              : 5.0;
            provider.averageRating = avg;
            provider.reviewCount = total;
          }

          if (modalOnStatsUpdatedCallback) {
            modalOnStatsUpdatedCallback(provider.id, provider.averageRating, provider.reviewCount);
          }

          // Reload reviews
          await loadAndRenderReviews(provider);

        } catch (err) {
          alert(`Failed to delete review: ${err.message}`);
          btn.disabled = false;
          btn.textContent = 'Delete Inappropriate Review';
        }
      });
    });
  }
}

// ============================================================================
// 6. Photo Lightbox Modal (Click-to-Expand Full Size)
// ============================================================================
export function openPhotoLightbox(photoUrl, caption = '') {
  closePhotoLightbox();

  const lightboxHtml = `
    <div id="photo-lightbox-modal" class="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 transition-opacity duration-300">
      
      <!-- Close Button -->
      <button 
        id="close-lightbox-btn" 
        type="button" 
        class="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-lsu-gold flex items-center justify-center text-xl font-bold transition-colors cursor-pointer z-10"
        aria-label="Close photo preview"
      >
        &times;
      </button>

      <!-- Lightbox Image Wrapper -->
      <div class="relative max-w-4xl max-h-[82vh] flex flex-col items-center">
        <img 
          src="${photoUrl}" 
          alt="${caption}" 
          class="max-w-full max-h-[75vh] object-contain rounded-2xl border border-purple-900/40 shadow-2xl"
        >
        ${caption ? `
          <p class="mt-3 text-xs sm:text-sm text-slate-300 font-medium text-center bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800">
            ${caption}
          </p>
        ` : ''}
      </div>

    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', lightboxHtml);

  const lightbox = document.getElementById('photo-lightbox-modal');
  const closeBtn = document.getElementById('close-lightbox-btn');

  if (closeBtn) closeBtn.addEventListener('click', closePhotoLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.id === 'close-lightbox-btn') {
        closePhotoLightbox();
      }
    });
  }

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closePhotoLightbox();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

export function closePhotoLightbox() {
  const existing = document.getElementById('photo-lightbox-modal');
  if (existing) existing.remove();
}

// Global exposure for inline onclick handlers in generated HTML
if (typeof window !== 'undefined') {
  window.openPhotoLightbox = openPhotoLightbox;
  window.closePhotoLightbox = closePhotoLightbox;
  window.openProviderDetailModal = openProviderDetailModal;
  window.closeProviderDetailModal = closeProviderDetailModal;
}
