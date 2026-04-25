// RADAR — caption.js
// Caption generation, typewriter effect, tone selection

function typewriterEffect(text, callback) {
  if (typewriterTimer) clearInterval(typewriterTimer);
  var area = document.getElementById('captionArea');
  area.value = '';
  isTyping = true;
  var i = 0;
  var speed = text.length > 200 ? 12 : 18; /* faster for long text */
  typewriterTimer = setInterval(function() {
    if (i < text.length) {
      area.value += text.charAt(i);
      area.scrollTop = area.scrollHeight;
      i++;
    } else {
      clearInterval(typewriterTimer);
      isTyping = false;
      if (callback) callback();
    }
  }, speed);
}

function getCurrentPlatformKey() {
  /* Map activePlatform to CAPTION_TEMPLATES key */
  if (activePlatform === 'ig-story') return 'ig-story';
  if (activePlatform === 'tiktok')   return 'tiktok';
  if (activePlatform === 'youtube')  return 'youtube';
  if (activePlatform === 'meta')     return 'meta';
  return 'ig-story';
}

function getPersonaKey() {
  if (!currentPersona) return 'General';
  var p = currentPersona.toLowerCase();

  /* Match persona name to caption template key */
  if (p.indexOf('kuliner') !== -1 || p.indexOf('culinary') !== -1) return 'Kuliner';
  if (p.indexOf('cafe') !== -1 || p.indexOf('coffee') !== -1) return 'Kuliner/Cafe';
  if (p.indexOf('muslim') !== -1 || p.indexOf('hijab') !== -1 || p.indexOf('gamis') !== -1 || p.indexOf('syari') !== -1 || p.indexOf('kerudung') !== -1 || p.indexOf('fashionmuslim') !== -1) return 'FashionMuslim';
  if (p === 'fashionpria' || (p.indexOf('pria') !== -1 && p.indexOf('fashion') !== -1)) return 'FashionPria';
  if (p.indexOf('fashion') !== -1 || p.indexOf('modest') !== -1 || p.indexOf('heritage') !== -1 || p.indexOf('wanita') !== -1 || p.indexOf('modern') !== -1 || p.indexOf('trendy') !== -1) return 'Fashion';
  if (p.indexOf('real estate') !== -1 || p.indexOf('properti') !== -1 || p.indexOf('rumah') !== -1) return 'Real Estate';
  if (p.indexOf('beauty') !== -1 || p.indexOf('skincare') !== -1 || p.indexOf('self-care') !== -1) return 'Beauty/Self-care';
  if (p.indexOf('tourism') !== -1 || p.indexOf('wisata') !== -1 || p.indexOf('travel') !== -1) return 'Tourism';
  if (p.indexOf('automotive') !== -1 || p.indexOf('vespa') !== -1 || p.indexOf('motor') !== -1) return 'Retro Automotive';
  if (p.indexOf('general') !== -1) return 'General';
  return 'General';
}

function fillCaptionVars(text) {
  var loc = document.querySelector('.popup-loc') ? document.querySelector('.popup-loc').textContent.split(',')[0] : 'lokasi kamu';
  var dist = currentRadius.toFixed(1);
  var d = getDialek();
  return text
    .replace(/\{loc\}/g, loc)
    .replace(/\{dist\}/g, dist)
    .replace(/\{greeting\}/g, d.greeting)
    .replace(/\{cta\}/g, d.cta);
}

function generateCaption(cycle) {
  if (!currentPersona) return;
  var platKey    = getCurrentPlatformKey();
  var personaKey = getPersonaKey();
  var templates  = CAPTION_TEMPLATES[platKey] || CAPTION_TEMPLATES['ig-story'];
  var alts       = templates[personaKey] || templates['General'];

  /* cycle = true means user clicked "Generate Ulang" → advance index */
  if (cycle) {
    captionAltIndex = (captionAltIndex + 1) % alts.length;
  } else {
    captionAltIndex = 0;
  }

  var raw  = alts[captionAltIndex];
  var text = fillCaptionVars(raw);
  typewriterEffect(text);
}

function setTone(el, tone) {
  activeTone = tone;
  document.querySelectorAll('.tone-btn').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  generateCaption();
}

function updateCaptionPlatformLabel() {
  var el = document.getElementById('captionPlatformLabel');
  if (!el) return;
  var plat = PLAT_LABEL_MAP[activePlatform] || PLAT_LABEL_MAP['ig-story'];
  el.innerHTML = plat.icon + '<span>' + plat.label + '</span>';
}

function getDialek() {
  return REGION_DIALEK[currentRegion] || REGION_DIALEK['default'];
}
