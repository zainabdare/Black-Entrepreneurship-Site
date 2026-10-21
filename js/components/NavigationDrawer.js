/**
 * js/components/NavigationDrawer.js
 * 
 * Reusable slide-out navigation side menu component.
 * Automatically injects the slide-out drawer and backdrop overlay into document.body.
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
      class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 hidden opacity-0 pointer-events-none transition-opacity duration-300" 
      aria-hidden="true"
    ></div>

    <!-- Slide-out Side Menu Drawer -->
    <nav 
      id="slide-out-menu" 
      class="fixed top-0 right-0 bottom-0 w-80 sm:w-96 max-w-[88vw] bg-slate-950 border-l border-purple-900/40 z-50 shadow-2xl translate-x-full transition-transform duration-300 ease-in-out flex flex-col justify-between" 
      aria-label="Site Navigation Drawer"
    >
      <!-- Drawer Header -->
      <div class="p-5 border-b border-purple-900/30 flex items-center justify-between">
        <a href="index.html" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-lsu-purple to-purple-950 border border-lsu-gold/40 flex items-center justify-center font-heading font-black text-lsu-gold text-sm shadow-md group-hover:border-lsu-gold transition-colors">
            LSU
          </div>
          <div>
            <span class="font-heading font-bold text-white text-base block leading-none group-hover:text-lsu-gold transition-colors">
              Black-Owned BR
            </span>
            <span class="text-[11px] text-slate-400">Navigation Menu</span>
          </div>
        </a>

        <!-- Close Button (X) -->
        <button 
          id="close-menu-btn" 
          type="button" 
          class="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-lsu-gold/40 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-lsu-gold cursor-pointer"
          aria-label="Close navigation menu"
        >
          <svg class="w-5 h-5 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Drawer Links List (Scrollable) -->
      <div class="flex-grow overflow-y-auto px-4 py-5 space-y-6">
        
        <!-- Primary Link: Home -->
        <div>
          <a 
            href="index.html" 
            class="menu-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${currentPath === 'index.html' || currentPath === '' ? 'bg-lsu-purple/30 text-lsu-gold border border-lsu-gold/30' : 'text-white hover:bg-lsu-purple/20 hover:text-lsu-gold'}"
          >
            <span class="text-base">🏠</span>
            <span>Home</span>
          </a>
        </div>

        <!-- Categories Section -->
        <div>
          <div class="px-3.5 pb-2 text-[10px] font-heading font-bold uppercase tracking-wider text-lsu-gold/80">
            Browse by Category
          </div>
          <div class="space-y-1">
            <a 
              href="hair.html" 
              class="menu-link flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${currentPath === 'hair.html' ? 'bg-lsu-purple/30 text-lsu-gold font-bold border border-lsu-gold/30' : 'text-slate-300 hover:bg-lsu-purple/20 hover:text-lsu-gold'}"
            >
              <span class="text-base">💇🏾‍♀️</span>
              <span>Hair</span>
            </a>
            <a 
              href="nails.html" 
              class="menu-link flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${currentPath === 'nails.html' ? 'bg-lsu-purple/30 text-lsu-gold font-bold border border-lsu-gold/30' : 'text-slate-300 hover:bg-lsu-purple/20 hover:text-lsu-gold'}"
            >
              <span class="text-base">💅🏾</span>
              <span>Nails</span>
            </a>
            <a 
              href="lashes.html" 
              class="menu-link flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${currentPath === 'lashes.html' ? 'bg-lsu-purple/30 text-lsu-gold font-bold border border-lsu-gold/30' : 'text-slate-300 hover:bg-lsu-purple/20 hover:text-lsu-gold'}"
            >
              <span class="text-base">👁️</span>
              <span>Lashes</span>
            </a>
            <a 
              href="food-and-beverages.html" 
              class="menu-link flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${currentPath === 'food-and-beverages.html' ? 'bg-lsu-purple/30 text-lsu-gold font-bold border border-lsu-gold/30' : 'text-slate-300 hover:bg-lsu-purple/20 hover:text-lsu-gold'}"
            >
              <span class="text-base">🍽️</span>
              <span>Food &amp; Beverages</span>
            </a>
            <a 
              href="fashion.html" 
              class="menu-link flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${currentPath === 'fashion.html' ? 'bg-lsu-purple/30 text-lsu-gold font-bold border border-lsu-gold/30' : 'text-slate-300 hover:bg-lsu-purple/20 hover:text-lsu-gold'}"
            >
              <span class="text-base">🧥</span>
              <span>Fashion (Custom Outfits)</span>
            </a>
            <a 
              href="photography.html" 
              class="menu-link flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${currentPath === 'photography.html' ? 'bg-lsu-purple/30 text-lsu-gold font-bold border border-lsu-gold/30' : 'text-slate-300 hover:bg-lsu-purple/20 hover:text-lsu-gold'}"
            >
              <span class="text-base">📸</span>
              <span>Photography</span>
            </a>
          </div>
        </div>

        <!-- Campus & Community Section -->
        <div class="pt-4 border-t border-purple-900/30">
          <div class="px-3.5 pb-2 text-[10px] font-heading font-bold uppercase tracking-wider text-lsu-gold/80">
            Campus &amp; Community
          </div>
          <div class="space-y-1">
            <a 
              href="seasonal-hubs.html" 
              class="menu-link flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${currentPath === 'seasonal-hubs.html' ? 'bg-lsu-purple/30 text-lsu-gold font-bold border border-lsu-gold/30' : 'text-slate-300 hover:bg-lsu-purple/20 hover:text-lsu-gold'}"
            >
              <div class="flex items-center gap-3">
                <span class="text-base">🎓</span>
                <span>Seasonal Hubs</span>
              </div>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-lsu-gold/20 text-lsu-gold border border-lsu-gold/30">New</span>
            </a>
            <a 
              href="submit-business.html" 
              class="menu-link flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${currentPath === 'submit-business.html' ? 'bg-lsu-purple/30 text-lsu-gold font-bold border border-lsu-gold/30' : 'text-slate-300 hover:bg-lsu-purple/20 hover:text-lsu-gold'}"
            >
              <span class="text-base">📝</span>
              <span>Submit Your Business</span>
            </a>
            <a 
              href="about-creators.html" 
              class="menu-link flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${currentPath === 'about-creators.html' ? 'bg-lsu-purple/30 text-lsu-gold font-bold border border-lsu-gold/30' : 'text-slate-300 hover:bg-lsu-purple/20 hover:text-lsu-gold'}"
            >
              <span class="text-base">🐯</span>
              <span>About the Creators</span>
            </a>
            <a 
              href="admin-alerts.html" 
              class="menu-link flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${currentPath === 'admin-alerts.html' ? 'bg-lsu-purple/30 text-lsu-gold font-bold border border-lsu-gold/30' : 'text-slate-300 hover:bg-lsu-purple/20 hover:text-lsu-gold'}"
            >
              <div class="flex items-center gap-3">
                <span class="text-base">📢</span>
                <span>Pop-Up Alerts Admin</span>
              </div>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">Live</span>
            </a>
          </div>
        </div>

      </div>

      <!-- Drawer Footer -->
      <div class="p-4 border-t border-purple-900/30 bg-slate-950/90 text-center space-y-1.5">
        <p class="text-[11px] text-slate-400">
          Supporting Black Entrepreneurship within 25 Miles of LSU
        </p>
        <div class="flex items-center justify-center gap-3 text-[10px] font-mono text-purple-300">
          <a href="admin-alerts.html" class="hover:text-lsu-gold transition-colors">
            📢 Pop-Up Alerts
          </a>
          <span>&bull;</span>
          <a href="seed.html" class="hover:text-lsu-gold transition-colors">
            🔥 Firestore Seeder
          </a>
        </div>
      </div>
    </nav>
  `;

  document.body.insertAdjacentHTML('beforeend', drawerHtml);
}

export default injectNavigationDrawer;
