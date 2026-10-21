/**
 * js/components/ProviderCard.js
 * 
 * Reusable component for rendering individual service provider cards.
 * Restyled with:
 * - Tab-style label above card (BEGINNER / INTERMEDIATE / ADVANCED like the screenshot)
 * - Rounded photo at the top
 * - Business name in chunky display font (Lilita One)
 * - Price in bold with starting price callout
 * - Badges in Blush, Sand, Burgundy, and LSU Gold accent
 * - Fully rounded pill-shaped social and booking buttons
 */

import { calculateDistance } from '../utils/distance.js';

/**
 * Returns experience tab configuration (label & styling) above the card.
 */
function getExperienceTab(years, category) {
  if (years <= 2) {
    return {
      label: `BEGINNER • ${category.toUpperCase()}`,
      badgeClass: 'bg-[#EAD5C0] text-[#4A1C24] border-[#D3BAA2]'
    };
  } else if (years <= 5) {
    return {
      label: `INTERMEDIATE • ${category.toUpperCase()}`,
      badgeClass: 'bg-[#E9C6CC] text-[#4A1C24] border-[#D4A7B0]'
    };
  } else {
    return {
      label: `ADVANCED • ${category.toUpperCase()}`,
      badgeClass: 'bg-[#4A1C24] text-[#F6EEE6] border-[#4A1C24]'
    };
  }
}

/**
 * Returns an experience badge HTML based on years of experience.
 */
function getExperienceBadge(years) {
  if (years <= 2) {
    return `
      <span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EAD5C0]/60 text-[#4A1C24] border border-[#EAD5C0]" title="${years} years of professional experience">
        <span class="w-1.5 h-1.5 rounded-full bg-[#D3BAA2]"></span>
        Rising (${years} yrs)
      </span>
    `;
  } else if (years <= 5) {
    return `
      <span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E9C6CC]/60 text-[#4A1C24] border border-[#E9C6CC]" title="${years} years of professional experience">
        <span class="w-1.5 h-1.5 rounded-full bg-[#D4A7B0]"></span>
        Pro (${years} yrs)
      </span>
    `;
  } else {
    return `
      <span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#4A1C24] text-[#F6EEE6] border border-[#4A1C24]" title="${years}+ years of professional experience">
        <span class="w-1.5 h-1.5 rounded-full bg-[#FDD023]"></span>
        Master (${years}+ yrs)
      </span>
    `;
  }
}

/**
 * Returns an availability badge HTML.
 */
function getAvailabilityBadge(availability) {
  switch (availability) {
    case 'same-day':
      return `
        <span class="inline-flex items-center gap-1 text-[11px] font-heading font-black px-3 py-1 rounded-full bg-[#FDD023] text-[#4A1C24] shadow-sm">
          ⚡ Same-Day
        </span>
      `;
    case 'open-this-week':
      return `
        <span class="inline-flex items-center gap-1 text-[11px] font-heading font-black px-3 py-1 rounded-full bg-[#E9C6CC] text-[#4A1C24] border border-[#D4A7B0] shadow-sm">
          🟢 Open This Week
        </span>
      `;
    case 'bookings-open':
    default:
      return `
        <span class="inline-flex items-center gap-1 text-[11px] font-heading font-bold px-3 py-1 rounded-full bg-[#EAD5C0] text-[#4A1C24] border border-[#D3BAA2] shadow-sm">
          📅 Bookings Open
        </span>
      `;
  }
}

/**
 * Returns LSU verified affiliation badge (Student-Owned or Alumni-Owned).
 */
function getLsuVerifiedBadge(verified) {
  if (verified === 'student') {
    return `
      <span class="inline-flex items-center gap-1.5 text-[11px] font-heading font-black px-3 py-1 rounded-full bg-[#4A1C24] text-[#FDD023] border border-[#FDD023]/60 shadow-sm">
        <span>🐯</span>
        <span>LSU Student-Owned</span>
      </span>
    `;
  } else if (verified === 'alumni') {
    return `
      <span class="inline-flex items-center gap-1.5 text-[11px] font-heading font-black px-3 py-1 rounded-full bg-[#351218] text-[#E9C6CC] border border-[#E9C6CC]/40 shadow-sm">
        <span>🎓</span>
        <span>LSU Alumni-Owned</span>
      </span>
    `;
  }
  return '';
}

/**
 * Main ProviderCard Component function.
 * @param {Object} provider - Provider business data object
 * @returns {string} HTML markup string for the card
 */
export function createProviderCard(provider) {
  const primaryImage = provider.portfolioImages && provider.portfolioImages.length > 0
    ? provider.portfolioImages[0]
    : 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80';

  const expTab = getExperienceTab(provider.yearsExperience, provider.category);
  const expBadge = getExperienceBadge(provider.yearsExperience);
  const availBadge = getAvailabilityBadge(provider.availability);
  const lsuBadge = getLsuVerifiedBadge(provider.lsuVerified);
  
  // Calculate distance from LSU Memorial Tower
  const distance = calculateDistance(provider.latitude, provider.longitude);

  return `
    <div class="relative pt-4 flex flex-col h-full">
      
      <!-- Small Tab-Style Label Above Card (BEGINNER / INTERMEDIATE / ADVANCED) -->
      <div class="absolute top-0 left-6 sm:left-7 z-10">
        <span class="inline-block px-3.5 py-1 text-[10px] sm:text-[11px] font-heading font-black uppercase tracking-widest ${expTab.badgeClass} rounded-t-xl border-t border-x shadow-sm">
          ${expTab.label}
        </span>
      </div>

      <!-- Main Provider Card -->
      <article 
        class="group relative flex flex-col flex-grow rounded-3xl bg-white border border-[#E9C6CC] hover:border-[#4A1C24] shadow-md hover:shadow-xl shadow-[#4A1C24]/8 transition-all duration-300 overflow-hidden"
        data-provider-id="${provider.id}"
        data-category="${provider.category}"
        data-distance="${distance}"
      >
        <!-- 1. Rounded Photo at the Top of the Card -->
        <div class="p-3 sm:p-3.5 pb-0">
          <div class="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-[#F6EEE6] shadow-sm">
            <img 
              src="${primaryImage}" 
              alt="${provider.businessName} portfolio preview" 
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out rounded-2xl"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80';"
            />

            <!-- Top Corner Badges -->
            <div class="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1.5 pointer-events-none">
              <div class="flex flex-col gap-1 items-start">
                ${lsuBadge}
              </div>
              <div class="flex flex-col gap-1 items-end">
                ${availBadge}
              </div>
            </div>

            <!-- Distance Pill in Bottom Corner of Photo -->
            <div class="absolute bottom-2.5 left-2.5">
              <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A1C24] px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm border border-[#EAD5C0] shadow-sm">
                <span class="text-[#FDD023]">📍</span>
                <span>${provider.neighborhood} &bull; <strong class="font-mono">${distance} mi</strong></span>
              </span>
            </div>
          </div>
        </div>

        <!-- 2. Card Body Content -->
        <div class="flex flex-col flex-grow p-5 sm:p-6 bg-white">
          
          <!-- Header: Business Name in Chunky Heading Font & Owner -->
          <div class="mb-2">
            <button 
              type="button"
              class="open-provider-modal-btn text-left group-hover:text-[#612731] transition-colors focus:outline-none cursor-pointer w-full"
              data-provider-id="${provider.id}"
              title="View full profile and reviews"
            >
              <h3 class="text-xl sm:text-2xl font-heading font-black text-[#4A1C24] group-hover:text-[#612731] transition-colors leading-tight">
                ${provider.businessName}
              </h3>
            </button>
            <p class="text-xs text-[#7A535A] mt-0.5 font-medium">
              By <span class="text-[#4A1C24] font-semibold">${provider.ownerName}</span>
            </p>
          </div>

          <!-- Rating & Reviews Indicator -->
          <div class="flex items-center justify-between mb-3 text-xs">
            <button 
              type="button"
              class="open-provider-modal-btn flex items-center gap-1.5 hover:text-[#4A1C24] transition-colors cursor-pointer text-left focus:outline-none"
              data-provider-id="${provider.id}"
              title="View ratings and reviews"
            >
              <span class="text-[#FDD023] text-sm leading-none">★</span>
              <span class="font-bold text-[#4A1C24] font-mono">${provider.averageRating.toFixed(1)}</span>
              <span class="text-[#7A535A] font-normal hover:underline">(${provider.reviewCount} reviews)</span>
            </button>

            <!-- Student Discount Callout Pill -->
            ${provider.studentDiscount ? `
              <span class="inline-flex items-center gap-1 text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-[#E9C6CC]/50 text-[#4A1C24] border border-[#D4A7B0]">
                🐯 Student Discount
              </span>
            ` : ''}
          </div>

          <!-- Description Snippet -->
          <p class="text-xs text-[#523B40] leading-relaxed line-clamp-2 mb-4 flex-grow font-sans">
            ${provider.description}
          </p>

          <!-- Pricing & Experience Strip (Price in Bold) -->
          <div class="flex items-center justify-between py-2.5 px-3.5 rounded-2xl bg-[#F6EEE6] border border-[#EAD5C0]/70 mb-4 text-xs">
            <div>
              <span class="text-[10px] text-[#7A535A] uppercase tracking-wider block font-heading font-bold">Starting Price</span>
              <span class="font-black text-[#4A1C24] font-heading text-base sm:text-lg">
                $${provider.startingPrice} <span class="text-[#FDD023] font-mono text-xs font-bold">${provider.priceTier}</span>
              </span>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-[#7A535A] uppercase tracking-wider block font-heading font-bold">Experience</span>
              ${expBadge}
            </div>
          </div>

          <!-- Card Footer: Pill-shaped Social Media Icons & Booking Buttons -->
          <div class="pt-3 border-t border-[#E9C6CC]/40 flex items-center justify-between gap-2 mt-auto">
            
            <!-- Social Media Pill Icon Buttons -->
            <div class="flex items-center gap-1.5">
              <!-- Instagram Button -->
              <a 
                href="${provider.instagramUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                data-track-provider="${provider.id}"
                data-track-type="instagram"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F6EEE6] hover:bg-[#4A1C24] border border-[#EAD5C0] hover:border-[#4A1C24] flex items-center justify-center text-[#4A1C24] hover:text-[#F6EEE6] transition-all shadow-sm"
                title="Visit Instagram (opens in new tab)"
                aria-label="${provider.businessName} on Instagram"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <!-- TikTok Button -->
              <a 
                href="${provider.tiktokUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                data-track-provider="${provider.id}"
                data-track-type="tiktok"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F6EEE6] hover:bg-[#4A1C24] border border-[#EAD5C0] hover:border-[#4A1C24] flex items-center justify-center text-[#4A1C24] hover:text-[#F6EEE6] transition-all shadow-sm"
                title="Visit TikTok (opens in new tab)"
                aria-label="${provider.businessName} on TikTok"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>

              <!-- Website Button -->
              <a 
                href="${provider.websiteUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                data-track-provider="${provider.id}"
                data-track-type="website"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F6EEE6] hover:bg-[#4A1C24] border border-[#EAD5C0] hover:border-[#4A1C24] flex items-center justify-center text-[#4A1C24] hover:text-[#F6EEE6] transition-all shadow-sm"
                title="Visit Website (opens in new tab)"
                aria-label="${provider.businessName} Website"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </div>

            <!-- Pill-shaped Action Buttons -->
            <div class="flex items-center gap-2">
              <!-- Outlined Pill: Reviews -->
              <button 
                type="button" 
                class="open-provider-modal-btn px-3.5 py-1.5 rounded-full border-2 border-[#4A1C24] text-[#4A1C24] hover:bg-[#4A1C24] hover:text-[#F6EEE6] font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                data-provider-id="${provider.id}"
                title="View full profile and client reviews"
              >
                <span>Reviews</span>
              </button>

              <!-- Solid Pill: Book -->
              <a 
                href="${provider.bookingUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                data-track-provider="${provider.id}"
                data-track-type="booking"
                class="px-4 sm:px-5 py-1.5 rounded-full bg-[#4A1C24] hover:bg-[#351218] text-[#F6EEE6] font-heading font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Book</span>
                <svg class="w-3 h-3 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            </div>

          </div>

        </div>

      </article>

    </div>
  `;
}

export default createProviderCard;
