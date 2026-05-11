import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import md5 from "npm:md5"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plan, amount, email, name, orderId } = await req.json()

    // 1. Ambil data Merchant
    const merchantCode = Deno.env.get('DUITKU_MERCHANT_CODE') || 'DS30544'
    const apiKey = Deno.env.get('DUITKU_API_KEY') || '01a6dcb08d58cbad3a2edd90253c89f5'
    
    // 2. Buat Signature sesuai rumus Duitku v2:
    // md5(merchantCode + merchantOrderId + paymentAmount + apiKey)
    const signatureSource = merchantCode + orderId + String(amount) + apiKey
    const signature = md5(signatureSource)

    const duitkuUrl = 'https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry'
    
    const payload = {
      merchantCode,
      paymentAmount: parseInt(amount),
      merchantOrderId: orderId,
      productDetails: `Paket ${plan.toUpperCase()}`,
      email: email,
      customerVaName: name,
      callbackUrl: 'https://larisi.id/callback',
      returnUrl: 'https://app.larisi.id',
      expiryPeriod: 60,
      signature: signature,
      itemDetails: [{
          name: `Paket ${plan.toUpperCase()}`,
          price: parseInt(amount),
          quantity: 1
      }]
    }

    console.log('Signature Source (Safe):', merchantCode + orderId + String(amount) + '***');

    const response = await fetch(duitkuUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (result.paymentUrl) {
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
    } else {
        const errorMsg = result.resultMessage || result.responseMessage || JSON.stringify(result)
        return new Response(JSON.stringify({ 
            error: `Duitku: ${errorMsg}`,
            details: result 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
