"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { DEFAULT_CONFIG, fetchConfig, saveConfig } from "@/lib/store";
import type { SiteConfig } from "@/lib/types";

type SaveState = "idle" | "saving" | "saved" | "error";

type ConfigContextValue = {
  config: SiteConfig;
  ready: boolean;
  isDirty: boolean;
  saveState: SaveState;
  saveError: string | null;
  update: (mutate: (draft: SiteConfig) => void) => void;
  save: () => Promise<boolean>;
  reset: () => void;
};

const ConfigContext = createContext<ConfigContextValue | null>(null);

const clone = <T,>(value: T): T =>
  typeof structuredClone === "function"
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [ready, setReady] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const latest = useRef(config);

  useEffect(() => {
    latest.current = config;
  }, [config]);

  useEffect(() => {
    let cancelled = false;
    fetchConfig()
      .then((loaded) => {
        if (!cancelled) {
          setConfig(loaded);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Publish animation settings to CSS as a global duration multiplier.
  useEffect(() => {
    const scale = config.animation?.enabled
      ? Math.min(2, Math.max(0.5, config.animation.durationScale || 1))
      : 0.001;
    document.documentElement.style.setProperty("--dur", String(scale));
  }, [config.animation?.enabled, config.animation?.durationScale]);

  const update = useCallback((mutate: (draft: SiteConfig) => void) => {
    setConfig((prev) => {
      const draft = clone(prev);
      mutate(draft);
      return draft;
    });
    setIsDirty(true);
    setSaveState("idle");
  }, []);

  const save = useCallback(async () => {
    setSaveState("saving");
    setSaveError(null);
    try {
      await saveConfig(latest.current);
      setIsDirty(false);
      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 2200);
      return true;
    } catch (error) {
      setSaveState("error");
      setSaveError(error instanceof Error ? error.message : "Gagal menyimpan.");
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setConfig(clone(DEFAULT_CONFIG));
    setIsDirty(true);
  }, []);

  const value = useMemo<ConfigContextValue>(
    () => ({
      config,
      ready,
      isDirty,
      saveState,
      saveError,
      update,
      save,
      reset
    }),
    [config, ready, isDirty, saveState, saveError, update, save, reset]
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used inside ConfigProvider");
  return ctx;
}
