// Shared branded HTML wrapper for all outgoing emails.
// The RFC logo is bright green on transparent, so it sits on a dark header.
// Override the logo via EMAIL_LOGO_URL if the asset ever moves.
const LOGO_URL = Deno.env.get("EMAIL_LOGO_URL") ??
  "https://rfcsa.co.za/RFC_logo-removebg-preview.png";
const BRAND = "#4A7C2F";

interface WrapOptions {
  // Optional preheader text shown as the inbox preview snippet (hidden in body).
  preheader?: string;
}

export function wrapEmail(innerHtml: string, options: WrapOptions = {}): string {
  const preheader = options.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${options.preheader}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;-webkit-text-size-adjust:100%;">
  ${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:#0a0a0c;padding:28px 32px;text-align:center;">
              <img src="${LOGO_URL}" alt="RFC SA" width="150" style="display:inline-block;width:150px;max-width:60%;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;color:#1a1a1e;font-size:15px;line-height:1.6;">
              ${innerHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:#f8f8f7;border-top:1px solid #e5e5e5;font-family:Arial,Helvetica,sans-serif;color:#888888;font-size:12px;line-height:1.6;text-align:center;">
              RFC SA &middot; Food Safety Consulting, Training &amp; Compliance<br />
              <a href="https://rfcsa.co.za" style="color:${BRAND};text-decoration:none;">rfcsa.co.za</a> &middot; info@rfcsa.co.za
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
