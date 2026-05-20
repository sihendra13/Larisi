import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import md5 from "npm:md5"

serve(async (req) => {
  try {
    const body = await req.json()
    const {
      merchantCode,
      amount,
      merchantOrderId,
      additionalParam,
      resultCode,
      reference,
      signature: incomingSignature,
    } = body

    const apiKey = Deno.env.get('DUITKU_API_KEY') || ''

    // Verifikasi signature: md5(merchantCode + amount + merchantOrderId + apiKey)
    const expectedSignature = md5(merchantCode + amount + merchantOrderId + apiKey)
    if (incomingSignature !== expectedSignature) {
      console.error('[Callback] Signature tidak valid')
      return new Response('Bad signature', { status: 403 })
    }

    // resultCode '00' = sukses
    if (resultCode !== '00') {
      console.log('[Callback] Pembayaran belum sukses, resultCode:', resultCode)
      return new Response('OK', { status: 200 })
    }

    // Parse additionalParam untuk ambil userId dan plan
    let userId = '', plan = 'pro'
    try {
      const extra = JSON.parse(additionalParam || '{}')
      userId = extra.userId || ''
      plan = extra.plan || 'pro'
    } catch (_) {}

    if (!userId) {
      console.error('[Callback] userId kosong di additionalParam')
      return new Response('Missing userId', { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Hitung tanggal kadaluarsa 30 hari dari sekarang
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Update selected_plan di tabel profiles
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({
        selected_plan: plan,
        plan_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (updateErr) {
      console.error('[Callback] Gagal update plan:', updateErr.message)
      return new Response('DB error', { status: 500 })
    }

    console.log('[Callback] Subscription berhasil diupgrade:', userId, '->', plan, 'expires:', expiresAt.toISOString())
    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('[Callback] Error:', error.message)
    return new Response('Error', { status: 500 })
  }
})
