/**
 * src/utils/filters.js
 * 
 * Central filtering & sorting logic for Black-Owned BR service directory:
 * - Category matching
 * - Keyword search matching (name, category, description)
 * - Geographic radius filtering (Haversine formula from LSU)
 * - Quick-select zone filtering
 * - Shared filters: price tiers, max starting price, min rating, experience tiers,
 *   student discount toggle, service delivery, availability, and sorting
 * - Category-specific filters for Hair, Nails, Lashes, Food & Beverages, Fashion, Photography
 * 
 * Strict rule: NEVER returns providers beyond 25 miles from LSU.
 */

import { calculateDistance, LSU_COORDINATES } from './distance.js';

// Global maximum radius allowed
export const MAX_ALLOWED_RADIUS_MILES = 25;

// Category options
export const CATEGORY_FILTERS = [
  'All',
  'Hair',
  'Nails',
  'Lashes',
  'Food & Beverages',
  'Fashion',
  'Photography'
];

// Zone quick-select options
export const ZONE_FILTERS = [
  { id: 'all', label: 'All Baton Rouge (25 mi)' },
  { id: 'campus', label: 'North Gates / On-Campus (under 2 mi)' },
  { id: 'highland-burbank', label: 'Highland / Burbank' },
  { id: 'mid-city', label: 'Mid-City' },
  { id: 'downtown', label: 'Downtown' }
];

/**
 * Checks if a provider's category matches the active category filter.
 * 
 * @param {string} providerCategory - e.g. "Fashion (Custom Outfits)"
 * @param {string} selectedCategory - e.g. "Fashion" or "All"
 * @returns {boolean}
 */
export function matchesCategory(providerCategory, selectedCategory) {
  if (!selectedCategory || selectedCategory === 'All') {
    return true;
  }

  // Handle "Fashion" matching "Fashion (Custom Outfits)"
  if (selectedCategory === 'Fashion' && providerCategory.includes('Fashion')) {
    return true;
  }

  return providerCategory.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
}

/**
 * Checks if a provider matches a search query across business name, category, or description.
 * 
 * @param {Object} provider - Provider object
 * @param {string} query - Search query
 * @returns {boolean}
 */
export function matchesSearch(provider, query) {
  if (!query || !query.trim()) {
    return true;
  }

  const cleanQuery = query.toLowerCase().trim();

  const nameMatch = provider.businessName ? provider.businessName.toLowerCase().includes(cleanQuery) : false;
  const categoryMatch = provider.category ? provider.category.toLowerCase().includes(cleanQuery) : false;
  const descMatch = provider.description ? provider.description.toLowerCase().includes(cleanQuery) : false;

  return nameMatch || categoryMatch || descMatch;
}

/**
 * Checks if a provider matches a quick-select geographic zone.
 * 
 * @param {Object} provider - Provider record with coordinates and neighborhood
 * @param {string} zone - Zone id or label
 * @returns {boolean}
 */
export function matchesZone(provider, zone) {
  if (!zone || zone === 'all' || zone === 'All Baton Rouge (25 mi)') {
    return true;
  }

  const dist = calculateDistance(provider.latitude, provider.longitude);
  const neighborhood = (provider.neighborhood || '').toLowerCase();

  switch (zone) {
    case 'campus':
    case 'North Gates / On-Campus (under 2 mi)':
      return dist < 2.0;

    case 'highland-burbank':
    case 'Highland / Burbank':
      return neighborhood.includes('highland') || neighborhood.includes('burbank') || neighborhood.includes('tigerland');

    case 'mid-city':
    case 'Mid-City':
      return neighborhood.includes('mid city') || neighborhood.includes('garden district');

    case 'downtown':
    case 'Downtown':
      return neighborhood.includes('downtown');

    default:
      return true;
  }
}

/**
 * Checks if a provider is within the specified radius from LSU.
 * Enforces the strict rule that providers beyond 25 miles are NEVER shown.
 * 
 * @param {Object} provider - Provider object
 * @param {number} maxRadius - Maximum radius in miles (clamped to 25)
 * @returns {boolean}
 */
export function matchesRadius(provider, maxRadius = 25) {
  const dist = calculateDistance(provider.latitude, provider.longitude);

  // Strict rule: Never show providers beyond 25 miles
  if (dist > MAX_ALLOWED_RADIUS_MILES) {
    return false;
  }

  const effectiveRadius = Math.min(Number(maxRadius) || MAX_ALLOWED_RADIUS_MILES, MAX_ALLOWED_RADIUS_MILES);
  return dist <= effectiveRadius;
}

/**
 * Combined filter evaluating all shared and category-specific criteria, then sorting results.
 * 
 * @param {Array} providers - All provider objects
 * @param {Object} options - Filter criteria
 * @returns {Array} Filtered and sorted providers
 */
export function filterProviders(providers, {
  searchQuery = '',
  selectedCategory = 'All',
  maxRadius = 25,
  selectedZone = 'all',

  // Shared Filters
  priceTiers = [],              // Array of '$', '$$', '$$$'
  maxStartingPrice = null,      // Number or null
  minRating = 0,                // 0, 3, 4, 4.5
  experienceTiers = [],         // Array of '1-2', '3-5', '5+'
  studentDiscountOnly = false,  // Boolean
  serviceDelivery = 'all',      // 'all', 'mobile', 'studio'
  availabilities = [],          // Array of 'open-this-week', 'same-day', 'bookings-open'
  sortBy = 'rating',            // 'rating', 'distance', 'price', 'experience'

  // Category-Specific: Hair
  hairTypes = [],               // ['3A-3C', '4A-4C', 'Locs & Sisterlocks', 'Relaxed/Straight']
  hairSpecialties = [],         // ['knotless braids', 'wig installs', 'silk press', 'loc maintenance', 'hair included']
  chairVibes = [],              // ['home studio', 'travels to you', 'studio']

  // Category-Specific: Nails
  nailStyles = [],              // ['acrylic', 'gel-x', 'natural nail', 'press-ons', 'nail art']

  // Category-Specific: Lashes
  lashTypes = [],               // ['classic', 'hybrid', 'volume', 'mega volume']
  offersFillsOnly = false,      // Boolean

  // Category-Specific: Food & Beverages
  foodTypes = [],               // ['meals/plates', 'desserts/baked goods', 'drinks', 'catering']
  campusDropOffOnly = false,    // Boolean
  preOrderRequiredOnly = false, // Boolean

  // Category-Specific: Fashion
  outfitTypes = [],             // ['game day', 'formal/prom', 'graduation', 'everyday']
  turnarounds = [],             // ['this-week', '2-weeks', 'formal-ready']

  // Category-Specific: Photography
  shootTypes = [],              // ['graduation', 'game day', 'events', 'portraits', 'brand content']
  photoTurnarounds = [],        // ['this-week', '2-weeks', 'formal-ready']
  travelsToCampusOnly = false   // Boolean
} = {}) {
  if (!Array.isArray(providers)) {
    return [];
  }

  // 1. Filter matching providers
  const filtered = providers.filter(provider => {
    // Distance from LSU
    const dist = calculateDistance(provider.latitude, provider.longitude);

    // Strict cap: Never show providers beyond 25 miles
    if (dist > MAX_ALLOWED_RADIUS_MILES) {
      return false;
    }

    // Radius Limit (1 to 25 miles)
    if (!matchesRadius(provider, maxRadius)) {
      return false;
    }

    // Quick-Select Zone Check
    if (!matchesZone(provider, selectedZone)) {
      return false;
    }

    // Category Check
    if (!matchesCategory(provider.category, selectedCategory)) {
      return false;
    }

    // Keyword Search Check
    if (!matchesSearch(provider, searchQuery)) {
      return false;
    }

    // --- SHARED FILTERS ---

    // Price Tiers (e.g. '$', '$$', '$$$')
    if (priceTiers && priceTiers.length > 0) {
      if (!priceTiers.includes(provider.priceTier)) {
        return false;
      }
    }

    // Max Starting Price
    if (maxStartingPrice !== null && maxStartingPrice !== undefined && Number(maxStartingPrice) > 0) {
      if (provider.startingPrice > Number(maxStartingPrice)) {
        return false;
      }
    }

    // Minimum Rating (3+, 4+, 4.5+)
    if (minRating && Number(minRating) > 0) {
      if ((provider.averageRating || 0) < Number(minRating)) {
        return false;
      }
    }

    // Years of Experience Tier ('1-2', '3-5', '5+')
    if (experienceTiers && experienceTiers.length > 0) {
      const exp = provider.yearsExperience || 0;
      const matchesExp = experienceTiers.some(tier => {
        if (tier === '1-2') return exp >= 1 && exp <= 2;
        if (tier === '3-5') return exp >= 3 && exp <= 5;
        if (tier === '5+') return exp >= 5;
        return false;
      });
      if (!matchesExp) {
        return false;
      }
    }

    // Student Discount Toggle
    if (studentDiscountOnly) {
      if (!provider.studentDiscount) {
        return false;
      }
    }

    // Service Delivery ('mobile', 'studio', 'all')
    if (serviceDelivery && serviceDelivery !== 'all') {
      if (serviceDelivery === 'mobile') {
        // Mobile / Travels to Campus
        if (provider.serviceDelivery !== 'mobile' && provider.serviceDelivery !== 'both') {
          return false;
        }
      } else if (serviceDelivery === 'studio') {
        // Studio / Home Setup
        if (provider.serviceDelivery !== 'studio' && provider.serviceDelivery !== 'both') {
          return false;
        }
      }
    }

    // Availability ('open-this-week', 'same-day', 'bookings-open')
    if (availabilities && availabilities.length > 0) {
      if (!availabilities.includes(provider.availability)) {
        return false;
      }
    }

    // --- CATEGORY-SPECIFIC FILTERS ---

    // Hair: Hair Type & Texture
    if (hairTypes && hairTypes.length > 0) {
      if (!provider.hairTypes || !provider.hairTypes.some(t => hairTypes.includes(t))) {
        return false;
      }
    }

    // Hair: Specialties
    if (hairSpecialties && hairSpecialties.length > 0) {
      if (!provider.specialties || !provider.specialties.some(s => hairSpecialties.includes(s))) {
        return false;
      }
    }

    // Hair: Chair Vibe
    if (chairVibes && chairVibes.length > 0) {
      if (!provider.chairVibe || !chairVibes.includes(provider.chairVibe)) {
        return false;
      }
    }

    // Nails: Nail Style
    if (nailStyles && nailStyles.length > 0) {
      if (!provider.nailStyles || !provider.nailStyles.some(s => nailStyles.includes(s))) {
        return false;
      }
    }

    // Lashes: Lash Type
    if (lashTypes && lashTypes.length > 0) {
      if (!provider.lashTypes || !provider.lashTypes.some(t => lashTypes.includes(t))) {
        return false;
      }
    }

    // Lashes: Offers Fills
    if (offersFillsOnly) {
      if (!provider.offersFills) {
        return false;
      }
    }

    // Food & Beverages: Food Type
    if (foodTypes && foodTypes.length > 0) {
      if (!provider.foodTypes || !provider.foodTypes.some(t => foodTypes.includes(t))) {
        return false;
      }
    }

    // Food & Beverages: Campus Drop-off
    if (campusDropOffOnly) {
      if (!provider.campusDropOff) {
        return false;
      }
    }

    // Food & Beverages: Pre-order Required
    if (preOrderRequiredOnly) {
      if (!provider.preOrderRequired) {
        return false;
      }
    }

    // Fashion: Outfit Type
    if (outfitTypes && outfitTypes.length > 0) {
      if (!provider.outfitTypes || !provider.outfitTypes.some(o => outfitTypes.includes(o))) {
        return false;
      }
    }

    // Fashion: Turnaround
    if (turnarounds && turnarounds.length > 0) {
      if (!provider.turnaround || !turnarounds.includes(provider.turnaround)) {
        return false;
      }
    }

    // Photography: Shoot Type
    if (shootTypes && shootTypes.length > 0) {
      if (!provider.shootTypes || !provider.shootTypes.some(s => shootTypes.includes(s))) {
        return false;
      }
    }

    // Photography: Turnaround
    if (photoTurnarounds && photoTurnarounds.length > 0) {
      if (!provider.turnaround || !photoTurnarounds.includes(provider.turnaround)) {
        return false;
      }
    }

    // Photography: Travels to Campus
    if (travelsToCampusOnly) {
      if (!provider.travelsToCampus) {
        return false;
      }
    }

    return true;
  });

  // 2. Sort results
  return filtered.sort((a, b) => {
    switch (sortBy) {
      case 'distance': {
        const distA = calculateDistance(a.latitude, a.longitude);
        const distB = calculateDistance(b.latitude, b.longitude);
        return distA - distB;
      }
      case 'price':
        return (a.startingPrice || 0) - (b.startingPrice || 0);

      case 'experience':
        return (b.yearsExperience || 0) - (a.yearsExperience || 0);

      case 'rating':
      default: {
        const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
    }
  });
}

export default filterProviders;
