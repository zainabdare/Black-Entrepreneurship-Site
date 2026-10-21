/**
 * js/components/AlertsBanner.js
 * 
 * "Campus Pop-Up & Drop-Off Alerts" Banner component for the Home page.
 * Restyled with:
 * - Burgundy (#4A1C24) and Blush Pink palette
 * - Lilita One and Caveat script typography
 * - Pill-shaped buttons and soft rounded cards
 * - Active alerts swipeable carousel
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

  // Filter out expired alerts
  const now = new Date();
  activeAlerts = activeAlerts.filter(a => new Date(a.expirationTime) > now);

  if (activeAlerts.length === 0) {
    mountEl.innerHTML = '';
    return;
  }

  // 2. Render Banner HTML
  mountEl.innerHTML = `
    <div class="relative bg-[#4A1C24] text-[#F6EEE6] border-b border-[#E9C6CC]/30 shadow-md overflow-hidden">
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        
        <!-- Banner Top Bar: Title & Navigation Controls -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FDD023] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-[#FDD023]"></span>
            </span>
            <span class="text-xs sm:text-sm font-heading font-black text-[#F6EEE6] uppercase tracking-wider flex items-center gap-2">
              <span>Campus Pop-Up &amp; <span class="script-word text-[#E9C6CC]">drop-off</span> Alerts</span>
              <span class="text-[10px] font-heading font-black px-2.5 py-0.5 rounded-full bg-[#E9C6CC]/25 text-[#FDD023] border border-[#FDD023]/40">
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
                  class="w-8 h-8 rounded-full bg-[#351218] hover:bg-[#5F2630] border border-[#E9C6CC]/30 text-[#F6EEE6] flex items-center justify-center transition-colors text-xs cursor-pointer shadow-sm"
                  aria-label="Previous alert"
                >
                  &larr;
                </button>
                <button 
                  id="alert-next-btn" 
                  type="button" 
                  class="w-8 h-8 rounded-full bg-[#351218] hover:bg-[#5F2630] border border-[#E9C6CC]/30 text-[#F6EEE6] flex items-center justify-center transition-colors text-xs cursor-pointer shadow-sm"
                  aria-label="Next alert"
                >
                  &rarr;
                </button>
              </div>
            ` : ''}

            <a 
              href="admin-alerts.html" 
              class="text-[11px] font-heading font-black text-[#E9C6CC] hover:text-[#FDD023] transition-colors flex items-center gap-1 px-3 py-1 rounded-full bg-[#351218] border border-[#E9C6CC]/30"
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
              class="alert-slide flex-shrink-0 w-full md:w-[calc(50%-8px)] lg:w-[calc(50%-8px)] snap-start rounded-2xl bg-[#351218]/90 border border-[#E9C6CC]/30 hover:border-[#FDD023]/50 p-4 sm:p-5 transition-all shadow-md group flex flex-col justify-between"
              data-index="${idx}"
            >
              <div class="space-y-2">
                <!-- Provider Name & Tag -->
                <div class="flex items-center justify-between gap-2">
                  <span class="text-sm font-heading font-black text-[#F6EEE6] group-hover:text-[#FDD023] transition-colors flex items-center gap-2">
                    <span>📢</span>
                    <span>${alert.providerName}</span>
                  </span>
                  ${alert.providerCategory ? `
                    <span class="text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-full bg-[#E9C6CC]/20 text-[#E9C6CC] border border-[#E9C6CC]/30">
                      ${alert.providerCategory}
                    </span>
                  ` : ''}
                </div>

                <!-- Alert Message -->
                <p class="text-xs sm:text-sm text-[#F6EEE6]/90 font-sans leading-relaxed">
                  "${alert.message}"
                </p>
              </div>

              <!-- Metadata Strip: Location & Expiration -->
              <div class="pt-3 mt-3 border-t border-[#E9C6CC]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                
                <!-- Campus Location Badge -->
                <div class="flex items-center gap-1.5 text-[#FDD023] font-semibold">
                  <span>📍</span>
                  <span class="text-[#F6EEE6] font-medium">${alert.location}</span>
                </div>

                <!-- Expiration Countdown Badge -->
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#E9C6CC]/20 text-[#E9C6CC] border border-[#E9C6CC]/30">
                    <span>⏳</span>
                    <span>${formatTimeRemaining(alert.expirationTime)}</span>
                  </span>

                  ${alert.providerId ? `
                    <button 
                      type="button" 
                      class="open-provider-modal-btn text-[11px] font-heading font-bold text-[#FDD023] hover:underline cursor-pointer flex items-center gap-1"
                      data-provider-id="${alert.providerId}"
                    >
                      <span>Profile</span>
                      <span>&rarr;</span>
                    </button>
                  ` : ''}
                </div>
              </div>

            </div>
          `).join('')}
        </div>

        <!-- Carousel Indicators (Dots) if > 1 Alert -->
        ${activeAlerts.length > 1 ? `
          <div id="alerts-carousel-dots" class="flex items-center justify-center gap-1.5 pt-3">
            ${activeAlerts.map((_, i) => `
              <button 
                type="button" 
                class="carousel-dot h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'w-6 bg-[#FDD023]' : 'w-2 bg-[#E9C6CC]/40'}"
                data-dot-index="${i}"
                aria-label="Go to alert ${i + 1}"
              ></button>
            `).join('')}
          </div>
        ` : ''}

      </div>
    </div>
  `;

  // 3. Attach Carousel Controls & Scroll Syncing
  const track = document.getElementById('alerts-scroll-track');
  const prevBtn = document.getElementById('alert-prev-btn');
  const nextBtn = document.getElementById('alert-next-btn');
  const dots = document.querySelectorAll('#alerts-carousel-dots .carousel-dot');

  if (track && activeAlerts.length > 1) {
    const updateDots = () => {
      const scrollPos = track.scrollLeft;
      const slideWidth = track.firstElementChild ? track.firstElementChild.offsetWidth : 300;
      const activeIdx = Math.round(scrollPos / (slideWidth + 16));

      dots.forEach((dot, idx) => {
        if (idx === activeIdx) {
          dot.classList.remove('w-2', 'bg-[#E9C6CC]/40');
          dot.classList.add('w-6', 'bg-[#FDD023]');
        } else {
          dot.classList.remove('w-6', 'bg-[#FDD023]');
          dot.classList.add('w-2', 'bg-[#E9C6CC]/40');
        }
      });
    };

    track.addEventListener('scroll', updateDots, { passive: true });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const slideWidth = track.firstElementChild ? track.firstElementChild.offsetWidth : 300;
        track.scrollBy({ left: -(slideWidth + 16), behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const slideWidth = track.firstElementChild ? track.firstElementChild.offsetWidth : 300;
        track.scrollBy({ left: (slideWidth + 16), behavior: 'smooth' });
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.dotIndex, 10);
        const slideWidth = track.firstElementChild ? track.firstElementChild.offsetWidth : 300;
        track.scrollTo({ left: idx * (slideWidth + 16), behavior: 'smooth' });
      });
    });
  }
}

export default injectCampusAlertsBanner;
