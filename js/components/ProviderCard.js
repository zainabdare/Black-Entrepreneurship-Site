/**
 * js/components/ProviderCard.js
 * 
 * Reusable component for rendering individual service provider cards.
 * Simplified card layout:
 * - Clean photo at the top
 * - Business name & owner name
 * - Star rating number & Student Discount badge
 * - Starting price strip
 * - Instagram, TikTok, and direct booking/website link icons
 * - Entire card clickable to open provider detail modal
 */

import { getDistanceFromLSU } from '../utils/distance.js';

/**
 * Category-specific burgundy shades for CSS-only default image banners.
 * Distinct shades within the burgundy palette for each category.
 */
export const CATEGORY_BURGUNDY_SHADES = {
  'Hair': '#4A1C24',                     // Signature deep burgundy
  'Nails': '#561C2C',                    // Rich berry wine burgundy
  'Lashes': '#3A121A',                   // Noir dark burgundy
  'Food & Beverages': '#5C2022',         // Warm spiced terracotta burgundy
  'Fashion': '#44182E',                  // Royal plum burgundy
  'Fashion (Custom Outfits)': '#44182E', // Royal plum burgundy
  'Photography': '#32141D'               // Espresso charcoal burgundy
};

/**
 * Returns the burgundy color shade for a given category.
 * @param {string} category 
 * @returns {string} Hex color string
 */
export function getCategoryBurgundyShade(category = '') {
  if (!category) return '#4A1C24';
  if (CATEGORY_BURGUNDY_SHADES[category]) {
    return CATEGORY_BURGUNDY_SHADES[category];
  }
  const lower = category.toLowerCase();
  if (lower.includes('hair')) return CATEGORY_BURGUNDY_SHADES['Hair'];
  if (lower.includes('nail')) return CATEGORY_BURGUNDY_SHADES['Nails'];
  if (lower.includes('lash')) return CATEGORY_BURGUNDY_SHADES['Lashes'];
  if (lower.includes('food') || lower.includes('beverage')) return CATEGORY_BURGUNDY_SHADES['Food & Beverages'];
  if (lower.includes('fashion') || lower.includes('outfit')) return CATEGORY_BURGUNDY_SHADES['Fashion'];
  if (lower.includes('photo')) return CATEGORY_BURGUNDY_SHADES['Photography'];
  return '#4A1C24';
}

/**
 * Normalizes category title for banner display.
 * @param {string} category 
 * @returns {string}
 */
export function formatCategoryDisplayName(category = '') {
  if (!category) return 'SETLIST';
  const clean = category.trim();
  if (clean.toLowerCase().includes('fashion')) return 'FASHION';
  return clean.toUpperCase();
}

/**
 * Checks whether a field value is valid and not empty or "Not provided".
 * @param {*} val 
 * @returns {boolean}
 */
export function isCleanValue(val) {
  if (!val || typeof val !== 'string') return false;
  const t = val.trim().toLowerCase();
  return t.length > 0 && t !== 'not provided' && t !== 'null' && t !== 'undefined';
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Generates a 100% CSS-only placeholder banner using the business name.
 * Features:
 * - Burgundy background matching the category's signature shade
 * - Business name in cream Raleway capitals with wide letter spacing
 * - Dynamically shrunk font size to fit long names (wrapped up to 2 lines)
 * - Category in small text underneath (e.g. "LASHES")
 * 
 * @param {string} businessName 
 * @param {string} category 
 * @param {string} extraClasses 
 * @returns {string} HTML markup string
 */
export function getBusinessPlaceholderHtml(businessName = '', category = '', extraClasses = '') {
  const shade = getCategoryBurgundyShade(category);
  const catDisplay = formatCategoryDisplayName(category);
  const rawName = (businessName || 'SETLIST').trim();

  // Dynamic text size & letter-spacing based on business name length to fit up to 2 lines
  const len = rawName.length;
  let sizeClass = 'text-base sm:text-lg md:text-xl';
  let trackingClass = 'tracking-[0.22em] pl-[0.22em]';

  if (len > 30) {
    sizeClass = 'text-xs sm:text-sm md:text-base';
    trackingClass = 'tracking-[0.14em] pl-[0.14em]';
  } else if (len > 18) {
    sizeClass = 'text-sm sm:text-base md:text-lg';
    trackingClass = 'tracking-[0.18em] pl-[0.18em]';
  }

  return `
    <div 
      class="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none relative overflow-hidden ${extraClasses}"
      style="background-color: ${shade}; font-family: 'Raleway', sans-serif;"
      aria-label="${esc(rawName)} - ${esc(catDisplay)}"
    >
      <div class="relative z-10 flex flex-col items-center justify-center max-w-[94%] mx-auto">
        <span 
          class="font-heading font-extrabold uppercase text-[#F6EEE6] ${sizeClass} ${trackingClass} leading-snug drop-shadow-sm line-clamp-2 text-center"
        >
          ${esc(rawName)}
        </span>
        <span 
          class="font-heading font-medium uppercase text-[#E9C6CC] text-[10px] sm:text-[11px] tracking-[0.3em] pl-[0.3em] mt-1.5 opacity-90"
        >
          ${esc(catDisplay)}
        </span>
      </div>
    </div>
  `;
}

/**
 * Backwards compatibility helper delegating to getBusinessPlaceholderHtml.
 */
export function getCategoryDefaultImageHtml(category = '', extraClasses = '', businessName = '') {
  return getBusinessPlaceholderHtml(businessName, category, extraClasses);
}

/**
 * Main ProviderCard Component function.
 * @param {Object} provider - Provider business data object
 * @returns {string} HTML markup string for the card
 */
export function createProviderCard(provider) {
  const cleanThumb = isCleanValue(provider.thumbnail) ? provider.thumbnail.trim() : null;
  const firstPortfolioImg = (Array.isArray(provider.portfolioImages) && provider.portfolioImages.length > 0 && isCleanValue(provider.portfolioImages[0]))
    ? provider.portfolioImages[0].trim()
    : null;
  const thumbUrl = cleanThumb || firstPortfolioImg;
  const hasImage = Boolean(thumbUrl);

  // Calculate distance from LSU Memorial Tower for data-distance attribute (used by filters/sorting)
  const distance = getDistanceFromLSU(provider);

  // Links: Treat any "Not provided" value as empty
  const validBookingUrl = isCleanValue(provider.bookingUrl) ? provider.bookingUrl.trim() : null;
  const validWebsiteUrl = isCleanValue(provider.websiteUrl) ? provider.websiteUrl.trim() : null;
  const validInstagramUrl = isCleanValue(provider.instagramUrl) ? provider.instagramUrl.trim() : null;
  const validTiktokUrl = isCleanValue(provider.tiktokUrl) ? provider.tiktokUrl.trim() : null;

  // Link icon prioritizes bookingUrl, then falls back to websiteUrl
  const directLink = validBookingUrl || validWebsiteUrl;
  const directLinkTitle = validBookingUrl
    ? 'Book Appointment (opens in new tab)'
    : 'Visit Website (opens in new tab)';
  const directLinkType = validBookingUrl ? 'booking' : 'website';

  // NO FAKE 5.0: Only show rating if calculated from real ratings (ratingCount > 0)
  const hasRating = Number(provider.ratingCount) > 0 && typeof provider.averageRating === 'number' && !isNaN(provider.averageRating);

  return `
    <div class="flex flex-col h-full">
      <!-- Main Provider Card (Clickable to open Detail Modal) -->
      <article 
        class="open-provider-modal-btn group relative flex flex-col flex-grow rounded-3xl bg-white border border-[#E9C6CC] hover:border-[#4A1C24] shadow-md hover:shadow-xl shadow-[#4A1C24]/8 transition-all duration-300 overflow-hidden cursor-pointer"
        data-provider-id="${provider.id}"
        data-category="${provider.category}"
        data-distance="${distance}"
        title="Click to view full profile and details for ${provider.businessName}"
      >
        <!-- 1. Photo at Top of Card -->
        <div class="p-3 sm:p-3.5 pb-0">
          <div class="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-[#F6EEE6] shadow-sm">
            ${hasImage ? `
              <img 
                src="${thumbUrl}" 
                alt="${esc(provider.businessName)} portfolio preview" 
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out rounded-2xl"
                onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.classList.remove('hidden');"
              />
              <div class="hidden w-full h-full">
                ${getBusinessPlaceholderHtml(provider.businessName, provider.category, 'rounded-2xl')}
              </div>
            ` : `
              <div class="w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out">
                ${getBusinessPlaceholderHtml(provider.businessName, provider.category, 'rounded-2xl')}
              </div>
            `}
          </div>
        </div>

        <!-- 2. Card Body Content -->
        <div class="flex flex-col flex-grow p-5 sm:p-6 bg-white">
          
          <!-- Header: Business Name & Owner -->
          <div class="mb-2.5">
            <h3 class="text-xl sm:text-2xl font-heading font-bold text-[#4A1C24] group-hover:text-[#612731] transition-colors leading-tight">
              ${provider.businessName}
            </h3>
            <p class="text-xs text-[#7A535A] mt-1 font-medium font-sans">
              By <span class="text-[#4A1C24] font-semibold">${provider.ownerName}</span>
            </p>
          </div>

          <!-- Rating & Student Discount Badge -->
          <div class="flex items-center justify-between mb-4 text-xs">
            ${hasRating ? `
              <div class="flex items-center gap-1.5" title="Rated ${provider.averageRating.toFixed(1)} out of 5 stars">
                <svg class="w-4 h-4 text-[#FDD023] fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="font-bold text-[#4A1C24] font-mono text-sm">${provider.averageRating.toFixed(1)}</span>
              </div>
            ` : `
              <div class="flex items-center gap-1.5 text-xs text-[#7A535A] font-medium font-sans">
                <span>No ratings yet</span>
              </div>
            `}

            <!-- Student Discount Callout Pill -->
            ${provider.studentDiscount ? `
              <span class="inline-flex items-center gap-1 text-[11px] font-heading font-semibold px-2.5 py-0.5 rounded-full bg-[#E9C6CC]/50 text-[#4A1C24] border border-[#D4A7B0]">
                Student Discount
              </span>
            ` : ''}
          </div>

          <!-- Starting Price Strip (Clean, bold price) -->
          <div class="flex items-center justify-between py-2.5 px-3.5 rounded-2xl bg-[#F6EEE6] border border-[#EAD5C0]/70 mb-4 text-xs">
            <span class="text-[11px] text-[#7A535A] uppercase tracking-wider font-heading font-semibold">Starting Price</span>
            <span class="font-bold text-[#4A1C24] font-heading text-base sm:text-lg">
              $${provider.startingPrice}
            </span>
          </div>

          <!-- Card Footer: Pill-shaped Social & Booking Link Icons -->
          <div class="pt-3 border-t border-[#E9C6CC]/40 flex items-center justify-between gap-2 mt-auto">
            
            <!-- Social & Booking Link Icon Buttons -->
            <div class="flex items-center gap-2">
              <!-- Instagram Button -->
              ${validInstagramUrl ? `
              <a 
                href="${validInstagramUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                data-track-provider="${provider.id}"
                data-track-type="instagram"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F6EEE6] hover:bg-[#4A1C24] border border-[#EAD5C0] hover:border-[#4A1C24] flex items-center justify-center text-[#4A1C24] hover:text-[#F6EEE6] transition-all shadow-sm"
                title="Visit Instagram (opens in new tab)"
                aria-label="${esc(provider.businessName)} on Instagram"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              ` : ''}

              <!-- TikTok Button -->
              ${validTiktokUrl ? `
              <a 
                href="${validTiktokUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                data-track-provider="${provider.id}"
                data-track-type="tiktok"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F6EEE6] hover:bg-[#4A1C24] border border-[#EAD5C0] hover:border-[#4A1C24] flex items-center justify-center text-[#4A1C24] hover:text-[#F6EEE6] transition-all shadow-sm"
                title="Visit TikTok (opens in new tab)"
                aria-label="${esc(provider.businessName)} on TikTok"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              ` : ''}

              <!-- Booking / Website Link Button -->
              ${directLink ? `
              <a 
                href="${directLink}" 
                target="_blank" 
                rel="noopener noreferrer" 
                data-track-provider="${provider.id}" 
                data-track-type="${directLinkType}" 
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F6EEE6] hover:bg-[#4A1C24] border border-[#EAD5C0] hover:border-[#4A1C24] flex items-center justify-center text-[#4A1C24] hover:text-[#F6EEE6] transition-all shadow-sm"
                title="${directLinkTitle}"
                aria-label="${esc(provider.businessName)} Booking Link"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
              ` : ''}
            </div>

            <!-- View Profile Hint Link -->
            <span class="text-xs font-heading font-semibold text-[#7A535A] group-hover:text-[#4A1C24] transition-colors inline-flex items-center gap-1">
              <span>View Profile</span>
              <svg class="w-3.5 h-3.5 stroke-current stroke-2 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </span>

          </div>

        </div>

      </article>

    </div>
  `;
}

export default createProviderCard;
