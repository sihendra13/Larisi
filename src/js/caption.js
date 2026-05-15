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
      area.scrollTop = 0; /* scroll ke atas setelah selesai — user lihat awal caption */
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

/* Mapping: onboarding category → caption template key */
var _BIZ_CAT_TO_CAPTION = {
  fnb:        'Kuliner',
  fashion:    'Fashion',
  jasa:       'General',
  retail:     'General',
  kesehatan:  'Beauty/Self-care',
  elektronik: 'General',
  otomotif:   'General',
  properti:   'Real Estate',
  pendidikan: 'General',
  wisata:     'Tourism',
  lainnya:    'General'
};

function getPersonaKey() {
  if (!currentPersona) {
    // Fallback: use business category from onboarding if no persona set yet
    var biz = window.userBizProfile && window.userBizProfile.category;
    if (biz && _BIZ_CAT_TO_CAPTION[biz] && _BIZ_CAT_TO_CAPTION[biz] !== 'General') {
      return _BIZ_CAT_TO_CAPTION[biz];
    }
    return 'General';
  }
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
  if (p.indexOf('general') !== -1) {
    // Even for 'General' persona, try to improve with biz profile category
    var bizFallback = window.userBizProfile && window.userBizProfile.category;
    if (bizFallback && _BIZ_CAT_TO_CAPTION[bizFallback] && _BIZ_CAT_TO_CAPTION[bizFallback] !== 'General') {
      return _BIZ_CAT_TO_CAPTION[bizFallback];
    }
    return 'General';
  }
  // Final fallback: check biz profile before returning General
  var bizFallback = window.userBizProfile && window.userBizProfile.category;
  if (bizFallback && _BIZ_CAT_TO_CAPTION[bizFallback] && _BIZ_CAT_TO_CAPTION[bizFallback] !== 'General') {
    return _BIZ_CAT_TO_CAPTION[bizFallback];
  }
  return 'General';
}

function getUsp() {
  var profile = {};
  try { profile = JSON.parse(localStorage.getItem('radar_user_profile') || '{}'); } catch(e) {}
  if (profile.usp && profile.usp.trim()) return profile.usp.trim();
  var category = profile.category || 'lainnya';
  var fallbacks = {
    fnb:                 'Cita rasa yang bikin balik lagi',
    kafe:                'Tempat ngopi paling nyaman',
    fashion_wanita:      'Koleksi fashion wanita terlengkap',
    fashion_pria:        'Outfit pria yang selalu on point',
    fashion_muslim:      'Koleksi muslimah syari dan stylish',
    fashion_muslim_pria: 'Koleksi koko dan gamis terbaik',
    kesehatan:           'Perawatan kulit yang terbukti',
    salon:               'Perawatan profesional terpercaya',
    barber:              'Cukur rapi dan stylish',
    elektronik:          'Gadget lengkap bergaransi resmi',
    otomotif:            'Servis terpercaya bersertifikat',
    properti:            'Hunian impian keluarga',
    pendidikan:          'Belajar lebih mudah dan menyenangkan',
    wisata:              'Pengalaman wisata tak terlupakan',
    kerajinan:           'Kerajinan tangan otentik lokal',
    retail:              'Kebutuhan sehari-hari lengkap',
    lainnya:             'Pilihan terbaik untuk kamu'
  };
  return fallbacks[category] || 'Pilihan terbaik untuk kamu';
}

function getDistText(format) {
  var profile = {};
  try { profile = JSON.parse(localStorage.getItem('radar_user_profile') || '{}'); } catch(e) {}
  var hasDelivery = profile.delivery_service || false;
  var category    = profile.category || '';
  var loc = document.querySelector('.popup-loc')
    ? document.querySelector('.popup-loc').textContent.split(',')[0].trim()
    : 'lokasi kami';
  var jasaCategories = ['jasa', 'salon', 'barber', 'pendidikan'];
  var isJasa = jasaCategories.indexOf(category) !== -1;
  if (format === 'short') {
    if (category === 'fnb' || category === 'kafe')      return hasDelivery ? 'Antar ke rumahmu 🛵' : 'Makan di sini 🍽';
    if (category.indexOf('fashion') !== -1)              return hasDelivery ? 'Antar ke rumahmu 🛵' : 'Koleksi baru hadir 🛍';
    if (category === 'otomotif')                         return 'Servis di ' + loc + ' 🔧';
    if (category === 'properti')                         return 'Lokasi strategis 📍';
    if (category === 'wisata')                           return 'Destinasi menunggu kamu 🗺';
    if (isJasa)                                          return 'Booking sekarang 📱';
    if (hasDelivery)                                     return 'Antar ke rumahmu 🛵';
    return 'Di ' + loc + ' 📍';
  }
  if (isJasa)      return 'area ' + loc;
  if (hasDelivery) return loc + ' — melayani pengiriman';
  return loc;
}

function fillCaptionVars(text) {
  var loc  = document.querySelector('.popup-loc') ? document.querySelector('.popup-loc').textContent.split(',')[0] : 'lokasi kamu';
  var dist = getDistText('long');
  var usp  = getUsp();
  var d    = getDialek();

  // Kalau {usp} muncul standalone (setelah titik/newline), bungkus dengan framing
  // supaya tidak terasa mentah copy-paste dari input user
  var uspOut = usp;
  if (/(?:\.|\n)\s*\{usp\}/.test(text)) {
    var u = usp.replace(/\.$/, '');
    var frames = [
      'Keunggulan kami: ' + u,
      'Yang bikin kami beda — ' + u,
      u + ' — itulah yang bikin kami istimewa',
      'Satu hal yang selalu dipuji pelanggan: ' + u,
      'Rahasia kami? ' + u
    ];
    uspOut = frames[captionAltIndex % frames.length];
  }

  return text
    .replace(/\{loc\}/g,      loc)
    .replace(/\{dist\}/g,     dist)
    .replace(/\{usp\}/g,      uspOut)
    .replace(/\{greeting\}/g, d.greeting)
    .replace(/\{cta\}/g,      d.cta);
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
