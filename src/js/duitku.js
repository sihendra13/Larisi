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
            throw new Error(result.error || 'Duitku menolak permintaan pembayaran');
        }

    } catch (error) {
        console.error('Duitku Error:', error);
        alert('Maaf, ' + error.message);
    }
};
