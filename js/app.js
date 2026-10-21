/**
 * js/app.js
 * Main JavaScript controller for Black-Owned BR.
 * 
 * BEGINNER GUIDE:
 * This script initializes the application when the webpage loads:
 * 1. It imports the 12 sample providers from providers.js.
 * 2. It renders each provider using the ProviderCard component.
 * 3. It manages mobile navigation and real-time search filtering.
 */

// 1. Import sample providers data and the ProviderCard component
import { SAMPLE_PROVIDERS } from './data/providers.js';
import { createProviderCard } from './components/ProviderCard.js';

console.log('%c🐯 Black-Owned BR: Initializing directory with ES Modules', 'color: #FDD023; background: #461D7C; font-size: 14px; padding: 4px 8px; border-radius: 4px;');
console.log(`Loaded ${SAMPLE_PROVIDERS.length} sample providers.`);

// Current active search query state
let currentSearchQuery = '';

/**
 * Renders an array of providers into the #providers-grid element.
 * @param {Array} providers - List of provider objects to display
 */
function renderProviders(providers) {
  const gridElement = document.getElementById('providers-grid');
  const countElement = document.getElementById('results-count');
  const statusElement = document.getElementById('directory-status-text');

  if (!gridElement) return;

  // Update status pill
  if (statusElement) {
    statusElement.textContent = `${providers.length} Verified Listing${providers.length === 1 ? '' : 's'}`;
  }

  // Update count header
  if (countElement) {
    countElement.innerHTML = `Showing <span class="text-lsu-gold font-bold font-mono">${providers.length}</span> local service provider${providers.length === 1 ? '' : 's'}`;
  }

  // Empty state handling
  if (providers.length === 0) {
    gridElement.innerHTML = `
      <div class="col-span-full py-12 px-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800 flex items-center justify-center text-xl">
          🔍
        </div>
        <h4 class="text-base font-heading font-bold text-white">No service providers found</h4>
        <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          We couldn't find any listings matching "${currentSearchQuery}". Try another keyword like "braids", "nails", or "headshots".
        </p>
        <button 
          id="clear-search-btn"
          type="button" 
          class="mt-4 px-4 py-2 rounded-xl bg-lsu-purple text-lsu-gold hover:bg-lsu-purple-light text-xs font-semibold transition-colors"
        >
          Clear Search
        </button>
      </div>
    `;

    const clearBtn = document.getElementById('clear-search-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const searchInput = document.getElementById('hero-search-input');
        if (searchInput) searchInput.value = '';
        currentSearchQuery = '';
        renderProviders(SAMPLE_PROVIDERS);
      });
    }
    return;
  }

  // Generate cards HTML for all matching providers
  const cardsHtml = providers.map(provider => createProviderCard(provider)).join('');
  gridElement.innerHTML = cardsHtml;
}

/**
 * Filters the providers list based on the search term.
 * @param {string} query - Keyword query string
 */
function handleSearch(query) {
  currentSearchQuery = query.toLowerCase().trim();

  if (!currentSearchQuery) {
    renderProviders(SAMPLE_PROVIDERS);
    return;
  }

  const filtered = SAMPLE_PROVIDERS.filter(provider => {
    const nameMatch = provider.businessName.toLowerCase().includes(currentSearchQuery);
    const ownerMatch = provider.ownerName.toLowerCase().includes(currentSearchQuery);
    const categoryMatch = provider.category.toLowerCase().includes(currentSearchQuery);
    const descMatch = provider.description.toLowerCase().includes(currentSearchQuery);
    const neighborhoodMatch = provider.neighborhood.toLowerCase().includes(currentSearchQuery);
    
    // Check seasonal tags
    const tagMatch = provider.seasonalTags && provider.seasonalTags.some(tag => tag.toLowerCase().includes(currentSearchQuery));
    
    // Check hair specialties if available
    const specialtyMatch = provider.specialties && provider.specialties.some(spec => spec.toLowerCase().includes(currentSearchQuery));

    return nameMatch || ownerMatch || categoryMatch || descMatch || neighborhoodMatch || tagMatch || specialtyMatch;
  });

  renderProviders(filtered);
}

// ---------------------------------------------------------------------------
// Document Ready: Bind Event Listeners
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Render: Display all 12 sample providers
  renderProviders(SAMPLE_PROVIDERS);

  // 2. Mobile Navigation Hamburger Menu Toggle
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

    // Close menu when tapping links
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

  // 3. Hero Search Form & Input Listeners
  const searchForm = document.getElementById('hero-search-form');
  const searchInput = document.getElementById('hero-search-input');

  if (searchInput) {
    // Live search as user types
    searchInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (searchInput) {
        handleSearch(searchInput.value);
      }
      // Smooth scroll down to listings
      const mainContent = document.getElementById('main-directory-content');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 4. Popular Search Suggestion Tag Chips
  const tagChips = document.querySelectorAll('.search-tag-chip');
  tagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (searchInput) {
        // Strip emoji icons if any, or keep clean keyword
        const rawText = chip.textContent.trim();
        const cleanQuery = rawText.replace(/^[^\w\s]+/, '').trim();
        searchInput.value = cleanQuery;
        handleSearch(cleanQuery);

        const mainContent = document.getElementById('main-directory-content');
        if (mainContent) {
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
