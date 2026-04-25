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
  var dist = currentRadius.toFixed(1);
  var d = getDialek();
  var txt = p.stitch
    .replace(/\{loc\}/g, loc)
    .replace(/\{dist\}/g, dist)
    .replace(/\{greeting\}/g, d.greeting)
    .replace(/\{cta\}/g, d.cta);
  var s = document.getElementById('phoneStitch');
  s.style.display = 'block'; s.textContent = txt;
}

/* ─── Phone Stitch: Drag-to-Reposition + Inline Edit ─── */
(function initStitchDrag() {
  var DRAG_THRESHOLD = 4;
  var stitch = document.getElementById('phoneStitch');
  if (!stitch) return;

  var isDragging = false, didDrag = false;
  var startMouseX = 0, startMouseY = 0;
  var startElemLeft = 0, startElemTop = 0;
  var stitchLeft = null, stitchTop = null;

  function anchorToTopLeft() {
    var shell = document.getElementById('phoneShell');
    var sRect = shell.getBoundingClientRect();
    var eRect = stitch.getBoundingClientRect();
    stitch.style.transform = 'none';
    stitch.style.bottom = 'auto';
    stitch.style.top = (eRect.top - sRect.top) + 'px';
    stitch.style.left = (eRect.left - sRect.left) + 'px';
    stitchLeft = eRect.left - sRect.left;
    stitchTop = eRect.top - sRect.top;
  }

  function clampPosition(left, top) {
    var shell = document.getElementById('phoneShell');
    var maxLeft = shell.offsetWidth - stitch.offsetWidth;
    var maxTop = shell.offsetHeight - stitch.offsetHeight;
    return {
      left: Math.max(0, Math.min(maxLeft, left)),
      top: Math.max(0, Math.min(maxTop, top))
    };
  }

  stitch.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    if (stitch.classList.contains('editing')) return;
    isDragging = false; didDrag = false;
    startMouseX = e.clientX; startMouseY = e.clientY;
    if (stitchLeft === null) anchorToTopLeft();
    startElemLeft = stitchLeft; startElemTop = stitchTop;
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (startMouseX === 0 && startMouseY === 0) return;
    if (stitch.classList.contains('editing')) return;
    var dx = e.clientX - startMouseX, dy = e.clientY - startMouseY;
    if (!isDragging && Math.sqrt(dx*dx + dy*dy) > DRAG_THRESHOLD) {
      isDragging = true; didDrag = true;
    }
    if (isDragging) {
      var clamped = clampPosition(startElemLeft + dx, startElemTop + dy);
      stitchLeft = clamped.left; stitchTop = clamped.top;
      stitch.style.left = stitchLeft + 'px';
      stitch.style.top = stitchTop + 'px';
    }
  });

  document.addEventListener('mouseup', function(e) {
    if (e.button !== 0 || (startMouseX === 0 && startMouseY === 0)) return;
    if (!didDrag) {
      stitch.classList.add('editing');
      stitch.focus();
      var range = document.createRange();
      range.selectNodeContents(stitch);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);
    }
    isDragging = false; didDrag = false; startMouseX = 0; startMouseY = 0;
  });

  document.addEventListener('mousedown', function(e) {
    if (!stitch.contains(e.target) && stitch.classList.contains('editing')) {
      stitch.classList.remove('editing');
      stitch.blur();
    }
  });

  stitch.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      stitch.classList.remove('editing');
      stitch.blur();
    }
  });
})();
