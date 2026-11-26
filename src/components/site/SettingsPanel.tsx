"use client";

import { useEffect, useState } from "react";
import { useConfig } from "@/components/providers/ConfigProvider";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { Icon } from "@/components/ui/Icon";
import { useBodyLock } from "@/lib/hooks";
import type { BackgroundPreset } from "@/lib/types";

type Option = {
  id: string;
  label: string;
  type: string;
  color: string;
  preview: string;
};

export function SettingsPanel({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { config } = useConfig();
  const { backgroundId, setBackground, animations, setAnimations } = usePrefs();
  const [mounted, setMounted] = useState(false);

  useBodyLock(open);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => setMounted(true), 10);
      return () => window.clearTimeout(id);
    }
    setMounted(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const bg = config.background;
  const options: Option[] = [
    {
      id: "default",
      label: "Default (bawaan admin)",
      type: bg.type,
      color: bg.color,
      preview: bg.mobileUrl || bg.desktopUrl
    },
    ...(bg.presets ?? []).map((preset: BackgroundPreset) => ({
      id: preset.id,
      label: preset.label,
      type: preset.type,
      color: preset.color,
      preview: preset.mobileUrl || preset.desktopUrl
    }))
  ];

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Pengaturan tampilan">
      <div
        className="absolute inset-0 bg-ink/25 transition-opacity duration-300"
        style={{ opacity: mounted ? 1 : 0, backdropFilter: "blur(5px)" }}
        onClick={onClose}
      />
      <aside
        className="glass-strong absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-3xl p-5 transition-transform duration-500 sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:max-h-none sm:w-[390px] sm:rounded-none sm:rounded-l-3xl sm:p-6"
        style={{
          transform: mounted
            ? "translate3d(0,0,0)"
            : "translate3d(0,12px,0)",
          transitionTimingFunction: "var(--ease-smooth)"
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
              <Icon name="settings" size={17} />
            </span>
            <div>
              <p className="font-display text-[15px] font-semibold text-ink">
                Pengaturan Tampilan
              </p>
              <p className="text-[11.5px] text-ink-muted">
                Hanya berlaku di perangkat ini
              </p>
            </div>
          </div>
          <button type="button" className="icon-btn" aria-label="Tutup" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="mt-7">
          <p className="field-label">Latar Belakang</p>
          <div className="grid grid-cols-2 gap-3">
            {options.map((option) => {
              const isActive = option.id === backgroundId;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setBackground(option.id)}
                  className={`overflow-hidden rounded-2xl border p-2 text-left transition-all duration-300 ${
                    isActive
                      ? "border-accent bg-accent-tint"
                      : "border-line bg-white/70 hover:border-ink/20"
                  }`}
                >
                  <span
                    className="block h-16 w-full overflow-hidden rounded-xl border border-line bg-surface-muted"
                    style={{ backgroundColor: option.color }}
                  >
                    {option.type !== "plain" && option.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={option.preview}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </span>
                  <span className="mt-2 flex items-center justify-between gap-2 px-0.5">
                    <span className="truncate text-[12.5px] font-medium text-ink-soft">
                      {option.label}
                    </span>
                    {isActive ? (
                      <Icon name="check" size={15} className="shrink-0 text-accent" />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7">
          <p className="field-label">Animasi & Micro-interaction</p>
          <button
            type="button"
            onClick={() => setAnimations(!animations)}
            className="glass flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3.5"
            aria-pressed={animations}
          >
            <span className="text-left">
              <span className="block text-[14px] font-medium text-ink">
                Animasi aktif
              </span>
              <span className="block text-[12px] text-ink-muted">
                Matikan untuk perangkat yang lebih lambat
              </span>
            </span>
            <span
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
                animations ? "bg-accent" : "bg-line"
              }`}
            >
              <span
                className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-soft transition-all duration-300"
                style={{ left: animations ? "22px" : "2px" }}
              />
            </span>
          </button>
        </div>

        <a
          href="/admin"
          className="btn btn-outline mt-7 w-full"
        >
          <Icon name="lock" size={16} />
          Dashboard Admin
        </a>
      </aside>
    </div>
  );
}
