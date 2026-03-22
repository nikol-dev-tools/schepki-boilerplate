// ============================================================
// SCHEPKI ANALYTICS MODULE v2.0
// GA4 Measurement Protocol — no cookies, no PII
// HOW TO USE:
//   1. Replace EXTENSION_ID with your extension key (e.g. 'quick_notes')
//   2. Replace EXTENSION_VERSION with your version (e.g. '1.0.0')
//   3. Replace all KEY constants with your extension's unique keys
//   4. Call trackPopupOpen() when popup loads
//   5. Call trackDonationClick() when user clicks donate button
//   6. Add custom events via sendEvent('event_name', { param: value })
// ============================================================
const GA4_MEASUREMENT_ID = 'G-3ZKRBK0TBV';
const GA4_API_SECRET = 'TaFzQ3cgRP25jG3BSYtASA';
const EXTENSION_ID = 'REPLACE_WITH_EXTENSION_ID'; // e.g. 'quick_notes'
const EXTENSION_VERSION = '1.0.0';
const FIRST_LAUNCH_KEY = `schepki_first_launch_${EXTENSION_ID}`;
const SESSION_KEY = `schepki_session_${EXTENSION_ID}`;
const USE_COUNT_KEY = `schepki_use_count_${EXTENSION_ID}`;

// Generate or retrieve persistent client ID
async function getClientId() {
  const stored = await chrome.storage.local.get('schepki_client_id');
  if (stored.schepki_client_id) return stored.schepki_client_id;
  const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  await chrome.storage.local.set({ schepki_client_id: id });
  return id;
}

// Generate or retrieve session ID (resets after 30 min inactivity)
async function getSessionId() {
  const stored = await chrome.storage.local.get(SESSION_KEY);
  const now = Date.now();
  if (stored[SESSION_KEY] && (now - stored[SESSION_KEY].last_active) < 30 * 60 * 1000) {
    await chrome.storage.local.set({ [SESSION_KEY]: { ...stored[SESSION_KEY], last_active: now } });
    return stored[SESSION_KEY].id;
  }
  const id = Math.floor(now / 1000);
  await chrome.storage.local.set({ [SESSION_KEY]: { id, last_active: now } });
  return id;
}

async function sendEvent(eventName, params = {}) {
  try {
    const clientId = await getClientId();
    const sessionId = await getSessionId();
    const payload = {
      client_id: clientId,
      events: [{
        name: eventName,
        params: {
          session_id: String(sessionId),
          engagement_time_msec: '100',
          extension_id: EXTENSION_ID,
          extension_version: EXTENSION_VERSION,
          ...params
        }
      }]
    };
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
      { method: 'POST', body: JSON.stringify(payload) }
    );
  } catch (e) {
    // Silent fail — analytics should never break the extension
  }
}

// Track first launch (fires only once per install)
async function trackFirstLaunch() {
  const stored = await chrome.storage.local.get(FIRST_LAUNCH_KEY);
  if (!stored[FIRST_LAUNCH_KEY]) {
    await chrome.storage.local.set({ [FIRST_LAUNCH_KEY]: true });
    await sendEvent('first_launch', { source: 'install' });
  }
}

// Track popup open (call this first in popup.js)
async function trackPopupOpen() {
  await trackFirstLaunch();
  await sendEvent('popup_open');
}

// Track donation click
async function trackDonationClick() {
  await sendEvent('donation_click', { source: 'popup_banner' });
}

// Track use count and return it (used for Rate Us and banner delay logic)
async function incrementUseCount() {
  const stored = await chrome.storage.local.get(USE_COUNT_KEY);
  const count = (stored[USE_COUNT_KEY] || 0) + 1;
  await chrome.storage.local.set({ [USE_COUNT_KEY]: count });
  return count;
}

export { sendEvent, trackPopupOpen, trackDonationClick, incrementUseCount };
