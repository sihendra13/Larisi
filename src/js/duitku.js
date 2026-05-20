// Buka halaman Duitku sebagai popup window centered (passport.duitku.com blokir iframe)
function _openDuitkuPopup(paymentUrl) {
    var w = 480, h = 720;
    var left = Math.round((screen.width - w) / 2);
    var top = Math.round((screen.height - h) / 2);
    var win = window.open(paymentUrl, 'duitku_payment',
        'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left + ',resizable=yes,scrollbars=yes,toolbar=no,menubar=no');
    if (!win) {
        // Popup blocker aktif — fallback ke tab baru
        window.open(paymentUrl, '_blank');
    }
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
                orderId: orderId,
                userId: user ? user.id : ''
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
                _openDuitkuPopup(url);
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
