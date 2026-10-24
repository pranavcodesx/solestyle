# SoleStyle – Accordion Component (Week 2)

Week 2 task for the Junior Frontend Developer Internship (Yuva Intern): **Developing Interactive UI Components**.

The component is a reusable, accessible **Accordion** written with plain HTML, CSS and vanilla JavaScript (no libraries). It is used for the FAQ sections of the SoleStyle sneaker store (built in Week 1) on the **Home** page and the **Contact** page.

## Files
| File | Purpose |
|---|---|
| `accordion.js` | The component: ARIA setup, open/close logic, keyboard support, public API |
| `accordion.css` | Component styles, animation and responsive rules |
| `accordion-demo.html` | Standalone demo page (needs only the two files above) |
| `index.html`, `style.css`, `script.js` | The SoleStyle store where the component is used |
| `screenshots/` | Desktop, tablet and mobile screenshots |

## Features
- **Interactivity:** click or tap a heading to open or close its panel, with a smooth height animation and a +/– icon.
- **Two modes:** one panel open at a time (Home page) or several at once with an "Expand all / Collapse all" button (Contact page).
- **Accessibility:**
  - headings are real `<button>` elements inside `<h3>`
  - `aria-expanded`, `aria-controls`, `role="region"` and `aria-labelledby` are set automatically
  - closed panels are hidden from keyboard and screen readers
  - visible focus outline, large tap targets, `prefers-reduced-motion` respected
- **Keyboard support:** `Tab` to reach a heading, `Enter` / `Space` to toggle, `↑` / `↓` to move between headings (wraps around), `Home` / `End` to jump to the first or last heading.
- **Responsive:** fluid width, adjusted spacing on screens below 560 px.
- **Fallback and error handling:** if JavaScript fails to load, every panel stays open so no content is lost. Browsers without CSS grid-row animation use a simple show/hide. Items with missing parts are skipped with a console warning, and start-up is wrapped in `try/catch`.
- **Modular:** the component has no dependency on the store code. Styling uses the site's CSS variables with built-in fallback colours.

## How to use
1. Add the files to your page:
   ```html
   <link rel="stylesheet" href="accordion.css">
   <script src="accordion.js"></script>
   ```
2. Write the markup:
   ```html
   <div class="acc" data-accordion data-open="0">
     <div class="acc-item">
       <h3 class="acc-heading"><button type="button" class="acc-trigger">Question</button></h3>
       <div class="acc-panel"><div class="acc-inner"><p>Answer</p></div></div>
     </div>
   </div>
   ```
3. Start it: `Accordion.init();` (or `Accordion.init(someElement)` for content added later).

### Options (data attributes on `.acc`)
| Attribute | Values | Meaning |
|---|---|---|
| `data-multiple` | `true` / `false` (default) | allow several panels open at once |
| `data-open` | `0`, `1`, … / `all` / `none` (default) | which panel is open at start |
| `data-controls` | `true` | add an "Expand all / Collapse all" button (with `data-multiple="true"`) |

### JavaScript API
```js
const [acc] = Accordion.init();   // returns the accordion instances found
acc.open(1);  acc.close(1);  acc.toggle(1);
acc.openAll(); acc.closeAll();
document.addEventListener('accordion:toggle', e => {
  console.log(e.detail.index, e.detail.open);   // which panel, opened or closed
});
```

## How to test
1. Open `accordion-demo.html` (or `index.html` and go to **Home** or **Contact**) in a modern browser.
2. **Mouse:** click headings; check that single mode closes the others and "Expand all" opens everything.
3. **Keyboard:** use `Tab`, `Enter`, `Space`, arrow keys, `Home` and `End`.
4. **Screen sizes:** press `F12`, turn on device mode and try 375 px, 768 px and 1280 px.
5. **Reduced motion:** turn on "reduce motion" in your operating system; the animation is switched off.
6. **Fallback:** block `accordion.js` in DevTools and reload; all answers stay visible.

## Note
Product photos in the store load from Unsplash and need an internet connection; without it, a drawn sneaker is shown instead.
