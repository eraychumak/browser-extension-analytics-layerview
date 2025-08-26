/**
 * sidePanel/index.js
 *
 * This script runs in the extension's side panel.
 * It listens for messages from content.js (via chrome.runtime.onMessage)
 * and logs or processes the received dataLayer events for debugging.
 */

const eventsList = document.getElementById('events');
const eventTypeSelect = document.getElementById('event-type-select');

let eventsByType = {
  all: []
};

let eventTypes = new Set();
let currentFilter = 'all';

const updateFilters = () => {
  const prevFilter = currentFilter;

  if (!eventTypeSelect) return;

  eventTypeSelect.innerHTML = '';

  const allOption = document.createElement('option');

  allOption.value = 'all';
  allOption.textContent = 'All';

  eventTypeSelect.appendChild(allOption);

  Array.from(eventTypes).sort().forEach(type => {
    const option = document.createElement('option');

    option.value = type;
    option.textContent = type;

    eventTypeSelect.appendChild(option);
  });

  eventTypeSelect.value = prevFilter;
};


const renderEvents = (newEventIndex = 0) => {
  eventsList.innerHTML = '';

  const filtered = (currentFilter === 'all')
    ? eventsByType.all
    : (eventsByType[currentFilter] || []);

  filtered.forEach((eventDetail, idx) => {
    const li = document.createElement('li');

    const highlightedCode = hljs.highlight(
      JSON.stringify(eventDetail, null, 2),
      { language: 'json' }
    ).value

    const html = [
      `<pre class="codeblock">`,
        `<span class="theme-atom-one-dark hljs">`,
          `<code>${highlightedCode}</code>`,
        "</span>",
      "</pre>",
      "<div>",
        `<p class="timestamp">${eventDetail.timestamp}</p>`,
      "</div>",
    ];

    li.innerHTML = html.join("");

    eventsList.appendChild(li);
  });
};

if (eventTypeSelect) {
  eventTypeSelect.addEventListener('change', () => {
    currentFilter = eventTypeSelect.value;
    renderEvents();
  });
}

const addEvent = (ev) => {
  const evWithMetadata = {
    ...ev,
    timestamp: new Date().toLocaleTimeString(),
  };

  eventsByType.all.unshift(evWithMetadata);

  const type = evWithMetadata?.event;

  if (type) {
    eventTypes.add(type);

    if (!eventsByType[type]) {
      eventsByType[type] = [];
    }

    eventsByType[type].unshift(evWithMetadata);
  }
};


chrome.runtime.onMessage.addListener((message) => {
  if (!message || message?.type !== "analytics-custom-data-layer" || !message?.detail) {
    return;
  }

  const details = Array.isArray(message.detail) ? message.detail : [message.detail];

  details.forEach(addEvent);

  updateFilters();
  // Pass 0 to highlight the newest event
  renderEvents(0);
});

const resetPanel = () => {
  eventsByType = Object.create(null);
  eventsByType.all = [];
  eventTypes = new Set();
  currentFilter = 'all';

  updateFilters();
  renderEvents();
};

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.webNavigation.onCommitted.addListener((e) => {
  if (e.transitionType === "reload") {
    resetPanel();
  }
});
