/**
 * js/app.js
 * Main JavaScript entry point for the LSU Black Entrepreneur Service Directory.
 * 
 * BEGINNER GUIDE:
 * Because this file is loaded in index.html with:
 *    <script type="module" src="js/app.js"></script>
 * we can freely use "import" statements to load code from other files in our project!
 * 
 * IMPORTANT:
 * ES Modules rely on the browser's fetch/CORS mechanism. Therefore, you must preview
 * this project using a local HTTP server (like Live Server or Python http.server)
 * rather than double-clicking the HTML file in file explorer (file:// protocol).
 */

// 1. Import utilities and data from our modular subfolders
import { LSU_COORDINATES, calculateDistance } from './utils/distance.js';
import { DIRECTORY_METADATA } from './data/directoryData.js';

// 2. Log confirmation to the browser console (Press F12 to view)
console.log('%c🐯 LSU Black Entrepreneur Directory loaded successfully!', 'color: #FDD023; background: #461D7C; font-size: 14px; padding: 4px 8px; border-radius: 4px;');
console.log('Campus Origin:', LSU_COORDINATES.name);
console.log('Max Search Radius:', DIRECTORY_METADATA.maxRadiusMiles, 'miles');

// 3. Verify ES Module execution on the page once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const statusPill = document.getElementById('js-status');
  const messageElement = document.getElementById('module-test-message');
  const testButton = document.getElementById('test-btn');

  // Update status pill to confirm module is loaded
  if (statusPill) {
    statusPill.textContent = 'ES Modules Connected';
    statusPill.classList.add('text-emerald-300');
  }

  // Update module test box
  if (messageElement) {
    messageElement.innerHTML = `
      <span class="text-emerald-400 font-semibold">&check; Modules loaded:</span> 
      Linked to <span class="text-lsu-gold">${LSU_COORDINATES.name}</span> 
      (Max radius: ${DIRECTORY_METADATA.maxRadiusMiles} mi).
    `;
  }

  // Interactive verification button
  if (testButton) {
    let clickCount = 0;
    testButton.addEventListener('click', () => {
      clickCount++;
      // Calculate a sample distance (e.g., Downtown Baton Rouge to LSU)
      const downtownBRLat = 30.4515;
      const downtownBRLon = -91.1871;
      const dist = calculateDistance(downtownBRLat, downtownBRLon);

      testButton.textContent = `Verified! (Click #${clickCount})`;
      testButton.classList.remove('bg-lsu-gold');
      testButton.classList.add('bg-emerald-400', 'text-slate-900');

      if (messageElement) {
        messageElement.innerHTML = `
          <strong class="text-emerald-300">JavaScript ES Modules are fully working!</strong><br>
          <span class="text-slate-300">Calculated distance from Downtown Baton Rouge to LSU: <strong class="text-lsu-gold">${dist} miles</strong>.</span>
        `;
      }
    });
  }
});
