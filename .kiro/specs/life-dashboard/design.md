# Design — Life Dashboard

## Overview

Single-page static web app. One HTML file, one CSS file, one JavaScript file.
No build step, no package manager, no server. Open `index.html` directly in a browser.

## File Structure

```
CodingCamp-22Oktober26-Alexa/
├── index.html          # Page structure and markup
├── css/
│   └── style.css       # All styles (dark theme default, light override, components)
├── js/
│   └── app.js          # All JavaScript — sections 1–4 plus 1b/1c
└── README.md
```

## Architecture

Everything runs in a single browser context. There is no module system — all variables
and functions are in one script scope using `'use strict'`. The four feature sections
are separated by block comments for readability.

### Data flow

```
User interaction
      │
      ▼
Event listener (in app.js)
      │
      ▼
State mutation (todos[], links[], localStorage)
      │
      ▼
Render function (re-draws DOM from state)
```

## HTML Structure (`index.html`)

```
<body>
  <header class="greeting-section">   ← clock, greeting h1, name editor, theme toggle
  <main class="dashboard">            ← CSS Grid, auto-fit columns, min 320px
    <section.timer-card>              ← duration select, display, controls
    <section.todo-card>               ← add form, task list, empty hint
    <section.links-card>              ← add form, chip container, empty hint
  </main>
  <div#edit-modal>                    ← fixed overlay modal for task editing
  <script src="js/app.js">
```

## CSS Design (`css/style.css`)

### Theming strategy
All colours are CSS custom properties on `:root` (dark defaults).
Light mode is a `body.light { }` block that overrides only the colour tokens.
No class duplication — every component automatically adapts.

### Key tokens
| Token | Dark | Light |
|-------|------|-------|
| `--bg` | `#0f172a` | `#f1f5f9` |
| `--bg-card` | `#1e293b` | `#ffffff` |
| `--bg-input` | `#0f172a` | `#f8fafc` |
| `--border` | `#334155` | `#cbd5e1` |
| `--accent` | `#6366f1` | *(unchanged)* |
| `--text-primary` | `#f1f5f9` | `#0f172a` |

### Layout
- Page: `padding: 2rem 1.5rem 4rem`
- Dashboard grid: `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`
- Cards: `border-radius: 12px`, `box-shadow` via `--shadow`

## JavaScript Design (`js/app.js`)

### Sections

| Section | Responsibility |
|---------|---------------|
| `KEYS` constant | All localStorage key strings in one place |
| 1. Greeting & Clock | `setInterval` every 1 s; `getGreeting(hour)` returns phrase |
| 1b. Custom Name | `applyName()` reads `KEYS.NAME`, patches greeting; inline editor UI |
| 1c. Theme | `applyTheme(theme)` toggles `body.light`; persists to `KEYS.THEME` |
| 2. Focus Timer | `setInterval` countdown; `timerRunning` guard prevents double intervals |
| 3. To-Do List | Array `todos[]`; CRUD functions each call `saveTodos()` then `renderTodos()` |
| 4. Quick Links | Array `links[]`; `normalizeUrl()` prepends `https://` if missing |

### LocalStorage pattern (consistent across all features)
```js
function loadX()  { return JSON.parse(localStorage.getItem(KEYS.X)) || []; }
function saveX()  { localStorage.setItem(KEYS.X, JSON.stringify(x)); }
// Every mutation: update state → saveX() → renderX()
```

### Timer: preventing duplicate intervals
```js
function startTimer() {
  if (timerRunning) return;   // guard — only one interval ever runs
  timerRunning = true;
  timerInterval = setInterval(...);
}
```

### Theme: no flash of wrong theme
`applyTheme()` is called synchronously on the last line of the theme section,
before `renderTodos()` and `renderLinks()`, so the correct theme class is on
`<body>` before any dynamic content is painted.

## Non-Functional Properties

| Property | Implementation |
|----------|---------------|
| Performance | No network requests; no heavy assets; DOM updates are targeted re-renders |
| Browser support | CSS custom properties + ES6 — Chrome 57+, Firefox 52+, Edge 16+, Safari 10.1+ |
| Accessibility | `aria-label` on all interactive controls; `aria-live="polite"` on timer; modal uses `role="dialog"` and `aria-modal` |
| Encoding | All files saved UTF-8 without BOM; emoji in HTML use numeric entities (`&#9998;`, `&#9790;`) |