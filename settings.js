// settings.js — Settings page logic for Kuikku Extension

(function () {
  "use strict";

  // ─── Model options ────────────────────────────────────────────────────────────
  const ANTHROPIC_MODELS = [
    { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 — Fast & cheap" },
    { value: "claude-sonnet-4-6",         label: "Claude Sonnet 4.6 — Balanced" },
    { value: "claude-opus-4-6",           label: "Claude Opus 4.6 — Most capable" },
  ];

  const OPENAI_MODELS = [
    { value: "gpt-4o-mini", label: "GPT-4o Mini — Fast & cheap" },
    { value: "gpt-4o",      label: "GPT-4o — Balanced" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo — Most capable" },
  ];

  const XAI_MODELS = [
    { value: "grok-2-mini",   label: "Grok 2 Mini — Fast & cheap" },
    { value: "grok-2-1212",   label: "Grok 2 — Balanced" },
    { value: "grok-beta",     label: "Grok Beta — Most capable" },
  ];

const GEMINI_MODELS = [
    { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite — Fastest & cheapest" },
    { value: "gemini-2.5-flash",      label: "Gemini 2.5 Flash — Balanced" },
    { value: "gemini-2.5-pro",        label: "Gemini 2.5 Pro — Most capable" },
  ];


  // ─── SVG icons ────────────────────────────────────────────────────────────────
  const SUN_SVG  = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const MOON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const EYE_SVG  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const EYE_OFF  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  // ─── Element refs ─────────────────────────────────────────────────────────────
  const navBtns       = document.querySelectorAll(".nav-btn");
  const sections      = document.querySelectorAll(".section");
  const themeToggle   = document.getElementById("theme-toggle");
  const themeIcon     = document.getElementById("theme-icon");
  const themeLabel    = document.getElementById("theme-label");

  // GitHub
  const githubToken         = document.getElementById("github-token");
  const githubOwner         = document.getElementById("github-owner");
  const githubRepo          = document.getElementById("github-repo");
  const githubBranch        = document.getElementById("github-branch");
  const githubPath          = document.getElementById("github-path");
  const githubTest          = document.getElementById("github-test");
  const githubSave          = document.getElementById("github-save");
  const githubSyncNow       = document.getElementById("github-sync-now");
  const githubStatus        = document.getElementById("github-status");
  const syncStatus          = document.getElementById("sync-status");
  const toggleToken         = document.getElementById("toggle-token");
  const githubFormCard      = document.getElementById("github-form-card");
  const githubConnectedCard = document.getElementById("github-connected-card");
  const connectedRepo       = document.getElementById("connected-repo");
  const connectedBranch     = document.getElementById("connected-branch");
  const connectedPath       = document.getElementById("connected-path");
  const connectedToken      = document.getElementById("connected-token");
  const githubEdit          = document.getElementById("github-edit");
  const githubDisconnect    = document.getElementById("github-disconnect");
  const githubCancel        = document.getElementById("github-cancel");
  const githubSyncCard      = document.getElementById("github-sync-card");

  // AI
  const aiProvider          = document.getElementById("ai-provider");
  const aiFields            = document.getElementById("ai-fields");
  const aiKey               = document.getElementById("ai-key");
  const aiKeyHint           = document.getElementById("ai-key-hint");
  const aiModel             = document.getElementById("ai-model");
  const aiAutoTag           = document.getElementById("ai-auto-tag");
  const aiAutoSummary       = document.getElementById("ai-auto-summary");
  const aiSave              = document.getElementById("ai-save");
  const aiStatus            = document.getElementById("ai-status");
  const aiFormCard          = document.getElementById("ai-form-card");
  const aiConnectedCard     = document.getElementById("ai-connected-card");
  const aiEdit              = document.getElementById("ai-edit");
  const aiDisconnect        = document.getElementById("ai-disconnect");
  const aiCancel            = document.getElementById("ai-cancel");
  const aiConnectedProvider = document.getElementById("ai-connected-provider");
  const aiConnectedModel    = document.getElementById("ai-connected-model");
  const aiConnectedKey      = document.getElementById("ai-connected-key");
  const aiConnectedTag      = document.getElementById("ai-connected-tag");
  const aiConnectedSummary  = document.getElementById("ai-connected-summary");

  // Data
  const exportJson    = document.getElementById("export-json");
  const exportMd      = document.getElementById("export-md");
  const importFile    = document.getElementById("import-file");
  const clearAll      = document.getElementById("clear-all");
  const dataStatus    = document.getElementById("data-status");

  let isDark = true;

  // ─── Bootstrap ────────────────────────────────────────────────────────────────
  chrome.storage.local.get(["theme", "github", "ai"], (result) => {
    isDark = result.theme !== "light";
    applyTheme(isDark);
    document.body.classList.add("ready");

    if (result.github && result.github.token && result.github.owner && result.github.repo) {
      populateForm(result.github);
      showConnectedState(result.github);
    } else {
      githubBranch.value = "main";
      githubPath.value   = "bookmarks.json";
      showFormState();
    }

    if (result.ai && result.ai.provider && result.ai.key) {
      populateAiForm(result.ai);
      showAiConnectedState(result.ai);
    } else {
      showAiFormState();
    }
  });

  // ─── Navigation ───────────────────────────────────────────────────────────────
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      navBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.section;
      sections.forEach((s) => { s.hidden = s.id !== `section-${target}`; });
    });
  });

  // ─── Theme ────────────────────────────────────────────────────────────────────
  function applyTheme(dark) {
    isDark = dark;
    if (dark) {
      document.documentElement.classList.remove("light");
      themeIcon.innerHTML = SUN_SVG;
      themeLabel.textContent = "Light mode";
    } else {
      document.documentElement.classList.add("light");
      themeIcon.innerHTML = MOON_SVG;
      themeLabel.textContent = "Dark mode";
    }
  }

  themeToggle.addEventListener("click", () => {
    applyTheme(!isDark);
    chrome.storage.local.set({ theme: isDark ? "dark" : "light" });
  });

  // ─── Token visibility toggle ──────────────────────────────────────────────────
  toggleToken.innerHTML = EYE_SVG;
  toggleToken.addEventListener("click", () => {
    const isPassword = githubToken.type === "password";
    githubToken.type     = isPassword ? "text" : "password";
    toggleToken.innerHTML = isPassword ? EYE_OFF : EYE_SVG;
  });

  // ─── GitHub: field validation ────────────────────────────────────────────────
  function validateGithubForm() {
    const filled = githubToken.value.trim() && githubOwner.value.trim() && githubRepo.value.trim();
    githubSave.disabled = !filled;
  }

  [githubToken, githubOwner, githubRepo].forEach((el) =>
    el.addEventListener("input", validateGithubForm)
  );

  // ─── GitHub: save ─────────────────────────────────────────────────────────────
  githubSave.addEventListener("click", () => {
    const s = getGithubSettings();
    chrome.storage.local.set({ github: s }, () => {
      showConnectedState(s);
    });
  });

  // ─── GitHub: edit / disconnect ────────────────────────────────────────────────
  githubEdit.addEventListener("click", () => showFormState(true));

  githubCancel.addEventListener("click", () => {
    chrome.storage.local.get("github", (result) => {
      if (result.github) populateForm(result.github);
      showConnectedState(result.github);
    });
  });

  githubDisconnect.addEventListener("click", () => {
    chrome.storage.local.remove("github", () => {
      githubToken.value  = "";
      githubOwner.value  = "";
      githubRepo.value   = "";
      githubBranch.value = "main";
      githubPath.value   = "bookmarks.json";
      showFormState();
    });
  });

  // ─── GitHub: test connection ──────────────────────────────────────────────────
  githubTest.addEventListener("click", async () => {
    const s = getGithubSettings();
    if (!s.token || !s.owner || !s.repo) {
      showStatus(githubStatus, "Fill in token, owner, and repository name first.", "error");
      return;
    }

    setLoading(githubTest, true, "Testing…");
    showStatus(githubStatus, "Connecting to GitHub…", "info");

    try {
      const resp = await fetch(`https://api.github.com/repos/${s.owner}/${s.repo}`, {
        headers: {
          "Authorization": `token ${s.token}`,
          "Accept": "application/vnd.github.v3+json",
        },
      });

      if (resp.ok) {
        const data = await resp.json();
        showStatus(githubStatus, `Connected — ${data.full_name} (${data.private ? "private" : "public"})`, "success");
      } else if (resp.status === 401) {
        showStatus(githubStatus, "Authentication failed. Check your personal access token.", "error");
      } else if (resp.status === 404) {
        showStatus(githubStatus, "Repository not found. Check the owner and repo name.", "error");
      } else {
        showStatus(githubStatus, `GitHub returned ${resp.status}. Check your settings.`, "error");
      }
    } catch (e) {
      showStatus(githubStatus, `Network error: ${e.message}`, "error");
    } finally {
      setLoading(githubTest, false, "Test Connection");
    }
  });

  // ─── GitHub: sync now ─────────────────────────────────────────────────────────
  githubSyncNow.addEventListener("click", async () => {
    const s = getGithubSettings();
    if (!s.token || !s.owner || !s.repo) {
      showStatus(syncStatus, "Configure and save your GitHub settings first.", "error");
      return;
    }

    setLoading(githubSyncNow, true, "Pulling…");
    showStatus(syncStatus, "Fetching bookmarks from GitHub…", "info");

    try {
      const remote = await pullFromGitHub(s);
      const { items: local = [] } = await storageGet("items");

      // Merge: add remote items that don't exist locally (deduplicate by id)
      const localIds = new Set(local.map((i) => i.id));
      const newItems = remote.filter((i) => !localIds.has(i.id));
      const merged   = [...newItems, ...local];

      await storageSet({ items: merged });
      showStatus(syncStatus, `Pulled ${newItems.length} new bookmark${newItems.length !== 1 ? "s" : ""} from GitHub (${merged.length} total).`, "success");
    } catch (e) {
      showStatus(syncStatus, `Pull failed: ${e.message}`, "error");
    } finally {
      setLoading(githubSyncNow, false, "Pull Now");
    }
  });

  async function pullFromGitHub(s) {
    const apiUrl = `https://api.github.com/repos/${s.owner}/${s.repo}/contents/${s.path}`;
    const headers = {
      "Authorization": `token ${s.token}`,
      "Accept": "application/vnd.github.v3+json",
    };

    const r = await fetch(`${apiUrl}?ref=${s.branch || "main"}`, { headers });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${r.status}`);
    }

    const data    = await r.json();
    const decoded = atob(data.content.replace(/\n/g, ""));
    const parsed  = JSON.parse(decoded);

    if (!Array.isArray(parsed)) throw new Error("File on GitHub is not a valid bookmarks array.");
    return parsed;
  }

  function getGithubSettings() {
    return {
      token:  githubToken.value.trim(),
      owner:  githubOwner.value.trim(),
      repo:   githubRepo.value.trim(),
      branch: githubBranch.value.trim() || "main",
      path:   githubPath.value.trim()   || "bookmarks.json",
    };
  }

  function populateForm(s) {
    githubToken.value  = s.token  || "";
    githubOwner.value  = s.owner  || "";
    githubRepo.value   = s.repo   || "";
    githubBranch.value = s.branch || "main";
    githubPath.value   = s.path   || "bookmarks.json";
  }

  function showConnectedState(s) {
    connectedRepo.textContent   = `${s.owner} / ${s.repo}`;
    connectedBranch.textContent = s.branch || "main";
    connectedPath.textContent   = s.path   || "bookmarks.json";
    const t = s.token || "";
    connectedToken.textContent  = t.slice(0, 7) + "••••••••••••";
    githubFormCard.hidden      = true;
    githubConnectedCard.hidden = false;
    githubSyncCard.hidden      = false;
  }

  function showFormState(isEdit = false) {
    githubConnectedCard.hidden = true;
    githubFormCard.hidden      = false;
    githubSyncCard.hidden      = true;
    githubCancel.hidden        = !isEdit;
    githubSave.textContent     = isEdit ? "Update Credentials" : "Save Credentials";
    validateGithubForm();
  }

  // ─── AI state helpers ─────────────────────────────────────────────────────────
  const PROVIDER_LABELS = {
    anthropic: "Anthropic (Claude)",
    openai:    "OpenAI (GPT)",
    xai:       "xAI (Grok)",
    gemini:    "Google Gemini",
  };

  function populateAiForm(s) {
    aiProvider.value      = s.provider || "";
    aiKey.value           = s.key      || "";
    aiAutoTag.checked     = s.autoTag     !== false;
    aiAutoSummary.checked = s.autoSummary !== false;
    updateAiFields(s.provider || "", s.model || "");
  }

  function showAiConnectedState(s) {
    aiConnectedProvider.textContent = PROVIDER_LABELS[s.provider] || s.provider;
    aiConnectedModel.textContent    = s.model || "—";
    aiConnectedKey.textContent      = s.key.slice(0, 8) + "••••••••••••";
    aiConnectedTag.textContent      = s.autoTag     !== false ? "On" : "Off";
    aiConnectedSummary.textContent  = s.autoSummary !== false ? "On" : "Off";
    aiFormCard.hidden               = true;
    aiConnectedCard.hidden          = false;
  }

  function showAiFormState(isEdit = false) {
    aiConnectedCard.hidden = true;
    aiFormCard.hidden      = false;
    aiCancel.hidden        = !isEdit;
    aiSave.textContent     = isEdit ? "Update Credentials" : "Save Credentials";
    validateAiForm();
  }

  async function pushToGitHub(s, items) {
    const apiUrl = `https://api.github.com/repos/${s.owner}/${s.repo}/contents/${s.path}`;
    const headers = {
      "Authorization": `token ${s.token}`,
      "Accept": "application/vnd.github.v3+json",
    };

    // Get current file SHA (needed to update existing file)
    let sha = null;
    try {
      const getResp = await fetch(`${apiUrl}?ref=${s.branch}`, { headers });
      if (getResp.ok) sha = (await getResp.json()).sha;
    } catch (_) {}

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(items, null, 2))));
    const body = {
      message: `Kuikku sync — ${new Date().toISOString()}`,
      content,
      branch: s.branch,
      ...(sha ? { sha } : {}),
    };

    const putResp = await fetch(apiUrl, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!putResp.ok) {
      const err = await putResp.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${putResp.status}`);
    }
  }

  // ─── AI: provider change ──────────────────────────────────────────────────────
  aiProvider.addEventListener("change", () => { updateAiFields(aiProvider.value, ""); validateAiForm(); });

  function updateAiFields(provider, selectedModel) {
    aiFields.hidden = !provider;
    if (!provider) return;

    const modelsMap = {
      anthropic: ANTHROPIC_MODELS,
      openai:    OPENAI_MODELS,
      xai:       XAI_MODELS,
      gemini:    GEMINI_MODELS,
    };
    const hintsMap = {
      anthropic: "Get your key at console.anthropic.com",
      openai:    "Get your key at platform.openai.com",
      xai:       "Get your key at console.x.ai",
      gemini:    "Get your key at aistudio.google.com",
    };

    const models = modelsMap[provider] || OPENAI_MODELS;
    aiModel.innerHTML = models
      .map((m) => `<option value="${m.value}"${m.value === selectedModel ? " selected" : ""}>${m.label}</option>`)
      .join("");

    if (!selectedModel) aiModel.value = models[0].value;
    aiKeyHint.textContent = hintsMap[provider] || "";
  }

  // ─── AI: validation ───────────────────────────────────────────────────────────
  function validateAiForm() {
    aiSave.disabled = !(aiProvider.value && aiKey.value.trim());
  }

  aiKey.addEventListener("input", validateAiForm);

  // ─── AI: save ─────────────────────────────────────────────────────────────────
  aiSave.addEventListener("click", () => {
    const s = {
      provider:    aiProvider.value,
      key:         aiKey.value.trim(),
      model:       aiModel.value,
      autoTag:     aiAutoTag.checked,
      autoSummary: aiAutoSummary.checked,
    };
    chrome.storage.local.set({ ai: s }, () => showAiConnectedState(s));
  });

  // ─── AI: edit / cancel / disconnect ──────────────────────────────────────────
  aiEdit.addEventListener("click", () => showAiFormState(true));

  aiCancel.addEventListener("click", () => {
    chrome.storage.local.get("ai", (result) => {
      if (result.ai) populateAiForm(result.ai);
      showAiConnectedState(result.ai);
    });
  });

  aiDisconnect.addEventListener("click", () => {
    chrome.storage.local.remove("ai", () => {
      aiProvider.value  = "";
      aiKey.value       = "";
      aiFields.hidden   = true;
      showAiFormState();
    });
  });

  // ─── Data: export JSON ────────────────────────────────────────────────────────
  exportJson.addEventListener("click", () => {
    chrome.storage.local.get("items", (result) => {
      const items = Array.isArray(result.items) ? result.items : [];
      downloadBlob(
        new Blob([JSON.stringify(items, null, 2)], { type: "application/json" }),
        "quick-save-bookmarks.json"
      );
      showStatus(dataStatus, `Exported ${items.length} bookmark${items.length !== 1 ? "s" : ""}.`, "success");
    });
  });

  // ─── Data: export Markdown ────────────────────────────────────────────────────
  exportMd.addEventListener("click", () => {
    chrome.storage.local.get("items", (result) => {
      const items = Array.isArray(result.items) ? result.items : [];
      const lines = ["# Kuikku Bookmarks", "", `*Exported ${new Date().toLocaleDateString()}*`, ""];
      items.forEach((item) => {
        lines.push(item.url ? `- [${item.text}](${item.url})` : `- ${item.text}`);
        if (item.summary) lines.push(`  > ${item.summary}`);
        if (item.tags && item.tags.length) lines.push(`  *Tags: ${item.tags.join(", ")}*`);
      });
      downloadBlob(
        new Blob([lines.join("\n")], { type: "text/markdown" }),
        "quick-save-bookmarks.md"
      );
      showStatus(dataStatus, `Exported ${items.length} bookmark${items.length !== 1 ? "s" : ""}.`, "success");
    });
  });

  // ─── Data: import ─────────────────────────────────────────────────────────────
  importFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (!Array.isArray(imported)) throw new Error("invalid");

        chrome.storage.local.get("items", (result) => {
          const existing = Array.isArray(result.items) ? result.items : [];
          const existingIds = new Set(existing.map((i) => i.id));
          const fresh = imported.filter((i) => !existingIds.has(i.id));
          chrome.storage.local.set({ items: [...fresh, ...existing] }, () => {
            showStatus(dataStatus, `Imported ${fresh.length} new bookmark${fresh.length !== 1 ? "s" : ""}.`, "success");
          });
        });
      } catch (_) {
        showStatus(dataStatus, "Invalid file. Select a Kuikku JSON export.", "error");
      }
      importFile.value = "";
    };
    reader.readAsText(file);
  });

  // ─── Data: clear all ──────────────────────────────────────────────────────────
  clearAll.addEventListener("click", () => {
    if (!confirm("Delete all bookmarks? This cannot be undone.")) return;
    chrome.storage.local.set({ items: [] }, () => {
      showStatus(dataStatus, "All bookmarks deleted.", "success");
    });
  });

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  function showStatus(el, message, type) {
    el.hidden = false;
    el.textContent = message;
    el.className = `status-bar status-${type}`;
    if (type === "success") setTimeout(() => { el.hidden = true; }, 3500);
  }

  function setLoading(btn, loading, label) {
    btn.disabled = loading;
    btn.textContent = label;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function storageGet(key) {
    return new Promise((resolve) => chrome.storage.local.get(key, resolve));
  }

  function storageSet(obj) {
    return new Promise((resolve) => chrome.storage.local.set(obj, resolve));
  }
})();
