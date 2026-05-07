// RADAR — Edge Function: groq-vision
// Analisis gambar dengan Groq Vision API untuk mendeteksi kategori konten.
// Mengembalikan satu kata kategori yang dipetakan ke Master Persona.
//
// ─── Deploy ───────────────────────────────────────────────────
// supabase functions deploy groq-vision --no-verify-jwt
// (GROQ_API_KEY sudah di-set di Supabase Secrets)
// ─────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "https://larisi.vercel.app",
  "https://app.larisi.id",
];

function getCors(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin":  allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };
}

// Kategori valid yang bisa dikembalikan Groq
const VALID_CATS = [
  "makanan", "minuman", "pakaian", "kendaraan", "elektronik",
  "properti", "kosmetik", "bayi", "tanaman", "hewan",
  "manusia", "dokumen", "furniture", "olahraga", "seni", "general",
];

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

const SYSTEM_PROMPT = `You are an image classification system. Respond with exactly ONE Indonesian word from the provided list. No explanations, no sentences, no other words.`;

const PROMPT = `What is the main object in this photo? Choose exactly ONE word:

makanan — food, burger, rice, noodles, cake, snack, any food
minuman — drink, coffee, tea, juice, beverage
pakaian — clothing, shirt, dress, hijab, pants, fashion
kendaraan — vehicle, car, motorcycle, bicycle
elektronik — phone, laptop, gadget, camera, electronics
properti — house, building, apartment, real estate
kosmetik — makeup, lipstick, skincare, beauty product
bayi — baby product, diaper, stroller, toy
tanaman — plant, flower, tree, leaf
hewan — animal, cat, dog, bird, pet
manusia — person, selfie, human face, people
furniture — chair, table, sofa, cabinet
olahraga — sport, shoes, gym equipment, exercise
seni — art, painting, craft, artwork

Reply with ONE WORD only (e.g.: makanan):`;


serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: getCors(req) });
  }

  const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") || "";
  if (!GROQ_API_KEY) {
    return json({ error: "GROQ_API_KEY not set", category: "general" }, 500, req);
  }

  let body: { image?: string; mime?: string } = {};
  try { body = await req.json(); } catch { /* empty body ok */ }

  const { image, mime = "image/jpeg" } = body;
  if (!image) {
    return json({ error: "image (base64) required", category: "general" }, 400, req);
  }

  // Batasi ukuran payload: 4 MB base64 ≈ 3 MB gambar
  if (image.length > 4_000_000) {
    return json({ error: "image too large", category: "general" }, 413, req);
  }

  try {
    const resp = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model:       VISION_MODEL,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: [
              { type: "text",      text: PROMPT },
              { type: "image_url", image_url: { url: `data:${mime};base64,${image}` } },
            ],
          },
        ],
        max_tokens:  15,
        temperature: 0,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("[groq-vision] Groq API error:", resp.status, errText);
      return json({ category: "general", _groqError: resp.status }, 200, req);
    }

    type GroqResp = { choices?: Array<{ message?: { content?: string } }> };
    const data = await resp.json() as GroqResp;
    const raw  = (data?.choices?.[0]?.message?.content || "").trim().toLowerCase();

    // Cari kata valid di mana saja dalam respons (model kadang tulis kalimat pendek)
    let category = "general";
    for (const cat of VALID_CATS) {
      // Pastikan match kata utuh (bukan substring) — cek dengan word boundary sederhana
      const idx = raw.indexOf(cat);
      if (idx !== -1) {
        const before = idx === 0 ? "" : raw[idx - 1];
        const after  = idx + cat.length >= raw.length ? "" : raw[idx + cat.length];
        const wordBoundary = /[a-z]/.test(before) === false && /[a-z]/.test(after) === false;
        if (wordBoundary) { category = cat; break; }
      }
    }

    return json({ category }, 200, req);

  } catch (e) {
    console.error("[groq-vision] fetch error:", String(e));
    return json({ category: "general", _error: String(e) }, 200, req);
  }
});

function json(data: unknown, status = 200, req?: Request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...(req ? getCors(req) : {}),
      "Content-Type": "application/json",
    },
  });
}
