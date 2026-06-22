import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

interface Settings {
  notification_email: string;
  notify_on_booking: boolean;
  notify_on_contact: boolean;
  notify_on_quiz: boolean;
  notify_on_quote: boolean;
  comply_cloud_system_url: string;
  virtual_training_register_url: string;
  elearning_url: string;
}

const defaults: Settings = {
  notification_email: "noreply@rfcsa.co.za",
  notify_on_booking: true,
  notify_on_contact: true,
  notify_on_quiz: true,
  notify_on_quote: true,
  comply_cloud_system_url: "https://complycloud.flowsheet.co.za/",
  virtual_training_register_url: "https://complycloud.flowsheet.co.za/public/checklists/view/173/23",
  elearning_url: "https://rfcacademy.co.za",
};

function parseSettings(rows: { key: string; value: string }[]): Settings {
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    notification_email: map.notification_email ?? defaults.notification_email,
    notify_on_booking: map.notify_on_booking !== "false",
    notify_on_contact: map.notify_on_contact !== "false",
    notify_on_quiz: map.notify_on_quiz !== "false",
    notify_on_quote: map.notify_on_quote !== "false",
    comply_cloud_system_url: map.comply_cloud_system_url ?? defaults.comply_cloud_system_url,
    virtual_training_register_url: map.virtual_training_register_url ?? defaults.virtual_training_register_url,
    elearning_url: map.elearning_url ?? defaults.elearning_url,
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("admin_settings")
      .select("key, value")
      .then(({ data }) => {
        if (data) setSettings(parseSettings(data as { key: string; value: string }[]));
        setLoading(false);
      });
  }, []);

  function set<K extends keyof Settings>(key: K, val: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings.notification_email.trim()) {
      toast.error("Notification email is required");
      return;
    }
    setSaving(true);
    const rows = [
      { key: "notification_email", value: settings.notification_email },
      { key: "notify_on_booking", value: String(settings.notify_on_booking) },
      { key: "notify_on_contact", value: String(settings.notify_on_contact) },
      { key: "notify_on_quiz", value: String(settings.notify_on_quiz) },
      { key: "notify_on_quote", value: String(settings.notify_on_quote) },
      { key: "comply_cloud_system_url", value: settings.comply_cloud_system_url.trim() },
      { key: "virtual_training_register_url", value: settings.virtual_training_register_url.trim() },
      { key: "elearning_url", value: settings.elearning_url.trim() },
    ];
    const { error } = await supabase.from("admin_settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email Notifications</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notification Email</label>
            <input
              type="email"
              required
              value={settings.notification_email}
              onChange={(e) => set("notification_email", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A7C2F] transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1.5">All notification emails are sent to this address.</p>
          </div>

          <div className="space-y-3 pt-1">
            <p className="text-sm font-medium text-gray-700">Send notifications for:</p>

            {(
              [
                { key: "notify_on_booking" as const, label: "New bookings", desc: "When a visitor submits a consultation request" },
                { key: "notify_on_contact" as const, label: "Contact form submissions", desc: "When a visitor sends a contact message" },
                { key: "notify_on_quiz" as const, label: "Quiz completions", desc: "When someone completes the audit readiness quiz" },
                { key: "notify_on_quote" as const, label: "Quote requests", desc: "When a visitor requests a quote from the shop" },
              ] as const
            ).map(({ key, label, desc }) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5">
                  <input
                    type="checkbox"
                    checked={settings[key]}
                    onChange={(e) => set(key, e.target.checked)}
                    className="w-4 h-4 accent-[#4A7C2F]"
                  />
                </div>
                <div>
                  <span className="text-sm text-gray-800">{label}</span>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">External System Links</h2>
            <p className="text-xs text-gray-400 mt-1">These URLs power the public buttons. Update them here without touching code.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Comply Cloud System URL</label>
            <input
              type="url"
              value={settings.comply_cloud_system_url}
              onChange={(e) => set("comply_cloud_system_url", e.target.value)}
              placeholder="https://complycloud.flowsheet.co.za/"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A7C2F] transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1.5">The "Access the System" button on the Comply Cloud page.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Virtual Training Register URL</label>
            <input
              type="url"
              value={settings.virtual_training_register_url}
              onChange={(e) => set("virtual_training_register_url", e.target.value)}
              placeholder="https://complycloud.flowsheet.co.za/public/checklists/view/173/23"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A7C2F] transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1.5">Default "Register" link for virtual training sessions (a session can override it).</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-Learning URL</label>
            <input
              type="url"
              value={settings.elearning_url}
              onChange={(e) => set("elearning_url", e.target.value)}
              placeholder="https://rfcacademy.co.za"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A7C2F] transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1.5">The "E-Learning" option on the training hub links here.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#4A7C2F] hover:bg-[#3d6827] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
