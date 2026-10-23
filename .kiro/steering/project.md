# Project: Life Dashboard

## Overview
A single-page personal productivity dashboard built as a RevoU Coding Camp mini-project assignment.
No build tools, no frameworks, no backend — opens directly in any modern browser as a static HTML file.

## Technology Stack
- **HTML5** — semantic structure (`index.html`)
- **CSS3** — custom properties, CSS Grid, Flexbox (`css/style.css`)
- **Vanilla JavaScript (ES6+)** — all interactivity, no libraries (`js/app.js`)
- **Browser localStorage API** — all data persistence, client-side only

## Folder Rules (assignment constraint)
- Exactly one CSS file: `css/style.css`
- Exactly one JavaScript file: `js/app.js`
- No additional files or dependencies may be added

## Browser Compatibility
Chrome, Firefox, Edge, Safari (modern versions). Works as a standalone HTML file or browser extension.

## LocalStorage Keys
| Key                 | Purpose                        |
|---------------------|--------------------------------|
| `dashboard_todos`   | Saved to-do task array (JSON)  |
| `dashboard_links`   | Saved quick links array (JSON) |
| `dashboard_name`    | User's display name (string)   |
| `dashboard_theme`   | UI theme: `"light"` or `"dark"` |

## How to Run
Open `index.html` in any modern browser. No server required.