// RADAR — Edge Function: silaris-chat
// Supabase Edge Function (Deno runtime) — powered by Groq (Llama 3.1)
//
// ─── Deploy Instructions ──────────────────────────────────────────────────────
// 1. Set secret API key:
//      supabase secrets set GROQ_API_KEY=gsk_xxx...
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

const GROQ_MODEL = "llama-3.1-8b-instant";
const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";

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

  const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
  if (!GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "GROQ_API_KEY not set" }), {
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

  // Groq uses OpenAI-compatible format
  // Map 'ai' role → 'assistant', keep 'user' as is
  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role:    m.role === "ai" ? "assistant" : m.role,
      content: m.content,
    })),
  ];

  try {
    const groqResp = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model:      GROQ_MODEL,
        messages:   chatMessages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!groqResp.ok) {
      const errText = await groqResp.text();
      throw new Error(`Groq API error ${groqResp.status}: ${errText}`);
    }

    const groqData = await groqResp.json();
    const reply = groqData?.choices?.[0]?.message?.content?.trim() || "";

    if (!reply) throw new Error("Empty response from Groq");

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[silaris-chat] Groq API error:", msg);

    return new Response(
      JSON.stringify({ reply: null, error: msg }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
});
