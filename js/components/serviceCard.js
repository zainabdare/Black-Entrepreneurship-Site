/**
 * js/components/serviceCard.js
 * Component template function for rendering business directory cards.
 * 
 * BEGINNER GUIDE:
 * In Vanilla JavaScript (without React or Vue), components are often simple
 * functions that take a data object and return an HTML string or DOM element!
 */

/**
 * Creates an HTML template string for a service provider card.
 * @param {Object} provider - Provider business data
 * @returns {string} HTML markup string
 */
export function createServiceCard(provider) {
  return `
    <div class="p-5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-lsu-gold/50 transition-all duration-300">
      <div class="flex items-start justify-between">
        <div>
          <span class="inline-block text-xs font-medium text-lsu-gold bg-lsu-purple/40 px-2.5 py-0.5 rounded-full mb-2">
            ${provider.category}
          </span>
          <h4 class="text-base font-heading font-bold text-white">${provider.businessName}</h4>
        </div>
        <span class="text-xs text-slate-400 font-mono">
          ${provider.distanceFromLSU} mi
        </span>
      </div>
      <p class="text-xs text-slate-300 mt-2">${provider.description}</p>
    </div>
  `;
}
