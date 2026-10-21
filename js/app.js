/**
 * js/app.js
 * Main JavaScript controller for Black-Owned BR.
 * 
 * BEGINNER GUIDE:
 * This file handles interactive layout behaviors (like opening and closing the
 * mobile navigation menu on phone screens and wiring up the hero search input).
 * 
 * In upcoming steps, this is where we will hook up search filters and render
 * provider cards from src/data/providers.js!
 */

// Import sample providers data to confirm module resolution
import { SAMPLE_PROVIDERS } from './data/providers.js';

console.log('%c🐯 Black-Owned BR: Main layout loaded successfully!', 'color: #FDD023; background: #461D7C; font-size: 14px; padding: 4px 8px; border-radius: 4px;');
console.log(`Loaded ${SAMPLE_PROVIDERS.length} sample providers ready for directory rendering.`);

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Mobile Navigation Hamburger Menu Toggle
  // -------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      const willExpand = !isExpanded;

      mobileMenuBtn.setAttribute('aria-expanded', String(willExpand));
      mobileMenu.classList.toggle('hidden', !willExpand);

      // Toggle icons between hamburger and 'X'
      if (hamburgerIcon && closeIcon) {
        hamburgerIcon.classList.toggle('hidden', willExpand);
        hamburgerIcon.classList.toggle('block', !willExpand);
        closeIcon.classList.toggle('hidden', !willExpand);
        closeIcon.classList.toggle('block', willExpand);
      }
    });

    // Close the mobile menu whenever any navigation link inside it is tapped
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (hamburgerIcon && closeIcon) {
          hamburgerIcon.classList.remove('hidden');
          hamburgerIcon.classList.add('block');
          closeIcon.classList.add('hidden');
          closeIcon.classList.remove('block');
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 2. Hero Search Bar Handler
  // -------------------------------------------------------------------------
  const searchForm = document.getElementById('hero-search-form');
  const searchInput = document.getElementById('hero-search-input');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      console.log('Search query submitted:', query);
      
      // Smooth scroll down to the directory content area
      const mainContent = document.getElementById('main-directory-content');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. Popular Tag Chips
  // Clicking a suggestion fills the search bar and focuses it
  // -------------------------------------------------------------------------
  const tagChips = document.querySelectorAll('.search-tag-chip');
  tagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (searchInput) {
        // Strip emoji icons if any, or keep clean keyword
        const rawText = chip.textContent.trim();
        const cleanQuery = rawText.replace(/^[^\w\s]+/, '').trim();
        searchInput.value = cleanQuery;
        searchInput.focus();

        // Scroll into view
        const mainContent = document.getElementById('main-directory-content');
        if (mainContent) {
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
