// Tampilkan halaman Duitku dalam iframe modal di dalam halaman Larisi
function _openDuitkuIframe(paymentUrl) {
    var existing = document.getElementById('duitku-iframe-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'duitku-iframe-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;';

    var modal = document.createElement('div');
    modal.style.cssText = 'background:#fff;border-radius:12px;overflow:hidden;width:460px;max-width:95vw;height:85vh;max-height:720px;position:relative;display:flex;flex-direction:column;';

    var header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#fff;border-bottom:1px solid #eee;flex-shrink:0;';
    header.innerHTML = '<span style="font-weight:600;font-size:15px;color:#1a1a1a;">Pembayaran Larisi</span>';

    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'background:none;border:none;font-size:24px;line-height:1;cursor:pointer;color:#666;padding:0 4px;';
    closeBtn.onclick = function() { overlay.remove(); };
    header.appendChild(closeBtn);

    var iframe = document.createElement('iframe');
    iframe.src = paymentUrl;
    iframe.style.cssText = 'width:100%;flex:1;border:none;';

    modal.appendChild(header);
    modal.appendChild(iframe);
    overlay.appendChild(modal);
    // Tutup jika klik di luar modal
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
}

// Fungsi utama untuk memulai pembayaran Duitku
window.startDuitkuPayment = async function(plan, amount) {
    console.log('Starting Duitku Payment for:', plan, amount);

    try {
        const user = (typeof window.getCurrentUser === 'function') ? await window.getCurrentUser() : null;
        const userProfile = window.userBizProfile || JSON.parse(localStorage.getItem('radar_user_profile') || '{}');
        const userEmail = (user && user.email ? user.email : (userProfile.email || '')).toLowerCase().trim();
        const userName = userProfile.full_name || userProfile.name || (user && user.user_metadata && user.user_metadata.full_name) || 'Pelanggan Larisi';

        const orderId = 'LARISI-' + Date.now();
        if (window.showAnToast) window.showAnToast('Menghubungkan ke Duitku...', 'info');

        const userPhone = userProfile.phone || userProfile.phone_number || '081234567890';

        console.log('[Duitku] Memanggil server untuk invoice...', { orderId, userEmail, userName, plan, amount });
        const response = await fetch(`${window.RADAR_CONFIG.SUPABASE_URL}/functions/v1/duitku-invoice`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.RADAR_CONFIG.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                plan,
                amount,
                email: userEmail,
                name: userName,
                phone: userPhone,
                orderId: orderId
            })
        });

        console.log('[Duitku] Respon server diterima, status:', response.status);
        const result = await response.json();
        console.log('[Duitku] Data dari server:', result);

        if (result.reference || result.paymentUrl) {
            const ref = result.reference || result.paymentUrl;
            const url = result.paymentUrl || ref;
            console.log('[Duitku] Membuka pembayaran:', url);
            if (window.checkout && typeof window.checkout.process === 'function') {
                window.checkout.process(ref);
            } else {
                _openDuitkuIframe(url);
            }
        } else {
            console.error('[Duitku] Gagal: Tidak ada reference/paymentUrl', result);
            throw new Error(result.error || 'Duitku menolak permintaan pembayaran');
        }

    } catch (error) {
        console.error('Duitku Error:', error);
        alert('Maaf, ' + error.message);
    }
};
