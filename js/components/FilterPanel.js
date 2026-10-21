/**
 * js/components/FilterPanel.js
 * 
 * Reusable Filter Panel Component for Black-Owned BR category pages.
 * - Generates top control bar with "Filters" toggle button, sort dropdown, and results count
 * - Supports collapsed state by default on both desktop and mobile
 * - Slides out as an off-canvas drawer on mobile (< 768px) with backdrop
 * - Expands smoothly as a multi-column dashboard on desktop (>= 768px)
 * - Renders shared filters (location, price, rating, experience, discount, delivery, availability)
 * - Renders category-specific filters (Hair, Nails, Lashes, Food, Fashion, Photography)
 * - Provides "Clear Filters" and live match counts
 */

/**
 * Returns HTML markup for category-specific filter options.
 * 
 * @param {string} category 
 * @returns {string}
 */
function getCategorySpecificHtml(category) {
  switch (category) {
    case 'Hair':
      return `
        <div class="col-span-full border-b border-purple-900/30 pb-5 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">💇🏾‍♀️</span>
            <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-lsu-gold">
              Hair Specific Filters
            </h4>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <!-- Hair Type & Texture -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Hair Type &amp; Texture</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Hair Type">
                <button type="button" data-filter="hairTypes" data-value="3A-3C" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">3A-3C</button>
                <button type="button" data-filter="hairTypes" data-value="4A-4C" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">4A-4C</button>
                <button type="button" data-filter="hairTypes" data-value="Locs & Sisterlocks" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Locs &amp; Sisterlocks</button>
                <button type="button" data-filter="hairTypes" data-value="Relaxed/Straight" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Relaxed/Straight</button>
              </div>
            </div>

            <!-- Specialties -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Specialties</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Specialties">
                <button type="button" data-filter="hairSpecialties" data-value="knotless braids" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Knotless Braids</button>
                <button type="button" data-filter="hairSpecialties" data-value="wig installs" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Wig Installs</button>
                <button type="button" data-filter="hairSpecialties" data-value="silk press" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Silk Press</button>
                <button type="button" data-filter="hairSpecialties" data-value="loc maintenance" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Loc Maintenance</button>
                <button type="button" data-filter="hairSpecialties" data-value="hair included" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Hair Included</button>
              </div>
            </div>

            <!-- Chair Vibe -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Chair Vibe</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Chair Vibe">
                <button type="button" data-filter="chairVibes" data-value="home studio" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Home Studio</button>
                <button type="button" data-filter="chairVibes" data-value="travels to you" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Travels to You</button>
                <button type="button" data-filter="chairVibes" data-value="studio" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Salon / Studio</button>
              </div>
            </div>
          </div>
        </div>
      `;

    case 'Nails':
      return `
        <div class="col-span-full border-b border-purple-900/30 pb-5 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">💅🏾</span>
            <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-lsu-gold">
              Nail Specific Filters
            </h4>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-2">Nail Style</label>
            <div class="flex flex-wrap gap-2" role="group" aria-label="Nail Styles">
              <button type="button" data-filter="nailStyles" data-value="acrylic" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Acrylic</button>
              <button type="button" data-filter="nailStyles" data-value="gel-x" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Gel-X</button>
              <button type="button" data-filter="nailStyles" data-value="natural nail" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Natural Nail</button>
              <button type="button" data-filter="nailStyles" data-value="press-ons" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Press-Ons</button>
              <button type="button" data-filter="nailStyles" data-value="nail art" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Nail Art</button>
            </div>
          </div>
        </div>
      `;

    case 'Lashes':
      return `
        <div class="col-span-full border-b border-purple-900/30 pb-5 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">👁️</span>
            <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-lsu-gold">
              Lash Specific Filters
            </h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Lash Type</label>
              <div class="flex flex-wrap gap-2" role="group" aria-label="Lash Types">
                <button type="button" data-filter="lashTypes" data-value="classic" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Classic</button>
                <button type="button" data-filter="lashTypes" data-value="hybrid" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Hybrid</button>
                <button type="button" data-filter="lashTypes" data-value="volume" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Volume</button>
                <button type="button" data-filter="lashTypes" data-value="mega volume" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Mega Volume</button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Fills &amp; Maintenance</label>
              <label class="inline-flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-lsu-gold/40 transition-colors">
                <input type="checkbox" id="filter-offers-fills" class="w-4 h-4 rounded text-lsu-gold focus:ring-lsu-gold accent-amber-400 bg-slate-900 border-slate-700">
                <span class="text-xs text-slate-200 font-medium">Offers Fills &amp; Touch-ups</span>
              </label>
            </div>
          </div>
        </div>
      `;

    case 'Food & Beverages':
      return `
        <div class="col-span-full border-b border-purple-900/30 pb-5 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">🍽️</span>
            <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-lsu-gold">
              Food &amp; Beverage Specific Filters
            </h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Food &amp; Menu Type</label>
              <div class="flex flex-wrap gap-2" role="group" aria-label="Food Types">
                <button type="button" data-filter="foodTypes" data-value="meals/plates" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Meals / Plates</button>
                <button type="button" data-filter="foodTypes" data-value="desserts/baked goods" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Desserts / Baked</button>
                <button type="button" data-filter="foodTypes" data-value="drinks" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Drinks</button>
                <button type="button" data-filter="foodTypes" data-value="catering" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Catering</button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Ordering Options</label>
              <div class="flex flex-wrap gap-3">
                <label class="inline-flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-lsu-gold/40 transition-colors">
                  <input type="checkbox" id="filter-campus-dropoff" class="w-4 h-4 rounded text-lsu-gold focus:ring-lsu-gold accent-amber-400 bg-slate-900 border-slate-700">
                  <span class="text-xs text-slate-200 font-medium">Campus Drop-off</span>
                </label>
                <label class="inline-flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-lsu-gold/40 transition-colors">
                  <input type="checkbox" id="filter-preorder-required" class="w-4 h-4 rounded text-lsu-gold focus:ring-lsu-gold accent-amber-400 bg-slate-900 border-slate-700">
                  <span class="text-xs text-slate-200 font-medium">Pre-order Required</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      `;

    case 'Fashion (Custom Outfits)':
    case 'Fashion':
      return `
        <div class="col-span-full border-b border-purple-900/30 pb-5 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">🧥</span>
            <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-lsu-gold">
              Fashion Specific Filters
            </h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Outfit Type</label>
              <div class="flex flex-wrap gap-2" role="group" aria-label="Outfit Types">
                <button type="button" data-filter="outfitTypes" data-value="game day" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Game Day</button>
                <button type="button" data-filter="outfitTypes" data-value="formal/prom" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Formal / Prom</button>
                <button type="button" data-filter="outfitTypes" data-value="graduation" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Graduation Stoles</button>
                <button type="button" data-filter="outfitTypes" data-value="everyday" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Everyday</button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Turnaround Speed</label>
              <div class="flex flex-wrap gap-2" role="group" aria-label="Turnaround">
                <button type="button" data-filter="turnarounds" data-value="this-week" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">This Week (Rush)</button>
                <button type="button" data-filter="turnarounds" data-value="2-weeks" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">2 Weeks</button>
                <button type="button" data-filter="turnarounds" data-value="formal-ready" class="filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Formal Ready</button>
              </div>
            </div>
          </div>
        </div>
      `;

    case 'Photography':
      return `
        <div class="col-span-full border-b border-purple-900/30 pb-5 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">📸</span>
            <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-lsu-gold">
              Photography Specific Filters
            </h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Shoot Type</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Shoot Types">
                <button type="button" data-filter="shootTypes" data-value="graduation" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Graduation</button>
                <button type="button" data-filter="shootTypes" data-value="game day" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Game Day</button>
                <button type="button" data-filter="shootTypes" data-value="events" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Events &amp; Formals</button>
                <button type="button" data-filter="shootTypes" data-value="portraits" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Portraits</button>
                <button type="button" data-filter="shootTypes" data-value="brand content" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">Brand Content</button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Gallery Delivery Turnaround</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Turnaround">
                <button type="button" data-filter="photoTurnarounds" data-value="this-week" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">This Week</button>
                <button type="button" data-filter="photoTurnarounds" data-value="2-weeks" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-lsu-gold/40">2 Weeks</button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Campus Mobility</label>
              <label class="inline-flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-lsu-gold/40 transition-colors">
                <input type="checkbox" id="filter-travels-campus" class="w-4 h-4 rounded text-lsu-gold focus:ring-lsu-gold accent-amber-400 bg-slate-900 border-slate-700">
                <span class="text-xs text-slate-200 font-medium">Travels to LSU Campus</span>
              </label>
            </div>
          </div>
        </div>
      `;

    default:
      return '';
  }
}

/**
 * Injects the complete filter control bar, mobile drawer, and desktop panel into the page.
 * 
 * @param {string} categoryName - Current category
 * @param {Function} onFilterChange - Callback when filter criteria change
 */
export function injectFilterPanel(categoryName, onFilterChange) {
  const mount = document.getElementById('filter-panel-mount');
  if (!mount) return;

  const categorySpecificHtml = getCategorySpecificHtml(categoryName);

  mount.innerHTML = `
    <!-- ======================================================================
         1. FILTER CONTROL BAR (Always Visible Above Grid)
         ====================================================================== -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-purple-900/40 shadow-lg backdrop-blur mb-6">
      
      <!-- Left side: Filters button & Clear filters link -->
      <div class="flex items-center gap-2.5">
        <button 
          id="toggle-filters-btn" 
          type="button" 
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-purple-900/40 hover:border-lsu-gold/50 text-slate-200 hover:text-lsu-gold text-xs sm:text-sm font-heading font-bold tracking-wide transition-all shadow-sm cursor-pointer"
          aria-expanded="false"
          aria-controls="filter-panel"
        >
          <svg class="w-4 h-4 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
          </svg>
          <span>Filters</span>
          <span id="active-filter-badge" class="hidden px-2 py-0.5 rounded-full bg-lsu-gold text-lsu-purple-dark text-[10px] font-bold">0</span>
        </button>

        <button 
          id="clear-filters-btn-bar" 
          type="button" 
          class="hidden text-xs text-slate-400 hover:text-lsu-gold font-medium underline underline-offset-4 cursor-pointer transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <!-- Right side: Results count & Sort Dropdown -->
      <div class="flex items-center gap-3 ml-auto">
        
        <!-- Results count display -->
        <span id="results-count" class="text-xs text-slate-300 font-medium">
          Showing <span class="text-lsu-gold font-bold">3</span> providers
        </span>

        <!-- Sort Dropdown -->
        <div class="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <label for="sort-by-select" class="text-slate-400 font-medium shrink-0">Sort:</label>
          <select 
            id="sort-by-select" 
            class="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-1"
          >
            <option value="rating" class="bg-slate-900 text-white">Highest Rated</option>
            <option value="distance" class="bg-slate-900 text-white">Closest</option>
            <option value="price" class="bg-slate-900 text-white">Lowest Price</option>
            <option value="experience" class="bg-slate-900 text-white">Most Experienced</option>
          </select>
        </div>

      </div>
    </div>

    <!-- Backdrop for Mobile Drawer -->
    <div 
      id="filter-backdrop" 
      class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 hidden opacity-0 pointer-events-none transition-opacity duration-300"
      aria-hidden="true"
    ></div>

    <!-- ======================================================================
         2. RESPONSIVE FILTER PANEL / DRAWER
         - Collapsed by default (stays clean)
         - Fixed slide-out drawer on mobile (< 768px)
         - Collapsible multi-column panel on desktop (>= 768px)
         ====================================================================== -->
    <div 
      id="filter-panel" 
      class="fixed inset-y-0 right-0 w-88 max-w-[92vw] z-50 bg-slate-950 border-l border-purple-900/40 shadow-2xl translate-x-full transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto md:static md:w-full md:max-w-none md:z-auto md:bg-slate-900/80 md:border md:border-purple-900/40 md:rounded-2xl md:shadow-xl md:mb-6 md:hidden"
    >
      <!-- Mobile Drawer Header -->
      <div class="p-4 border-b border-purple-900/30 flex items-center justify-between md:hidden bg-slate-950">
        <div class="flex items-center gap-2">
          <span class="text-lsu-gold font-heading font-bold text-base">Filter Options</span>
          <span id="mobile-filter-badge" class="hidden px-2 py-0.5 rounded-full bg-lsu-gold text-lsu-purple-dark text-[10px] font-bold">0</span>
        </div>
        <button 
          id="close-filter-drawer-btn" 
          type="button" 
          class="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close filters drawer"
        >
          <svg class="w-4 h-4 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Filter Controls Body -->
      <div class="p-5 md:p-6 space-y-6 flex-grow overflow-y-auto">
        
        <!-- Category-Specific Section (Top of panel) -->
        ${categorySpecificHtml}

        <!-- Shared Section: 4 Column Grid on Desktop -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <!-- Col 1: Location & Distance -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 pb-1 border-b border-purple-900/30">
              <span class="text-sm">📍</span>
              <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-lsu-gold">Location &amp; Radius</h4>
            </div>

            <!-- Max Radius Slider (1-25 mi) -->
            <div>
              <div class="flex items-center justify-between text-xs mb-1.5">
                <label for="filter-radius-slider" class="font-semibold text-slate-300">Max Radius:</label>
                <span id="filter-radius-display" class="font-mono font-bold text-lsu-gold">25 mi</span>
              </div>
              <input 
                id="filter-radius-slider" 
                type="range" 
                min="1" 
                max="25" 
                value="25" 
                step="1"
                class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div class="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 mi (Campus)</span>
                <span>25 mi (BR Max)</span>
              </div>
            </div>

            <!-- Quick Zones -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Baton Rouge Zones</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Zones">
                <button type="button" data-zone="all" class="zone-pill px-2.5 py-1 rounded-lg text-xs font-medium transition-colors bg-lsu-gold text-lsu-purple-dark font-bold active-zone">All BR</button>
                <button type="button" data-zone="campus" class="zone-pill px-2.5 py-1 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">Campus (&lt;2 mi)</button>
                <button type="button" data-zone="highland-burbank" class="zone-pill px-2.5 py-1 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">Highland/Burbank</button>
                <button type="button" data-zone="mid-city" class="zone-pill px-2.5 py-1 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">Mid-City</button>
                <button type="button" data-zone="downtown" class="zone-pill px-2.5 py-1 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">Downtown</button>
              </div>
            </div>
          </div>

          <!-- Col 2: Price & Budget -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 pb-1 border-b border-purple-900/30">
              <span class="text-sm">💵</span>
              <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-lsu-gold">Price &amp; Budget</h4>
            </div>

            <!-- Price Tiers -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Price Tier</label>
              <div class="flex gap-2" role="group" aria-label="Price Tier">
                <button type="button" data-filter="priceTiers" data-value="$" class="filter-pill flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white text-center">$</button>
                <button type="button" data-filter="priceTiers" data-value="$$" class="filter-pill flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white text-center">$$</button>
                <button type="button" data-filter="priceTiers" data-value="$$$" class="filter-pill flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white text-center">$$$</button>
              </div>
            </div>

            <!-- Max Starting Price Slider -->
            <div>
              <div class="flex items-center justify-between text-xs mb-1.5">
                <label for="filter-max-price" class="font-semibold text-slate-300">Max Starting Price:</label>
                <span id="filter-price-display" class="font-mono font-bold text-lsu-gold">Any ($250+)</span>
              </div>
              <input 
                id="filter-max-price" 
                type="range" 
                min="20" 
                max="250" 
                value="250" 
                step="5"
                class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div class="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>$20</span>
                <span>$250+</span>
              </div>
            </div>

            <!-- Student Discount Toggle -->
            <div class="pt-1">
              <label class="inline-flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-lsu-gold/40 transition-colors w-full">
                <input type="checkbox" id="filter-student-discount" class="w-4 h-4 rounded text-lsu-gold focus:ring-lsu-gold accent-amber-400 bg-slate-900 border-slate-700">
                <span class="text-xs text-slate-200 font-medium">Offers Student Discount 🐯</span>
              </label>
            </div>
          </div>

          <!-- Col 3: Quality & Experience -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 pb-1 border-b border-purple-900/30">
              <span class="text-sm">⭐</span>
              <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-lsu-gold">Quality &amp; Rating</h4>
            </div>

            <!-- Min Rating -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Minimum Star Rating</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Minimum Rating">
                <button type="button" data-rating="0" class="rating-pill px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-lsu-gold text-lsu-purple-dark font-bold active-rating">Any</button>
                <button type="button" data-rating="3" class="rating-pill px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">3+ ★</button>
                <button type="button" data-rating="4" class="rating-pill px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">4+ ★</button>
                <button type="button" data-rating="4.5" class="rating-pill px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">4.5+ ★</button>
              </div>
            </div>

            <!-- Experience Tier -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Years of Experience</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Experience Tier">
                <button type="button" data-filter="experienceTiers" data-value="1-2" class="filter-pill px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">1-2 yrs (Rising)</button>
                <button type="button" data-filter="experienceTiers" data-value="3-5" class="filter-pill px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">3-5 yrs</button>
                <button type="button" data-filter="experienceTiers" data-value="5+" class="filter-pill px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">5+ yrs (Master)</button>
              </div>
            </div>
          </div>

          <!-- Col 4: Delivery & Availability -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 pb-1 border-b border-purple-900/30">
              <span class="text-sm">⚡</span>
              <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-lsu-gold">Delivery &amp; Timing</h4>
            </div>

            <!-- Service Delivery -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Service Setup</label>
              <div class="space-y-1.5">
                <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input type="radio" name="service-delivery-radio" value="all" checked class="text-lsu-gold focus:ring-lsu-gold accent-amber-400">
                  <span>All Setups</span>
                </label>
                <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input type="radio" name="service-delivery-radio" value="mobile" class="text-lsu-gold focus:ring-lsu-gold accent-amber-400">
                  <span>Mobile / Travels to Campus</span>
                </label>
                <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input type="radio" name="service-delivery-radio" value="studio" class="text-lsu-gold focus:ring-lsu-gold accent-amber-400">
                  <span>Studio / Home Setup</span>
                </label>
              </div>
            </div>

            <!-- Availability -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Availability Timing</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Availability">
                <button type="button" data-filter="availabilities" data-value="open-this-week" class="filter-pill px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">Open This Week</button>
                <button type="button" data-filter="availabilities" data-value="same-day" class="filter-pill px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">Same-Day / Last-Min</button>
                <button type="button" data-filter="availabilities" data-value="bookings-open" class="filter-pill px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white">Bookings Open</button>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Drawer / Panel Footer Actions -->
      <div class="p-4 border-t border-purple-900/30 flex items-center justify-between bg-slate-950/90 gap-3">
        <button 
          id="clear-filters-btn-panel" 
          type="button" 
          class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>

        <div class="flex items-center gap-2">
          <!-- Mobile Apply / Done button -->
          <button 
            id="apply-filters-btn" 
            type="button" 
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-lsu-gold to-amber-300 hover:from-amber-300 hover:to-lsu-gold text-lsu-purple-dark text-xs font-heading font-bold uppercase tracking-wider shadow-md shadow-lsu-gold/20 transition-all cursor-pointer"
          >
            Apply Filters
          </button>

          <!-- Desktop Collapse button -->
          <button 
            id="collapse-panel-btn" 
            type="button" 
            class="hidden md:inline-flex px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Hide Panel
          </button>
        </div>
      </div>

    </div>
  `;
}
