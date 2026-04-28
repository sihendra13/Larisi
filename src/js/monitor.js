// RADAR — monitor.js
// Campaign Live Monitor: view switching, campaign cards, AI chat

/* ─── Campaign Data ─── */
var CAMPAIGNS = [];

/* ─── State ─── */
var activeCampaignId = null;
var campaignFilter = 'all';
var _analyticsCache = {};
var _analyticsFetching = {};
var _analyticsCacheTime = {}; // timestamp kapan cache diisi (untuk invalidasi)
var ANALYTICS_CACHE_TTL = 120000; // 2 menit

/* Buka URL postingan dari card — dipanggil saat timestamp diklik */
function _openCampaignPost(campId) {
  var cardEl = document.getElementById('campaign-card-' + campId);
  if (!cardEl) return;
  var chip = cardEl.querySelector('.cc-ts-chip');
  var href = chip ? chip.getAttribute('href') : null;
  if (href && href !== '#') {
    window.open(href, '_blank', 'noopener');
  }
}
var campaignReachIntervals = {};
var chatHistory = {};

/* ─── View Switching ─── */
function switchMenu(view) {
  var cmd = document.getElementById('view-command');
  var mon = document.getElementById('view-monitor');
  var an  = document.getElementById('view-analytics');
  var titleEl = document.getElementById('headerTitle');
  var subEl   = document.getElementById('headerSub');
  var icons   = document.querySelectorAll('.sb-icon');

  // Hide all views & clear active states
  cmd.style.display = 'none';
  mon.style.display = 'none';
  if (an) an.style.display = 'none';
  icons.forEach(function(i) { i.classList.remove('active'); });

  if (view === 'monitor') {
    mon.style.display = 'flex';
    if (titleEl) titleEl.textContent = 'Campaign Live Monitor';
    if (subEl)   subEl.textContent   = 'Monitor & interact with your live campaigns in real-time.';
    if (icons[1]) icons[1].classList.add('active');
    renderCampaigns();
    startReachCounters();
    loadCampaignsFromSupabase();
  } else if (view === 'analytics') {
    if (an) an.style.display = 'flex';
    if (titleEl) titleEl.textContent = 'Analytics & Estimate Hub';
    if (subEl)   subEl.textContent   = 'Ukur performa, bandingkan estimasi, dan temukan insight lokalmu.';
    if (icons[2]) icons[2].classList.add('active');
    stopReachCounters();
    if (typeof initAnalytics === 'function') initAnalytics();
  } else {
    cmd.style.display = 'flex';
    if (titleEl) titleEl.textContent = 'Creative Command Center';
    if (subEl)   subEl.textContent   = 'Orchestrate your cross-platform digital presence with precision.';
    if (icons[0]) icons[0].classList.add('active');
    stopReachCounters();
  }
}

/* ─── Filter ─── */
function filterCampaigns(filter, el) {
  campaignFilter = filter;
  document.querySelectorAll('.monitor-tab').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
  renderCampaigns();
}

function getFilteredCampaigns() {
  if (campaignFilter === 'all') return CAMPAIGNS;
  return CAMPAIGNS.filter(function(c) { return c.status === campaignFilter; });
}

/* ─── Helpers ─── */
function formatReach(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return Math.round(n / 1000) + 'K';
  return n.toString();
}

var PLAT_SVG = {
  ig:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
  tiktok:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/></svg>',
  meta:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3 3 0 00-2.12-2.13C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.56A3 3 0 00.5 6.19C0 8.03 0 12 0 12s0 3.97.5 5.81a3 3 0 002.12 2.12C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.57a3 3 0 002.12-2.12C24 15.97 24 12 24 12s0-3.97-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>'
};

function generateSparklinePath(data, w, h) {
  if (!data || data.length < 2) return '';
  var min = Math.min.apply(null, data);
  var max = Math.max.apply(null, data);
  var range = max - min || 1;
  var pts = data.map(function(v, i) {
    var x = (i / (data.length - 1)) * w;
    var y = h - ((v - min) / range) * (h - 4) - 2;
    return x.toFixed(1) + ',' + y.toFixed(1);
  });
  return 'M ' + pts.join(' L ');
}

/* ─── Render Campaigns ─── */
function renderCampaigns() {
  var list = document.getElementById('campaign-list');
  if (!list) return;
  list.innerHTML = '';
  // Sort terbaru dulu: campaign baru dari launch punya id = Date.now() (angka besar)
  // Campaign dari Supabase punya created_at string; fallback ke id
  CAMPAIGNS.sort(function(a, b) {
    var ta = a.created_at ? new Date(a.created_at).getTime() : (typeof a.id === 'number' ? a.id : 0);
    var tb = b.created_at ? new Date(b.created_at).getTime() : (typeof b.id === 'number' ? b.id : 0);
    return tb - ta; // descending: terbaru di atas
  });
  var filtered = getFilteredCampaigns();
  if (!filtered.length) {
    // Override display grid → flex agar empty state bisa center penuh
    list.style.display         = 'flex';
    list.style.alignItems      = 'center';
    list.style.justifyContent  = 'center';
    list.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;max-width:400px;">' +
        '<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="60" cy="60" r="50" fill="#f5f3ff"/>' +
          '<rect x="35" y="40" width="50" height="35" rx="8" fill="#e9d5ff"/>' +
          '<rect x="42" y="48" width="20" height="3" rx="2" fill="#7c3aed"/>' +
          '<rect x="42" y="55" width="14" height="3" rx="2" fill="#a78bfa"/>' +
          '<circle cx="72" cy="72" r="14" fill="#7c3aed"/>' +
          '<path d="M68 72h8M72 68v8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>' +
        '</svg>' +
        '<h3 style="font-size:18px;font-weight:600;color:#1a1a2e;margin:0;font-family:var(--font,sans-serif);">Belum ada campaign yang berjalan</h3>' +
        '<p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0;font-family:var(--font,sans-serif);">Launch campaign pertamamu dan pantau performanya secara real-time di sini!</p>' +
        '<button onclick="switchMenu(\'command\')" class="cc-empty-cta">🚀 Buat Campaign Pertama</button>' +
      '</div>';
    return;
  }
  // Reset ke grid (CSS default) saat ada campaign
  list.style.display        = '';
  list.style.alignItems     = '';
  list.style.justifyContent = '';
  filtered.forEach(function(c) {
    list.appendChild(buildCampaignCard(c));
    _loadAnalyticsForCard(c);
  });
  if (activeCampaignId) applyDimming(activeCampaignId);
}

/* ─── Load Campaigns from Supabase ─── */
async function loadCampaignsFromSupabase() {
  if (typeof getCampaigns !== 'function') return;

  var list = document.getElementById('campaign-list');
  if (list && !CAMPAIGNS.length) {
    list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--secondary);font-size:13px;">Memuat campaign...</div>';
  }

  try {
    var rows = await getCampaigns();
    if (!rows || !rows.length) {
      window.CAMPAIGNS_LOADED = true;
      renderCampaigns();
      return;
    }

    var platMap = { ig: 'ig', tiktok: 'tiktok', meta: 'meta', youtube: 'youtube',
                    instagram: 'ig', facebook: 'meta' };

    // JANGAN hapus demo campaign agar user bisa melihat contoh premium
    /* 
    for (var j = CAMPAIGNS.length - 1; j >= 0; j--) {
      if (CAMPAIGNS[j].isDemo) CAMPAIGNS.splice(j, 1);
    }
    */

    rows.forEach(function(row) {
      // Skip if already loaded (by supabase id)
      var exists = CAMPAIGNS.some(function(c) { return c.supabase_id === row.id; });
      if (exists) return;

      var platforms = (row.platforms || []).map(function(p) { return platMap[p] || p; });
      if (!platforms.length) platforms = ['ig'];

      var platLabel = platforms.map(function(p) { return p.toUpperCase(); }).join(', ');
      var dateStr   = row.created_at
        ? new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';

      CAMPAIGNS.unshift({
        id:          row.id,
        supabase_id: row.id,
        post_id:     row.post_id  || null,
        post_url:    row.post_url || null,
        format:      row.format   || 'post',
        name:        row.nama_campaign || 'Campaign',
        status:      row.status === 'active' ? 'running' : (row.status || 'running'),
        platforms:   platforms,
        reach:       row.estimated_reach_min || 0,
        reachTarget: row.estimated_reach_max || 10000,
        budget:      row.budget_idr || 0,
        budgetUsed:  0,
        sparkData:   [0, 0, 0, 0, 0, 0],
        thumbColor:  '#791ADB',
        // Prioritas: thumb_url dari Supabase (compressed JPEG, reliable antar sesi)
        // Fallback: localStorage (untuk campaign lama sebelum fitur ini)
        thumbUrl:    row.thumb_url || localStorage.getItem('radar_thumb_' + row.id) || null,
        launchTime:  dateStr,
        created_at:  row.created_at || null,
        aiOpening:
          'Campaign <strong>' + (row.nama_campaign || 'Campaign') + '</strong>\n\n' +
          'Lokasi: <strong>' + (row.kecamatan || '—') + '</strong> · Radius ' + (row.radius_km || 1) + ' km\n' +
          'Kategori: <strong>' + (row.kategori || '—') + '</strong>\n' +
          'Platform: <strong>' + platLabel + '</strong>\n' +
          'Estimasi reach: <strong>' + formatReach(row.estimated_reach_min || 0) + ' – ' + formatReach(row.estimated_reach_max || 0) + '</strong>\n' +
          (dateStr ? 'Diluncurkan: ' + dateStr + '\n' : '') +
          '\nAda yang ingin dianalisis dari campaign ini?',
        aiChips:         ['Lihat performa', 'Optimalkan targeting', 'Bagikan ke tim'],
        aiChipResponses: {}
      });
    });

    window.CAMPAIGNS_LOADED = true;
    renderCampaigns();
    startReachCounters();
    startPostUrlPolling();
  } catch(e) {
    window.CAMPAIGNS_LOADED = true;
    console.warn('[monitor] loadCampaignsFromSupabase error:', e);
  }
}

/* ─── Auto-fetch post_url dari PostForMe ─── */

async function fetchAndUpdatePostUrl(campaign, _attempt) {
  if (!campaign.post_id) return;
  if (campaign.post_url) return; // sudah ada, skip

  var attempt = _attempt || 1;
  var MAX_RETRIES = 3;
  var RETRY_DELAY = 5000; // 5 detik

  try {
    var data = await _pfmProxy(
      '/v1/social-posts/' + campaign.post_id,
      'GET', null
    );

    console.log('[monitor] fetchAndUpdatePostUrl keys:', Object.keys(data || {}));
    console.log('[monitor] social_accounts sample:', JSON.stringify(
      (data.social_accounts || []).map(function(a) {
        return { id: a.id, platform: a.platform, post_url: a.post_url, permalink: a.permalink };
      })
    ));

    var url = null;
    // PostForMe menyimpan post_url per akun di social_accounts
    if (data.social_accounts && data.social_accounts.length) {
      for (var i = 0; i < data.social_accounts.length; i++) {
        var sa = data.social_accounts[i];
        url = sa.post_url || sa.permalink || sa.platform_url || sa.url || null;
        if (url) break;
      }
    }
    // Fallback root level
    if (!url) {
      url = data.post_url || data.platform_url || data.permalink || null;
    }

    if (url) {
      campaign.post_url = url;

      if (typeof updateCampaignPostUrl === 'function') {
        updateCampaignPostUrl(campaign.supabase_id, url);
      }

      // Update timestamp link di DOM tanpa rebuild seluruh card
      var card = document.querySelector('[data-id="' + campaign.id + '"]');
      if (card) {
        var tsEl = card.querySelector('.cc-timestamp');
        if (tsEl && tsEl.tagName !== 'A') {
          var a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener';
          a.className = 'cc-timestamp';
          a.style.cssText = 'color:#791ADB;text-decoration:underline;text-underline-offset:2px;font-weight:600;';
          a.textContent = tsEl.textContent;
          a.addEventListener('click', function(e) { e.stopPropagation(); });
          tsEl.parentNode.replaceChild(a, tsEl);
        }
      }

      console.log('[monitor] post_url updated:', campaign.name, url);
    }
  } catch(e) {
    var msg = e.message || '';

    // 401 → stop polling untuk campaign ini saja, tandai auth_error
    if (msg.indexOf('401') !== -1) {
      console.error('[monitor] 401 Unauthorized untuk campaign:', campaign.name, '— stop polling campaign ini.');
      campaign._postUrlError = true;
      campaign._authError    = true;
      // Jangan stop semua campaign — hanya skip campaign ini di polling berikutnya
      var authCard = document.querySelector('[data-id="' + campaign.id + '"]');
      if (authCard) {
        var authTs = authCard.querySelector('.cc-timestamp');
        if (authTs) {
          authTs.style.color = '#f59e0b';
          authTs.title       = 'Akun perlu dihubungkan ulang.';
          authTs.textContent = 'Akun perlu dihubungkan ulang';
        }
      }
      return;
    }

    // CORS error → log warning saja, jangan crash, jangan retry
    if (msg.toLowerCase().indexOf('cors') !== -1 ||
        msg.toLowerCase().indexOf('failed to fetch') !== -1 ||
        msg.toLowerCase().indexOf('networkerror') !== -1) {
      console.warn('[monitor] fetchAndUpdatePostUrl CORS/network error (skip):', msg);
      return;
    }

    // 503 → retry otomatis maksimal 3x dengan delay 5 detik
    if (msg.indexOf('503') !== -1 || msg.indexOf('SUPABASE_EDGE_RUNTIME') !== -1) {
      if (attempt < MAX_RETRIES) {
        console.warn('[monitor] 503 dari postforme-proxy, retry ' + attempt + '/' + MAX_RETRIES + ' dalam 5 detik...');
        setTimeout(function() {
          fetchAndUpdatePostUrl(campaign, attempt + 1);
        }, RETRY_DELAY);
      } else {
        console.warn('[monitor] fetchAndUpdatePostUrl gagal setelah ' + MAX_RETRIES + ' retry (503):', campaign.name);
        // Tandai campaign sebagai error agar polling interval skip dia
        campaign._postUrlError = true;
        // Tampilkan indikator error di card
        var errCard = document.querySelector('[data-id="' + campaign.id + '"]');
        if (errCard) {
          var tsEl = errCard.querySelector('.cc-timestamp');
          if (tsEl) {
            tsEl.style.color  = '#ef4444';
            tsEl.title        = 'Gagal ambil link postingan (server error). Coba refresh halaman.';
            tsEl.textContent  = (tsEl.textContent || '') + ' ⚠';
          }
        }
      }
      return;
    }

    console.warn('[monitor] fetchAndUpdatePostUrl error:', msg);
  }
}

var _postUrlPollInterval = null;

function startPostUrlPolling() {
  if (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1') {
    console.log('[monitor] polling dinonaktifkan di localhost');
    return;
  }
  // Jalankan sekali langsung untuk semua campaign yang belum punya post_url
  CAMPAIGNS.forEach(function(c) {
    if (!c.post_url && c.post_id) fetchAndUpdatePostUrl(c);
  });

  // Bersihkan interval lama jika ada
  if (_postUrlPollInterval) clearInterval(_postUrlPollInterval);

  _postUrlPollInterval = setInterval(function() {
    var pending = CAMPAIGNS.filter(function(c) {
      return !c.post_url && c.post_id && !c._postUrlError;
    });

    if (!pending.length) {
      clearInterval(_postUrlPollInterval);
      _postUrlPollInterval = null;
      return;
    }

    console.log('[monitor] polling', pending.length, 'campaigns untuk post_url...');
    pending.forEach(function(c) { fetchAndUpdatePostUrl(c); });
  }, 60000);
}
window.startPostUrlPolling = startPostUrlPolling;

function showDeleteConfirmModal(campaign) {
  var old = document.getElementById('deleteConfirmOverlay');
  if (old) old.remove();

  var platLabels = { ig:'Instagram', meta:'Facebook',
                     tiktok:'TikTok', youtube:'YouTube' };
  var platNames = (campaign.platforms || [])
    .map(function(p){ return platLabels[p] || p; }).join(', ');

  var overlay = document.createElement('div');
  overlay.id = 'deleteConfirmOverlay';
  overlay.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,0,0.55);'
    + 'z-index:9999;display:flex;align-items:center;'
    + 'justify-content:center;font-family:var(--font,sans-serif);'
    + 'backdrop-filter:blur(4px);';
  overlay.onclick = function(e) {
    if (e.target === overlay) overlay.remove();
  };

  overlay.innerHTML =
    '<div style="background:#fff;border-radius:20px;padding:28px;'
    + 'width:380px;max-width:calc(100vw - 32px);'
    + 'box-shadow:0 24px 64px rgba(0,0,0,0.2);">'

    + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">'
    +   '<div style="width:40px;height:40px;border-radius:12px;'
    +     'background:#fef2f2;display:flex;align-items:center;'
    +     'justify-content:center;flex-shrink:0;">'
    +     '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    +       '<polyline points="3 6 5 6 21 6"/>'
    +       '<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>'
    +       '<path d="M10 11v6M14 11v6"/>'
    +       '<path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>'
    +     '</svg>'
    +   '</div>'
    +   '<div>'
    +     '<div style="font-size:16px;font-weight:700;color:#111827;">Hapus Campaign?</div>'
    +     '<div style="font-size:12px;color:#6b7280;margin-top:1px;">Tindakan ini tidak bisa dibatalkan</div>'
    +   '</div>'
    + '</div>'

    + '<div style="background:#f9fafb;border-radius:10px;padding:12px 14px;margin-bottom:14px;">'
    +   '<div style="font-size:13px;font-weight:700;color:#111827;'
    +     'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'
    +     campaign.name
    +   '</div>'
    +   '<div style="font-size:11px;color:#6b7280;margin-top:3px;">'
    +     platNames
    +   '</div>'
    + '</div>'

    + '<div style="background:#fffbeb;border:1px solid #fcd34d;'
    +   'border-radius:10px;padding:12px 14px;margin-bottom:20px;'
    +   'font-size:12px;color:#92400e;line-height:1.6;">'
    +   '⚠️ <strong>Postingan di ' + platNames + ' TIDAK akan terhapus.</strong>'
    +   ' Kamu perlu hapus manual di masing-masing platform.'
    + '</div>'

    + '<div style="display:flex;gap:10px;">'
    +   '<button onclick="document.getElementById(\'deleteConfirmOverlay\').remove()" '
    +     'style="flex:1;padding:11px;border-radius:12px;'
    +     'border:1.5px solid #e5e7eb;background:#fff;'
    +     'color:#374151;font-size:13px;font-weight:600;'
    +     'cursor:pointer;font-family:var(--font,sans-serif);">Batal</button>'
    +   '<button onclick="_confirmDeleteCampaign(\'' + campaign.id + '\',\''
    +     (campaign.supabase_id || campaign.id) + '\')" '
    +     'style="flex:1;padding:11px;border-radius:12px;'
    +     'border:none;background:#ef4444;color:#fff;'
    +     'font-size:13px;font-weight:600;cursor:pointer;'
    +     'font-family:var(--font,sans-serif);">Hapus dari RADAR</button>'
    + '</div>'
    + '</div>';

  document.body.appendChild(overlay);
}

async function _confirmDeleteCampaign(localId, supabaseId) {
  var overlay = document.getElementById('deleteConfirmOverlay');
  if (overlay) overlay.remove();

  if (supabaseId && typeof deleteCampaign === 'function') {
    await deleteCampaign(supabaseId);
  }

  CAMPAIGNS = CAMPAIGNS.filter(function(c) {
    return String(c.id) !== String(localId);
  });

  var cardEl = document.getElementById('campaign-card-' + localId);
  if (cardEl) {
    cardEl.style.transition = 'opacity 0.3s, transform 0.3s';
    cardEl.style.opacity = '0';
    cardEl.style.transform = 'scale(0.95)';
    setTimeout(function() { cardEl.remove(); }, 300);
  }

  if (typeof showTopToast === 'function') {
    showTopToast('✓ Campaign berhasil dihapus dari RADAR', 'success');
  }
}

function buildCampaignCard(c) {
  var isRunning = c.status === 'running';
  var isPaused  = c.status === 'paused';
  var statusColor = isRunning ? '#16a34a' : (isPaused ? '#d97706' : '#9ca3af');
  var statusLbl   = isRunning ? 'Running' : (isPaused ? 'Paused' : 'Ended');
  var pct = Math.min(100, Math.round((c.reach / (c.reachTarget || 1)) * 100));

  var platColors = { ig:'#E1306C', tiktok:'#010101', meta:'#1877F2', youtube:'#FF0000' };
  var platLabels = { ig:'Instagram', tiktok:'TikTok', meta:'Facebook', youtube:'YouTube' };
  var primaryColor = platColors[c.platforms[0]] || '#791ADB';

  var storedAccounts = typeof _getStoredAccounts === 'function' ? _getStoredAccounts() : [];
  var platApiMap = { ig:'instagram', meta:'facebook', tiktok:'tiktok', youtube:'youtube' };
  var matchedAcc = null;
  for (var i = 0; i < storedAccounts.length; i++) {
    if (storedAccounts[i].platform === (platApiMap[c.platforms[0]] || c.platforms[0])) {
      matchedAcc = storedAccounts[i]; break;
    }
  }
  var avatarUrl = matchedAcc ? (matchedAcc.avatar_url || '') : '';
  var username  = matchedAcc ? (matchedAcc.username || '') : '';
  var usernameDisplay = username ? ('@' + username) : (platLabels[c.platforms[0]] || 'Social');

  var timeDisplay = c.launchTime || '';
  if (c.created_at) {
    try {
      var d = new Date(c.created_at);
      var days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
      var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
      timeDisplay = days[d.getDay()] + ', ' + d.getDate() + ' '
        + months[d.getMonth()] + ' ' + d.getFullYear()
        + ' · ' + String(d.getHours()).padStart(2,'0') + '.'
        + String(d.getMinutes()).padStart(2,'0');
    } catch(e) {}
  }

  var initials = (c.name || 'C').charAt(0).toUpperCase();
  var avatarBg  = c.thumbColor || '#7c3aed';

  var avatarFallbackStyle =
    'width:100%;height:100%;background:' + avatarBg + ';'
    + 'display:flex;align-items:center;justify-content:center;'
    + 'font-size:14px;font-weight:700;color:white;border-radius:50%;';

  var avatarHTML = avatarUrl
    ? '<img src="' + avatarUrl + '" style="width:100%;height:100%;object-fit:cover;" '
    +   'onerror="this.style.display=\'none\';'
    +   'var fb=document.createElement(\'div\');'
    +   'fb.style.cssText=\'' + avatarFallbackStyle.replace(/'/g, '\\\'') + '\';'
    +   'fb.textContent=\'' + initials + '\';'
    +   'this.parentElement.appendChild(fb);">'
    : '<div style="' + avatarFallbackStyle + '">' + initials + '</div>';

  var platSvgContent = (PLAT_SVG[c.platforms[0]] || '')
    .replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');

  var fmt = c.format || 'post';
  var platName = platLabels[c.platforms[0]] || 'Platform';

  // Thumbnail dari thumbUrl (foto yang diupload saat launch)
  // blob: URL tidak valid antar sesi — buang agar tidak tampil blur setelah refresh
  var _thumbRaw = c.thumbUrl || '';
  var _thumb = _thumbRaw.startsWith('blob:') ? '' : _thumbRaw;
  // blob: URLs bisa berupa gambar OR video — cek format campaign untuk menentukan
  var _isActualVideo = _thumb.startsWith('data:video') ||
    (c.format && (c.format === 'reel' || c.format === 'video')) ||
    (typeof uploadedVideoFile !== 'undefined' && uploadedVideoFile && c.id === (window._lastLaunchedId));
  var _isVideoPlaceholder = _isActualVideo && !_thumb.startsWith('data:image');
  // Hanya pakai data: atau https: — blob: sudah dibuang di atas
  var _isImage = _thumb.startsWith('data:image') || _thumb.startsWith('https://');
  var _videoPlaceholderHTML =
    '<div class="cc-thumbnail-container" style="margin:0 12px 8px;height:240px;'
    + 'border-radius:8px;background:' + (c.thumbColor || '#1a1a2e') + ';'
    + 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;">'
    + '<span style="font-size:36px;line-height:1;">&#9654;</span>'
    + '<span style="color:white;font-size:12px;font-weight:600;letter-spacing:0.05em;">VIDEO</span>'
    + '</div>';
  var thumbHTML = !_thumb
    ? '<div class="cc-thumbnail-container" style="margin:0 12px 8px;height:240px;'
    +   'border-radius:8px;display:flex;align-items:center;justify-content:center;">'
    +   '<span style="color:#9ca3af;font-size:12px;text-align:center;">Foto tidak tersedia</span>'
    + '</div>'
    : _isVideoPlaceholder
    ? _videoPlaceholderHTML
    : _isImage
    ? '<div class="cc-thumbnail-container" style="margin:0 12px 8px;height:240px;border-radius:8px;overflow:hidden;">'
    +   '<img src="' + _thumb + '" class="cc-thumbnail-img" style="width:100%;height:100%;'
    +   'object-fit:cover;object-position:top;display:block;">'
    + '</div>'
    : _videoPlaceholderHTML;

  // View URL untuk timestamp — pakai post_url langsung dari API (bukan konstruksi)
  // Story tidak punya URL permanen, selalu plain text
  var isStory = fmt === 'story';
  var viewUrl = (!isStory && c.post_url) ? c.post_url : null;

  var card = document.createElement('div');
  card.className = 'campaign-card' + (isRunning ? ' running-card' : '')
    + (activeCampaignId === c.id ? ' focused' : '');
  card.id = 'campaign-card-' + c.id;
  card.setAttribute('data-id', c.id);
  card.onclick = function() { selectCampaign(c.id); };

  card.innerHTML =

    // ── Header ──
    '<div style="display:flex;align-items:center;gap:8px;padding:12px 12px 8px;">'

    // Avatar
    + '<div style="position:relative;width:40px;height:40px;flex-shrink:0;">'
    +   '<div style="width:40px;height:40px;border-radius:50%;overflow:hidden;'
    +     'border:1.5px solid ' + primaryColor + '40;">' + avatarHTML + '</div>'
    +   '<div style="position:absolute;bottom:0;right:0;width:16px;height:16px;'
    +     'border-radius:50%;background:white;border:1.5px solid #e5e7eb;'
    +     'display:flex;align-items:center;justify-content:center;'
    +     'box-sizing:border-box;padding:2px;">'
    +     '<svg viewBox="0 0 24 24" fill="' + primaryColor + '" width="10" height="10">'
    +       platSvgContent
    +     '</svg>'
    +   '</div>'
    + '</div>'

    // Info — nama + username + timestamp
    + '<div style="flex:1;min-width:0;">'
    +   '<div style="font-size:13px;font-weight:700;color:#111827;'
    +     'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-0.2px;">'
    +     c.name
    +   '</div>'
    +   '<div style="font-size:10px;color:#9ca3af;margin-top:1px;">'
    +     usernameDisplay
    +   '</div>'
    +   '<div style="font-size:10px;margin-top:2px;">'
    +     (viewUrl
    ?       '<a href="' + viewUrl + '" target="_blank" rel="noopener" class="cc-timestamp" '
    +         'style="color:#791ADB;text-decoration:underline;text-underline-offset:2px;font-weight:600;" '
    +         'onclick="event.stopPropagation();">' + timeDisplay + '</a>'
    : isStory
    ?       '<span class="cc-timestamp" style="color:#9ca3af;">' + timeDisplay + '</span>'
    :       '<span class="cc-timestamp" style="color:#9ca3af;cursor:help;" title="Link belum tersedia">' + timeDisplay + '</span>')
    +   '</div>'
    + '</div>'

    // Status + Delete — satu baris kanan
    + '<div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">'
    +   '<span style="width:6px;height:6px;border-radius:50%;'
    +     'background:' + (isRunning ? '#22c55e' : statusColor) + ';'
    +     'display:inline-block;'
    +     (isRunning ? 'animation:pulseDot 2s infinite;' : '') + '"></span>'
    +   '<span style="font-size:10px;font-weight:700;color:' + statusColor + ';'
    +     'text-transform:uppercase;">' + statusLbl + '</span>'
    +   '<button onclick="event.stopPropagation();showDeleteConfirmModal('
    +     JSON.stringify({
            id: c.id,
            name: c.name,
            platforms: c.platforms,
            supabase_id: c.supabase_id || c.id
          }).replace(/"/g, '&quot;') + ')" '
    +     'style="background:none;border:none;cursor:pointer;padding:4px;'
    +     'color:#9ca3af;display:flex;align-items:center;'
    +     'border-radius:6px;transition:color 0.2s,background 0.2s;" '
    +     'title="Hapus campaign" '
    +     'onmouseover="this.style.color=\'#ef4444\';this.style.background=\'#fef2f2\'" '
    +     'onmouseout="this.style.color=\'#9ca3af\';this.style.background=\'none\'">'
    +     '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    +       '<polyline points="3 6 5 6 21 6"/>'
    +       '<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>'
    +       '<path d="M10 11v6M14 11v6"/>'
    +       '<path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>'
    +     '</svg>'
    +   '</button>'
    + '</div>'
    + '</div>'

    // ── Thumbnail ──
    + thumbHTML

    // ── Divider ──
    + '<div style="height:1px;background:#f3f4f6;margin:0 12px;"></div>'

    // ── Engagement ──
    + '<div style="padding:8px 12px;">'
    +   '<div style="display:flex;justify-content:space-between;'
    +     'align-items:center;margin-bottom:6px;">'
    +     '<span style="font-size:10px;font-weight:700;color:#374151;'
    +       'letter-spacing:0.03em;">ENGAGEMENTS</span>'
    +     '<span id="eng-total-' + c.id + '" style="font-size:10px;'
    +       'font-weight:700;color:#791ADB;">—</span>'
    +   '</div>'
    +   '<div style="display:flex;flex-direction:column;gap:3px;">'
    +     _engRow2('Reactions', 'likes-'    + c.id)
    +     _engRow2('Comments',  'comments-' + c.id)
    +     _engRow2('Shares',    'shares-'   + c.id)
    +     _engRow2('Views',     'views-'    + c.id, (c.views && c.views > 0) ? formatReach(c.views) : '—')
    +     '<div style="display:flex;align-items:center;justify-content:space-between;padding:2px 0;">'
    +       '<span style="font-size:10px;color:#111827;">Reach</span>'
    +       '<span style="font-size:11px;font-weight:700;color:#111827;display:flex;align-items:center;gap:4px;">'
    +         '<span id="reach-num-' + c.id + '">' + formatReach(c.reach) + '</span>'
    +         '<span style="font-size:10px;color:#9ca3af;font-weight:400;margin-left:4px;">(estimasi)</span>'
    +         (isRunning ? '<span style="font-size:9px;color:#16a34a;margin-left:3px;">▲</span>' : '')
    +       '</span>'
    +     '</div>'
    +   '</div>'
    + '</div>'

    // ── Progress bar ──
    + '<div style="height:2px;background:#f3f4f6;overflow:hidden;margin:0 12px 8px;">'
    +   '<div id="reach-bar-' + c.id + '" style="height:100%;width:' + pct + '%;'
    +     'background:' + (isRunning ? '#791ADB' : '#d1d5db') + ';'
    +     'transition:width 0.5s ease;border-radius:2px;"></div>'
    + '</div>'

    // ── Boost button ──
    + '<div style="padding:0 12px 12px;">'
    + '<button onclick="event.stopPropagation();showBoostModal('
    + JSON.stringify({
        nama: c.name, name: c.name, platforms: c.platforms,
        kecamatan: c.kecamatan || '', radius: c.radius || 1,
        kategori: c.kategori || 'General', format: fmt,
        reachMin: c.reach || 0, reachMax: c.reachTarget || 10000
      }).replace(/"/g, '&quot;') + ')" '
    + 'style="width:100%;padding:8px;border-radius:8px;border:none;'
    + 'background:#111827;color:white;font-size:11px;font-weight:700;'
    + 'cursor:pointer;font-family:var(--font,sans-serif);'
    + 'display:flex;align-items:center;justify-content:center;gap:5px;'
    + 'transition:background 0.15s;" '
    + 'onmouseover="this.style.background=\'#791ADB\'" '
    + 'onmouseout="this.style.background=\'#111827\'">🚀 Boost Campaign</button>'
    + '</div>';

  return card;
}

// Helper engagement row
function _engRow2(label, elId, defaultVal, isLive) {
  return '<div style="display:flex;align-items:center;justify-content:space-between;padding:2px 0;">'
    + '<span style="font-size:10px;color:#111827;">' + label + '</span>'
    + '<span style="font-size:11px;font-weight:700;color:#111827;">'
    +   '<span id="' + elId + '">' + (defaultVal || '—') + '</span>'
    +   (isLive ? '<span style="font-size:9px;color:#16a34a;margin-left:3px;">▲</span>' : '')
    + '</span>'
    + '</div>';
}

/* ─── Load Analytics for Card ─── */
async function _loadAnalyticsForCard(campaign) {
  // Skip campaign yang sudah diketahui auth error
  if (campaign._authError) return;
  try {
    var accounts = typeof _getStoredAccounts === 'function'
      ? _getStoredAccounts() : [];
    if (!accounts.length) return;

    var platApiMap = { ig:'instagram', meta:'facebook',
                       tiktok:'tiktok', youtube:'youtube' };
    var plat = campaign.platforms[0];
    var sp   = platApiMap[plat] || plat;

    var acc = null;
    for (var j = 0; j < accounts.length; j++) {
      if (accounts[j].platform === sp) { acc = accounts[j]; break; }
    }
    if (!acc || !acc.id) return;

    var cacheKey = acc.id;
    if (!_analyticsCache[cacheKey] && !_analyticsFetching[cacheKey]) {
      _analyticsFetching[cacheKey] = true;
      try {
        var data = await _pfmProxy(
          '/v1/social-account-feeds/' + acc.id + '?expand=metrics&limit=50',
          'GET', null
        );
        console.log('[analytics] response type:', Array.isArray(data) ? 'array' : typeof data);
        console.log('[analytics] keys:', Object.keys(data || {}));
        if (data && !Array.isArray(data)) {
          console.log('[analytics] sample:', JSON.stringify(data).slice(0, 400));
        }
        var posts = (data && (
          data.posts
          || data.data
          || data.items
          || data.feeds
          || data.results
          || data.feed
        )) || (Array.isArray(data) ? data : []);

        if (!posts || !posts.length) {
          console.warn('[analytics] Tidak ada posts ditemukan. Keys tersedia:', Object.keys(data || {}));
        }
        _analyticsCache[cacheKey] = posts;
      } catch(e) {
        _analyticsCache[cacheKey] = [];
      }
      _analyticsFetching[cacheKey] = false;
    }

    var waited = 0;
    while (_analyticsFetching[cacheKey] && waited < 5000) {
      await new Promise(function(r){ setTimeout(r, 100); });
      waited += 100;
    }

    var posts = _analyticsCache[cacheKey] || [];
    if (!posts.length) return;

    // Cari post yang match dengan campaign.post_id
    // Kalau tidak ada post_id, pakai post paling recent dari platform
    var targetPost = null;
    if (campaign.post_id) {
      for (var k = 0; k < posts.length; k++) {
        if (posts[k].platform_post_id === campaign.post_id ||
            posts[k].id === campaign.post_id) {
          targetPost = posts[k]; break;
        }
      }
    }
    // Fallback: pakai post pertama (paling recent)
    if (!targetPost && posts.length > 0) {
      targetPost = posts[0];
    }
    if (!targetPost) return;

    // Extract metrics
    var m = targetPost.metrics || {};
    var likes    = parseInt(m.like_count    || m.likes    || m.reactions || m.favorite_count || 0);
    var comments = parseInt(m.comment_count || m.comments || m.reply_count || 0);
    var shares   = parseInt(m.share_count   || m.shares   || m.retweet_count || 0);
    var views    = parseInt(m.view_count || m.views || m.video_views ||
                           m.ig_reels_video_view_total_time && 0 ||
                           m.play_count || m.impressions || 0);

    var fmt = function(n) {
      return n >= 1000 ? (n/1000).toFixed(1)+'K' : n.toString();
    };

    // Update engagement DOM
    var likesEl    = document.getElementById('likes-'     + campaign.id);
    var commentsEl = document.getElementById('comments-'  + campaign.id);
    var sharesEl   = document.getElementById('shares-'    + campaign.id);
    var totalEl    = document.getElementById('eng-total-' + campaign.id);
    if (likesEl)    likesEl.textContent    = fmt(likes);
    if (commentsEl) commentsEl.textContent = fmt(comments);
    if (sharesEl)   sharesEl.textContent   = fmt(shares);
    if (totalEl)    totalEl.textContent    = fmt(likes + comments + shares);

    // Update views DOM
    var viewsEl = document.getElementById('views-' + campaign.id);
    if (viewsEl) viewsEl.textContent = views > 0 ? fmt(views) : '—';

    // Update reach DOM dengan data real dari API
    var reachReal = parseInt(m.reach || m.total_reach || 0);
    if (reachReal > 0) {
      var reachEl = document.getElementById('reach-num-' + campaign.id);
      if (reachEl) reachEl.textContent = fmt(reachReal);
      // Sembunyikan label estimasi karena sudah dapat data real
      var estEl = document.getElementById('reach-est-' + campaign.id);
      if (estEl) estEl.style.display = 'none';
    }

    // Build post URL dari targetPost
    var postUrl = targetPost.platform_url || targetPost.url || null;
    if (!postUrl) {
      var pid   = targetPost.platform_post_id || null;
      var uname = acc.username || '';
      var fmt2  = campaign.format || 'post';
      if (pid) {
        if (plat === 'ig') {
          postUrl = fmt2 === 'reel'
            ? 'https://www.instagram.com/reel/' + pid + '/'
            : 'https://www.instagram.com/p/' + pid + '/';
        } else if (plat === 'meta') {
          postUrl = 'https://www.facebook.com/permalink.php?story_fbid=' + pid;
        } else if (plat === 'tiktok' && uname) {
          postUrl = 'https://www.tiktok.com/@' + uname + '/video/' + pid;
        } else if (plat === 'youtube') {
          postUrl = 'https://www.youtube.com/shorts/' + pid;
        }
      }
    }

    // Update UI — versi baru (Image + Link)
    var cardEl = document.getElementById('campaign-card-' + campaign.id);
    if (cardEl) {
      if (postUrl) {
        var tsLink = cardEl.querySelector('.cc-timestamp-link');
        if (tsLink) tsLink.href = postUrl;

        var chip = cardEl.querySelector('.cc-ts-chip');
        if (chip) { chip.href = postUrl; chip.style.display = ''; }
      }

      if (mediaUrl) {
        var thumbContainer = cardEl.querySelector('.cc-thumbnail-container');
        if (thumbContainer) {
          // Jika tadi placeholder, ganti jadi gambar
          var img = thumbContainer.querySelector('.cc-thumbnail-img');
          if (img) {
            img.src = mediaUrl;
          } else {
            thumbContainer.innerHTML = '<img src="' + mediaUrl + '" class="cc-thumbnail-img" style="width:100%;height:180px;'
              + 'object-fit:cover;border-radius:12px;display:block;box-shadow: 0 4px 12px rgba(0,0,0,0.08);">';
            thumbContainer.style.background = 'none';
            thumbContainer.style.border = 'none';
          }
        }
      }
        var tsText = cardEl.querySelector('.cc-ts-text');
        if (tsText) {
          tsText.style.color = '#791ADB';
          tsText.style.textDecoration = 'underline';
          tsText.style.cursor = 'pointer';
          tsText.setAttribute('onclick', 'event.stopPropagation();_openCampaignPost(\'' + campaign.id + '\');');
        }
      }

  } catch(e) { /* silent */ }
}

/* ─── Dimming ─── */
function applyDimming(activeId) {
  document.querySelectorAll('.campaign-card').forEach(function(card) {
    var id = card.getAttribute('data-id');
    if (id === String(activeId)) {
      card.classList.add('focused');
      card.classList.remove('dimmed');
    } else {
      card.classList.remove('focused');
      card.classList.remove('dimmed');
    }
  });
}

function removeDimming() {
  document.querySelectorAll('.campaign-card').forEach(function(card) {
    card.classList.remove('focused', 'dimmed');
  });
}

/* ─── Campaign Selection ─── */
function selectCampaign(id) {
  if (activeCampaignId === id) {
    activeCampaignId = null;
    removeDimming();
    resetChatPanel();
    return;
  }
  activeCampaignId = id;
  applyDimming(id);
  openChatForCampaign(id);
}

/* ─── Chat Panel ─── */
function resetChatPanel() {
  var empty = document.getElementById('chatEmpty');
  var msgs  = document.getElementById('chatMessages');
  if (empty) empty.style.display = '';
  if (msgs)  msgs.style.display  = 'none';
  var pill = document.getElementById('contextPill');
  if (pill) pill.innerHTML =
    '<span class="ctx-dot" id="ctxDot"></span>'
    + '<span style="color:var(--secondary);">Pilih campaign</span>';
}

function openChatForCampaign(id) {
  var campaign = null;
  for (var i = 0; i < CAMPAIGNS.length; i++) {
    if (CAMPAIGNS[i].id === id) { campaign = CAMPAIGNS[i]; break; }
  }
  if (!campaign) return;

  // Update context pill
  var dotCls = campaign.status === 'running' ? 'running' : 'paused';
  var pill = document.getElementById('contextPill');
  if (pill) pill.innerHTML =
    '<span class="ctx-dot ' + dotCls + '" id="ctxDot"></span>'
    + '<div style="display:flex;flex-direction:column;line-height:1.3;">'
    +   '<span style="font-size:9px;color:var(--secondary);font-weight:500;">Bicara tentang</span>'
    +   '<span style="font-size:11px;font-weight:700;color:#5b21b6;">' + campaign.name + '</span>'
    + '</div>';

  // Show chat
  var empty = document.getElementById('chatEmpty');
  var msgs  = document.getElementById('chatMessages');
  if (empty) empty.style.display = 'none';
  if (msgs)  msgs.style.display  = 'flex';

  if (!chatHistory[id]) {
    chatHistory[id] = [];
    msgs.innerHTML = '';
    setTimeout(function() { addAIMessage(id, campaign.aiOpening, campaign.aiChips); }, 300);
  } else {
    msgs.innerHTML = '';
    chatHistory[id].forEach(function(m) {
      appendMsgDOM(m.role, m.text, m.chips, m.chipsUsed);
    });
    scrollChatToBottom();
  }
}

function addAIMessage(campaignId, text, chips) {
  if (activeCampaignId !== campaignId) return;
  if (!chatHistory[campaignId]) chatHistory[campaignId] = [];
  chatHistory[campaignId].push({ role: 'ai', text: text, chips: chips, chipsUsed: false });
  appendMsgDOM('ai', text, chips, false);
  scrollChatToBottom();
}

function appendMsgDOM(role, text, chips, chipsUsed) {
  var msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  var div = document.createElement('div');
  div.className = 'chat-msg ' + role;

  if (role === 'ai') {
    var chipsHTML = '';
    if (chips && chips.length) {
      chipsHTML = '<div class="chat-chips">';
      chips.forEach(function(chip) {
        chipsHTML += '<button class="chat-chip' + (chipsUsed ? ' used' : '') + '" onclick="useChatChip(this,\'' + chip.replace(/'/g, "\\'") + '\')">' + chip + '</button>';
      });
      chipsHTML += '</div>';
    }
    div.innerHTML =
      '<div class="chat-sender ai-label">SiLaris</div>'
      + '<div class="chat-bubble ai-bubble">' + text.replace(/\n/g, '<br>') + '</div>'
      + chipsHTML;
  } else {
    div.innerHTML =
      '<div class="chat-sender">Kamu</div>'
      + '<div class="chat-bubble user-bubble">' + text.replace(/\n/g, '<br>') + '</div>';
  }

  msgs.appendChild(div);
}

function useChatChip(btn, chipText) {
  if (!activeCampaignId) return;
  // Mark clicked chip as used
  btn.classList.add('used');
  // Delegate to sendChatMessage with chip text as override
  sendChatMessage(chipText);
}

function addUserMessage(text) {
  if (!activeCampaignId) return;
  if (!chatHistory[activeCampaignId]) chatHistory[activeCampaignId] = [];
  chatHistory[activeCampaignId].push({ role: 'user', text: text });
  appendMsgDOM('user', text, null, false);
  scrollChatToBottom();
}

async function sendChatMessage(overrideText) {
  var input = document.getElementById('chatInput');
  var text;

  if (overrideText) {
    // Called from chip button — text provided directly
    text = overrideText.trim();
    addUserMessage(text);
  } else {
    // Called from input box
    if (!input) return;
    text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = '';
    addUserMessage(text);
  }

  showTypingIndicator();

  var campaign = activeCampaignId
    ? (CAMPAIGNS || []).find(function(c) { return c.id === activeCampaignId; })
    : null;

  var systemPrompt = 'Kamu adalah SiLaris, co-pilot marketing AI untuk UMKM Indonesia di platform Larisi. Gunakan bahasa Indonesia santai, singkat, dan actionable. Selalu berikan rekomendasi spesifik dan praktis.'
    + (campaign ? '\n\nData campaign aktif:'
    + '\n- Nama: ' + (campaign.name || campaign.nama_campaign || '-')
    + '\n- Platform: ' + (Array.isArray(campaign.platforms) ? campaign.platforms.join(', ') : (campaign.platform || '-'))
    + '\n- Format: ' + (campaign.format || '-')
    + '\n- Lokasi: ' + (campaign.kecamatan || campaign.location || '-')
    + '\n- Radius: ' + (campaign.radius || '-') + ' km'
    + '\n- Reach: ' + (campaign.estimated_reach_max || campaign.reach || 0)
    + '\n- Status: ' + (campaign.status || 'running')
    + '\n- Caption: ' + (campaign.caption || '').slice(0, 200)
    : '\nTidak ada campaign yang dipilih.');

  // Build conversation history for context
  var history = (chatHistory[activeCampaignId] || []).map(function(m) {
    return { role: m.role === 'ai' ? 'assistant' : 'user', content: m.text };
  });

  var supabaseUrl = (typeof RADAR_CONFIG !== 'undefined' && RADAR_CONFIG.SUPABASE_URL)
    || 'https://mojzmlrdihenvfhrwopd.supabase.co';
  var supabaseKey = (typeof RADAR_CONFIG !== 'undefined' && RADAR_CONFIG.SUPABASE_ANON_KEY) || '';
  var edgeUrl = supabaseUrl + '/functions/v1/silaris-chat';

  try {
    var resp = await fetch(edgeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + supabaseKey
      },
      body: JSON.stringify({
        messages:     history,
        systemPrompt: systemPrompt
      })
    });
    var data = await resp.json();
    var aiText = data.reply || 'Maaf, tidak bisa merespons saat ini.';
    removeTypingIndicator();
    addAIMessage(activeCampaignId, aiText, null);
  } catch(e) {
    removeTypingIndicator();
    addAIMessage(activeCampaignId, 'Gagal terhubung ke SiLaris. Coba lagi ya!', null);
    console.error('[silaris-chat] error:', e);
  }
}

// ── defaultAIResponse removed — replaced by Claude API in sendChatMessage() ──

function showTypingIndicator() {
  var msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  var div = document.createElement('div');
  div.className = 'chat-msg ai';
  div.id = 'ai-typing';
  div.innerHTML =
    '<div class="chat-sender ai-label">SiLaris</div>'
    + '<div class="chat-bubble ai-bubble" style="padding:12px 14px;">'
    + '<span class="scan-dot" style="display:inline-block;margin:0 2px;"></span>'
    + '<span class="scan-dot" style="display:inline-block;margin:0 2px;"></span>'
    + '<span class="scan-dot" style="display:inline-block;margin:0 2px;"></span>'
    + '</div>';
  msgs.appendChild(div);
  scrollChatToBottom();
}

function removeTypingIndicator() {
  var el = document.getElementById('ai-typing');
  if (el) el.remove();
}

function scrollChatToBottom() {
  var msgs = document.getElementById('chatMessages');
  if (msgs) setTimeout(function() { msgs.scrollTop = msgs.scrollHeight; }, 50);
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
}

function autoResizeChat(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 80) + 'px';
}

/* ─── Live Reach Counters ─── */
function startReachCounters() {
  CAMPAIGNS.forEach(function(c) {
    if (c.status !== 'running') return;
    if (campaignReachIntervals[c.id]) return;
    // Scale increment to ~0.4–0.8% of target per tick — realistic for any target size
    var baseInc = Math.max(5, Math.round(c.reachTarget * 0.005));
    campaignReachIntervals[c.id] = setInterval(function() {
      if (c.reach >= c.reachTarget) {
        clearInterval(campaignReachIntervals[c.id]);
        delete campaignReachIntervals[c.id];
        return;
      }
      var inc = Math.floor(Math.random() * baseInc) + Math.floor(baseInc * 0.4);
      c.reach = Math.min(c.reach + inc, c.reachTarget);
      var el = document.getElementById('reach-num-' + c.id);
      if (el) {
        el.textContent = formatReach(c.reach);
        el.style.color = '#111827';
        setTimeout(function() { el.style.color = ''; }, 400);
      }
      var pct = Math.min(100, Math.round((c.reach / c.reachTarget) * 100));
      var bar = document.getElementById('reach-bar-' + c.id);
      if (bar) bar.style.width = pct + '%';
    }, 3500 + Math.floor(Math.random() * 2000));
  });
}

function stopReachCounters() {
  Object.keys(campaignReachIntervals).forEach(function(id) {
    clearInterval(campaignReachIntervals[id]);
    delete campaignReachIntervals[id];
  });
}

/* ─── Notification Buttons (WA / Email) ─── */
function appendNotifButtons(campaignId, msgText) {
  var msgs = document.getElementById('chatMessages');
  if (!msgs) return;

  var campaign = null;
  for (var i = 0; i < CAMPAIGNS.length; i++) {
    if (CAMPAIGNS[i].id === campaignId) { campaign = CAMPAIGNS[i]; break; }
  }
  var campName  = campaign ? campaign.name : 'campaign';
  var plainText = msgText.replace(/<[^>]+>/g, '').replace(/\n/g, '\n');
  var waText    = encodeURIComponent('Panduan RADAR untuk campaign "' + campName + '":\n\n' + plainText);
  var emailSubj = encodeURIComponent('Panduan Manual Campaign: ' + campName);
  var emailBody = encodeURIComponent(plainText);

  var linksHTML =
    '<div class="notif-links">'
    + '<a href="https://wa.me/?text=' + waText + '" target="_blank" rel="noopener">'
    + '<svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>'
    + ' Kirim ke WhatsApp</a>'
    + '<a href="mailto:?subject=' + emailSubj + '&body=' + emailBody + '">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>'
    + ' Kirim ke Email</a>'
    + '</div>';

  // Inject ke dalam ai-bubble terakhir agar jadi satu kesatuan
  var bubbles = msgs.querySelectorAll('.ai-bubble');
  var lastBubble = bubbles[bubbles.length - 1];
  if (lastBubble) {
    lastBubble.insertAdjacentHTML('beforeend', linksHTML);
  }
  scrollChatToBottom();
}

/* ─── AdsPlatformAdapter (extensible for future API integration) ─── */
var AdsPlatformAdapter = {
  /* Set platform key to true after OAuth connected */
  connections: { meta: false, tiktok: false, google: false },
  isConnected: function(platform) {
    return this.connections[platform] || false;
  },
  execute: function(platform, action, params) {
    if (this.isConnected(platform)) {
      /* TODO: replace with real API call per platform
       * Meta:   META_API.campaigns.update(params)
       * TikTok: TIKTOK_API.campaigns.update(params)
       * Google: GOOGLE_ADS_API.campaigns.update(params)
       */
      return null;
    }
    return ManualGuideGenerator.generate(action, params);
  }
};

var ManualGuideGenerator = {
  generate: function(action, params) {
    return 'Panduan manual untuk ' + action + ' telah disiapkan di chat.';
  }
};

/* ─── Window exports ─── */
window.switchMenu = switchMenu;
