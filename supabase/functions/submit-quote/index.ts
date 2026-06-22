import { corsHeaders, errorResponse, jsonResponse } from "../_shared/cors.ts";
import { sendEmail } from "../_shared/email.ts";
import { wrapEmail } from "../_shared/email-template.ts";
import { escapeHtml } from "../_shared/formatting.ts";
import { getSupabaseAdmin } from "../_shared/supabase.ts";
import { getAdminSettings } from "../_shared/admin-settings.ts";
import { isValidEmail } from "../_shared/validation.ts";

interface QuotePayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  productCode?: string;
  productName?: string;
  productPack?: string;
  unitPrice?: number;
  quantity?: number;
  message?: string;
}

function formatPrice(value: number): string {
  return "R" + value.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    const body = (await req.json()) as QuotePayload;
    const { name, email, phone, company, productCode, productName, productPack, unitPrice, message } = body;

    if (!name?.trim() || !email?.trim()) {
      return errorResponse("Name and email are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      return errorResponse("Invalid email address");
    }

    const quantity = Number.isFinite(body.quantity) && (body.quantity ?? 0) > 0
      ? Math.floor(body.quantity as number)
      : null;

    const supabase = getSupabaseAdmin();

    const { error: insertError } = await supabase.from("quote_requests").insert({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      product_code: productCode?.trim() || null,
      product_name: productName?.trim() || null,
      product_pack: productPack?.trim() || null,
      unit_price: typeof unitPrice === "number" ? unitPrice : null,
      quantity,
      message: message?.trim() || null,
    });

    if (insertError) {
      throw insertError;
    }

    const adminSettings = await getAdminSettings();

    if (adminSettings.notify_on_quote) {
      const productLine = productName
        ? `${productName}${productCode ? ` (${productCode})` : ""}`
        : "General / bulk enquiry";
      const priceLine = typeof unitPrice === "number" ? `${formatPrice(unitPrice)} ea. excl. VAT` : "—";

      const htmlBody = `
        <h2>New Quote Request</h2>
        <p><strong>Product:</strong> ${escapeHtml(productLine)}</p>
        <p><strong>Pack:</strong> ${escapeHtml(productPack || "—")}</p>
        <p><strong>Listed Price:</strong> ${escapeHtml(priceLine)}</p>
        <p><strong>Quantity Required:</strong> ${quantity ?? "Not specified"}</p>
        <hr />
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(normalizedEmail)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>
        ${message ? `<p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>` : ""}
      `;

      const textBody = [
        "New Quote Request",
        "",
        `Product: ${productLine}`,
        `Pack: ${productPack || "—"}`,
        `Listed Price: ${priceLine}`,
        `Quantity Required: ${quantity ?? "Not specified"}`,
        "",
        `Name: ${name}`,
        `Email: ${normalizedEmail}`,
        `Phone: ${phone || "Not provided"}`,
        `Company: ${company || "Not provided"}`,
        ...(message ? ["", "Message:", message] : []),
      ].join("\n");

      try {
        await sendEmail({
          to: adminSettings.notification_email,
          reply_to: normalizedEmail,
          subject: `New quote request — ${productLine}`,
          text: textBody,
          html: wrapEmail(htmlBody, { preheader: `Quote request from ${name} — ${productLine}.` }),
        });
      } catch (emailError) {
        // Don't fail the request if the notification email can't be sent.
        console.error("submit-quote email error:", emailError);
      }
    }

    return jsonResponse({ success: true, message: "Quote request received" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("submit-quote error:", error);
    return jsonResponse({ success: false, error: message }, 500);
  }
});
