// ============================================================
// SCHEPKI POPUP v2.0 — UNIVERSAL BOILERPLATE
// ============================================================
// HOW TO CREATE A NEW EXTENSION:
//   STEP 1: Replace EXTENSION_ID with your key (e.g. 'quick_notes')
//   STEP 2: Add translations for your extension in the translations object
//   STEP 3: Write your extension logic in the "YOUR EXTENSION LOGIC" section
//   STEP 4: Add your extension key to config.json in schepki-config repo
//   STEP 5: Update manifest.json (name, description, permissions)
// ============================================================

import { getConfig } from './remote-config.js';
import { trackPopupOpen, trackDonationClick, incrementUseCount } from './analytics.js';

// ============================================================
// STEP 1: SET YOUR EXTENSION ID
// ============================================================
const EXTENSION_ID = 'REPLACE_WITH_EXTENSION_ID'; // e.g. 'quick_notes'

// ============================================================
// STEP 2: ADD YOUR TRANSLATIONS
// Add as many languages as needed. 'en' is required (fallback).
// Keys must match data-i18n attributes in popup.html
// ============================================================
const translations = {
  en: {
    title: 'My Extension',
    description: 'What this extension does.',
    action_button: 'Do Something',
    donate_text: '☕ Enjoying this? Buy me a coffee!',
    donate_button: 'Donate',
    rate_text: '⭐ Loving it? Leave a review!',
    rate_button: 'Rate Us',
    rate_dismiss: 'Maybe later',
    privacy: 'Privacy Policy'
  },
  de: {
    title: 'Meine Erweiterung',
    description: 'Was diese Erweiterung macht.',
    action_button: 'Aktion',
    donate_text: '☕ Gefällt dir das? Kauf mir einen Kaffee!',
    donate_button: 'Spenden',
    rate_text: '⭐ Liebst du es? Hinterlasse eine Bewertung!',
    rate_button: 'Bewerten',
    rate_dismiss: 'Vielleicht später',
    privacy: 'Datenschutz'
  },
  fr: {
    title: 'Mon Extension',
    description: 'Ce que fait cette extension.',
    action_button: 'Action',
    donate_text: '☕ Vous aimez? Offrez-moi un café!',
    donate_button: 'Donner',
    rate_text: '⭐ Vous adorez? Laissez un avis!',
    rate_button: 'Évaluer',
    rate_dismiss: 'Peut-être plus tard',
    privacy: 'Confidentialité'
  },
  es: {
    title: 'Mi Extensión',
    description: 'Lo que hace esta extensión.',
    action_button: 'Acción',
    donate_text: '☕ ¿Te gusta? ¡Cómprame un café!',
    donate_button: 'Donar',
    rate_text: '⭐ ¿Lo amas? ¡Deja una reseña!',
    rate_button: 'Valorar',
    rate_dismiss: 'Quizás más tarde',
    privacy: 'Privacidad'
  },
  pt: {
    title: 'Minha Extensão',
    description: 'O que esta extensão faz.',
    action_button: 'Ação',
    donate_text: '☕ Gostou? Me pague um café!',
    donate_button: 'Doar',
    rate_text: '⭐ Adorou? Deixe uma avaliação!',
    rate_button: 'Avaliar',
    rate_dismiss: 'Talvez mais tarde',
    privacy: 'Privacidade'
  }
};

// ============================================================
// CORE FUNCTIONS (do not modify)
// ============================================================

// Apply translations based on browser language
function applyI18n() {
  const lang = navigator.language?.split('-')[0] || 'en';
  const t = translations[lang] || translations['en'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
}

// Show donate banner with UTM link (after 3rd open)
async function setupDonateBanner(config, useCount) {
  if (!config.show_donate_banner || useCount < 3) return;
  const banner = document.getElementById('donate-banner');
  const link = document.getElementById('donate-link');
  if (!banner || !link) return;
  const utmUrl = `${config.donate_url}?utm_source=${EXTENSION_ID}&utm_medium=extension&utm_campaign=donate_banner`;
  link.href = utmUrl;
  link.addEventListener('click', () => trackDonationClick());
  banner.classList.remove('hidden');
}

// Show Rate Us prompt (after N opens defined in config)
async function setupRateUs(config, useCount) {
  const threshold = config.rate_us_after_opens || 10;
  if (useCount < threshold) return;
  const rateDismissedKey = `schepki_rate_dismissed_${EXTENSION_ID}`;
  const stored = await chrome.storage.local.get(rateDismissedKey);
  if (stored[rateDismissedKey]) return;
  const banner = document.getElementById('rate-us-banner');
  const link = document.getElementById('rate-link');
  const dismiss = document.getElementById('rate-dismiss');
  if (!banner || !link) return;
  if (config.store_url) link.href = config.store_url;
  banner.classList.remove('hidden');
  dismiss?.addEventListener('click', async () => {
    await chrome.storage.local.set({ [rateDismissedKey]: true });
    banner.classList.add('hidden');
  });
}

// ============================================================
// STEP 3: YOUR EXTENSION LOGIC HERE
// ============================================================
async function initExtension(config) {
  // TODO: Write your extension's main logic here
  // Examples:
  //   - Load saved settings from chrome.storage.local
  //   - Set up event listeners for buttons/inputs
  //   - Display current state to the user
  //
  // Example:
  // const btn = document.getElementById('main-action');
  // btn.addEventListener('click', () => {
  //   // do something
  //   sendEvent('action_clicked');
  // });
}

// ============================================================
// MAIN INIT (runs on popup open)
// ============================================================
async function init() {
  // Apply translations
  applyI18n();

  // Track popup open + first launch
  await trackPopupOpen();

  // Increment use count
  const useCount = await incrementUseCount();

  // Load remote config
  const config = await getConfig(EXTENSION_ID);

  // Setup donate banner and rate us
  await setupDonateBanner(config, useCount);
  await setupRateUs(config, useCount);

  // Init your extension logic
  await initExtension(config);
}

document.addEventListener('DOMContentLoaded', init);
