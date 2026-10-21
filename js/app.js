/**
 * js/app.js
 * Main JavaScript controller for Black-Owned BR.
 * 
 * BEGINNER GUIDE:
 * This file coordinates our state (the active category filter and search query)
 * with the filtering logic in src/utils/filters.js and renders the resulting
 * provider cards to the screen.
 */

// 1. Import sample providers, ProviderCard component, and central filtering logic
import { SAMPLE_PROVIDERS } from './data/providers.js';
import { createProviderCard } from './components/ProviderCard.js';
import { filterProviders } from './utils/filters.js';

console.log('%c🐯 Black-Owned BR: Filters & Directory Active', 'color: #FDD023; background: #461D7C; font-size: 14px; padding: 4px 8px; border-radius: 4px;');

// 2. Application State
const appState = {
  selectedCategory: 'All',
  searchQuery: ''
};

/**
 * Updates the UI grid and counters by passing current state through filterProviders().
 */
function updateDirectory() {
  const gridElement = document.getElementById('providers-grid');
  const countElement = document.getElementById('results-count');
  const statusElement = document.getElementById('directory-status-text');

  if (!gridElement) return;

  // Use the central filtering logic from src/utils/filters.js
  const filtered = filterProviders(SAMPLE_PROVIDERS, {
    searchQuery: appState.searchQuery,
    selectedCategory: appState.selectedCategory
  });

  // Update status pill in section header
  if (statusElement) {
    statusElement.textContent = `${filtered.length} Listing${filtered.length === 1 ? '' : 's'} Found`;
  }

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
          🔍
        </div>
        <h4 class="text-lg sm:text-xl font-heading font-bold text-white">
          No providers found
        </h4>
        <p class="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
          We couldn't find any listings matching your search 
          ${appState.searchQuery ? `"<strong class="text-white">${appState.searchQuery}</strong>"` : ''} 
          ${appState.selectedCategory !== 'All' ? `under category <strong class="text-lsu-gold">${appState.selectedCategory}</strong>` : ''}.
        </p>
        <button 
          id="reset-filters-btn"
          type="button" 
          class="mt-6 px-5 py-2.5 rounded-xl bg-lsu-gold hover:bg-lsu-gold-hover text-lsu-purple-dark font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Clear All Filters</span>
          <span>&times;</span>
        </button>
      </div>
    `;

    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetFilters();
      });
    }
    return;
  }

  // Render cards for all matching providers
  const cardsHtml = filtered.map(provider => createProviderCard(provider)).join('');
  gridElement.innerHTML = cardsHtml;
}

/**
 * Resets all search and category filters back to default.
 */
function resetFilters() {
  appState.selectedCategory = 'All';
  appState.searchQuery = '';

  const searchInput = document.getElementById('hero-search-input');
  if (searchInput) searchInput.value = '';

  updateCategoryButtonStyles();
  updateDirectory();
}

/**
 * Updates category filter buttons to reflect the active selection.
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

// ---------------------------------------------------------------------------
// Document Ready: Wire UI Interactions
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Render
  updateDirectory();

  // 2. Category Filter Buttons Click Handlers
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

  // 3. Hero Search Input Live Filtering ("as the user types")
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
      // Smooth scroll to directory listings
      const mainContent = document.getElementById('main-directory-content');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 4. Popular Tag Suggestion Chips
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

  // 5. Mobile Menu Toggle
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
