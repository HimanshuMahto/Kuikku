// popup.js — Popup UI logic for Kuikku Extension

(function () {
  "use strict";

  // ─── SVG Icon constants ───────────────────────────────────────────────────────
  const ICONS = {
    link:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    copy:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    check: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    trash: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
    sun:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    sync:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>`,
    spin:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinning"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
    sparkle:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>`,
    aiSpin:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinning"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
    eye:      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  };

  // ─── Element refs ────────────────────────────────────────────────────────────
  const noteInput     = document.getElementById("note-input");
  const saveBtn       = document.getElementById("save-btn");
  const savePageBtn   = document.getElementById("save-page-btn");
  const savePageUrl   = document.getElementById("save-page-url");
  const pdfPageRow    = document.getElementById("pdf-page-row");
  const pdfPageInput  = document.getElementById("pdf-page-input");
  const searchInput   = document.getElementById("search-input");
  const searchSection = document.getElementById("search-section");
  const itemsList     = document.getElementById("items-list");
  const itemCount     = document.getElementById("item-count");
  const emptyState    = document.getElementById("empty-state");
  const noResults     = document.getElementById("no-results");
  const themeToggle   = document.getElementById("theme-toggle");
  const settingsBtn   = document.getElementById("settings-btn");
  const syncBtn       = document.getElementById("sync-btn");
  const pageDupMsg    = document.getElementById("page-dup-msg");
  const noteDupMsg    = document.getElementById("note-dup-msg");
  const trackOptRow   = document.getElementById("track-opt-row");
  const trackOptInput = document.getElementById("track-opt-input");

  // ─── In-memory state ─────────────────────────────────────────────────────────
  let allItems    = [];
  let isDarkTheme = true;
  let aiSettings  = null;
  let githubSettings = null;

  // ─── Bootstrap ───────────────────────────────────────────────────────────────
  const readyFallback = setTimeout(() => document.body.classList.add("ready"), 300);

  chrome.storage.local.get(["items", "theme", "ai", "github", "lastSync"], (result) => {
    clearTimeout(readyFallback);

    isDarkTheme = result.theme !== "light";
    applyTheme(isDarkTheme);
    document.body.classList.add("ready");

    allItems = Array.isArray(result.items) ? result.items : [];

    // AI settings — must be set before renderList so sparkle button appears
    if (result.ai && result.ai.provider && result.ai.key) {
      aiSettings = result.ai;
    }

    updateCount();
    renderList(allItems, "");

    // GitHub — show sync button if configured
    if (result.github && result.github.token && result.github.owner && result.github.repo) {
      githubSettings = result.github;
      syncBtn.hidden = false;
      syncBtn.innerHTML = ICONS.sync;
      const lastSync = result.lastSync;
      syncBtn.title = lastSync
        ? `Last synced ${formatDate(lastSync)} — Click to sync`
        : "Sync to GitHub";
    }
  });

  initSavePageBtn();

  // ─── Theme ───────────────────────────────────────────────────────────────────
  function applyTheme(dark) {
    isDarkTheme = dark;
    if (dark) {
      document.documentElement.classList.remove("light");
      themeToggle.innerHTML = ICONS.sun;
      themeToggle.title = "Switch to light mode";
    } else {
      document.documentElement.classList.add("light");
      themeToggle.innerHTML = ICONS.moon;
      themeToggle.title = "Switch to dark mode";
    }
  }

  themeToggle.addEventListener("click", () => {
    applyTheme(!isDarkTheme);
    chrome.storage.local.set({ theme: isDarkTheme ? "dark" : "light" });
  });

  // ─── Settings button ──────────────────────────────────────────────────────────
  settingsBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("settings.html") });
  });

  // ─── GitHub sync ─────────────────────────────────────────────────────────────
  syncBtn.addEventListener("click", async () => {
    if (!githubSettings) return;

    syncBtn.innerHTML = ICONS.spin;
    syncBtn.disabled = true;
    syncBtn.title = "Syncing…";

    try {
      await pushToGitHub(githubSettings, allItems);
      const now = Date.now();
      chrome.storage.local.set({ lastSync: now });
      syncBtn.innerHTML = ICONS.check;
      syncBtn.title = "Synced!";
      setTimeout(() => {
        syncBtn.innerHTML = ICONS.sync;
        syncBtn.title = `Last synced ${formatDate(now)} — Click to sync`;
        syncBtn.disabled = false;
      }, 1800);
    } catch (_) {
      syncBtn.innerHTML = ICONS.sync;
      syncBtn.title = "Sync failed — try again";
      syncBtn.disabled = false;
    }
  });

  async function pushToGitHub(s, items) {
    const apiUrl = `https://api.github.com/repos/${s.owner}/${s.repo}/contents/${s.path}`;
    const headers = {
      "Authorization": `token ${s.token}`,
      "Accept": "application/vnd.github.v3+json",
    };

    let sha = null;
    try {
      const r = await fetch(`${apiUrl}?ref=${s.branch}`, { headers });
      if (r.ok) sha = (await r.json()).sha;
    } catch (_) {}

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(items, null, 2))));
    const body = {
      message: `Kuikku sync — ${new Date().toISOString()}`,
      content,
      branch: s.branch || "main",
      ...(sha ? { sha } : {}),
    };

    const put = await fetch(apiUrl, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!put.ok) {
      const err = await put.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${put.status}`);
    }
  }

  // ─── Event listeners ─────────────────────────────────────────────────────────
  savePageBtn.addEventListener("click", handleSavePage);
  saveBtn.addEventListener("click", handleSave);

  noteInput.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSave();
  });

  searchInput.addEventListener("input", () => {
    renderList(allItems, searchInput.value);
  });

  // ─── Save Page button init ────────────────────────────────────────────────────
  function initSavePageBtn() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) return;
      const tab = tabs[0];
      try {
        const u = new URL(tab.url);
        savePageUrl.textContent = u.hostname + (u.pathname !== "/" ? u.pathname : "") + u.search;
        if (isPdfUrl(tab.url)) {
          pdfPageRow.hidden = false;
        }
        if ((tab.url.startsWith("http://") || tab.url.startsWith("https://")) && !isPdfUrl(tab.url)) {
          trackOptRow.hidden = false;
        }
      } catch (_) {
        savePageUrl.textContent = tab.url;
      }
    });
  }

  function isPdfUrl(url) {
    try { return new URL(url).pathname.toLowerCase().endsWith(".pdf"); }
    catch (_) { return false; }
  }

  // ─── Duplicate warning ────────────────────────────────────────────────────────
  function showDupWarning(msgEl, existingId) {
    msgEl.hidden = false;
    setTimeout(() => { msgEl.hidden = true; }, 3000);

    const card = itemsList.querySelector(`[data-id="${existingId}"]`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      card.classList.add("dup-highlight");
      setTimeout(() => card.classList.remove("dup-highlight"), 1800);
    }
  }

  // ─── Save Page handler ────────────────────────────────────────────────────────
  function handleSavePage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) return;
      const tab = tabs[0];
      const text = tab.title ? tab.title.trim() : tab.url;

      let url = tab.url || "";
      if (isPdfUrl(url) && pdfPageInput.value) {
        const p = parseInt(pdfPageInput.value, 10);
        if (p >= 1) url = url.split("#")[0] + "#page=" + p;
      }

      const duplicate = url && allItems.find((i) => i.url === url);
      if (duplicate) {
        showDupWarning(pageDupMsg, duplicate.id);
        return;
      }

      const shouldTrack = trackOptInput.checked;
      const newItem = {
        id: generateId(),
        text,
        url: url || undefined,
        createdAt: Date.now(),
        ...(shouldTrack ? { trackProgress: true } : {}),
      };
      allItems.unshift(newItem);

      chrome.storage.local.set({ items: allItems }, () => {
        searchInput.value = "";
        pdfPageInput.value = "";
        trackOptInput.checked = false;
        updateCount();
        renderList(allItems, "");

        const label = savePageBtn.querySelector(".save-page-label");
        const orig  = label.textContent;
        label.textContent = "Saved!";
        savePageBtn.classList.add("saved");
        setTimeout(() => { label.textContent = orig; savePageBtn.classList.remove("saved"); }, 1400);

        // Inject AFTER storage write is confirmed — avoids race condition
        if (shouldTrack && tabs[0].id) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["content.js"],
          }).catch(() => {});
        }
      });

      if (aiSettings) enhanceWithAI(newItem);
    });
  }

  // ─── Save handler ─────────────────────────────────────────────────────────────
  function handleSave() {
    const text = noteInput.value.trim();
    if (!text) { flashInvalid(noteInput); return; }

    const duplicate = allItems.find((i) => i.text === text);
    if (duplicate) {
      showDupWarning(noteDupMsg, duplicate.id);
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs && tabs[0] ? tabs[0].url : "";
      const newItem = { id: generateId(), text, url: url || undefined, createdAt: Date.now() };
      allItems.unshift(newItem);

      chrome.storage.local.set({ items: allItems }, () => {
        noteInput.value = "";
        searchInput.value = "";
        updateCount();
        renderList(allItems, "");
        noteInput.focus();
      });

      if (aiSettings) enhanceWithAI(newItem);
    });
  }

  // ─── AI enhancement (async, non-blocking) ────────────────────────────────────
  async function enhanceWithAI(item, force = false) {
    if (!aiSettings || !aiSettings.key || !aiSettings.provider) return;
    if (!force && !aiSettings.autoTag && !aiSettings.autoSummary) return;

    setCardAiLoading(item.id, true);

    try {
      const meta = await callAI(item.text, item.url, aiSettings);
      const idx = allItems.findIndex((i) => i.id === item.id);
      if (idx === -1) return;

      if (typeof meta.title   === "string" && meta.title)   allItems[idx].text    = meta.title;
      if (Array.isArray(meta.tags))                          allItems[idx].tags    = meta.tags;
      if (typeof meta.summary === "string" && meta.summary) allItems[idx].summary = meta.summary;

      chrome.storage.local.set({ items: allItems }, () => {
        renderList(allItems, searchInput.value);
      });
    } catch (err) {
      setCardAiError(item.id, err.message || "AI failed");
    }
  }

  function setCardAiLoading(itemId, isLoading) {
    const card = itemsList.querySelector(`[data-id="${itemId}"]`);
    if (!card) return;
    card.classList.toggle("ai-loading", isLoading);
    const retagBtn = card.querySelector(".retag-btn");
    if (!retagBtn) return;
    retagBtn.disabled  = isLoading;
    retagBtn.innerHTML = isLoading ? ICONS.aiSpin : ICONS.sparkle;
  }

  function setCardAiError(itemId, message) {
    const card = itemsList.querySelector(`[data-id="${itemId}"]`);
    if (!card) return;
    card.classList.remove("ai-loading");
    const retagBtn = card.querySelector(".retag-btn");
    if (retagBtn) { retagBtn.disabled = false; retagBtn.innerHTML = ICONS.sparkle; }

    let errEl = card.querySelector(".ai-error");
    if (!errEl) {
      errEl = document.createElement("p");
      errEl.className = "ai-error";
      card.querySelector(".item-meta").before(errEl);
    }
    errEl.textContent = "AI error: " + message;
    setTimeout(() => errEl.remove(), 6000);
  }

  async function callAI(text, url, settings) {
    const { provider, key, model } = settings;
    const prompt = `For this saved item, return ONLY a JSON object with three fields: "title" (a concise, improved version of the item title — keep it short and clear), "tags" (array of 2-3 short lowercase topic labels), and "summary" (one concise sentence describing the content). Item title: "${text.slice(0, 300)}"${url ? `. Page URL: ${url}` : ""}.`;

    if (provider === "anthropic") {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: 200,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || `HTTP ${r.status}`);
      return JSON.parse(d.content[0].text);
    }

    if (provider === "openai") {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: 200,
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || `HTTP ${r.status}`);
      return JSON.parse(d.choices[0].message.content);
    }

    if (provider === "xai") {
      const r = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: 200,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || `HTTP ${r.status}`);
      return JSON.parse(d.choices[0].message.content);
    }

    if (provider === "gemini") {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 200 },
          }),
        }
      );
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || `HTTP ${r.status}`);
      const raw = d.candidates[0].content.parts[0].text;
      return JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim());
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  function renderList(items, query) {
    const term = query.trim().toLowerCase();
    const filtered = term
      ? items.filter((item) => item.text.toLowerCase().includes(term))
      : items;

    itemsList.innerHTML = "";

    const totalSaved = items.length;
    const hasResults = filtered.length > 0;

    searchSection.hidden = totalSaved === 0;
    emptyState.hidden = true;
    noResults.hidden = !(totalSaved > 0 && !hasResults);

    filtered.forEach((item) => itemsList.appendChild(createCard(item)));
  }

  // ─── Card builder ─────────────────────────────────────────────────────────────
  function createCard(item) {
    const li = document.createElement("li");
    li.className = "item-card";
    li.dataset.id = item.id;

    // Text
    const textEl = document.createElement("p");
    textEl.className = "item-text";
    textEl.textContent = item.text;
    li.appendChild(textEl);

    // URL
    if (item.url) {
      const urlEl = document.createElement("a");
      urlEl.className = "item-url";
      urlEl.href = "#";
      urlEl.title = item.url;
      urlEl.textContent = truncateUrl(item.url);
      urlEl.addEventListener("click", (e) => { e.preventDefault(); chrome.tabs.create({ url: item.url }); });
      li.appendChild(urlEl);
    }

    // AI summary
    if (item.summary) {
      const summaryEl = document.createElement("p");
      summaryEl.className = "item-summary";
      summaryEl.textContent = item.summary;
      li.appendChild(summaryEl);
    }

    // AI tags
    if (item.tags && item.tags.length) {
      const tagsEl = document.createElement("div");
      tagsEl.className = "item-tags";
      item.tags.forEach((tag) => {
        const pill = document.createElement("span");
        pill.className = "tag-pill";
        pill.textContent = tag;
        tagsEl.appendChild(pill);
      });
      li.appendChild(tagsEl);
    }

    // Reading progress (shown when tracking is enabled, not for PDFs)
    if (item.trackProgress && !isPdfUrl(item.url || "")) {
      li.appendChild(buildProgressSection(item));
    }

    // Meta row
    const meta = document.createElement("div");
    meta.className = "item-meta";

    const dateEl = document.createElement("span");
    dateEl.className = "item-date";
    dateEl.textContent = formatDate(item.createdAt);

    const actions = document.createElement("div");
    actions.className = "item-actions";

    if (item.url) {
      const linkBtn = document.createElement("button");
      linkBtn.className = "action-btn link-btn";
      linkBtn.title = "Open URL";
      linkBtn.setAttribute("aria-label", "Open saved URL");
      linkBtn.innerHTML = ICONS.link;
      linkBtn.addEventListener("click", () => chrome.tabs.create({ url: item.url }));
      actions.appendChild(linkBtn);

      if (!isPdfUrl(item.url || "")) {
        const trackBtn = document.createElement("button");
        trackBtn.className = "action-btn track-btn" + (item.trackProgress ? " track-active" : "");
        trackBtn.title = item.trackProgress ? "Stop tracking reading progress" : "Track reading progress";
        trackBtn.setAttribute("aria-label", item.trackProgress ? "Stop tracking" : "Track reading progress");
        trackBtn.innerHTML = ICONS.eye;
        trackBtn.addEventListener("click", () => toggleTracking(item, li));
        actions.appendChild(trackBtn);
      }
    }

    if (aiSettings && aiSettings.key && aiSettings.provider) {
      const retagBtn = document.createElement("button");
      retagBtn.className = "action-btn retag-btn";
      retagBtn.title = "Generate AI tags & summary";
      retagBtn.setAttribute("aria-label", "Generate AI tags and summary");
      retagBtn.innerHTML = ICONS.sparkle;
      retagBtn.addEventListener("click", () => enhanceWithAI(item, true));
      actions.appendChild(retagBtn);
    }

    const copyBtn = document.createElement("button");
    copyBtn.className = "action-btn copy-btn";
    copyBtn.title = "Copy text";
    copyBtn.setAttribute("aria-label", "Copy text to clipboard");
    copyBtn.innerHTML = ICONS.copy;
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(item.url || item.text).then(() => {
        copyBtn.innerHTML = ICONS.check;
        setTimeout(() => { copyBtn.innerHTML = ICONS.copy; }, 1200);
      });
    });

    const delBtn = document.createElement("button");
    delBtn.className = "action-btn delete-btn";
    delBtn.title = "Delete";
    delBtn.setAttribute("aria-label", "Delete this item");
    delBtn.innerHTML = ICONS.trash;
    delBtn.addEventListener("click", () => deleteItem(item.id, li));

    actions.appendChild(copyBtn);
    actions.appendChild(delBtn);
    meta.appendChild(dateEl);
    meta.appendChild(actions);
    li.appendChild(meta);

    return li;
  }

  // ─── Reading progress ────────────────────────────────────────────────────────
  function buildProgressSection(item) {
    const div = document.createElement("div");
    div.className = "progress-section";

    const barTrack = document.createElement("div");
    barTrack.className = "progress-bar-track";
    const barFill = document.createElement("div");
    barFill.className = "progress-bar-fill";
    barFill.style.width = (item.scrollPercent || 0) + "%";
    barTrack.appendChild(barFill);

    const progressText = document.createElement("span");
    progressText.className = "progress-text";
    const pct = item.scrollPercent || 0;
    progressText.textContent = pct === 0 ? "Not started" : `${pct}% read`;
    if (item.lastRead) progressText.textContent += ` · ${formatDate(item.lastRead)}`;

    div.appendChild(barTrack);
    div.appendChild(progressText);
    return div;
  }

  function toggleTracking(itemRef, li) {
    const idx = allItems.findIndex((i) => i.id === itemRef.id);
    if (idx === -1) return;

    const nowTracking = !allItems[idx].trackProgress;
    allItems[idx].trackProgress = nowTracking;
    chrome.storage.local.set({ items: allItems }, () => {
      // Inject AFTER storage write is confirmed
      if (nowTracking && allItems[idx].url) {
        const targetUrl = normalizeUrl(allItems[idx].url);
        chrome.tabs.query({}, (tabs) => {
          if (!tabs) return;
          tabs.forEach((tab) => {
            if (tab.url && normalizeUrl(tab.url) === targetUrl) {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content.js"],
              }).catch(() => {});
            }
          });
        });
      }
    });

    const trackBtn = li.querySelector(".track-btn");
    if (trackBtn) {
      trackBtn.classList.toggle("track-active", nowTracking);
      trackBtn.title = nowTracking ? "Stop tracking reading progress" : "Track reading progress";
      trackBtn.setAttribute("aria-label", nowTracking ? "Stop tracking" : "Track reading progress");
    }

    let progressSection = li.querySelector(".progress-section");
    if (nowTracking) {
      if (!progressSection) {
        progressSection = buildProgressSection(allItems[idx]);
        li.querySelector(".item-meta").before(progressSection);
      } else {
        progressSection.hidden = false;
      }
    } else {
      if (progressSection) progressSection.hidden = true;
    }
  }

  // ─── Delete ───────────────────────────────────────────────────────────────────
  function deleteItem(id, el) {
    const h = el.offsetHeight;
    el.style.height = h + "px";
    el.style.overflow = "hidden";
    void el.offsetHeight;

    el.style.transition = [
      "opacity 160ms ease",
      "transform 160ms ease",
      "height 240ms cubic-bezier(0.4, 0, 1, 1) 60ms",
      "margin-bottom 240ms cubic-bezier(0.4, 0, 1, 1) 60ms",
      "padding-top 200ms ease 60ms",
      "padding-bottom 200ms ease 60ms",
      "border-top-width 200ms ease 60ms",
      "border-bottom-width 200ms ease 60ms",
    ].join(", ");

    el.style.opacity = "0";
    el.style.transform = "scale(0.97)";
    el.style.height = "0";
    el.style.marginBottom = "0";
    el.style.paddingTop = "0";
    el.style.paddingBottom = "0";
    el.style.borderTopWidth = "0";
    el.style.borderBottomWidth = "0";

    setTimeout(() => {
      el.remove();
      allItems = allItems.filter((item) => item.id !== id);
      chrome.storage.local.set({ items: allItems }, () => {
        updateCount();
        // show empty/no-results state if needed without re-rendering all cards
        const term     = searchInput.value.trim().toLowerCase();
        const filtered = term ? allItems.filter((i) => i.text.toLowerCase().includes(term)) : allItems;
        searchSection.hidden = allItems.length === 0;
        emptyState.hidden    = allItems.length > 0;
        noResults.hidden     = !(allItems.length > 0 && filtered.length === 0);
      });
    }, 320);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  function updateCount() { itemCount.textContent = allItems.length; }

  function normalizeUrl(url) {
    try {
      const u = new URL(url);
      return u.origin + u.pathname + u.search;
    } catch (_) {
      return url;
    }
  }

  function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function formatDate(ts) {
    const d = new Date(ts);
    const diffMs   = Date.now() - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs  = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1)  return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs  < 24) return `${diffHrs}h ago`;
    if (diffDays < 7)  return `${diffDays}d ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function truncateUrl(url) {
    try {
      const u = new URL(url);
      const s = u.hostname + (u.pathname !== "/" ? u.pathname : "") + u.search;
      return s.length > 48 ? s.slice(0, 45) + "…" : s;
    } catch (_) {
      return url.length > 48 ? url.slice(0, 45) + "…" : url;
    }
  }

  function flashInvalid(el) {
    el.classList.add("invalid");
    setTimeout(() => el.classList.remove("invalid"), 600);
  }
})();
