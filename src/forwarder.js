const logPrefix = "[Analytics LayerView Browser Extension] [forwarder.js]";

/**
 * This script runs in the ISOLATED execution world, unique to the
 * browser extension.
 * 
 * It forwards any events received from extractor.js to the side panel.
 */

function connectToSidePanel() {
	console.debug(logPrefix, "Attempting to connect to side panel");

	const sidePanelPort = chrome.runtime.connect({
		name: "AnalyticsLayerViewSidePanel"
	});

	const forwardNewEvent = (event) => {
    const eventMessage = event.detail;

    if (typeof eventMessage !== "object") {
      return; // skip
    }

    if (!eventMessage?.event) {
      return // skip
    }

		sidePanelPort.postMessage({
			type: "data-layer-new-event",
			detail: event.detail
		});
	};

	sidePanelPort.onMessage.addListener((msg) => {
		if (msg.type !== "data-layer-action") {
			return;
		}

		if (msg.action === "start-capture") {
			console.debug(logPrefix, "Started capturing events.");
			window.addEventListener("browser-extension-analytics-layer-view-new-event", forwardNewEvent);
		}
	});

	sidePanelPort.onDisconnect.addListener(() => {
		console.debug(logPrefix, "Disconnected from side panel, stopped forwarding events.", chrome.runtime.lastError);
		window.removeEventListener("browser-extension-analytics-layer-view-new-event", forwardNewEvent);
	});
}

connectToSidePanel();
