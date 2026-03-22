// ============================================================
// SCHEPKI REMOTE CONFIG MODULE v2.0
// Fetches config.json from GitHub (cached 6 hours)
// HOW TO USE:
//   1. Add your extension key to config.json in schepki-config repo
//   2. Call getConfig('your_extension_id') to get settings
//   3. Config is cached locally for 6 hours — no repeated fetches
// ============================================================
const CONFIG_URL = 'https://raw.githubusercontent.com/nikol-dev-tools/schepki-config/main/config.json';
const CONFIG_CACHE_KEY = 'schepki_remote_config';
const CONFIG_CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

// Default fallback config (used if GitHub is unreachable)
const DEFAULT_CONFIG = {
  REPLACE_WITH_EXTENSION_ID: {
    is_active: true,
    donate_url: 'https://buymeacoffee.com/nikoltools',
    store_url: '',
    rate_us_after_opens: 10,
    show_donate_banner: true,
    donate_url_IN: 'https://buymeacoffee.com/nikoltools',
    donate_url_BR: 'https://buymeacoffee.com/nikoltools'
  }
};

async function fetchRemoteConfig() {
  try {
    const cached = await chrome.storage.local.get(CONFIG_CACHE_KEY);
    const now = Date.now();
    if (cached[CONFIG_CACHE_KEY] && (now - cached[CONFIG_CACHE_KEY].timestamp) < CONFIG_CACHE_TTL) {
      return cached[CONFIG_CACHE_KEY].data;
    }
    const response = await fetch(CONFIG_URL + '?t=' + now);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    await chrome.storage.local.set({
      [CONFIG_CACHE_KEY]: { data, timestamp: now }
    });
    return data;
  } catch (e) {
    // Return cached data if available, otherwise defaults
    const cached = await chrome.storage.local.get(CONFIG_CACHE_KEY);
    return cached[CONFIG_CACHE_KEY]?.data || null;
  }
}

// Get config for a specific extension, with GEO override support
async function getConfig(extensionId) {
  const allConfig = await fetchRemoteConfig();
  const extConfig = allConfig?.extensions?.[extensionId] || DEFAULT_CONFIG[extensionId] || DEFAULT_CONFIG['REPLACE_WITH_EXTENSION_ID'];

  // Apply GEO-based donate URL override
  try {
    const locale = navigator.language || 'en';
    const country = locale.split('-')[1]?.toUpperCase();
    if (country === 'IN' && extConfig.donate_url_IN) {
      extConfig.donate_url = extConfig.donate_url_IN;
    } else if (country === 'BR' && extConfig.donate_url_BR) {
      extConfig.donate_url = extConfig.donate_url_BR;
    }
  } catch (e) { /* ignore */ }

  return extConfig;
}

export { getConfig };
