// ── Duitku Payment Modal ────────────────────────────────────────────────────

var _DUITKU_BANK_NAMES = {
  'BT': 'Permata Bank', 'BC': 'BCA', 'M2': 'Bank Mandiri', 'VC': 'CIMB Niaga',
  'BV': 'BSI', 'I1': 'BNI', 'B1': 'CIMB Niaga VA', 'A1': 'ATM Bersama',
  'M3': 'Maybank', 'AG': 'Bank Artha Graha', 'BNC': 'Bank Neo Commerce',
};

function _formatRupiah(n) {
  return 'Rp ' + parseInt(n).toLocaleString('id-ID');
}

function _copyText(text, btn) {
  navigator.clipboard.writeText(text).then(function() {
    var orig = btn.textContent;
    btn.textContent = 'Tersalin!';
    setTimeout(function() { btn.textContent = orig; }, 1500);
  });
}

function _showDuitkuModal(result, plan) {
  var existing = document.getElementById('dk-modal-overlay');
  if (existing) existing.remove();

  var vaNumber  = result.vaNumber || '';
  var amount    = result.amount || '';
  var paymentUrl = result.paymentUrl || '';
  var bankCode  = result.paymentCode || '';
  var bankName  = _DUITKU_BANK_NAMES[bankCode] || 'Virtual Account';

  var overlay = document.createElement('div');
  overlay.id = 'dk-modal-overlay';
  overlay.style.cssText = [
    'position:fixed;top:0;left:0;width:100%;height:100%;',
    'background:rgba(0,0,0,0.55);z-index:99999;',
    'display:flex;align-items:center;justify-content:center;',
    'padding:16px;box-sizing:border-box;'
  ].join('');

  overlay.innerHTML = [
    '<div style="background:#fff;border-radius:16px;width:100%;max-width:420px;',
         'box-shadow:0 8px 32px rgba(0,0,0,0.18);overflow:hidden;font-family:sans-serif;">',

      // Header
      '<div style="background:#1a0533;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;">',
        '<div>',
          '<div style="color:#fff;font-size:18px;font-weight:700;">LARISI</div>',
          '<div style="color:#c9a7f7;font-size:12px;margin-top:2px;">Langganan Paket ' + plan.toUpperCase() + '</div>',
        '</div>',
        '<button id="dk-close" style="background:rgba(255,255,255,0.15);border:none;color:#fff;',
          'border-radius:50%;width:32px;height:32px;font-size:20px;cursor:pointer;',
          'display:flex;align-items:center;justify-content:center;line-height:1;">&#215;</button>',
      '</div>',

      // Amount
      '<div style="padding:20px 24px 0;border-bottom:1px solid #f0f0f0;">',
        '<div style="color:#888;font-size:12px;margin-bottom:4px;">Jumlah Pembayaran</div>',
        '<div style="font-size:28px;font-weight:700;color:#1a0533;">' + _formatRupiah(amount) + '</div>',
        '<div style="color:#888;font-size:12px;margin:6px 0 16px;">Berlaku 60 menit</div>',
      '</div>',

      // VA Info
      '<div style="padding:16px 24px;border-bottom:1px solid #f0f0f0;">',
        '<div style="color:#888;font-size:12px;margin-bottom:8px;">Metode Pembayaran</div>',
        '<div style="font-weight:600;font-size:14px;color:#333;margin-bottom:12px;">' + bankName + '</div>',
        '<div style="color:#888;font-size:12px;margin-bottom:6px;">Nomor Virtual Account</div>',
        '<div style="display:flex;align-items:center;gap:10px;">',
          '<div style="font-size:22px;font-weight:700;color:#1a0533;letter-spacing:2px;flex:1;" id="dk-va-number">' + vaNumber + '</div>',
          '<button id="dk-copy" style="background:#7c3aed;color:#fff;border:none;border-radius:8px;',
            'padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;">Salin</button>',
        '</div>',
      '</div>',

      // BCA warning
      '<div style="margin:12px 24px 0;padding:10px 12px;background:#fff8e1;border:1px solid #ffe082;border-radius:8px;display:flex;gap:8px;align-items:flex-start;">',
        '<span style="font-size:15px;flex-shrink:0;">⚠️</span>',
        '<span style="font-size:12px;color:#7a5c00;line-height:1.5;">Pengguna <strong>Bank BCA</strong> belum dapat melakukan transfer ke Virtual Account ini. Gunakan bank lain seperti Mandiri, BNI, BRI, CIMB, atau mobile banking selain BCA.</span>',
      '</div>',

      // Footer
      '<div style="padding:16px 24px;display:flex;gap:10px;">',
        paymentUrl
          ? '<a href="' + paymentUrl + '" target="_blank" style="flex:1;text-align:center;padding:12px;border:1.5px solid #7c3aed;border-radius:10px;color:#7c3aed;font-weight:600;font-size:14px;text-decoration:none;display:block;">Lihat Detail</a>'
          : '',
        '<button id="dk-done" style="flex:2;background:#7c3aed;color:#fff;border:none;border-radius:10px;',
          'padding:12px;font-size:14px;font-weight:600;cursor:pointer;">Sudah Transfer</button>',
      '</div>',

    '</div>'
  ].join('');

  document.body.appendChild(overlay);

  document.getElementById('dk-close').onclick = function() { overlay.remove(); };
  document.getElementById('dk-done').onclick  = function() { overlay.remove(); };
  document.getElementById('dk-copy').onclick  = function() {
    _copyText(vaNumber, document.getElementById('dk-copy'));
  };
  // Tutup jika klik di luar modal
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}


// ── Fungsi utama ────────────────────────────────────────────────────────────

window.startDuitkuPayment = async function(plan, amount) {
  console.log('Starting Duitku Payment for:', plan, amount);

  try {
    const user = (typeof window.getCurrentUser === 'function') ? await window.getCurrentUser() : null;
    const userProfile = window.userBizProfile || JSON.parse(localStorage.getItem('radar_user_profile') || '{}');
    const userEmail = (user && user.email ? user.email : (userProfile.email || '')).toLowerCase().trim();
    const userName  = userProfile.full_name || userProfile.name
      || (user && user.user_metadata && user.user_metadata.full_name) || 'Pelanggan Larisi';
    const userPhone = userProfile.phone || userProfile.phone_number || '081234567890';
    const orderId   = 'LARISI-' + Date.now();

    if (window.showAnToast) window.showAnToast('Menghubungkan ke Duitku...', 'info');

    const response = await fetch(window.RADAR_CONFIG.SUPABASE_URL + '/functions/v1/duitku-invoice', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + window.RADAR_CONFIG.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ plan, amount, email: userEmail, name: userName,
        phone: userPhone, orderId, userId: user ? user.id : '' })
    });

    const result = await response.json();
    console.log('[Duitku] Response:', result);

    if (result.vaNumber || result.paymentUrl) {
      _showDuitkuModal(result, plan);
    } else {
      throw new Error(result.error || 'Gagal membuat invoice Duitku');
    }

  } catch (error) {
    console.error('Duitku Error:', error);
    alert('Maaf, ' + error.message);
  }
};
