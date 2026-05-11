// Fungsi utama untuk memulai pembayaran Duitku
window.startDuitkuPayment = async function(plan, amount) {
    console.log('Starting Duitku Payment for:', plan, amount);
    
    try {
        // 1. Ambil Email Pengguna secara akurat
        const user = (typeof window.getCurrentUser === 'function') ? await window.getCurrentUser() : null;
        const userProfile = window.userBizProfile || JSON.parse(localStorage.getItem('radar_user_profile') || '{}');
        const userEmail = (user && user.email ? user.email : (userProfile.email || '')).toLowerCase().trim();

        // 2. PROTEKSI: Hanya aktif untuk akun verifikator
        if (userEmail !== 'halo@larisi.id') {
            alert('Fitur pembayaran sedang disiapkan. Tim kami akan segera menghubungi Anda untuk proses aktivasi paket ' + plan.toUpperCase() + '. Terima kasih!');
            if (window.showAnToast) window.showAnToast('Fitur segera hadir!', 'info');
            const modal = document.getElementById('trial-modal');
            if (modal) modal.style.display = 'none';
            return;
        }

        // 3. Persiapkan Data Transaksi
        const orderId = 'LARISI-' + Date.now();
        if (window.showAnToast) window.showAnToast('Menghubungkan ke Duitku...', 'info');

        // 4. Panggil Backend (Edge Function)
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
                orderId: orderId
            })
        });

        const result = await response.json();

        if (result.paymentUrl) {
            // 5. Buka Popup Duitku
            window.checkout.open(result.paymentUrl, {
                onSuccess: async function (res) {
                    console.log('Payment Success:', res);
                    if (window.showAnToast) window.showAnToast('Pembayaran Berhasil!', 'success');
                    
                    const newProfileData = {
                        selected_plan: plan,
                        trial_start: new Date().toISOString(),
                        trial_days: 0
                    };
                    await window.updateUserProfile(newProfileData);
                    setTimeout(() => window.location.reload(), 2000);
                },
                onPending: function (res) {
                    alert('Pembayaran tertunda. Silakan selesaikan pembayaran Anda.');
                },
                onError: function (res) {
                    alert('Pembayaran gagal: ' + (res.resultInfo || 'Terjadi kesalahan'));
                },
                onCanceled: function (res) {
                    if (window.showAnToast) window.showAnToast('Pembayaran dibatalkan', 'info');
                }
            });
        } else {
            throw new Error(result.error || 'Gagal mendapatkan link pembayaran');
        }

    } catch (error) {
        console.error('Duitku Error:', error);
        alert('Maaf, sistem pembayaran sedang mengalami gangguan teknis (Edge Function). Mohon coba lagi nanti.');
    }
};
