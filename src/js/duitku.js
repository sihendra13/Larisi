// Fungsi utama untuk memulai pembayaran Duitku
window.startDuitkuPayment = async function(plan, amount) {
    console.log('Starting Duitku Payment for:', plan, amount);
    
    try {
        const user = (typeof window.getCurrentUser === 'function') ? await window.getCurrentUser() : null;
        const userProfile = window.userBizProfile || JSON.parse(localStorage.getItem('radar_user_profile') || '{}');
        const userEmail = (user && user.email ? user.email : (userProfile.email || '')).toLowerCase().trim();

        if (userEmail !== 'halo@larisi.id') {
            alert('Fitur pembayaran sedang disiapkan.');
            return;
        }

        const orderId = 'LARISI-' + Date.now();
        if (window.showAnToast) window.showAnToast('Menghubungkan ke Duitku...', 'info');

        const userPhone = userProfile.phone || userProfile.phone_number || '081234567890';

        console.log('[Duitku] Memanggil server untuk invoice...', { orderId, userEmail, plan, amount });
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
                name: userProfile.full_name || 'Pelanggan Larisi',
                phone: userPhone,
                orderId: orderId
            })
        });

        console.log('[Duitku] Respon server diterima, status:', response.status);
        const result = await response.json();
        console.log('[Duitku] Data dari server:', result);

        if (result.reference) {
            console.log('[Duitku] Menampilkan popup dengan reference:', result.reference);
            window.checkout.process(result.reference);
        } else if (result.paymentUrl) {
            console.log('[Duitku] Menampilkan popup dengan paymentUrl:', result.paymentUrl);
            window.checkout.process(result.paymentUrl);
        } else {
            console.error('[Duitku] Gagal: Tidak ada reference/paymentUrl', result);
            throw new Error(result.error || 'Duitku menolak permintaan pembayaran');
        }

    } catch (error) {
        console.error('Duitku Error:', error);
        alert('Maaf, ' + error.message);
    }
};
