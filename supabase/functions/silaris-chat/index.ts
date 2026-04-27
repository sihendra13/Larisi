// RADAR — Edge Function: silaris-chat
// Supabase Edge Function (Deno runtime)
//
// ─── Deploy Instructions ──────────────────────────────────────────────────────
// 1. Install Supabase CLI:
//      brew install supabase/tap/supabase
//
// 2. Login & link project:
//      supabase login
//      supabase link --project-ref mojzmlrdihenvfhrwopd
//
// 3. Set secret API key (JANGAN pernah taruh di frontend):
//      supabase secrets set CLAUDE_API_KEY=sk-ant-api03-xxx
//
// 4. Deploy function:
//      supabase functions deploy silaris-chat --no-verify-jwt
//
// 5. Test dari terminal:
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

  const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY");
  if (!CLAUDE_API_KEY) {
    return new Response(JSON.stringify({ error: "CLAUDE_API_KEY not set" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  let body: {
    messages?:    Array<{ role: string; content: string }>;
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

  const messages    = body.messages    || [];
  const systemPrompt = body.systemPrompt || "Kamu adalah SiLaris, co-pilot marketing AI untuk UMKM Indonesia di platform Larisi. Gunakan bahasa Indonesia santai, singkat, dan actionable.";

  if (!messages.length) {
    return new Response(JSON.stringify({ error: "messages array is empty" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Normalize roles: chatHistory uses 'ai', Claude API needs 'assistant'
  const normalizedMessages = messages.map((m) => ({
    role:    m.role === "ai" ? "assistant" : m.role,
    content: m.content,
  }));

  try {
    const claudeResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key":         CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type":      "application/json",
      },
      body: JSON.stringify({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system:     systemPrompt,
        messages:   normalizedMessages,
      }),
    });

    if (!claudeResp.ok) {
      const errText = await claudeResp.text();
      throw new Error(`Claude API error ${claudeResp.status}: ${errText}`);
    }

    const claudeData = await claudeResp.json();
    const reply = claudeData?.content?.[0]?.text?.trim() || "";

    if (!reply) throw new Error("Empty response from Claude");

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[silaris-chat] Claude API error:", msg);

    return new Response(
      JSON.stringify({
        reply: null,
        error: msg,
      }),
      {
        status: 200, // return 200 so frontend handles fallback gracefully
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
});
