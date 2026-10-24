/* ==========================================================
   Accordion - reusable, accessible UI component (vanilla JS)
   ----------------------------------------------------------
   Markup (progressive enhancement: without JS every panel
   stays visible, so no content is ever hidden):

   <div class="acc" data-accordion data-multiple="false" data-open="0">
     <div class="acc-item">
       <h3 class="acc-heading"><button type="button" class="acc-trigger">Question</button></h3>
       <div class="acc-panel"><div class="acc-inner"><p>Answer</p></div></div>
     </div>
     ...
   </div>

   Options (data attributes on the .acc element):
     data-multiple="true"   allow several panels open at once (default: only one)
     data-open="0"          index of the panel open at start, "all", or "none" (default)
     data-controls="true"   add an "Expand all / Collapse all" button (multiple mode only)

   JavaScript API:
     Accordion.init(root)   enhance every [data-accordion] inside root (safe to call again)
     instance.open(i) / close(i) / toggle(i) / openAll() / closeAll()

   Event (bubbles): "accordion:toggle" with detail { index, open, trigger }
   ========================================================== */
(function (global) {
  'use strict';

  var uid = 0; // used to build unique ids for ARIA wiring

  /* ---------- Helper: read a boolean data attribute ---------- */
  function flag(el, name, fallback) {
    var v = el.getAttribute('data-' + name);
    return v === null ? fallback : v === 'true' || v === '';
  }

  /* ---------- Accordion class ---------- */
  function Accordion(root) {
    this.root = root;
    this.multiple = flag(root, 'multiple', false);
    this.items = [];
    this.build();
  }

  /* Read the markup, add ARIA attributes, attach listeners. */
  Accordion.prototype.build = function () {
    var self = this;
    var id = 'acc' + (++uid);
    var nodes = Array.prototype.slice.call(this.root.querySelectorAll(':scope > .acc-item'));

    nodes.forEach(function (node, i) {
      var trigger = node.querySelector('.acc-trigger');
      var panel = node.querySelector('.acc-panel');
      if (!trigger || !panel) {
        console.warn('Accordion: item ' + i + ' needs .acc-trigger and .acc-panel, skipped.');
        return;
      }
      trigger.id = trigger.id || id + '-t' + i;
      panel.id = panel.id || id + '-p' + i;

      /* ARIA: the button controls the panel; the panel is labelled by the button */
      trigger.setAttribute('aria-controls', panel.id);
      trigger.setAttribute('aria-expanded', 'false');
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', trigger.id);

      /* Decorative +/- icon is added by JS so the no-JS version stays clean */
      if (!trigger.querySelector('.acc-icon')) {
        var icon = document.createElement('span');
        icon.className = 'acc-icon';
        icon.setAttribute('aria-hidden', 'true');
        trigger.appendChild(icon);
      }

      trigger.addEventListener('click', function () { self.toggle(self.indexOf(trigger)); });
      trigger.addEventListener('keydown', function (e) { self.onKey(e, trigger); });
      self.items.push({ node: node, trigger: trigger, panel: panel });
    });

    if (!this.items.length) return;

    /* From here on CSS may collapse panels (class is added only when JS works) */
    this.root.classList.add('is-ready');

    this.setInitialState();
    if (this.multiple && flag(this.root, 'controls', false)) this.addControls();
  };

  Accordion.prototype.indexOf = function (trigger) {
    for (var i = 0; i < this.items.length; i++) if (this.items[i].trigger === trigger) return i;
    return -1;
  };

  /* data-open="0" | "all" | "none" */
  Accordion.prototype.setInitialState = function () {
    var start = this.root.getAttribute('data-open');
    if (start === 'all' && this.multiple) return this.openAll(true);
    var n = parseInt(start, 10);
    if (!isNaN(n) && this.items[n]) this.set(n, true, true);
  };

  /* Open or close one panel. `quiet` skips the custom event (used at start-up). */
  Accordion.prototype.set = function (i, open, quiet) {
    var item = this.items[i];
    if (!item || item.node.classList.contains('open') === open) return;

    /* single-open mode: close the others first */
    if (open && !this.multiple) {
      for (var k = 0; k < this.items.length; k++) if (k !== i) this.set(k, false, true);
    }
    item.node.classList.toggle('open', open);
    item.trigger.setAttribute('aria-expanded', String(open));

    this.updateControls();
    if (!quiet) {
      try {
        this.root.dispatchEvent(new CustomEvent('accordion:toggle', {
          bubbles: true, detail: { index: i, open: open, trigger: item.trigger }
        }));
      } catch (err) { /* very old browsers: events are optional */ }
    }
  };

  Accordion.prototype.open = function (i) { this.set(i, true); };
  Accordion.prototype.close = function (i) { this.set(i, false); };
  Accordion.prototype.toggle = function (i) {
    if (this.items[i]) this.set(i, !this.items[i].node.classList.contains('open'));
  };
  Accordion.prototype.openAll = function (quiet) {
    for (var i = 0; i < this.items.length; i++) this.set(i, true, quiet);
  };
  Accordion.prototype.closeAll = function () {
    for (var i = 0; i < this.items.length; i++) this.set(i, false);
  };

  /* Keyboard: Up/Down move between headings (wrapping), Home/End jump to first/last.
     Enter and Space already work because the trigger is a real <button>. */
  Accordion.prototype.onKey = function (e, trigger) {
    var last = this.items.length - 1, i = this.indexOf(trigger), to = null;
    if (e.key === 'ArrowDown') to = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowUp') to = i === 0 ? last : i - 1;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = last;
    if (to === null) return;
    e.preventDefault();
    this.items[to].trigger.focus();
  };

  /* Optional "Expand all / Collapse all" button */
  Accordion.prototype.addControls = function () {
    var self = this;
    var bar = document.createElement('div');
    bar.className = 'acc-tools';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'acc-all';
    btn.addEventListener('click', function () {
      if (self.allOpen()) self.closeAll(); else self.openAll();
    });
    bar.appendChild(btn);
    this.root.parentNode.insertBefore(bar, this.root);
    this.allBtn = btn;
    this.updateControls();
  };

  Accordion.prototype.allOpen = function () {
    return this.items.every(function (it) { return it.node.classList.contains('open'); });
  };

  Accordion.prototype.updateControls = function () {
    if (this.allBtn) this.allBtn.textContent = this.allOpen() ? 'Collapse all' : 'Expand all';
  };

  /* ---------- Public API ---------- */
  var instances = new WeakMap();

  global.Accordion = {
    /* Enhance every [data-accordion] inside root. Calling it twice is harmless. */
    init: function (root) {
      var found = [];
      try {
        var list = (root || document).querySelectorAll('[data-accordion]');
        Array.prototype.forEach.call(list, function (el) {
          if (instances.has(el)) { found.push(instances.get(el)); return; }
          var inst = new Accordion(el);
          instances.set(el, inst);
          found.push(inst);
        });
      } catch (err) {
        /* If anything goes wrong the panels simply stay open (no-JS fallback) */
        console.error('Accordion failed to start:', err);
      }
      return found;
    },
    get: function (el) { return instances.get(el) || null; }
  };
})(window);
