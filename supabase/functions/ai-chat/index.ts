import { corsHeaders, errorResponse, jsonResponse } from "../_shared/cors.ts";
import { getSupabaseAdmin } from "../_shared/supabase.ts";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatPayload {
  sessionId: string;
  messages: ChatMessage[];
}

const SYSTEM_PROMPT =
  "You are the RFC Food Safety Consulting assistant — a professional AI representative for RFC. " +
  "Your role is strictly to assist with food safety compliance (FSSC 22000, HACCP, R638, BRCGS, GLOBALG.A.P.), " +
  "RFC's four divisions (Consulting, Academy, Comply Cloud, Pest Control), booking consultations and demos, " +
  "training course recommendations, and audit readiness guidance. " +
  "RFC is based in Pretoria and serves all 9 provinces. " +
  "Contact: Phone/WhatsApp +27 83 415 0748 | Email: info@rfcsa.co.za. " +
  "All RFC Academy courses are SAATCA-accredited. " +
  "Comply Cloud is South Africa's first cloud-based food safety compliance platform. " +
  "IMPORTANT RULES: You must remain strictly professional at all times. " +
  "If asked to tell jokes, engage in casual or personal conversation, discuss topics unrelated to food safety or RFC's services, " +
  "or behave in any manner inconsistent with a professional business representative, politely decline and redirect to how you can assist with RFC's services. " +
  "Never roleplay, never generate creative content, never discuss competitors, and never deviate from your professional role. " +
  "Keep all responses concise and factual. If you cannot answer a specific question, suggest booking a consultation.";

async function callGroq(messages: ChatMessage[]): Promise<string> {
  const apiKey = Deno.env.get("GROQ_API_KEY");
  if (!apiKey) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return (
    data.choices?.[0]?.message?.content?.trim() ||
    "I'm not sure how to respond to that. Can I help you book a consultation?"
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    const body = (await req.json()) as ChatPayload;
    const { sessionId, messages } = body;

    if (!sessionId?.trim()) {
      return errorResponse("sessionId is required");
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return errorResponse("messages must be a non-empty array");
    }

    const groqMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const reply = await callGroq(groqMessages);

    const supabase = getSupabaseAdmin();
    const updatedMessages = [...messages, { role: "assistant", content: reply }];

    const { error: upsertError } = await supabase
      .from("chat_conversations")
      .upsert(
        {
          session_id: sessionId,
          messages: updatedMessages,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "session_id" }
      );

    if (upsertError) {
      console.error("Conversation upsert error:", upsertError);
    }

    return jsonResponse({ message: reply });
  } catch (err) {
    console.error("Unexpected error:", err);
    return errorResponse(err instanceof Error ? err.message : "Chat request failed", 500);
  }
});
