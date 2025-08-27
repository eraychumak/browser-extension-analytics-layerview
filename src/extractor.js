/**
 * This content script runs in the MAIN execution world, sharing the
 * DOM page context with the host site.
 * 
 * It uses the data-layer-helper depedency by Google to listen to the
 * `dataLayer` object and dispatch new events to forwarder.js.
 */

/**
 * @param {Object} model The Abstract Data Model
 * @param {Object} message The message pushed to the `dataLayer`
 * 
 * @see {@link https://github.com/google/data-layer-helper?tab=readme-ov-file#the-abstract-data-model}
 */
function listener(_, message) {
	if (!message) {
		return;
	}

	// Message has been pushed. 
	// The helper has merged it onto the model.
	// Now use the message and the updated model to do something.
	const newEvent = new CustomEvent("browser-extension-analytics-layer-view-new-event", {
		detail: message
	});

	window.dispatchEvent(newEvent);
}

if (window.dataLayer) {
	new DataLayerHelper(dataLayer, {
		listener,
		listenToPast: true, // includes any events that have fired before the script is initialised
	});
}
