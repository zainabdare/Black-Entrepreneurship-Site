/**
 * src/utils/filters.js
 * 
 * Central filtering logic for the Black-Owned BR service directory.
 * 
 * BEGINNER GUIDE:
 * Storing filtering logic in a dedicated utility module keeps your code organized,
 * easy to test, and reusable across different UI components!
 */

// Supported category filter list
export const CATEGORY_FILTERS = [
  'All',
  'Hair',
  'Nails',
  'Lashes',
  'Food & Beverages',
  'Fashion',
  'Photography'
];

/**
 * Checks if a provider's category matches the selected category filter.
 * 
 * @param {string} providerCategory - Category from the provider record (e.g. "Fashion (Custom Outfits)")
 * @param {string} selectedCategory - Category selected by the user (e.g. "Fashion" or "All")
 * @returns {boolean} True if matching
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
 * @param {string} query - Raw search query string
 * @returns {boolean} True if matching
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
 * Filters an array of providers based on search query and category.
 * 
 * @param {Array} providers - List of all provider objects
 * @param {Object} options - Filter options
 * @param {string} [options.searchQuery=''] - Query to search in name, category, or description
 * @param {string} [options.selectedCategory='All'] - Category button selected
 * @returns {Array} Filtered list of provider objects
 */
export function filterProviders(providers, { searchQuery = '', selectedCategory = 'All' } = {}) {
  if (!Array.isArray(providers)) {
    return [];
  }

  return providers.filter(provider => {
    const categoryMatches = matchesCategory(provider.category, selectedCategory);
    const searchMatches = matchesSearch(provider, searchQuery);
    return categoryMatches && searchMatches;
  });
}

export default filterProviders;
