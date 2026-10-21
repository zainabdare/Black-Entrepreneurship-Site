/**
 * js/utils/distance.js
 * Utility functions for geographic distance calculations around LSU.
 * 
 * BEGINNER GUIDE TO ES MODULES:
 * The 'export' keyword before a function makes it available for other files
 * to use. In another file (like js/app.js), you can write:
 *    import { calculateDistance, LSU_COORDINATES } from './utils/distance.js';
 */

// Coordinates for Louisiana State University (LSU Campus Center / Memorial Tower)
export const LSU_COORDINATES = {
  latitude: 30.4133,
  longitude: -91.1800,
  name: "LSU Memorial Tower, Baton Rouge, LA"
};

/**
 * Calculates the approximate distance in miles between two coordinates (Haversine formula).
 * 
 * @param {number} lat1 - Latitude of starting point
 * @param {number} lon1 - Longitude of starting point
 * @param {number} lat2 - Latitude of destination point (defaults to LSU)
 * @param {number} lon2 - Longitude of destination point (defaults to LSU)
 * @returns {number} Distance in miles (rounded to 1 decimal place)
 */
export function calculateDistance(lat1, lon1, lat2 = LSU_COORDINATES.latitude, lon2 = LSU_COORDINATES.longitude) {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const earthRadiusMiles = 3958.8; // Radius of Earth in miles

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusMiles * c;

  return Math.round(distance * 10) / 10;
}
