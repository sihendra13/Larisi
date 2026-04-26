// RADAR — analytics.js v2
// Analytics & Estimate Hub — "Laporan Bisnis" concept

/* ─────────────────────────────────────────
   A. buildAnalyticsPrompt(campaigns)
   Bangun prompt untuk Claude API dari data CAMPAIGNS
   ───────────────────────────────────────── */
function buildAnalyticsPrompt(campaigns) {
  var real = (campaigns || []).filter(function(c) { return !c.isDemo; });
  var total = real.length;

  var platCount  = {};
  var formatCount = {};
  var areas      = [];
  var totalReach = 0;
  var maxReachCamp = null;

  real.forEach(function(c) {
    (c.platforms || []).forEach(function(p) {
      platCount[p] = (platCount[p] || 0) + 1;
    });
    if (c.format) formatCount[c.format] = (formatCount[c.format] || 0) + 1;
    if (c.kecamatan) areas.push(c.kecamatan);
    var r = c.reachMax || c.reachTarget || 0;
    totalReach += r;
    if (!maxReachCamp || r > (maxReachCamp.reachMax || maxReachCamp.reachTarget || 0)) {
      maxReachCamp = c;
    }
  });

  var platNames = { ig: 'Instagram', tiktok: 'TikTok', meta: 'Facebook', youtube: 'YouTube' };
  var plats   = Object.keys(platCount).map(function(p) {
    return (platNames[p] || p) + ' (' + platCount[p] + 'x)';
  }).join(', ');
  var formats = Object.keys(formatCount).map(function(f) {
    return f + ' (' + formatCount[f] + ')';
  }).join(', ');
  var reachStr   = totalReach >= 1000 ? Math.round(totalReach / 1000) + 'rb' : String(totalReach);
  var topCamp    = maxReachCamp
    ? (maxReachCamp.name || maxReachCamp.nama_campaign || 'Campaign terbaru')
    : '—';
  var uniqueAreas = areas.filter(function(a, i) { return areas.indexOf(a) === i; }).join(', ');

  return 'Data campaign bisnis UMKM ini:\n' +
    '- Total campaign (termasuk demo): ' + campaigns.length + ', campaign nyata: ' + total + '\n' +
    '- Platform yang dipakai: ' + (plats || '—') + '\n' +
    '- Format konten: ' + (formats || '—') + '\n' +
    '- Area/lokasi: ' + (uniqueAreas || '—') + '\n' +
    '- Estimasi total reach: ' + reachStr + ' orang\n' +
    '- Campaign dengan reach tertinggi: ' + topCamp + '\n\n' +
    'Buatkan laporan bisnis dalam format JSON yang diminta.';
}

/* ─────────────────────────────────────────
   B. fetchAIStory(campaigns, promptText)
   Panggil Anthropic API → parse JSON → fallback jika error
   promptText boleh dipasskan langsung dari renderAnalytics()
   agar tidak build ulang — jika tidak diisi, akan di-build di sini.
   ───────────────────────────────────────── */
async function fetchAIStory(campaigns, promptText) {
  // Gunakan prompt yang sudah dibangun, atau build baru jika tidak ada
  if (!promptText) {
    promptText = buildAnalyticsPrompt(campaigns);
  }
  console.log('[analytics] total campaigns loaded:', (campaigns || []).length);
  console.log('[analytics] prompt:', promptText.slice(0, 100));

  var systemPrompt =
    'Kamu adalah asisten bisnis untuk UMKM Indonesia.\n' +
    'Analisis performa campaign media sosial dan sampaikan\n' +
    'dalam bahasa Indonesia santai, hangat, mudah dimengerti\n' +
    'pemilik bisnis kecil. Jangan gunakan istilah teknis.\n' +
    'Jangan tampilkan angka mentah. Ceritakan seperti teman\n' +
    'yang paham bisnis.\n\n' +
    'Format response HARUS JSON seperti ini tanpa markdown:\n' +
    '{\n' +
    '  "cerita": "narasi 2-3 kalimat tentang performa",\n' +
    '  "insight": [\n' +
    '    "insight 1 actionable dan spesifik",\n' +
    '    "insight 2 actionable dan spesifik"\n' +
    '  ],\n' +
    '  "rekomendasi": [\n' +
    '    {\n' +
    '      "judul": "judul aksi pendek",\n' +
    '      "deskripsi": "penjelasan 1 kalimat",\n' +
    '      "cta": "teks tombol aksi"\n' +
    '    }\n' +
    '  ],\n' +
    '  "semangat": "1 kalimat motivasi untuk pemilik bisnis"\n' +
    '}';

  // Panggil via Supabase proxy (anthropic-proxy Edge Function)
  // Proxy perlu di-deploy dulu di Supabase — kalau belum ada, return manual summary
  var supabaseUrl = (typeof RADAR_CONFIG !== 'undefined') ? RADAR_CONFIG.SUPABASE_URL      : '';
  var supabaseKey = (typeof RADAR_CONFIG !== 'undefined') ? RADAR_CONFIG.SUPABASE_ANON_KEY : '';

  if (supabaseUrl && supabaseKey) {
    try {
      var resp = await fetch(supabaseUrl + '/functions/v1/anthropic-proxy', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: 'user', content: promptText }]
        })
      });

      if (resp.ok) {
        var raw = await resp.json();
        console.log('[analytics] API response:', raw);
        var text = raw.content && raw.content[0] && raw.content[0].text;
        if (text) {
          text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          var parsed = JSON.parse(text);
          if (parsed && parsed.cerita) return parsed;
        }
      } else {
        console.warn('[analytics] proxy status:', resp.status, resp.statusText);
      }
    } catch (e) {
      console.warn('[analytics] proxy error:', e.message);
    }
  } else {
    console.warn('[analytics] SUPABASE_URL/KEY tidak tersedia');
  }

  // Proxy belum deploy atau gagal — tampilkan manual summary
  console.log('[analytics] API response: proxy belum tersedia, tampilkan manual summary');
  return _buildManualSummary(campaigns);
}

/* ─────────────────────────────────────────
   _buildFallbackStory(campaigns)
   Data fallback yang dinamis berdasarkan CAMPAIGNS array
   ───────────────────────────────────────── */
function _buildFallbackStory(campaigns) {
  var real = (campaigns || []).filter(function(c) { return !c.isDemo; });
  var cnt  = real.length;

  var totalReach = real.reduce(function(s, c) {
    return s + (c.reachMax || c.reachTarget || 0);
  }, 0);
  var reachStr = totalReach >= 1000
    ? Math.round(totalReach / 1000) + 'rb'
    : String(totalReach);

  var platCount = {};
  real.forEach(function(c) {
    (c.platforms || []).forEach(function(p) {
      platCount[p] = (platCount[p] || 0) + 1;
    });
  });
  var topPlat = Object.keys(platCount).sort(function(a, b) {
    return platCount[b] - platCount[a];
  })[0] || 'ig';
  var platNames   = { ig: 'Instagram', tiktok: 'TikTok', meta: 'Facebook', youtube: 'YouTube' };
  var topPlatName = platNames[topPlat] || topPlat;

  var areas      = real.map(function(c) { return c.kecamatan; }).filter(Boolean);
  var uniqueArea = areas.length ? areas[0] : 'area target';

  return {
    cerita: 'Kamu sudah punya ' + cnt + ' campaign aktif dengan potensi jangkauan sekitar ' + reachStr +
      ' orang di ' + uniqueArea + '! Ini langkah yang bagus — konsistensi adalah kunci supaya algoritma ' +
      'media sosial semakin mengenal dan mendukung bisnismu.',
    insight: [
      'Platform paling aktif kamu adalah ' + topPlatName + '. Terus fokus di sini untuk membangun momentum yang lebih kuat.',
      'Konten dengan sapaan lokal terbukti meningkatkan durasi tonton. Manfaatkan fitur Smart Geo Stitching RADAR!'
    ],
    rekomendasi: [
      {
        judul: 'Tambah Campaign Baru',
        deskripsi: 'Momentum terbaik adalah sekarang — buat campaign berikutnya selagi audiens masih hangat.',
        cta: 'Buat Campaign →'
      },
      {
        judul: 'Eksplorasi Platform Baru',
        deskripsi: topPlat !== 'tiktok'
          ? 'TikTok punya reach organik tertinggi untuk bisnis lokal. Coba publish ke sana sekarang!'
          : 'Instagram Reels adalah channel visual terkuat kedua untuk menjangkau pelanggan baru di sekitar kamu.',
        cta: topPlat !== 'tiktok' ? 'Coba TikTok →' : 'Coba Instagram →'
      }
    ],
    semangat: 'Kamu sudah selangkah lebih maju dari pesaing yang belum mulai. Terus semangat dan konsisten! 💪'
  };
}

/* ─────────────────────────────────────────
   waitForCampaigns(callback)
   Poll window.CAMPAIGNS sampai terisi,
   lalu panggil callback(campaigns).
   ───────────────────────────────────────── */
function waitForCampaigns(callback) {
  if (window.CAMPAIGNS && window.CAMPAIGNS.length > 0) {
    console.log('[analytics] waitForCampaigns: ready, campaigns:', window.CAMPAIGNS.length);
    callback(window.CAMPAIGNS);
  } else {
    console.log('[analytics] waitForCampaigns: belum siap, retry in 500ms...');
    setTimeout(function() {
      waitForCampaigns(callback);
    }, 500);
  }
}

/* ─────────────────────────────────────────
   _buildManualSummary(campaigns)
   Summary manual saat Supabase proxy belum deploy
   ───────────────────────────────────────── */
function _buildManualSummary(campaigns) {
  var platCount    = {};
  var totalViews   = 0;
  var totalReact   = 0;
  var bestCamp     = null;
  var bestScore    = -1;

  campaigns.forEach(function(c) {
    (c.platforms || []).forEach(function(p) {
      platCount[p] = (platCount[p] || 0) + 1;
    });
    totalViews += (c.reach || 0);
    // sparkData = engagement history; ambil nilai tertinggi sebagai proxy reactions
    var sparkPeak = (c.sparkData && c.sparkData.length)
      ? Math.max.apply(null, c.sparkData)
      : 0;
    totalReact += sparkPeak;
    if (sparkPeak > bestScore) {
      bestScore = sparkPeak;
      bestCamp  = c;
    }
  });

  var platNames   = { ig: 'Instagram', tiktok: 'TikTok', meta: 'Facebook', youtube: 'YouTube' };
  var topPlat     = Object.keys(platCount).sort(function(a, b) {
    return platCount[b] - platCount[a];
  })[0] || '—';
  var topPlatName = platNames[topPlat] || topPlat;
  var bestName    = bestCamp ? (bestCamp.name || bestCamp.nama_campaign || '—') : '—';

  var fmt = function(n) {
    return n >= 1000 ? Math.round(n / 1000) + 'rb' : String(n);
  };

  return {
    cerita: 'Fitur AI Story akan aktif setelah deploy. Sementara ini, berikut ringkasan campaign kamu:',
    insight: [
      'Total campaign: ' + campaigns.length,
      'Platform terbanyak: ' + topPlatName,
      'Total views: ' + fmt(totalViews),
      'Total reactions: ' + fmt(totalReact),
      'Campaign terbaik: ' + bestName
    ],
    rekomendasi: [],
    semangat: ''
  };
}

/* ─────────────────────────────────────────
   C. renderAnalytics()
   Render seluruh "Laporan Bisnis" ke view-analytics
   Flow: skeleton dulu → waitForCampaigns → build prompt → fetch → render
   ───────────────────────────────────────── */
function renderAnalytics() {
  var container = document.getElementById('view-analytics');
  if (!container) return;

  // Format tanggal Indonesia
  var today  = new Date();
  var days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  var months = ['Januari','Februari','Maret','April','Mei','Juni','Juli',
                'Agustus','September','Oktober','November','Desember'];
  var dateStr = days[today.getDay()] + ', ' + today.getDate() + ' ' +
    months[today.getMonth()] + ' ' + today.getFullYear();

  // Step 3 — Render skeleton + empty sections dulu (langsung tampil)
  container.innerHTML =
    '<div id="an-story-container">' +

    /* S1 — Greeting */
    '<div class="an-greeting-card">' +
      '<div class="an-greeting-emoji">👋</div>' +
      '<div>' +
        '<div class="an-greeting-title">Halo! Ini laporan bisnis kamu</div>' +
        '<div class="an-greeting-date">' + dateStr + '</div>' +
      '</div>' +
    '</div>' +

    /* S2 — Loading skeleton */
    '<div id="an-loading-card" class="an-story-card">' +
      '<div class="an-loading-row">' +
        '<div class="an-skeleton-circle"></div>' +
        '<div class="an-skeleton-line" style="width:55%;height:14px;"></div>' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:8px;">' +
        '<div class="an-skeleton-line" style="width:100%;height:12px;"></div>' +
        '<div class="an-skeleton-line" style="width:88%;height:12px;"></div>' +
        '<div class="an-skeleton-line" style="width:72%;height:12px;"></div>' +
      '</div>' +
      '<div class="an-loading-label">Sedang membaca campaign kamu...</div>' +
    '</div>' +

    /* S3 — Cerita (hidden until fetch done) */
    '<div id="an-cerita-card" class="an-story-card" style="display:none;flex-direction:column;gap:12px;">' +
      '<div class="an-section-header">' +
        '<span class="an-section-icon">📖</span>' +
        '<span class="an-section-title">Cerita Hari Ini</span>' +
      '</div>' +
      '<p id="an-cerita-text" class="an-cerita-text"></p>' +
    '</div>' +

    /* S4 — Insights */
    '<div id="an-insights-card" class="an-story-card" style="display:none;flex-direction:column;gap:12px;">' +
      '<div class="an-section-header">' +
        '<span class="an-section-icon">💡</span>' +
        '<span class="an-section-title">Yang Menarik</span>' +
      '</div>' +
      '<div id="an-insights-list" class="an-insights-list"></div>' +
    '</div>' +

    /* S5 — Rekomendasi */
    '<div id="an-rekom-card" class="an-story-card" style="display:none;flex-direction:column;gap:12px;">' +
      '<div class="an-section-header">' +
        '<span class="an-section-icon">🎯</span>' +
        '<span class="an-section-title">Langkah Berikutnya</span>' +
      '</div>' +
      '<div id="an-rekom-list" class="an-rekom-list"></div>' +
    '</div>' +

    /* S6 — Semangat */
    '<div id="an-semangat-card" class="an-story-card an-semangat-card" style="display:none;">' +
      '<p id="an-semangat-text" class="an-semangat-text"></p>' +
    '</div>' +

    /* S7 — Upgrade CTA */
    '<div class="an-upgrade-card">' +
      '<div class="an-upgrade-content">' +
        '<div class="an-upgrade-icon">🚀</div>' +
        '<div>' +
          '<div class="an-upgrade-title">Mau hasil lebih maksimal? Upgrade ke Pro</div>' +
          '<div class="an-upgrade-sub">Unlock AI insights lengkap, benchmark kategori, dan export laporan PDF.</div>' +
        '</div>' +
      '</div>' +
      '<button class="an-upgrade-btn" onclick="showPricingModal()">Lihat Paket</button>' +
    '</div>' +

    '</div>'; /* /an-story-container */

  // Step 4 — Skeleton sudah tampil di layar
  // Step 1+2 — Tunggu CAMPAIGNS terisi (poll 500ms), lalu cek + build prompt + fetch
  waitForCampaigns(function(campaigns) {
    console.log('[analytics] total campaigns loaded:', campaigns.length);

    // Cek empty state: semua campaign tidak punya post_id (belum pernah publish)
    var hasPublished = campaigns.some(function(c) { return !!c.post_id; });
    if (!campaigns.length || !hasPublished) {
      var loadCard = document.getElementById('an-loading-card');
      if (loadCard) loadCard.style.display = 'none';

      var storyWrap = document.getElementById('an-story-container');
      if (storyWrap) {
        // Sisipkan empty state setelah greeting, sebelum upgrade card
        var upgradeCard = storyWrap.querySelector('.an-upgrade-card');
        var emptyDiv = document.createElement('div');
        emptyDiv.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:calc(100vh - 160px);';
        emptyDiv.innerHTML =
          '<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;max-width:400px;">' +
            '<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
              '<circle cx="60" cy="60" r="50" fill="#f5f3ff"/>' +
              '<rect x="30" y="75" width="12" height="20" rx="3" fill="#e9d5ff"/>' +
              '<rect x="48" y="60" width="12" height="35" rx="3" fill="#c4b5fd"/>' +
              '<rect x="66" y="45" width="12" height="50" rx="3" fill="#7c3aed"/>' +
              '<path d="M28 40 Q45 25 60 35 Q75 45 88 28" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round" fill="none" stroke-dasharray="4 3"/>' +
            '</svg>' +
            '<h3 style="font-size:18px;font-weight:600;color:#1a1a2e;margin:0;font-family:var(--font,sans-serif);">Belum ada data untuk dianalisis</h3>' +
            '<p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0;font-family:var(--font,sans-serif);">Mulai dengan launch campaign pertamamu. AI akan langsung analisis performa dan kasih rekomendasi terbaik untukmu!</p>' +
            '<button onclick="switchMenu(\'command\')" class="an-empty-cta">🚀 Buat Campaign Pertama</button>' +
          '</div>';
        if (upgradeCard) {
          storyWrap.insertBefore(emptyDiv, upgradeCard);
        } else {
          storyWrap.appendChild(emptyDiv);
        }
      }
      return; // jangan fetch AI jika belum ada data
    }

    // Step 2 — Build prompt dari data real
    var prompt = buildAnalyticsPrompt(campaigns);
    console.log('[analytics] prompt:', prompt.slice(0, 100));

    // Step 5 — Fetch via Supabase proxy
    fetchAIStory(campaigns, prompt).then(function(data) {
      // Step 6 — Render hasil ke UI
      console.log('[analytics] API response:', data);
      _updateAnalyticsUI(data);
    }).catch(function(err) {
      console.warn('[analytics] fetchAIStory error:', err);
      _updateAnalyticsUI(_buildManualSummary(campaigns));
    });
  });
}

/* ─────────────────────────────────────────
   _updateAnalyticsUI(data)
   Isi section S3–S6 setelah fetchAIStory selesai
   ───────────────────────────────────────── */
function _updateAnalyticsUI(data) {
  if (!data) return;

  // Sembunyikan skeleton
  var loadCard = document.getElementById('an-loading-card');
  if (loadCard) loadCard.style.display = 'none';

  // S3: Cerita
  var ceritaCard = document.getElementById('an-cerita-card');
  var ceritaText = document.getElementById('an-cerita-text');
  if (ceritaCard && ceritaText && data.cerita) {
    ceritaText.textContent = data.cerita;
    ceritaCard.style.display = 'flex';
  }

  // S4: Insights
  var insCard = document.getElementById('an-insights-card');
  var insList = document.getElementById('an-insights-list');
  if (insCard && insList && data.insight && data.insight.length) {
    insList.innerHTML = data.insight.map(function(ins) {
      return '<div class="an-insight-chip">' +
        '<span class="an-insight-bullet">💡</span>' +
        '<span class="an-insight-text">' + ins + '</span>' +
        '</div>';
    }).join('');
    insCard.style.display = 'flex';
  }

  // S5: Rekomendasi
  var rekCard = document.getElementById('an-rekom-card');
  var rekList = document.getElementById('an-rekom-list');
  if (rekCard && rekList && data.rekomendasi && data.rekomendasi.length) {
    rekList.innerHTML = data.rekomendasi.slice(0, 2).map(function(r) {
      return '<div class="an-rekom-item">' +
        '<div class="an-rekom-judul">' + r.judul + '</div>' +
        '<div class="an-rekom-desc">' + r.deskripsi + '</div>' +
        '<button class="an-rekom-btn" onclick="switchMenu(\'command\')">' + r.cta + '</button>' +
        '</div>';
    }).join('');
    rekCard.style.display = 'flex';
  }

  // S6: Semangat
  var semCard = document.getElementById('an-semangat-card');
  var semText = document.getElementById('an-semangat-text');
  if (semCard && semText && data.semangat) {
    semText.textContent = data.semangat;
    semCard.style.display = 'flex';
  }
}

/* ─────────────────────────────────────────
   D. showPricingModal()
   Modal overlay 4 plan pricing
   ───────────────────────────────────────── */
function showPricingModal() {
  var existing = document.getElementById('an-pricing-modal');
  if (existing) { existing.style.display = 'flex'; return; }

  var modal = document.createElement('div');
  modal.id = 'an-pricing-modal';
  modal.className = 'an-pricing-overlay';

  modal.innerHTML =
    '<div class="an-pricing-sheet">' +

    /* Header */
    '<div class="an-pricing-header">' +
      '<div>' +
        '<div class="an-pricing-title">Pilih Paket RADAR</div>' +
        '<div class="an-pricing-subtitle">Mulai gratis, upgrade kapan saja</div>' +
      '</div>' +
      '<button class="an-pricing-close" onclick="closePricingModal()">✕</button>' +
    '</div>' +

    '<div class="an-pricing-cards">' +

    /* 1: Freemium */
    '<div class="an-pricing-card">' +
      '<div class="an-pc-top">' +
        '<div class="an-pc-name">Freemium</div>' +
        '<div class="an-pc-price">Gratis <span class="an-pc-period">selamanya</span></div>' +
      '</div>' +
      '<ul class="an-pc-features">' +
        '<li>10 AI Launch/bulan</li>' +
        '<li>AI Vision &amp; Master Persona</li>' +
        '<li>4 channel publishing</li>' +
        '<li>Geo-Radar Targeting</li>' +
        '<li>Smart Geo Stitching</li>' +
      '</ul>' +
      '<button class="an-pc-btn an-pc-btn-outline" onclick="closePricingModal()">Mulai Freemium</button>' +
    '</div>' +

    /* 2: Starter */
    '<div class="an-pricing-card">' +
      '<div class="an-pc-top">' +
        '<div class="an-pc-name">Starter</div>' +
        '<div class="an-pc-price">Rp 99rb <span class="an-pc-period">/bulan</span></div>' +
        '<div class="an-pc-badge-free">Coba 7 hari gratis</div>' +
      '</div>' +
      '<ul class="an-pc-features">' +
        '<li>50 AI Launch/bulan</li>' +
        '<li>Semua fitur Freemium</li>' +
        '<li>Dedicated Generate</li>' +
      '</ul>' +
      '<button class="an-pc-btn an-pc-btn-outline" onclick="closePricingModal()">Coba Gratis 7 Hari</button>' +
    '</div>' +

    /* 3: Pro (highlight) */
    '<div class="an-pricing-card an-pricing-card-pro">' +
      '<div class="an-pc-top">' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div class="an-pc-name">Pro</div>' +
          '<div class="an-pc-badge-popular">Paling Populer</div>' +
        '</div>' +
        '<div class="an-pc-price">Rp 199rb <span class="an-pc-period">/bulan</span></div>' +
        '<div class="an-pc-badge-free">Coba 7 hari gratis</div>' +
      '</div>' +
      '<ul class="an-pc-features">' +
        '<li>Unlimited AI Launch</li>' +
        '<li>Semua fitur Starter</li>' +
        '<li>Dedicated Generate</li>' +
      '</ul>' +
      '<button class="an-pc-btn an-pc-btn-pro" onclick="closePricingModal()">Coba Gratis 7 Hari</button>' +
    '</div>' +

    /* 4: Enterprise */
    '<div class="an-pricing-card">' +
      '<div class="an-pc-top">' +
        '<div class="an-pc-name">Enterprise</div>' +
        '<div class="an-pc-price">Custom</div>' +
      '</div>' +
      '<ul class="an-pc-features">' +
        '<li>Unlimited AI Launch</li>' +
        '<li>Multi-akun klien</li>' +
        '<li>White-label dashboard</li>' +
        '<li>Dedicated support</li>' +
      '</ul>' +
      '<button class="an-pc-btn an-pc-btn-dark" onclick="closePricingModal()">Hubungi Kami</button>' +
    '</div>' +

    '</div>' + /* /an-pricing-cards */
    '</div>';  /* /an-pricing-sheet */

  document.body.appendChild(modal);

  // Tutup saat klik overlay
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closePricingModal();
  });
}

function closePricingModal() {
  var modal = document.getElementById('an-pricing-modal');
  if (modal) modal.style.display = 'none';
}
window.closePricingModal = closePricingModal;

/* ─────────────────────────────────────────
   initAnalytics() — entry point dari switchMenu
   ───────────────────────────────────────── */
function initAnalytics() {
  renderAnalytics();
}

/* ─────────────────────────────────────────
   Backward compat — fungsi lama yang masih
   mungkin dipanggil dari index.html lama
   ───────────────────────────────────────── */
function handleExport() { exportPDF(); }
function handleUpgrade() { showPricingModal(); }

/* ─────────────────────────────────────────
   exportPDF() — tetap tersedia
   ───────────────────────────────────────── */
async function exportPDF() {
  try {
    var jsPDFLib = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!jsPDFLib) { console.warn('[analytics] jsPDF tidak tersedia'); return; }

    var doc = new jsPDFLib();
    var y = 20; var lh = 7;
    var now = new Date();
    var camps = (typeof CAMPAIGNS !== 'undefined') ? CAMPAIGNS.filter(function(c) { return !c.isDemo; }) : [];

    doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
    doc.text('RADAR — Laporan Bisnis', 20, y); y += 10;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(100);
    doc.text('Dibuat: ' + now.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }), 20, y); y += 12;

    if (camps.length) {
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
      doc.text('Campaign Aktif (' + camps.length + ')', 20, y); y += lh;
      camps.slice(0, 10).forEach(function(c) {
        if (y > 255) { doc.addPage(); y = 20; }
        doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
        doc.text(c.name || c.nama_campaign || 'Campaign', 20, y); y += lh - 1;
        doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(80);
        doc.text('Platform: ' + (c.platforms || []).join(', ') + ' · Area: ' + (c.kecamatan || '—'), 22, y);
        y += lh + 1;
      });
    }

    doc.setFontSize(8); doc.setTextColor(150);
    doc.text('Dibuat oleh RADAR · radar.id', 20, 285);

    var dateFormatted = now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    doc.save('radar-laporan-' + dateFormatted + '.pdf');
  } catch(e) {
    console.error('[analytics] exportPDF error:', e);
  }
}
