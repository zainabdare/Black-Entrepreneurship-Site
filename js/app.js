/**
 * js/app.js
 * Main JavaScript controller for Black-Owned BR.
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

import { SAMPLE_PROVIDERS } from './data/providers.js';
import { createProviderCard } from './components/ProviderCard.js';
import { filterProviders, MAX_ALLOWED_RADIUS_MILES } from './utils/filters.js';
import { calculateDistance, LSU_COORDINATES } from './utils/distance.js';
import { injectNavigationDrawer } from './components/NavigationDrawer.js';
import { injectFilterPanel } from './components/FilterPanel.js';

console.log('%c🐯 Black-Owned BR: Multi-page & Filter Panel Active', 'color: #FDD023; background: #461D7C; font-size: 14px; padding: 4px 8px; border-radius: 4px;');

// Detect if current page is dedicated to a specific category
const pageCategory = document.body.dataset.category || 'All';
const isDedicatedCategoryPage = pageCategory !== 'All';

// ---------------------------------------------------------------------------
// 1. Application Filter State
// ---------------------------------------------------------------------------
export const appState = {
  selectedCategory: pageCategory,
  searchQuery: '',
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
  if (appState.maxRadius < 25) count++;
  if (appState.selectedZone !== 'all') count++;
  if (appState.priceTiers.length > 0) count += appState.priceTiers.length;
  if (appState.maxStartingPrice !== null && appState.maxStartingPrice < 250) count++;
  if (appState.minRating > 0) count++;
  if (appState.experienceTiers.length > 0) count += appState.experienceTiers.length;
  if (appState.studentDiscountOnly) count++;
  if (appState.serviceDelivery !== 'all') count++;
  if (appState.availabilities.length > 0) count += appState.availabilities.length;

  // Hair
  if (appState.hairTypes.length > 0) count += appState.hairTypes.length;
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
 * Updates the directory grid and status indicators according to current filter state.
 */
export function updateDirectory() {
  const gridElement = document.getElementById('providers-grid');
  const countElement = document.getElementById('results-count');
  const radiusDisplay = document.getElementById('filter-radius-display') || document.getElementById('radius-value-display');
  const priceDisplay = document.getElementById('filter-price-display');

  if (!gridElement) return;

  // Update slider displays
  if (radiusDisplay) {
    radiusDisplay.textContent = `${appState.maxRadius} mi`;
  }
  if (priceDisplay) {
    priceDisplay.textContent = appState.maxStartingPrice && appState.maxStartingPrice < 250 
      ? `$${appState.maxStartingPrice} max` 
      : 'Any ($250+)';
  }

  // Filter providers through central filtering logic (src/utils/filters.js)
  const filtered = filterProviders(SAMPLE_PROVIDERS, appState);

  // Update active filter badge & clear button
  updateActiveFilterBadges();

  // Update results counter text
  if (countElement) {
    const categoryLabel = appState.selectedCategory === 'All' ? '' : ` in ${appState.selectedCategory}`;
    countElement.innerHTML = `Showing <span class="text-lsu-gold font-bold font-mono">${filtered.length}</span> provider${filtered.length === 1 ? '' : 's'}${categoryLabel}`;
  }

  // Handle empty state: "No providers found"
  if (filtered.length === 0) {
    gridElement.innerHTML = `
      <div class="col-span-full py-14 px-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center shadow-lg">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-lsu-purple/30 border border-lsu-gold/30 flex items-center justify-center text-3xl shadow-inner">
          📍
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
}

/**
 * Resets all filters back to default.
 */
export function resetAllFilters() {
  appState.selectedCategory = pageCategory;
  appState.searchQuery = '';
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

  const radiusSlider = document.getElementById('filter-radius-slider') || document.getElementById('radius-slider');
  if (radiusSlider) radiusSlider.value = '25';

  const priceSlider = document.getElementById('filter-max-price');
  if (priceSlider) priceSlider.value = '250';

  const sortSelect = document.getElementById('sort-by-select');
  if (sortSelect) sortSelect.value = 'rating';

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
    pill.classList.remove('bg-lsu-gold', 'text-lsu-purple-dark', 'font-bold', 'border-lsu-gold', 'shadow-sm', 'shadow-lsu-gold/20');
    pill.classList.add('bg-slate-950/80', 'border-slate-800', 'text-slate-300');
  });

  document.querySelectorAll('.zone-pill').forEach(pill => {
    const isAll = pill.dataset.zone === 'all';
    pill.classList.toggle('bg-lsu-gold', isAll);
    pill.classList.toggle('text-lsu-purple-dark', isAll);
    pill.classList.toggle('font-bold', isAll);
    pill.classList.toggle('bg-slate-950/80', !isAll);
    pill.classList.toggle('text-slate-300', !isAll);
  });

  document.querySelectorAll('.rating-pill').forEach(pill => {
    const isZero = pill.dataset.rating === '0';
    pill.classList.toggle('bg-lsu-gold', isZero);
    pill.classList.toggle('text-lsu-purple-dark', isZero);
    pill.classList.toggle('font-bold', isZero);
    pill.classList.toggle('bg-slate-950/80', !isZero);
    pill.classList.toggle('text-slate-300', !isZero);
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
        toggleBtn.classList.toggle('bg-lsu-purple/40', isOpen);
        toggleBtn.classList.toggle('border-lsu-gold/60', isOpen);
        toggleBtn.classList.toggle('text-lsu-gold', isOpen);
      }
    }
  }
}

export function closeFilterPanel() {
  document.body.classList.remove('filter-drawer-open');
  const backdrop = document.getElementById('filter-backdrop');
  if (backdrop) backdrop.classList.add('hidden');
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
      const panel = document.getElementById('filter-panel');
      const btn = document.getElementById('toggle-filters-btn');
      if (panel) panel.classList.add('md:hidden');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('bg-lsu-purple/40', 'border-lsu-gold/60', 'text-lsu-gold');
      }
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

  // Radius Slider (1 to 25 mi)
  const radiusSlider = document.getElementById('filter-radius-slider') || document.getElementById('radius-slider');
  if (radiusSlider) {
    radiusSlider.addEventListener('input', (e) => {
      appState.maxRadius = Math.min(Math.max(Number(e.target.value) || 25, 1), 25);
      updateDirectory();
    });
  }

  // Quick Zone Pills
  const zonePills = document.querySelectorAll('.zone-pill');
  zonePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const zone = pill.dataset.zone;
      if (zone) {
        appState.selectedZone = zone;
        if (zone === 'all') {
          appState.maxRadius = 25;
          if (radiusSlider) radiusSlider.value = '25';
        }
        zonePills.forEach(p => {
          const isSelected = p.dataset.zone === zone;
          p.classList.toggle('bg-lsu-gold', isSelected);
          p.classList.toggle('text-lsu-purple-dark', isSelected);
          p.classList.toggle('font-bold', isSelected);
          p.classList.toggle('bg-slate-950/80', !isSelected);
          p.classList.toggle('text-slate-300', !isSelected);
        });
        updateDirectory();
      }
    });
  });

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
        p.classList.toggle('bg-lsu-gold', isSelected);
        p.classList.toggle('text-lsu-purple-dark', isSelected);
        p.classList.toggle('font-bold', isSelected);
        p.classList.toggle('bg-slate-950/80', !isSelected);
        p.classList.toggle('text-slate-300', !isSelected);
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

  // Generic Multi-Select Filter Pills (priceTiers, experienceTiers, availabilities, hairTypes, etc.)
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
          pill.classList.remove('bg-lsu-gold', 'text-lsu-purple-dark', 'font-bold', 'border-lsu-gold', 'shadow-sm', 'shadow-lsu-gold/20');
          pill.classList.add('bg-slate-950/80', 'border-slate-800', 'text-slate-300');
        } else {
          arr.push(filterVal);
          pill.classList.add('bg-lsu-gold', 'text-lsu-purple-dark', 'font-bold', 'border-lsu-gold', 'shadow-sm', 'shadow-lsu-gold/20');
          pill.classList.remove('bg-slate-950/80', 'border-slate-800', 'text-slate-300');
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

  // 4. Initial Directory Render
  updateDirectory();

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
      if (document.body.classList.contains('menu-open')) closeMenu();
      if (document.body.classList.contains('filter-drawer-open')) closeFilterPanel();
    }
  });

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
});
