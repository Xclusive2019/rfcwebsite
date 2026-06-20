import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * Public, anon-readable site settings stored in `admin_settings`.
 * Only the keys exposed by the anon RLS policy are returned; admins edit
 * these from the Settings page. Fallbacks are used until the fetch resolves
 * (or if a key has not been seeded).
 */
export type PublicSettingKey =
  | "comply_cloud_system_url"
  | "virtual_training_register_url"
  | "elearning_url";

const fallbacks: Record<PublicSettingKey, string> = {
  comply_cloud_system_url: "https://complycloud.flowsheet.co.za/",
  virtual_training_register_url: "https://complycloud.flowsheet.co.za/public/checklists/view/173/23",
  elearning_url: "https://rfcacademy.co.za",
};

export function usePublicSettings() {
  const [settings, setSettings] = useState<Record<PublicSettingKey, string>>(fallbacks);

  useEffect(() => {
    supabase
      .from("admin_settings")
      .select("key, value")
      .then(({ data }) => {
        if (!data) return;
        const map = Object.fromEntries(
          (data as { key: string; value: string }[]).map((r) => [r.key, r.value])
        );
        setSettings((prev) => ({
          comply_cloud_system_url: map.comply_cloud_system_url || prev.comply_cloud_system_url,
          virtual_training_register_url: map.virtual_training_register_url || prev.virtual_training_register_url,
          elearning_url: map.elearning_url || prev.elearning_url,
        }));
      });
  }, []);

  return settings;
}
