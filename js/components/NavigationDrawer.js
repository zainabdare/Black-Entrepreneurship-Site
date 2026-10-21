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
        <a href="index.html" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-full bg-[#351218] border border-[#FDD023]/60 flex items-center justify-center font-heading font-black text-[#FDD023] text-sm shadow-md group-hover:border-[#FDD023] transition-colors">
            LSU
          </div>
          <div>
            <span class="font-heading font-black text-[#F6EEE6] text-lg block leading-none group-hover:text-[#FDD023] transition-colors">
              BLACK-OWNED <span class="script-word text-[#E9C6CC]">br</span>
            </span>
            <span class="text-[11px] text-[#E9C6CC]/80 font-sans tracking-wide">Navigation Menu</span>
          </div>
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
            <span class="text-base">🏠</span>
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
              <span class="text-base">💇🏾‍♀️</span>
              <span>Hair</span>
            </a>
            <a 
              href="nails.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'nails.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span class="text-base">💅🏾</span>
              <span>Nails</span>
            </a>
            <a 
              href="lashes.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'lashes.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span class="text-base">👁️</span>
              <span>Lashes</span>
            </a>
            <a 
              href="food-and-beverages.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'food-and-beverages.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span class="text-base">🍽️</span>
              <span>Food &amp; Beverages</span>
            </a>
            <a 
              href="fashion.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'fashion.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span class="text-base">🧥</span>
              <span>Fashion (Custom Outfits)</span>
            </a>
            <a 
              href="photography.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'photography.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span class="text-base">📸</span>
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
                <span class="text-base">🎓</span>
                <span>Seasonal Hubs</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDD023]/20 text-[#FDD023] border border-[#FDD023]/40 font-heading">New</span>
            </a>
            <a 
              href="submit-business.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'submit-business.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span class="text-base">📝</span>
              <span>Submit Your Business</span>
            </a>
            <a 
              href="about-creators.html" 
              class="menu-link flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'about-creators.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <span class="text-base">🐯</span>
              <span>About the Creators</span>
            </a>
            <a 
              href="admin-alerts.html" 
              class="menu-link flex items-center justify-between px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPath === 'admin-alerts.html' ? 'bg-[#E9C6CC]/25 text-[#FDD023] font-bold border border-[#FDD023]/40' : 'text-[#F6EEE6]/90 hover:bg-[#E9C6CC]/15 hover:text-[#FDD023]'}"
            >
              <div class="flex items-center gap-3">
                <span class="text-base">📢</span>
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
          Supporting Black Entrepreneurship within 25 Miles of LSU
        </p>
        <div class="flex items-center justify-center gap-3 text-[11px] font-mono text-[#F6EEE6]/80">
          <a href="admin-alerts.html" class="hover:text-[#FDD023] transition-colors">
            📢 Pop-Up Alerts
          </a>
          <span>&bull;</span>
          <a href="seed.html" class="hover:text-[#FDD023] transition-colors">
            🔥 Firestore Seeder
          </a>
        </div>
      </div>
    </nav>
  `;

  document.body.insertAdjacentHTML('beforeend', drawerHtml);
}

export default injectNavigationDrawer;
