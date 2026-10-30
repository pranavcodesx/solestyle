/* SoleStyle Journal - accessible interactions
   Every widget below follows the WAI-ARIA Authoring Practices pattern noted in its comment. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- 1. Mobile menu (disclosure pattern) ---------- */
  var menuBtn = $('#menuBtn'), nav = $('#siteNav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });

  /* ---------- 2. "Guides" submenu (disclosure pattern, works without hover) ---------- */
  var subBtn = $('#guidesBtn'), subMenu = $('#guidesMenu');
  function setSub(open, returnFocus) {
    subMenu.hidden = !open;
    subBtn.setAttribute('aria-expanded', String(open));
    if (!open && returnFocus) subBtn.focus();
  }
  subBtn.addEventListener('click', function () { setSub(subMenu.hidden); });
  subMenu.parentNode.addEventListener('focusout', function (e) {
    if (!subMenu.parentNode.contains(e.relatedTarget)) setSub(false);   // Tab out closes it
  });
  document.addEventListener('click', function (e) { if (!subMenu.parentNode.contains(e.target)) setSub(false); });

  /* Esc closes whichever menu is open and puts focus back on its button (2.1.2, 2.4.3) */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!subMenu.hidden) { setSub(false, true); return; }
    if (nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- 3. Topic filter + search, announced through a live region (4.1.3) ---------- */
  var chips = $$('.chip'), cards = $$('.card'), q = $('#q'), count = $('#count'), empty = $('#empty');
  var cat = 'all';
  function applyFilter() {
    var term = q.value.trim().toLowerCase(), shown = 0;
    cards.forEach(function (c) {
      var ok = (cat === 'all' || c.dataset.cat === cat) && c.textContent.toLowerCase().indexOf(term) > -1;
      c.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = 'Showing ' + shown + ' of ' + cards.length + ' articles';
    empty.hidden = shown !== 0;
  }
  function setCat(c) {
    cat = c;
    chips.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cat === c)); });
    applyFilter();
  }
  chips.forEach(function (b) { b.addEventListener('click', function () { setCat(b.dataset.cat); }); });
  q.addEventListener('input', applyFilter);
  $('#searchForm').addEventListener('submit', function (e) { e.preventDefault(); applyFilter(); });
  $$('[data-jump]').forEach(function (a) {
    a.addEventListener('click', function () { setCat(a.dataset.jump); setSub(false); setMenu(false); });
  });

  /* ---------- 4. Subscribe dialog (modal dialog pattern) ---------- */
  var dlg = $('#subDialog'), openBtn = $('#openSub'), form = $('#subForm');
  var email = $('#email'), err = $('#emailErr'), ok = $('#subOk');

  function openDialog() {
    if (typeof dlg.showModal === 'function') dlg.showModal();   // focus is trapped, page behind is inert
    else dlg.setAttribute('open', '');                          // very old browsers: still usable
    email.focus();
  }
  function closeDialog() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  openBtn.addEventListener('click', openDialog);
  $('#closeSub').addEventListener('click', closeDialog);
  $('#cancelSub').addEventListener('click', closeDialog);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDialog(); });   // click on backdrop
  dlg.addEventListener('close', function () {                                              // Esc or any close
    form.reset(); err.hidden = true; ok.textContent = ''; email.removeAttribute('aria-invalid');
    openBtn.focus();                                                                       // return focus to the opener
  });

  /* Error identification and suggestion (3.3.1, 3.3.3): text, not colour alone, linked with aria-describedby */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = email.value.trim(), msg = '';
    if (!v) msg = 'Enter your email address, for example name@example.com.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'This email looks incomplete. Use the format name@example.com.';
    if (msg) {
      err.textContent = msg; err.hidden = false;
      email.setAttribute('aria-invalid', 'true');
      email.focus();
      return;
    }
    err.hidden = true; email.setAttribute('aria-invalid', 'false');
    ok.textContent = 'Thank you. You are subscribed and your first tip arrives on Monday.';
  });
  email.addEventListener('input', function () { if (!err.hidden) { err.hidden = true; email.removeAttribute('aria-invalid'); } });

  /* ---------- 5. FAQ accordion: reusable component from Week 2 ---------- */
  if (window.Accordion) Accordion.init();
})();
