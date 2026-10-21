/**
 * js/components/ImpactCounter.js
 * 
 * Community Impact Counter component for Black-Owned BR Home Page.
 * Restyled with:
 * - Editorial Palette: Cream background, Burgundy, Blush Pink, and Sand color blocks
 * - Chunky "Lilita One" display font with "Caveat" script word accents
 * - Rounded 3xl corners & warm soft shadows
 * - Fully rounded pill-shaped buttons and badges
 * - Animated count-up on scroll
 */

import { getImpactStats } from '../firebase.js';

/**
 * Easing function for smooth number count-up.
 */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Animates a single counter element from start to end value.
 */
export function animateCounterNumber(element, startVal, endVal, duration = 2000, suffix = '+') {
  if (!element) return;
  const target = Math.max(0, parseInt(endVal, 10) || 0);
  const start = Math.max(0, parseInt(startVal, 10) || 0);

  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);

    const currentNumber = Math.floor(start + (target - start) * easedProgress);
    element.textContent = currentNumber.toLocaleString() + suffix;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = target.toLocaleString() + suffix;
    }
  }

  window.requestAnimationFrame(step);
}

/**
 * Initializes IntersectionObserver to trigger count-up when the impact section scrolls into view.
 */
export function setupScrollAnimation(sectionElement) {
  if (!sectionElement) return;

  const counterElements = sectionElement.querySelectorAll('.impact-counter-val');
  if (counterElements.length === 0) return;

  let hasAnimated = false;

  const triggerAnimation = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    counterElements.forEach((el, index) => {
      const targetVal = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix !== undefined ? el.dataset.suffix : '+';
      setTimeout(() => {
        animateCounterNumber(el, 0, targetVal, 1900, suffix);
      }, index * 90);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerAnimation();
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(sectionElement);
  } else {
    triggerAnimation();
  }
}

/**
 * Injects and initializes the Community Impact Counter into the given mount point.
 */
export async function injectImpactCounter(mountId = 'community-impact-mount', providers = []) {
  const mount = document.getElementById(mountId);
  if (!mount) {
    console.warn(`[ImpactCounter] Mount container #${mountId} not found in DOM.`);
    return;
  }

  // 1. Fetch current impact metrics from Firestore (with fallbacks)
  const stats = await getImpactStats(providers);

  // 2. Render Component Markup (Heading and mission paragraph only)
  mount.innerHTML = `
    <section id="community-impact-section" class="py-12 sm:py-16 bg-[#F6EEE6] border-b border-[#EAD5C0]/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto">
          <h2 class="text-3xl sm:text-5xl font-heading font-black text-[#4A1C24] tracking-tight leading-tight sm:leading-none">
            Empowering Black Business, ONE <span class="script-word text-[#4A1C24]">booking</span> AT A TIME
          </h2>

          <p class="mt-4 text-sm sm:text-base text-[#7A535A] leading-relaxed max-w-2xl mx-auto font-sans">
            Every profile view, social link, direct appointment, and student review directly recirculates the Tiger dollar into Baton Rouge’s Black creative economy.
          </p>
        </div>

      </div>
    </section>
  `;

  // 3. Attach scroll-triggered counting animation
  const sectionEl = document.getElementById('community-impact-section');
  if (sectionEl) {
    setupScrollAnimation(sectionEl);
  }
}

export default injectImpactCounter;
