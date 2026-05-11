import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plan, amount, email, name, orderId } = await req.json()

    // Ambil kredensial dari Environment Variables Supabase (Lebih Aman)
    const merchantCode = Deno.env.get('DUITKU_MERCHANT_CODE') || 'DS30544'
    const apiKey = Deno.env.get('DUITKU_API_KEY') || '01a6dcb08d58cbad3a2edd90253c89f5'
    
    // Generate Signature
    // MD5(merchantCode + orderId + amount + apiKey)
    const dataToHash = merchantCode + orderId + amount + apiKey
    const hashBuffer = await crypto.subtle.digest("MD5", new TextEncoder().encode(dataToHash))
    const signature = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')

    // Panggil API Duitku (Sandbox)
    const duitkuUrl = 'https://payment-sandbox.duitku.com/api/merchant/v2/inquiry'
    
    const payload = {
      merchantCode,
      paymentAmount: parseInt(amount),
      merchantOrderId: orderId,
      productDetails: `Langganan Larisi Paket ${plan.toUpperCase()}`,
      email: email,
      customerVaName: name,
      callbackUrl: 'https://larisi.id/callback',
      returnUrl: 'https://app.larisi.id', // URL setelah bayar sukses
      expiryPeriod: 60,
      signature: signature
    }

    const response = await fetch(duitkuUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
