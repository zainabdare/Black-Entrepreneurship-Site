/**
 * js/app.js
 * Main JavaScript controller for SETLIST Marketplace.
 * 
 * Features:
 * - Dynamic rendering of providers via ProviderCard component
 * - Category page detection (supports dedicated category pages with unique URLs)
 * - Slide-out navigation side menu (opens via top-corner hamburger, closes on link click or outside tap)
 * - Category filter panel with mobile drawer & desktop collapsible dashboard
 * - Real-time keyword search with cross-page routing from Home
 * - Shared filters: Location radius (1-25 mi), LSU zones, price tiers, max starting price,
 *   minimum rating, years of experience, student discount toggle, service delivery, availability, and sorting
 * - Category-specific filters for Hair, Nails, Lashes, Food & Beverages, Fashion, Photography
 * - Clear filters button and dynamic result count
 */

import { getProvidersFromFirestore, getAllRatingsFromFirestore, trackLinkClick } from './firebase.js';
import { SAMPLE_PROVIDERS } from './data/providers.js';
import { createProviderCard } from './components/ProviderCard.js';
import { filterProviders, MAX_ALLOWED_RADIUS_MILES } from './utils/filters.js';
import { calculateDistance, LSU_COORDINATES } from './utils/distance.js';
import { injectNavigationDrawer } from './components/NavigationDrawer.js';
import { injectFilterPanel } from './components/FilterPanel.js';
import { openProviderDetailModal, closeProviderDetailModal, closePhotoLightbox } from './components/ProviderDetailModal.js';
import { injectImpactCounter } from './components/ImpactCounter.js';

console.log('%cSETLIST Marketplace: Multi-page & Filter Panel Active', 'color: #FDD023; background: #4A1C24; font-size: 14px; padding: 4px 8px; border-radius: 4px;');

// Master provider records loaded from Firestore (falls back to sample providers if Firestore collection is empty or API pending)
export let allProviders = [];
export let isProvidersLoading = true;
export let firestoreLoadStatus = 'loading'; // 'firestore' | 'offline' | 'empty'

// Detect if current page is dedicated to a specific category
const pageCategory = document.body.dataset.category || 'All';
const isDedicatedCategoryPage = pageCategory !== 'All';

// ---------------------------------------------------------------------------
// 1. Application Filter State
// ---------------------------------------------------------------------------
export const appState = {
  selectedCategory: pageCategory,
  searchQuery: '',
  locationFilter: 'all',        // 'all', 'on-campus', 'off-campus'
  maxRadius: 25,
  selectedZone: 'all',

  // Shared Filters
  priceTiers: [],              // ['$', '$$', '$$$']
  maxStartingPrice: null,      // Number or null
  minRating: 0,                // 0, 3, 4, 4.5
  experienceTiers: [],         // ['1-2', '3-5', '5+']
  studentDiscountOnly: false,  // Boolean
  serviceDelivery: 'all',      // 'all', 'mobile', 'studio'
  availabilities: [],          // ['open-this-week', 'same-day', 'bookings-open']
  sortBy: 'rating',            // 'rating', 'distance', 'price', 'experience'

  // Hair Specific
  hairTypes: [],
  hairSpecialties: [],
  chairVibes: [],

  // Nails Specific
  nailStyles: [],

  // Lashes Specific
  lashTypes: [],
  offersFillsOnly: false,

  // Food & Beverages Specific
  foodTypes: [],
  campusDropOffOnly: false,
  preOrderRequiredOnly: false,

  // Fashion Specific
  outfitTypes: [],
  turnarounds: [],

  // Photography Specific
  shootTypes: [],
  photoTurnarounds: [],
  travelsToCampusOnly: false
};

/**
 * Calculates the number of non-default active filters.
 * 
 * @returns {number}
 */
export function getActiveFilterCount() {
  let count = 0;
  if (appState.locationFilter && appState.locationFilter !== 'all') count++;
  if (appState.maxStartingPrice !== null && appState.maxStartingPrice < 250) count++;
  if (appState.minRating > 0) count++;
  if (appState.studentDiscountOnly) count++;
  if (appState.serviceDelivery !== 'all') count++;

  // Hair
  if (appState.hairSpecialties.length > 0) count += appState.hairSpecialties.length;
  if (appState.chairVibes.length > 0) count += appState.chairVibes.length;

  // Nails
  if (appState.nailStyles.length > 0) count += appState.nailStyles.length;

  // Lashes
  if (appState.lashTypes.length > 0) count += appState.lashTypes.length;
  if (appState.offersFillsOnly) count++;

  // Food
  if (appState.foodTypes.length > 0) count += appState.foodTypes.length;
  if (appState.campusDropOffOnly) count++;
  if (appState.preOrderRequiredOnly) count++;

  // Fashion
  if (appState.outfitTypes.length > 0) count += appState.outfitTypes.length;
  if (appState.turnarounds.length > 0) count += appState.turnarounds.length;

  // Photography
  if (appState.shootTypes.length > 0) count += appState.shootTypes.length;
  if (appState.photoTurnarounds.length > 0) count += appState.photoTurnarounds.length;
  if (appState.travelsToCampusOnly) count++;

  return count;
}

/**
 * Updates filter badge counts and toggles "Clear Filters" visibility.
 */
function updateActiveFilterBadges() {
  const count = getActiveFilterCount();
  const badge = document.getElementById('active-filter-badge');
  const mobileBadge = document.getElementById('mobile-filter-badge');
  const clearBtn = document.getElementById('clear-filters-btn-bar');

  if (badge) {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  if (mobileBadge) {
    mobileBadge.textContent = count;
    if (count > 0) {
      mobileBadge.classList.remove('hidden');
    } else {
      mobileBadge.classList.add('hidden');
    }
  }

  if (clearBtn) {
    if (count > 0 || appState.searchQuery) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }
}

/**
 * Renders pulse loading skeleton cards inside the directory grid.
 * 
 * @param {HTMLElement} gridElement 
 */
export function renderProvidersSkeleton(gridElement) {
  if (!gridElement) return;
  const skeletonCard = `
    <div class="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-lg animate-pulse flex flex-col h-full">
      <div class="h-48 sm:h-52 bg-slate-800/70 w-full relative">
        <div class="absolute top-3 left-3 w-20 h-5 bg-slate-700/60 rounded-full"></div>
        <div class="absolute top-3 right-3 w-16 h-5 bg-slate-700/60 rounded-full"></div>
      </div>
      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="h-5 bg-slate-700/60 rounded w-3/4"></div>
          <div class="h-3.5 bg-slate-800/80 rounded w-full"></div>
          <div class="h-3.5 bg-slate-800/80 rounded w-2/3"></div>
        </div>
        <div class="flex gap-2 pt-2">
          <div class="h-6 bg-slate-800/80 rounded-full w-20"></div>
          <div class="h-6 bg-slate-800/80 rounded-full w-24"></div>
        </div>
        <div class="pt-4 border-t border-slate-800/60 flex justify-between items-center">
          <div class="h-7 bg-slate-800/80 rounded w-20"></div>
          <div class="h-7 bg-slate-700/60 rounded w-24"></div>
        </div>
      </div>
    </div>
  `;
  gridElement.innerHTML = Array(6).fill(skeletonCard).join('');
}

/**
 * Asynchronously loads provider documents from Cloud Firestore "providers" collection.
 * If the collection is empty or the API is not yet activated in the Firebase Console,
 * it falls back to SAMPLE_PROVIDERS.
 */
export async function loadProvidersData() {
  const gridElement = document.getElementById('providers-grid');
  isProvidersLoading = true;
  if (gridElement) {
    renderProvidersSkeleton(gridElement);
  }

  try {
    console.log('%cSETLIST Marketplace: Querying Cloud Firestore "providers" collection...', 'color: #FDD023; background: #4A1C24; font-weight: bold; padding: 2px 6px;');
    const firestoreDocs = await getProvidersFromFirestore();

    if (Array.isArray(firestoreDocs) && firestoreDocs.length > 0) {
      console.log(`%cFirestore Connected! Successfully loaded ${firestoreDocs.length} providers from collection "providers".`, 'color: #10B981; font-weight: bold;');
      allProviders = firestoreDocs;
      firestoreLoadStatus = 'firestore';
    } else {
      console.warn('Cloud Firestore "providers" collection is currently empty. Serving sample providers.');
      allProviders = SAMPLE_PROVIDERS;
      firestoreLoadStatus = 'empty';
    }
  } catch (error) {
    console.warn('Cloud Firestore not reachable (database may need to be created in Firebase Console). Serving local sample providers:', error.message);
    allProviders = SAMPLE_PROVIDERS;
    firestoreLoadStatus = 'offline';
  }

  // Calculate real averageRating and ratingCount from Firestore "ratings" collection
  // Ignore fake sample rating numbers
  allProviders.forEach(p => {
    p.averageRating = null;
    p.ratingCount = 0;
    p.reviewCount = 0;
    p.ratings = [];
  });

  try {
    const realRatings = await getAllRatingsFromFirestore();
    if (Array.isArray(realRatings) && realRatings.length > 0) {
      console.log(`%cLoaded ${realRatings.length} real ratings from Firestore "ratings" collection.`, 'color: #10B981;');
      const ratingsByProvider = {};
      realRatings.forEach(r => {
        if (!r.providerId) return;
        if (!ratingsByProvider[r.providerId]) ratingsByProvider[r.providerId] = [];
        ratingsByProvider[r.providerId].push(r);
      });

      allProviders.forEach(p => {
        const list = ratingsByProvider[p.id];
        if (list && list.length > 0) {
          p.ratings = list;
          p.ratingCount = list.length;
          p.reviewCount = list.length;
          const sum = list.reduce((acc, r) => acc + Number(r.overall || r.rating || 5), 0);
          p.averageRating = Number((sum / list.length).toFixed(1));
        }
      });
    } else {
      console.log('No ratings yet in Firestore "ratings" collection. Providers will display "No ratings yet".');
    }
  } catch (ratingsErr) {
    console.warn('Could not load real ratings from Firestore:', ratingsErr);
  } finally {
    isProvidersLoading = false;
    updateDirectory();
    if (document.getElementById('community-impact-mount')) {
      injectImpactCounter('community-impact-mount', allProviders);
    }
  }
}

/**
 * Updates the directory grid and status indicators according to current filter state.
 */
export function updateDirectory() {
  const gridElement = document.getElementById('providers-grid');
  const countElement = document.getElementById('results-count');
  const radiusDisplay = document.getElementById('filter-radius-display') || document.getElementById('radius-value-display');
  const priceDisplay = document.getElementById('filter-price-display');

  if (!gridElement) return;

  // Update results counter text with source indicator (Never shows a count, even after filtering)
  if (countElement) {
    const activeCat = (appState.selectedCategory && appState.selectedCategory !== 'All')
      ? appState.selectedCategory
      : (pageCategory !== 'All' ? pageCategory : '');
    const displayCategory = activeCat
      ? (activeCat.startsWith('Fashion') ? ' in Fashion' : ` in ${activeCat}`)
      : '';
    const sourceBadge = firestoreLoadStatus === 'firestore'
      ? `<span class="ml-2 inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" title="Data loaded live from Cloud Firestore 'providers' collection"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Firestore</span>`
      : '';
    countElement.innerHTML = `Showing providers${displayCategory}${sourceBadge}`;
  }

  // If still loading from Firestore, show skeleton loader
  if (isProvidersLoading) {
    renderProvidersSkeleton(gridElement);
    return;
  }

  // Update slider displays
  if (radiusDisplay) {
    radiusDisplay.textContent = `${appState.maxRadius} mi`;
  }
  if (priceDisplay) {
    priceDisplay.textContent = appState.maxStartingPrice && appState.maxStartingPrice < 250
      ? `$${appState.maxStartingPrice} max`
      : 'Any ($250+)';
  }

  // Filter providers from active list (Firestore data, or fallback if uninitialized)
  const filtered = filterProviders(allProviders, appState);

  // Update active filter badge & clear button
  updateActiveFilterBadges();

  // Handle empty state: "No providers found"
  if (filtered.length === 0) {
    gridElement.innerHTML = `
      <div class="col-span-full py-14 px-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center shadow-lg">
        <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-lsu-purple/30 border border-lsu-gold/30 flex items-center justify-center text-lsu-gold shadow-inner">
          <svg class="w-6 h-6 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h4 class="text-lg sm:text-xl font-heading font-bold text-white">
          No providers found
        </h4>
        <p class="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
          No businesses found matching your active filter criteria
          ${appState.searchQuery ? ` for "<strong class="text-white">${appState.searchQuery}</strong>"` : ''}
          ${appState.selectedCategory !== 'All' ? ` under <strong class="text-lsu-gold">${appState.selectedCategory}</strong>` : ''}
          within <strong class="text-lsu-gold">${appState.maxRadius} miles</strong> of LSU.
        </p>
        <button 
          id="empty-reset-filters-btn"
          type="button" 
          class="mt-6 px-5 py-2.5 rounded-xl bg-lsu-gold hover:bg-lsu-gold-hover text-lsu-purple-dark font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Reset All Filters</span>
          <span>&times;</span>
        </button>
      </div>
    `;

    const resetBtn = document.getElementById('empty-reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetAllFilters();
      });
    }
    return;
  }

  // Render provider cards
  gridElement.innerHTML = filtered.map(provider => createProviderCard(provider)).join('');

  // Attach Provider Detail Modal triggers
  attachProviderModalTriggers(gridElement);
}

/**
 * Attaches click event listeners to provider cards to open the Provider Detail Modal.
 * 
 * @param {HTMLElement} container 
 */
export function attachProviderModalTriggers(container = document) {
  container.querySelectorAll('.open-provider-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If clicking inside an external link icon, let the link open and do not trigger modal
      if (e.target.closest('a') || e.target.closest('[data-track-type]')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const providerId = btn.dataset.providerId;
      const provider = allProviders.find(p => p.id === providerId);
      if (provider) {
        openProviderDetailModal(provider, (updatedId, newRating, newCount) => {
          const target = allProviders.find(p => p.id === updatedId);
          if (target) {
            target.averageRating = newRating;
            target.ratingCount = newCount;
            target.reviewCount = newCount;
            updateDirectory();
          }
        });
      }
    });
  });
}

/**
 * Resets all filters back to default.
 */
export function resetAllFilters() {
  appState.selectedCategory = pageCategory;
  appState.searchQuery = '';
  appState.locationFilter = 'all';
  appState.maxRadius = 25;
  appState.selectedZone = 'all';

  appState.priceTiers = [];
  appState.maxStartingPrice = null;
  appState.minRating = 0;
  appState.experienceTiers = [];
  appState.studentDiscountOnly = false;
  appState.serviceDelivery = 'all';
  appState.availabilities = [];
  appState.sortBy = 'rating';

  appState.hairTypes = [];
  appState.hairSpecialties = [];
  appState.chairVibes = [];
  appState.nailStyles = [];
  appState.lashTypes = [];
  appState.offersFillsOnly = false;
  appState.foodTypes = [];
  appState.campusDropOffOnly = false;
  appState.preOrderRequiredOnly = false;
  appState.outfitTypes = [];
  appState.turnarounds = [];
  appState.shootTypes = [];
  appState.photoTurnarounds = [];
  appState.travelsToCampusOnly = false;

  // Reset Input Elements
  const searchInput = document.getElementById('hero-search-input');
  if (searchInput) searchInput.value = '';

  const priceSlider = document.getElementById('filter-max-price');
  if (priceSlider) priceSlider.value = '250';
  const priceDisplay = document.getElementById('filter-price-display');
  if (priceDisplay) priceDisplay.textContent = 'Any ($250+)';

  const sortSelect = document.getElementById('sort-by-select');
  if (sortSelect) sortSelect.value = 'rating';

  const hairSpecialtySelect = document.getElementById('filter-hair-specialty-select');
  if (hairSpecialtySelect) hairSpecialtySelect.value = '';

  // Reset Location Pills
  document.querySelectorAll('.location-pill').forEach(pill => {
    const isAll = pill.dataset.location === 'all';
    pill.classList.toggle('bg-[#E9C6CC]', isAll);
    pill.classList.toggle('text-[#4A1C24]', isAll);
    pill.classList.toggle('font-bold', isAll);
    pill.classList.toggle('border-[#D4A7B0]', isAll);
    pill.classList.toggle('bg-white', !isAll);
    pill.classList.toggle('border-[#EAD5C0]', !isAll);
  });

  // Reset checkboxes
  const studentDiscountCb = document.getElementById('filter-student-discount');
  if (studentDiscountCb) studentDiscountCb.checked = false;

  const offersFillsCb = document.getElementById('filter-offers-fills');
  if (offersFillsCb) offersFillsCb.checked = false;

  const campusDropoffCb = document.getElementById('filter-campus-dropoff');
  if (campusDropoffCb) campusDropoffCb.checked = false;

  const preorderCb = document.getElementById('filter-preorder-required');
  if (preorderCb) preorderCb.checked = false;

  const travelsCampusCb = document.getElementById('filter-travels-campus');
  if (travelsCampusCb) travelsCampusCb.checked = false;

  // Reset radios
  const allDeliveryRadio = document.querySelector('input[name="service-delivery-radio"][value="all"]');
  if (allDeliveryRadio) allDeliveryRadio.checked = true;

  // Reset pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.remove('active-filter', 'bg-[#E9C6CC]', 'text-[#4A1C24]', 'font-bold', 'border-[#D4A7B0]', 'bg-lsu-gold', 'text-lsu-purple-dark', 'border-lsu-gold', 'shadow-sm', 'shadow-lsu-gold/20');
    pill.classList.add('bg-white', 'border-[#EAD5C0]', 'text-[#4A1C24]');
  });

  document.querySelectorAll('.rating-pill').forEach(pill => {
    const isZero = pill.dataset.rating === '0';
    pill.classList.toggle('bg-[#E9C6CC]', isZero);
    pill.classList.toggle('text-[#4A1C24]', isZero);
    pill.classList.toggle('font-bold', isZero);
    pill.classList.toggle('border-[#D4A7B0]', isZero);
    pill.classList.toggle('bg-white', !isZero);
    pill.classList.toggle('border-[#EAD5C0]', !isZero);
  });

  updateDirectory();
}

// ---------------------------------------------------------------------------
// 2. Filter Panel Toggle & Drawer Controls
// ---------------------------------------------------------------------------
export function openFilterPanel() {
  const isMobile = window.innerWidth < 768;
  const panel = document.getElementById('filter-panel');
  const backdrop = document.getElementById('filter-backdrop');
  const toggleBtn = document.getElementById('toggle-filters-btn');

  if (isMobile) {
    document.body.classList.add('filter-drawer-open');
    if (backdrop) backdrop.classList.remove('hidden');
  } else {
    if (panel) {
      panel.classList.toggle('md:hidden');
      const isOpen = !panel.classList.contains('md:hidden');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
        toggleBtn.classList.toggle('bg-[#351218]', isOpen);
        toggleBtn.classList.toggle('shadow-inner', isOpen);
      }
    }
  }
}

export function closeFilterPanel() {
  document.body.classList.remove('filter-drawer-open');
  const backdrop = document.getElementById('filter-backdrop');
  if (backdrop) backdrop.classList.add('hidden');
  const panel = document.getElementById('filter-panel');
  if (panel && window.innerWidth >= 768) {
    panel.classList.add('md:hidden');
  }
  const toggleBtn = document.getElementById('toggle-filters-btn');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.classList.remove('bg-[#351218]', 'shadow-inner');
  }
}

// ---------------------------------------------------------------------------
// 3. Navigation Drawer Controls
// ---------------------------------------------------------------------------
export function openMenu() {
  document.body.classList.add('menu-open');
  const backdrop = document.getElementById('menu-backdrop');
  if (backdrop) backdrop.classList.remove('hidden');
  const btn = document.getElementById('hamburger-btn');
  if (btn) btn.setAttribute('aria-expanded', 'true');
}

export function closeMenu() {
  document.body.classList.remove('menu-open');
  const backdrop = document.getElementById('menu-backdrop');
  if (backdrop) backdrop.classList.add('hidden');
  const btn = document.getElementById('hamburger-btn');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

// ---------------------------------------------------------------------------
// 4. Attach Filter Panel Listeners
// ---------------------------------------------------------------------------
function attachFilterListeners() {
  // Toggle Filters Button
  const toggleBtn = document.getElementById('toggle-filters-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openFilterPanel();
    });
  }

  // Mobile Close Drawer Button
  const closeDrawerBtn = document.getElementById('close-filter-drawer-btn');
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => {
      closeFilterPanel();
    });
  }

  // Mobile Backdrop Tap
  const filterBackdrop = document.getElementById('filter-backdrop');
  if (filterBackdrop) {
    filterBackdrop.addEventListener('click', () => {
      closeFilterPanel();
    });
  }

  // Mobile Apply Filters Button
  const applyBtn = document.getElementById('apply-filters-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      closeFilterPanel();
      const grid = document.getElementById('providers-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Desktop Collapse Button
  const collapseBtn = document.getElementById('collapse-panel-btn');
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      closeFilterPanel();
    });
  }

  // Clear Filters Buttons
  const clearBtnBar = document.getElementById('clear-filters-btn-bar');
  if (clearBtnBar) {
    clearBtnBar.addEventListener('click', () => resetAllFilters());
  }

  const clearBtnPanel = document.getElementById('clear-filters-btn-panel');
  if (clearBtnPanel) {
    clearBtnPanel.addEventListener('click', () => resetAllFilters());
  }

  // Location Pills (All, On Campus, Off Campus)
  const locationPills = document.querySelectorAll('.location-pill');
  locationPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const loc = pill.dataset.location;
      if (loc) {
        appState.locationFilter = loc;
        locationPills.forEach(p => {
          const isSelected = p.dataset.location === loc;
          p.classList.toggle('bg-[#E9C6CC]', isSelected);
          p.classList.toggle('text-[#4A1C24]', isSelected);
          p.classList.toggle('font-bold', isSelected);
          p.classList.toggle('border-[#D4A7B0]', isSelected);
          p.classList.toggle('bg-white', !isSelected);
          p.classList.toggle('border-[#EAD5C0]', !isSelected);
        });
        updateDirectory();
      }
    });
  });

  // Hair Specialty Dropdown
  const hairSpecialtySelect = document.getElementById('filter-hair-specialty-select');
  if (hairSpecialtySelect) {
    hairSpecialtySelect.addEventListener('change', (e) => {
      const val = e.target.value;
      appState.hairSpecialties = val ? [val] : [];
      updateDirectory();
    });
  }

  // Price Slider
  const priceSlider = document.getElementById('filter-max-price');
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      appState.maxStartingPrice = val >= 250 ? null : val;
      updateDirectory();
    });
  }

  // Rating Pills
  const ratingPills = document.querySelectorAll('.rating-pill');
  ratingPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const rating = Number(pill.dataset.rating) || 0;
      appState.minRating = rating;
      ratingPills.forEach(p => {
        const isSelected = Number(p.dataset.rating) === rating;
        p.classList.toggle('bg-[#E9C6CC]', isSelected);
        p.classList.toggle('text-[#4A1C24]', isSelected);
        p.classList.toggle('font-bold', isSelected);
        p.classList.toggle('border-[#D4A7B0]', isSelected);
        p.classList.toggle('bg-white', !isSelected);
        p.classList.toggle('border-[#EAD5C0]', !isSelected);
      });
      updateDirectory();
    });
  });

  // Service Delivery Radio
  const deliveryRadios = document.querySelectorAll('input[name="service-delivery-radio"]');
  deliveryRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      appState.serviceDelivery = e.target.value;
      updateDirectory();
    });
  });

  // Sort Dropdown
  const sortSelect = document.getElementById('sort-by-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      appState.sortBy = e.target.value;
      updateDirectory();
    });
  }

  // Generic Multi-Select Filter Pills (nailStyles, lashTypes, foodTypes, outfitTypes, chairVibes, turnarounds, etc.)
  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filterKey = pill.dataset.filter;
      const filterVal = pill.dataset.value;

      if (filterKey && filterVal && Array.isArray(appState[filterKey])) {
        const arr = appState[filterKey];
        const idx = arr.indexOf(filterVal);
        const isSelected = idx > -1;

        if (isSelected) {
          arr.splice(idx, 1);
          pill.classList.remove('active-filter', 'bg-[#E9C6CC]', 'text-[#4A1C24]', 'font-bold', 'border-[#D4A7B0]');
          pill.classList.add('bg-white', 'border-[#EAD5C0]', 'text-[#4A1C24]');
        } else {
          arr.push(filterVal);
          pill.classList.add('active-filter', 'bg-[#E9C6CC]', 'text-[#4A1C24]', 'font-bold', 'border-[#D4A7B0]');
          pill.classList.remove('bg-white', 'border-[#EAD5C0]');
        }

        updateDirectory();
      }
    });
  });

  // Checkbox Filters
  const bindCheckbox = (id, stateKey) => {
    const cb = document.getElementById(id);
    if (cb) {
      cb.addEventListener('change', (e) => {
        appState[stateKey] = e.target.checked;
        updateDirectory();
      });
    }
  };

  bindCheckbox('filter-student-discount', 'studentDiscountOnly');
  bindCheckbox('filter-offers-fills', 'offersFillsOnly');
  bindCheckbox('filter-campus-dropoff', 'campusDropOffOnly');
  bindCheckbox('filter-preorder-required', 'preOrderRequiredOnly');
  bindCheckbox('filter-travels-campus', 'travelsToCampusOnly');
}

// ---------------------------------------------------------------------------
// 5. Document Ready Initialization
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject slide-out side navigation drawer and backdrop
  injectNavigationDrawer();

  // 2. Read URL search parameters (for cross-page search navigation)
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  const searchInput = document.getElementById('hero-search-input');
  if (searchParam && searchInput) {
    searchInput.value = searchParam;
    appState.searchQuery = searchParam;
  }

  // 3. Inject Filter Panel on dedicated category pages
  if (isDedicatedCategoryPage && document.getElementById('filter-panel-mount')) {
    injectFilterPanel(pageCategory, updateDirectory);
    attachFilterListeners();
  }

  // 3b. Inject Community Impact Counter Section (on Home page)
  if (document.getElementById('community-impact-mount')) {
    injectImpactCounter('community-impact-mount', SAMPLE_PROVIDERS);
  }

  // 3c. Pause category banner marquee on mobile touch
  document.querySelectorAll('.category-marquee-wrapper').forEach(wrapper => {
    wrapper.addEventListener('touchstart', () => {
      wrapper.classList.add('is-paused');
    }, { passive: true });
    wrapper.addEventListener('touchend', () => {
      setTimeout(() => wrapper.classList.remove('is-paused'), 1000);
    }, { passive: true });
  });

  // 3d. Global External Link Click Tracking (Instagram, TikTok, Website, Booking)
  document.addEventListener('click', (e) => {
    const trackTarget = e.target.closest('[data-track-type]');
    if (trackTarget) {
      const providerId = trackTarget.dataset.trackProvider || '';
      const trackType = trackTarget.dataset.trackType || 'link';
      const href = trackTarget.getAttribute('href') || '';
      trackLinkClick(providerId, trackType, href);
    }
  });

  // 4. Initial Directory Render & Firestore Loading
  loadProvidersData();

  // 5. Slide-out Menu Event Listeners
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const navBackdrop = document.getElementById('menu-backdrop');

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMenu();
    });
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', () => closeMenu());
  }

  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById('photo-lightbox-modal')) {
        closePhotoLightbox();
        return;
      }
      if (document.getElementById('provider-detail-modal')) {
        closeProviderDetailModal();
        return;
      }
      if (document.body.classList.contains('menu-open')) closeMenu();
      if (document.body.classList.contains('filter-drawer-open')) closeFilterPanel();
    }
  });

  // 5b. Deep link to provider detail modal via ?provider=id
  const providerParam = urlParams.get('provider');
  if (providerParam) {
    const checkAndOpen = () => {
      const match = allProviders.find(p => p.id === providerParam);
      if (match) {
        openProviderDetailModal(match, (updatedId, newRating, newCount) => {
          const target = allProviders.find(p => p.id === updatedId);
          if (target) {
            target.averageRating = newRating;
            target.ratingCount = newCount;
            target.reviewCount = newCount;
            updateDirectory();
          }
        });
      }
    };
    setTimeout(checkAndOpen, 500);
  }

  // 6. Hero Search Bar Live Filtering & Home Page Cross-Routing
  function getCategoryUrlForQuery(query) {
    const q = query.toLowerCase();
    if (q.includes('nail')) return 'nails.html';
    if (q.includes('lash')) return 'lashes.html';
    if (q.includes('food') || q.includes('cater') || q.includes('bake') || q.includes('cake') || q.includes('bbq') || q.includes('plate') || q.includes('drink')) return 'food-and-beverages.html';
    if (q.includes('fashion') || q.includes('outfit') || q.includes('dress') || q.includes('suit') || q.includes('prom') || q.includes('stole') || q.includes('alteration') || q.includes('formal fit')) return 'fashion.html';
    if (q.includes('photo') || q.includes('grad') || q.includes('shoot') || q.includes('portrait') || q.includes('headshot') || q.includes('shutter') || q.includes('camera')) return 'photography.html';
    return 'hair.html';
  }

  const searchForm = document.getElementById('hero-search-form');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value;
      updateDirectory();
    });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (searchInput) {
        const query = searchInput.value.trim();
        if (!document.getElementById('providers-grid') && query) {
          const targetUrl = getCategoryUrlForQuery(query);
          window.location.href = `${targetUrl}?search=${encodeURIComponent(query)}`;
          return;
        }
        appState.searchQuery = query;
        updateDirectory();
      }
      const grid = document.getElementById('providers-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 7. Popular Search Tag Chips
  const tagChips = document.querySelectorAll('.search-tag-chip');
  tagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const rawText = chip.textContent.trim();
      const cleanQuery = rawText.replace(/^[^\w\s]+/, '').trim();

      if (!document.getElementById('providers-grid')) {
        const targetUrl = getCategoryUrlForQuery(cleanQuery);
        window.location.href = `${targetUrl}?search=${encodeURIComponent(cleanQuery)}`;
        return;
      }

      if (searchInput) {
        searchInput.value = cleanQuery;
        appState.searchQuery = cleanQuery;
        updateDirectory();

        const grid = document.getElementById('providers-grid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 8. Explore Categories Button Smooth Scroll
  const heroExploreBtn = document.getElementById('hero-explore-btn');
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('category-nav');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // 9. Reusable Heading Script Word Parser
  // Safely handles headings with <script-word>word</script-word>, <span class="script-word">word</span>,
  // or user-written <script>word</script> syntax without browser JS parsing errors.
  initScriptHeadingParser();
});

/**
 * Custom Element Definition for <script-word> and <accent-script>
 */
if (typeof customElements !== 'undefined') {
  if (!customElements.get('script-word')) {
    customElements.define('script-word', class extends HTMLElement {
      connectedCallback() {
        this.classList.add('script-word');
      }
    });
  }
  if (!customElements.get('accent-script')) {
    customElements.define('accent-script', class extends HTMLElement {
      connectedCallback() {
        this.classList.add('script-word');
      }
    });
  }
}

/**
 * Scans all headings and parses script-word elements or decorative script tags.
 */
export function initScriptHeadingParser() {
  document.querySelectorAll('h1, h2, h3, h4, h5, h6, .font-heading').forEach(heading => {
    // Check for inline script tags intended as decorative script words
    const scripts = heading.querySelectorAll('script');
    scripts.forEach(script => {
      const text = script.textContent.trim();
      // If short decorative word (not actual code)
      if (text && !text.includes(';') && !text.includes('=')) {
        const span = document.createElement('span');
        span.className = 'script-word';
        span.textContent = text;
        script.parentNode.replaceChild(span, script);
      }
    });
  });
}

/**
 * Reusable utility to wrap single words inside any string or heading in the handwritten script font.
 * Example: formatScriptHeading("FIND YOUR <script>glow</script>") -> 'FIND YOUR <span class="script-word">glow</span>'
 * 
 * @param {string} text 
 * @returns {string}
 */
export function formatScriptHeading(text) {
  if (!text) return '';
  return text
    .replace(/<script>(.*?)<\/script>/gi, '<span class="script-word">$1</span>')
    .replace(/<script-word>(.*?)<\/script-word>/gi, '<span class="script-word">$1</span>')
    .replace(/<accent-script>(.*?)<\/accent-script>/gi, '<span class="script-word">$1</span>');
}

// Attach to window for easy access across any template or dynamic module
if (typeof window !== 'undefined') {
  window.formatScriptHeading = formatScriptHeading;
}

