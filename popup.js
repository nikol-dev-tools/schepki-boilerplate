/**
 * Schepki Boilerplate — popup.js
 *
 * HOW TO USE FOR A NEW EXTENSION:
 * 1. Change EXTENSION_ID to match the key in config.json (e.g. 'breathing_timer')
 * 2. Replace the "YOUR EXTENSION LOGIC HERE" section with your actual code
 * 3. Done! Analytics and Remote Config are already wired up.
 */

// ============================================================
// STEP 1: Set your extension ID (must match key in config.json)
// ============================================================
const EXTENSION_ID = 'REPLACE_WITH_EXTENSION_ID'; // e.g. 'pomodoro_timer'

// ============================================================
// STEP 2: Initialize Remote Config and Analytics on load
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {

  // Track that user opened the extension
  trackPageView(EXTENSION_ID);

  // Load Remote Config
  const config = await getConfig(EXTENSION_ID);

  // Apply Privacy Policy link
  const privacyLink = document.getElementById('privacy-link');
  if (privacyLink) {
    privacyLink.href = config.global.privacy_policy_url;
  }

  // Show/hide donation banner
  if (config.donation && config.donation.show && config.donation.url) {
    const banner = document.getElementById('donation-banner');
    const text = document.getElementById('donation-text');
    const link = document.getElementById('donation-link');
    if (banner && text && link) {
      text.textContent = config.donation.text;
      link.href = config.donation.url;
      link.addEventListener('click', () => trackClick('donation_button'));
      banner.style.display = 'flex';
    }
  }

  // Show/hide cross-promo banner
  if (config.crossPromo && config.crossPromo.show_banner) {
    const promoBanner = document.getElementById('promo-banner');
    const promoText = document.getElementById('promo-text');
    const promoLink = document.getElementById('promo-link');
    if (promoBanner && promoText && promoLink) {
      promoText.textContent = config.crossPromo.banner_text;
      promoLink.href = config.crossPromo.banner_url;
      promoLink.addEventListener('click', () => trackClick('promo_banner'));
      promoBanner.style.display = 'flex';
    }
  }

  // ============================================================
  // STEP 3: YOUR EXTENSION LOGIC HERE
  // ============================================================
  // Example: initMyExtension();
  // ============================================================

});
