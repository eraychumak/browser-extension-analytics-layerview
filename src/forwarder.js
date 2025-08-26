/**
 * event-forwarder.js
 *
 * This script runs as a content script in the extension context.
 * It listens for 'analytics-custom-data-layer' events dispatched by inject-relay.js
 * and forwards the event data to the extension (side panel) via chrome.runtime.sendMessage.
 */
(async () => {
	window.addEventListener("analytics-custom-data-layer", async (event) => {
		console.groupCollapsed("[event-forwarder.js] Received CustomEvent 'analytics-custom-data-layer'");
		console.log("Event detail:", event.detail);
		console.groupEnd();
		try {
			const response = await chrome.runtime.sendMessage({ type: "analytics-custom-data-layer", detail: event.detail });
			console.log("[event-forwarder.js] Message sent to extension. Response:", response);
		} catch (err) {
			console.error("[event-forwarder.js] Error sending message:", err);
		}
	});
})();
