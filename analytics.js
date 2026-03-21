/**
 * Schepki Analytics Module
 * Uses GA4 Measurement Protocol — no external scripts loaded.
 * Safe for Chrome Web Store review.
 */

const ANALYTICS = {
  MEASUREMENT_ID: 'G-3ZKRBK0TBV',
  API_SECRET: 'schepki_secret_v1', // Replace with your actual API secret from GA4 dashboard
  ENDPOINT: 'https://www.google-analytics.com/mp/collect',

  // Generate or retrieve a persistent anonymous client ID
  getClientId() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['_cid'], (result) => {
        if (result._cid) {
          resolve(result._cid);
        } else {
          const newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
          chrome.storage.local.set({ _cid: newId });
          resolve(newId);
        }
      });
    });
  },

  // Send an event to GA4
  async sendEvent(eventName, params = {}) {
    try {
      const clientId = await this.getClientId();
      const payload = {
        client_id: clientId,
        events: [{
          name: eventName,
          params: {
            engagement_time_msec: '100',
            ...params
          }
        }]
      };

      await fetch(`${this.ENDPOINT}?measurement_id=${this.MEASUREMENT_ID}&api_secret=${this.API_SECRET}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (e) {
      // Silent fail — analytics should never break the extension
    }
  }
};

// Convenience functions
function trackEvent(name, params = {}) {
  ANALYTICS.sendEvent(name, params);
}

function trackPageView(pageName) {
  ANALYTICS.sendEvent('page_view', { page_title: pageName });
}

function trackClick(buttonName) {
  ANALYTICS.sendEvent('button_click', { button_name: buttonName });
}
