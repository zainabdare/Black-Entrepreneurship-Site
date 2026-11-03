/**
 * js/components/NavigationDrawer.js
 * 
 * Reusable slide-out navigation side menu component.
 * Restyled with:
 * - Burgundy (#4A1C24) slide-out panel
 * - Cream (#F6EEE6) typography & links
 * - Blush Pink (#E9C6CC) & LSU Gold (#FDD023) highlights
 * - Pill-shaped menu links and close button
 */

export function injectNavigationDrawer() {
  if (document.getElementById('slide-out-menu')) {
    return; // Already present
  }

  // Detect current active page to highlight active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const drawerHtml = `
    <!-- Backdrop Overlay (Closes drawer on tap/click) -->
    <div 
      id="menu-backdrop" 
      class="fixed inset-0 bg-[#4A1C24]/60 backdrop-blur-sm z-50 hidden opacity-0 pointer-events-none transition-opacity duration-300" 
      aria-hidden="true"
    ></div>

    <!-- Slide-out Side Menu Drawer -->
    <nav 
      id="slide-out-menu" 
      class="fixed top-0 right-0 bottom-0 w-80 sm:w-96 max-w-[88vw] bg-[#4A1C24] text-[#F6EEE6] border-l border-[#E9C6CC]/25 z-50 shadow-2xl translate-x-full transition-transform duration-300 ease-in-out flex flex-col justify-between" 
      aria-label="Site Navigation Drawer"
    >
      <!-- Drawer Header -->
      <div class="p-5 sm:p-6 border-b border-[#E9C6CC]/20 flex items-center justify-between">
        <a href="index.html" class="setlist-logo on-dark group py-1 select-none" aria-label="SETLIST Marketplace Home">
          <span class="setlist-logo-main">SETLIST</span>
          <span class="setlist-logo-sub">MARKETPLACE</span>
        </a>

        <!-- Close Button (X) -->
        <button 
          id="close-menu-btn" 
          type="button" 
          class="w-10 h-10 rounded-full bg-[#351218] border border-[#E9C6CC]/30 text-[#E9C6CC] hover:text-[#F6EEE6] hover:border-[#FDD023] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#FDD023] cursor-pointer"
          aria-label="Close navigation menu"
        >
          <svg class="w-5 h-5 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Drawer Links List (Scrollable) -->
      <div class="flex-grow overflow-y-auto px-5 py-6 space-y-6">
        
        <!-- Primary Link: Home -->
        <div>
          <a 
            href="index.html" 
            class="menu-link flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${currentPath === 'index.html' || currentPath === '' ? 'bg-[#E9C6CC]/25 text-[#FDD023] border border-[#FDD023]/40' : 'text-[#F6EEE6] hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
          >
            <svg class="w-4 h-4 text-[#E9C6CC]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span class="font-heading tracking-wide">Home</span>
          </a>
        </div>

        <!-- Categories Section -->
        <div>
          <div class="px-4 pb-2 text-[11px] font-heading font-medium uppercase tracking-[0.12em] text-[#E9C6CC]">
            Browse by Category
          </div>
          <div class="space-y-1.5">
            <a 
              href="hair.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'hair.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span>Hair</span>
            </a>
            <a 
              href="nails.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'nails.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span>Nails</span>
            </a>
            <a 
              href="lashes.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'lashes.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span>Lashes</span>
            </a>
            <a 
              href="food-and-beverages.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'food-and-beverages.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span>Food &amp; Beverages</span>
            </a>
            <a 
              href="fashion.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'fashion.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span>Fashion (Custom Outfits)</span>
            </a>
            <a 
              href="photography.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'photography.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span>Photography</span>
            </a>
          </div>
        </div>

        <!-- Campus & Community Section -->
        <div class="pt-4 border-t border-[#E9C6CC]/20">
          <div class="px-4 pb-2 text-[11px] font-heading font-medium uppercase tracking-[0.12em] text-[#E9C6CC]">
            Campus &amp; Community
          </div>
          <div class="space-y-1.5">
            <a 
              href="submit-business.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'submit-business.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span>Submit Your Business</span>
            </a>
            <a 
              href="about-creators.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'about-creators.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span>About the Creators</span>
            </a>
          </div>
        </div>

        <!-- Admin Section (Subtle divider and small link) -->
        <div class="pt-4 border-t border-[#E9C6CC]/20">
          <a 
            href="admin.html" 
            class="menu-link flex items-center gap-2 px-4 py-1.5 rounded-full text-xs transition-colors ${currentPath === 'admin.html' ? 'bg-[#E9C6CC]/20 text-[#FDD023] font-medium' : 'text-[#E9C6CC]/60 hover:text-[#F6EEE6] hover:bg-[#E9C6CC]/10'}"
          >
            <svg class="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <span class="font-sans">Admin</span>
          </a>
        </div>

      </div>

      <!-- Drawer Footer -->
      <div class="p-5 border-t border-[#E9C6CC]/20 bg-[#351218] text-center space-y-2">
        <p class="text-xs text-[#E9C6CC] font-sans">
          <strong class="font-bold">SETLIST</strong> Marketplace &bull; Supporting Black Entrepreneurship Near LSU
        </p>
      </div>
    </nav>
  `;

  document.body.insertAdjacentHTML('beforeend', drawerHtml);
}

export default injectNavigationDrawer;
