"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

export type Prefs = {
  /** "default" or a BackgroundPreset id. */
  backgroundId: string;
  /** Visitor-level animation switch (in addition to the admin setting). */
  animations: boolean;
};

const STORAGE_KEY = "ksf:prefs";

const DEFAULT_PREFS: Prefs = { backgroundId: "default", animations: true };

type PrefsContextValue = Prefs & {
  setBackground: (id: string) => void;
  setAnimations: (value: boolean) => void;
  reset: () => void;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: Prefs) => {
    setPrefs(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const setBackground = useCallback(
    (id: string) => persist({ ...prefs, backgroundId: id }),
    [persist, prefs]
  );
  const setAnimations = useCallback(
    (value: boolean) => persist({ ...prefs, animations: value }),
    [persist, prefs]
  );
  const reset = useCallback(() => persist(DEFAULT_PREFS), [persist]);

  const value = useMemo<PrefsContextValue>(
    () => ({ ...prefs, setBackground, setAnimations, reset }),
    [prefs, setBackground, setAnimations, reset]
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): PrefsContextValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside PrefsProvider");
  return ctx;
}

export { DEFAULT_PREFS };
