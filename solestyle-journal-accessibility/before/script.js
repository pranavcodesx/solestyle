// SoleStyle Journal - starter page script
var cat = 'all';

function toggleMenu() { document.getElementById('nav').classList.toggle('open'); }

function setCat(el, c) {
  cat = c;
  var chips = document.getElementsByClassName('chip');
  for (var i = 0; i < chips.length; i++) chips[i].classList.remove('active');
  el.classList.add('active');
  applyFilter();
}

function applyFilter() {
  var q = document.getElementById('q').value.toLowerCase();
  var cards = document.getElementsByClassName('card'), shown = 0;
  for (var i = 0; i < cards.length; i++) {
    var ok = (cat === 'all' || cards[i].getAttribute('data-cat') === cat) && cards[i].innerText.toLowerCase().indexOf(q) > -1;
    cards[i].style.display = ok ? '' : 'none';
    if (ok) shown++;
  }
  document.getElementById('count').innerText = shown + ' articles';
}

function toggleFaq(el) { el.parentNode.classList.toggle('open'); }

function openModal() { document.getElementById('modal').classList.add('show'); }
function closeModal() { document.getElementById('modal').classList.remove('show'); }

function subscribe() {
  var v = document.getElementById('email').value;
  var err = document.getElementById('err');
  if (v.indexOf('@') < 1) { err.innerText = 'Invalid'; return; }
  err.style.color = 'green';
  err.innerText = 'Thanks!';
}
