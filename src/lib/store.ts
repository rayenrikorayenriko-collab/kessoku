import { DEFAULT_CONFIG } from "./default-config";
import { getSupabase, isSupabaseConfigured, SUPABASE_BUCKET } from "./supabase";
import type {
  RegistrationPayload,
  RegistrationRecord,
  SiteConfig
} from "./types";

const CONFIG_KEY = "ksf:config";
const LOCAL_REGISTER_KEY = "ksf:registrations";

/* -------------------------------------------------------------------------- */
/* Config merge                                                               */
/* -------------------------------------------------------------------------- */

type Plain = Record<string, unknown>;

function isPlainObject(value: unknown): value is Plain {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

/** Deep-merges a stored partial config on top of the shipped defaults. */
export function mergeConfig(patch: unknown): SiteConfig {
  const deepMerge = (base: unknown, over: unknown): unknown => {
    if (isPlainObject(base) && isPlainObject(over)) {
      const out: Plain = { ...base };
      for (const key of Object.keys(over)) {
        out[key] = deepMerge((base as Plain)[key], (over as Plain)[key]);
      }
      return out;
    }
    if (over === undefined || over === null) return base;
    return over;
  };

  return deepMerge(DEFAULT_CONFIG, patch) as SiteConfig;
}

/* -------------------------------------------------------------------------- */
/* Config read / write                                                        */
/* -------------------------------------------------------------------------- */

export async function fetchConfig(): Promise<SiteConfig> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("site_config")
        .select("data")
        .eq("id", "main")
        .maybeSingle();
      if (!error && data?.data) return mergeConfig(data.data);
    } catch {
      /* fall through to local/default */
    }
  } else if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem(CONFIG_KEY);
    if (raw) {
      try {
        return mergeConfig(JSON.parse(raw));
      } catch {
        /* ignore malformed cache */
      }
    }
  }
  return mergeConfig(null);
}

export async function saveConfig(config: SiteConfig): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from("site_config")
      .upsert({ id: "main", data: config, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return;
  }
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    return;
  }
  throw new Error("Storage tidak tersedia.");
}

/* -------------------------------------------------------------------------- */
/* Auth                                                                       */
/* -------------------------------------------------------------------------- */

// Local fallback password, used only when Supabase is not configured.
const LOCAL_ADMIN_PASSWORD = "kessokuclan12354";

export async function signIn(email: string, password: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return;
  }
  if (password === LOCAL_ADMIN_PASSWORD) {
    window.localStorage.setItem("ksf:local-admin", "1");
    return;
  }
  throw new Error("Mode pratinjau lokal: gunakan password awal admin.");
}

export async function signOut(): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.auth.signOut();
    return;
  }
  window.localStorage.removeItem("ksf:local-admin");
}

export async function getSessionEmail(): Promise<string | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    return data.session?.user.email ?? null;
  }
  return window.localStorage.getItem("ksf:local-admin") === "1"
    ? "local-admin@preview"
    : null;
}

export async function updatePassword(newPassword: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Ganti password hanya tersedia saat Supabase aktif.");
  }
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

/* -------------------------------------------------------------------------- */
/* Registrations                                                              */
/* -------------------------------------------------------------------------- */

export async function submitRegistration(
  payload: RegistrationPayload
): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("registrations").insert(payload);
    if (error) throw new Error(error.message);
    return;
  }
  const raw = window.localStorage.getItem(LOCAL_REGISTER_KEY);
  const list: RegistrationRecord[] = raw ? JSON.parse(raw) : [];
  list.unshift({
    ...payload,
    id: `local-${Date.now()}`,
    created_at: new Date().toISOString()
  });
  window.localStorage.setItem(LOCAL_REGISTER_KEY, JSON.stringify(list));
}

export async function listRegistrations(): Promise<RegistrationRecord[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as RegistrationRecord[];
  }
  const raw = window.localStorage.getItem(LOCAL_REGISTER_KEY);
  return raw ? (JSON.parse(raw) as RegistrationRecord[]) : [];
}

export async function deleteRegistration(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("registrations").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const raw = window.localStorage.getItem(LOCAL_REGISTER_KEY);
  const list: RegistrationRecord[] = raw ? JSON.parse(raw) : [];
  window.localStorage.setItem(
    LOCAL_REGISTER_KEY,
    JSON.stringify(list.filter((item) => item.id !== id))
  );
}

/* -------------------------------------------------------------------------- */
/* Media upload                                                               */
/* -------------------------------------------------------------------------- */

export async function uploadMedia(file: File): Promise<string> {
  const supabase = getSupabase();
  if (supabase) {
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(path, file, { cacheControl: "31536000", upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }
  // Preview fallback: inline data URL so the UI keeps working without a backend.
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Gagal membaca berkas."));
    reader.readAsDataURL(file);
  });
}

export { isSupabaseConfigured, DEFAULT_CONFIG };
