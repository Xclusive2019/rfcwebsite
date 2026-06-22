import { corsHeaders, errorResponse, jsonResponse } from "../_shared/cors.ts";
import { FROM_ADDRESS, sendEmail } from "../_shared/email.ts";
import { wrapEmail } from "../_shared/email-template.ts";
import { escapeHtml, formatDate } from "../_shared/formatting.ts";
import { getSupabaseAdmin } from "../_shared/supabase.ts";
import { getAdminSettings } from "../_shared/admin-settings.ts";
import {
  isFutureOrTodayDate,
  isValidEmail,
  isValidTime,
  isWeekday,
} from "../_shared/validation.ts";

interface BookingPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  notes?: string;
  bookingDate: string;
  bookingTime: string;
  division?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    const body = (await req.json()) as BookingPayload;
    const { name, email, service, bookingDate, bookingTime } = body;

    if (!name?.trim() || !email?.trim() || !service?.trim() || !bookingDate || !bookingTime) {
      return errorResponse("Missing required fields");
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return errorResponse("Invalid email address");
    }

    if (!isValidTime(bookingTime)) {
      return errorResponse("Invalid booking time");
    }

    if (!isFutureOrTodayDate(bookingDate)) {
      return errorResponse("Booking date cannot be in the past");
    }

    if (!isWeekday(bookingDate)) {
      return errorResponse("Bookings are only available on weekdays");
    }

    const supabase = getSupabaseAdmin();
    const adminSettings = await getAdminSettings();

    const { data: existing, error: checkError } = await supabase
      .from("bookings")
      .select("id")
      .eq("booking_date", bookingDate)
      .eq("booking_time", bookingTime)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase availability check error:", checkError);
      return errorResponse("Failed to check availability", 500);
    }

    if (existing) {
      return errorResponse("This time slot is already booked", 409);
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        phone: body.phone?.trim() || null,
        company: body.company?.trim() || null,
        service: service.trim(),
        booking_date: bookingDate,
        booking_time: bookingTime,
        notes: body.notes?.trim() || null,
        division: body.division?.trim() || null,
        status: "confirmed",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return errorResponse("Failed to create booking", 500);
    }

    const formattedDate = formatDate(bookingDate);
    const fromAddress = FROM_ADDRESS;

    const safeName = escapeHtml(name.trim());
    const safeService = escapeHtml(service.trim());
    const safePhone = escapeHtml(body.phone?.trim() || "Not provided");
    const safeCompany = escapeHtml(body.company?.trim() || "Not provided");
    const safeDivision = escapeHtml(body.division?.trim() || "Not provided");
    const safeNotes = escapeHtml(body.notes?.trim() || "None");
    const safeTime = escapeHtml(bookingTime);
    const safeEmail = escapeHtml(normalizedEmail);

    const customerHtml = `<p>Hi ${safeName},</p>
<p>Your consultation has been booked for <strong>${formattedDate} at ${safeTime}</strong>.</p>
<p><strong>Service:</strong> ${safeService}</p>
<p>What to expect:</p>
<ul>
<li>A 30-minute call focused on your food safety needs and compliance goals.</li>
<li>A gap assessment against relevant regulations and standards.</li>
<li>Clear next steps with a tailored action plan and cost estimate — no obligation.</li>
</ul>
<p>Our team will call you at the scheduled time. If you need to reschedule, reply to this email or contact us at info@rfcsa.co.za.</p>
<p>Best regards,<br>RFC SA Team</p>`;

    const customerText = `Hi ${name.trim()},

Your consultation has been booked for ${formattedDate} at ${bookingTime}.

Service: ${service.trim()}

What to expect:
- A 30-minute call focused on your food safety needs and compliance goals.
- A gap assessment against relevant regulations and standards.
- Clear next steps with a tailored action plan and cost estimate — no obligation.

Our team will call you at the scheduled time. If you need to reschedule, reply to this email or contact us at info@rfcsa.co.za.

Best regards,
RFC SA Team`;

    const internalHtml = `<p>A new consultation booking has been received.</p>
<ul>
<li><strong>Name:</strong> ${safeName}</li>
<li><strong>Email:</strong> ${safeEmail}</li>
<li><strong>Phone:</strong> ${safePhone}</li>
<li><strong>Company:</strong> ${safeCompany}</li>
<li><strong>Division:</strong> ${safeDivision}</li>
<li><strong>Service:</strong> ${safeService}</li>
<li><strong>Date:</strong> ${formattedDate}</li>
<li><strong>Time:</strong> ${safeTime}</li>
<li><strong>Notes:</strong> ${safeNotes}</li>
</ul>`;

    const internalText = `A new consultation booking has been received.

Name: ${name.trim()}
Email: ${normalizedEmail}
Phone: ${body.phone?.trim() || "Not provided"}
Company: ${body.company?.trim() || "Not provided"}
Division: ${body.division?.trim() || "Not provided"}
Service: ${service.trim()}
Date: ${formattedDate}
Time: ${bookingTime}
Notes: ${body.notes?.trim() || "None"}`;

    const emailTasks = [
      sendEmail({
        from: fromAddress,
        to: [normalizedEmail],
        subject: "Your RFC consultation is booked",
        html: wrapEmail(customerHtml, { preheader: `Your consultation is booked for ${formattedDate} at ${bookingTime}.` }),
        text: customerText,
      }),
    ];

    if (adminSettings.notify_on_booking) {
      emailTasks.push(
        sendEmail({
          from: fromAddress,
          to: [adminSettings.notification_email],
          subject: "New booking received",
          html: wrapEmail(internalHtml, { preheader: `${name.trim()} booked ${service.trim()} on ${formattedDate}.` }),
          text: internalText,
        }),
      );
    }

    const results = await Promise.allSettled(emailTasks);

    if (results[0].status === "rejected") {
      console.error("Failed to send customer confirmation email:", results[0].reason);
    }

    if (results[1].status === "rejected") {
      console.error("Failed to send internal notification email:", results[1].reason);
    }

    return jsonResponse({ success: true, id: data.id, message: "Booking created successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return errorResponse("Invalid request", 400);
  }
});
