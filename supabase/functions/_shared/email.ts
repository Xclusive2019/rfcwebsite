import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  reply_to?: string;
}

// All outgoing mail is sent through the xneelo noreply mailbox. Because xneelo
// authenticates the SMTP session against this account, the `from` address must
// be this same mailbox (noreply@rfcsa.co.za) or the message is rejected. Override via SMTP_FROM.
export const FROM_ADDRESS = Deno.env.get("SMTP_FROM") ?? "RFC SA <noreply@rfcsa.co.za>";

function getConfig() {
  const hostname = Deno.env.get("SMTP_HOST") ?? "mail.rfcsa.co.za";
  const port = Number(Deno.env.get("SMTP_PORT") ?? "465");
  const username = Deno.env.get("SMTP_USERNAME") ?? "noreply@rfcsa.co.za";
  const password = Deno.env.get("SMTP_PASSWORD");

  if (!password) {
    throw new Error("Missing SMTP_PASSWORD environment variable");
  }

  return { hostname, port, username, password };
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const { hostname, port, username, password } = getConfig();

  // Port 465 uses implicit TLS; 587 (and others) negotiate STARTTLS.
  const client = new SMTPClient({
    connection: {
      hostname,
      port,
      tls: port === 465,
      auth: { username, password },
    },
  });

  const to = Array.isArray(payload.to) ? payload.to : [payload.to];

  try {
    await client.send({
      from: payload.from ?? FROM_ADDRESS,
      to,
      replyTo: payload.reply_to,
      subject: payload.subject,
      // denomailer derives a plaintext part from the HTML when content is "auto".
      content: payload.text ?? "auto",
      html: payload.html,
    });
  } finally {
    await client.close();
  }
}
