/**
 * js/app.js
 * Main JavaScript controller for Black-Owned BR.
 * 
 * Features:
 * - Dynamic rendering of all 12 sample providers using ProviderCard component
 * - Category filter bar
 * - Real-time hero keyword search
 * - Location filtering (Haversine formula from LSU center point 30.4133, -91.1800)
 * - Quick-select zone buttons (North Gates, Highland/Burbank, Mid-City, Downtown, All BR)
 * - Interactive 1-25 mi radius slider (enforcing strict 25-mile max limit)
 * - Mobile navigation drawer
 */

import { SAMPLE_PROVIDERS } from './data/providers.js';
import { createProviderCard } from './components/ProviderCard.js';
import { filterProviders, MAX_ALLOWED_RADIUS_MILES } from './utils/filters.js';
import { calculateDistance, LSU_COORDINATES } from './utils/distance.js';

console.log('%c🐯 Black-Owned BR: Location Filtering & Directory Active', 'color: #FDD023; background: #461D7C; font-size: 14px; padding: 4px 8px; border-radius: 4px;');
console.log('LSU Center Coordinate:', LSU_COORDINATES.name, `(${LSU_COORDINATES.latitude}, ${LSU_COORDINATES.longitude})`);

// ---------------------------------------------------------------------------
// 1. Application Filter State
// ---------------------------------------------------------------------------
const appState = {
  selectedCategory: 'All',
  searchQuery: '',
  maxRadius: 25,
  selectedZone: 'all'
};

/**
 * Updates the directory grid and status indicators according to current filter state.
 */
function updateDirectory() {
  const gridElement = document.getElementById('providers-grid');
  const countElement = document.getElementById('results-count');
  const statusElement = document.getElementById('directory-status-text');
  const radiusDisplay = document.getElementById('radius-value-display');

  if (!gridElement) return;

  // Update radius slider value display text
  if (radiusDisplay) {
    radiusDisplay.textContent = `${appState.maxRadius} mi`;
  }

  // Filter providers through central filtering logic (src/utils/filters.js)
  const filtered = filterProviders(SAMPLE_PROVIDERS, {
    searchQuery: appState.searchQuery,
    selectedCategory: appState.selectedCategory,
    maxRadius: appState.maxRadius,
    selectedZone: appState.selectedZone
  });

  // Update status pill in section header
  if (statusElement) {
    statusElement.textContent = `${filtered.length} Listing${filtered.length === 1 ? '' : 's'} Active`;
  }

  // Update results counter text
  if (countElement) {
    const categoryLabel = appState.selectedCategory === 'All' ? '' : ` in ${appState.selectedCategory}`;
    const radiusLabel = appState.maxRadius < MAX_ALLOWED_RADIUS_MILES ? ` (within ${appState.maxRadius} mi of LSU)` : '';
    countElement.innerHTML = `Showing <span class="text-lsu-gold font-bold font-mono">${filtered.length}</span> provider${filtered.length === 1 ? '' : 's'}${categoryLabel}${radiusLabel}`;
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
          No businesses found matching your criteria
          ${appState.searchQuery ? ` for "<strong class="text-white">${appState.searchQuery}</strong>"` : ''}
          ${appState.selectedCategory !== 'All' ? ` under <strong class="text-lsu-gold">${appState.selectedCategory}</strong>` : ''}
          ${appState.selectedZone !== 'all' ? ` in zone <strong class="text-white">${appState.selectedZone}</strong>` : ''}
          within <strong class="text-lsu-gold">${appState.maxRadius} miles</strong> of LSU.
        </p>
        <button 
          id="reset-filters-btn"
          type="button" 
          class="mt-6 px-5 py-2.5 rounded-xl bg-lsu-gold hover:bg-lsu-gold-hover text-lsu-purple-dark font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Reset All Filters</span>
          <span>&times;</span>
        </button>
      </div>
    `;

    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetAllFilters();
      });
    }
    return;
  }

  // Render provider cards
  const cardsHtml = filtered.map(provider => createProviderCard(provider)).join('');
  gridElement.innerHTML = cardsHtml;
}

/**
 * Resets all search, category, radius, and zone filters to default.
 */
function resetAllFilters() {
  appState.selectedCategory = 'All';
  appState.searchQuery = '';
  appState.maxRadius = 25;
  appState.selectedZone = 'all';

  // Reset search input
  const searchInput = document.getElementById('hero-search-input');
  if (searchInput) searchInput.value = '';

  // Reset radius slider
  const radiusSlider = document.getElementById('radius-slider');
  if (radiusSlider) radiusSlider.value = '25';

  updateCategoryButtonStyles();
  updateZoneButtonStyles();
  updateDirectory();
}

/**
 * Updates Category filter button active/inactive styling.
 */
function updateCategoryButtonStyles() {
  const categoryButtons = document.querySelectorAll('.category-filter-btn');
  categoryButtons.forEach(btn => {
    const btnCategory = btn.dataset.category;
    const isActive = btnCategory === appState.selectedCategory;

    btn.setAttribute('aria-pressed', String(isActive));

    if (isActive) {
      btn.className = 'category-filter-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 bg-lsu-gold text-lsu-purple-dark shadow-md shadow-lsu-gold/20 active-category';
    } else {
      btn.className = 'category-filter-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700';
    }
  });
}

/**
 * Updates Zone quick-select button active/inactive styling.
 */
function updateZoneButtonStyles() {
  const zoneButtons = document.querySelectorAll('.zone-filter-btn');
  zoneButtons.forEach(btn => {
    const btnZone = btn.dataset.zone;
    const isActive = btnZone === appState.selectedZone;

    btn.setAttribute('aria-pressed', String(isActive));

    if (isActive) {
      btn.className = 'zone-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-lsu-gold text-lsu-purple-dark font-bold active-zone';
    } else {
      btn.className = 'zone-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60';
    }
  });
}

// ---------------------------------------------------------------------------
// Document Ready: Attach All Event Handlers
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Render
  updateDirectory();

  // 2. Category Filter Buttons
  const categoryButtons = document.querySelectorAll('.category-filter-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      if (category) {
        appState.selectedCategory = category;
        updateCategoryButtonStyles();
        updateDirectory();
      }
    });
  });

  // 3. Quick-Select Zone Buttons
  const zoneButtons = document.querySelectorAll('.zone-filter-btn');
  zoneButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const zone = btn.dataset.zone;
      if (zone) {
        appState.selectedZone = zone;
        
        // If clicking "All Baton Rouge", also reset slider to 25
        if (zone === 'all') {
          appState.maxRadius = 25;
          const slider = document.getElementById('radius-slider');
          if (slider) slider.value = '25';
        }

        updateZoneButtonStyles();
        updateDirectory();
      }
    });
  });

  // 4. Radius Slider Control (1 to 25 Miles)
  const radiusSlider = document.getElementById('radius-slider');
  if (radiusSlider) {
    radiusSlider.addEventListener('input', (e) => {
      const val = Math.min(Math.max(Number(e.target.value) || 25, 1), 25);
      appState.maxRadius = val;
      updateDirectory();
    });
  }

  // 5. Hero Search Bar Live Filtering
  const searchInput = document.getElementById('hero-search-input');
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
        appState.searchQuery = searchInput.value;
        updateDirectory();
      }
      const mainContent = document.getElementById('main-directory-content');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 6. Popular Search Tag Chips
  const tagChips = document.querySelectorAll('.search-tag-chip');
  tagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (searchInput) {
        const rawText = chip.textContent.trim();
        const cleanQuery = rawText.replace(/^[^\w\s]+/, '').trim();
        searchInput.value = cleanQuery;
        appState.searchQuery = cleanQuery;
        updateDirectory();

        const mainContent = document.getElementById('main-directory-content');
        if (mainContent) {
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 7. Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      const willExpand = !isExpanded;

      mobileMenuBtn.setAttribute('aria-expanded', String(willExpand));
      mobileMenu.classList.toggle('hidden', !willExpand);

      if (hamburgerIcon && closeIcon) {
        hamburgerIcon.classList.toggle('hidden', willExpand);
        hamburgerIcon.classList.toggle('block', !willExpand);
        closeIcon.classList.toggle('hidden', !willExpand);
        closeIcon.classList.toggle('block', willExpand);
      }
    });

    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (hamburgerIcon && closeIcon) {
          hamburgerIcon.classList.remove('hidden');
          hamburgerIcon.classList.add('block');
          closeIcon.classList.add('hidden');
          closeIcon.classList.remove('block');
        }
      });
    });
  }
});
