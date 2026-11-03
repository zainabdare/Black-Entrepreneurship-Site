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
  getRatingsForProvider,
  submitRatingToFirestore,
  trackProfileView,
  trackLinkClick
} from '../firebase.js';
import { getPriceTier, getDistanceFromLSU } from '../utils/distance.js';
import { getCategoryDefaultImageHtml } from './ProviderCard.js';

// ============================================================================
// 1. Category Criteria Definitions
// ============================================================================
export const CATEGORY_CRITERIA_MAP = {
  'Hair': [
    { key: 'longevity', label: 'Longevity' },
    { key: 'punctuality', label: 'Punctuality' },
    { key: 'cleanliness', label: 'Cleanliness' }
  ],
  'Nails': [
    { key: 'longevity', label: 'Longevity' },
    { key: 'punctuality', label: 'Punctuality' },
    { key: 'cleanliness', label: 'Cleanliness' }
  ],
  'Lashes': [
    { key: 'longevity', label: 'Longevity' },
    { key: 'punctuality', label: 'Punctuality' },
    { key: 'cleanliness', label: 'Cleanliness' }
  ],
  'Food & Beverages': [
    { key: 'taste', label: 'Taste & Flavor' },
    { key: 'portion', label: 'Portion Size & Value' },
    { key: 'punctuality', label: 'Punctuality / Pickup Time' }
  ],
  'Fashion': [
    { key: 'fit', label: 'Fit' },
    { key: 'quality', label: 'Quality' },
    { key: 'turnaround', label: 'Turnaround' }
  ],
  'Fashion (Custom Outfits)': [
    { key: 'fit', label: 'Fit' },
    { key: 'quality', label: 'Quality' },
    { key: 'turnaround', label: 'Turnaround' }
  ],
  'Photography': [
    { key: 'quality', label: 'Quality' },
    { key: 'punctuality', label: 'Punctuality' },
    { key: 'editingTurnaround', label: 'Editing Turnaround' }
  ]
};

export function getStarsSvg(rating, max = 5, onDark = true) {
  const rounded = Math.round(Number(rating) || 0);
  const activeColor = 'text-[#A3456A]';
  const inactiveColor = onDark ? 'text-[#612731]' : 'text-[#D3BAA2]';
  let html = '<span class="inline-flex items-center gap-0.5">';
  for (let i = 1; i <= max; i++) {
    if (i <= rounded) {
      html += `<svg class="w-4 h-4 ${activeColor} fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    } else {
      html += `<svg class="w-4 h-4 ${inactiveColor} fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    }
  }
  html += '</span>';
  return html;
}

export function getCriteriaForCategory(category) {
  if (!category) return CATEGORY_CRITERIA_MAP['Hair'];
  if (category.includes('Fashion')) return CATEGORY_CRITERIA_MAP['Fashion'];
  if (category.includes('Food')) return CATEGORY_CRITERIA_MAP['Food & Beverages'];
  if (category.includes('Nail')) return CATEGORY_CRITERIA_MAP['Nails'];
  if (category.includes('Lash')) return CATEGORY_CRITERIA_MAP['Lashes'];
  if (category.includes('Photo')) return CATEGORY_CRITERIA_MAP['Photography'];
  return CATEGORY_CRITERIA_MAP[category] || CATEGORY_CRITERIA_MAP['Hair'];
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

  const hasImage = Boolean(
    provider.portfolioImages &&
    Array.isArray(provider.portfolioImages) &&
    provider.portfolioImages.length > 0 &&
    typeof provider.portfolioImages[0] === 'string' &&
    provider.portfolioImages[0].trim() !== ''
  );

  // Track profile view in Firestore analytics
  if (provider) {
    trackProfileView(provider.id, provider.businessName);
  }

  // Remove any existing modal
  closeProviderDetailModal();

  const criteria = getCriteriaForCategory(provider.category);

  // Collect all available booking / contact links for this provider
  const availableLinks = [];

  const bookingOrWebsiteUrl = (provider.bookingUrl && provider.bookingUrl !== 'Not provided')
    ? provider.bookingUrl
    : ((provider.websiteUrl && provider.websiteUrl !== 'Not provided') ? provider.websiteUrl : null);

  const hasDirectBooking = (provider.bookingUrl && provider.bookingUrl !== 'Not provided');

  if (bookingOrWebsiteUrl) {
    availableLinks.push({
      type: hasDirectBooking ? 'booking' : 'website',
      label: hasDirectBooking ? 'Website / Booking' : 'Website',
      url: bookingOrWebsiteUrl,
      icon: `<svg class="w-4 h-4 stroke-current stroke-2 shrink-0" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`
    });
  }

  if (provider.instagramUrl && provider.instagramUrl !== 'Not provided') {
    availableLinks.push({
      type: 'instagram',
      label: 'Instagram',
      url: provider.instagramUrl,
      icon: `<svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
    });
  }

  if (provider.tiktokUrl && provider.tiktokUrl !== 'Not provided') {
    availableLinks.push({
      type: 'tiktok',
      label: 'TikTok',
      url: provider.tiktokUrl,
      icon: `<svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>`
    });
  }

  let bookActionHtml = '';
  if (availableLinks.length === 1) {
    // Only one link: opens directly in a new tab
    bookActionHtml = `
      <div class="pt-2">
        <a 
          href="${availableLinks[0].url}" 
          target="_blank" 
          rel="noopener noreferrer" 
          data-track-provider="${provider.id}" 
          data-track-type="${availableLinks[0].type}" 
          class="px-8 py-3 rounded-full bg-[#4A1C24] hover:bg-[#351218] text-[#F6EEE6] font-heading font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer"
        >
          <span>BOOK</span>
          <span class="text-sm">&rarr;</span>
        </a>
      </div>
    `;
  } else if (availableLinks.length > 1) {
    // Multiple links: expands to show available options
    bookActionHtml = `
      <div class="pt-2" id="book-button-wrapper">
        <button 
          id="book-main-btn"
          type="button"
          class="px-8 py-3 rounded-full bg-[#4A1C24] hover:bg-[#351218] text-[#F6EEE6] font-heading font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer"
          aria-expanded="false"
          aria-controls="book-options-dropdown"
        >
          <span>BOOK</span>
          <svg id="book-chevron" class="w-4 h-4 stroke-current stroke-2 transition-transform duration-200" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- Expanded Booking Options Dropdown -->
        <div 
          id="book-options-dropdown" 
          class="hidden mt-3 flex flex-wrap gap-2.5 p-3 rounded-2xl bg-[#EAD5C0]/40 border border-[#D3BAA2] shadow-sm transition-all"
        >
          ${availableLinks.map(link => `
            <a 
              href="${link.url}" 
              target="_blank" 
              rel="noopener noreferrer" 
              data-track-provider="${provider.id}" 
              data-track-type="${link.type}" 
              class="px-4 py-2 rounded-full bg-[#4A1C24] hover:bg-[#351218] text-[#F6EEE6] text-xs font-heading font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-sm"
            >
              ${link.icon}
              <span>${link.label}</span>
              <span class="text-xs">&rarr;</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  const modalHtml = `
    <div id="provider-detail-modal" class="fixed inset-0 z-50 overflow-y-auto bg-[#4A1C24]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-opacity duration-300">
      
      <!-- Modal Card Container -->
      <div 
        id="provider-modal-content"
        class="relative w-full max-w-4xl bg-[#F6EEE6] border border-[#EAD5C0] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#4A1C24]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-provider-name"
      >
        <!-- Modal Sticky Top Bar -->
        <div class="sticky top-0 z-30 bg-[#F6EEE6]/95 backdrop-blur border-b border-[#EAD5C0] px-5 sm:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-[#4A1C24] flex items-center justify-center font-heading font-black text-[#F6EEE6] text-xs shadow">
              S
            </span>
            <div>
              <span class="text-xs uppercase font-heading font-medium text-[#7A535A] tracking-wider block">
                ${provider.category} Profile
              </span>
              <h2 id="modal-provider-name" class="text-lg sm:text-2xl font-heading font-bold text-[#1A1A1A] leading-tight">
                ${provider.businessName}
              </h2>
            </div>
          </div>

          <!-- Close Modal Button -->
          <button 
            id="close-provider-modal-btn"
            type="button"
            class="w-9 h-9 rounded-full bg-white hover:bg-[#4A1C24] text-[#4A1C24] hover:text-[#F6EEE6] border border-[#EAD5C0] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            aria-label="Close modal"
          >
            <svg class="w-5 h-5 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="overflow-y-auto flex-1 p-5 sm:p-8 space-y-6">
          
          <!-- Provider Photo Banner or CSS Default Image -->
          <div class="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden shadow-sm">
            ${hasImage ? `
              <img 
                src="${provider.portfolioImages[0]}" 
                alt="${provider.businessName}" 
                class="w-full h-full object-cover rounded-2xl" 
                onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.classList.remove('hidden');"
              />
              <div class="hidden w-full h-full">
                ${getCategoryDefaultImageHtml(provider.category, 'rounded-2xl')}
              </div>
            ` : `
              <div class="w-full h-full">
                ${getCategoryDefaultImageHtml(provider.category, 'rounded-2xl')}
              </div>
            `}
          </div>

          <!-- 1. Provider Profile Header & Highlights -->
          <div class="space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3.5 py-1 rounded-full text-xs font-heading font-bold bg-[#4A1C24] text-[#F6EEE6] shadow-sm">
                ${provider.category}
              </span>
              ${provider.lsuVerified ? `
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-[#E9C6CC] text-[#4A1C24] border border-[#D4A7B0] flex items-center gap-1 font-sans shadow-sm">
                  <span>LSU ${provider.lsuVerified === 'student' ? 'Student-Owned' : 'Alumni-Owned'}</span>
                </span>
              ` : ''}
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-[#EAD5C0] text-[#351218] border border-[#D3BAA2] flex items-center gap-1.5 font-sans shadow-sm">
                <svg class="w-3.5 h-3.5 text-[#4A1C24]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>${provider.zipCode ? `ZIP ${provider.zipCode}` : (provider.neighborhood || 'Baton Rouge')}</span>
              </span>
            </div>

            ${provider.description ? `
            <p class="text-sm sm:text-base text-[#1A1A1A] font-sans font-medium leading-relaxed">
              ${provider.description}
            </p>
            ` : ''}

            <!-- Quick Info Strip: Burgundy with cream text -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-2xl bg-[#4A1C24] text-[#F6EEE6] border border-[#351218] text-xs shadow-md">
              <div>
                <span class="text-[#E9C6CC] block text-[10px] uppercase tracking-wider font-semibold font-sans">Starting Price</span>
                <span class="font-bold text-[#F6EEE6] text-sm sm:text-base font-sans">
                  $${provider.startingPrice}
                </span>
              </div>
              <div>
                <span class="text-[#E9C6CC] block text-[10px] uppercase tracking-wider font-semibold font-sans">Service Delivery</span>
                <span class="font-bold text-[#F6EEE6] text-sm sm:text-base capitalize font-sans">
                  ${provider.serviceDelivery === 'both' ? 'Studio & Mobile' : provider.serviceDelivery}
                </span>
              </div>
              <div>
                <span class="text-[#E9C6CC] block text-[10px] uppercase tracking-wider font-semibold font-sans">Student Discount</span>
                <span class="font-bold text-[#F6EEE6] text-sm sm:text-base font-sans">
                  ${provider.studentDiscount ? 'Yes (Valid ID)' : 'Standard Rates'}
                </span>
              </div>
              <div>
                <span class="text-[#E9C6CC] block text-[10px] uppercase tracking-wider font-semibold font-sans">Rating</span>
                <span id="modal-header-rating" class="font-bold text-[#F6EEE6] text-sm sm:text-base flex items-center gap-1 font-sans">
                  ${(provider.ratingCount > 0 && provider.averageRating) ? `
                    <svg class="w-3.5 h-3.5 text-[#A3456A] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span>${provider.averageRating.toFixed(1)}</span>
                  ` : `
                    <span class="text-xs text-[#E9C6CC] font-normal">No ratings yet</span>
                  `}
                </span>
              </div>
            </div>

            <!-- Single "BOOK" Button (Direct link if 1 link, expanding menu if multiple) -->
            ${bookActionHtml}

            <!-- Additional Portfolio Showcase (if multiple photos available) -->
            ${(hasImage && provider.portfolioImages.length > 1) ? `
              <div class="space-y-3 pt-3 border-t border-[#EAD5C0]">
                <h4 class="text-xs font-heading font-bold text-[#7A535A] uppercase tracking-wider">
                  Portfolio Showcase
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  ${provider.portfolioImages.map((imgUrl, idx) => `
                    <div 
                      class="group relative h-24 sm:h-28 rounded-xl overflow-hidden bg-white border border-[#EAD5C0] cursor-pointer shadow-sm hover:border-[#4A1C24] transition-all"
                      onclick="window.openPhotoLightbox('${imgUrl}', '${provider.businessName} Portfolio')"
                    >
                      <img src="${imgUrl}" alt="${provider.businessName} photo ${idx + 1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- 3. REVIEWS & RATINGS SECTION -->
          <section id="reviews-section" class="pt-6 border-t border-[#EAD5C0] space-y-6">
            
            <!-- Section Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 class="text-lg sm:text-2xl font-heading font-bold text-[#1A1A1A] tracking-wider uppercase">
                  RATINGS
                </h3>
              </div>

              <!-- Action buttons: Write a Review -->
              <div class="flex items-center gap-2">
                <button 
                  id="toggle-write-review-btn"
                  type="button"
                  class="px-5 py-2.5 rounded-full border-2 border-[#4A1C24] text-[#4A1C24] hover:bg-[#4A1C24] hover:text-[#F6EEE6] font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span id="toggle-write-review-text">Write a Review</span>
                </button>
              </div>
            </div>

            <!-- Overall Breakdown Card: Burgundy with cream text -->
            <div id="reviews-summary-card" class="rounded-2xl bg-[#4A1C24] text-[#F6EEE6] border border-[#351218] p-5 sm:p-6 shadow-xl">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                <!-- Overall Score Box -->
                <div class="text-center md:border-r md:border-[#612731] md:pr-6 space-y-1">
                  <div id="summary-big-rating" class="text-4xl sm:text-5xl font-heading font-black text-[#F6EEE6]">
                    ${(provider.ratingCount > 0 && provider.averageRating) ? provider.averageRating.toFixed(1) : '<span class="text-lg text-[#E9C6CC] font-semibold font-sans">No ratings yet</span>'}
                  </div>
                  <div id="summary-stars" class="text-lg sm:text-xl flex justify-center">
                    ${(provider.ratingCount > 0 && provider.averageRating) ? getStarsSvg(provider.averageRating, 5, true) : ''}
                  </div>
                  <p id="summary-count-text" class="text-xs text-[#E9C6CC]">
                    ${(provider.ratingCount > 0) ? `Based on <strong class="text-[#F6EEE6]">${provider.ratingCount}</strong> rating${provider.ratingCount === 1 ? '' : 's'}` : 'Be the first to rate this business'}
                  </p>
                </div>

                <!-- Category Criteria Breakdown Bars -->
                <div class="col-span-2 space-y-3">
                  <h4 class="text-xs font-heading font-bold text-[#E9C6CC] uppercase tracking-wider mb-2">
                    ${provider.category} Service-Specific Criteria
                  </h4>
                  <div id="criteria-bars-container" class="space-y-2.5">
                    <!-- Criteria progress bars rendered dynamically -->
                  </div>
                </div>

              </div>
            </div>

            <!-- RATING FORM (Hidden by default, toggled via Write a Review button) -->
            <div id="write-review-form-container" class="hidden rounded-2xl bg-[#EAD5C0]/40 border border-[#D3BAA2] p-5 sm:p-7 space-y-5 shadow-lg transition-all text-[#4A1C24]">
              <div class="flex items-center justify-between border-b border-[#D3BAA2] pb-3">
                <div>
                  <h4 class="font-heading font-bold text-base sm:text-lg text-[#1A1A1A]">
                    Rate <span class="text-[#4A1C24]">${provider.businessName}</span>
                  </h4>
                  <p class="text-xs text-[#7A535A] mt-0.5">
                    Select your ratings below to support this local Black-owned business.
                  </p>
                </div>
                <button 
                  id="cancel-write-review-btn" 
                  type="button" 
                  class="text-xs text-[#7A535A] hover:text-[#4A1C24] font-semibold underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <!-- Already rated notice -->
              <div id="already-rated-notice" class="hidden p-3.5 rounded-xl bg-[#EAD5C0] border border-[#D3BAA2] text-xs text-[#4A1C24] font-medium">
                You have already submitted a rating for this business from this browser.
              </div>

              <!-- Success Alert Box (Thanks for your rating!) -->
              <div id="rating-form-success" class="hidden p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center gap-2">
                <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <span>Thanks for your rating!</span>
              </div>

              <form id="provider-review-form" class="space-y-5" novalidate>
                
                <!-- Spam Protection: Hidden Honeypot Field -->
                <div class="hidden" aria-hidden="true">
                  <label for="review-bot-trap">Do not fill this field</label>
                  <input type="text" id="review-bot-trap" name="website_trap_input" tabindex="-1" autocomplete="off">
                </div>

                <!-- 1. Overall Star Rating (1–5) -->
                <div>
                  <label class="block text-xs font-heading font-semibold text-[#1A1A1A] mb-1.5">
                    Overall Rating <span class="text-[#A3456A]">*</span>
                  </label>
                  <div class="flex items-center gap-2">
                    <div id="star-rating-picker" class="flex items-center gap-1.5 text-[#D3BAA2] cursor-pointer">
                      <button type="button" class="star-btn hover:scale-110 transition-transform focus:outline-none text-[#A3456A]" data-value="1" aria-label="1 star">
                        <svg class="w-6 h-6 fill-current pointer-events-none" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      </button>
                      <button type="button" class="star-btn hover:scale-110 transition-transform focus:outline-none text-[#A3456A]" data-value="2" aria-label="2 stars">
                        <svg class="w-6 h-6 fill-current pointer-events-none" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      </button>
                      <button type="button" class="star-btn hover:scale-110 transition-transform focus:outline-none text-[#A3456A]" data-value="3" aria-label="3 stars">
                        <svg class="w-6 h-6 fill-current pointer-events-none" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      </button>
                      <button type="button" class="star-btn hover:scale-110 transition-transform focus:outline-none text-[#A3456A]" data-value="4" aria-label="4 stars">
                        <svg class="w-6 h-6 fill-current pointer-events-none" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      </button>
                      <button type="button" class="star-btn hover:scale-110 transition-transform focus:outline-none text-[#A3456A]" data-value="5" aria-label="5 stars">
                        <svg class="w-6 h-6 fill-current pointer-events-none" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      </button>
                    </div>
                    <span id="star-rating-label" class="text-xs font-semibold text-[#A3456A] font-mono ml-2">
                      5 - Excellent
                    </span>
                  </div>
                  <input type="hidden" id="review-overall-rating" value="5">
                </div>

                <!-- 2. Category-Specific Criteria Ratings -->
                <div class="space-y-3 pt-2 border-t border-[#D3BAA2]">
                  <div class="flex items-center justify-between">
                    <label class="text-xs font-heading font-semibold text-[#1A1A1A]">
                      Rate Specific Criteria (${provider.category}) <span class="text-[#A3456A]">*</span>
                    </label>
                    <span class="text-[10px] text-[#7A535A]">Scale of 1 (Lowest) to 5 (Highest)</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    ${criteria.map(crit => `
                      <div class="p-3 rounded-xl bg-white border border-[#EAD5C0] space-y-1.5 shadow-sm">
                        <div class="flex items-center justify-between text-xs">
                          <span class="font-medium text-[#1A1A1A] flex items-center gap-1 font-sans">
                            <span>${crit.label}</span>
                          </span>
                          <span id="criteria-label-${crit.key}" class="font-bold text-[#A3456A] font-mono">5/5</span>
                        </div>
                        <div class="flex items-center justify-between criteria-picker" data-criteria-key="${crit.key}">
                          ${[1, 2, 3, 4, 5].map(v => `
                            <button type="button" class="criteria-star-btn hover:scale-110 transition-transform focus:outline-none text-[#A3456A]" data-value="${v}" aria-label="${v} stars for ${crit.label}">
                              <svg class="w-4 h-4 fill-current pointer-events-none" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            </button>
                          `).join('')}
                        </div>
                        <input type="hidden" class="criteria-input" id="criteria-input-${crit.key}" data-key="${crit.key}" value="5">
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Form Alert / Error Box -->
                <div id="review-form-error" class="hidden p-3 rounded-xl bg-red-100 border border-red-300 text-xs text-red-800">
                  <!-- Error message -->
                </div>

                <!-- Form Submit Action -->
                <div class="flex items-center justify-end gap-3 pt-2">
                  <button 
                    id="submit-review-btn" 
                    type="submit" 
                    class="px-6 py-2.5 rounded-full bg-[#4A1C24] hover:bg-[#351218] text-[#F6EEE6] font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>SUBMIT RATING</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </form>
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
      const isExpanded = !writeContainer.classList.contains('hidden');
      const btnText = document.getElementById('toggle-write-review-text');
      if (btnText) {
        btnText.textContent = isExpanded ? 'Cancel Review' : 'Write a Review';
      }
      if (isExpanded) {
        writeContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
  if (cancelWriteBtn && writeContainer) {
    cancelWriteBtn.addEventListener('click', () => {
      writeContainer.classList.add('hidden');
      const btnText = document.getElementById('toggle-write-review-text');
      if (btnText) {
        btnText.textContent = 'Write a Review';
      }
    });
  }

  // Book Button Dropdown Toggle (if multiple booking options exist)
  const bookMainBtn = document.getElementById('book-main-btn');
  const bookDropdown = document.getElementById('book-options-dropdown');
  const bookChevron = document.getElementById('book-chevron');
  if (bookMainBtn && bookDropdown) {
    bookMainBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = bookDropdown.classList.contains('hidden');
      bookDropdown.classList.toggle('hidden');
      bookMainBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      if (bookChevron) {
        bookChevron.classList.toggle('rotate-180', isHidden);
      }
    });
  }

  // Direct Message (DM) Copy Button
  const copyDmBtn = modal.querySelector('.copy-dm-btn');
  if (copyDmBtn) {
    copyDmBtn.addEventListener('click', async () => {
      const text = copyDmBtn.getAttribute('data-dm-text');
      try {
        await navigator.clipboard.writeText(text);
        const originalText = copyDmBtn.textContent;
        copyDmBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyDmBtn.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
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
          b.classList.remove('text-[#D3BAA2]');
          b.classList.add('text-[#A3456A]');
        } else {
          b.classList.remove('text-[#A3456A]');
          b.classList.add('text-[#D3BAA2]');
        }
      });
    });
  });
  // Trigger initial 5-star state
  starBtns.forEach(b => {
    b.classList.remove('text-[#D3BAA2]');
    b.classList.add('text-[#A3456A]');
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
            b.classList.remove('text-[#D3BAA2]');
            b.classList.add('text-[#A3456A]');
          } else {
            b.classList.remove('text-[#A3456A]');
            b.classList.add('text-[#D3BAA2]');
          }
        });
      });
    });
  });

  // Check if already rated by this browser
  const storageKey = `rated_provider_${provider.id}`;
  const alreadyRatedNotice = document.getElementById('already-rated-notice');
  const submitBtn = document.getElementById('submit-review-btn');
  if (localStorage.getItem(storageKey)) {
    if (alreadyRatedNotice) alreadyRatedNotice.classList.remove('hidden');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      submitBtn.title = 'You have already rated this business.';
    }
  }

  function showFormError(msg) {
    const errorBox = document.getElementById('review-form-error');
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.classList.remove('hidden');
    }
  }

  function hideFormError() {
    const errorBox = document.getElementById('review-form-error');
    if (errorBox) errorBox.classList.add('hidden');
  }

  // --------------------------------------------------------------------------
  // Form Submission with Spam Protection & Real Rating Saving
  // --------------------------------------------------------------------------
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // SPAM PROTECTION 1: Honeypot trap check
      const honeypot = document.getElementById('review-bot-trap');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('[Spam Protection] Bot detected via honeypot field.');
        showFormError('Submission failed verification.');
        return;
      }

      // SPAM PROTECTION 2: One rating per provider per browser
      if (localStorage.getItem(storageKey)) {
        showFormError('You have already submitted a rating for this business from this browser.');
        return;
      }

      // Validate overall star rating (whole number 1-5)
      const overallRatingInput = document.getElementById('review-overall-rating');
      const overallVal = parseInt(overallRatingInput.value, 10);
      if (isNaN(overallVal) || overallVal < 1 || overallVal > 5) {
        showFormError('Please select an overall rating (1–5 stars).');
        return;
      }

      // Validate criteria ratings (whole numbers 1-5)
      const criteriaValues = {};
      let hasCriteriaError = false;
      reviewForm.querySelectorAll('.criteria-input').forEach(inp => {
        const key = inp.dataset.key;
        const val = parseInt(inp.value, 10);
        if (isNaN(val) || val < 1 || val > 5) {
          hasCriteriaError = true;
        }
        criteriaValues[key] = val || 5;
      });

      if (hasCriteriaError) {
        showFormError('Please rate all criteria between 1 and 5 stars.');
        return;
      }

      const submitBtn = document.getElementById('submit-review-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Submitting rating...</span>`;
      hideFormError();

      const ratingPayload = {
        providerId: provider.id,
        category: provider.category,
        overall: overallVal,
        criteria: criteriaValues
      };

      try {
        const savedRating = await submitRatingToFirestore(ratingPayload);

        // Update local provider stats in memory
        if (!provider.ratings) provider.ratings = [];
        provider.ratings.push(savedRating);
        provider.ratingCount = provider.ratings.length;
        provider.reviewCount = provider.ratings.length;
        const sum = provider.ratings.reduce((acc, r) => acc + Number(r.overall || r.rating || 5), 0);
        provider.averageRating = Number((sum / provider.ratingCount).toFixed(1));

        // Show "Thanks for your rating!"
        const successBanner = document.getElementById('rating-form-success');
        if (successBanner) successBanner.classList.remove('hidden');

        // Hide form inputs
        reviewForm.classList.add('hidden');

        // Show already-rated notice for future reference
        if (alreadyRatedNotice) alreadyRatedNotice.classList.remove('hidden');

        // Update modal summary stats
        renderSummaryStats(provider, provider.ratings);

        // Update modal header rating
        const modalHeaderRating = document.getElementById('modal-header-rating');
        if (modalHeaderRating) {
          modalHeaderRating.innerHTML = `<svg class="w-3.5 h-3.5 text-[#A3456A] fill-current inline-block" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> <span>${provider.averageRating.toFixed(1)}</span>`;
        }

        // Update parent directory cards immediately
        if (modalOnStatsUpdatedCallback) {
          modalOnStatsUpdatedCallback(provider.id, provider.averageRating, provider.ratingCount);
        }

      } catch (err) {
        console.error('Failed to submit rating:', err);
        showFormError(err.message || 'Could not submit rating. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>SUBMIT RATING</span><span>&rarr;</span>`;
      }
    });
  }
}

// ============================================================================
// 5. Load & Render Ratings
// ============================================================================
async function loadAndRenderReviews(provider) {
  let ratings = provider.ratings || [];
  try {
    const firestoreRatings = await getRatingsForProvider(provider.id);
    if (Array.isArray(firestoreRatings)) {
      ratings = firestoreRatings;
      provider.ratings = ratings;
      provider.ratingCount = ratings.length;
      provider.reviewCount = ratings.length;
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, r) => acc + Number(r.overall || r.rating || 5), 0);
        provider.averageRating = Number((sum / ratings.length).toFixed(1));
      } else {
        provider.averageRating = null;
      }
    }
  } catch (err) {
    console.warn('Could not query Firestore ratings for modal:', err);
  }

  // Update Summary Stats & Criteria Progress Bars
  renderSummaryStats(provider, ratings);
}

function renderSummaryStats(provider, reviews = []) {
  const bigRating = document.getElementById('summary-big-rating');
  const starsEl = document.getElementById('summary-stars');
  const countText = document.getElementById('summary-count-text');
  const headerRating = document.getElementById('modal-header-rating');
  const barsContainer = document.getElementById('criteria-bars-container');

  const list = Array.isArray(reviews) ? reviews : (provider.ratings || []);
  const totalCount = list.length;

  if (totalCount === 0) {
    if (bigRating) bigRating.innerHTML = '<span class="text-xl sm:text-2xl text-[#E9C6CC] font-semibold font-sans">No ratings yet</span>';
    if (starsEl) starsEl.innerHTML = '';
    if (countText) countText.textContent = 'Be the first to rate this business';
    if (headerRating) headerRating.innerHTML = '<span class="text-xs text-[#E9C6CC] font-normal">No ratings yet</span>';

    const criteriaList = getCriteriaForCategory(provider.category);
    if (barsContainer) {
      barsContainer.innerHTML = criteriaList.map(crit => `
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="text-[#F6EEE6] font-medium">${crit.label}</span>
            <span class="font-mono text-[#E9C6CC]/60">— / 5</span>
          </div>
          <div class="w-full h-2 rounded-full bg-[#351218] overflow-hidden border border-[#612731]">
            <div class="h-full bg-[#612731] rounded-full" style="width: 0%"></div>
          </div>
        </div>
      `).join('');
    }
    return;
  }

  const sum = list.reduce((acc, r) => acc + Number(r.overall || r.rating || 5), 0);
  const avgOverall = Number((sum / totalCount).toFixed(1));

  if (bigRating) bigRating.textContent = avgOverall.toFixed(1);
  if (starsEl) starsEl.innerHTML = getStarsSvg(avgOverall, 5, true);
  if (countText) {
    countText.innerHTML = `Based on <strong class="text-[#F6EEE6]">${totalCount}</strong> rating${totalCount === 1 ? '' : 's'}`;
  }
  if (headerRating) {
    headerRating.innerHTML = `<svg class="w-3.5 h-3.5 text-[#A3456A] fill-current inline-block" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> <span>${avgOverall.toFixed(1)}</span>`;
  }

  // Compute criteria breakdown averages
  const criteriaList = getCriteriaForCategory(provider.category);
  if (barsContainer) {
    barsContainer.innerHTML = criteriaList.map(crit => {
      let cSum = 0;
      let cCount = 0;
      list.forEach(r => {
        if (r.criteria && r.criteria[crit.key] !== undefined) {
          cSum += Number(r.criteria[crit.key]);
          cCount++;
        }
      });
      const avg = cCount > 0 ? (cSum / cCount) : avgOverall;
      const pct = Math.round((avg / 5) * 100);

      return `
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="text-[#F6EEE6] font-medium">${crit.label}</span>
            <span class="font-mono font-bold text-[#E9C6CC]">${avg.toFixed(1)} / 5</span>
          </div>
          <div class="w-full h-2 rounded-full bg-[#351218] overflow-hidden border border-[#612731]">
            <div class="h-full bg-[#A3456A] rounded-full transition-all duration-500" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
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
        class="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-[#E9C6CC] flex items-center justify-center text-xl font-bold transition-colors cursor-pointer z-10"
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
