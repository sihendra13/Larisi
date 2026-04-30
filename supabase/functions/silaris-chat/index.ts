// RADAR — Edge Function: silaris-chat
// Supabase Edge Function (Deno runtime) — powered by Gemini 2.0 Flash
//
// ─── Deploy Instructions ──────────────────────────────────────────────────────
// 1. Set secret API key:
//      supabase secrets set GEMINI_API_KEY=AIza_xxx...
//
// 2. Deploy function:
//      supabase functions deploy silaris-chat --no-verify-jwt
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL   = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

serve(async (req: Request) => {
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
    messages?:      Array<{ role: string; content: string }>;
    systemPrompt?:  string;
    campaignData?:  Record<string, unknown>;
    autoInsight?:   boolean;
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
  const systemPrompt = body.systemPrompt || "";
  const campaignData = body.campaignData || null;
  const autoInsight  = body.autoInsight  || false;

  // Build messages array — sesuai brief Section 10
  // 1. System prompt permanen (karakter + aturan)
  // 2. Campaign context — selalu inject ulang
  // 3. History chat (max 6)
  // 4. Pesan baru dari user (atau trigger auto-insight)
  const chatMessages: Array<{ role: string; content: string }> = [];

  // System prompt permanen
  if (systemPrompt) {
    chatMessages.push({ role: "system", content: systemPrompt });
  }

  // Campaign context — inject ulang di setiap request
  if (campaignData) {
    chatMessages.push({
      role: "system",
      content: "Data Campaign Aktif:\n" + JSON.stringify(campaignData, null, 2),
    });
  }

  // History chat
  for (const m of messages) {
    chatMessages.push({
      role:    m.role === "ai" ? "assistant" : m.role,
      content: m.content,
    });
  }

  // Kalau auto-insight, tambah trigger message
  if (autoInsight && !messages.length) {
    chatMessages.push({
      role: "user",
      content: "Analisa campaign ini dan berikan insight langsung sesuai format yang sudah kamu ketahui.",
    });
  }

  if (!chatMessages.length) {
    return new Response(JSON.stringify({ error: "No messages to process" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const geminiResp = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GEMINI_API_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model:       GEMINI_MODEL,
        messages:    chatMessages,
        max_tokens:  1000,
        temperature: 0.3,
      }),
    });

    if (!geminiResp.ok) {
      const errText = await geminiResp.text();
      throw new Error(`Gemini API error ${geminiResp.status}: ${errText}`);
    }

    const geminiData = await geminiResp.json();
    const reply = geminiData?.choices?.[0]?.message?.content?.trim() || "";

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
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
});
