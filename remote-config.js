/**
 * Schepki Remote Config Module
 * Fetches config.json from GitHub and caches it locally.
 * Falls back to defaults if GitHub is unreachable.
 */

const CONFIG_URL = 'https://raw.githubusercontent.com/nikol-dev-tools/schepki-config/main/config.json';
const CACHE_KEY = '_remote_config';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// ============================================================
// DEFAULT FALLBACK VALUES (used if GitHub is unreachable)
// ============================================================
const DEFAULT_CONFIG = {
  global: {
    privacy_policy_url: 'https://nikol-dev-tools.github.io/schepki-config/privacy.html',
    support_email: 'nikol.dev.tools@gmail.com',
    developer_name: 'Schepki Dev'
  },
  monetization: {
    donation_links: {
      buymeacoffee: 'https://buymeacoffee.com/schepki',
      crypto_btc: '',
      patreon: ''
    }
  },
  cross_promo: {
    show_banner: false
  }
};

// ============================================================
// MAIN FUNCTION: Get config for a specific extension
// ============================================================
async function getConfig(extensionId) {
  try {
    // Check cache first
    const cached = await getCached();
    if (cached) return mergeConfig(cached, extensionId);

    // Fetch fresh config from GitHub
    const response = await fetch(CONFIG_URL);
    if (!response.ok) throw new Error('Network error');

    const config = await response.json();

    // Save to cache with timestamp
    chrome.storage.local.set({
      [CACHE_KEY]: { data: config, timestamp: Date.now() }
    });

    return mergeConfig(config, extensionId);

  } catch (e) {
    // Return defaults silently — never break the extension
    return mergeConfig(DEFAULT_CONFIG, extensionId);
  }
}

// Get cached config if still fresh
function getCached() {
  return new Promise((resolve) => {
    chrome.storage.local.get([CACHE_KEY], (result) => {
      const cached = result[CACHE_KEY];
      if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
        resolve(cached.data);
      } else {
        resolve(null);
      }
    });
  });
}

// Merge global config with extension-specific config
function mergeConfig(config, extensionId) {
  const global = config.global || DEFAULT_CONFIG.global;
  const monetization = config.monetization || DEFAULT_CONFIG.monetization;
  const crossPromo = config.cross_promo || DEFAULT_CONFIG.cross_promo;
  const extConfig = (config.extensions && config.extensions[extensionId]) || {};

  // Resolve donation link based on GEO override or default
  const userLang = navigator.language || 'en-US';
  const countryCode = userLang.split('-')[1] || 'US';
  const geoOverride = extConfig.geo_overrides && extConfig.geo_overrides[countryCode];
  const donationSource = (geoOverride && geoOverride.donation_source) ||
    (extConfig.donation && extConfig.donation.source) ||
    'buymeacoffee';

  const donationUrl = monetization.donation_links[donationSource] ||
    monetization.donation_links.buymeacoffee;

  return {
    global,
    crossPromo,
    donation: {
      show: extConfig.donation ? extConfig.donation.show : true,
      url: donationUrl,
      text: extConfig.donation ? extConfig.donation.text_en : 'Support the developer ☕'
    },
    isActive: extConfig.is_active !== false
  };
}
