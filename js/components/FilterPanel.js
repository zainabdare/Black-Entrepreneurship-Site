/**
 * js/components/FilterPanel.js
 * 
 * Reusable Filter Panel Component for Black-Owned BR category pages.
 * Restyled with:
 * - Cream background (#F6EEE6)
 * - Burgundy headings (#4A1C24, Lilita One display)
 * - Blush pink selected states (#E9C6CC with #4A1C24 text)
 * - Pill-shaped buttons and inputs
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
        <div class="col-span-full border-b border-[#EAD5C0] pb-5 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">💇🏾‍♀️</span>
            <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-[#4A1C24]">
              Hair Specific Filters
            </h4>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <!-- Hair Type & Texture -->
            <div>
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Hair Type &amp; Texture</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Hair Type">
                <button type="button" data-filter="hairTypes" data-value="3A-3C" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">3A-3C</button>
                <button type="button" data-filter="hairTypes" data-value="4A-4C" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">4A-4C</button>
                <button type="button" data-filter="hairTypes" data-value="Locs & Sisterlocks" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Locs &amp; Sisterlocks</button>
                <button type="button" data-filter="hairTypes" data-value="Relaxed/Straight" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Relaxed/Straight</button>
              </div>
            </div>

            <!-- Specialties -->
            <div>
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Specialties</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Specialties">
                <button type="button" data-filter="hairSpecialties" data-value="knotless braids" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Knotless Braids</button>
                <button type="button" data-filter="hairSpecialties" data-value="wig installs" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Wig Installs</button>
                <button type="button" data-filter="hairSpecialties" data-value="silk press" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Silk Press</button>
                <button type="button" data-filter="hairSpecialties" data-value="loc maintenance" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Loc Maintenance</button>
                <button type="button" data-filter="hairSpecialties" data-value="hair included" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Hair Included</button>
              </div>
            </div>

            <!-- Chair Vibe -->
            <div>
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Chair Vibe</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Chair Vibe">
                <button type="button" data-filter="chairVibes" data-value="home studio" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Home Studio</button>
                <button type="button" data-filter="chairVibes" data-value="travels to you" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Travels to You</button>
                <button type="button" data-filter="chairVibes" data-value="studio" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Salon / Studio</button>
              </div>
            </div>
          </div>
        </div>
      `;

    case 'Nails':
      return `
        <div class="col-span-full border-b border-[#EAD5C0] pb-5 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">💅🏾</span>
            <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-[#4A1C24]">
              Nail Specific Filters
            </h4>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Nail Style</label>
            <div class="flex flex-wrap gap-2" role="group" aria-label="Nail Styles">
              <button type="button" data-filter="nailStyles" data-value="acrylic" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Acrylic</button>
              <button type="button" data-filter="nailStyles" data-value="gel-x" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Gel-X</button>
              <button type="button" data-filter="nailStyles" data-value="natural nail" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Natural Nail</button>
              <button type="button" data-filter="nailStyles" data-value="press-ons" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Press-Ons</button>
              <button type="button" data-filter="nailStyles" data-value="nail art" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Nail Art</button>
            </div>
          </div>
        </div>
      `;

    case 'Lashes':
      return `
        <div class="col-span-full border-b border-[#EAD5C0] pb-5 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">👁️</span>
            <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-[#4A1C24]">
              Lash Specific Filters
            </h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Lash Set Type</label>
              <div class="flex flex-wrap gap-2" role="group" aria-label="Lash Types">
                <button type="button" data-filter="lashTypes" data-value="classic" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Classic</button>
                <button type="button" data-filter="lashTypes" data-value="hybrid" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Hybrid</button>
                <button type="button" data-filter="lashTypes" data-value="volume" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Volume</button>
                <button type="button" data-filter="lashTypes" data-value="mega volume" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Mega Volume</button>
              </div>
            </div>

            <!-- Fills Filter -->
            <div class="flex items-end pb-1">
              <label class="inline-flex items-center gap-2.5 p-2 rounded-2xl bg-white border border-[#EAD5C0] cursor-pointer hover:border-[#4A1C24] transition-colors w-full">
                <input type="checkbox" id="filter-offers-fills" class="w-4 h-4 rounded text-[#4A1C24] focus:ring-[#4A1C24] accent-[#4A1C24]">
                <span class="text-xs text-[#4A1C24] font-medium font-sans">Offers 2-3 Week Refills</span>
              </label>
            </div>
          </div>
        </div>
      `;

    case 'Food & Beverages':
      return `
        <div class="col-span-full border-b border-[#EAD5C0] pb-5 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">🍽️</span>
            <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-[#4A1C24]">
              Food &amp; Beverage Specific Filters
            </h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <!-- Food Type -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Menu &amp; Offering Type</label>
              <div class="flex flex-wrap gap-2" role="group" aria-label="Food Types">
                <button type="button" data-filter="foodTypes" data-value="meals/plates" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Meals / Plates</button>
                <button type="button" data-filter="foodTypes" data-value="desserts/baked goods" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Desserts / Baked</button>
                <button type="button" data-filter="foodTypes" data-value="drinks" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Drinks</button>
                <button type="button" data-filter="foodTypes" data-value="catering" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Catering</button>
              </div>
            </div>

            <!-- Food Checkboxes -->
            <div class="space-y-2">
              <label class="inline-flex items-center gap-2.5 p-2 rounded-2xl bg-white border border-[#EAD5C0] cursor-pointer hover:border-[#4A1C24] transition-colors w-full">
                <input type="checkbox" id="filter-campus-dropoff" class="w-4 h-4 rounded text-[#4A1C24] focus:ring-[#4A1C24] accent-[#4A1C24]">
                <span class="text-xs text-[#4A1C24] font-medium font-sans">Campus Drop-Off Available 🐯</span>
              </label>
              <label class="inline-flex items-center gap-2.5 p-2 rounded-2xl bg-white border border-[#EAD5C0] cursor-pointer hover:border-[#4A1C24] transition-colors w-full">
                <input type="checkbox" id="filter-preorder-required" class="w-4 h-4 rounded text-[#4A1C24] focus:ring-[#4A1C24] accent-[#4A1C24]">
                <span class="text-xs text-[#4A1C24] font-medium font-sans">Pre-Order Required Only</span>
              </label>
            </div>
          </div>
        </div>
      `;

    case 'Fashion':
      return `
        <div class="col-span-full border-b border-[#EAD5C0] pb-5 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">🧥</span>
            <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-[#4A1C24]">
              Fashion &amp; Custom Outfit Filters
            </h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- Outfit Types -->
            <div>
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Outfit Style</label>
              <div class="flex flex-wrap gap-2" role="group" aria-label="Outfit Types">
                <button type="button" data-filter="outfitTypes" data-value="game day" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Game Day</button>
                <button type="button" data-filter="outfitTypes" data-value="formal/prom" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Formal / Prom</button>
                <button type="button" data-filter="outfitTypes" data-value="graduation" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Graduation Stoles</button>
                <button type="button" data-filter="outfitTypes" data-value="everyday" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Everyday</button>
              </div>
            </div>

            <!-- Turnaround Speed -->
            <div>
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Production Turnaround</label>
              <div class="flex flex-wrap gap-2" role="group" aria-label="Turnaround">
                <button type="button" data-filter="turnarounds" data-value="this-week" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">This Week (Rush)</button>
                <button type="button" data-filter="turnarounds" data-value="2-weeks" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">2 Weeks</button>
                <button type="button" data-filter="turnarounds" data-value="formal-ready" class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Formal Ready</button>
              </div>
            </div>
          </div>
        </div>
      `;

    case 'Photography':
      return `
        <div class="col-span-full border-b border-[#EAD5C0] pb-5 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">📸</span>
            <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-[#4A1C24]">
              Photography Specific Filters
            </h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <!-- Shoot Types -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Session / Shoot Type</label>
              <div class="flex flex-wrap gap-2" role="group" aria-label="Shoot Types">
                <button type="button" data-filter="shootTypes" data-value="graduation" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Graduation</button>
                <button type="button" data-filter="shootTypes" data-value="game day" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Game Day</button>
                <button type="button" data-filter="shootTypes" data-value="events" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Events &amp; Formals</button>
                <button type="button" data-filter="shootTypes" data-value="portraits" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Portraits</button>
                <button type="button" data-filter="shootTypes" data-value="brand content" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Brand Content</button>
              </div>
            </div>

            <!-- Photo Turnaround & Campus Travel -->
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Editing Turnaround</label>
                <div class="flex flex-wrap gap-2" role="group" aria-label="Photo Turnaround">
                  <button type="button" data-filter="photoTurnarounds" data-value="this-week" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">This Week</button>
                  <button type="button" data-filter="photoTurnarounds" data-value="2-weeks" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">2 Weeks</button>
                </div>
              </div>

              <div>
                <label class="inline-flex items-center gap-2 p-2 rounded-2xl bg-white border border-[#EAD5C0] cursor-pointer hover:border-[#4A1C24] transition-colors w-full">
                  <input type="checkbox" id="filter-travels-campus" class="w-4 h-4 rounded text-[#4A1C24] focus:ring-[#4A1C24] accent-[#4A1C24]">
                  <span class="text-xs text-[#4A1C24] font-medium font-sans">Travels to LSU Campus 🐯</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      `;

    default:
      return '';
  }
}

/**
 * Injects the complete filter panel HTML into #filter-panel-mount.
 * 
 * @param {string} categoryName 
 * @param {Function} onFilterChange 
 */
export function injectFilterPanel(categoryName, onFilterChange) {
  const mount = document.getElementById('filter-panel-mount');
  if (!mount) return;

  const categorySpecificHtml = getCategorySpecificHtml(categoryName);

  mount.innerHTML = `
    <!-- ======================================================================
         1. FILTER CONTROL BAR (Always Visible Above Grid)
         ====================================================================== -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl bg-[#F6EEE6] border border-[#EAD5C0] shadow-sm mb-6">
      
      <!-- Left side: Filters button & Clear filters link -->
      <div class="flex items-center gap-2.5">
        <button 
          id="toggle-filters-btn" 
          type="button" 
          class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A1C24] hover:bg-[#351218] text-[#F6EEE6] text-xs sm:text-sm font-heading font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
          aria-expanded="false"
          aria-controls="filter-panel"
        >
          <svg class="w-4 h-4 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
          </svg>
          <span>Filters</span>
          <span id="active-filter-badge" class="hidden px-2 py-0.5 rounded-full bg-[#E9C6CC] text-[#4A1C24] text-[10px] font-bold">0</span>
        </button>

        <button 
          id="clear-filters-btn-bar" 
          type="button" 
          class="hidden text-xs text-[#7A535A] hover:text-[#4A1C24] font-medium underline underline-offset-4 cursor-pointer transition-colors font-sans"
        >
          Clear Filters
        </button>
      </div>

      <!-- Right side: Results count & Sort Dropdown -->
      <div class="flex items-center gap-3 ml-auto">
        
        <!-- Results count display -->
        <span id="results-count" class="text-xs text-[#7A535A] font-medium font-sans">
          Showing <span class="text-[#4A1C24] font-bold">3</span> providers
        </span>

        <!-- Sort Dropdown -->
        <div class="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-full border border-[#EAD5C0] text-xs shadow-sm">
          <label for="sort-by-select" class="text-[#7A535A] font-medium shrink-0 font-sans">Sort:</label>
          <select 
            id="sort-by-select" 
            class="bg-transparent text-[#4A1C24] font-semibold focus:outline-none cursor-pointer pr-1 font-sans"
          >
            <option value="rating">Highest Rated</option>
            <option value="distance">Closest</option>
            <option value="price">Lowest Price</option>
            <option value="experience">Most Experienced</option>
          </select>
        </div>

      </div>
    </div>

    <!-- Backdrop for Mobile Drawer -->
    <div 
      id="filter-backdrop" 
      class="fixed inset-0 bg-[#4A1C24]/65 backdrop-blur-sm z-50 hidden opacity-0 pointer-events-none transition-opacity duration-300"
      aria-hidden="true"
    ></div>

    <!-- ======================================================================
         2. RESPONSIVE FILTER PANEL / DRAWER
         Cream background, burgundy headings, blush selected states
         ====================================================================== -->
    <div 
      id="filter-panel" 
      class="fixed inset-y-0 right-0 w-88 max-w-[92vw] z-50 bg-[#F6EEE6] border-l-2 border-[#EAD5C0] shadow-2xl translate-x-full transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto md:static md:w-full md:max-w-none md:z-auto md:border md:rounded-3xl md:shadow-lg md:mb-6 md:hidden"
    >
      <!-- Mobile Drawer Header -->
      <div class="p-4 border-b border-[#EAD5C0] flex items-center justify-between md:hidden bg-[#F6EEE6]">
        <div class="flex items-center gap-2">
          <span class="text-[#4A1C24] font-heading font-black text-lg uppercase tracking-wide">Filter Options</span>
          <span id="mobile-filter-badge" class="hidden px-2 py-0.5 rounded-full bg-[#E9C6CC] text-[#4A1C24] text-[10px] font-bold">0</span>
        </div>
        <button 
          id="close-filter-drawer-btn" 
          type="button" 
          class="w-9 h-9 rounded-full bg-[#EAD5C0]/60 text-[#4A1C24] hover:bg-[#4A1C24] hover:text-[#F6EEE6] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close filters drawer"
        >
          <svg class="w-4 h-4 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Filter Controls Body -->
      <div class="p-5 md:p-6 space-y-6 flex-grow overflow-y-auto bg-[#F6EEE6]">
        
        <!-- Category-Specific Section (Top of panel) -->
        ${categorySpecificHtml}

        <!-- Shared Section: 4 Column Grid on Desktop -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <!-- Col 1: Location & Distance -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 pb-1.5 border-b border-[#EAD5C0]">
              <span class="text-sm">📍</span>
              <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-[#4A1C24]">Location &amp; Radius</h4>
            </div>

            <!-- Max Radius Slider (1-25 mi) -->
            <div>
              <div class="flex items-center justify-between text-xs mb-1.5">
                <label for="filter-radius-slider" class="font-semibold text-[#7A535A] font-sans">Max Radius:</label>
                <span id="filter-radius-display" class="font-mono font-bold text-[#4A1C24]">25 mi</span>
              </div>
              <input 
                id="filter-radius-slider" 
                type="range" 
                min="1" 
                max="25" 
                value="25" 
                step="1"
                class="w-full h-2 bg-[#EAD5C0] rounded-lg appearance-none cursor-pointer accent-[#4A1C24]"
              />
              <div class="flex justify-between text-[10px] text-[#7A535A] mt-1 font-sans">
                <span>1 mi (Campus)</span>
                <span>25 mi (BR Max)</span>
              </div>
            </div>

            <!-- Quick Zones -->
            <div>
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Baton Rouge Zones</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Zones">
                <button type="button" data-zone="all" class="zone-pill px-3 py-1 rounded-full text-xs font-medium transition-all bg-[#E9C6CC] text-[#4A1C24] font-bold border border-[#D4A7B0] active-zone">All BR</button>
                <button type="button" data-zone="campus" class="zone-pill px-3 py-1 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Campus (&lt;2 mi)</button>
                <button type="button" data-zone="highland-burbank" class="zone-pill px-3 py-1 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Highland/Burbank</button>
                <button type="button" data-zone="mid-city" class="zone-pill px-3 py-1 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Mid-City</button>
                <button type="button" data-zone="downtown" class="zone-pill px-3 py-1 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Downtown</button>
              </div>
            </div>
          </div>

          <!-- Col 2: Price & Budget -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 pb-1.5 border-b border-[#EAD5C0]">
              <span class="text-sm">💵</span>
              <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-[#4A1C24]">Price &amp; Budget</h4>
            </div>

            <!-- Price Tiers -->
            <div>
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Price Tier</label>
              <div class="flex gap-2" role="group" aria-label="Price Tier">
                <button type="button" data-filter="priceTiers" data-value="$" class="filter-pill flex-1 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC] text-center">$</button>
                <button type="button" data-filter="priceTiers" data-value="$$" class="filter-pill flex-1 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC] text-center">$$</button>
                <button type="button" data-filter="priceTiers" data-value="$$$" class="filter-pill flex-1 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC] text-center">$$$</button>
              </div>
            </div>

            <!-- Max Starting Price Slider -->
            <div>
              <div class="flex items-center justify-between text-xs mb-1.5">
                <label for="filter-max-price" class="font-semibold text-[#7A535A] font-sans">Max Starting Price:</label>
                <span id="filter-price-display" class="font-mono font-bold text-[#4A1C24]">Any ($250+)</span>
              </div>
              <input 
                id="filter-max-price" 
                type="range" 
                min="20" 
                max="250" 
                value="250" 
                step="5"
                class="w-full h-2 bg-[#EAD5C0] rounded-lg appearance-none cursor-pointer accent-[#4A1C24]"
              />
              <div class="flex justify-between text-[10px] text-[#7A535A] mt-1 font-sans">
                <span>$20</span>
                <span>$250+</span>
              </div>
            </div>

            <!-- Student Discount Toggle -->
            <div class="pt-1">
              <label class="inline-flex items-center gap-2.5 p-2 rounded-2xl bg-white border border-[#EAD5C0] cursor-pointer hover:border-[#4A1C24] transition-colors w-full">
                <input type="checkbox" id="filter-student-discount" class="w-4 h-4 rounded text-[#4A1C24] focus:ring-[#4A1C24] accent-[#4A1C24]">
                <span class="text-xs text-[#4A1C24] font-medium font-sans">Offers Student Discount 🐯</span>
              </label>
            </div>
          </div>

          <!-- Col 3: Quality & Experience -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 pb-1.5 border-b border-[#EAD5C0]">
              <span class="text-sm">⭐</span>
              <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-[#4A1C24]">Quality &amp; Rating</h4>
            </div>

            <!-- Min Rating -->
            <div>
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Minimum Star Rating</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Minimum Rating">
                <button type="button" data-rating="0" class="rating-pill px-3 py-1 rounded-full text-xs font-medium transition-all bg-[#E9C6CC] text-[#4A1C24] font-bold border border-[#D4A7B0] active-rating">Any</button>
                <button type="button" data-rating="3" class="rating-pill px-3 py-1 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">3+ ★</button>
                <button type="button" data-rating="4" class="rating-pill px-3 py-1 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">4+ ★</button>
                <button type="button" data-rating="4.5" class="rating-pill px-3 py-1 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">4.5+ ★</button>
              </div>
            </div>

            <!-- Experience Tier -->
            <div>
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Years of Experience</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Experience Tier">
                <button type="button" data-filter="experienceTiers" data-value="1-2" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">1-2 yrs (Rising)</button>
                <button type="button" data-filter="experienceTiers" data-value="3-5" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">3-5 yrs</button>
                <button type="button" data-filter="experienceTiers" data-value="5+" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">5+ yrs (Master)</button>
              </div>
            </div>
          </div>

          <!-- Col 4: Delivery & Availability -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 pb-1.5 border-b border-[#EAD5C0]">
              <span class="text-sm">⚡</span>
              <h4 class="text-xs font-heading font-bold uppercase tracking-wider text-[#4A1C24]">Delivery &amp; Timing</h4>
            </div>

            <!-- Service Delivery -->
            <div>
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Service Setup</label>
              <div class="space-y-1.5">
                <label class="flex items-center gap-2 text-xs text-[#4A1C24] cursor-pointer font-sans">
                  <input type="radio" name="service-delivery-radio" value="all" checked class="text-[#4A1C24] focus:ring-[#4A1C24] accent-[#4A1C24]">
                  <span>All Setups</span>
                </label>
                <label class="flex items-center gap-2 text-xs text-[#4A1C24] cursor-pointer font-sans">
                  <input type="radio" name="service-delivery-radio" value="mobile" class="text-[#4A1C24] focus:ring-[#4A1C24] accent-[#4A1C24]">
                  <span>Mobile / Travels to Campus</span>
                </label>
                <label class="flex items-center gap-2 text-xs text-[#4A1C24] cursor-pointer font-sans">
                  <input type="radio" name="service-delivery-radio" value="studio" class="text-[#4A1C24] focus:ring-[#4A1C24] accent-[#4A1C24]">
                  <span>Studio / Home Setup</span>
                </label>
              </div>
            </div>

            <!-- Availability -->
            <div>
              <label class="block text-xs font-semibold text-[#7A535A] mb-2 font-sans">Availability Timing</label>
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Availability">
                <button type="button" data-filter="availabilities" data-value="open-this-week" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Open This Week</button>
                <button type="button" data-filter="availabilities" data-value="same-day" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Same-Day / Last-Min</button>
                <button type="button" data-filter="availabilities" data-value="bookings-open" class="filter-pill px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white border border-[#EAD5C0] text-[#4A1C24] hover:bg-[#F7E9EC]">Bookings Open</button>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Drawer / Panel Footer Actions -->
      <div class="p-4 border-t border-[#EAD5C0] flex items-center justify-between bg-[#F6EEE6] gap-3">
        <button 
          id="clear-filters-btn-panel" 
          type="button" 
          class="px-4 py-2 rounded-full border border-[#4A1C24] text-[#4A1C24] hover:bg-[#4A1C24] hover:text-[#F6EEE6] text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer"
        >
          Reset All
        </button>

        <div class="flex items-center gap-2">
          <!-- Mobile Apply / Done button -->
          <button 
            id="apply-filters-btn" 
            type="button" 
            class="px-6 py-2 rounded-full bg-[#4A1C24] hover:bg-[#351218] text-[#F6EEE6] text-xs font-heading font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            Apply Filters
          </button>

          <!-- Desktop Collapse button -->
          <button 
            id="collapse-panel-btn" 
            type="button" 
            class="hidden md:inline-flex px-4 py-2 rounded-full bg-[#EAD5C0]/50 hover:bg-[#EAD5C0] text-[#4A1C24] text-xs font-heading font-bold uppercase transition-all cursor-pointer"
          >
            Hide Panel
          </button>
        </div>
      </div>

    </div>
  `;
}
