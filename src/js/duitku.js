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

        return new Promise((resolve, reject) => {
            if (result.reference || result.paymentUrl) {
                const target = result.reference || result.paymentUrl;
                console.log('[Duitku] Menampilkan popup:', target);
                
                window.checkout.process(target, {
                    onSuccess: function(result) {
                        console.log('[Duitku] Success:', result);
                        if (window.showAnToast) window.showAnToast('Pembayaran berhasil dikonfirmasi!', 'success');
                        resolve(result);
                    },
                    onPending: function(result) {
                        console.log('[Duitku] Pending:', result);
                        if (window.showAnToast) window.showAnToast('Silakan selesaikan pembayaran Anda.', 'info');
                        // Kita biarkan resolve di sini agar modal Larisi tertutup tapi JANGAN refresh dulu
                        // Tapi lebih aman kita biarkan user menutup sendiri
                        resolve(result);
                    },
                    onError: function(result) {
                        console.error('[Duitku] Error:', result);
                        if (window.showAnToast) window.showAnToast('Terjadi kesalahan pembayaran.', 'error');
                        reject(new Error('Gagal memproses pembayaran'));
                    },
                    onClose: function() {
                        console.log('[Duitku] Modal Closed');
                        // Saat user menutup modal Duitku, kita anggap selesai flow UI-nya
                        resolve({ status: 'closed' });
                    }
                });
            } else {
                console.error('[Duitku] Gagal: Tidak ada reference/paymentUrl', result);
                reject(new Error(result.error || 'Duitku menolak permintaan pembayaran'));
            }
        });

    } catch (error) {
        console.error('Duitku Error:', error);
        alert('Maaf, ' + error.message);
    }
};
