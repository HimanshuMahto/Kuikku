// background.js — Service Worker for Kuikku Extension

// ─── Initialise storage ───────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("items", (result) => {
    if (!result.items) {
      chrome.storage.local.set({ items: [] });
    }
  });

  chrome.contextMenus.create({
    id: "quick-save",
    title: "Save this",
    contexts: ["selection", "page"],
  });
});

// ─── Context menu handler ─────────────────────────────────────────────────────
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const text =
    info.selectionText && info.selectionText.trim()
      ? info.selectionText.trim()
      : tab.title
      ? tab.title.trim()
      : tab.url;

  const url = tab.url || "";

  saveItem(text, url);
});

// ─── Message handler (from popup) ────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SAVE_ITEM") {
    saveItem(message.text, message.url || "");
    sendResponse({ ok: true });
  }
  return true;
});

// ─── Core save function ───────────────────────────────────────────────────────
function saveItem(text, url) {
  if (!text || !text.trim()) return;

  chrome.storage.local.get("items", (result) => {
    const items = Array.isArray(result.items) ? result.items : [];

    const newItem = {
      id: generateId(),
      text: text.trim(),
      url: url || undefined,
      createdAt: Date.now(),
    };

    // Newest first
    items.unshift(newItem);

    chrome.storage.local.set({ items });
  });
}

// ─── Tab tracking — inject content script on tracked URLs ─────────────────────
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  if (!tab.url.startsWith("http://") && !tab.url.startsWith("https://")) return;

  chrome.storage.local.get("items", (result) => {
    const items = Array.isArray(result.items) ? result.items : [];
    const isTracked = items.some(
      (i) => i.trackProgress && i.url && normalizeUrl(tab.url) === normalizeUrl(i.url)
    );
    if (!isTracked) return;

    chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"],
    }).catch(() => {});
  });
});

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    return u.origin + u.pathname + u.search;
  } catch (_) {
    return url;
  }
}

// ─── ID generator ────────────────────────────────────────────────────────────
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
