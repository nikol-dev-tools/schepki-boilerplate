# 🪵 Schepki Boilerplate v2.0

Universal template for all Schepki browser extensions.

## Features included out of the box

- ✅ Remote Config (fetches settings from GitHub, cached 6h)
- ✅ GA4 Analytics (Measurement Protocol, no cookies, no PII)
- ✅ First launch tracking (`first_launch` event on install)
- ✅ Use count tracking (for Rate Us and banner delay logic)
- ✅ UTM parameters on donate link (`?utm_source=EXTENSION_ID&utm_medium=extension`)
- ✅ Donate banner (shown from 3rd open)
- ✅ Rate Us prompt (shown after N opens, configurable in config.json)
- ✅ i18n support (EN, DE, FR, ES, PT — add more easily)
- ✅ Privacy Policy link (hosted on GitHub Pages)
- ✅ Clean, minimal UI (320px popup, no frameworks)

## How to create a new extension

### Step 1 — Clone this boilerplate
```bash
gh repo clone nikol-dev-tools/schepki-boilerplate my-new-extension
cd my-new-extension
```

### Step 2 — Set your extension ID
In `popup.js` and `analytics.js`, replace:
```js
const EXTENSION_ID = 'REPLACE_WITH_EXTENSION_ID';
```
With your extension key, e.g.:
```js
const EXTENSION_ID = 'quick_notes';
```

### Step 3 — Update manifest.json
- Change `"name"` to your extension name
- Change `"description"` to your description
- Add any extra permissions you need

### Step 4 — Add to Remote Config
In `schepki-config/config.json`, add your extension:
```json
"quick_notes": {
  "is_active": true,
  "donate_url": "https://buymeacoffee.com/nikoltools",
  "store_url": "",
  "rate_us_after_opens": 10,
  "show_donate_banner": true
}
```

### Step 5 — Write your logic
In `popup.js`, find the section:
```js
// STEP 3: YOUR EXTENSION LOGIC HERE
async function initExtension(config) {
  // TODO: Write your extension's main logic here
}
```
Add your UI logic here.

### Step 6 — Update translations
In `popup.js`, update the `translations` object with your extension's text.

### Step 7 — Add icons
Replace placeholder icons in `icons/` folder:
- `icon16.png` (16×16)
- `icon48.png` (48×48)  
- `icon128.png` (128×128)

## File structure
```
extension/
├── manifest.json       — permissions, version, icons
├── popup.html          — UI structure (uses data-i18n attributes)
├── popup.css           — styles (clean, minimal, 320px)
├── popup.js            — main logic + i18n + Rate Us + donate banner
├── analytics.js        — GA4 events (do not modify API_SECRET)
├── remote-config.js    — fetches config.json from GitHub
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Analytics events (built-in)

| Event | When fired |
|---|---|
| `first_launch` | First time user opens popup after install |
| `popup_open` | Every time popup is opened |
| `donation_click` | User clicks donate button |

Add custom events in your logic:
```js
import { sendEvent } from './analytics.js';
await sendEvent('note_saved', { length: '42' });
```

## GA4 credentials
- Measurement ID: `G-3ZKRBK0TBV`
- API Secret: already set in `analytics.js` (do not change)
- Dashboard: [analytics.google.com](https://analytics.google.com)
