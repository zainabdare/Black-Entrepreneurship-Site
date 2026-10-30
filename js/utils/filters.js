/**
 * js/utils/filters.js
 * 
 * Re-exports filtering logic from src/utils/filters.js
 */

export * from '../../src/utils/filters.js';
import { filterProviders, matchesCategory, matchesSearch, matchesZone, matchesRadius, MAX_ALLOWED_RADIUS_MILES, CATEGORY_FILTERS, ZONE_FILTERS } from '../../src/utils/filters.js';
export { filterProviders, matchesCategory, matchesSearch, matchesZone, matchesRadius, MAX_ALLOWED_RADIUS_MILES, CATEGORY_FILTERS, ZONE_FILTERS };
export default filterProviders;
