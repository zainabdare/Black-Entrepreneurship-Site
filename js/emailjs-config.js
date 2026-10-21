/**
 * js/emailjs-config.js
 * Central configuration for EmailJS notification services in Black-Owned BR.
 * 
 * Service ID: service_yp3g91b
 * Template ID: template_7zv1ows (contains lowercase letter 'o', not zero '0')
 * Public Key: arq3sprDo_KLKvdRV
 */

export const EMAILJS_CONFIG = {
  serviceId: "service_yp3g91b",
  templateId: "template_7zv1ows",
  publicKey: "arq3sprDo_KLKvdRV"
};

// Also expose globally for non-module scripts
if (typeof window !== 'undefined') {
  window.EMAILJS_CONFIG = EMAILJS_CONFIG;
}

export default EMAILJS_CONFIG;
