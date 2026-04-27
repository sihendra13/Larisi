// RADAR — Edge Function: silaris-chat
// Supabase Edge Function (Deno runtime) — powered by Google Gemini
//
// ─── Deploy Instructions ──────────────────────────────────────────────────────
// 1. Set secret API key (JANGAN pernah taruh di frontend):
//      supabase secrets set GEMINI_API_KEY=AIzaSy...
//
// 2. Deploy function:
//      supabase functions deploy silaris-chat --no-verify-jwt
//
// 3. Test dari terminal:
//      curl -X POST https://mojzmlrdihenvfhrwopd.supabase.co/functions/v1/silaris-chat \
//        -H "Authorization: Bearer <SUPABASE_ANON_KEY>" \
//        -H "Content-Type: application/json" \
//        -d '{"messages":[{"role":"user","content":"Halo, bantu saya optimalkan kampanye Instagram"}],"systemPrompt":"Kamu adalah SiLaris..."}'
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY not set" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  let body: {
    messages?:     Array<{ role: string; content: string }>;
    systemPrompt?: string;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const messages     = body.messages     || [];
  const systemPrompt = body.systemPrompt || "Kamu adalah SiLaris, co-pilot marketing AI untuk UMKM Indonesia di platform Larisi. Gunakan bahasa Indonesia santai, singkat, dan actionable.";

  if (!messages.length) {
    return new Response(JSON.stringify({ error: "messages array is empty" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Convert to Gemini format:
  // - roles: 'user' stays 'user', 'ai'/'assistant' becomes 'model'
  // - content string → parts array
  const contents = messages.map((m) => ({
    role:  (m.role === "user") ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  // Gemini requires first message to be from 'user'
  // and alternating user/model roles
  const validContents = contents.filter((_, i) => {
    if (i === 0) return contents[0].role === "user";
    return true;
  });

  try {
    const geminiResp = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: validContents,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature:     0.7,
        },
      }),
    });

    if (!geminiResp.ok) {
      const errText = await geminiResp.text();
      throw new Error(`Gemini API error ${geminiResp.status}: ${errText}`);
    }

    const geminiData = await geminiResp.json();
    const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!reply) throw new Error("Empty response from Gemini");

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[silaris-chat] Gemini API error:", msg);

    return new Response(
      JSON.stringify({ reply: null, error: msg }),
      {
        status: 200, // return 200 so frontend handles fallback gracefully
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
});
