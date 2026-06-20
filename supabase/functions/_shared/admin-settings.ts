import { getSupabaseAdmin } from "./supabase.ts";

interface AdminSettings {
  notification_email: string;
  notify_on_booking: boolean;
  notify_on_contact: boolean;
  notify_on_quiz: boolean;
  notify_on_quote: boolean;
}

const DEFAULTS: AdminSettings = {
  notification_email: "info@rfcsa.co.za",
  notify_on_booking: true,
  notify_on_contact: true,
  notify_on_quiz: true,
  notify_on_quote: true,
};

export async function getAdminSettings(): Promise<AdminSettings> {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from("admin_settings").select("key, value");
    if (!data || data.length === 0) return DEFAULTS;
    const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
    return {
      notification_email: map.notification_email ?? DEFAULTS.notification_email,
      notify_on_booking: map.notify_on_booking !== "false",
      notify_on_contact: map.notify_on_contact !== "false",
      notify_on_quiz: map.notify_on_quiz !== "false",
      notify_on_quote: map.notify_on_quote !== "false",
    };
  } catch {
    return DEFAULTS;
  }
}
