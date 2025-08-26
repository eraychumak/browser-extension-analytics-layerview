/**
 * This script runs as a content script in the MAIN world (page context).
 * It intercepts calls to window.dataLayer.push and dispatches a CustomEvent
 * ('analytics-custom-data-layer') on the window with the event data.
 *
 * The event is picked up by event-forwarder.js, which relays it to the extension side.
 */
const originalPush = window.dataLayer.push;

window.dataLayer.push = function(...args) {
	console.groupCollapsed("[Extractor] Intercepted dataLayer.push");
	console.log("Arguments:", args);
	console.trace();
	console.groupEnd();

	const interceptedEvent = new CustomEvent("analytics-custom-data-layer", {
		detail: args,
	});

	window.dispatchEvent(interceptedEvent);
	console.log("[inject-relay.js] CustomEvent 'analytics-custom-data-layer' dispatched.", interceptedEvent);

	originalPush.apply(window.dataLayer, args);
};
