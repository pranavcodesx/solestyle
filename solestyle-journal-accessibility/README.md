# SoleStyle Journal: Accessibility Rework (Week 3)

Week 3 task for the Junior Frontend Developer Internship (Yuva Intern): **Enhancing User Experience with Accessibility**.

A sneaker-care blog page is audited for accessibility, then rebuilt to follow WCAG 2.2 AA and WAI-ARIA. Both versions have the same content so the results can be compared fairly.

## Results

| Measure | Before | After |
|---|---|---|
| Lighthouse accessibility score | 54 / 100 | 100 / 100 |
| axe-core failing rules / elements | 8 / 80 | 0 / 0 |
| Controls that cannot be reached by keyboard | 11 of 12 click handlers | 0 |
| Visible focus indicator | none | 3 px ring |
| Small touch targets (< 44 px) | 20 of 23 | 0 of 26 |

## Folders
| Folder / file | Contents |
|---|---|
| `before/` | Starting page (index.html, style.css, script.js) with typical accessibility problems |
| `after/` | Accessible page (index.html, style.css, script.js) plus the Week 2 accordion component |
| `audit/` | Lighthouse reports (HTML and JSON), axe-core results, keyboard test results |
| `screenshots/` | Before and after screenshots used in the report |
| `REPORT.md` | Full report: audits, improvements, WCAG mapping, test results |

## How to view
Open `before/index.html` and `after/index.html` in a browser. No build step is needed.

## What was improved
- Semantic landmarks, one `h1`, ordered headings, `lang`, descriptive title, skip link
- Alt text for all images, accessible table (caption, `th scope`)
- Contrast fixed (all text 4.5:1 or better, hero text on a solid panel)
- Real buttons and links instead of click-only `div`s, visible focus, logical tab order
- Menu and submenu as disclosure buttons (`aria-expanded`, `aria-controls`, Esc closes)
- Filters with `aria-pressed` and a live status message ("Showing 2 of 6 articles")
- Native `<dialog>` for the newsletter form: focus moves in, Esc closes, focus returns
- Form with label, `autocomplete`, and error text linked with `aria-describedby` and `aria-invalid`
- 44 px touch targets, zoom allowed, reflow at 320 px, reduced-motion support

## How to repeat the audit
1. Open the page in Chrome, press `F12`, choose the **Lighthouse** tab, tick **Accessibility** and run the report.
2. Install the **axe DevTools** or **WAVE** browser extension and scan the same page.
3. Unplug the mouse: use `Tab`, `Shift+Tab`, `Enter`, `Space` and `Esc` to check that everything works.
