// RADAR — analytics.js v3
// Analytics Dashboard — SiLaris Analytics Hub
// Full dashboard: narasi, stat cards, campaign terbaik, mood, local pulse, platform, rekomendasi, competitor, upgrade

/* ─── Format Helpers ─── */
function _anFmtK(n) {
  if (n == null || isNaN(n) || n === 0) return '—';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return Math.round(n / 1000) + 'K';
  return String(Math.round(n));
}
function _anFmtPct(v) {
  if (v == null || isNaN(v)) return '—';
  return parseFloat(v).toFixed(1) + '%';
}

/* ─── Platform Config ─── */
var _AN_PLAT = {
  ig:      { name: 'Instagram', color: '#E1306C' },
  meta:    { name: 'Facebook',  color: '#1877F2' },
  tiktok:  { name: 'TikTok',    color: '#010101' },
  youtube: { name: 'YouTube',   color: '#FF0000' }
};

/* ─── Platform SVGs ─── */
function _anPlatSvg(key) {
  var svgs = {
    ig:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    meta:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/></svg>',
    youtube:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3 3 0 00-2.12-2.13C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.56A3 3 0 00.5 6.19C0 8.03 0 12 0 12s0 3.97.5 5.81a3 3 0 002.12 2.12C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.57a3 3 0 002.12-2.12C24 15.97 24 12 24 12s0-3.97-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>'
  };
  return svgs[key] || '';
}

/* ─── Skeleton Span ─── */
function _anSk(w, h) {
  return '<span class="an-sk" style="width:' + w + ';height:' + h + 'px;display:inline-block;"></span>';
}
function _anSkBlock(w, h) {
  return '<div class="an-sk" style="width:' + w + ';height:' + h + 'px;"></div>';
}

/* ─── Aggregate Campaign Data ─── */
function _anAggregate(campaigns) {
  var real = (campaigns || []).filter(function(c) { return !c.isDemo; });
  var totalReach = 0, totalPaidReach = 0, activeCount = 0;
  var erValues = [], bestCamp = null, bestER = -1;
  var platStats = {};
  var rLove = 0, rLike = 0, rHaha = 0, rWow = 0;
  var hourBuckets = new Array(24).fill(0);
  var dayBuckets  = new Array(7).fill(0);
  var stitchCandidates = [];
  var formatCount = {};

  real.forEach(function(c) {
    if (c.status === 'running') activeCount++;

    var eng = c._engagement || {};
    var reach = (eng.reach != null ? eng.reach : 0) || c.reach || c.reachMax || c.reachTarget || 0;
    totalReach += reach;
    totalPaidReach += (eng.paidReach || 0);

    var er = parseFloat(eng.engagementRate) || 0;
    if (er > 0) {
      erValues.push(er);
      if (er > bestER) { bestER = er; bestCamp = c; }
    }

    rLove += (eng.reactionsLove || 0);
    rHaha += (eng.reactionsHaha || 0);
    rWow  += (eng.reactionsWow  || 0);
    var totalLikes = eng.likes || 0;
    rLike += Math.max(0, totalLikes - (eng.reactionsLove || 0) - (eng.reactionsHaha || 0) - (eng.reactionsWow || 0));

    (c.platforms || []).forEach(function(p) {
      if (!platStats[p]) platStats[p] = { count: 0, erTotal: 0, erCount: 0 };
      platStats[p].count++;
      if (er > 0) { platStats[p].erTotal += er; platStats[p].erCount++; }
    });

    var fmt = eng.format || c.format || 'post';
    formatCount[fmt] = (formatCount[fmt] || 0) + 1;

    var ts = c.created_at ? new Date(c.created_at) : null;
    if (ts) { hourBuckets[ts.getHours()]++; dayBuckets[ts.getDay()]++; }

    var caption = eng.caption || c.caption || '';
    if (caption && er > 0) {
      stitchCandidates.push({ text: caption, er: er, campaign: c });
    }
  });

  var avgER = erValues.length
    ? erValues.reduce(function(s, v) { return s + v; }, 0) / erValues.length
    : null;

  var maxHourCount = Math.max.apply(null, hourBuckets);
  var bestHour = maxHourCount > 0 ? hourBuckets.indexOf(maxHourCount) : 19;
  var dayNames  = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  var maxDayCount = Math.max.apply(null, dayBuckets);
  var bestDayIdx  = maxDayCount > 0 ? dayBuckets.indexOf(maxDayCount) : 2;

  stitchCandidates.sort(function(a, b) { return b.er - a.er; });

  var platList = Object.keys(platStats).map(function(p) {
    var s = platStats[p];
    return { key: p, count: s.count, avgER: s.erCount > 0 ? s.erTotal / s.erCount : 0 };
  }).sort(function(a, b) { return b.avgER - a.avgER || b.count - a.count; });

  var topFmt = Object.keys(formatCount).sort(function(a, b) { return formatCount[b] - formatCount[a]; })[0] || 'post';
  var fmtLabels = { reel: 'Video Reel', post: 'Foto dengan teks', story: 'Story 9:16' };

  var totalReact = rLove + rLike + rHaha + rWow;
  var moodData = [
    { emoji: '❤️', label: 'Love',  count: rLove, color: '#ef4444' },
    { emoji: '👍', label: 'Like',  count: Math.max(0, rLike), color: '#3b82f6' },
    { emoji: '😂', label: 'Haha',  count: rHaha, color: '#f59e0b' },
    { emoji: '😮', label: 'Wow',   count: rWow,  color: '#8b5cf6' }
  ];

  return {
    total: real.length,
    active: activeCount,
    totalReach: totalReach,
    totalPaidReach: totalPaidReach,
    avgER: avgER,
    bestCamp: bestCamp,
    bestER: bestER,
    platList: platList,
    moodData: moodData,
    totalReact: totalReact,
    hasMoodData: totalReact > 0,
    bestHour: bestHour,
    bestDay: dayNames[bestDayIdx],
    topFormat: fmtLabels[topFmt] || topFmt,
    stitchCandidates: stitchCandidates.slice(0, 3)
  };
}

/* ─── Build Analytics System Prompt ─── */
function _buildAnalyticsSystemPrompt(agg) {
  var ctx = (typeof buildSilarisContext === 'function') ? buildSilarisContext() : { greeting: 'Hei!', regionLabel: 'Indonesia' };
  var platSummary = agg.platList.map(function(p) {
    var pn = (_AN_PLAT[p.key] || {}).name || p.key;
    return pn + ': ' + p.count + ' campaign' + (p.avgER > 0 ? ', avg ER ' + p.avgER.toFixed(1) + '%' : '');
  }).join('; ') || '—';

  return [
    'Kamu adalah SiLaris, Campaign Coach AI yang semangat dan inspiratif untuk bisnis lokal Indonesia.',
    'MODE: ANALYTICS DASHBOARD — analisa agregat SEMUA campaign user, bukan chat per campaign.',
    '',
    'KONTEKS USER:',
    '- Region: ' + ctx.regionLabel,
    '- Sapaan khas: ' + ctx.greeting,
    '',
    'DATA AGREGAT:',
    '- Total campaign: ' + agg.total,
    '- Campaign aktif: ' + agg.active,
    '- Total reach: ' + _anFmtK(agg.totalReach),
    '- Avg engagement rate: ' + (agg.avgER != null ? agg.avgER.toFixed(1) + '%' : 'belum tersedia'),
    '- Paid reach: ' + _anFmtK(agg.totalPaidReach),
    '- Campaign terkuat: ' + (agg.bestCamp ? agg.bestCamp.name + ' (ER: ' + agg.bestER.toFixed(1) + '%)' : '—'),
    '- Platform: ' + platSummary,
    '- Jam posting paling sering: ' + String(agg.bestHour).padStart(2,'0') + ':00',
    '- Hari posting paling sering: ' + agg.bestDay,
    '- Format dominan: ' + agg.topFormat,
    '',
    'TUGAS: Buat response JSON persis berikut ini (tanpa markdown, tanpa teks di luar JSON):',
    '{',
    '  "narasi": "sapaan \'Hei!\' + rekap performa 2-3 kalimat coach style, sebut angka relevan, semangat dan personal",',
    '  "clue_potensi": "1 kalimat singkat tentang potensi penjualan dari pola campaign yang ada",',
    '  "clue_todo": "1 kalimat actionable konkret paling penting untuk dilakukan sekarang",',
    '  "mood_insight": "1 kalimat insight bagaimana audiens merespons konten secara keseluruhan",',
    '  "platform_insight": "1 kalimat tentang platform mana yang underutilized atau peluang terbesar",',
    '  "stitch_insight": "1 kalimat pola terkuat dari stitching text yang paling engage",',
    '  "rekomendasi": [',
    '    {"platform": "ig", "hari": "Selasa", "jam": "19:00", "aksi": "langkah spesifik dengan konteks nyata", "alasan": "kenapa efektif dikaitkan data"},',
    '    {"platform": "meta", "hari": "Rabu", "jam": "12:00", "aksi": "...", "alasan": "..."},',
    '    {"platform": "tiktok", "hari": "Jumat", "jam": "20:00", "aksi": "...", "alasan": "..."}',
    '  ],',
    '  "rekom_cta": "Buat campaign [nama spesifik] sekarang →"',
    '}'
  ].join('\n');
}

/* ─── Call SiLaris for Analytics ─── */
async function _callSilarisAnalytics(agg) {
  var supabaseUrl = (typeof RADAR_CONFIG !== 'undefined' && RADAR_CONFIG.SUPABASE_URL) || '';
  var supabaseKey = (typeof RADAR_CONFIG !== 'undefined' && RADAR_CONFIG.SUPABASE_ANON_KEY) || '';
  if (!supabaseUrl) return null;

  try {
    var resp = await fetch(supabaseUrl + '/functions/v1/silaris-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + supabaseKey },
      body: JSON.stringify({
        systemPrompt: _buildAnalyticsSystemPrompt(agg),
        campaignData: { aggregate: true, total: agg.total, avgER: agg.avgER, active: agg.active },
        autoInsight: true,
        messages: []
      })
    });
    var data = await resp.json();
    if (data && data.reply) {
      var text = data.reply.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      var start = text.indexOf('{'), end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1) text = text.slice(start, end + 1);
      return JSON.parse(text);
    }
  } catch(e) {
    console.warn('[analytics] _callSilarisAnalytics error:', e);
  }
  return null;
}

/* ─── Analytics Fallback ─── */
function _buildAnalyticsFallback(agg) {
  return {
    narasi: 'Hei! Kamu sudah punya ' + agg.total + ' campaign' +
      (agg.avgER != null ? ' dengan rata-rata engagement rate ' + agg.avgER.toFixed(1) + '%.' : '.') +
      ' Konsistensi adalah kunci — terus semangat!',
    clue_potensi: 'Campaign organikmu sudah solid — amplify dengan boost kecil untuk hasil yang jauh lebih besar.',
    clue_todo: 'Publish 1 campaign baru minggu ini untuk menjaga momentum engagement.',
    mood_insight: 'Audiens kamu merespons dengan hangat — pertahankan tone dan format yang sudah terbukti.',
    platform_insight: 'Coba eksplorasi platform yang belum dipakai untuk menjangkau audiens baru.',
    stitch_insight: 'Sapaan lokal + teks overlay personal terbukti meningkatkan stop-the-scroll rate secara signifikan.',
    rekomendasi: [
      { platform: 'ig', hari: 'Selasa', jam: '19:00', aksi: 'Post Reel dengan hook 3 detik pertama yang kuat', alasan: 'Jam 7 malam = prime time engagement Instagram di Indonesia' },
      { platform: 'meta', hari: 'Rabu', jam: '12:00', aksi: 'Boost post terbaik dengan budget Rp 30rb selama 3 hari', alasan: 'Tengah hari Rabu adalah waktu tertinggi scrolling FB untuk audience dewasa' },
      { platform: 'tiktok', hari: 'Jumat', jam: '20:00', aksi: 'Upload video 15-30 detik dengan musik trending lokal', alasan: 'Jumat malam = puncak engagement TikTok sebelum weekend' }
    ],
    rekom_cta: 'Buat campaign baru sekarang →'
  };
}

/* ─── Section: SiLaris Narasi ─── */
function _renderSilarisNarasi() {
  return '<div class="an-si-card" id="an-si-section">' +
    '<div class="an-si-header">' +
      '<div class="an-si-avatar">' +
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>' +
      '</div>' +
      '<div>' +
        '<div class="an-si-name">SiLaris</div>' +
        '<div class="an-si-tag">Campaign Coach AI · Analytics Mode</div>' +
      '</div>' +
    '</div>' +
    '<div id="an-si-narasi-wrap" class="an-si-narasi">' +
      '<div style="display:flex;flex-direction:column;gap:6px;">' +
        _anSkBlock('75%', 14) + _anSkBlock('60%', 14) + _anSkBlock('45%', 14) +
      '</div>' +
    '</div>' +
    '<div class="an-si-clue-row">' +
      '<div class="an-si-clue">' +
        '<div class="an-si-clue-label">💰 Potensi Penjualan</div>' +
        '<div id="an-si-clue-potensi">' + _anSkBlock('95%', 11) + '<div style="margin-top:4px;">' + _anSkBlock('70%', 11) + '</div></div>' +
      '</div>' +
      '<div class="an-si-clue">' +
        '<div class="an-si-clue-label">✅ Yang Perlu Dilakukan</div>' +
        '<div id="an-si-clue-todo">' + _anSkBlock('95%', 11) + '<div style="margin-top:4px;">' + _anSkBlock('55%', 11) + '</div></div>' +
      '</div>' +
    '</div>' +
    '<button class="an-si-cta" onclick="switchMenu(\'command\')">Buat campaign baru sekarang →</button>' +
  '</div>';
}

/* ─── Section: Stat Cards Skeleton ─── */
function _renderStatCardsSkeleton() {
  return '<div class="kpi-row" id="an-sc-wrap">' +
    [0,1,2,3].map(function() {
      return '<div class="kpi-card">' +
        '<div class="kpi-label">' + _anSkBlock('55%', 9) + '</div>' +
        _anSkBlock('40%', 24) +
        '<div style="margin-top:6px;">' + _anSkBlock('75%', 10) + '</div>' +
      '</div>';
    }).join('') +
  '</div>';
}

/* ─── Section: Stat Cards Real ─── */
function _renderStatCards(agg) {
  function card(colorClass, label, val, sub, infoTip) {
    return '<div class="kpi-card ' + colorClass + '">' +
      '<div class="kpi-label">' + label + '<span class="kpi-info" title="' + infoTip + '">ⓘ</span></div>' +
      '<div class="kpi-value">' + val + '</div>' +
      '<div class="kpi-sub">' + sub + '</div>' +
    '</div>';
  }
  return '<div class="kpi-row" id="an-sc-wrap">' +
    card('purple', 'Total Reach',         _anFmtK(agg.totalReach),    'estimasi semua campaign',    'Estimasi total orang yang terpapar konten kamu') +
    card('green',  'Avg Engagement Rate', agg.avgER != null ? _anFmtPct(agg.avgER) : '—', agg.total + ' campaign',  'Rata-rata (likes+comments+shares) / reach × 100') +
    card('amber',  'Campaign Aktif',      String(agg.active),          'dari ' + agg.total + ' total', 'Campaign dengan status running') +
    card('blue',   'Paid Reach',          _anFmtK(agg.totalPaidReach),'total berbayar',              'Reach dari konten yang di-boost atau sponsored') +
  '</div>';
}

/* ─── Section: Two-Col Skeleton ─── */
function _renderTwoColSkeleton(id) {
  return '<div class="an-two-col" id="' + id + '">' +
    '<div class="an-white-card">' +
      '<div class="an-card-header">' + _anSkBlock('55%', 13) + '</div>' +
      '<div class="an-card-body">' +
        _anSkBlock('100%', 11) + '<div style="margin-top:6px;">' + _anSkBlock('80%', 11) + '</div>' +
        '<div style="margin-top:6px;">' + _anSkBlock('65%', 11) + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="an-white-card">' +
      '<div class="an-card-header">' + _anSkBlock('50%', 13) + '</div>' +
      '<div class="an-card-body">' +
        _anSkBlock('100%', 8) + '<div style="margin-top:7px;">' + _anSkBlock('100%', 8) + '</div>' +
        '<div style="margin-top:7px;">' + _anSkBlock('100%', 8) + '</div>' +
        '<div style="margin-top:7px;">' + _anSkBlock('90%', 8) + '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

/* ─── Skeleton: Single White Card ─── */
function _renderCardSkeleton(id) {
  return '<div class="an-white-card" id="' + id + '">' +
    '<div class="an-card-header">' + _anSkBlock('52%', 13) + '</div>' +
    '<div class="an-card-body">' +
      _anSkBlock('100%', 11) +
      '<div style="margin-top:8px;">' + _anSkBlock('85%', 11) + '</div>' +
      '<div style="margin-top:8px;">' + _anSkBlock('68%', 11) + '</div>' +
    '</div>' +
  '</div>';
}

/* ─── Section: Campaign Terbaik ─── */
function _renderCampaignBest(agg) {
  var bestCampHTML = '';
  if (agg.bestCamp) {
    var c = agg.bestCamp;
    var eng = c._engagement || {};
    var platLabel = (c.platforms || []).map(function(p) { return (_AN_PLAT[p] || {}).name || p; }).join(', ');
    var launchDate = c.launchTime || (c.created_at
      ? new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—');
    bestCampHTML =
      '<div class="an-best-camp">' +
        '<div class="an-camp-name">' + (c.name || '—') + '</div>' +
        '<div class="an-camp-meta">' +
          (platLabel ? '<span>' + platLabel + '</span><span style="color:var(--border);">·</span>' : '') +
          '<span>' + launchDate + '</span>' +
        '</div>' +
        '<div class="an-camp-badges">' +
          (agg.bestER > 0 ? '<span class="an-badge purple">ER ' + agg.bestER.toFixed(1) + '%</span>' : '') +
          (eng.reach    ? '<span class="an-badge green">Reach ' + _anFmtK(eng.reach) + '</span>' : '') +
          (eng.comments ? '<span class="an-badge blue">' + eng.comments + ' komentar</span>' : '') +
        '</div>' +
        '<div class="an-camp-note" id="an-best-note">Memuat insight...</div>' +
      '</div>';
  } else {
    bestCampHTML =
      '<div style="font-size:12px;color:var(--secondary);padding:12px 0;line-height:1.6;">' +
        'Belum ada data engagement. Kunjungi <strong>Campaign Monitor</strong> untuk memuat data performa.' +
      '</div>';
  }
  return '<div class="an-white-card" id="an-camp-wrap">' +
    '<div class="an-card-header">' +
      '<div class="an-card-icon">' +
        '<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>' +
      '</div>' +
      '<div><div class="an-card-title">Campaign Terbaik</div><div class="an-card-sub">performa tertinggi</div></div>' +
    '</div>' +
    '<div class="an-card-body">' + bestCampHTML + '</div>' +
  '</div>';
}

/* ─── Section: Mood Audiens ─── */
function _renderMoodAudiens(agg) {
  var moodHTML = '<div class="an-mood-grid">';
  var totalR = agg.totalReact;
  if (agg.hasMoodData && totalR > 0) {
    agg.moodData.forEach(function(m) {
      var pct = Math.round((m.count / totalR) * 100);
      moodHTML +=
        '<div class="an-mood-cell">' +
          '<span class="an-mood-cell-emoji">' + m.emoji + '</span>' +
          '<span class="an-mood-cell-pct">' + pct + '%</span>' +
          '<span class="an-mood-cell-label">' + m.label + '</span>' +
        '</div>';
    });
  } else {
    [['❤️','Love','—'],['👍','Like','—'],['😂','Haha','—'],['😮','Wow','—']].forEach(function(m) {
      moodHTML +=
        '<div class="an-mood-cell">' +
          '<span class="an-mood-cell-emoji">' + m[0] + '</span>' +
          '<span class="an-mood-cell-pct" style="color:var(--disabled);">' + m[2] + '</span>' +
          '<span class="an-mood-cell-label">' + m[1] + '</span>' +
        '</div>';
    });
  }
  moodHTML += '</div>';
  return '<div class="an-white-card" id="an-mood-wrap">' +
    '<div class="an-card-header">' +
      '<div class="an-card-icon">' +
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>' +
      '</div>' +
      '<div><div class="an-card-title">Mood Audiens Minggu Ini</div><div class="an-card-sub">breakdown reactions semua campaign</div></div>' +
    '</div>' +
    '<div class="an-card-body">' +
      moodHTML +
      '<div class="an-mood-insight" id="an-mood-insight">Memuat insight audiens...</div>' +
    '</div>' +
  '</div>';
}

/* ─── Stitch Previews ─── */
function _buildStitchPreviews(agg) {
  if (!agg.stitchCandidates || !agg.stitchCandidates.length) {
    return '<div style="font-size:11px;color:var(--secondary);padding:6px 0;line-height:1.5;">' +
      'Data akan muncul setelah campaign dengan caption berjalan.' +
    '</div>';
  }
  return agg.stitchCandidates.map(function(s) {
    var shortText = s.text.length > 32 ? s.text.slice(0, 32) + '…' : s.text;
    var platLabel = (s.campaign.platforms || []).map(function(p) { return (_AN_PLAT[p] || {}).name || p; }).join(', ');
    var thumb = s.campaign.thumbUrl && !s.campaign.thumbUrl.startsWith('blob:') ? s.campaign.thumbUrl : null;
    var thumbColor = s.campaign.thumbColor || '#791ADB';
    return '<div class="an-stitch-item">' +
      '<div class="an-stitch-thumb">' +
        (thumb
          ? '<img src="' + thumb + '" style="width:100%;height:100%;object-fit:cover;" />'
          : '<div style="width:100%;height:100%;background:' + thumbColor + ';"></div>') +
        '<div class="an-stitch-overlay">' + s.text.slice(0, 14) + '</div>' +
      '</div>' +
      '<div class="an-stitch-detail">' +
        '<div class="an-stitch-text">' + shortText + '</div>' +
        '<div class="an-stitch-er">ER ' + s.er.toFixed(1) + '% · ' + platLabel + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ─── Section: Local Pulse ─── */
function _renderLocalPulse(agg) {
  var ctx   = (typeof buildSilarisContext === 'function') ? buildSilarisContext() : null;
  var reg   = (typeof currentRegion !== 'undefined') ? currentRegion : 'default';
  var dial  = (typeof REGION_DIALEK !== 'undefined' && REGION_DIALEK[reg]) ? REGION_DIALEK[reg] : { greeting: 'Halo Sahabat!', cta: 'Cek Sekarang!' };
  var regLabel = ctx ? ctx.regionLabel : 'Indonesia';
  var hStart = String(agg.bestHour).padStart(2,'0');
  var hEnd   = String((agg.bestHour + 2) % 24).padStart(2,'0');
  var bestTimeStr = agg.total > 0 ? hStart + ':00 – ' + hEnd + ':00' : '19:00 – 21:00';

  var pulseHTML =
    '<div class="an-pulse-list">' +
    '<div class="an-pulse-item">' +
      '<div class="an-pulse-icon-wrap"><span>⏰</span></div>' +
      '<div><div class="an-pulse-key">Jam Terbaik Posting</div>' +
        '<div class="an-pulse-val">' + bestTimeStr + '</div>' +
        '<div class="an-pulse-note">Waktu dengan frekuensi publish tertinggi</div>' +
      '</div>' +
    '</div>' +
    '<div class="an-pulse-item">' +
      '<div class="an-pulse-icon-wrap"><span>📅</span></div>' +
      '<div><div class="an-pulse-key">Hari Terkuat</div>' +
        '<div class="an-pulse-val">' + agg.bestDay + '</div>' +
        '<div class="an-pulse-note">Hari dengan aktivitas campaign tertinggi</div>' +
      '</div>' +
    '</div>' +
    '<div class="an-pulse-item">' +
      '<div class="an-pulse-icon-wrap"><span>📍</span></div>' +
      '<div><div class="an-pulse-key">Sapaan Lokal Terbaik</div>' +
        '<div class="an-pulse-val">"' + dial.greeting + '"</div>' +
        '<div class="an-pulse-note">Sapaan khas <span class="an-pulse-highlight">' + regLabel + '</span> — terbukti meningkatkan engagement lokal</div>' +
      '</div>' +
    '</div>' +
    '<div class="an-pulse-item">' +
      '<div class="an-pulse-icon-wrap"><span>🎬</span></div>' +
      '<div><div class="an-pulse-key">Format Terbaik</div>' +
        '<div class="an-pulse-val" id="an-best-format">' + agg.topFormat + '</div>' +
        '<div class="an-pulse-note">Format dominan dari campaign aktif</div>' +
      '</div>' +
    '</div>' +
    '</div>' +
    '<div class="an-stitch-section">' +
      '<div class="an-stitch-title">Stitching Text Terbaik di Foto</div>' +
      '<div id="an-stitch-previews">' + _buildStitchPreviews(agg) + '</div>' +
      '<div class="an-stitch-insight" id="an-stitch-insight">Memuat pola terkuat...</div>' +
    '</div>';

  return '<div class="an-white-card" id="an-pulse-wrap">' +
    '<div class="an-card-header">' +
      '<div class="an-card-icon" style="background:linear-gradient(135deg,rgba(121,26,219,0.15),rgba(121,26,219,0.05));">' +
        '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
      '</div>' +
      '<div style="flex:1;"><div class="an-card-title">Local Pulse</div><div class="an-card-sub">pola lokal terbaik</div></div>' +
      '<span class="local-pulse-badge">LOKAL</span>' +
    '</div>' +
    '<div class="an-card-body">' + pulseHTML + '</div>' +
  '</div>';
}

/* ─── Section: Platform Terkuat ─── */
function _renderPlatformTerkuat(agg) {
  var platHTML = '<div class="an-plat-list">';
  if (agg.platList.length > 0) {
    agg.platList.forEach(function(p) {
      var cfg = _AN_PLAT[p.key] || { name: p.key, color: '#666' };
      platHTML +=
        '<div class="an-plat-row">' +
          '<div class="an-plat-icon ' + p.key + '" title="' + cfg.name + '">' + _anPlatSvg(p.key) + '</div>' +
          (p.avgER > 0 ? '<span class="an-plat-badge er">ER ' + p.avgER.toFixed(1) + '%</span>' : '') +
          '<span class="an-plat-badge count">' + p.count + ' campaign</span>' +
        '</div>';
    });
    ['ig','meta','tiktok'].forEach(function(p) {
      var inUse = agg.platList.some(function(pl) { return pl.key === p; });
      if (!inUse) {
        var cfg = _AN_PLAT[p];
        platHTML +=
          '<div class="an-plat-row" style="opacity:0.45;">' +
            '<div class="an-plat-icon ' + p + '" title="' + cfg.name + '">' + _anPlatSvg(p) + '</div>' +
            '<span class="an-plat-badge count" style="color:var(--disabled);">belum dipakai</span>' +
          '</div>';
      }
    });
  } else {
    platHTML += '<div style="font-size:12px;color:var(--secondary);padding:8px 0;">Belum ada data platform.</div>';
  }
  platHTML += '</div>';
  platHTML += '<div class="an-plat-insight" id="an-plat-insight">Memuat insight platform...</div>';

  return '<div class="an-white-card" id="an-plat-wrap">' +
    '<div class="an-card-header">' +
      '<div class="an-card-icon">' +
        '<svg viewBox="0 0 24 24"><rect x="18" y="3" width="4" height="18" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="2" y="13" width="4" height="8" rx="1"/></svg>' +
      '</div>' +
      '<div><div class="an-card-title">Platform Terkuat</div><div class="an-card-sub">engagement rate per platform</div></div>' +
    '</div>' +
    '<div class="an-card-body">' + platHTML + '</div>' +
  '</div>';
}

/* ─── Section: Rekomendasi Minggu Ini ─── */
function _renderRekomendasiWeek() {
  return '<div class="an-rekom-week-card" id="an-rekom-week-section">' +
    '<div class="an-rekom-week-header">' +
      '<div class="an-rekom-week-title"><span>🎯</span> Rekomendasi Minggu Ini</div>' +
    '</div>' +
    '<div class="an-rekom-week-body" id="an-rekom-week-body">' +
      [1,2,3].map(function(n) {
        return '<div class="an-rekom-step">' +
          '<div class="an-step-num">' + n + '</div>' +
          '<div class="an-step-content">' +
            '<div class="an-step-top">' + _anSkBlock('70px', 14) + '</div>' +
            '<div style="margin-top:5px;">' + _anSkBlock('100%', 10) + '</div>' +
            '<div style="margin-top:4px;">' + _anSkBlock('80%', 10) + '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>' +
    '<div class="an-rekom-week-cta">' +
      '<button class="an-rekom-week-cta-btn" id="an-rekom-cta-btn" onclick="switchMenu(\'command\')">Buat campaign baru sekarang →</button>' +
    '</div>' +
  '</div>';
}

/* ─── Section: Competitor Analysis ─── */
var _anCompActivePlatform = 'ig';

function _renderCompetitorSection() {
  return '<div class="an-comp-card">' +
    '<div class="an-comp-header">' +
      '<div class="an-comp-title"><span>🔍</span> Competitor Analysis</div>' +
    '</div>' +
    '<div class="an-comp-body">' +
      '<div class="an-comp-plat-tabs">' +
        '<button class="an-comp-plat-tab active" onclick="anSetCompPlatform(this,\'ig\')" data-plat="ig">Instagram</button>' +
        '<button class="an-comp-plat-tab" onclick="anSetCompPlatform(this,\'meta\')" data-plat="meta">Facebook</button>' +
        '<button class="an-comp-plat-tab" onclick="anSetCompPlatform(this,\'tiktok\')" data-plat="tiktok">TikTok</button>' +
      '</div>' +
      '<div class="an-comp-input-row">' +
        '<input class="an-comp-input" id="an-comp-input" placeholder="Paste link atau @handle pesaing..." />' +
        '<button class="an-comp-analyze-btn" id="an-comp-btn" onclick="anAnalyzeCompetitor()">Analisa →</button>' +
      '</div>' +
      '<div id="an-comp-result-area"></div>' +
      '<div class="an-comp-disclaimer">Estimasi berdasarkan data publik · bukan angka dashboard pesaing</div>' +
    '</div>' +
  '</div>';
}

/* ─── Section: Upgrade Pro ─── */
function _renderUpgradePro() {
  return '<div class="an-pro-banner">' +
    '<div class="an-pro-top">' +
      '<div class="an-pro-icon">🚀</div>' +
      '<div>' +
        '<div class="an-pro-title">Upgrade ke Pro — unlock semua insight</div>' +
        '<div class="an-pro-desc">Jadikan data jadi mesin pertumbuhan bisnis kamu — tanpa batas.</div>' +
      '</div>' +
    '</div>' +
    '<div class="an-pro-features">' +
      '<div class="an-pro-feature">Competitor analysis tanpa batas</div>' +
      '<div class="an-pro-feature">Data real-time per jam</div>' +
      '<div class="an-pro-feature">AI caption generator premium</div>' +
      '<div class="an-pro-feature">Export laporan PDF</div>' +
    '</div>' +
    '<button class="an-pro-cta" onclick="showPricingModal()">Coba Pro Gratis →</button>' +
  '</div>';
}

/* ─── Populate AI Sections ─── */
function _anPopulateAI(ai) {
  if (!ai) return;

  // Narasi
  var narasiWrap = document.getElementById('an-si-narasi-wrap');
  if (narasiWrap && ai.narasi) {
    narasiWrap.innerHTML = '<p style="margin:0;font-size:14px;line-height:1.7;color:var(--near-black);">' + ai.narasi + '</p>';
  }

  // Clue cards
  var cp = document.getElementById('an-si-clue-potensi');
  if (cp && ai.clue_potensi) cp.innerHTML = '<span class="an-si-clue-text">' + ai.clue_potensi + '</span>';
  var ct = document.getElementById('an-si-clue-todo');
  if (ct && ai.clue_todo) ct.innerHTML = '<span class="an-si-clue-text">' + ai.clue_todo + '</span>';

  // Mood insight
  var mi = document.getElementById('an-mood-insight');
  if (mi && ai.mood_insight) mi.textContent = ai.mood_insight;

  // Platform insight
  var pi = document.getElementById('an-plat-insight');
  if (pi && ai.platform_insight) pi.textContent = ai.platform_insight;

  // Stitch insight
  var si = document.getElementById('an-stitch-insight');
  if (si && ai.stitch_insight) si.textContent = ai.stitch_insight;

  // Best camp note
  var bn = document.getElementById('an-best-note');
  if (bn) bn.textContent = 'Campaign ini punya engagement rate tertinggi di antara semua campaign kamu — jadikan sebagai template untuk campaign berikutnya.';

  // Rekomendasi steps
  if (ai.rekomendasi && ai.rekomendasi.length) {
    var weekBody = document.getElementById('an-rekom-week-body');
    if (weekBody) {
      weekBody.innerHTML = ai.rekomendasi.slice(0, 3).map(function(r, i) {
        var pillCls  = r.platform || 'ig';
        var platName = (_AN_PLAT[r.platform] || {}).name || r.platform;
        return '<div class="an-rekom-step">' +
          '<div class="an-step-num">' + (i + 1) + '</div>' +
          '<div class="an-step-content">' +
            '<div class="an-step-top">' +
              '<span class="an-plat-pill ' + pillCls + '">' + platName + '</span>' +
              '<span class="an-step-action">' + (r.hari || '') + (r.jam ? ', ' + r.jam : '') + '</span>' +
            '</div>' +
            '<div class="an-step-desc">' + (r.aksi || '') + '</div>' +
            (r.alasan ? '<div class="an-step-reason">' + r.alasan + '</div>' : '') +
          '</div>' +
        '</div>';
      }).join('');
    }

    // CTA button text
    var ctaBtn = document.getElementById('an-rekom-cta-btn');
    if (ctaBtn && ai.rekom_cta) ctaBtn.textContent = ai.rekom_cta;
  }
}

/* ─── Competitor: Set Platform ─── */
function anSetCompPlatform(btn, platform) {
  _anCompActivePlatform = platform;
  var tabs = document.querySelectorAll('.an-comp-plat-tab');
  tabs.forEach(function(t) { t.classList.remove('active'); });
  btn.classList.add('active');
}
window.anSetCompPlatform = anSetCompPlatform;

/* ─── Competitor: Analyze ─── */
async function anAnalyzeCompetitor() {
  var input = document.getElementById('an-comp-input');
  var btn   = document.getElementById('an-comp-btn');
  var area  = document.getElementById('an-comp-result-area');
  if (!input || !area) return;

  var handle = input.value.trim();
  if (!handle) { input.focus(); input.style.borderColor = '#ef4444'; setTimeout(function() { input.style.borderColor = ''; }, 1500); return; }

  if (btn) { btn.disabled = true; btn.textContent = 'Menganalisa...'; }
  area.innerHTML =
    '<div class="an-comp-loading">' +
      '<div class="an-comp-loading-dots"><div class="an-comp-loading-dot"></div><div class="an-comp-loading-dot"></div><div class="an-comp-loading-dot"></div></div>' +
      '<span>Sedang menganalisa ' + handle + '...</span>' +
    '</div>';

  var agg = window._anLastAgg || { total: 0, active: 0, avgER: null, totalReach: 0 };
  var result = await _callSilarisCompetitor(handle, _anCompActivePlatform, agg);

  if (btn) { btn.disabled = false; btn.textContent = 'Analisa →'; }

  if (!result) {
    area.innerHTML = '<div style="font-size:12px;color:var(--secondary);padding:8px 0;">Gagal menganalisa. Pastikan koneksi internet stabil dan coba lagi.</div>';
    return;
  }

  var userER = agg.avgER ? agg.avgER.toFixed(1) : null;
  var compER = parseFloat(result.comp_er) || null;

  area.innerHTML =
    '<div class="an-comp-result">' +
    // Compare grid
    '<div class="an-comp-compare-grid">' +
      '<div class="an-comp-col">' +
        '<div class="an-comp-col-label">Kamu</div>' +
        (userER ? '<div class="an-comp-metric"><span class="an-comp-metric-key">Avg ER</span><span class="an-comp-metric-val accent">' + userER + '%</span></div>' : '') +
        '<div class="an-comp-metric"><span class="an-comp-metric-key">Campaign aktif</span><span class="an-comp-metric-val">' + agg.active + '</span></div>' +
        '<div class="an-comp-metric"><span class="an-comp-metric-key">Total reach</span><span class="an-comp-metric-val">' + _anFmtK(agg.totalReach) + '</span></div>' +
      '</div>' +
      '<div class="an-comp-col">' +
        '<div class="an-comp-col-label">Pesaing · ' + (result.comp_handle || handle) + '</div>' +
        (result.comp_er ? '<div class="an-comp-metric"><span class="an-comp-metric-key">Est. ER</span><span class="an-comp-metric-val">' + result.comp_er + '</span></div>' : '') +
        (result.comp_freq ? '<div class="an-comp-metric"><span class="an-comp-metric-key">Freq. posting</span><span class="an-comp-metric-val">' + result.comp_freq + '</span></div>' : '') +
        (result.comp_followers ? '<div class="an-comp-metric"><span class="an-comp-metric-key">Est. followers</span><span class="an-comp-metric-val">' + result.comp_followers + '</span></div>' : '') +
        (result.comp_format ? '<div class="an-comp-metric"><span class="an-comp-metric-key">Format dominan</span><span class="an-comp-metric-val">' + result.comp_format + '</span></div>' : '') +
      '</div>' +
    '</div>' +

    // ER Bar comparison
    (userER && compER ? (function() {
      var uVal = parseFloat(userER), cVal = compER, maxVal = Math.max(uVal, cVal, 0.1);
      return '<div class="an-comp-bar-section">' +
        '<div class="an-comp-bar-label">Perbandingan Engagement Rate</div>' +
        '<div class="an-comp-bar-wrap"><div style="width:48px;font-size:10px;color:var(--secondary);">Kamu</div>' +
          '<div class="an-comp-bar-bg"><div class="an-comp-bar-fill user" style="width:' + (uVal/maxVal*100).toFixed(0) + '%;"></div></div>' +
          '<span class="an-comp-bar-val" style="color:var(--rausch);">' + uVal.toFixed(1) + '%</span>' +
        '</div>' +
        '<div class="an-comp-bar-wrap"><div style="width:48px;font-size:10px;color:var(--secondary);">Pesaing</div>' +
          '<div class="an-comp-bar-bg"><div class="an-comp-bar-fill comp" style="width:' + (cVal/maxVal*100).toFixed(0) + '%;"></div></div>' +
          '<span class="an-comp-bar-val">' + cVal.toFixed(1) + '%</span>' +
        '</div>' +
      '</div>';
    })() : '') +

    // Insights
    (result.insights && result.insights.length
      ? '<div class="an-comp-insights">' +
          result.insights.map(function(ins) {
            return '<div class="an-comp-insight ' + (ins.type || 'purple') + '">' +
              '<div class="an-comp-insight-dot"></div>' +
              '<span>' + ins.text + '</span>' +
            '</div>';
          }).join('') +
        '</div>'
      : '') +

    // Strategy CTA
    '<button class="an-comp-strat-btn" onclick="switchMenu(\'monitor\')">Generate strategi lengkap untuk kalahkan pesaing ini →</button>' +
    '</div>';
}
window.anAnalyzeCompetitor = anAnalyzeCompetitor;

/* ─── Call SiLaris for Competitor ─── */
async function _callSilarisCompetitor(handle, platform, agg) {
  var supabaseUrl = (typeof RADAR_CONFIG !== 'undefined' && RADAR_CONFIG.SUPABASE_URL) || '';
  var supabaseKey = (typeof RADAR_CONFIG !== 'undefined' && RADAR_CONFIG.SUPABASE_ANON_KEY) || '';
  if (!supabaseUrl) return null;

  var platName = (_AN_PLAT[platform] || {}).name || platform;
  var sysPrompt = [
    'Kamu adalah SiLaris, Campaign Coach AI untuk UMKM Indonesia.',
    'Tugas: Buat analisa pesaing estimatif untuk handle/URL yang diberikan di platform ' + platName + '.',
    'Ini adalah ESTIMASI — tidak ada akses ke data internal pesaing.',
    '',
    'Data user sebagai pembanding:',
    '- Total campaign: ' + (agg.total || 0),
    '- Avg ER: ' + (agg.avgER ? agg.avgER.toFixed(1) + '%' : 'belum tersedia'),
    '- Total reach: ' + _anFmtK(agg.totalReach),
    '',
    'Buat response JSON seperti berikut (estimasi realistis berdasarkan pola umum ' + platName + ' UMKM lokal Indonesia):',
    '{',
    '  "comp_handle": "@handle_atau_nama_singkat",',
    '  "comp_er": "X.X%",',
    '  "comp_freq": "Nx/week",',
    '  "comp_followers": "XXK",',
    '  "comp_format": "format konten dominan",',
    '  "insights": [',
    '    {"type": "green", "text": "keunggulan spesifik user vs pola pesaing ini"},',
    '    {"type": "red", "text": "area yang perlu diwaspadai atau ditingkatkan"},',
    '    {"type": "purple", "text": "saran strategis konkret untuk unggul"}',
    '  ]',
    '}'
  ].join('\n');

  try {
    var resp = await fetch(supabaseUrl + '/functions/v1/silaris-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + supabaseKey },
      body: JSON.stringify({
        systemPrompt: sysPrompt,
        campaignData: { handle: handle, platform: platform },
        autoInsight: true,
        messages: []
      })
    });
    var data = await resp.json();
    if (data && data.reply) {
      var text = data.reply.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      var start = text.indexOf('{'), end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1) text = text.slice(start, end + 1);
      return JSON.parse(text);
    }
  } catch(e) {
    console.warn('[analytics] _callSilarisCompetitor error:', e);
  }
  return null;
}

/* ─── Empty State ─── */
function _renderAnalyticsEmpty(container) {
  container.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;width:100%;flex:1;min-height:400px;">' +
    '<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;max-width:400px;padding:40px 20px;">' +
      '<svg width="120" height="120" viewBox="0 0 120 120" fill="none">' +
        '<circle cx="60" cy="60" r="50" fill="#f5f3ff"/>' +
        '<rect x="30" y="75" width="12" height="20" rx="3" fill="#e9d5ff"/>' +
        '<rect x="48" y="60" width="12" height="35" rx="3" fill="#c4b5fd"/>' +
        '<rect x="66" y="45" width="12" height="50" rx="3" fill="#7c3aed"/>' +
        '<path d="M28 40 Q45 25 60 35 Q75 45 88 28" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round" fill="none" stroke-dasharray="4 3"/>' +
      '</svg>' +
      '<h3 style="font-size:18px;font-weight:600;color:#1a1a2e;margin:0;font-family:var(--font,sans-serif);">Belum ada data untuk dianalisis</h3>' +
      '<p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0;font-family:var(--font,sans-serif);">Mulai dengan launch campaign pertamamu. SiLaris akan langsung analisis pola dan kasih rekomendasi terbaik!</p>' +
      '<button onclick="switchMenu(\'command\')" class="an-empty-cta">🚀 Buat Campaign Pertama</button>' +
    '</div>' +
    '</div>';
}

/* ─── Helper: safe DOM replace ─── */
function _anReplace(id, html) {
  var el = document.getElementById(id);
  if (!el) return;
  var wrap = document.createElement('div');
  wrap.innerHTML = html;
  var newNode = wrap.firstChild;
  if (newNode) el.parentNode.replaceChild(newNode, el);
}

/* ─── waitForCampaigns — poll until window.CAMPAIGNS is ready ─── */
function waitForCampaigns(callback) {
  var loaded = window.CAMPAIGNS_LOADED === true;
  var hasCampaigns = window.CAMPAIGNS && window.CAMPAIGNS.length > 0;
  if (hasCampaigns || loaded) {
    callback(window.CAMPAIGNS || []);
  } else {
    setTimeout(function() { waitForCampaigns(callback); }, 500);
  }
}

/* ─── initAnalytics() — entry point ─── */
function initAnalytics() {
  var container = document.getElementById('view-analytics');
  if (!container) return;

  // KPI dulu (full-width), lalu 2-col layout (63% left / 37% right sticky)
  // Left:  SiLaris · Campaign Terbaik · Local Pulse · Rekomendasi · Competitor
  // Right: Mood Audiens · Platform Terkuat (sticky saat scroll)
  // Bottom: Upgrade Pro (full-width, paling bawah)
  container.innerHTML =
    '<div class="an-dashboard-wrap">' +
      _renderStatCardsSkeleton() +
      '<div class="an-two-main-cols">' +
        '<div class="an-col-main">' +
          _renderSilarisNarasi() +
          _renderCardSkeleton('an-camp-wrap') +
          _renderCardSkeleton('an-pulse-wrap') +
          _renderRekomendasiWeek() +
          _renderCompetitorSection() +
        '</div>' +
        '<div class="an-col-side">' +
          _renderCardSkeleton('an-mood-wrap') +
          _renderCardSkeleton('an-plat-wrap') +
        '</div>' +
      '</div>' +
      _renderUpgradePro() +
    '</div>';

  waitForCampaigns(function(campaigns) {
    var hasPublished = campaigns.some(function(c) { return !!c.post_id; });
    if (!campaigns.length || !hasPublished) {
      _renderAnalyticsEmpty(container);
      return;
    }

    var agg = _anAggregate(campaigns);
    window._anLastAgg = agg;

    _anReplace('an-sc-wrap',   _renderStatCards(agg));
    _anReplace('an-camp-wrap', _renderCampaignBest(agg));
    _anReplace('an-mood-wrap', _renderMoodAudiens(agg));
    _anReplace('an-pulse-wrap',_renderLocalPulse(agg));
    _anReplace('an-plat-wrap', _renderPlatformTerkuat(agg));

    _callSilarisAnalytics(agg)
      .then(function(ai) { _anPopulateAI(ai || _buildAnalyticsFallback(agg)); })
      .catch(function()  { _anPopulateAI(_buildAnalyticsFallback(agg)); });
  });
}

/* ─── Pricing Modal ─── */
function showPricingModal() {
  var existing = document.getElementById('an-pricing-modal');
  if (existing) { existing.style.display = 'flex'; return; }

  var modal = document.createElement('div');
  modal.id = 'an-pricing-modal';
  modal.className = 'an-pricing-overlay';
  modal.innerHTML =
    '<div class="an-pricing-sheet">' +
    '<div class="an-pricing-header">' +
      '<div><div class="an-pricing-title">Pilih Paket RADAR</div><div class="an-pricing-subtitle">Mulai gratis, upgrade kapan saja</div></div>' +
      '<button class="an-pricing-close" onclick="closePricingModal()">✕</button>' +
    '</div>' +
    '<div class="an-pricing-cards">' +
      // Freemium
      '<div class="an-pricing-card">' +
        '<div class="an-pc-top"><div class="an-pc-name">Freemium</div><div class="an-pc-price">Gratis <span class="an-pc-period">selamanya</span></div></div>' +
        '<ul class="an-pc-features"><li>10 AI Launch/bulan</li><li>AI Vision &amp; Master Persona</li><li>4 channel publishing</li><li>Geo-Radar Targeting</li><li>Smart Geo Stitching</li></ul>' +
        '<button class="an-pc-btn an-pc-btn-outline" onclick="closePricingModal()">Mulai Freemium</button>' +
      '</div>' +
      // Starter
      '<div class="an-pricing-card">' +
        '<div class="an-pc-top"><div class="an-pc-name">Starter</div><div class="an-pc-price">Rp 99rb <span class="an-pc-period">/bulan</span></div><div class="an-pc-badge-free">Coba 7 hari gratis</div></div>' +
        '<ul class="an-pc-features"><li>50 AI Launch/bulan</li><li>Semua fitur Freemium</li><li>Dedicated Generate</li></ul>' +
        '<button class="an-pc-btn an-pc-btn-outline" onclick="closePricingModal()">Coba Gratis 7 Hari</button>' +
      '</div>' +
      // Pro
      '<div class="an-pricing-card an-pricing-card-pro">' +
        '<div class="an-pc-top"><div style="display:flex;align-items:center;gap:8px;"><div class="an-pc-name">Pro</div><div class="an-pc-badge-popular">Paling Populer</div></div><div class="an-pc-price">Rp 199rb <span class="an-pc-period">/bulan</span></div><div class="an-pc-badge-free">Coba 7 hari gratis</div></div>' +
        '<ul class="an-pc-features"><li>Unlimited AI Launch</li><li>Competitor analysis tanpa batas</li><li>Data real-time per jam</li><li>Export laporan PDF</li></ul>' +
        '<button class="an-pc-btn an-pc-btn-pro" onclick="closePricingModal()">Coba Gratis 7 Hari</button>' +
      '</div>' +
      // Enterprise
      '<div class="an-pricing-card">' +
        '<div class="an-pc-top"><div class="an-pc-name">Enterprise</div><div class="an-pc-price">Custom</div></div>' +
        '<ul class="an-pc-features"><li>Unlimited AI Launch</li><li>Multi-akun klien</li><li>White-label dashboard</li><li>Dedicated support</li></ul>' +
        '<button class="an-pc-btn an-pc-btn-dark" onclick="closePricingModal()">Hubungi Kami</button>' +
      '</div>' +
    '</div>' +
    '</div>';

  document.body.appendChild(modal);
  modal.addEventListener('click', function(e) { if (e.target === modal) closePricingModal(); });
}

function closePricingModal() {
  var modal = document.getElementById('an-pricing-modal');
  if (modal) modal.style.display = 'none';
}
window.closePricingModal = closePricingModal;

/* ─── exportPDF() ─── */
async function exportPDF() {
  try {
    var jsPDFLib = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!jsPDFLib) { console.warn('[analytics] jsPDF tidak tersedia'); return; }
    var doc = new jsPDFLib();
    var y = 20, lh = 7;
    var now = new Date();
    var camps = (typeof CAMPAIGNS !== 'undefined') ? CAMPAIGNS.filter(function(c) { return !c.isDemo; }) : [];
    doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
    doc.text('RADAR — Analytics Dashboard', 20, y); y += 10;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(100);
    doc.text('Dibuat: ' + now.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }), 20, y); y += 12;
    if (camps.length) {
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
      doc.text('Campaign (' + camps.length + ')', 20, y); y += lh;
      camps.slice(0, 10).forEach(function(c) {
        if (y > 255) { doc.addPage(); y = 20; }
        doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
        doc.text(c.name || c.nama_campaign || 'Campaign', 20, y); y += lh - 1;
        doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(80);
        doc.text('Platform: ' + (c.platforms || []).join(', ') + ' · Area: ' + (c.kecamatan || '—'), 22, y); y += lh + 1;
      });
    }
    doc.setFontSize(8); doc.setTextColor(150);
    doc.text('Dibuat oleh RADAR · radar.id', 20, 285);
    var df = now.getFullYear() + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0');
    doc.save('radar-analytics-' + df + '.pdf');
  } catch(e) { console.error('[analytics] exportPDF error:', e); }
}

/* ─── Backward Compat ─── */
function renderAnalytics() { initAnalytics(); }
function handleExport()    { exportPDF(); }
function handleUpgrade()   { showPricingModal(); }
