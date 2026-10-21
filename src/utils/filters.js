/**
 * src/utils/filters.js
 * 
 * Central filtering logic for Black-Owned BR service directory:
 * - Category matching
 * - Keyword search matching (name, category, description)
 * - Geographic radius filtering (Haversine formula from LSU)
 * - Quick-select zone filtering
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
 * Combined filter evaluating category, search query, radius limit, and zone.
 * 
 * @param {Array} providers - All provider objects
 * @param {Object} options - Filter criteria
 * @param {string} [options.searchQuery=''] - Keyword search
 * @param {string} [options.selectedCategory='All'] - Category selection
 * @param {number} [options.maxRadius=25] - Max driving radius from LSU (1 to 25)
 * @param {string} [options.selectedZone='all'] - Quick-select zone
 * @returns {Array} Filtered providers
 */
export function filterProviders(providers, {
  searchQuery = '',
  selectedCategory = 'All',
  maxRadius = 25,
  selectedZone = 'all'
} = {}) {
  if (!Array.isArray(providers)) {
    return [];
  }

  return providers.filter(provider => {
    // 1. Strict cap: Never show providers beyond 25 miles
    const dist = calculateDistance(provider.latitude, provider.longitude);
    if (dist > MAX_ALLOWED_RADIUS_MILES) {
      return false;
    }

    // 2. Radius Slider Check (1 to 25 miles)
    if (!matchesRadius(provider, maxRadius)) {
      return false;
    }

    // 3. Quick-Select Zone Check
    if (!matchesZone(provider, selectedZone)) {
      return false;
    }

    // 4. Category Check
    if (!matchesCategory(provider.category, selectedCategory)) {
      return false;
    }

    // 5. Keyword Search Check
    if (!matchesSearch(provider, searchQuery)) {
      return false;
    }

    return true;
  });
}

export default filterProviders;
