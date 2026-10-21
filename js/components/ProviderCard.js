/**
 * js/components/ProviderCard.js
 * 
 * Reusable component for rendering individual service provider cards.
 * Displays calculated distance from LSU Memorial Tower using Haversine formula.
 */

import { calculateDistance } from '../utils/distance.js';

/**
 * Returns an experience badge HTML based on years of experience.
 * - 1-2 yrs: Emerging / Rising (Sky Blue)
 * - 3-5 yrs: Experienced (Emerald Green)
 * - 5+ yrs: Master / Veteran (LSU Gold / Amber)
 */
function getExperienceBadge(years) {
  if (years <= 2) {
    return `
      <span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30" title="${years} years of professional experience">
        <span class="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
        Rising (${years} yrs)
      </span>
    `;
  } else if (years <= 5) {
    return `
      <span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" title="${years} years of professional experience">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        Experienced (${years} yrs)
      </span>
    `;
  } else {
    return `
      <span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-lsu-gold border border-lsu-gold/40" title="${years}+ years of professional experience">
        <span class="w-1.5 h-1.5 rounded-full bg-lsu-gold"></span>
        Master / Veteran (${years}+ yrs)
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
        <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400/90 text-slate-950 shadow-md backdrop-blur">
          ⚡ Same-Day
        </span>
      `;
    case 'open-this-week':
      return `
        <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/90 text-slate-950 shadow-md backdrop-blur">
          🟢 Open This Week
        </span>
      `;
    case 'bookings-open':
    default:
      return `
        <span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900/85 text-slate-200 border border-slate-700/80 shadow-md backdrop-blur">
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
      <span class="inline-flex items-center gap-1 text-[11px] font-heading font-bold px-2.5 py-1 rounded-full bg-lsu-purple/95 text-lsu-gold border border-lsu-gold/60 shadow-md shadow-purple-950/60 backdrop-blur">
        <span>🐯</span>
        <span>LSU Student-Owned</span>
      </span>
    `;
  } else if (verified === 'alumni') {
    return `
      <span class="inline-flex items-center gap-1 text-[11px] font-heading font-bold px-2.5 py-1 rounded-full bg-purple-900/95 text-purple-200 border border-purple-400/40 shadow-md shadow-purple-950/60 backdrop-blur">
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

  const expBadge = getExperienceBadge(provider.yearsExperience);
  const availBadge = getAvailabilityBadge(provider.availability);
  const lsuBadge = getLsuVerifiedBadge(provider.lsuVerified);
  
  // Calculate distance from LSU Memorial Tower
  const distance = calculateDistance(provider.latitude, provider.longitude);

  return `
    <article 
      class="group relative flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-lsu-gold/50 shadow-lg hover:shadow-2xl hover:shadow-purple-950/40 transition-all duration-300 overflow-hidden"
      data-provider-id="${provider.id}"
      data-category="${provider.category}"
      data-distance="${distance}"
    >
      <!-- 1. Portfolio Image Preview Container -->
      <div class="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden">
        <img 
          src="${primaryImage}" 
          alt="${provider.businessName} portfolio preview" 
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80';"
        />

        <!-- Top Badges Overlay -->
        <div class="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          <div class="flex flex-col gap-1 items-start">
            ${lsuBadge}
          </div>
          <div class="flex flex-col gap-1 items-end">
            ${availBadge}
          </div>
        </div>

        <!-- Bottom Gradient Shade & Category / Distance Tag -->
        <div class="absolute inset-x-0 bottom-0 pt-10 pb-2.5 px-3.5 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent flex items-center justify-between gap-2">
          <span class="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-900/90 text-lsu-gold border border-lsu-gold/30 backdrop-blur shrink-0">
            ${provider.category}
          </span>
          
          <!-- Distance from LSU Pill -->
          <span class="text-[11px] font-semibold text-slate-200 flex items-center gap-1 backdrop-blur px-2.5 py-0.5 rounded-md bg-slate-950/85 border border-slate-700/60 shadow-sm truncate" title="${provider.neighborhood} (${distance} miles from LSU)">
            <span class="text-lsu-gold">📍</span>
            <span class="truncate">${provider.neighborhood}</span>
            <span class="text-slate-500">&bull;</span>
            <span class="text-lsu-gold font-mono font-bold shrink-0">${distance} mi</span>
          </span>
        </div>
      </div>

      <!-- 2. Card Body Content -->
      <div class="flex flex-col flex-grow p-4 sm:p-5">
        
        <!-- Header: Business Name & Owner -->
        <div class="mb-2">
          <h3 class="text-lg font-heading font-bold text-white group-hover:text-lsu-gold transition-colors leading-snug">
            ${provider.businessName}
          </h3>
          <p class="text-xs text-slate-400 mt-0.5 font-medium">
            By <span class="text-slate-300">${provider.ownerName}</span>
          </p>
        </div>

        <!-- Rating, Reviews & Distance Indicator -->
        <div class="flex items-center justify-between mb-3 text-xs">
          <div class="flex items-center gap-1.5">
            <span class="text-amber-400 text-sm leading-none">★</span>
            <span class="font-bold text-white">${provider.averageRating.toFixed(1)}</span>
            <span class="text-slate-400 font-normal">(${provider.reviewCount} reviews)</span>
          </div>

          <!-- Distance from LSU Campus Center -->
          <div class="text-[11px] text-slate-400 font-mono flex items-center gap-1">
            <span class="text-lsu-gold">🐯</span>
            <span><strong class="text-slate-200">${distance} mi</strong> to LSU</span>
          </div>
        </div>

        <!-- Description Snippet -->
        <p class="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4 flex-grow">
          ${provider.description}
        </p>

        <!-- Pricing & Experience Strip -->
        <div class="flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-xs">
          <div>
            <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Pricing</span>
            <span class="font-bold text-white">
              From $${provider.startingPrice} <span class="text-lsu-gold font-mono ml-1">${provider.priceTier}</span>
            </span>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Experience</span>
            ${expBadge}
          </div>
        </div>

        <!-- Card Footer: Social Media Icon Buttons & Booking Action -->
        <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
          
          <!-- Social Media Icon Buttons -->
          <div class="flex items-center gap-1">
            <!-- Instagram Button -->
            <a 
              href="${provider.instagramUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-lsu-purple/50 border border-slate-700/60 hover:border-lsu-gold/50 flex items-center justify-center text-slate-300 hover:text-lsu-gold transition-colors"
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
              class="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-lsu-purple/50 border border-slate-700/60 hover:border-lsu-gold/50 flex items-center justify-center text-slate-300 hover:text-lsu-gold transition-colors"
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
              class="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-lsu-purple/50 border border-slate-700/60 hover:border-lsu-gold/50 flex items-center justify-center text-slate-300 hover:text-lsu-gold transition-colors"
              title="Visit Website (opens in new tab)"
              aria-label="${provider.businessName} Website"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>

          <!-- Primary Book Button -->
          <a 
            href="${provider.bookingUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="px-3.5 py-1.5 rounded-lg bg-lsu-gold hover:bg-lsu-gold-hover text-lsu-purple-dark font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1"
          >
            <span>Book</span>
            <svg class="w-3 h-3 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </a>

        </div>

      </div>
    </article>
  `;
}

export default createProviderCard;
