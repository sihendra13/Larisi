// RADAR — persona.js
// Persona detection, scanning, display and editing

function showScanningOnly(fileCount) {
  var scanText = document.getElementById('scanText');
  if (scanText) {
    scanText.textContent = 'Scanning all ' + fileCount + ' assets for optimal targeting...';
  }
  document.getElementById('scanning').classList.add('visible');
  setTimeout(function() {
    document.getElementById('scanning').classList.remove('visible');
    /* Persona card stays as is — master persona unchanged */
  }, 1800);
}

function showPersonaDirect(p, detected) {
  document.getElementById('personaBadge').textContent = 'Master Persona';
  document.getElementById('personaName').textContent = p.name;
  document.getElementById('personaTarget').textContent = 'Targeting: ' + p.target;
  var ageEl = document.getElementById('personaAge');
  if (ageEl) ageEl.textContent = 'Age range: ' + p.age + ' · ' + p.gender;
  document.getElementById('personaCard').classList.add('visible');
  /* Only show Bantu AI card if NOT detected from filename */
  if (!detected) {
    document.getElementById('catNudge').classList.add('visible');
  } else {
    document.getElementById('catNudge').classList.remove('visible');
  }
  document.getElementById('genBtn').style.display = 'inline-block';
  /* Set currentPersona to actual detected persona name for caption mapping */
  currentPersona = p.name;
  captionAltIndex = 0;
  document.getElementById('stitchCard').style.display = 'block';
  updateStitch();
  generateCaption(false);
}

function startScanWithFile(filename, fileCount) {
  if (masterPersonaLocked) {
    showScanningOnly(fileCount);
    return;
  }
  var scanText = document.getElementById('scanText');
  if (scanText) {
    scanText.textContent = 'Scanning your asset for optimal targeting...';
  }
  document.getElementById('scanning').classList.add('visible');
  document.getElementById('personaCard').classList.remove('visible');
  document.getElementById('catNudge').classList.remove('visible');
  setTimeout(function() {
    document.getElementById('scanning').classList.remove('visible');
    var p = detectPersona(filename);
    var detected = p.name !== 'General Content';
    showPersonaDirect(p, detected);
    masterPersonaLocked = true; /* Lock after first scan */
  }, 2000);
}

function startScan() { startScanWithFile(''); }

function selectCat(el, cat) {
  document.querySelectorAll('.cat-tile').forEach(function(t){ t.classList.remove('selected'); });
  el.classList.add('selected');
  document.getElementById('catNudge').classList.remove('visible');
  setTimeout(function(){
    var p = personaDB[cat] || personaDB.General;
    currentPersona = cat; /* set FIRST so updateStitch() and generateCaption() have it */
    captionAltIndex = 0;
    showPersonaFromCat({name:p.name, target:p.target, age:p.tags?p.tags[0]:'Usia 18–45', gender:p.gender||'Mixed'});
    generateCaption(false);
  }, 300);
}

function showPersonaFromCat(p) {
  /* Called when user manually picks category — show edit btn, hide catNudge permanently until edit clicked */
  document.getElementById('personaBadge').textContent = 'Master Persona';
  document.getElementById('personaName').textContent = p.name;
  document.getElementById('personaTarget').textContent = 'Targeting: ' + p.target;
  var ageEl = document.getElementById('personaAge');
  if (ageEl) ageEl.textContent = 'Age range: ' + p.age + ' · ' + (p.gender || 'Mixed');
  document.getElementById('personaCard').classList.add('visible');
  document.getElementById('catNudge').classList.remove('visible');
  /* Show edit button — outline style, only for manual category pick */
  var editBtn = document.getElementById('personaEditBtn');
  if (editBtn) {
    editBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit';
    editBtn.style.display = 'flex';
  }
  document.getElementById('genBtn').style.display = 'inline-block';
  /* Always show stitchCard + fill phoneStitch when persona is set */
  document.getElementById('stitchCard').style.display = 'block';
  updateStitch();
}

function showPersona(key, boosted) {
  currentPersona = key;
  var p = personaDB[key] || personaDB.General;
  var conf = boosted ? Math.min(p.conf+7, 97) : p.conf;
  if (conf < 70) document.getElementById('catNudge').classList.add('visible');
  document.getElementById('personaBadge').textContent = 'Master Persona';
  document.getElementById('personaName').textContent = p.name;
  document.getElementById('personaTarget').textContent = 'Targeting: ' + p.target;
  var ageEl = document.getElementById('personaAge');
  if (ageEl) ageEl.textContent = 'Age range: ' + (p.age || p.tags[0] || '18–45') + ' · ' + (p.gender || 'Mixed');
  document.getElementById('personaCard').classList.add('visible');
  document.getElementById('genBtn').style.display = 'block';
  generateCaption(); updateStitch();
  document.getElementById('stitchCard').style.display = 'block';
}

function openEditPersona() {
  /* Hide persona card, show Bantu AI for re-pick */
  document.getElementById('personaCard').classList.remove('visible');
  document.getElementById('catNudge').classList.add('visible');
  /* Hide edit btn */
  var editBtn = document.getElementById('personaEditBtn');
  if (editBtn) editBtn.style.display = 'none';
}
