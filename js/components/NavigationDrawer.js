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
        <a href="index.html" class="flex items-center gap-2.5 group" aria-label="BLKENTRE Home">
          <svg class="h-8 w-auto text-[#F6EEE6]" viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="32" height="32" rx="16" fill="#F6EEE6"/>
            <path d="M12 9.5H19.5C22.5 9.5 24.5 11 24.5 13.5C24.5 15.2 23.5 16.3 22 16.8C24 17.3 25.2 18.6 25.2 20.7C25.2 23.5 22.8 25.5 19.5 25.5H12V9.5ZM16.2 12.8V15.7H19.2C20.5 15.7 21.3 15 21.3 14.2C21.3 13.4 20.5 12.8 19.2 12.8H16.2ZM16.2 18.8V22.2H19.5C20.9 22.2 21.9 21.5 21.9 20.5C21.9 19.5 20.9 18.8 19.5 18.8H16.2Z" fill="#4A1C24"/>
            <text x="44" y="26" font-family="'Lilita One', cursive, sans-serif" font-size="22" font-weight="900" fill="#F6EEE6" letter-spacing="0.5">BLKENTRE</text>
          </svg>
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
          <div class="px-4 pb-2 text-[11px] font-heading font-bold uppercase tracking-wider text-[#E9C6CC]">
            Browse by <span class="script-word text-white">category</span>
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
          <div class="px-4 pb-2 text-[11px] font-heading font-bold uppercase tracking-wider text-[#E9C6CC]">
            Campus &amp; <span class="script-word text-white">community</span>
          </div>
          <div class="space-y-1.5">
            <a 
              href="seasonal-hubs.html" 
              class="menu-link flex items-center justify-between px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'seasonal-hubs.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <div class="flex items-center gap-3">
                <span>Seasonal Hubs</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDD023]/20 text-[#FDD023] border border-[#FDD023]/40 font-heading">New</span>
            </a>
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
            <a 
              href="admin-alerts.html" 
              class="menu-link flex items-center justify-between px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'admin-alerts.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <div class="flex items-center gap-3">
                <span>Pop-Up Alerts Admin</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9C6CC]/20 text-[#E9C6CC] border border-[#E9C6CC]/30 font-mono">Admin</span>
            </a>
          </div>
        </div>

      </div>

      <!-- Drawer Footer -->
      <div class="p-5 border-t border-[#E9C6CC]/20 bg-[#351218] text-center space-y-2">
        <p class="text-xs text-[#E9C6CC] font-sans">
          BLKENTRE &bull; Supporting Black Entrepreneurship Near LSU
        </p>
        <div class="flex items-center justify-center gap-3 text-[11px] font-mono text-[#F6EEE6]/80">
          <a href="admin-alerts.html" class="hover:text-[#FDD023] transition-colors">
            Pop-Up Alerts
          </a>
          <span>&bull;</span>
          <a href="seed.html" class="hover:text-[#FDD023] transition-colors">
            Firestore Seeder
          </a>
        </div>
      </div>
    </nav>
  `;

  document.body.insertAdjacentHTML('beforeend', drawerHtml);
}

export default injectNavigationDrawer;
