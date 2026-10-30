/**
 * src/utils/distance.js
 * 
 * Geographic distance calculations using the Haversine formula
 * centered on Louisiana State University (LSU Memorial Tower: 30.4133, -91.1800),
 * along with built-in Baton Rouge area ZIP codes within 25 miles of LSU
 * and automatic price tier calculation.
 */

// Coordinates for Louisiana State University (Memorial Tower)
export const LSU_COORDINATES = {
  latitude: 30.4133,
  longitude: -91.1800,
  name: "LSU Memorial Tower, Baton Rouge, LA"
};

// Built-in list of ZIP codes within 25 miles of LSU with approximate center coordinates
export const LSU_AREA_ZIP_CODES = {
  '70803': { name: 'LSU Campus', latitude: 30.4133, longitude: -91.1800 },
  '70802': { name: 'Central / Old South BR', latitude: 30.4350, longitude: -91.1730 },
  '70808': { name: 'South Baton Rouge / Perkins', latitude: 30.4120, longitude: -91.1430 },
  '70801': { name: 'Downtown Baton Rouge', latitude: 30.4510, longitude: -91.1870 },
  '70820': { name: 'LSU South / River Road', latitude: 30.3700, longitude: -91.1850 },
  '70767': { name: 'Port Allen', latitude: 30.4530, longitude: -91.2100 },
  '70806': { name: 'Mid-City / Capital Heights', latitude: 30.4480, longitude: -91.1400 },
  '70722': { name: 'Brusly', latitude: 30.3890, longitude: -91.2380 },
  '70805': { name: 'North Baton Rouge / Istrouma', latitude: 30.4850, longitude: -91.1470 },
  '70809': { name: 'Bocage / Jefferson Hwy', latitude: 30.4050, longitude: -91.0900 },
  '70810': { name: 'Highland / Burbank / Bluebonnet', latitude: 30.3550, longitude: -91.1050 },
  '70710': { name: 'Addis', latitude: 30.3560, longitude: -91.2630 },
  '70812': { name: 'North BR / Airline Hwy', latitude: 30.5050, longitude: -91.1350 },
  '70815': { name: 'Broadmoor / Sherwood Forest', latitude: 30.4420, longitude: -91.0650 },
  '70814': { name: 'Cortana / Florida Blvd', latitude: 30.4720, longitude: -91.0770 },
  '70811': { name: 'Scotlandville / Southern Univ', latitude: 30.5250, longitude: -91.1680 },
  '70816': { name: 'Shenandoah / Coursey Blvd', latitude: 30.4080, longitude: -91.0250 },
  '70776': { name: 'Plaquemine', latitude: 30.2880, longitude: -91.2340 },
  '70817': { name: 'Shenandoah / South BR', latitude: 30.3780, longitude: -91.0000 },
  '70819': { name: 'Greenwell Springs / Central', latitude: 30.4950, longitude: -91.0200 },
  '70774': { name: 'St. Gabriel', latitude: 30.2580, longitude: -91.1000 },
  '70714': { name: 'Baker', latitude: 30.5880, longitude: -91.1690 },
  '70818': { name: 'Central', latitude: 30.5350, longitude: -91.0300 },
  '70726': { name: 'Denham Springs', latitude: 30.4850, longitude: -90.9600 },
  '70739': { name: 'Greenwell Springs', latitude: 30.5400, longitude: -90.9800 },
  '70769': { name: 'Prairieville', latitude: 30.3050, longitude: -90.9650 },
  '70729': { name: 'Carville / St. Gabriel', latitude: 30.2050, longitude: -91.1150 },
  '70777': { name: 'Rosedale / Grosse Tete', latitude: 30.4480, longitude: -91.4500 },
  '70791': { name: 'Zachary', latitude: 30.6480, longitude: -91.1560 },
  '70788': { name: 'White Castle', latitude: 30.1650, longitude: -91.1500 },
  '70734': { name: 'Geismar', latitude: 30.2280, longitude: -90.9850 },
  '70785': { name: 'Walker', latitude: 30.4900, longitude: -90.8650 },
  '70737': { name: 'Gonzales', latitude: 30.2380, longitude: -90.9200 },
  '70770': { name: 'Pride', latitude: 30.7020, longitude: -90.9900 }
};

/**
 * Calculates the approximate distance in miles between two coordinates using Haversine formula.
 * 
 * @param {number} lat1 - Starting latitude
 * @param {number} lon1 - Starting longitude
 * @param {number} [lat2=LSU_COORDINATES.latitude] - Destination latitude (defaults to LSU)
 * @param {number} [lon2=LSU_COORDINATES.longitude] - Destination longitude (defaults to LSU)
 * @returns {number} Distance in miles rounded to 1 decimal place
 */
export function calculateDistance(lat1, lon1, lat2 = LSU_COORDINATES.latitude, lon2 = LSU_COORDINATES.longitude) {
  if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || isNaN(lat1) || isNaN(lon1)) {
    return 0;
  }

  const toRadians = (deg) => (deg * Math.PI) / 180;
  const earthRadiusMiles = 3958.8; // Earth's mean radius in miles

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

/**
 * Looks up a 5-digit ZIP code in the built-in LSU 25-mile area database.
 * 
 * @param {string|number} zip 
 * @returns {{ valid: boolean, zip: string, name?: string, latitude?: number, longitude?: number, distance?: number, within25Miles: boolean }}
 */
export function getZipCodeInfo(zip) {
  const cleanZip = String(zip || '').trim().replace(/\D/g, '').slice(0, 5);
  const entry = LSU_AREA_ZIP_CODES[cleanZip];

  if (entry) {
    const dist = calculateDistance(entry.latitude, entry.longitude);
    return {
      valid: true,
      zip: cleanZip,
      name: entry.name,
      latitude: entry.latitude,
      longitude: entry.longitude,
      distance: dist,
      within25Miles: dist <= 25.0
    };
  }

  return {
    valid: false,
    zip: cleanZip,
    within25Miles: false
  };
}

/**
 * Calculates a provider's distance from LSU from coordinates or ZIP code.
 * 
 * @param {Object|string|number} providerOrZip 
 * @returns {number} Distance in miles rounded to 1 decimal place
 */
export function getDistanceFromLSU(providerOrZip) {
  if (!providerOrZip) return 0;

  if (typeof providerOrZip === 'string' || typeof providerOrZip === 'number') {
    const info = getZipCodeInfo(providerOrZip);
    return info.valid ? (info.distance || 0) : 0;
  }

  if (typeof providerOrZip.latitude === 'number' && typeof providerOrZip.longitude === 'number') {
    return calculateDistance(providerOrZip.latitude, providerOrZip.longitude);
  }

  if (providerOrZip.zipCode || providerOrZip.zip) {
    const info = getZipCodeInfo(providerOrZip.zipCode || providerOrZip.zip);
    if (info.valid) return info.distance || 0;
  }

  return 0;
}

/**
 * Computes price tier ($, $$, $$$) automatically from a starting price.
 * 
 * @param {number|string} startingPrice - Starting price in dollars
 * @returns {'$'|'$$'|'$$$'}
 */
export function getPriceTier(startingPrice) {
  const price = Number(startingPrice) || 0;
  if (price < 50) return '$';
  if (price <= 125) return '$$';
  return '$$$';
}

export default calculateDistance;
