// RADAR — upload.js
// File upload, thumbnail management, phone preview display

var uploadedDataURLs = [];
var uploadedVideoFile = null; // simpan File object asli untuk video
var currentMediaUrl = null;

// Zoom & Pan state (only active for Story format)
var storyZoomState = {}; // URL -> { z: 1, x: 0, y: 0 }
var isDraggingMedia = false;
var dragStartX = 0;
var dragStartY = 0;
var initialPanX = 0;
var initialPanY = 0;
var blobToBase64Map = {}; // mapping blobUrl -> base64Url for state synchronization

function addThumb(f, thumbs, uz, isMaster) {
  var wrapper = document.createElement('div');
  wrapper.className = 'thumb-item';
  var objUrl = URL.createObjectURL(f);
  var media = f.type.startsWith('video/') ? document.createElement('video') : document.createElement('img');
  media.src = objUrl;
  media.style.borderRadius = '12px';
  if (f.type.startsWith('video/')) { media.muted = true; media.preload = 'metadata'; }
  wrapper.dataset.url = objUrl;
  wrapper.dataset.isVideo = f.type.startsWith('video/') ? '1' : '0';
  wrapper.appendChild(media);
  if (isMaster) {
    var badge = document.createElement('div');
    badge.className = 'thumb-badge';
    badge.textContent = 'Master';
    wrapper.appendChild(badge);
  }
  var xBtn = document.createElement('button');
  xBtn.className = 'thumb-x';
  xBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  xBtn.onclick = function() {
    wrapper.remove();
    var remaining = thumbs.querySelectorAll('.thumb-item');
    if (remaining.length === 0) {
      thumbs.style.display = 'none';
      uz.style.display = '';
      uploadMode = null;
      masterPersonaLocked = false;
      currentPersona = null;
      captionAltIndex = 0;
      uploadedDataURL = null;
      uploadedDataURLs = [];
      document.getElementById('personaCard').classList.remove('visible');
      document.getElementById('catNudge').classList.remove('visible');
      var _vcEl = document.getElementById('visionConflict');
      if (_vcEl) _vcEl.classList.remove('visible');
      if (typeof _visionConflictData !== 'undefined') _visionConflictData = null;
      document.getElementById('stitchCard').style.display = 'none';
      document.getElementById('scanning').classList.remove('visible');
      document.getElementById('genBtn').style.display = 'none';
      var ca = document.getElementById('captionArea');
      if (ca) ca.value = '';
      /* Reset phone mockup ke placeholder */
      var pm = document.getElementById('phoneMedia');
      if (pm) pm.innerHTML = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
      var ps = document.getElementById('phoneStitch');
      if (ps) { ps.style.display = 'none'; ps.textContent = ''; }
      updateCarouselDots(0);
    } else {
      /* Tampilkan foto pertama yang tersisa */
      if (uploadMode === 'photo') showInPhone(remaining[0].dataset.url, false);
      updateCarouselDots(0);
    }
    refreshAddBox(thumbs, uz);
  };
  wrapper.appendChild(xBtn);
  thumbs.appendChild(wrapper);
}

function updateCarouselDots(activeIdx) {
  var dotsEl = document.getElementById('carouselDots');
  if (!dotsEl) return;
  var thumbs = document.getElementById('thumbs');
  var items = thumbs ? Array.from(thumbs.querySelectorAll('.thumb-item')) : [];
  dotsEl.innerHTML = '';
  if (items.length <= 1 || uploadMode === 'video') {
    dotsEl.style.display = 'none';
    return;
  }
  dotsEl.style.display = 'flex';
  items.forEach(function(item, i) {
    var dot = document.createElement('div');
    dot.style.cssText = 'width:6px;height:6px;border-radius:50%;cursor:pointer;transition:background .2s,transform .2s;flex-shrink:0;'
      + (i === activeIdx ? 'background:#791ADB;transform:scale(1.3);' : 'background:#d4d4d4;');
    dot.onmouseenter = function() { if (i !== activeIdx) dot.style.background = '#b39ddb'; };
    dot.onmouseleave = function() { if (i !== activeIdx) dot.style.background = '#d4d4d4'; };
    (function(idx, url) {
      dot.onclick = function() { showInPhone(url, false); updateCarouselDots(idx); };
    })(i, item.dataset.url);
    dotsEl.appendChild(dot);
  });
}

function refreshAddBox(thumbs, uz) {
  var existing = thumbs.querySelector('.thumb-add');
  if (existing) existing.remove();
  var total = thumbs.querySelectorAll('.thumb-item').length;
  if (total < 5) {
    var addBox = document.createElement('div');
    addBox.className = 'thumb-add';
    addBox.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
    addBox.onclick = function() { document.getElementById('fileInput').click(); };
    thumbs.appendChild(addBox);
  }
}

function showUploadModal(msg, onConfirm) {
  var existing = document.getElementById('uploadModal');
  if (existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = 'uploadModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:28px 24px;max-width:340px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.18);">'
    + '<div style="font-size:15px;font-weight:700;color:#222;margin-bottom:8px;">Perhatian</div>'
    + '<div style="font-size:13px;color:#6a6a6a;margin-bottom:20px;line-height:1.5;">'+msg+'</div>'
    + '<div style="display:flex;gap:10px;justify-content:flex-end;">'
    + '<button onclick="var m=document.getElementById(\'uploadModal\');if(m)m.remove();" style="padding:8px 16px;border-radius:8px;border:1px solid #e0e0e0;background:#fff;font-size:12px;font-weight:600;cursor:pointer;">Batal</button>'
    + '<button id="modalConfirm" style="padding:8px 16px;border-radius:8px;border:none;background:#791ADB;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Ganti</button>'
    + '</div></div>';
  document.body.appendChild(modal);
  document.getElementById('modalConfirm').onclick = function() {
    modal.remove();
    onConfirm();
  };
}

function handleUpload(e) {
  // JANGAN reset uploadedDataURLs di sini — kalau user tambah foto via tombol "+"
  // array lama akan kehilangan base64 foto-foto sebelumnya.
  // Reset hanya dilakukan di clearThumbs() dan xBtn.onclick (lihat di bawah).
  var rawFiles = Array.from(e.target.files);
  if (!rawFiles.length) return;
  e.target.value = '';

  var thumbs = document.getElementById('thumbs');
  var uz = document.getElementById('uploadZone');
  var existingCount = thumbs.querySelectorAll('.thumb-item').length;
  var isFirstUpload = existingCount === 0;
  var newHasVideo = rawFiles.some(function(f){ return f.type.startsWith('video/'); });

  /* Check mixing */
  if (!isFirstUpload && uploadMode === 'photo' && newHasVideo) {
    showUploadModal('Kamu sudah upload foto. Mau ganti dengan video? Semua foto akan dihapus.', function() {
      clearThumbs();
      processFiles(rawFiles, true);
    });
    return;
  }
  if (!isFirstUpload && uploadMode === 'video' && !newHasVideo) {
    showUploadModal('Kamu sudah upload video. Mau ganti dengan foto? Video akan dihapus.', function() {
      clearThumbs();
      processFiles(rawFiles, false);
    });
    return;
  }

  processFiles(rawFiles, newHasVideo);
}

function clearThumbs() {
  var thumbs = document.getElementById('thumbs');
  thumbs.innerHTML = '';
  thumbs.style.display = 'none';
  uploadMode = null;
  uploadedDataURLs = []; // Reset array saat ganti dari video→foto atau foto→video
}

function processFiles(rawFiles, hasVideo) {
  var thumbs = document.getElementById('thumbs');
  var uz = document.getElementById('uploadZone');
  var existingCount = thumbs.querySelectorAll('.thumb-item').length;
  var isFirstUpload = existingCount === 0;
  var files;

  if (hasVideo) {
    files = rawFiles.filter(function(f){ return f.type.startsWith('video/'); }).slice(0,1);
    uploadMode = 'video';
    // Aktifkan kembali tab Reel kalau upload video
    var reelLabel2 = document.querySelector('label.fmt-radio-label input[value="reel"]');
    var reelLabelEl2 = reelLabel2 ? reelLabel2.closest('label') : null;
    if (reelLabelEl2) {
      reelLabelEl2.style.opacity = '1';
      reelLabelEl2.style.pointerEvents = 'auto';
      reelLabelEl2.title = '';
    }
    // Auto-switch ke Reel untuk video
    if (typeof selectFormat === 'function') selectFormat('reel');
    var reelInput = document.querySelector('input[name="fmt"][value="reel"]');
    if (reelInput) reelInput.checked = true;
  } else {
    var remaining = 5 - existingCount;
    files = rawFiles.filter(function(f){ return f.type.startsWith('image/'); }).slice(0, remaining);
    uploadMode = 'photo';
    // Sembunyikan tab Reel kalau upload foto (Reel hanya untuk video)
    var reelLabel = document.querySelector('label.fmt-radio-label input[value="reel"]');
    var reelLabelEl = reelLabel ? reelLabel.closest('label') : null;
    if (reelLabelEl) {
      reelLabelEl.style.opacity = '0.4';
      reelLabelEl.style.pointerEvents = 'none';
      reelLabelEl.title = 'Reel hanya tersedia untuk video';
    }
    // Auto-switch ke Post kalau sebelumnya pilih Reel
    if (typeof activeFormat !== 'undefined' && activeFormat === 'reel') {
      if (typeof selectFormat === 'function') selectFormat('post');
      var postInput = document.querySelector('input[name="fmt"][value="post"]');
      if (postInput) postInput.checked = true;
    }
  }
  if (!files.length) return;

  thumbs.style.display = 'flex';
  uz.style.display = 'none';

  files.forEach(function(f, i) {
    var isMaster = isFirstUpload && i === 0;
    addThumb(f, thumbs, uz, isMaster);
  });

  /* Video: hide add box always */
  if (hasVideo) {
    var ab = thumbs.querySelector('.thumb-add');
    if (ab) ab.remove();
  } else {
    refreshAddBox(thumbs, uz);
  }

  var first = files[0];
  var isVid = first.type.startsWith('video/');
  if (isVid) {
    uploadedVideoFile = first;
    console.log('[upload] video file tersimpan:', first.name, 'size:', first.size, 'type:', first.type);
  } else {
    uploadedVideoFile = null;
  }
  var url = URL.createObjectURL(first);
  uploadedDataURL = url;  // blob URL sementara untuk preview
  showInPhone(url, isVid);

  if (!isVid) {
    files.forEach(function(f, fi) {
      var blobUrl = URL.createObjectURL(f);
      var capturedIdx = existingCount + fi;
      var r = new FileReader();
      r.onload = function(ev) {
        var base64 = ev.target.result;
        uploadedDataURLs[capturedIdx] = base64;
        blobToBase64Map[blobUrl] = base64;
        if (capturedIdx === 0) {
          uploadedDataURL = base64;
        }
        console.log('[upload] foto', capturedIdx + 1, 'base64 ok');
      };
      r.readAsDataURL(f);
    });
  }

  var totalCount = document.getElementById('thumbs').querySelectorAll('.thumb-item').length;
  updateCarouselDots(0);

  if (isFirstUpload) {
    /* First upload: detect persona from filename, set as MASTER — cannot be changed */
    masterPersonaLocked = false;
    startScanWithFile(first.name, totalCount);
  } else {
    /* Subsequent uploads: only show scanning animation briefly, DO NOT change persona */
    showScanningOnly(totalCount);
  }
}

function showInPhone(url, isVid) {
  var m = document.getElementById('phoneMedia');
  if (isVid) {
    var wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
    var vid = document.createElement('video');
    vid.src = url;
    vid.autoplay = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.muted = false; /* audio ON by default */
    vid.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:top center;display:block;';
    // Tombol PAUSE — pojok kiri atas
    var pauseBtn = document.createElement('button');
    pauseBtn.style.cssText =
      'position:absolute;top:10px;left:10px;' +
      'background:rgba(0,0,0,0.55);border:none;border-radius:50%;' +
      'width:36px;height:36px;cursor:pointer;display:flex;' +
      'align-items:center;justify-content:center;z-index:10;' +
      'backdrop-filter:blur(4px);';
    pauseBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="white">' +
      '<rect x="6" y="4" width="4" height="16"/>' +
      '<rect x="14" y="4" width="4" height="16"/></svg>';

    // Tombol MUTE — pojok kiri atas sebelah pause
    var muteBtn = document.createElement('button');
    muteBtn.style.cssText =
      'position:absolute;top:10px;left:54px;' +
      'background:rgba(0,0,0,0.55);border:none;border-radius:50%;' +
      'width:36px;height:36px;cursor:pointer;display:flex;' +
      'align-items:center;justify-content:center;z-index:10;' +
      'backdrop-filter:blur(4px);';
    muteBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
      'stroke="white" stroke-width="2" stroke-linecap="round">' +
      '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>' +
      '<path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>' +
      '</svg>';

    var isPlaying = true;
    var isMuted = false;

    pauseBtn.onclick = function(e) {
      e.stopPropagation();
      if (isPlaying) {
        vid.pause();
        pauseBtn.innerHTML =
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="white">' +
          '<polygon points="5 3 19 12 5 21 5 3"/></svg>';
      } else {
        vid.play();
        pauseBtn.innerHTML =
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="white">' +
          '<rect x="6" y="4" width="4" height="16"/>' +
          '<rect x="14" y="4" width="4" height="16"/></svg>';
      }
      isPlaying = !isPlaying;
    };

    muteBtn.onclick = function(e) {
      e.stopPropagation();
      isMuted = !isMuted;
      vid.muted = isMuted;
      muteBtn.innerHTML = isMuted
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
          'stroke="white" stroke-width="2" stroke-linecap="round">' +
          '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>' +
          '<line x1="23" y1="9" x2="17" y2="15"/>' +
          '<line x1="17" y1="9" x2="23" y2="15"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
          'stroke="white" stroke-width="2" stroke-linecap="round">' +
          '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>' +
          '<path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>' +
          '</svg>';
    };

    wrapper.appendChild(vid);
    wrapper.appendChild(pauseBtn);
    wrapper.appendChild(muteBtn);
    m.innerHTML = '';
    m.appendChild(wrapper);
  } else {
    m.innerHTML = '<img src="' + url + '" draggable="false" style="width:100%;height:100%;object-fit:cover;object-position:center;display:block;transform-origin:center;">';
  }
  
  currentMediaUrl = url;
  if (!storyZoomState[url]) {
    storyZoomState[url] = { z: 1, x: 0, y: 0 };
  }
  
  // Attach drag listeners only once to phoneMedia
  if (!m.dataset.dragAttached) {
    m.dataset.dragAttached = 'true';
    m.style.cursor = 'grab';
    m.style.overflow = 'hidden';
    m.style.position = 'relative'; // ensure wrapper boundaries

    var onDragStart = function(e) {
      if (typeof activeFormat === 'undefined' || activeFormat !== 'story') return;
      isDraggingMedia = true;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      dragStartX = clientX;
      dragStartY = clientY;
      var st = storyZoomState[currentMediaUrl];
      initialPanX = st ? st.x : 0;
      initialPanY = st ? st.y : 0;
      m.style.cursor = 'grabbing';
    };

    var onDragMove = function(e) {
      if (!isDraggingMedia) return;
      if (typeof activeFormat === 'undefined' || activeFormat !== 'story') return;
      e.preventDefault(); // prevent scrolling
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      var dx = clientX - dragStartX;
      var dy = clientY - dragStartY;
      
      var st = storyZoomState[currentMediaUrl];
      if (st) {
        st.x = initialPanX + (dx / st.z);
        st.y = initialPanY + (dy / st.z);
        applyStoryZoom(true); // true = no transition
      }
    };

    var onDragEnd = function(e) {
      if (isDraggingMedia) {
        isDraggingMedia = false;
        m.style.cursor = 'grab';
        applyStoryZoom(false); // restore transition
      }
    };

    m.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove, {passive: false});
    window.addEventListener('mouseup', onDragEnd);

    m.addEventListener('touchstart', onDragStart, {passive: false});
    window.addEventListener('touchmove', onDragMove, {passive: false});
    window.addEventListener('touchend', onDragEnd);
  }

  applyFilters();
  toggleStoryZoomUI(); // Setup initial UI state for this image
}

function applyFilters() {
  var el = document.querySelector('#phoneMedia img, #phoneMedia video');
  if (el) el.style.filter = 'brightness('+brightnessVal+'%) contrast('+contrastVal+'%)';
}

function applyStoryZoom(skipTransition) {
  var el = document.querySelector('#phoneMedia img, #phoneMedia video');
  if (!el || !currentMediaUrl) return;

  var slider = document.getElementById('storyZoomSlider');
  var isStory = (typeof activeFormat !== 'undefined' && activeFormat === 'story');

  if (isStory) {
    // We are in story mode
    el.style.objectFit = 'contain';
    
    var key = (typeof blobToBase64Map !== 'undefined' && blobToBase64Map[currentMediaUrl]) ? blobToBase64Map[currentMediaUrl] : currentMediaUrl;
    var st = storyZoomState[key] || { z: 1, x: 0, y: 0 };
    storyZoomState[key] = st;
    // update state from slider if caller is slider
    if (slider && !isDraggingMedia) {
      st.z = parseFloat(slider.value);
    } else if (slider) {
      slider.value = st.z; // sync slider when switching images
    }
    
    // Calculate boundaries to prevent panning beyond image edges
    var nw = el.naturalWidth || el.videoWidth;
    var nh = el.naturalHeight || el.videoHeight;
    if (nw && nh) {
      var cw = el.parentElement.clientWidth;
      var ch = el.parentElement.clientHeight;
      var imgRatio = nw / nh;
      var containerRatio = cw / ch;

      var renderedW, renderedH;
      if (imgRatio > containerRatio) {
        renderedW = cw;
        renderedH = cw / imgRatio;
      } else {
        renderedH = ch;
        renderedW = ch * imgRatio;
      }

      var scaledW = renderedW * st.z;
      var scaledH = renderedH * st.z;

      var maxX = Math.max(0, (scaledW - cw) / 2 / st.z);
      var maxY = Math.max(0, (scaledH - ch) / 2 / st.z);

      if (st.x > maxX) st.x = maxX;
      if (st.x < -maxX) st.x = -maxX;
      if (st.y > maxY) st.y = maxY;
      if (st.y < -maxY) st.y = -maxY;
    }
    
    if (skipTransition) {
      el.style.transition = 'none';
    } else {
      el.style.transition = 'transform 0.1s ease-out';
    }
    el.style.transform = 'translate(' + st.x + 'px, ' + st.y + 'px) scale(' + st.z + ')';
    
    // update the slider input UI
    if (slider) slider.value = st.z;

  } else {
    // Normal mode (Post / Reel)
    el.style.objectFit = 'cover';
    el.style.transition = 'transform 0.2s';
    el.style.transform = 'translate(0px, 0px) scale(1)';
  }
}

window.applyStoryZoom = applyStoryZoom;

function toggleStoryZoomUI() {
  var ui = document.getElementById('storyZoomControl');
  if (!ui) return;
  var isStory = (typeof activeFormat !== 'undefined' && activeFormat === 'story');
  ui.style.display = isStory ? 'flex' : 'none';
  
  var slider = document.getElementById('storyZoomSlider');
  if (isStory && currentMediaUrl && slider) {
    var st = storyZoomState[currentMediaUrl] || { z: 1, x: 0, y: 0 };
    slider.value = st.z;
  }
  applyStoryZoom(false);
}
window.toggleStoryZoomUI = toggleStoryZoomUI;
