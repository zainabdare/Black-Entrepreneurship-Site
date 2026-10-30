/**
 * js/emailjs-config.js
 * Central configuration for EmailJS notification services and Google Sheets intake in BLKENTRE.
 * 
 * Service ID: service_yp3g91b
 * Template ID: template_7zv1ows (contains lowercase letter 'o', not zero '0')
 * Public Key: arq3sprDo_KLKvdRV
 * Google Apps Script Web App URL: https://script.google.com/macros/s/AKfycby6grkDa7qw5YclsyIvhmA7BPpwafGKNeXzmiuZpaL6RWNNP1z9zr2xsJdYPCZe8zsW/exec
 */

export const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycby6grkDa7qw5YclsyIvhmA7BPpwafGKNeXzmiuZpaL6RWNNP1z9zr2xsJdYPCZe8zsW/exec";

export const EMAILJS_CONFIG = {
  serviceId: "service_yp3g91b",
  templateId: "template_7zv1ows",
  publicKey: "arq3sprDo_KLKvdRV",
  googleSheetWebAppUrl: GOOGLE_SHEET_URL
};

// Also expose globally for non-module scripts
if (typeof window !== 'undefined') {
  window.EMAILJS_CONFIG = EMAILJS_CONFIG;
  window.GOOGLE_SHEET_URL = GOOGLE_SHEET_URL;
}

export default EMAILJS_CONFIG;
