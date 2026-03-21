// content.js — Reading progress tracker for Kuikku

(function () {
  "use strict";

  // Guard against double-injection (e.g. on SPA navigations)
  if (window.__quickSaveTracking) return;
  window.__quickSaveTracking = true;

  const pageUrl = window.location.href;

  // ── Safe wrappers — handle MV3 extension context invalidation ────────────
  // When Chrome terminates and restarts the service worker, content scripts
  // that were already injected lose chrome.storage access mid-execution.
  function storageGet(key, callback) {
    try {
      if (!chrome?.storage?.local) return;
      chrome.storage.local.get(key, callback);
    } catch (_) {}
  }

  function storageSet(data) {
    try {
      if (!chrome?.storage?.local) return;
      chrome.storage.local.set(data);
    } catch (_) {}
  }

  function normalizeUrl(url) {
    try {
      const u = new URL(url);
      return u.origin + u.pathname + u.search;
    } catch (_) {
      return url;
    }
  }

  storageGet("items", (result) => {
    if (!result) return;
    const items = Array.isArray(result.items) ? result.items : [];
    const item = items.find(
      (i) => i.trackProgress && i.url && normalizeUrl(pageUrl) === normalizeUrl(i.url)
    );
    if (!item) return;

    // Restore using saved absolute pixel position (more accurate than %)
    if (item.scrollY > 0) restoreScroll(item.scrollY);

    // Track scroll changes with debounce
    let saveTimer;
    window.addEventListener(
      "scroll",
      () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveProgress, 600);
      },
      { passive: true }
    );

    // Capture current position immediately (user may already be scrolled)
    setTimeout(saveProgress, 300);

    function saveProgress() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollY = Math.round(window.scrollY);
      const pct =
        scrollable > 0
          ? Math.min(100, Math.round((currentScrollY / scrollable) * 100))
          : 0;

      storageGet("items", (r) => {
        if (!r) return;
        const arr = Array.isArray(r.items) ? r.items : [];
        const idx = arr.findIndex((i) => i.id === item.id);
        if (idx === -1) return;
        arr[idx].scrollY       = currentScrollY;  // absolute px — used for restore
        arr[idx].scrollPercent = pct;             // relative % — shown in popup
        arr[idx].lastRead      = Date.now();
        storageSet({ items: arr });
      });
    }
  });

  // Restore to an absolute pixel offset, retrying as the page loads more content
  function restoreScroll(targetY) {
    let attempts = 0;

    function tryRestore() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0) {
        window.scrollTo({ top: Math.min(targetY, scrollable), behavior: "instant" });
      }
      // Keep retrying for ~3 s to handle lazy-loaded content shifting the page
      if (attempts < 8) {
        attempts++;
        setTimeout(tryRestore, 400);
      }
    }

    if (document.readyState === "complete") {
      setTimeout(tryRestore, 200);
    } else {
      window.addEventListener("load", () => setTimeout(tryRestore, 200), { once: true });
    }
  }
})();
