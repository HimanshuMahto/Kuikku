# Quick Save — Chrome Extension

Save anything instantly. Recall it later. No accounts. No servers. No nonsense.

---

## What it does

Quick Save replaces the browser's clunky bookmarking system with a lightweight,
keyboard-friendly panel that lives in your toolbar.

- **Save a note** — type anything into the popup and hit Save (or Cmd/Ctrl + Enter)
- **Save selected text** — highlight text on any page, right-click → "Save this"
- **Save the current page** — right-click anywhere on a page (no selection) → "Save this" to capture the page title and URL
- **Search instantly** — type in the search box; results filter in real time without touching your stored data
- **Copy to clipboard** — one click copies any saved item
- **Open URLs** — saved items with a URL show a link button that opens the page in a new tab
- **Delete items** — remove anything with the × button

---

## Installation (Chrome Developer Mode)

Because this extension is not published to the Chrome Web Store, install it manually:

1. Download or clone this repository so you have the `quick-save-extension/` folder on your machine.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked**.
5. Select the `quick-save-extension/` folder.
6. The Quick Save icon appears in your toolbar. Pin it for easy access.

> To update after editing files, return to `chrome://extensions` and click the refresh icon on the Quick Save card.

---

## Icon setup (optional)

The extension references icon files at `icons/icon16.png`, `icons/icon48.png`, and `icons/icon128.png`.
Place any PNG images at those paths to display a custom icon. If the files are absent Chrome will
show a generic puzzle-piece placeholder — the extension works fine either way.

---

## How data is stored

All saved items live in `chrome.storage.local` under a single key:

```json
{
  "items": [
    {
      "id": "1700000000000-abc1234",
      "text": "The saved note or selected text",
      "url": "https://example.com",
      "createdAt": 1700000000000
    }
  ]
}
```

- Items are ordered **newest first**.
- Data is stored **only on the device** where the extension is installed.
- Nothing is ever sent anywhere.

---

## Privacy statement

**All data stays inside your browser. Nothing is collected or transmitted.**

Quick Save has no backend, no cloud sync, no analytics, no telemetry, and no
network requests of any kind. Your saved items never leave your machine.

---

## Keyboard shortcut

Inside the popup, press **Cmd + Enter** (macOS) or **Ctrl + Enter** (Windows/Linux)
to save without reaching for the mouse.

---

## Permissions used

| Permission      | Why it is needed |
|-----------------|------------------|
| `storage`       | Save and retrieve your items via `chrome.storage.local` |
| `contextMenus`  | Add the "Save this" right-click menu item |
| `activeTab`     | Read the current tab's URL when saving from the popup |
| `scripting`     | Reserved for potential future content-script use |

---

## File structure

```
quick-save-extension/
├── manifest.json   — Extension manifest (Manifest v3)
├── background.js   — Service worker: context menu + storage writes
├── popup.html      — Popup markup
├── popup.js        — Popup UI logic (save, search, delete, copy)
├── styles.css      — All styles (dark theme, animations)
└── README.md       — This file
```

---

## License

MIT — free to use, modify, and distribute.
