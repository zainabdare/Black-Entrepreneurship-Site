/**
 * js/components/AlertsBanner.js
 * 
 * "Campus Pop-Up & Drop-Off Alerts" Banner component for the Home page.
 * Powered by Cloud Firestore "alerts" collection.
 * 
 * Features:
 * - Displays ONLY active (non-expired) alerts.
 * - Swipeable horizontal carousel on mobile & desktop with touch swipe, arrow buttons, and indicator dots.
 * - Live pulse indicator, location badge, countdown timer, and provider category tags.
 * - Graceful sample fallback if Firestore collection is newly created.
 */

import { getActiveAlerts } from '../firebase.js';

// Fallback sample alerts for initial demonstration if Firestore "alerts" is empty
function getSampleActiveAlerts() {
  const inTwoHours = new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString();
  const inFourHours = new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: "sample-alert-1",
      providerName: "Bayou Smoke BBQ & Soul Plates",
      message: "Selling hot plates at the Quad 12-2pm! Smoked ribs, mac & cheese, and peach cobbler while supplies last.",
      location: "LSU Student Quad by the Fountain",
      expirationTime: inTwoHours,
      providerCategory: "Food & Beverages",
      providerId: "sample-food-01"
    },
    {
      id: "sample-alert-2",
      providerName: "Geaux Slay Nails & Press-Ons",
      message: "Flash campus drop-off for game-day & purple-gold custom press-on sets! No pre-order needed.",
      location: "LSU Student Union Front Steps",
      expirationTime: inFourHours,
      providerCategory: "Nails",
      providerId: "sample-nails-01"
    }
  ];
}

/**
 * Calculates human-readable time remaining until expiration.
 * 
 * @param {string|Date} expTime 
 * @returns {string} e.g. "Expires in 1h 24m" or "Expiring soon"
 */
function formatTimeRemaining(expTime) {
  const diffMs = new Date(expTime) - new Date();
  if (diffMs <= 0) return "Expired";

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `Expires in ${hours}h ${minutes}m`;
  }
  return `Expires in ${minutes}m`;
}

/**
 * Injects and initializes the swipeable Campus Alerts banner.
 * 
 * @param {string} mountId Target container ID (defaults to 'campus-alerts-mount')
 */
export async function injectCampusAlertsBanner(mountId = 'campus-alerts-mount') {
  const mountEl = document.getElementById(mountId);
  if (!mountEl) return;

  // 1. Fetch active alerts from Cloud Firestore
  let activeAlerts = [];
  try {
    activeAlerts = await getActiveAlerts();
  } catch (err) {
    console.warn('[Alerts Banner] Could not load alerts from Firestore:', err);
  }

  // Fallback to sample alerts if collection has 0 documents
  if (!activeAlerts || activeAlerts.length === 0) {
    activeAlerts = getSampleActiveAlerts();
  }

  // Double check: filter out any that might have expired in the meantime
  const now = new Date();
  activeAlerts = activeAlerts.filter(a => new Date(a.expirationTime) > now);

  if (activeAlerts.length === 0) {
    mountEl.innerHTML = '';
    return;
  }

  // 2. Render Banner HTML
  mountEl.innerHTML = `
    <div class="relative bg-gradient-to-r from-purple-950 via-slate-950 to-lsu-purple-dark border-b border-lsu-gold/30 shadow-xl overflow-hidden">
      
      <!-- Subtle Ambient Glow -->
      <div class="absolute -top-10 left-1/4 w-72 h-72 bg-lsu-gold/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-10 right-1/4 w-72 h-72 bg-lsu-purple/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        
        <!-- Banner Top Bar: Title & Navigation Controls -->
        <div class="flex items-center justify-between mb-2.5">
          <div class="flex items-center gap-2.5">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span class="text-xs sm:text-sm font-heading font-black text-lsu-gold uppercase tracking-wider flex items-center gap-1.5">
              <span>Campus Pop-Up &amp; Drop-Off Alerts</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                LIVE NOW
              </span>
            </span>
          </div>

          <!-- Carousel Controls & Admin Link -->
          <div class="flex items-center gap-2">
            ${activeAlerts.length > 1 ? `
              <div class="flex items-center gap-1">
                <button 
                  id="alert-prev-btn" 
                  type="button" 
                  class="w-7 h-7 rounded-lg bg-slate-900/80 hover:bg-lsu-purple border border-slate-700 hover:border-lsu-gold text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs cursor-pointer shadow-sm"
                  aria-label="Previous alert"
                >
                  &larr;
                </button>
                <button 
                  id="alert-next-btn" 
                  type="button" 
                  class="w-7 h-7 rounded-lg bg-slate-900/80 hover:bg-lsu-purple border border-slate-700 hover:border-lsu-gold text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs cursor-pointer shadow-sm"
                  aria-label="Next alert"
                >
                  &rarr;
                </button>
              </div>
            ` : ''}

            <a 
              href="admin-alerts.html" 
              class="text-[11px] font-mono font-semibold text-purple-300 hover:text-lsu-gold transition-colors flex items-center gap-1 px-2 py-1 rounded bg-slate-900/60 border border-purple-900/50"
              title="Post or manage campus alerts"
            >
              <span>⚙️</span>
              <span class="hidden sm:inline">Admin</span>
            </a>
          </div>
        </div>

        <!-- Swipeable / Scrollable Carousel Track -->
        <div 
          id="alerts-scroll-track" 
          class="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-1"
          style="scroll-behavior: smooth;"
        >
          ${activeAlerts.map((alert, idx) => `
            <div 
              class="alert-slide flex-shrink-0 w-full md:w-[calc(50%-8px)] lg:w-[calc(50%-8px)] snap-start rounded-xl sm:rounded-2xl bg-slate-900/80 border border-purple-900/50 hover:border-lsu-gold/50 p-4 transition-all shadow-md group flex flex-col justify-between"
              data-index="${idx}"
            >
              <div class="space-y-2">
                <!-- Provider Name & Tag -->
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs sm:text-sm font-heading font-extrabold text-white group-hover:text-lsu-gold transition-colors flex items-center gap-1.5">
                    <span>📢</span>
                    <span>${alert.providerName}</span>
                  </span>
                  ${alert.providerCategory ? `
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lsu-purple/40 text-purple-200 border border-purple-800">
                      ${alert.providerCategory}
                    </span>
                  ` : ''}
                </div>

                <!-- Alert Message -->
                <p class="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                  "${alert.message}"
                </p>
              </div>

              <!-- Metadata Strip: Location & Expiration -->
              <div class="pt-3 mt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                
                <!-- Campus Location Badge -->
                <div class="flex items-center gap-1.5 text-lsu-gold font-semibold">
                  <span>📍</span>
                  <span class="text-slate-200">${alert.location}</span>
                </div>

                <!-- Expiration Countdown Badge -->
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <span>⏳</span>
                    <span>${formatTimeRemaining(alert.expirationTime)}</span>
                  </span>

                  ${alert.providerId ? `
                    <a 
                      href="food-and-beverages.html?provider=${alert.providerId}" 
                      class="text-[11px] font-heading font-bold text-lsu-gold hover:underline flex items-center gap-0.5"
                    >
                      <span>Profile</span>
                      <span>&rarr;</span>
                    </a>
                  ` : ''}
                </div>

              </div>
            </div>
          `).join('')}
        </div>

        <!-- Carousel Pagination Dots (if > 1 alert) -->
        ${activeAlerts.length > 1 ? `
          <div class="flex items-center justify-center gap-1.5 pt-2">
            ${activeAlerts.map((_, i) => `
              <button 
                type="button" 
                class="alert-dot-btn w-2 h-2 rounded-full transition-all cursor-pointer ${i === 0 ? 'bg-lsu-gold w-5' : 'bg-slate-700 hover:bg-slate-500'}"
                data-slide="${i}"
                aria-label="Go to alert slide ${i + 1}"
              ></button>
            `).join('')}
          </div>
        ` : ''}

      </div>

    </div>
  `;

  // 3. Carousel Interactions (Touch swipe + Next/Prev buttons + Dots)
  const track = document.getElementById('alerts-scroll-track');
  const prevBtn = document.getElementById('alert-prev-btn');
  const nextBtn = document.getElementById('alert-next-btn');
  const dots = document.querySelectorAll('.alert-dot-btn');

  if (!track) return;

  function updateActiveDot(index) {
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.className = 'alert-dot-btn h-2 rounded-full transition-all cursor-pointer bg-lsu-gold w-5';
      } else {
        dot.className = 'alert-dot-btn h-2 w-2 rounded-full transition-all cursor-pointer bg-slate-700 hover:bg-slate-500';
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const slideWidth = track.firstElementChild?.clientWidth || 300;
      track.scrollBy({ left: -(slideWidth + 16), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const slideWidth = track.firstElementChild?.clientWidth || 300;
      track.scrollBy({ left: slideWidth + 16, behavior: 'smooth' });
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIdx = parseInt(dot.dataset.slide, 10);
      const slides = track.querySelectorAll('.alert-slide');
      if (slides[slideIdx]) {
        slides[slideIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        updateActiveDot(slideIdx);
      }
    });
  });

  // Track scroll position to update dots
  track.addEventListener('scroll', () => {
    const slideWidth = track.firstElementChild?.clientWidth || 300;
    const scrollPos = track.scrollLeft;
    const activeIdx = Math.round(scrollPos / (slideWidth + 16));
    updateActiveDot(Math.min(activeIdx, dots.length - 1));
  }, { passive: true });
}

export default injectCampusAlertsBanner;
