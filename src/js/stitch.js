// RADAR — stitch.js
// Smart Geo-Stitching: update stitch text and drag-to-reposition IIFE

function updateStitch() {
  if (!currentPersona) return;
  document.getElementById('stitchCard').style.display = 'block';
  /* Look up by key first, then by name fallback */
  var p = personaDB[currentPersona];
  if (!p) {
    var keys = Object.keys(personaDB);
    for (var ki = 0; ki < keys.length; ki++) {
      if (personaDB[keys[ki]].name === currentPersona) { p = personaDB[keys[ki]]; break; }
    }
  }
  if (!p) p = personaDB.General;
  var loc = document.querySelector('.popup-loc') ? document.querySelector('.popup-loc').textContent.split(',')[0] : 'Lokasi kamu';
  var d   = getDialek();
  var usp = (typeof getUsp === 'function') ? getUsp() : '';
  var txt = p.stitch
    .replace(/\{loc\}/g,      loc)
    .replace(/\{dist\}/g,     usp)
    .replace(/\{usp\}/g,      usp)
    .replace(/\{greeting\}/g, d.greeting)
    .replace(/\{cta\}/g,      d.cta);
  var s = document.getElementById('phoneStitch');
  s.style.display = 'block'; s.textContent = txt;
}

/* ─── Phone Stitch: Dynamic Position + Inline Edit ─── */
(function initStitchDrag() {
  var stitch = document.getElementById('phoneStitch');
  if (!stitch) return;

  function updateStitchPosition() {
    var fmt = (typeof activeFormat !== 'undefined' ? activeFormat : 'post').toLowerCase();
    var isVertical = fmt === 'story' || fmt === 'reel';
    stitch.style.position  = 'absolute';
    stitch.style.top       = 'auto';
    stitch.style.transform = '';
    if (isVertical) {
      // Story/Reel: bottom-center, 18% dari bawah
      stitch.style.bottom    = '18%';
      stitch.style.left      = '50%';
      stitch.style.transform = 'translateX(-50%)';
      stitch.style.textAlign = 'center';
    } else {
      // Post: bottom-left, 10% dari bawah, 5% dari kiri
      stitch.style.bottom    = '10%';
      stitch.style.left      = '5%';
      stitch.style.textAlign = 'left';
    }
  }

  updateStitchPosition();

  // Update posisi saat format berubah
  document.addEventListener('formatChanged', updateStitchPosition);
  setInterval(updateStitchPosition, 500);

  // Click → edit text
  stitch.addEventListener('click', function() {
    stitch.classList.add('editing');
    stitch.focus();
    var range = document.createRange();
    range.selectNodeContents(stitch);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges(); sel.addRange(range);
  });

  // Click di luar → selesai edit
  document.addEventListener('mousedown', function(e) {
    if (!stitch.contains(e.target) && stitch.classList.contains('editing')) {
      stitch.classList.remove('editing');
      stitch.blur();
    }
  });

  // Enter → selesai edit
  stitch.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      stitch.classList.remove('editing');
      stitch.blur();
    }
  });
})();
