# Analytics LayerView

This Chrome extension helps QA testers and developers visualize and debug analytics dataLayer events in a side panel.

## How it works


1. **inject-relay.js** (content script, MAIN world):
   - Injected into the page context.
   - Intercepts all calls to `window.dataLayer.push`.
   - Dispatches a `CustomEvent` (`analytics-custom-data-layer`) on the window with the event data.

2. **event-forwarder.js** (content script, extension world):
   - Listens for `analytics-custom-data-layer` events from `inject-relay.js`.
   - Forwards the event data to the extension using `chrome.runtime.sendMessage`.

3. **sidePanel/event-viewer.js** (side panel):
   - Listens for messages from `event-forwarder.js`.
   - Logs or processes the received dataLayer events for debugging in the side panel UI.

## File Overview

- `inject-relay.js`: Intercepts dataLayer events and emits them as CustomEvents.
- `event-forwarder.js`: Bridges CustomEvents from the page to the extension messaging system.
- `sidePanel/event-viewer.js`: Receives and logs messages in the side panel.
- `manifest.json`: Chrome extension manifest configuration.
- `sidePanel/index.html`: Side panel HTML UI.

## Usage

1. Load the extension in Chrome (Developer Mode > Load unpacked).
2. Open any page with a `window.dataLayer`.
3. Trigger analytics events on the page.
4. Open the extension's side panel to view intercepted events.

---

MIT License
