// RADAR — analytics.js
// Analytics & Estimate Hub

/* ─────────────────────────────────────────
   KPI Mock Data per Period
   ───────────────────────────────────────── */
var AN_KPI = {
  '7d': {
    reach: '12.1rb', reachBadge: '↑ 18%', reachDir: 'up',
    eng: '6.8%',    engBadge:   '↑ 1.2%', engDir:   'up',
    ctr: '4.2%',    ctrBadge:   '↑ 0.8%', ctrDir:   'up',   ctrNote: 'benchmark 1.8%',
    budget: 'Rp 780rb', budgetBadge: '↓ 8%', budgetDir: 'down', budgetNote: 'dari Rp 850rb dialokasi',
    achTotal: '12.1rb',
    eva: {
      ig:   { est: '4.200',  act: '5.100',  gap: '↑ +21% overperform', dir: 'over' },
      tt:   { est: '5.800',  act: '7.800',  gap: '↑ +34% overperform', dir: 'over' },
      meta: { est: '3.200',  act: '2.800',  gap: '↓ -13% underperform', dir: 'under' }
    }
  },
  '30d': {
    reach: '48.4rb', reachBadge: '↑ 23%', reachDir: 'up',
    eng: '6.8%',    engBadge:   '↑ 1.2%', engDir:   'up',
    ctr: '4.2%',    ctrBadge:   '↑ 0.8%', ctrDir:   'up',   ctrNote: 'benchmark 1.8%',
    budget: 'Rp 2.4jt', budgetBadge: '↓ 12%', budgetDir: 'down', budgetNote: 'dari Rp 2.7jt dialokasi',
    achTotal: '48.4rb',
    eva: {
      ig:   { est: '12.000', act: '14.800', gap: '↑ +23% overperform', dir: 'over' },
      tt:   { est: '18.000', act: '24.200', gap: '↑ +34% overperform', dir: 'over' },
      meta: { est: '10.000', act: '8.700',  gap: '↓ -13% underperform', dir: 'under' }
    }
  },
  '90d': {
    reach: '141rb',  reachBadge: '↑ 31%', reachDir: 'up',
    eng: '6.4%',    engBadge:   '↑ 0.9%', engDir:   'up',
    ctr: '3.9%',    ctrBadge:   '↑ 0.5%', ctrDir:   'up',   ctrNote: 'benchmark 1.8%',
    budget: 'Rp 6.8jt', budgetBadge: '↑ 5%', budgetDir: 'up', budgetNote: 'dari Rp 6.5jt dialokasi',
    achTotal: '141rb',
    eva: {
      ig:   { est: '36.000', act: '44.100', gap: '↑ +23% overperform', dir: 'over' },
      tt:   { est: '54.000', act: '72.600', gap: '↑ +34% overperform', dir: 'over' },
      meta: { est: '30.000', act: '26.100', gap: '↓ -13% underperform', dir: 'under' }
    }
  }
};

/* ─────────────────────────────────────────
   Chart Data (30-day rolling, 3 datasets)
   ───────────────────────────────────────── */
var chartData = {
  reach: {
    ig:     [3200,2800,4100,3600,4800,5200,4600,5800,6200,5400,6800,7100,6400,7800,8200,7600,8900,9100,8400,9800,10200,9600,11000,10800,11400,12100,11600,12800,13200,14800],
    tiktok: [4100,5200,6800,5400,7200,8100,7600,9200,10400,9800,11200,12100,11600,13200,14100,13600,15200,16100,15600,17200,18100,17600,19200,20100,19600,21200,22100,21600,23200,24200],
    meta:   [1800,2100,1600,2400,2800,2200,3100,2600,3400,2900,3600,3100,3800,3200,4100,3400,4400,3600,4700,3900,5000,4200,5300,4600,5600,4900,5900,5200,6200,8700]
  },
  engagement: {
    ig:     [4.2,4.5,5.1,4.8,5.6,5.9,5.4,6.2,6.8,6.4,7.1,7.4,6.9,7.8,8.1,7.6,8.4,8.8,8.2,9.1,9.4,8.8,9.7,9.2,9.8,10.2,9.6,10.4,10.8,11.2],
    tiktok: [5.1,5.8,6.4,5.9,7.1,7.8,7.2,8.4,9.1,8.6,9.8,10.4,9.8,11.2,11.8,11.2,12.4,12.9,12.2,13.4,13.8,13.1,14.4,13.8,14.4,15.1,14.4,15.8,16.2,16.8],
    meta:   [2.1,2.4,2.0,2.8,3.2,2.6,3.6,3.0,3.9,3.4,4.2,3.6,4.4,3.7,4.8,3.9,5.1,4.2,5.4,4.6,5.8,4.9,6.2,5.3,6.5,5.7,6.8,6.0,7.1,6.8]
  },
  ctr: {
    ig:     [2.1,2.4,2.8,2.5,3.1,3.4,3.0,3.8,4.1,3.7,4.5,4.8,4.3,5.1,5.4,4.9,5.8,6.1,5.6,6.4,6.8,6.2,7.1,6.8,7.2,7.6,7.1,7.9,8.2,8.8],
    tiktok: [1.8,2.1,2.5,2.2,2.9,3.2,2.8,3.6,3.9,3.5,4.3,4.6,4.1,4.9,5.2,4.8,5.6,5.9,5.4,6.2,6.6,6.1,6.9,6.5,7.0,7.4,6.9,7.7,8.1,8.6],
    meta:   [0.9,1.1,0.8,1.4,1.6,1.2,1.8,1.4,2.0,1.7,2.2,1.8,2.4,1.9,2.6,2.1,2.8,2.2,3.0,2.4,3.2,2.6,3.4,2.8,3.6,3.0,3.8,3.2,4.0,3.4]
  }
};

/* Generate 30-day date labels */
var chartLabels = (function() {
  var arr = [];
  for (var i = 30; i >= 1; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.getDate() + '/' + (d.getMonth() + 1));
  }
  return arr;
})();

/* ─────────────────────────────────────────
   AI Insights per Period
   ───────────────────────────────────────── */
var AN_INSIGHTS = {
  '7d': [
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
      text: 'Campaign <strong>Kuliner Jogja Selatan</strong> kamu menjangkau <strong>7.800 orang nyata</strong> minggu ini — CTR-nya 2× di atas benchmark kategori.'
    },
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      text: 'Meta Feed <strong>-13% dari estimasi</strong> minggu ini. Coba alihkan Rp 50rb dari Meta ke TikTok untuk tambah <strong>800 reach</strong>.'
    },
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#791ADB" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      text: 'Sapaan lokal <strong>"Sugeng Rawuh"</strong> di TikTok kamu mendapat watch time <strong>+64%</strong> lebih lama dibanding konten tanpa sapaan lokal.'
    }
  ],
  '30d': [
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
      text: 'Campaign <strong>Kuliner Jogja Selatan</strong> kamu menjangkau <strong>24.200 orang nyata</strong> — 2× lebih baik dari benchmark kategori yang sama.'
    },
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      text: 'Budget Meta Feed <strong>-13% dari estimasi</strong>. Coba alihkan Rp 200rb dari Meta ke TikTok untuk potensi tambah <strong>2.800 reach</strong>.'
    },
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#791ADB" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      text: 'CTR kamu <strong>4.2%</strong> — rata-rata kategori Kuliner Jogja hanya <strong>1.8%</strong>. Kamu 2.3× di atas benchmark!'
    }
  ],
  '90d': [
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
      text: '3 bulan terakhir kamu menjangkau <strong>141.000 orang</strong> di Yogyakarta — rata-rata <strong>47rb per bulan</strong> secara konsisten.'
    },
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      text: 'TikTok adalah channel paling efisien — cost-per-reach hanya <strong>Rp 42/orang</strong> vs Instagram Rp 68/orang.'
    },
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#791ADB" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      text: 'Identitas lokal "Sugeng Rawuh" konsisten <strong>+60–70% watch time</strong> selama 3 bulan. Ini diferensiasi nyata kamu vs kompetitor.'
    }
  ]
};

/* ─────────────────────────────────────────
   State
   ───────────────────────────────────────── */
var _anChartsInitialized = false;
var _anReachChart  = null;
var _anBudgetChart = null;
var _anCurrentPeriod = '30d';

/* ─────────────────────────────────────────
   Init
   ───────────────────────────────────────── */
function initAnalytics() {
  if (_anChartsInitialized) {
    renderAnKpi(_anCurrentPeriod);
    loadAnalyticsData();
    return;
  }
  _anChartsInitialized = true;
  _anCurrentPeriod = '30d';
  renderAnKpi('30d');
  renderAnAi('30d');
  updateReachChart('reach');
  initBudgetChart();
  renderBudgetList();
  loadAnalyticsData();
}

/* ─────────────────────────────────────────
   Period Switching
   ───────────────────────────────────────── */
function setAnPeriod(period, el) {
  _anCurrentPeriod = period;
  document.querySelectorAll('#anDatePills .an-date-pill').forEach(function(p) {
    p.classList.remove('active');
  });
  el.classList.add('active');
  renderAnKpi(period);
  renderAnAi(period);
}

/* ─────────────────────────────────────────
   KPI Render
   ───────────────────────────────────────── */
function renderAnKpi(period) {
  var d = AN_KPI[period];
  if (!d) return;

  setText('anKpiReach', d.reach);
  setBadge('anKpiReachBadge', d.reachBadge, d.reachDir);
  setText('anKpiEng', d.eng);
  setBadge('anKpiEngBadge', d.engBadge, d.engDir);
  setText('anKpiCtr', d.ctr);
  setBadge('anKpiCtrBadge', d.ctrBadge, d.ctrDir);
  setText('anKpiCtrNote', d.ctrNote);
  setText('anKpiBudget', d.budget);
  setBadge('anKpiBudgetBadge', d.budgetBadge, d.budgetDir);
  setText('anKpiBudgetSub', d.budgetNote);
  setText('anAchTotal', d.achTotal);

  // EVA cards
  setEva('anEvaIgEst',   'anEvaIgAct',   'anEvaIgGap',   d.eva.ig);
  setEva('anEvaTtEst',   'anEvaTtAct',   'anEvaTtGap',   d.eva.tt);
  setEva('anEvaMetaEst', 'anEvaMetaAct', 'anEvaMetaGap', d.eva.meta);
}

function setText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setBadge(id, text, dir) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'kpi-badge ' + (dir === 'up' ? 'up' : 'down');
}

function setEva(estId, actId, gapId, data) {
  setText(estId, data.est);
  setText(actId, data.act);
  var gapEl = document.getElementById(gapId);
  if (gapEl) {
    gapEl.textContent = data.gap;
    gapEl.className = 'est-gap ' + data.dir;
  }
  // Meta actual color
  if (actId === 'anEvaMetaAct' && gapEl) {
    var actEl = document.getElementById(actId);
    if (actEl) actEl.style.color = data.dir === 'under' ? '#dc2626' : 'var(--rausch)';
  }
}

/* ─────────────────────────────────────────
   AI Insights Render
   ───────────────────────────────────────── */
function renderAnAi(period) {
  var panel = document.getElementById('anAiPanel');
  if (!panel) return;
  var insights = AN_INSIGHTS[period] || AN_INSIGHTS['30d'];

  panel.innerHTML =
    '<div class="ai-header">' +
    '  <div class="ai-avatar"><svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7H3a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM5 19v2a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-2a2 2 0 00-2-2H7a2 2 0 00-2 2zm4-5a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z"/></svg></div>' +
    '  <div><div class="ai-name">RADAR AI Summary</div><div class="ai-tag">Berdasarkan data campaign kamu · diperbarui otomatis</div></div>' +
    '</div>' +
    '<div class="ai-insights">' +
    insights.map(function(ins) {
      return '<div class="ai-insight-item">' +
        '<div class="ai-insight-icon">' + ins.icon + '</div>' +
        '<div class="ai-insight-text">' + ins.text + '</div>' +
        '</div>';
    }).join('') +
    '</div>';
}

/* ─────────────────────────────────────────
   Budget List Render
   ───────────────────────────────────────── */
function renderBudgetList() {
  var list = document.getElementById('anBudgetList');
  if (!list) return;

  var platforms = [
    {
      name: 'Instagram',
      pct: 38, amt: 'Rp 912rb',
      color: '#E1306C',
      bgColor: 'rgba(225,48,108,0.1)',
      icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E1306C" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/></svg>'
    },
    {
      name: 'TikTok',
      pct: 45, amt: 'Rp 1.08jt',
      color: '#010101',
      bgColor: 'rgba(0,0,0,0.06)',
      icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="#010101"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 106.33 6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/></svg>'
    },
    {
      name: 'Meta Feed',
      pct: 17, amt: 'Rp 408rb',
      color: '#1877F2',
      bgColor: 'rgba(24,119,242,0.1)',
      icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
    }
  ];

  list.innerHTML = platforms.map(function(p) {
    return '<div class="budget-item">' +
      '<div class="budget-item-header">' +
      '<div class="budget-platform">' +
      '<div class="budget-platform-icon" style="background:' + p.bgColor + '">' + p.icon + '</div>' +
      p.name +
      '</div>' +
      '<div class="budget-vals">' +
      '<span class="budget-pct">' + p.pct + '%</span>' +
      '<span class="budget-amt">' + p.amt + '</span>' +
      '</div>' +
      '</div>' +
      '<div class="budget-bar-bg"><div class="budget-bar" style="width:' + p.pct + '%;background:' + p.color + ';"></div></div>' +
      '</div>';
  }).join('');
}

/* ─────────────────────────────────────────
   Reach Chart (Multi-line, destroy/recreate)
   ───────────────────────────────────────── */
function switchChartTab(el, type) {
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  el.classList.add('active');
  updateReachChart(type);
}

function updateReachChart(type) {
  if (_anReachChart) {
    _anReachChart.destroy();
    _anReachChart = null;
  }
  var canvas = document.getElementById('reachChart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var d = chartData[type];

  _anReachChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Instagram',
          data: d.ig,
          borderColor: '#791ADB',
          backgroundColor: 'rgba(121,26,219,0.06)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: true,
          tension: 0.4
        },
        {
          label: 'TikTok',
          data: d.tiktok,
          borderColor: '#222222',
          backgroundColor: 'rgba(0,0,0,0.03)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
          tension: 0.4,
          borderDash: [4, 3]
        },
        {
          label: 'Meta Feed',
          data: d.meta,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.04)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#222222',
          titleColor: 'rgba(255,255,255,0.6)',
          bodyColor: 'white',
          padding: 10,
          cornerRadius: 8,
          titleFont: { size: 11, family: 'Circular Std' },
          bodyFont:  { size: 12, family: 'Circular Std', weight: '700' }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            font: { size: 10, family: 'Circular Std' },
            color: '#6a6a6a',
            maxTicksLimit: 8,
            autoSkip: true
          }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          border: { display: false },
          ticks: {
            font: { size: 10, family: 'Circular Std' },
            color: '#6a6a6a',
            callback: function(v) {
              if (v >= 1000) return (v / 1000).toFixed(0) + 'rb';
              return v.toFixed(1);
            }
          }
        }
      }
    }
  });
}

/* ─────────────────────────────────────────
   Budget Donut Chart
   ───────────────────────────────────────── */
function initBudgetChart() {
  var canvas = document.getElementById('budgetChart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  _anBudgetChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Instagram', 'TikTok', 'Meta Feed'],
      datasets: [{
        data: [38, 45, 17],
        backgroundColor: ['#E1306C', '#222222', '#1877F2'],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#222222',
          bodyColor: 'white',
          padding: 8,
          cornerRadius: 8,
          bodyFont: { family: 'Circular Std' },
          callbacks: {
            label: function(ctx) {
              return ' ' + ctx.label + ': ' + ctx.parsed + '%';
            }
          }
        }
      }
    }
  });
}

/* ─────────────────────────────────────────
   Load Analytics Data from Supabase
   ───────────────────────────────────────── */
async function loadAnalyticsData() {
  if (typeof getCampaigns !== 'function') return;
  try {
    var campaigns = await getCampaigns();
    if (!campaigns || !campaigns.length) return;

    var totalReach = campaigns.reduce(function(s, c) {
      return s + (parseInt(c.estimated_reach_max) || 0);
    }, 0);
    var activeCnt = campaigns.filter(function(c) { return c.status === 'active'; }).length;
    var platCount = {};
    campaigns.forEach(function(c) {
      (c.platforms || []).forEach(function(p) { platCount[p] = (platCount[p] || 0) + 1; });
    });
    var strongestPlat = Object.keys(platCount).sort(function(a, b) {
      return platCount[b] - platCount[a];
    })[0] || '—';

    var reachStr = totalReach >= 1000000 ? (totalReach / 1000000).toFixed(1) + 'jt'
                 : totalReach >= 1000    ? Math.round(totalReach / 1000) + 'rb'
                 : totalReach.toString();

    var reachEl = document.getElementById('anKpiReach');
    if (reachEl && totalReach > 0) reachEl.textContent = reachStr;

    // Store for PDF and insight
    window._anCampaigns    = campaigns;
    window._anTotalReach   = totalReach;
    window._anActiveCnt    = activeCnt;
    window._anStrongestPlat = strongestPlat;

    generateInsight(campaigns);
  } catch(e) {
    console.warn('[analytics] loadAnalyticsData error:', e);
  }
}

/* ─────────────────────────────────────────
   AI Insight — Rate Limiting + Edge Function
   ───────────────────────────────────────── */
function checkInsightRateLimit() {
  var cooldown = (typeof RADAR_CONFIG !== 'undefined') ? RADAR_CONFIG.INSIGHT_COOLDOWN_MS : 10000;
  var last = localStorage.getItem('radar_last_insight');
  if (!last) return true;
  return (Date.now() - parseInt(last)) >= cooldown;
}

async function generateInsight(campaigns) {
  if (typeof RADAR_CONFIG !== 'undefined' && RADAR_CONFIG.FEATURES && !RADAR_CONFIG.FEATURES.ai_insight) return;

  var panel = document.getElementById('anAiPanel');
  if (!panel) return;

  panel.innerHTML = _buildAiPanelShell(
    '<div style="font-size:13px;color:var(--secondary);padding:8px 0;">Membaca data campaign kamu...</div>',
    false
  );

  // Try Edge Function
  if (window.radarSupabaseUrl && window.radarSupabaseKey && campaigns && campaigns.length) {
    try {
      var platCount = {};
      campaigns.forEach(function(c) {
        (c.platforms || []).forEach(function(p) { platCount[p] = (platCount[p] || 0) + 1; });
      });
      var topPlat = Object.keys(platCount).sort(function(a, b) { return platCount[b] - platCount[a]; })[0] || '—';
      var totalR  = campaigns.reduce(function(s, c) { return s + (parseInt(c.estimated_reach_max) || 0); }, 0);

      var resp = await fetch(window.radarSupabaseUrl + '/functions/v1/ai-insight', {
        method:  'POST',
        headers: {
          'Authorization': 'Bearer ' + window.radarSupabaseKey,
          'Content-Type':  'application/json'
        },
        body: JSON.stringify({
          campaigns:       campaigns.slice(0, 5),
          totalReach:      totalR,
          platformTerkuat: topPlat,
          totalCampaign:   campaigns.length
        })
      });

      if (resp.ok) {
        var data = await resp.json();
        if (data && data.insight) {
          localStorage.setItem('radar_last_insight', Date.now().toString());
          panel.innerHTML = _buildAiPanelShell(
            '<div class="ai-insights"><div class="ai-insight-item">' +
            '<div class="ai-insight-text">' + data.insight.replace(/\n/g, '<br>') + '</div>' +
            '</div></div>',
            true
          );
          return;
        }
      }
    } catch(e) {
      console.warn('[analytics] Edge Function error, fallback:', e.message);
    }
  }

  _renderFallbackInsight(campaigns);
}

function _renderFallbackInsight(campaigns) {
  var panel = document.getElementById('anAiPanel');
  if (!panel) return;

  var insights;
  if (campaigns && campaigns.length) {
    var cnt = campaigns.length;
    var platCount = {};
    campaigns.forEach(function(c) {
      (c.platforms || []).forEach(function(p) { platCount[p] = (platCount[p] || 0) + 1; });
    });
    var topPlat = Object.keys(platCount).sort(function(a, b) { return platCount[b] - platCount[a]; })[0] || 'ig';
    var platNames = { ig: 'Instagram', tiktok: 'TikTok', meta: 'Meta Feed', youtube: 'YouTube' };
    var topPlatName = platNames[topPlat] || topPlat;
    var totalR   = campaigns.reduce(function(s, c) { return s + (parseInt(c.estimated_reach_max) || 0); }, 0);
    var reachStr = totalR >= 1000 ? Math.round(totalR / 1000) + 'rb' : totalR.toString();
    var firstName  = campaigns[0].nama_campaign || campaigns[0].name || 'campaign terbaru';
    var kecamatan  = campaigns[0].kecamatan || 'area target';

    var okIcon   = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>';
    var warnIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    var starIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#791ADB" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

    insights = [
      { icon: okIcon,   text: 'Kamu sudah punya <strong>' + cnt + ' campaign</strong> di RADAR. Total estimasi jangkauan: <strong>' + reachStr + ' users</strong>.' },
      { icon: warnIcon, text: 'Campaign terbaru <strong>' + firstName + '</strong> di <strong>' + kecamatan + '</strong> sedang berjalan. Terus konsisten agar momentum tidak putus.' },
      { icon: starIcon, text: 'Platform paling aktif: <strong>' + topPlatName + '</strong>. Konsistensi di satu platform membangun algoritma lebih cepat.' }
    ];
  } else {
    insights = AN_INSIGHTS[_anCurrentPeriod] || AN_INSIGHTS['30d'];
  }

  panel.innerHTML = _buildAiPanelShell(
    '<div class="ai-insights">' +
    insights.map(function(ins) {
      return '<div class="ai-insight-item">' +
        '<div class="ai-insight-icon">' + ins.icon + '</div>' +
        '<div class="ai-insight-text">' + ins.text + '</div>' +
        '</div>';
    }).join('') + '</div>',
    true
  );
}

function _buildAiPanelShell(contentHTML, showRefresh) {
  return '<div class="ai-header">' +
    '<div class="ai-avatar"><svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7H3a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM5 19v2a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-2a2 2 0 00-2-2H7a2 2 0 00-2 2zm4-5a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z"/></svg></div>' +
    '<div style="flex:1;"><div class="ai-name">RADAR AI Summary</div>' +
    '<div class="ai-tag">Berdasarkan data campaign kamu · diperbarui otomatis</div></div>' +
    (showRefresh
      ? '<button onclick="_refreshInsight()" style="background:none;border:none;cursor:pointer;font-size:11px;color:var(--secondary);padding:4px 6px;border-radius:6px;" title="Refresh">↺ Refresh</button>'
      : '') +
    '</div>' + contentHTML;
}

function _refreshInsight() {
  if (!checkInsightRateLimit()) {
    if (typeof showAnToast === 'function') showAnToast('⏳ Tunggu sebentar sebelum refresh lagi');
    return;
  }
  generateInsight(window._anCampaigns || []);
}

/* ─────────────────────────────────────────
   Export PDF (jsPDF)
   ───────────────────────────────────────── */
async function exportPDF() {
  if (typeof RADAR_CONFIG !== 'undefined' && RADAR_CONFIG.FEATURES && !RADAR_CONFIG.FEATURES.export_pdf) return;

  var btn = document.getElementById('anExportBtn');
  var SVG_DL = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

  if (btn) { btn.disabled = true; btn.textContent = 'Menyiapkan laporan...'; }

  try {
    var jsPDFLib = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!jsPDFLib) throw new Error('jsPDF tidak tersedia');

    var doc = new jsPDFLib();
    var y = 20; var lh = 7;

    // Header
    doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
    doc.text('RADAR Campaign Report', 20, y); y += 10;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(100);
    var now = new Date();
    doc.text('Dibuat: ' + now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 20, y); y += 12;

    // KPI
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
    doc.text('Ringkasan Performa', 20, y); y += lh;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    var get = function(id) { var el = document.getElementById(id); return el ? el.textContent.trim() : '—'; };
    doc.text('Total Jangkauan   : ' + get('anKpiReach'), 20, y); y += lh;
    doc.text('Engagement Rate   : ' + get('anKpiEng'),   20, y); y += lh;
    doc.text('CTR               : ' + get('anKpiCtr'),   20, y); y += 12;

    // Campaigns
    var campaigns = window._anCampaigns || [];
    if (campaigns.length) {
      doc.setFontSize(12); doc.setFont('helvetica', 'bold');
      doc.text('Daftar Campaign (' + campaigns.length + ')', 20, y); y += lh;
      campaigns.slice(0, 10).forEach(function(c) {
        if (y > 255) { doc.addPage(); y = 20; }
        var dateStr = c.created_at ? new Date(c.created_at).toLocaleDateString('id-ID') : '—';
        doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
        doc.text(c.nama_campaign || c.name || 'Campaign', 20, y); y += lh - 2;
        doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(80);
        var detail = 'Lokasi: ' + (c.kecamatan || '—') + ' · Platform: ' + (c.platforms || []).join(', ') +
                     ' · Reach est.: ' + (c.estimated_reach_min || 0) + '–' + (c.estimated_reach_max || 0) +
                     ' · ' + dateStr;
        doc.text(detail, 22, y); doc.setTextColor(0); y += lh + 1;
      });
    }

    // AI Insight
    var panelEl = document.getElementById('anAiPanel');
    if (panelEl) {
      var insightText = panelEl.innerText.replace(/↺\s*Refresh/g, '').trim();
      if (insightText.length > 20) {
        if (y > 240) { doc.addPage(); y = 20; }
        doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
        doc.text('AI Insight', 20, y); y += lh;
        doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(60);
        doc.splitTextToSize(insightText, 170).slice(0, 25).forEach(function(line) {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(line, 20, y); y += lh - 1;
        });
      }
    }

    // Footer
    doc.setFontSize(8); doc.setTextColor(150);
    doc.text('Dibuat oleh RADAR · radar.id', 20, 285);

    var dateFormatted = now.getFullYear() + '' +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    doc.save('radar-report-' + dateFormatted + '.pdf');

    if (btn) {
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13" style="stroke:white;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;"><polyline points="20 6 9 17 4 12"/></svg> Laporan tersimpan!';
      setTimeout(function() { btn.disabled = false; btn.innerHTML = SVG_DL + ' Export PDF'; }, 2000);
    }

  } catch(e) {
    console.error('[analytics] exportPDF error:', e);
    if (btn) { btn.disabled = false; btn.innerHTML = SVG_DL + ' Export PDF'; }
    if (typeof showAnToast === 'function') showAnToast('⚠ Gagal export PDF');
  }
}

/* kept for backward compat — redirects to exportPDF */
function handleExport() { exportPDF(); }

/* ─────────────────────────────────────────
   Upgrade (placeholder)
   ───────────────────────────────────────── */
function handleUpgrade() {
  var toast = document.getElementById('an-toast');
  if (!toast) return;
  toast.textContent = '✨ Fitur Pro: Benchmark, Export PDF, Audience Insights';
  toast.style.display = 'block';
  setTimeout(function() { toast.style.display = 'none'; }, 3000);
}
