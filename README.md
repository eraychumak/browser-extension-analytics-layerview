# Analytics LayerView

Analytics LayerView is a browser extension that helps QA testers and developers visualise and debug analytics `dataLayer` events in a side panel.

## How it works

1. **extractor.js** (content script, MAIN world):
   - Injected into the page context.
   - Uses Google's `data-layer-helper` to listen for all `dataLayer` pushes.
   - Dispatches a `CustomEvent` (`browser-extension-analytics-layer-view-new-event`) on the window with the event data.

2. **forwarder.js** (content script, extension world):
   - Listens for `browser-extension-analytics-layer-view-new-event` events from `extractor.js`.
   - Forwards the event data to the extension's side panel using a `chrome.runtime` port.

3. **src/side-panel/index.js** (side panel):
   - Receives messages from `forwarder.js` via the extension port.
   - Displays and filters the received `dataLayer` events in the side panel UI for debugging.

## File Overview

- `src/extractor.js`: Listens to `dataLayer` pushes and emits them as CustomEvents.
- `src/forwarder.js`: Forwards CustomEvents from the page to the extension's side panel.
- `src/side-panel/index.js`: Receives and displays messages in the side panel UI.
- `src/side-panel/index.html`: Side panel HTML UI.
- `src/dependencies/data-layer-helper/data-layer-helper.js`: Google Data Layer Helper library.
- `manifest.json`: Chrome extension manifest configuration.

## Usage

1. Load the extension in Chrome (Developer Mode > Load unpacked).
2. Open any page with a `window.dataLayer` present.
3. Trigger analytics events on the page (e.g., by interacting with the site).
4. Open the extension's side panel to view and filter intercepted events.
